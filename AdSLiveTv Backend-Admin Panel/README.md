# AdSLiveTv Backend-Admin Panel

This is the decoupled **AdSLiveTv Backend-Admin Panel** web application and administrative folder. It serves as the single source of truth for administrative credentials configuration and high-pressure scoreboard state moderation.

## Architectural Separations

To ensure public safety of streaming parameters, the Admin Keys panel, API Handshaking testing suites, and Manual Goal Trigger actions have been removed completely from the public site surface.
Instead, administrative duties are handled entirely in this standalone panel.

## Features Included
1. **API Credentials Synchronizer**: Input, monitor, and commit key attributes (such as *API-Football*, *SportMonks*, *Mux Stream*, *Cloudflare*, *NewsAPI*, *Google Analytics*, and *Firebase Web App configs*).
2. **Scoreboard Modifier**: Manually trigger home/away goal scoring parameters, nominate dynamic players, designate assists, and instantly broadcast updates to public match screens.
3. **Database Health Meters & Realetime Logs**: View automated handshake telemetry checks, server load, and dynamic logs capturing real-time action handshakes.

## Running / Serving the Admin Panel
The central Express service automatically hosts this standalone folder on the `/admin-panel` route profile.
If you are running the platform, simply navigate to the path:
`http://localhost:3000/admin-panel` or your production app equivalent.

The panel connects to the following local proxy API endpoints:
- `GET /api/admin/config` - Fetches masked configurations.
- `POST /api/admin/config` - Persists dynamic token config parameters.
- `POST /api/admin/test-connection` - Runs validation diagnostics.
- `POST /api/matches/:id/goal` - Dispatches interactive score changes.
- `POST /api/matches/:id/reset` - Restores default match statistics.
