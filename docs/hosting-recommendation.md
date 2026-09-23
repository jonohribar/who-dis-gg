# Hosting Recommendation — whodis.gg

## Short Answer
**Start with GitHub Pages for the MVP, then migrate to Netlify when you need to hide your Riot API key or add serverless functionality.**

## Why This Approach

### Phase 1: MVP & Validation (GitHub Pages)
- **Simplicity:** Zero configuration beyond pushing to GitHub
- **Cost:** Free forever
- **Learning curve:** Minimal (you already know git)
- **Perfect for:** Testing the concept, validating user interest, iterating on UI/UX
- **Limitation:** API key visible in client-side JavaScript (acceptable for early testing with low usage)

### Phase 2: Production & Monetization (Netlify)
- **Serverless functions:** Hide your Riot API key behind a secure endpoint
- **Same Git workflow:** Push to repo → Netlify builds and deploys
- **Ad integration:** Easy to add AdSense/etc. via snippets
- **Custom domains:** Unlimited, free SSL
- **Analytics:** Built-in site analytics
- **Scalability:** Handles more traffic gracefully
- **Cost:** Free tier is generous; paid plans start at $19/month if needed

## Migration Path
1. **Start:** `github.com/yourname/whodis.gg` → GitHub Pages
2. **When needed:** Add a `netlify.toml` and serverless functions
3. **Switch:** Update DNS/netlify settings to point whodis.gg to Netlify
4. **Result:** Same codebase, more capabilities

## Detailed Comparison

| Feature | GitHub Pages | Netlify | Vercel |
|---------|-------------|---------|--------|
| **Initial Setup** | ★★★★★ (easiest) | ★★★★☆ | ★★★★☆ |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **HTTPS/SSL** | ✅ Automatic | ✅ Automatic | ✅ Automatic |
| **Ads (AdSense)** | ✅ Possible (client-side) | ✅ Easy (snippets) | ✅ Easy |
| **Hide API Key** | ❌ Not possible | ✅ Serverless functions | ✅ API routes |
| **Serverless** | ❌ No | ✅ Yes | ✅ Yes |
| **Form Handling** | ❌ Third-party only | ✅ Built-in | ✅ Built-in |
| **Analytics** | ❌ External only | ✅ Built-in | ✅ Built-in |
| **Preview Deploys** | ❌ No | ✅ Yes | ✅ Yes |
| **Bandwidth (Free)** | 100 GB/month | 100 GB/month | 100 GB/month |
| **Build Minutes** | N/A (static) | 300/month | 125k/month |
| **Learning Curve** | Lowest | Low | Low-Medium |
| **Best For** | MVP, simple sites | Production apps, ads | React/Next.js apps |

## Specific to This Project

### Current State (GitHub Pages is PERFECT)
- Simple HTML/JS/CSS prototype
- No backend needed for demo/validation
- Low expected usage during testing
- Primary goal: validate the concept works

### Future State (When to Migrate to Netlify)
1. **API Key Security:** When you want to hide your Riot API key (not expose it in JavaScript)
2. **Rate Limit Protection:** When you want to proxy requests through your own endpoint to hide/control the key
3. **Ad Optimization:** When you want to do A/B testing or server-side ad insertion
4. **Advanced Features:** If you add user accounts, history tracking, or notifications
5. **Traffic Growth:** If you consistently exceed 1k+ daily users

## Recommendation Timeline

**Now (Week 1-2):** 
- Use GitHub Pages
- Test the concept with friends/fellow players
- Keep the API key in config.js (acceptable for low-volume testing)
- Focus on validating the core utility

**When ready to go public (Week 3+):**
- Add a simple Netlify serverless function to proxy Riot API calls
- Move API key to Netlify environment variables (hidden)
- Deploy to Netlify, keep GitHub as backup
- Add basic analytics
- Consider ad placement (non-intrusive banner)

## Final Thought

Don't over-engineer the hosting. Start stupid simple (GitHub Pages), validate that people actually want this tool, then invest in better hosting/security/monetization once you have proof of concept. The migration path is straightforward and won't waste your early effort.

**Action:** Keep using GitHub Pages for now. Create a task to evaluate Netlify migration when you're ready to hide the API key or add serverless features.