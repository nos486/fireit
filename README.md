# 🔥 FireIT — Network Intelligence Platform

> Advanced Network & Identity monitoring tool. Displays your IP address, ISP, geolocation, browser, OS, and live map — powered by Cloudflare Workers and D1.

---

## Project Structure

```
fireit/
├── frontend/   # Vue 3 + Vite + TailwindCSS (Cloudflare Pages)
└── backend/    # Cloudflare Worker + Hono + D1 (Cloudflare Workers)
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A Cloudflare account
- `wrangler` CLI: `npm install -g wrangler`

### Backend

```bash
cd backend
npm install
npx wrangler dev
```

The API will be available at `http://localhost:8787`.

### Frontend

```bash
cd frontend
npm install

# Create a local env file
echo "VITE_API_URL=http://localhost:8787" > .env.local

npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment

### 1. Deploy Backend (Cloudflare Worker)

**Step 1 — Authenticate Wrangler:**
```bash
npx wrangler login
```

**Step 2 — Create the D1 Database** *(skip if already done)*:
```bash
cd backend
npx wrangler d1 create network-monitor-db
```
Copy the `database_id` from the output and paste it into `backend/wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "network-monitor-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

**Step 3 — Apply the database schema:**
```bash
npx wrangler d1 execute network-monitor-db --remote --file=./schema.sql
```

**Step 4 — Deploy the Worker:**
```bash
npm run deploy
```

Your Worker URL will be: `https://fireit-backend.YOUR_SUBDOMAIN.workers.dev`

---

### 2. Deploy Frontend (Cloudflare Pages)

**Option A — Via Cloudflare Dashboard (Recommended)**

1. Go to **Cloudflare Dashboard → Workers & Pages → Create Application**.
2. Click **Connect to Git**.
3. Select your `fireit` repository.
4. Configure the build settings:
   | Setting | Value |
   |---|---|
   | Project Name | `fireit-frontend` |
   | Production Branch | `main` |
   | Framework Preset | `Vite` |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Build Output Directory | `dist` |
5. Add the following **Environment Variable**:
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://fireit-backend.YOUR_SUBDOMAIN.workers.dev` |
6. Click **Save and Deploy**.

**Option B — Via CLI**

```bash
cd frontend

# Set your production API URL
echo "VITE_API_URL=https://fireit-backend.YOUR_SUBDOMAIN.workers.dev" > .env.production

npm run build

npx wrangler pages deploy dist --project-name=fireit-frontend
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3, Vite, TailwindCSS v4, Leaflet |
| Backend | Cloudflare Workers, Hono, ua-parser-js |
| Database | Cloudflare D1 (SQLite) |
| Map Tiles | CartoDB Dark Matter (free) |

---

## API Reference

### `GET /api/ip`

Returns detailed network, identity, and client information for the caller.

**Response:**
```json
{
  "network": {
    "ip": "1.2.3.4",
    "isp": "Hetzner Online GmbH",
    "asn": "AS24940",
    "protocol": "HTTP/3"
  },
  "identity": {
    "country": "DE",
    "city": "Nuremberg",
    "region": "Bavaria",
    "metroCode": "N/A",
    "timezone": "Europe/Berlin",
    "latitude": "49.45421",
    "longitude": "11.07752",
    "colo": "FRA"
  },
  "client": {
    "os": "macOS 15.0",
    "browser": "Chrome 128",
    "engine": "Blink",
    "device": "Desktop",
    "userAgent": "Mozilla/5.0 ..."
  }
}
```

---

## License

MIT
