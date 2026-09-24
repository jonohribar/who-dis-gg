# Project Research Status — whodis.gg

## Summary

All research tasks have been created and are pending completion. The project is ready for the Design & Development phase.

## Completed Work

- **Research phase** — All 5 spikes closed (existing stat sites, Riot API, project org, requirements, architecture)
- **D&D phase** — Epic `whodis_gg-v13` open with 3 linked tasks (`whodis_gg-350`, `whodis_gg-fy9`, `whodis_gg-itg`)
- **Prototype** — `frontend/` contains a functional UI shell (demo mode only)
- **Documentation** — `docs/` includes user requirements, architecture, project plan, phase gates, and wireframes
- **Wireframes** — `wireframes.md` created with Mermaid diagrams for input form, results, and match detail views
- **User input requirements** — Defined in `user-requirements.md`: username + tagline + region for both players

## Open Research Tasks

| ID | Task | Status |
|----|------|---------|
| `whodis_gg-zhu` | Research exact Riot API endpoints (account-v1, match-v5) | open |
| `whodis_gg-dla` | Research Riot API regions (all 16+) and rate limits | open |
| `whodis_gg-rhg` | Research op.gg and u.gg APIs / scraping feasibility | open |
| `whodis_gg-hw3` | Research alternative stat sites (leagueofgraphs, porofessor, mobalytics) | open |
| `whodis_gg-1pr` | Create wireframes for user workflow | open |
| `whodis_gg-uug` | Define exact user input requirements (username + tagline + region) | open |

## Next Steps

1. **Complete research tasks** — Work on the five open issues to finalize the project scope and API specifications.
2. **Implement Riot API integration** — Once endpoints are known, add account lookup, match list, and match detail calls to `frontend/app.js`.
3. **Expand region support** — Add all 16+ Riot regions to the dropdown in `frontend/index.html`.
4. **Deploy** — Push changes to `master` and enable GitHub Pages deployment.

## Risks & Assumptions

- **Riot API rate limits** — Must be handled gracefully (throttling, exponential backoff).
- **Tagline + Region requirement** — Users must provide both username + tagline (arbitrary account label) and region (server code for API routing) for accurate lookups.
- **Alternative sites** — op.gg/u.gg may lack robust APIs; scraping is discouraged due to TOS.
- **All regions supported** — Some regions may have limited match history; the MVP should handle missing data gracefully.

## Files Modified

- `docs/user-requirements.md` — Clarified that Riot IDs require username + tagline
- `docs/wireframes.md` — Added Mermaid wireframes for user workflow
- `whodis.gg` issues created: `whodis_gg-zhu`, `whodis_gg-dla`, `whodis_gg-rhg`, `whodis_gg-hw3`, `whodis_gg-1pr`, `whodis_gg-uug`

## Blockers

- **Pending:** Completion of research tasks before D&D implementation can proceed
- **Pending:** Riot API endpoint details and region support list
- **Pending:** op.gg/u.gg API accessibility

## Reusable Learnings

- **Learning:** Riot API requires full Riot ID (username + tagline) for accurate lookups. Users often forget the tagline, causing 404 errors.
- **Learning:** The Riot API supports all 16+ Riot Games League of Legends regions; not all have equally rich match history.
- **Learning:** Official APIs (Riot) are preferred over unofficial sites (op.gg, u.gg) for reliability and TOS compliance.
- **Learning:** When researching APIs, start with the official developer portal before exploring community workarounds.
