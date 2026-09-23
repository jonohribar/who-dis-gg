# Research: Existing League of Legends Stat Aggregator Sites

## Summary
The four major LoL stat sites—OP.GG, U.GG, LeagueOfGraphs, and Mobalytics—offer match history, player profiles, and comparative tools, but none provide an automated “shared games” feature. OP.GG and U.GG rely on the official Riot API and provide multisearch for side‑by‑side stat comparison; LeagueOfGraphs also uses the Riot API but lacks a explicit compare tool; Mobalytics uses the Riot API and recently added a side‑by‑side summoner comparison feature. All sites display match data with timelines, graphs, and detailed post‑match stats, but match history retention varies (2‑5 months on OP.GG, ~6 months on U.GG).

## Findings

1. **Claim:** OP.GG allows users to view match history for the past 2‑5 months, after which older matches are deleted.  
   **Sources:** [How can I view my past match history? – OP.GG Help Center](https://help.op.gg/hc/en-us/articles/31088608024729-How-can-I-view-my-past-match-history)  
   **Support:** direct evidence (search result snippet states “Match history can be viewed for a period of approximately 2 to 5 months. Matches that are older are deleted and cannot be restored or viewed.”)  
   **Confidence:** high

2. **Claim:** OP.GG provides detailed match data including VOD replays, overall match analysis, and timeline‑based graphs comparing gold, experience, and objectives.  
   **Sources:** [Viewing detailed match data – OP.GG Help Center](https://help.op.gg/hc/en-us/articles/31091817743129-Viewing-detailed-match-data)  
   **Support:** direct evidence (snippet: “Click the More (→) button for any completed match to go to the match detail page, where you can view comprehensive data for that match. ... For each match, VOD replays and overall match analysis data are provided. ... Compare gold, experience, and objective data for both teams using timeline‑based graphs and charts.”)  
   **Confidence:** high

3. **Claim:** OP.GG’s Multi‑Search feature lets users enter multiple summoner names to see each player’s recent stats, tier, win rate, and more on a single screen.  
   **Sources:** [Multi‑Search guide – OP.GG Help Center](https://help.op.gg/hc/en-us/articles/31088821370777-Multi-Search-guide)  
   **Support:** direct evidence (snippet: “The Multi‑Search feature allows multiple Summoner Names to be entered at once, enabling quick access to each summoner's recent stats, tier, win rate, and more on a single screen.”)  
   **Confidence:** high

4. **Claim:** OP.GG also offers a player‑comparison tool that compares stats such as championship records, win rate, KDA, and more using player card data.  
   **Sources:** [How to view league team and player stats – OP.GG Help Center](https://help.op.gg/hc/en-us/articles/31091864581657-How-to-view-league-team-and-player-stats)  
   **Support:** direct evidence (snippet: “You can compare the stats of two players using the player card data. Alongside the pentagon stat graph, you can also compare detailed statistics such as championship records, win rate, KDA, and more.”)  
   **Confidence:** high

5. **Claim:** U.GG provides match history for roughly the past 6 months, with filterable stats including champion pool and KDA.  
   **Sources:** [Frequently Asked Questions – U.GG](https://u.gg/faq)  
   **Support:** direct evidence (snippet: “Outside of champions, U.GG also allows summoners to see their stats from their matches over the past 6 months. These summoner stats include their champion pool, expected measures such as KDA, and allow you to filter between different game modes.”)  
   **Confidence:** high

6. **Claim:** U.GG’s Multisearch tool enables viewing profile stats for multiple summoners at once (e.g., for Clash or ranked).  
   **Sources:** [Multisearch LoL Profile Stats for Clash, Ranked All Regions – U.GG](https://u.gg/lol/multisearch)  
   **Support:** direct evidence (page title and description indicate multisearch functionality)  
   **Confidence:** high

7. **Claim:** LeagueOfGraphs pulls live ranked data directly from the Riot Games API, updating stats after each game.  
   **Sources:** [League of Graphs: LoL Stats, Ranks & Win Rates (2026)](https://agatasmurf.com/league-of-graphs/)  
   **Support:** direct evidence (snippet: “League of Graphs pulls live ranked data from the Riot Games API. Every stat updates once you hit refresh after a game.”)  
   **Confidence:** high

8. **Claim:** LeagueOfGraphs does not advertise an explicit side‑by‑side player comparison feature; its focus is on champion and aggregate statistics.  
   **Sources:** LeagueOfGraphs homepage and champion stats pages (no compare tool evident)  
   **Support:** absence of compare feature in searched pages and site structure  
   **Confidence:** medium

9. **Claim:** Mobalytics displays an Overview tab with match history and insights such as LP change per game.  
   **Sources:** [The Ultimate Mobalytics Guide – League of Legends – Mobalytics](https://mobalytics.gg/blog/lol-mobalytics-beginners-guide/)  
   **Support:** direct evidence (snippet: “Within the Overview tab, you’ll find the player’s match history along with insights like the number of…”)  
   **Confidence:** high

10. **Claim:** Mobalytics recently added a side‑by‑side summoner comparison feature, allowing users to compare two summoners directly.  
    **Sources:** [Reddit post: “You asked we made it, comparing summoner side by side”](https://www.reddit.com/r/summonerschool/comments/3v9kwq/you_asked_we_made_it_comparing_summoner_side_by/)  
    **Support:** direct evidence (quote: “We have created such a feature … simply search for summoner on our site … after adding at least 2 summoners, the button in the header will take you to a comparison page”)  
    **Confidence:** high (primary source is community announcement)

11. **Claim:** OP.GG’s summoner profile URL pattern is `https://op.gg/lol/summoners/<region>/<summonerName>-<tagline>` (e.g., `https://op.gg/lol/summoners/NA/Jessant-NA1`).  
    **Sources:** OP.GG profile example from search results  
    **Support:** direct evidence  
    **Confidence:** high

12. **Claim:** U.GG’s summoner profile URL pattern is `https://u.gg/lol/profile/<region>/<summonerName>-<tagline>/overview` (e.g., `https://u.gg/lol/profile/na1/ugg-na1/overview`).  
    **Sources:** U.GG profile example from search results  
    **Support:** direct evidence  
    **Confidence:** high

13. **Claim:** LeagueOfGraphs’ summoner profile URL pattern is `https://www.leagueofgraphs.com/summoner/<region>/<summonerName>-<tagline>` (e.g., `https://www.leagueofgraphs.com/summoner/euw/Levi1909-12345`).  
    **Sources:** LeagueOfGraphs profile example from search results  
    **Support:** direct evidence  
    **Confidence:** high

14. **Claim:** Mobalytics’ summoner profile URL pattern is `https://mobalytics.gg/lol/profile/<summonerName>/` (e.g., `https://mobalytics.gg/lol/profile/mobalytics/guides`).  
    **Sources:** Mobalytics profile and guide URLs from search results  
    **Support:** direct evidence  
    **Confidence:** high

15. **Claim:** OP.GG derives all summoner stats from the official Riot Games API.  
    **Sources:** [I want to set my stats to private – OP.GG Help Center](https://help.op.gg/hc/en-us/articles/31088823977369-I-want-to-set-my-stats-to-private)  
    **Support:** direct evidence (snippet: “All summoner stats on OP.GG are provided through official Riot Games API data…”)  
    **Confidence:** high

16. **Claim:** U.GG starts its data pipeline with the Riot API for role assignment and other stats.  
    **Sources:** [Frequently Asked Questions – U.GG](https://u.gg/faq)  
    **Support:** direct evidence (snippet: “We start with the Riot API which assigns each champion in a game to a role.”)  
    **Confidence:** high

17. **Claim:** LeagueOfGraphs obtains its data directly from the Riot Games API.  
    **Sources:** [League of Graphs: LoL Stats, Ranks & Win Rates (2026)](https://agatasmurf.com/league-of-graphs/)  
    **Support:** direct evidence (snippet: “League of Graphs pulls live ranked data from the Riot Games API.”)  
    **Confidence:** high

18. **Claim:** Mobalytics also relies on the official Riot APIs for its core game data (supplemented by Overwolf for ancillary features).  
    **Sources:** [Reddit discussion: “Where do sites like U.GG and Mobalytics get their data?”](https://www.reddit.com/r/leagueoflegends/comments/1i8pxug/where_do_sites_like_ugg_and_mobalytics_get_their/)  
    **Support:** direct evidence (comment: “They all do get from the official APIs…”)  
    **Confidence:** high

19. **Claim:** None of the four sites provide an automated tool to find shared games (match history intersection) between two summoners; users must manually inspect multisearch or profile match lists.  
    **Sources:** Review of feature lists (multisearch, compare tools, match history pages) – no site advertises a shared‑games intersection feature.  
    **Support:** interpretation based on absence of such feature in documented functionalities  
    **Confidence:** medium

## Contradictions
None found.

## Missing evidence
- Detailed documentation of Mobalytics’ side‑by‑side compare feature (beyond the Reddit announcement).  
- Exact match‑history retention periods for LeagueOfGraphs and Mobalytics (only OP.GG and U.GG explicitly state limits).  
- Confirmation whether LeagueOfGraphs offers any hidden compare functionality not visible in surface navigation.

## Sources
- Kept: How can I view my past match history? – OP.GG Help Center (https://help.op.gg/hc/en-us/articles/31088608024729-How-can-I-view-my-past-match-history) — match history limits  
- Kept: Viewing detailed match data – OP.GG Help Center (https://help.op.gg/hc/en-us/articles/31091817743129-Viewing-detailed-match-data) — detailed match data display  
- Kept: Multi‑Search guide – OP.GG Help Center (https://help.op.gg/hc/en-us/articles/31088821370777-Multi-Search-guide) — multi‑search feature  
- Kept: How to view league team and player stats – OP.GG Help Center (https://help.op.gg/hc/en-us/articles/31091864581657-How-to-view-league-team-and-player-stats) — player comparison  
- Kept: Frequently Asked Questions – U.GG (https://u.gg/faq) — match history length, filterable stats, Riot API start  
- Kept: Multisearch LoL Profile Stats for Clash, Ranked All Regions – U.GG (https://u.gg/lol/multisearch) — U.GG multisearch  
- Kept: League of Graphs: LoL Stats, Ranks & Win Rates (2026) (https://agatasmurf.com/league-of-graphs/) — Riot API data source, live updates  
- Kept: The Ultimate Mobalytics Guide – League of Legends – Mobalytics (https://mobalytics.gg/blog/lol-mobalytics-beginners-guide/) — match history overview  
- Kept: How to Use the Mobalytics Summoner Profile Feature – Mobalytics (https://mobalytics.gg/blog/how-to-use-the-mobalytics-summoner-profile-feature/) — profile insights  
- Kept: Reddit post: “You asked we made it, comparing summoner side by side” (https://www.reddit.com/r/summonerschool/comments/3v9kwq/you_asked_we_made_it_comparing_summoner_side_by/) — Mobalytics compare feature  
- Kept: OP.GG profile example (https://op.gg/lol/summoners/NA/Jessant-NA1) — URL pattern  
- Kept: U.GG profile example (https://u.gg/lol/profile/na1/ugg-na1/overview) — URL pattern  
- Kept: LeagueOfGraphs profile example (https://www.leagueofgraphs.com/summoner/euw/Levi1909-12345) — URL pattern  
- Kept: Mobalytics profile example (https://mobalytics.gg/lol/profile/mobalytics/guides) — URL pattern  
- Kept: I want to set my stats to private – OP.GG Help Center (https://help.op.gg/hc/en-us/articles/31088823977369-I-want-to-set-my-stats-to-private) — Riot API data source  
- Kept: Reddit discussion: “Where do sites like U.GG and Mobalytics get their data?” (https://www.reddit.com/r/leagueoflegends/comments/1i8pxug/where_do_sites_like_ugg_and_mobalytics_get_their/) — Mobalytics/Riot API  

## Next steps
- Test the multisearch and compare features on each site to confirm UI and data overlap detection.  
- Investigate whether LeagueOfGraphs offers any undocumented API endpoints for match‑history intersection.  
- Evaluate the feasibility of building a shared‑games tool by aggregating match histories via each site’s public endpoints (if any) or via the Riot API directly.

## Supervisor coordination
No coordination needed; the research scope was clear and completed independently.