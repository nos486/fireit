import { Hono } from 'hono'
import { cors } from 'hono/cors'


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
    const userAgent = c.req.header('user-agent') || 'Unknown'

    // Log to D1 asynchronously (fire and forget)
    try {
        await c.env.DB.prepare(
            'INSERT INTO access_logs (ip, country, user_agent) VALUES (?, ?, ?)'
        ).bind(ip, country, userAgent).run()
    } catch (e) {
        console.error('Failed to log to D1:', e)
    }

    return c.json({
        ip,
        country,
        userAgent,
        headers: c.req.header(),
        asn: c.req.cf?.asn,
        asOrganization: c.req.cf?.asOrganization,
        colo: c.req.cf?.colo,
    })
})

export default app

