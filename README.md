# whodis.gg

**Find the League of Legends game where you played with someone.**

A tool to determine which game you played with a friend-request sender, when you don't remember who they are or which game it was.

## Problem Statement

When receiving friend requests in League of Legends, I don't remember which game I played with that person. I have ~15 friend requests and don't know whether they sent the request to flame me or to genuinely be friends. Manually searching each person on op.gg/u.gg and scrolling through hundreds of games is impractical.

## Solution

Input each player's full Riot ID (e.g., `Faker#NA1`) and select their API routing region. The tool finds all games where both players participated, displaying match details (date, result, champions, builds) and linking to op.gg/u.gg for full match analysis.

## Git Remote / Deployment Setup

Git remote configured: `origin` → `https://github.com/jonohribar/who-dis-gg.git`

To deploy to GitHub Pages:

1. Push to GitHub:
   ```bash
   git push -u origin main
   ```
2. In repository Settings → Pages, set source to `main` branch / `/ (root)`.
3. The backend (`backend/server.js`) needs a server host (e.g., Render / Railway / Fly.io) with `RIOT_API_KEY` set as an environment secret; the frontend (`frontend/config.js`) should point `BACKEND_URL` to that deployed URL.

## Deployment

- **Frontend:** static HTML + JS hosted on GitHub Pages (or any static host). Update `BACKEND_URL` in `frontend/config.js` after deploying the backend.
- **Backend:** Express server at `backend/server.js`. Start with `npm start`; requires `RIOT_API_KEY` env variable.

## How It Works

1. Enter two Riot IDs (format: `name#tagline`) + routing regions (americas/europe/asia/sea)
2. The tool queries the Riot Games API via local backend proxy
3. It finds the intersection of both players' match histories
4. It displays shared games with key details
5. Links to op.gg/u.gg for detailed match views

## Tech Stack

- **Frontend:** HTML5 + Vanilla JavaScript + Tailwind CSS (3.4.17)
- **Backend:** Node.js + Express + node-fetch (proxy)
- **Hosting:** GitHub Pages (frontend) + Render/Railway/Fly.io (backend)
- **API:** Riot Games Developer API (free tier)
- **Data:** JSON API responses

## Quick Start

1. Copy `frontend/config.example.js` to `frontend/config.js`
2. Set `BACKEND_URL` in `frontend/config.js` (default: `http://localhost:3001`)
3. Copy `config/.env.example` to `config/.env` and add your `RIOT_API_KEY`
4. Start backend: `npm start` (runs on port 3001)
4. Open `frontend/index.html` in a browser
5. Enter two Riot IDs and regions
6. Click "Find Shared Games"
7. Review the results

## Documentation

See `docs/` folder for:
- [001-README.md](docs/001-README.md) — Documentation index
- [002-architecture.md](docs/002-architecture.md) — System architecture
- [003-user-requirements.md](docs/003-user-requirements.md) — User requirements
- [004-project-plan.md](docs/004-project-plan.md) — Project plan
- [005-review.md](docs/005-review.md) — Review findings
- [006-research_status.md](docs/006-research_status.md) — Research status
- [007-phase-gates.md](docs/007-phase-gates.md) — Phase gates
- [008-hosting-recommendation.md](docs/008-hosting-recommendation.md) — Hosting recommendation
- [009-wireframes.md](docs/009-wireframes.md) — Wireframes
- [010-get-riot-api-key.md](docs/010-get-riot-api-key.md) — Riot API key setup
- [011-council-memo.md](docs/011-council-memo.md) — Council memo
- [research/](docs/research/) — Research documents

## API Setup

1. Visit [developer.riotgames.com](https://developer.riotgames.com/)
2. Register for a free API key
3. Add it to `config/.env` as `RIOT_API_KEY=your_key_here`
4. The backend proxy protects your key — it never reaches the browser

## License

Personal use only.