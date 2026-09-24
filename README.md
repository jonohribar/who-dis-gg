# whodis.gg

**Find the League of Legends game where you played with someone.**

A tool to determine which game you played with a friend-request sender, when you don't remember who they are or which game it was.

## Problem Statement

When receiving friend requests in League of Legends, I don't remember which game I played with that person. I have ~15 friend requests and don't know whether they sent the request to flame me or to genuinely be friends. Manually searching each person on op.gg/u.gg and scrolling through hundreds of games is impractical.

## Solution

Input your summoner name and a friend-request sender's summoner name. The tool finds all games where both players participated, displaying match details (date, result, champions, builds) and linking to op.gg/u.gg for full match analysis.

## Git Remote / Deployment Setup

This repo has no git remote configured yet. To deploy to GitHub Pages (or any host):

1. Create a repository on GitHub (e.g., `https://github.com/<your-user>/whodis.gg`).
2. Add the remote:
   ```bash
   git remote add origin https://github.com/<your-user>/whodis.gg.git
   git branch -M main
   git push -u origin main
   ```
3. To deploy to GitHub Pages, set the repository's Pages source to the `main` branch / `/ (root)` and provide the URL in `whodis_gg-urr`.
4. The backend (`backend/server.js`) needs a server host (e.g., Render / Railway / Fly.io) with `RIOT_API_KEY` set as an environment secret; the frontend (`frontend/config.js`) should point `BACKEND_URL` to that deployed URL.

## Deployment

- **Frontend:** static HTML + JS hosted on GitHub Pages (or any static host). Update `BACKEND_URL` in `frontend/config.js` after deploying the backend.
- **Backend:** Express server at `backend/server.js`. Start with `npm start`; requires `RIOT_API_KEY` env variable.

## How It Works

1. Enter two summoner names + regions
2. The tool queries the Riot Games API
3. It finds the intersection of both players' match histories
4. It displays shared games with key details
5. Links to op.gg/u.gg for detailed match views

## Tech Stack

- **Frontend:** HTML5 + Vanilla JavaScript + Tailwind CSS
- **Hosting:** GitHub Pages
- **API:** Riot Games Developer API (free tier)
- **Data:** JSON API responses

## Quick Start

1. Open `src/index.html` in a browser
2. Enter your summoner name and region
3. Enter the friend-request sender's summoner name and region
4. Click "Find Shared Games"
5. Review the results

## Documentation

See `docs/` folder for:
- [User Requirements](docs/user-requirements.md)
- [Project Plan](docs/project-plan.md)
- [Architecture](docs/architecture.md)
- [Research](docs/research/)

## API Setup

1. Visit [developer.riotgames.com](https://developer.riotgames.com/)
2. Register for a free API key
3. For production use, set up a backend proxy to protect your key

## License

Personal use only.
