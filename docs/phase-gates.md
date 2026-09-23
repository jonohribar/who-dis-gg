# Project Phase Structure — 6304-Style

Per user requirements: phases are **human-gated** with a review before moving to the next.

## Phase 1: RESEARCH (Current — open until user approves transition)

**Status:** CLOSED (tasks completed) / PHASE OPEN (awaiting human gate)

**Completed:**
- Located all 5 research tasks: existing stat sites (op.gg, u.gg, etc.), Riot API study, project organization, user requirements, website building
- All 5 tasks closed with verified git commit `e0f0da0`
- Documents created: docs/user-requirements.md, docs/research/existing-sites.md, docs/research/riot-api.md, docs/research/website-building.md, docs/project-plan.md, docs/architecture.md
- Research subagents completed: existing sites analysis, Riot API endpoints, website-building guide
- MVP prototype exists in frontend/ (research artifact — demonstrates intended output)

**Phase Gate Review:**
- All research tasks completed and committed
- User requirements documented
- Riot API capabilities verified (match-v5 supports intersection algorithm)
- Existing stat site capabilities mapped (none provide shared-games feature; hole confirmed)
- Project organization established (docs/, frontend/, backend/ scaffolded)

**Phase 1 Research Additions:**
- Wireframes completed: docs/wireframes.md (text-based flow diagrams)
- Exact Riot API endpoints: docs/research/riot-api-exact.md (17 regions, rate limits, sample JSON)
- Alternative APIs research: docs/research/alternative-apis.md (op.gg/u.gg have no public APIs)
- User identity requirements: docs/research/user-identity-requirements.md (username + tagline format)
- All research documents committed and verified

**Gate approval required from user to transition to D&D.**

---

## Phase 2: DESIGN & DEVELOPMENT (D&D)

**Status:** READY TO START — tasks created, phase open until gate passes

**Plan (pending):**
- Build frontend integration with Riot API
- Implement match intersection logic
- Deploy to GitHub Pages
- Add documentation / README

---

## Phase 3: PRODUCTION

Not yet started — deployment, beta, public access

---

## Phase 4: MANUFACTURING

Not yet started — long-term maintenance, scaling

---

## Human Gate Protocol

Before transitioning Research → D&D:
1. Confirm all research outputs verified
2. Confirm user requirements locked
3. Confirm technical approach selected (Riot API + simple frontend + GitHub Pages)
4. Confirm user approves gate (this document)

**Gate status:** PENDING — user must approve to open D&D as active phase.
