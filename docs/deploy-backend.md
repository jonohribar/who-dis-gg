# Deploy Backend — Literal Step-by-Step Instructions

This document gives you exact commands to deploy the whodis.gg backend. Follow each step in order. Do not skip steps.

## Pre-Check Checklist

1. Open a terminal.
2. Run `node --version`. Result must be 18 or higher.
3. Run `npm --version`. Result must be 9 or higher.
4. Have your Riot API key ready. It looks like `RGAPI-xxxx-xxxx-xxxx-xxxx`.
5. Make sure you have a GitHub account and the repo `https://github.com/jonohribar/who-dis-gg.git` is your remote.

If any check fails, fix it before you continue.

## Step 1 — Install Dependencies

Open a terminal in the project root folder `D:/DEV/whodis.gg`.

Run this command:

```bash
npm install
```

Wait for it to finish. You will see a message like `added 50 packages`.

## Step 2 — Set the Riot API Key (Environment Variable)

The backend reads the key from an environment variable named `RIOT_API_KEY`. Set it now.

### Linux / macOS / Git Bash / WSL

Run this command. Replace `YOUR_RIOT_API_KEY` with your real key.

```bash
export RIOT_API_KEY=YOUR_RIOT_API_KEY
```

To make it permanent, add the same line to your shell profile file (e.g., `~/.bashrc`, `~/.zshrc`).

### Windows PowerShell

Run this command. Replace `YOUR_RIOT_API_KEY` with your real key.

```powershell
$env:RIOT_API_KEY = "YOUR_RIOT_API_KEY"
```

To make it permanent, run this command:

```powershell
setx RIOT_API_KEY "YOUR_RIOT_API_KEY"
```

Close and reopen the terminal after `setx`.

## Step 3 — Start the Backend Locally (Test)

Run this command:

```bash
npm start
```

You will see:

```
whodis.gg backend listening on port 3001
Health check: http://localhost:3001/health
Riot API proxy: http://localhost:3001/api/riot/<region>/<endpoint>
```

Keep this terminal open. The backend is now running on port 3001.

## Step 4 — Verify Health Check

Open a new terminal. Run this command:

```bash
curl http://localhost:3001/health
```

Expected output:

```json
{"status":"ok","timestamp":"2025-...T...Z"}
```

If you see this, the backend works. If you see an error, check Step 2 and Step 3.

## Step 5 — Deploy Backend to a Cloud Host

You must host the backend on a public server so the frontend can reach it. Choose one provider.

### Option A — Render (Free Tier)

1. Go to `https://dashboard.render.com/`.
2. Click **New** → **Web Service**.
3. Connect your GitHub repo `jonohribar/who-dis-gg`.
4. Settings:
   - **Name**: `whodis-gg-backend` (or any name)
   - **Region**: choose closest to you
   - **Branch**: `master`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: leave blank (repo root)
5. Click **Advanced** → **Add Environment Variable**:
   - **Key**: `RIOT_API_KEY`
   - **Value**: paste your real Riot API key
   - **Key**: `PORT` (optional)
   - **Value**: `3001` (Render sets PORT automatically; this is optional)
   - **Key**: `FRONTEND_ORIGIN`
   - **Value**: `https://jonohribar.github.io` (your GitHub Pages URL)
6. Click **Create Web Service**.
7. Wait for deploy to finish. You will get a URL like `https://whodis-gg-backend.onrender.com`.

### Option B — Railway

1. Go to `https://railway.app/`.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select `jonohribar/who-dis-gg`.
4. In **Variables** tab, add:
   - `RIOT_API_KEY` = your real Riot API key
   - `FRONTEND_ORIGIN` = `https://jonohribar.github.io`
5. Railway auto-detects Node. It will run `npm start`.
6. When deploy finishes, go to **Settings** → **Domains** → copy the generated URL (e.g., `https://whodis-gg-backend.up.railway.app`).

### Option C — Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh` (Linux/macOS) or download from website (Windows).
2. Run `fly auth login`.
3. Run `fly launch` in the project root. Answer prompts:
   - **App name**: `whodis-gg-backend`
   - **Region**: choose one
   - **PostgreSQL**: No
   - **Deploy now**: No
4. Set secrets:
   ```bash
   fly secrets set RIOT_API_KEY=YOUR_RIOT_API_KEY
   fly secrets set FRONTEND_ORIGIN=https://jonohribar.github.io
   ```
5. Deploy:
   ```bash
   fly deploy
   ```
6. Get your URL: `https://whodis-gg-backend.fly.dev`.

## Step 6 — Get Your Deployed Backend URL

After deploy finishes, you have a public URL. Write it down. Example:

```
https://whodis-gg-backend.onrender.com
```

This is your **BACKEND_URL**.

## Step 7 — Update Frontend Config on gh-pages Branch

The frontend reads `BACKEND_URL` from `config.js`. The `config.js` file is gitignored on master, but the `gh-pages` branch has a tracked `config.js` at root.

You must update `config.js` on the `gh-pages` branch and push.

Run these exact commands:

```bash
# Switch to gh-pages branch
git checkout gh-pages

# Edit config.js — replace BACKEND_URL value
# Linux/macOS/Git Bash:
sed -i "s|BACKEND_URL: 'http://localhost:3001'|BACKEND_URL: 'https://YOUR_BACKEND_URL'|" config.js

# Windows PowerShell:
(Get-Content config.js) -replace "BACKEND_URL: 'http://localhost:3001'", "BACKEND_URL: 'https://YOUR_BACKEND_URL'" | Set-Content config.js

# Verify the change
grep BACKEND_URL config.js

# Commit and push
git add config.js
git commit -m "config: update BACKEND_URL to deployed backend"
git push origin gh-pages

# Return to master
git checkout master
```

Replace `https://YOUR_BACKEND_URL` with the URL from Step 6. Do not include a trailing slash.

## Step 8 — Verify Frontend Works

1. Wait 1–2 minutes for GitHub Pages to rebuild.
2. Open `https://jonohribar.github.io/who-dis-gg/` in a browser.
3. Enter two Riot IDs (format: `Name#Tagline`) and select regions.
4. Click **Search**.
5. You should see shared games. If you see "Search Failed", check:
   - Backend URL is correct in Step 7
   - Backend health check returns ok (Step 4 on deployed URL)
   - Riot API key is valid and not expired (keys expire ~24 hours after creation)

## Quick Reference — All Commands Together

```bash
# 1. Install
npm install

# 2. Set key (Linux/macOS)
export RIOT_API_KEY=YOUR_RIOT_API_KEY

# 3. Test locally
npm start

# 4. Verify (new terminal)
curl http://localhost:3001/health

# 5. Deploy to Render/Railway/Fly.io (use web UI or CLI)

# 6. Get deployed URL → https://YOUR_BACKEND_URL

# 7. Update gh-pages config
git checkout gh-pages
sed -i "s|BACKEND_URL: 'http://localhost:3001'|BACKEND_URL: 'https://YOUR_BACKEND_URL'|" config.js
git add config.js
git commit -m "config: update BACKEND_URL to deployed backend"
git push origin gh-pages
git checkout master
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `curl` not found on Windows | Use `Invoke-WebRequest http://localhost:3001/health` in PowerShell |
| Backend shows "Server configuration error" | `RIOT_API_KEY` not set on the host. Add it in host dashboard. |
| Frontend shows "Search Failed" | Check browser console (F12). Usually wrong BACKEND_URL or expired API key. |
| GitHub Pages not updating | Wait 2 minutes. Check Actions tab for build status. |
| API key expired | Generate new key at `https://developer.riotgames.com/`, update host env var. |

## Notes

- Never commit your real `RIOT_API_KEY` to git. Use environment variables only.
- The backend runs on port 3001 by default. Cloud hosts set `PORT` automatically; the code reads `process.env.PORT || 3001`.
- The `gh-pages` branch serves the frontend. The `master` branch holds source code.
- Riot API keys expire after ~24 hours. Regenerate when needed.