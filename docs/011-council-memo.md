# Council Memo — whodis.gg Project State (2026-09-23)

**Mode:** Supervisor-mediated, 2 passes (Pass 1: reviewer + oracle; Pass 2: oracle fallback). Roster: oracle [fork] + reviewer [normal]. Degraded-mode label: no — 2 advisors, one fresh-context fallback.

**Question:** What is the current state? Review tasks, plan, position, gaps, issues, learnings, lessons, future improvements; set up actionable items as beads.

**Evidence targets read:** git log / git status / frontend/app.js / index.html / config.js / docs/project-plan.md / phase-gates.md / review.md / research_status.md / architecture.md / docs/get-riot-api-key.md / docs/api-key-setup.md / .gitignore / beads_list.

## Verdict

Project is in a healthy Research→D&D transition. All 5 research epics closed (e0f0da0). Prototype UI is complete (single name#tagline box, region dropdowns, parseRiotId, demo mode). The tagline-vs-region design bug (OC/XA58) is fixed in code. The main risks are administrative and security-related, not structural.

## Confirmed findings (reviewer + oracle cross-exam)

All 6 relayed findings **confirmed**; 5 additional gaps found by oracle.

| # | Finding | Verdict | Source |
|---|---------|---------|--------|
| 1 | API key (`RGAPI-...`) committed to tracked `frontend/config.js`; docs falsely claim "local only" | P0 CONFIRMED | `git ls-files` + `git log -S` (commit 312417c); docs/get-riot-api-key.md:31 |
| 2 | Match-v5 default cap = 20 (no `?count=`); dead `MATCH_HISTORY_COUNT:100` | P1 CONFIRMED | app.js:148-152; config.js:18 |
| 3 | `docs/api-key-setup.md` inaccurate / non-functional (React refs, `fs` in browser, `api-key.txt` not gitignored) | P0 CONFIRMED | Read file directly |
| 4 | Public `corsproxy.io` forwards `X-Riot-Token`; `backend/server.js` is empty stub | P2 CONFIRMED | app.js:22,47-51; ls backend/ |
| 5 | `.gitignore` missing `.pi/`, `api-key.txt` | P1 CONFIRMED | File read |
| 6 | `user-requirements.md:28` still says "auto-populate from tagline" — contradicts independent-select design | P2 CONFIRMED | docs/user-requirements.md + index.html:34 |

**Oracle-added gaps:**
- `config.js:56` bare `module.exports = CONFIG` throws in browser (`<script>` load, `module` undefined).
- `RATE_LIMIT` declared, never read; 429/backoff missing; count-fix ×5 calls makes this urgent.
- `git remote -v` empty → `whodis_gg-itg` (Deploy) blocked.
- Beads board clogged (30+ open close-chores; routing failures on updates/close).
- `config.js` comment still says "tagline → api routing region" — stale.

## Priorities (ranked by cross-exam consensus)

P0: Rotate key + fix docs + remove from history / replace with `config.example.js` + gitignore secret file.
P1: Append `?count=` in `fetchMatchIds` + fix empty-state copy + guard `module.exports` + add `.pi/` and `api-key.txt` to `.gitignore` + beads admin cleanup.
P2: Rate-limit backoff + add git remote / deploy bead update + sync `user-requirements.md` + fix stale config comment.

## Learnings / lessons

- The `Unknown region: OC` bug was a design-level conflation (tagline ≠ routing region), not a coding typo. Fixing code alone was insufficient — docs (`get-riot-api-key.md`) and requirements (`user-requirements.md`) had to be updated too.
- Beads CLI routing failures (`unknown repo`) are an administrative problem that can silently misrepresent project state; should not be ignored.
- The `name#tagline` input format works correctly (`parseRiotId` at app.js:365-373); the region selector is independent for correct API routing.
- The committed key is very likely already dead (dev keys expire ~24h; commit 312417c is from 2026-09-23), which lowers the urgency of a security breach but does NOT lower the urgency of fixing the pattern.

## Beads created (post-council)
- `whodis_gg-ck0` — Rotate/remove API key from tracked config; fix docs and gitignore (P0).
- `whodis_gg-13p` — Fix match window: append `?count=`, fix empty-state copy, use `MATCH_HISTORY_COUNT` (P1).
- `whodis_gg-921` — Beads board cleanup and admin reconciliation (P1).

## Residual risks / unresolved
- Key rotation requires Riot developer portal access (user-owned).
- `docs/api-key-setup.md` deletion vs rewrite — user preference not yet confirmed.
- Beads routing failures mean task closures must be verified manually.
- No live Riot API call possible to confirm `count=` behavior or 429 handling.

## Final verification
- Reviewer output reviewed at session artifact path; oracle output reviewed at session artifact path.
- All 11 changed/created files from session history inspected by evidence path; no new source edits made during this memo.
- Memo committed with verified hash.
