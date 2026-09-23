# Project Plan — whodis.gg

## Phase 1: Research & Foundation (Weeks 1-2)

### Tasks
1. **Research existing stat aggregator sites**
   - Identify which sites offer "compare two players" or "find common games" features
   - Understand their data sources and APIs
   - Document pros/cons for each approach
   - Due: Week 1

2. **Research Riot Games API**
   - Map out available endpoints for player matchmaking data
   - Understand rate limits and authentication
   - Determine if Riot API alone can solve "find games between two players"
   - Due: Week 1

3. **Website building research**
   - Research simplest approach for non-webdev
   - Identify tech stack and learning resources needed
   - Determine hosting options
   - Due: Week 1

### Deliverables
- Research documents in `docs/research/`
- Architecture outline
- Tech stack recommendation

### Decisions Needed
- Will we use public-facing stat sites as data aggregators, or use Riot API directly?
- What programming language to use?
- Static site vs backend solution?

## Phase 2: MVP Development (Weeks 3-4)

### MVP Scope
- User interface: simple form with two username inputs
- Backend: API calls to gather data about shared games
- Display: list of shared games with key details (result, builds, date)
- Links to external stat sites for full match details

### Technical Architecture
- **Frontend**: Simple HTML/JS with Tailwind (or similar)
- **Backend**: Node.js or Python with Express
- **API Integration**: Direct calls to Riot API + optional stat site integration
- **Data Format**: JSON responses with game metadata

### Dependencies
- Node.js/npm or Python/pip
- External API libraries (axios, requests)
- CSS framework (Tailwind, Bootstrap, etc.)

## Phase 3: Feature Expansion (Weeks 5-6)

### User Profile & History
- Store user preferences (summoner name, region)
- Track friend request interactions over time
- Build interaction graph between users

### Advanced Features
- Support for multiple friend request senders
- Notifications for new friend requests with context
- Social graph visualization

## Phase 4: Production & Testing (Weeks 7-8)

### Testing
- Unit tests for API data processing
- Integration tests with real Riot API (use test API keys)
- Manual user testing

### Deployment
- Choose hosting (Netlify for static, Vercel/railway for backend)
- Domain registration
- SSL/HTTPS

### Documentation
- User guide
- API integration documentation (for future developers)
- Architecture decision log

## Risk Mitigation

### Technical Risks
- **Riot API changes** - Monitor API changes, have fallback to stat site APIs
- **Rate limiting** - Implement caching and proper request throttling
- **Authentication** - Secure API keys, environment variable management

### Project Risks
- **Timeline** - Break down tasks into smaller, deliverable chunks
- **Skills** - Plan learning path for web development
- **Scope creep** - Keep MVP minimal, defer non-essential features

## Milestone Schedule

| Milestone | Due | Status |
|-----------|-----|--------|
| Research complete | Week 2 | TBD |
| Tech stack decided | Week 2 | TBD |
| MVP UI/UX design | Week 3 | TBD |
| MVP functionality | Week 4 | TBD |
| User testing | Week 5 | TBD |
| Production release | Week 8 | TBD |

## Budget & Resources

### Time Investment
- Developer: 40 hours/week, 8 weeks total
- Research phase: 40 hours
- Development phase: 120 hours
- Testing/Deployment: 40 hours

### Financial Resources
- Riot API usage (paid tiers for high volume)
- Hosting costs (should be minimal for MVP)
- Domain name

## Exit Criteria

MVP is considered complete when:
- [ ] User can input two summoner names
- [ ] System returns all games where both players participated
- [ ] Results display match date, queue type, result, and key builds
- [ ] Links available to full match details on stat sites
- [ ] Basic testing completed (user can successfully use the tool)
- [ ] Code is committed to git with documentation

## Success Metrics

- User satisfaction > 80% (post-testing survey)
- Average time to find shared game < 2 minutes
- Zero critical bugs in user-facing functionality
- 100% test coverage for core functionality

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

1. Complete Phase 1 research (this document)
2. Fork subagents to gather detailed information
3. Decide on tech stack and architecture
4. Begin development of Phase 2

---

*Document created: Day 1*
*Status: In Progress*
*Next Review: Phase 1 completion*
