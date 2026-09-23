## Getting Your Riot API Key — Step by Step

### Step 1: Go to Developer Portal
- Open: **https://developer.riotgames.com/**
- Sign in with your Riot Games account (same account you play League with)

### Step 2: Create an Application
- Click **"Create Project"** or **"Dashboard"**
- Fill in:
  - **Project name:** `whodis.gg` (or whatever you want)
  - **Description:** Optional — something like "League shared game finder"
  - **App name:** `whodis-gg`
- Click **Create**

### Step 3: Get Your API Key
- After creating the project, go to **"Keys"** tab
- You'll see a **Development API Key** (starts with `RGAPI-...`)
- **Copy this key** — it's your key

### Step 4: Add It to the Project
Open this file: `frontend/config.js`

Find this line:
```javascript
API_KEY: 'YOUR_RIOT_API_KEY_HERE',
```

Replace `'YOUR_RIOT_API_KEY_HERE'` with your actual key:
```javascript
API_KEY: 'RGAPI-your-actual-key-here',
```

### Step 5: Test It
- Open `frontend/index.html` in your browser
- Enter two summoner names (e.g., "Faker" and any friend)
- Click "Find Shared Games"
- Check the browser console (F12 → Console) for any errors

---

## ⚠️ Important Notes

| Issue | What to Do |
|-------|-----------|
| **Development key expires every 24 hours** | You'll need to refresh it via the Developer Portal |
| **Rate limit: 20 requests/second** | Fine for testing; for production use a production key |
| **Production key** | Apply for one later when you go public — 500 req/10 seconds |
| **API Key in browser** | Visible to anyone viewing your page source |
| **Security risk** | For MVP/testing it's OK; for public use, move to Netlify serverless |

---

## Expected Flow After Adding Key

```
You enter: "Summoner1" + "Summoner2" + region
    ↓
App resolves Riot ID → PUUID (via account-v1)
    ↓
App fetches match lists for both players (via match-v5)
    ↓
App finds shared match IDs (intersection)
    ↓
App fetches match details for each shared game
    ↓
App displays: date, game mode, result, champions, builds
    ↓
Links to op.gg/u.gg for full match view
```

---

## Troubleshooting

**Problem:** "401 Unauthorized" error
- **Fix:** API key is wrong or expired. Check you copied the full key (starts with RGAPI-).

**Problem:** "404 Not Found"  
- **Fix:** Summoner name doesn't exist, or wrong region/region code.

**Problem:** "429 Too Many Requests"
- **Fix:** You've hit the rate limit. Wait a minute and retry.

**Problem:** "Network Error" or CORS error
- **Fix:** Riot API blocks browser requests from localhost. Need a backend proxy (for D&D phase).
