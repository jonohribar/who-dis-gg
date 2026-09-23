## 🔧 How to Use the Search (After the Fix)

### ✅ The Bug Was
The app was treating your tagline (`OC`, `XA58`) as the API routing region. Those taglines are arbitrary Riot IDs, not server codes. I separated them:
- **Tagline** = the part after `#` in your Riot ID (e.g., `a weird thing` + `OC`)
- **Region** = the server you play on (e.g., `OC1` for Oceania, `NA1` for NA)

### 🧪 Test with Your Accounts
Open `frontend/index.html`. Fill exactly like this:

- **Player A (You):**
  - Riot ID: `a weird thing#OC`
  - Region: `OC1` (Oceania, since you're in Australia)

- **Player B (Friend):**
  - Riot ID: `alalebldossmzeu#XA58`
  - Region: `OC1` (if they also play in Oceania; change to `NA1`, `EUW1`, etc. if different)

Then click **Find Shared Games**.

### ⚠️ If You Get Errors
- **"Unknown region"** → You left the Region dropdown blank, or picked one not in config.
- **"401 Unauthorized"** → Your Riot key is wrong or expired (24h dev key).
- **CORS / network error** → Browser blocked Riot; the CORS proxy handles it, but if it fails try again after 30 sec.
- **No results** → You genuinely didn't play together, or one name/tagline/region is wrong.

### 🔑 Setting Up Your Riot API Key

1. **Get a key** at https://developer.riotgames.com/ (register/login → My Apps → New App → Personal API Key).
2. **Copy the key** (looks like `RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
3. **Create `frontend/api-key.txt`** with just the key (no quotes, no extra whitespace).
4. **The key is NOT committed to git** — `api-key.txt` is in `.gitignore`.
5. **For production**, use the backend proxy (see `backend/server.js` stub) or your hosting platform's environment variables.

### 💡 Important
- The **tagline is NOT your server code** — it's just your account label.
- The **region dropdown tells the API which server to ask**.
- Both players must be on the **same server** (same region) for shared games to exist.
- Dev keys expire in 24 hours; production keys have higher rate limits.

Check the console (F12 → Console) and tell me what error, if any, you get.