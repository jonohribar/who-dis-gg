# Wireframes — User Workflow

## 1. Input Form

```
┌─────────────────────────────────────────────────────┐
│  whodis.gg                                          │
│  Find the League game where you played with them    │
├─────────────────────────────────────────────────────┤
│  YOUR SUMMONER                                      │
│  Username: [________________________]              │
│  Tagline:  [________________________]  (e.g., NA1) │
│                                                       │
│  FRIEND REQUEST SENDER                                │
│  Username: [________________________]              │
│  Tagline:  [________________________]  (e.g., NA1) │
│                                                       │
│  REGION (optional — tagline usually suffices):       │
│  [NA1 ▼]                                           │
│                                                       │
│  [  Find Shared Games  ]                             │
└─────────────────────────────────────────────────────┘
```

> **Note:** The tagline IS the region identifier in Riot's system. NA1, EUW1, KR, etc. are both a tagline and a region. The region dropdown is optional/redundant if the user knows their tagline.

---

## 2. Loading State

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  🔍 Searching for shared matches...                 │
│                                                     │
│  Resolving: Faker#NA1 → PUUID                       │
│  Resolving: T1_Zeus#NA1 → PUUID                     │
│  Fetching matchlists...                              │
│  Finding overlapping games...                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. Results — Shared Games Found

```
┌─────────────────────────────────────────────────────┐
│  ✅ Found 2 shared games                              │
│                                                     │
│  ┌─ Game 1 ───────────────────────────────────┐    │
│  │ 2024-01-15  20:30 UTC                      │    │
│  │ Ranked Solo Queue  · 32 min                │    │
│  │ Result: WIN                                  │    │
│  │                                              │    │
│  │ You: Faker      · Ashe     · Win             │    │
│  │ Them: T1_Zeus   · Lee Sin  · Loss           │    │
│  │                                              │    │
│  │ [View on op.gg]  [View on u.gg]             │    │
│  └──────────────────────────────────────────────┘    │
│                                                     │
│  ┌─ Game 2 ───────────────────────────────────┐    │
│  │ 2024-01-14  18:00 UTC                      │    │
│  │ Ranked Duo Queue  · 28 min                 │    │
│  │ Result: LOSS                                 │    │
│  │                                              │    │
│  │ You: Faker      · Leona    · Loss            │    │
│  │ Them: T1_Zeus   · Thresh   · Win            │    │
│  │                                              │    │
│  │ [View on op.gg]  [View on u.gg]             │    │
│  └──────────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Results — No Shared Games

```
┌─────────────────────────────────────────────────────┐
│  ❌ No shared games found                             │
│                                                     │
│  Faker#NA1 and T1_Zeus#NA1 have no overlapping       │
│  match history in the last 100 matches.              │
│                                                     │
│  Possible explanations:                              │
│  • They haven't played together                      │
│  • Their match history is too old                    │
│  • One or both accounts are new                      │
│                                                     │
│  [Try different search]                              │
└─────────────────────────────────────────────────────┘
```

---

## 5. Match Detail View (links to op.gg/u.gg)

```
Game ID: _1234567890
Region:  NA1
Queue:   Ranked Solo (queueId=420)
Duration: 32:15
Created: 2024-01-15T20:30:00Z

Participants (10):
  Team Blue:
    Faker      · Ashe    · Win   · 12/3/8   · 25k gold
    T1_Zeus    · Lee Sin · Loss  · 5/10/4   · 14k gold
    ...
  Team Red:
    ...
```

---

## Key Design Decisions

1. **Tagline IS the region** — Riot uses `username#tagline` where tagline = region code (NA1, EUW1, KR, etc.)
2. **Region dropdown is optional/redundant** — the tagline already encodes the region
3. **All regions supported** — not just NA1/EUW1/KR
4. **No backend needed for MVP** — direct API calls from frontend (with CORS proxy)
5. **Results link out to op.gg/u.gg** — full match details are on those sites

---

## Required Input Fields

| Field | Required? | Example | Notes |
|-------|-----------|---------|-------|
| Player A Username | ✅ Yes | `Faker` | In-game display name |
| Player A Tagline | ✅ Yes | `NA1` | Riot ID tag = region |
| Player B Username | ✅ Yes | `T1_Zeus` | In-game display name |
| Player B Tagline | ✅ Yes | `NA1` | Riot ID tag = region |
| Region dropdown | ❌ No | `NA1` | Redundant if tagline provided |
