# whodis.gg

**Find the League of Legends game where you played with someone.**

A tool to determine which game you played with a friend-request sender, when you don't remember who they are or which game it was.

## Problem Statement

When receiving friend requests in League of Legends, I don't remember which game I played with that person. I have ~15 friend requests and don't know whether they sent the request to flame me or to genuinely be friends. Manually searching each person on op.gg/u.gg and scrolling through hundreds of games is impractical.

## Solution

Input your summoner name and a friend-request sender's summoner name. The tool finds all games where both players participated, displaying match details (date, result, champions, builds) and linking to op.gg/u.gg for full match analysis.

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
