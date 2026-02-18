import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { UAParser } from 'ua-parser-js'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

// Helper: build the data object for the connecting client
function buildData(c: any) {
    const ip = c.req.header('cf-connecting-ip') || 'Unknown'
    const country = c.req.header('cf-ipcountry') || 'Unknown'
    const userAgentString = c.req.header('user-agent') || 'Unknown'
    const parser = new UAParser(userAgentString)
    const ua = parser.getResult()
    const cf = (c.req.raw as any).cf || {}

    // Collect interesting request headers
    const headerNames = [
        'accept-language', 'accept-encoding', 'accept',
        'dnt', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform',
        'sec-fetch-dest', 'sec-fetch-mode', 'sec-fetch-site',
        'upgrade-insecure-requests', 'cache-control', 'pragma',
        'connection', 'x-forwarded-for', 'x-real-ip'
    ]
    const headers: Record<string, string> = {}
    for (const name of headerNames) {
        const val = c.req.header(name)
        if (val) headers[name] = val
    }

    return {
        ip,
        userAgentString,
        country,
        network: {
            ip,
            isp: cf.asOrganization || 'Unknown ISP',
            asn: cf.asn || 'Unknown ASN',
            protocol: cf.httpProtocol || 'HTTP',
        },
        identity: {
            country: cf.country || country,
            city: cf.city || 'Unknown City',
            region: cf.region || 'Unknown Region',
            metroCode: cf.metroCode || 'N/A',
            timezone: cf.timezone || 'UTC',
            latitude: cf.latitude,
            longitude: cf.longitude,
            colo: cf.colo,
        },
        client: {
            os: `${ua.os.name || 'Unknown'} ${ua.os.version || ''}`.trim(),
            browser: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim(),
            engine: ua.engine.name || 'Unknown',
            device: ua.device.type || 'Desktop',
            userAgent: userAgentString,
        },
        headers,
    }
}

// Helper: build pretty plain-text output
function buildPlainText(d: ReturnType<typeof buildData>): string {
    const line = (label: string, value: any) =>
        `  ${label.padEnd(18)} ${value ?? '—'}\n`

    return [
        `\n🔥 FireIT — Network Intelligence\n`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`,
        `\n  NETWORK\n`,
        line('IP Address', d.network.ip),
        line('ISP / Org', d.network.isp),
        line('ASN', d.network.asn),
        line('Protocol', d.network.protocol),
        `\n  LOCATION\n`,
        line('Country', d.identity.country),
        line('City', d.identity.city),
        line('Region', d.identity.region),
        line('Timezone', d.identity.timezone),
        line('Latitude', d.identity.latitude),
        line('Longitude', d.identity.longitude),
        line('Edge Node', d.identity.colo),
        `\n  CLIENT\n`,
        line('OS', d.client.os),
        line('Browser', d.client.browser),
        line('Engine', d.client.engine),
        line('Device', d.client.device),
        `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`,
        `  Tip: curl https://fireit.pages.dev/api/ip | jq\n\n`,
    ].join('')
}

app.get('/', (c) => {
    return c.text('🔥 FireIT API — try: curl https://fireit.pages.dev/api/ip')
})

// Ping endpoint for latency measurement
app.get('/api/ping', (c) => {
    return c.json({ pong: true, timestamp: Date.now() })
})

// IP Lookup endpoint — look up any IP using ip-api.com (free, no key)
app.get('/api/lookup', async (c) => {
    const ip = c.req.query('ip')
    if (!ip) {
        return c.json({ error: 'Missing ?ip= parameter' }, 400)
    }
    // Basic validation
    if (!/^[\d.:a-fA-F]+$/.test(ip)) {
        return c.json({ error: 'Invalid IP address' }, 400)
    }

    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,query`)
        const data = await res.json() as any
        if (data.status === 'fail') {
            return c.json({ error: data.message || 'Lookup failed' }, 404)
        }
        return c.json({
            ip: data.query,
            country: data.country,
            countryCode: data.countryCode,
            region: data.regionName,
            city: data.city,
            zip: data.zip,
            latitude: data.lat,
            longitude: data.lon,
            timezone: data.timezone,
            isp: data.isp,
            org: data.org,
            as: data.as,
            asName: data.asname,
        })
    } catch (e) {
        return c.json({ error: 'Lookup service unavailable' }, 500)
    }
})

// JSON endpoint — also auto-detects curl and returns plain text
app.get('/api/ip', async (c) => {
    const d = buildData(c)

    // Log to D1
    try {
        await c.env.DB.prepare(
            'INSERT INTO access_logs (ip, country, user_agent) VALUES (?, ?, ?)'
        ).bind(d.ip, d.country, d.userAgentString).run()
    } catch (e) {
        console.error('Failed to log to D1:', e)
    }

    // If request comes from curl/wget/httpie → return pretty plain text
    const ua = c.req.header('user-agent') || ''
    if (/^(curl|wget|httpie|HTTPie|python-requests)/i.test(ua)) {
        return c.text(buildPlainText(d))
    }

    return c.json({
        network: d.network,
        identity: d.identity,
        client: d.client,
        headers: d.headers,
    })
})

// Explicit plain-text endpoint (always returns text)
app.get('/api/ip.txt', async (c) => {
    const d = buildData(c)
    return c.text(buildPlainText(d))
})

// JSON-only endpoint (always returns JSON, useful for scripts)
app.get('/api/ip.json', async (c) => {
    const d = buildData(c)
    return c.json({
        network: d.network,
        identity: d.identity,
        client: d.client,
        headers: d.headers,
    })
})

export default app
