## Phase 2: MVP Development (NEXT)

### MVP Scope
- User interface: simple form with two username inputs + region selector
- Backend: API calls to Riot API (or direct browser calls for MVP)
- Display: list of shared games with key details
- Links to op.gg for full match details

### Technical Architecture
- **Frontend**: HTML + Vanilla JavaScript + Tailwind CSS (CDN)
- **API Integration**: Direct calls to Riot API
- **Data Processing**: Matchlist intersection algorithm
- **Hosting**: GitHub Pages (static)
- **API Key**: Free Riot API key (developer.riotgames.com)

### Dependencies
- Riot API key (free tier)
- Node.js/npm (for development server)
- CSS framework (Tailwind via CDN)

## Phase 3: Design & Development (D&D) Phase (CURRENT)

### D&D Phase Epic
- **Epic ID**: whodis_gg-v13
- **Priority**: P1
- **Status**: open
- **Description**: Build MVP prototype, implement core functionality (Riot API integration, match intersection), testing, and deployment

### Tasks in D&D Phase
1. **Implement MVP prototype with Riot API** (whodis_gg-qym) - Connect frontend to Riot API, replace demo mode with real data
2. **Register Riot API key** (whodis_gg-kzg) - Get API key from developer.riotgames.com
3. **Implement match intersection logic** (whodis_gg-wkg) - Find overlapping matches between two players
4. **Deploy MVP to GitHub Pages** (whodis_gg-0ao) - Host the static site
5. **Add Getting Started Guide** (whodis_gg-39a) - Documentation for setup and usage

### MVP Scope (Expanded)
- User interface: form with two username inputs + region selector
- Backend: API calls to Riot API
- Display: list of shared games with key details (date, result, builds)
- Links to op.gg for full match details

### Technical Architecture (D&D)
- **Frontend**: HTML + Vanilla JavaScript + Tailwind CSS (CDN)
- **API Integration**: Direct calls to Riot API
- **Data Processing**: Matchlist intersection algorithm
- **Hosting**: GitHub Pages (static)
- **API Key**: Free Riot API key (developer.riotgames.com)

### Dependencies
- Riot API key (free tier)
- Node.js/npm (for development server)
- CSS framework (Tailwind via CDN)

## Exit Criteria (MVP Complete)
- [ ] User can input two summoner names
- [ ] System returns all games where both players participated
- [ ] Results display match date, queue type, result, and key builds
- [ ] Links available to full match details on op.gg
- [ ] Basic testing completed (user can successfully use the tool)
- [ ] Code is committed to git with documentation

## Risk Mitigation (D&D Phase)

### Technical Risks
- **Riot API changes**: Monitor API changes, have fallback plan
- **Rate limiting**: Implement caching, proper request throttling
- **Authentication**: Secure API keys, environment variable management

### Project Risks
- **Timeline**: Break down tasks into smaller chunks
- **Skills**: Plan learning path for web development
- **Scope creep**: Keep MVP minimal, defer non-essential features

## Rollback Plan (D&D Phase)

If any phase fails:
- Revert to completed earlier phase
- Document lessons learned
- Adjust timeline based on actual progress
- Consider alternative approaches based on research findings

## Communication Plan (D&D Phase)

- **Weekly status meetings**: Review progress and blockers
- **Daily standups**: Quick status updates and priorities
- **Documentation**: Update `docs/` consistently
- **Git commits**: Document changes in commit messages
- **Beads updates**: Track progress on all tasks

## Phase 1 Additions (2026-09-23)

Per user request to expand research phase:

- **Exact Riot API endpoints** (`whodis_gg-zhu`/`whodis_gg-7ar`/`whodis_gg-dla`): Documented full API spec for account-v1, match-v5, regions, rate limits, errors → docs/research/riot-api-exact.md
- **Alternative APIs** (`whodis_gg-rhg`/`whodis_gg-cns`/`whodis_gg-hw3`/`whodis_gg-axz`/`whodis_gg-3u4`/`whodis_gg-1uu`): Researched op.gg/u.gg/other sites APIs → docs/research/alternative-apis.md
- **User identity requirements** (`whodis_gg-9kp`/`whodis_gg-8tl`/`whodis_gg-uug`): Riot ID = username#tagline, all 17 regions → docs/research/user-identity-requirements.md
- **Wireframes** (`whodis_gg-0ia`/`whodis_gg-1pr`/`whodis_gg-7mh`): Text-based wireframes → docs/wireframes.md
- **User requirements updated**: Tagline input, all regions (not just 3 select) → docs/user-requirements.md

## Task Corrections (Post-Review)

Per individual task review (whodis_gg-5fy):

- **whodis_gg-qym** (duplicate of whodis_gg-350): To be closed. Superseded by whodis_gg-350.
- **whodis_gg-350** (Implement MVP with Riot API Integration): Correct D&D feature task. Awaiting phase gate sign-off.
- **whodis_gg-fy9** (Set Up Riot API Key): D&D task. Awaiting start.
- **whodis_gg-itg** (Deploy MVP to GitHub Pages): D&D task. Awaiting start.
- **whodis_gg-54z** (Verify close reasons on 5 research tasks): D&D chore. Ensure commit hashes present in close reasons.
- **whodis_gg-y7y** (Close duplicate whodis_gg-qym): D&D chore.
- **whodis_gg-tjz** (Close project/repo review whodis_gg-5fy): D&D chore.

## New D&D Tasks (from expanded research)

- **whodis_gg-7ar** — Research exact Riot API endpoints and regions (spike, open)
- **whodis_gg-axz** — Research op.gg and u.gg APIs (spike, open)
- **whodis_gg-1uu** — Research alternative stat sites and APIs (spike, open)
- **whodis_gg-7mh** — Create user workflow wireframes (spike, open)
- **whodis_gg-8tl** — Define exact user input requirements (spike, open)

## Next Steps

1. ✅ Phase 1 research complete (all 5 original spikes + epic closed + 5 new spikes)
2. ✅ Project folder structure organized
3. ⏳ Phase gate pending user approval (docs/phase-gates.md)
4. ⏸️ D&D phase tasks created but awaiting phase gate sign-off
5. ⏸️ Register for Riot API key
6. ⏸️ Build MVP prototype with tagline input (D&D)
7. ⏸️ Deploy to GitHub Pages