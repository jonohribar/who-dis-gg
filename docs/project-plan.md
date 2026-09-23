# Project Plan — whodis.gg

## Phase 1: Research & Planning (COMPLETE)

### Completed Research
- [x] Research existing stat aggregator sites (docs/research/existing-sites.md)
- [x] Research Riot Games API (docs/research/riot-api.md)
- [x] Research website building approach (docs/research/website-building.md)
- [x] Define user requirements (docs/user-requirements.md)

### Key Findings from Research

**Existing Sites (op.gg, u.gg, leagueofgraphs, mobalytics):**
- All derive data from the official Riot Games API
- None provide automated "shared games" / match history intersection feature
- OP.GG Multi-Search: parallel comparison only, not intersection detection
- U.GG, Mobalytics: profile comparison features but no shared-game detection

**Riot Games API:**
- Official API provides: Summoner V4, Match V5, Matchlist V5
- Authentication: API key (free tier available)
- Rate limits apply but manageable for MVP
- Core question answered: Yes, can programmatically find shared games by intersecting matchlists

**Website Building (for non-webdev):**
- Recommended: Static HTML + JavaScript + Tailwind CSS
- Hosting: GitHub Pages (free) or Netlify (free tier)
- Backend option: Node.js + Express if server-side processing needed
- For MVP: Static site calling Riot API directly from browser possible

### Decisions Made
1. **Data source**: Riot API primary (direct, free tier sufficient for MVP)
2. **Tech stack**: Static HTML/JS + Tailwind CSS (simplest path)
3. **Hosting**: GitHub Pages (free, simple)
4. **Scope**: MVP = find shared games between two summoners + display match details + link to op.gg
5. **Phase 1**: Research only (completed)
6. **Phase 2**: MVP development

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

## Phase 3: Feature Expansion (Future)
- Multiple friend request senders
- Interaction timeline
- Social graph visualization
- Notifications for new friend requests with context

## Milestone Schedule

| Milestone | Due | Status |
|-----------|-----|--------|
| Research complete | Week 1 | ✅ DONE |
| Tech stack decided | Week 1 | ✅ DONE |
| MVP UI/UX design | Week 2 | ⬜ TODO |
| MVP functionality | Week 3 | ⬜ TODO |
| User testing | Week 4 | ⬜ TODO |
| Production release | Week 5 | ⬜ TODO |

## Exit Criteria (MVP Complete)
- [ ] User can input two summoner names
- [ ] System returns all games where both players participated
- [ ] Results display match date, queue type, result, and key builds
- [ ] Links available to full match details on op.gg
- [ ] Basic testing completed (user can successfully use the tool)
- [ ] Code is committed to git with documentation

## Risk Mitigation

### Technical Risks
- **Riot API changes**: Monitor API changes, have fallback plan
- **Rate limiting**: Implement caching, proper request throttling
- **Authentication**: Secure API keys, environment variable management

### Project Risks
- **Timeline**: Break down tasks into smaller chunks
- **Skills**: Plan learning path for web development
- **Scope creep**: Keep MVP minimal, defer non-essential features

## Rollback Plan

If any phase fails:
- Revert to completed earlier phase
- Document lessons learned
- Adjust timeline based on actual progress
- Consider alternative approaches based on research findings

## Communication Plan

- **Weekly status meetings**: Review progress and blockers
- **Daily standups**: Quick status updates and priorities
- **Documentation**: Update `docs/` consistently
- **Git commits**: Document changes in commit messages
- **Beads updates**: Track progress on all tasks

## Next Steps

1. ✅ Phase 1 research complete
2. ✅ Project folder structure organized
3. Register for Riot API key
4. Build MVP prototype (Phase 2)
5. Deploy to GitHub Pages

---
*Document created: Day 1*
*Status: Phase 1 COMPLETE — Phase 2 NEXT*
*Last Updated: After research phase + structure organization*
