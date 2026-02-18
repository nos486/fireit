import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { UAParser } from 'ua-parser-js'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

app.get('/', (c) => {
    return c.text('Network Monitor API is running!')
})

app.get('/api/ip', async (c) => {
    const ip = c.req.header('cf-connecting-ip') || 'Unknown'
    const country = c.req.header('cf-ipcountry') || 'Unknown'
    const userAgentString = c.req.header('user-agent') || 'Unknown'

    // Parse User Agent
    const parser = new UAParser(userAgentString)
    const uaResult = parser.getResult()

    // Log to D1 asynchronously (fire and forget)
    try {
        await c.env.DB.prepare(
            'INSERT INTO access_logs (ip, country, user_agent) VALUES (?, ?, ?)'
        ).bind(ip, country, userAgentString).run()
    } catch (e) {
        console.error('Failed to log to D1:', e)
    }

    // Construct detailed response based on Cloudflare headers and UA parsing
    return c.json({
        network: {
            ip,
            isp: (c.req.raw as any).cf?.asOrganization || 'Unknown ISP', // CF exposes AS Organization often used as ISP proxy
            asn: (c.req.raw as any).cf?.asn || 'Unknown ASN',
            protocol: (c.req.raw as any).cf?.httpProtocol || 'HTTP', // Requires compatibility flag or might be inferred
        },
        identity: {
            country: (c.req.raw as any).cf?.country || country,
            city: (c.req.raw as any).cf?.city || 'Unknown City',
            region: (c.req.raw as any).cf?.region || 'Unknown Region',
            metroCode: (c.req.raw as any).cf?.metroCode || 'N/A',
            timezone: (c.req.raw as any).cf?.timezone || 'UTC',
            latitude: (c.req.raw as any).cf?.latitude,
            longitude: (c.req.raw as any).cf?.longitude,
            colo: (c.req.raw as any).cf?.colo, // Edge Node
        },
        client: {
            os: `${uaResult.os.name || 'Unknown'} ${uaResult.os.version || ''}`.trim(),
            browser: `${uaResult.browser.name || 'Unknown'} ${uaResult.browser.version || ''}`.trim(),
            engine: `${uaResult.engine.name || 'Unknown'}`,
            device: uaResult.device.type || 'Desktop',
            userAgent: userAgentString
        }
    })
})

export default app
