# Website Building Research (For Non-Web Developers)

## Overview

Research into the simplest ways to build a website for this project, aimed at an embedded software developer with no web development experience.

## Options

### 1. Static HTML/JavaScript (Simplest)
- **Description:** A single HTML file with embedded JavaScript that fetches data from Riot API
- **Pros:** No backend needed; no server required; can be hosted for free
- **Cons:** API key exposed in browser; CORS issues; limited interactivity
- **Hosting:** GitHub Pages (free), Netlify (free), Vercel (free)
- **Best for:** Prototype, personal use

### 2. Simple Backend + Frontend
- **Description:** Node.js/Express backend that calls Riot API; simple HTML/JS frontend
- **Pros:** API key hidden; no CORS issues; more flexible
- **Cons:** Requires running a server; more complex
- **Hosting:** Render (free tier), Railway (free tier), VPS
- **Best for:** Full-featured tool

### 3. Framework-Based (React/Vue/Next.js)
- **Description:** Use a modern frontend framework with a backend
- **Pros:** Best UX; scalable; large community
- **Cons:** Steeper learning curve; more overhead
- **Hosting:** Vercel, Netlify, AWS
- **Best for:** Long-term project with many features

### 4. No-Code/Low-Code
- **Description:** Use tools like Bubble, Glide, or Softr
- **Pros:** No coding required; fast
- **Cons:** Limited customization; may not fit the use case
- **Best for:** Quick prototype without code

## Recommended Approach

**Start with Option 1 (Static HTML/JS)** for the MVP:
1. Single HTML file with JavaScript
2. Call Riot API directly from browser (CORS proxy may be needed)
3. Display results on the page
4. Host on GitHub Pages for free

**Why:** Simplest possible architecture, no backend needed, free hosting, and you can iterate quickly.

## Learning Resources

1. **MDN Web Docs** (https://developer.mozilla.org/) — The definitive web dev reference
2. **JavaScript.info** (https://javascript.info/) — Modern JavaScript tutorial
3. **GitHub Pages** (https://pages.github.com/) — Free hosting for static sites
4. **Riot API Documentation** (https://developer.riotgames.com/) — API reference

## Architecture for MVP

```
User enters two usernames
    ↓
JavaScript fetches PUUIDs from Riot API (account-v1)
    ↓
JavaScript fetches match lists for both players (match-v5)
    ↓
JavaScript finds overlapping match IDs
    ↓
JavaScript fetches match details for each shared game
    ↓
JavaScript displays shared games with results and builds
    ↓
Links to op.gg/u.gg for detailed views
```

## MVP Scope

The MVP should:
1. Take two usernames + region as input
2. Call Riot API to find shared games
3. Display a list of shared games with:
   - Game mode and date
   - Win/loss result
   - Champion picks
   - Links to op.gg/u.gg for detailed view

## Recommended Tech Stack (Simple)

- **Frontend:** Plain HTML + JavaScript (no framework)
- **Backend:** None (call Riot API directly)
- **Hosting:** GitHub Pages
- **API:** Riot Developer API (personal key)

## Next Steps

1. Create a GitHub account
2. Create a repository for the project
3. Write a simple HTML page with JavaScript
4. Register for a Riot API key
5. Test the API calls
6. Deploy to GitHub Pages

## Estimated Effort

- Learning basics: 1-2 days
- Building MVP: 1 week
- Deploying: 1 day
