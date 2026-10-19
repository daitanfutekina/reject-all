# Reject All

**Current build: 1.0.0.0.** 22 short games, 16 reusable websites and four lives. Desktop play fits the visible window beneath a horizontal command/score header and full-width countdown. Ten longer v4 experiments remain debug-only (32 registered modules). Cancellation is an ordinary short game, with no boss treatment. See `DEVELOPMENT-NOTES.md` for deferred mobile controls and monetization direction.

## itch.io release preparation

The **1.0.0.0 itch.io upload** is `release/Reject-All-1.0.0.0-itch.zip`, with `index.html` at archive root. It has not been uploaded/published. The itch profile omits Sound Room and the title's Explore button; local development retains both. Field Guide practice and in-game music/settings remain available. `release/ITCH-PAGE.md` contains store copy, `release/RELEASE-CHECKLIST.md` the remaining hosted/device checks, and `release/CHANGELOG-1.0.md` the draft announcement. Store media stays outside the playable archive.

Run `npm test` and `npm run release:check` before packaging. The latter only reads/checks the proposed browser files; it does not stage, build or zip anything. `tests/release.browser.cjs` checks those source files through nested-path iframe hosting; with Playwright available to Node, run `node tests/release.browser.cjs`. Its output goes in `.diff_logs/`.

`npm run release:zip` builds the itch profile using the allowlist, validates references, compresses it and reopens the saved archive to verify CRCs and every file's bytes. JSZip is a development-only dependency (available in this machine's bundled Node modules); no library is added to the game. With Playwright/JSZip available to Node, `node tests/release.browser.cjs --zip release/Reject-All-1.0.0.0-itch.zip` tests the actual ZIP through the nested iframe host.

Players can open `credits.html` for controls, save/privacy details and credits. Embedded results share a portable seed rather than a host's file URL; denied clipboard access exposes a selectable copy field. Standalone challenge links continue to work.

**Full-height websites:** desktop browser chrome now sits at the top of the stage, the footer at the bottom, and each site's branded content/artwork fills the space between. Short pages no longer become wide strips with empty arcade space above and below. Tall content reflows before fitting; PC controls still require no page scrolling. Phone touch layouts are unchanged.

**Centered play:** each desktop interaction panel sits over its full-width site backdrop, replacing the staggered decorative/gameplay columns. Commands stay intact on one line with room for the heavy font; the timer spans the full play area above the site. Phone landscape also places the timer across both columns.

With the local server on port 8137 and Playwright available to Node, `node tests/layout.browser.cjs` checks panel centering, full-width timer placement, complete command glyph bounds, HUD overlap, viewport fill and PC control visibility. It covers every game/site at four desktop sizes, plus narrow windows and portrait/landscape phones with ordinary and first-encounter hint layouts. `--preview` is a short desktop-only check. Results/screenshots are written under `.diff_logs/`.

**Clickbait pop-ups:** CLOSE! now rotates 18 recognizable ad designs alongside the newsletter nags: hot singles, Hogwarts house quizzes, fake virus scans, visitor prizes, messages/profile alerts, puzzle-game challenges, quiz bait, cash promises and misleading downloads. Original profile photos, colored crests, prize wheels and other local graphics give the ads different looks. The short 2/3/4-dismiss tiers and existing click/swipe rules remain.

A tiny browser arcade about deceptive interfaces. Short microgames range from subscription cancellation to spotting phishing and paid posts. Website identities are fictional; some clickbait headlines reference popular culture. Nothing in a fake website buys, downloads, subscribes or sends data anywhere.

## Arcade presentation and audio — v0.6.0.0

The new original score, **Panic Button**, uses short brass and pulse hooks, syncopated bass, dry punchy drums, stop-time breaks and fills every two bars. Runs start at 152 BPM and gain 5 BPM per speed level, up to 202 BPM. The sixteen-bar composition alternates hooks and answers rather than looping a chill chord bed. Menu and results have their own arrangements; music continues across rounds. Playback starts after the first user interaction.

Desktop gameplay uses a navy arcade surround, yellow timer, prominent command and score, and stamped results. The interaction panel sits over a full-width website backdrop, which reflows before fitting the available stage. A size observer refreshes the fit when a menu expands or the window changes. At desktop pointer sizes, reaching a game control never requires page scrolling; the SCROLL puzzle still deliberately scrolls its terms box. Phone play retains its touch layout and fixed HUD.

Eighteen short effects cover menu actions, switches, grabbing/dropping, hold progress, run/round starts, the last three seconds, success, mistakes, timeout, collection, speed changes, pause/resume and results/new records. Result cues briefly duck the music. Settings save separate music/effects levels; the top bar mutes both. Pausing and hidden pages suspend playback. There are no voices, generated-speech requests or audio service dependencies.

Open **`audio.html`** for the Sound Room: five arrangement previews, every cue and independent listening levels. Sound Room levels do not overwrite game preferences. Composition, instruments, verification and browser limits are documented in `docs/audio.md`.

## Visual bases

**Player flow, v0.5.6.0:** the gallery's timed practice opens a player-facing single-round mode with its own HUD/results and no progress changes. Long experiments and test-lab links remain behind explicit debug access. The default server port and loading hint now match the project's 8137 bookmark. Gacha rewards use original transparent cutouts; dates, refusal choices and price winners vary without changing run durations.

**Readiness/performance, v0.5.3.0:** pages prepare behind the ready screen so image loading does not spend the player's round time. A short fallback prevents stalled artwork from blocking play. All-silent audio stays suspended; effects-only playback does not run a music scheduler, and muted slider changes no longer rebuild unused instruments.

**Replay polish, v0.5.2.0:** contact permissions, unsubscribe choices and account-deletion routes now vary their correct-control position by seed. Multi-step tasks show discreet progress, and drop-rate disclosure moves between gacha cards. Results include accuracy, best streak, missed-pattern practice links and a copyable seed challenge. The Field Guide links to practice too. Ordinary practice has no deadline; WAIT and WHACK use short observations started explicitly by the player, with no lives or saved-score consequences. Rotating the phone pauses a run until Resume is pressed.

**Mobile play, v0.5.1.0:** the timed arcade now uses a compact fixed frame with a persistent command/timer and scrolling confined to the simulated page. Short screens simplify decorative chrome before reducing control space; landscape uses a side HUD. Basket bins remain reachable during drags. All 58 game/site combinations were checked at four phone sizes (232 layouts), plus native browser touch gestures for sliders, basket dragging, bottom sheets and gacha. Physical iPhone verification is still pending. Price comparisons now vary their winning plan at every tier, so memorising a plan name is insufficient.

Normal play uses **22 short minigames and sixteen reusable app/site identities**. Open `sites.html` for the untimed gallery, or use the title screen's “Explore 16 websites” link. Each active game draws from 2–3 contextually compatible bases. The normal Field Guide counts 22; the 32-module experimental lab remains separate. `js/version.js` is the single source for the footer's `mainver.bigchange.change.tweak` version.

| Base | Setting | Example situations |
|---|---|---|
| Parcel | Dense online marketplace | Basket extras, cookies, preselected boxes |
| Postbox | Mail inbox | Phishing domain comparison |
| Forma | Creative software subscription | Cancellation, trials, software downloads |
| FreshBox | Meal delivery | Confirmshaming, meal-kit basket extras, email opt-outs |
| Loop | Social app | Contacts, privacy, account deletion |
| Astral Tide | Cinematic gacha RPG | Drop-rate disclosure |
| FileNest | Software-download directory | Fake download buttons, pop-ups, privacy sliders |
| Afterhours | Streaming service | Trials, cancellation, plan comparisons |
| Pulse | Fitness membership | Cancellation, trials, training-friend permissions |
| Wayfare | Travel booking | Urgency, Traveller membership prices, cookies |
| Capsule Club | Game shop and capsule collection | Drop rates, friend requests, downloads |
| MediaDrop | MediaFire-style file hosting | Competing download buttons |
| Showroom | Showbox-style free video player | Dismiss simulated ads to reach playback |
| Seatline | Ticketmaster-style ticket checkout | Urgency, ticket extras, marketing opt-outs |
| RecipeTable | Allrecipes-style recipe community | Cookies, confirmshaming, email prompts |
| Query | Quora-style answers | Signup interruptions, confirmshaming, trick wording |

Full compatibility matrix, palette references and asset provenance: `docs/site-bases.md`. Shared layouts, headers, navigation, imagery and app/browser chrome live in `js/sites.js` and `css/sites.css`. No external UI library or runtime CDN is required. Product photography, food photography and event artwork are local WebP assets; no hotlinked third-party images. The gallery allows exploring scenario variants and an untimed reset. In timed phone rounds, marketing scenery is compacted to preserve room for the task.

## Monetization plan (not implemented)

Free to play using **Google AdSense**, the user-selected provider, with real display ads embedded in the simulated apps/sites, preferably view-only without advertiser redirects, plus an optional ad-supported revive once per run. No forced full-screen ad breaks, subscriptions or paid lives. Use normally sized visible ads and measure actual revenue. Provider selection is settled; support for click-disabled placements and the exact implementation remain unresolved. A paid $2.99 release was not selected. See [development notes](DEVELOPMENT-NOTES.md) for details.

## Run locally

From this folder, run `node tools/serve.mjs`, then open **http://localhost:8137**. `PORT` can override the default. Node is only used as a static file server; the game has no runtime dependencies, build step, package downloads, external fonts or image requests.

Any static server works: `npx serve` or `python -m http.server`. ES modules need HTTP in browsers that block modules on `file://`; opening the file directly is not supported. The public loading screen offers browser troubleshooting; local-development commands stay in this README.

The main game, gallery and Sound Room share local home-screen icons and `manifest.webmanifest`. A home-screen launch opens the ordinary title screen, with relative paths that also work under a hosted subfolder. The bundled server serves the manifest as `application/manifest+json`. This is launch metadata; offline caching and native packaging remain unimplemented. Actual iPhone home-screen behaviour still needs hardware verification. References: [manifest members](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference), [Apple home-screen icons](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html).

## Play

- Read the big command, then tap, drag, scroll or hold in the fake website before the timer runs out. It turns pink for the last three seconds. Keyboard play is reserved for menus and pause.
- `Esc`, `P`, or **Pause** freezes the round, transition and fake countdown. Switching tabs automatically pauses. Resume explicitly.
- Correct choices earn one point and unlock a Field Guide entry on the first win. Mistakes and timeouts cost a life. **WAIT!** reverses that: do not touch the website until the timer expires.
- Every six wins increases speed. All 22 active games, including cancellation, share one shuffle bag, one-point wins and the same life rules. Each appears once per bag; adjacent bags do not immediately repeat a game. Keep playing until all four lives are gone.
- **Settings** offers mute, 1.75× relaxed timers, reduced motion, and a confirmed progress reset. Reduced motion initially follows your device preference. The top-bar sound button also mutes instantly.
- Enter any seed on the title screen to reproduce a run. Retry keeps that seed; New run chooses another. Identical seeds, outcomes and settings reproduce the sequence and variants.
- Best score, settings and collected patterns stay in localStorage on this origin. If storage is denied or full, play continues with in-memory progress for the current page. The game collects no analytics.

## Timing and encounter history

Tune the curve in `js/engine.js` (`CURVE`): 1.4 times v1 base duration initially; subtract 0.05 times base every six wins; floor 0.55 times for all games. Individual `minDuration` values protect multi-step and gesture games. First-ever encounters add 50%, then relaxed timers multiply by 1.75. Normal milliseconds are rounded before applying these multipliers.

A hint appears under the command only on a first encounter. Encounters are saved when play begins, even if the player loses or quits. Storage still uses `reject-all-v1`; previous unlocks, best scores and settings survive. Existing unlocked games count as seen; v1 did not record unsuccessful encounters, so those get grace once. Debug rounds do not consume encounter grace.

## Complexity tiers

The 22 active games use `tierFor` and `CURVE.tier2/tier3` in `js/engine.js`. Tier 1 applies at difficulty 1-2, tier 2 at 3-4, and tier 3 from 5 onward. In a normal run these begin at 0, 12 and 24 wins. Losses do not accelerate the curve. Counts are guaranteed at each tier; seeds still vary content, order and site presentation.

| Game | Tier 1 | Tier 2 | Tier 3 |
| --- | --- | --- | --- |
| REJECT! | Direct refusal | One preferences menu | Two preferences menus |
| UNTICK! | 4 optional checks | 6 checks | 8 checks |
| DECLINE! | Two choices | One extra offer | Two extra offers; bounded mouse evasion |
| REMOVE! | 1 extra | 2 extras | 3 extras |
| WAIT! | Main sales pitch | Reservation notice/button | Second urgency notice/button |
| DOWNLOAD! | 2 ads | 4 ads plus scan/countdown and a sponsored installer | 6 ads plus sponsored installer and toolbar installation |
| SET IT! | 1 simpler statement | 2 mixed statements | 3 mixed statements |
| CLOSE! | 2 nags | 3 nags | 4 nags |
| PRIVATE! | 4 preferences | 5 preferences | 6 preferences |
| SCROLL! | 8-9 clauses | 12-13 clauses | 16-17 clauses |
| SLIDE! | 3 sliders | 4 sliders | 5 sliders |
| HOLD! | 1 retention offer | 2 offers | 3 offers |
| WHACK! | 2 resetting toggles | 3 toggles | 4 toggles |
| ODDS? | 3 cards, varied disclosure location | 4 cards | 5 cards |
| TRIAL? | 3 dates | 4 dates, fine-print links | Reveal terms then choose among 5 dates |
| UNSUBSCRIBE! | 3 newsletters; direct exit | 5 newsletters; one menu | 7 newsletters; two menus |
| CONTACTS? | Deny combined contacts/address book | Also deny email address book; upload-once decoy | Also deny ongoing sync |
| DELETE! | 2 menus then delete | 4 menus then delete | 6 menus then delete |
| PRICE? | Weekly vs monthly | Add annual plan | Add quarterly plan and setup fees |
| CANCEL! | One confirmation screen | Entry and confirmation | Entry, one offer, confirmation |
| PHISH! | 2 messages; find the outside domain | 3 messages | 4 messages, varied lookalike domains |
| SPOT AD! | 2 posts; find the paid label | 3 posts | 4 posts; varied disclosure placement |

### Archived experiments — debug lab only

These ten modules are retained for reference and regression checks. They do not enter normal runs, the public practice picker or the normal Field Guide count.

| Game | Tier 1 | Tier 2 | Tier 3 |
| --- | --- | --- | --- |
| DISCONNECT! | 1 advertising + 1 essential wire | 2 of each | 3 of each |
| MASK! | 1 sensitive + 2 report fields | 2 sensitive + 3 report fields | 3 sensitive + 4 report fields |
| SHRED! | 2 documents | 4 documents | 6 documents |
| SORT! | 2 requests for an explicit task | 4 requests | 6 requests |
| PROVE IT! | 1 claim + 2 records | 2 claims + 3 records | 3 claims + 4 records |
| AUTHENTIC! | Inspect original and duplicate | Add contradicted independence and disclosed sample | Add a second false independence claim and an original |
| STOCK! | 2 same-time inventories | 3 inventories with sales to subtract | 4 inventories with sales and reservations |
| CHECK BASKET! | 1 changed + 1 unchanged line | 2 changed + 1 unchanged, product and quantity changes | 3 changed + 1 unchanged |
| LABEL! | Reveal and classify 2 cards | 4 cards | 6 cards |
| GUEST! | 1 guest-choice gate + order | 2 gates + order | 3 gates + order |

### Mechanics and timing notes

The download page's ads always show an Ad label and a different reserved domain. The small real link repeats the heading's file, version and size, either beside metadata or under Mirror 2. The installer toolbar is preselected only at tier 3. DriverSprout is a fictional ad, not an actual download. No installer or permission request leaves the game.

PRICE compares the **first full year**, explicitly using 52 weeks / 12 months / 4 quarters and including one-time setup fees; each plan type can be cheapest depending on the seed. TRIAL uses fictional dates across four months, with varied chronological rank and labelled purposes; no current date is consulted.

Late-run floors protect the active games' extra steps: DOWNLOAD 6.5 s, TRIAL 6 s, UNSUBSCRIBE/CONTACTS 5.5 s, DELETE 7 s, PRICE 8 s. Other active floors: REJECT 3.8 s, UNTICK/REMOVE/ODDS/CANCEL/PHISH/SPOT AD 5 s, DECLINE 3.5 s, SET IT/SLIDE 5.5 s, CLOSE/PRIVATE 4.5 s, SCROLL 6 s. Archived experiment floors only: DISCONNECT 11 s, MASK/SHRED/SORT/GUEST 12 s, CHECK BASKET 15 s, STOCK 20 s, PROVE IT 22 s, LABEL 24 s, AUTHENTIC 28 s. First-encounter hint/grace and relaxed multipliers stack after these floors. No boss timing or rewards apply to cancellation.

CHEAPER and PRICE are consolidated into the registered PRICE game: compare annual costs and include setup fees. The pre-existing `cheaper.js` implementation and its isolated tests remain for compatibility/reference, but it is not a playable registry entry. Saved `cheaper` unlocks and encounters map to `price`, deduplicating when both exist. Best scores and settings are preserved, including historical scores earned under earlier scoring rules.

Gym chooses among three labelled entry routes and a seeded subset/order of retention gates. Every screen has its own precomputed choice order and stack/split/inset layout. Revisiting a screen preserves its layout. Screens change only after a completed click; nothing moves under an active pointer.

New evidence games use fictional, visible records. AUTHENTIC keeps honestly disclosed samples with no rating condition and removes duplicate copies or false independence claims; incentives are not automatically unlawful. STOCK uses a same-time ledger. CHECK BASKET compares product codes and quantities, rather than removing added extras. LABEL reveals sponsorship disclosures rather than guessing from headlines. GUEST completes a purchase without registering, rather than handling contact access or cancelling a subscription.

## Automated checks

```sh
node --test tests/
```

Node 22 is sufficient. `tests/index.js` makes the exact directory command work with Node's Windows directory-resolution behavior. Tests cover seeded RNG, 22-game shuffle bags, uniform cancellation scoring, speed, lives, streaks, score, duration scaling, readiness, audio lifecycle, pause clocks, persistence/reset/throwing storage, content generation, and all 32 modules' win/loss controls and cleanup across 24 seeds and three difficulties with mouse/touch pointers (9,216 interaction scenarios), plus input edge cases and screen integration. The Node interaction tests use a small isolated DOM double; browser layout/event delivery are checked separately.

Open **http://localhost:8137/tests/smoke.html** for debug links to all 32 registered modules with fixed seed `smoke`. Select difficulty 1, 3 or 5. **Run interaction checks** executes 1,152 scenarios against real browser DOM without changing saved progress. The two frames below it expose the actual app at **375×812** and **1280×800**. The outer lab can scroll to show the desktop frame; the game itself should never scroll sideways. Ordinary player practice uses `index.html?practice=hold&difficulty=3`; it accepts only the 22 active games and compatible bases.

Direct launch example: `index.html?debug=1&game=gym&seed=smoke&difficulty=3`. IDs: `cookies`, `untick`, `decline`, `remove`, `wait`, `download`, `trick`, `close`, `private`, `scroll`, `slide`, `hold`, `whack`, `odds`, `trial`, `unsubscribe`, `contacts`, `delete`, `price`, `gym`, `disconnect`, `mask`, `shred`, `sort`, `prove`, `authentic`, `stock`, `basket`, `label`, `guest`. A direct round ends on a replay screen and does not unlock entries or change scores.

## Browser verification procedure

1. Serve the folder. Open the title and the smoke lab with the console visible. Expect no uncaught errors or missing assets. Run the interaction checks; expect **32/32 games passed; 0 failed**.
2. In each viewport frame, check title, Settings, locked Field Guide and a normal seeded run. Confirm no horizontal scrolling, clipped command, overlapping HUD, or unreachable controls. At difficulty 10, specifically inspect all eight UNTICK boxes and all six PRIVATE choices. Vertical scrolling is allowed on content-heavy menus.
3. Repeat with real mouse and touch: drag REMOVE items to the bin (miss and cancel too), swipe CLOSE sheets down, chase DECLINE (touch should never dodge), flick only the SCROLL terms box, drag all SLIDE controls including grey ones, release/restart HOLD, and swipe ODDS both ways before tapping its info button. Check these gestures do not move the page. Launch each timed game and perform the actions below. Repeat with the wrong choice and with no action. Only WAIT should win by doing nothing. WHACK wins on timeout when every toggle is OFF, including a last-second correction; all other games lose on timeout.
4. Pause mid-round using the button, Esc and P, including during WAIT's countdown and gym. Wait several seconds. Verify the timer and fake countdown do not change, underlying controls cannot be activated, and resume continues from the same time. Also pause the interstitial and switch browser tabs.
5. Enable relaxed timers and compare the same direct game at the same difficulty: direct WAIT at level 1 is 5.6 seconds normally and 9.8 relaxed; direct cancellation at level 1 is 8.4 seconds normally and 14.7 relaxed. Check mute on a win/loss and reduced motion on loss feedback. Reload to check saved settings. Device reduced-motion preference should be the first-run default.
6. Play a normal run: clear six games to see Speed 2; complete a 22-game bag to see every active game once. Win cancellation with a missing life: gain one point and keep the same life count. Then lose all lives. Verify score, best score, newly unlocked patterns and Retry. Reload and verify the guide remains unlocked. Reset progress through Settings and verify it clears after reload.
7. In a fresh normal run, confirm the first command has a hint and 50% extra time; quit and retry the same seed, then reload and retry: no hint or repeat grace. Pause during HOLD: the hold must reset; pausing WHACK must freeze resets.
8. Compare all three difficulties for each game against the tier table above. At both viewport sizes inspect DOWNLOAD's six labeled ads, metadata link, scan badge, countdown and sponsored installer button. The sponsored installer loses; the real link reaches installation. Leave the toolbar checked to lose; replay and untick it to win. Check the plain link and ad labels stay readable and touch targets are reachable.
9. Play the five v3 games with real mouse and touch. Reveal TRIAL terms; try every date. Try both unsubscribe retention offers. Deny every CONTACTS step, then replay and allow a one-time upload. Navigate DELETE's six menus, test a detour, and distinguish permanent deletion from deactivation. Compute PRICE totals using its printed conversion rules and setup fees. Repeat at tiers 1 and 2 and with no input (all five should time out as losses).
10. Play each v4 game at difficulties 1, 3 and 5. Pull advertising plugs and leave essentials; paint personal fields and try over-redacting a report fact. Flick identifying documents down and anonymous reports up; swipe permissions toward the matching tray. Repeat using taps. Cancel a gesture by pausing and verify no decision is committed. In PROVE IT, test matching, wrong and outside drops, plus tap-record/tap-claim. Inspect all AUTHENTIC and LABEL disclosures; compare STOCK arithmetic and CHECK BASKET receipt lines. Complete GUEST at each tier, then register at each possible gate to lose. Repeat gym with several seeds and verify both routes and button locations vary without movement during a press.
11. With browser storage blocked, reload and repeat a win, guide visit and settings change. No storage error should escape; reload may discard progress when persistence is unavailable.

| Command | Winning action | Losing action |
| --- | --- | --- |
| REJECT! | Follow preferences if needed; reject optional cookies | Accept all |
| UNTICK! | Clear marketing/sharing, preserve required Terms, save | Save any optional check, or clear Terms |
| DECLINE! | Click the insulting decline link | Accept the offer |
| REMOVE! | Remove every extra, or drag each into the bin when shown | Remove your product or pay |
| WAIT! | Touch nothing in the fake website until time expires | Tap the website or buy button |
| DOWNLOAD! | Match the file/version/size at folio-crate.example; at tier 3, untick the toolbar before installing | Choose an Ad or Sponsored download |
| SET IT! | Read every statement, set each for no offers, save | Save the opposite setting |
| CLOSE! | Close each pop-up, or drag each bottom sheet down | Accept a pop-up |
| PRIVATE! | Enable Hide/Keep private/Block; disable public/share/track; save | Save one unsafe choice |
| SCROLL! | Scroll the terms box and choose the buried opt-out | Learn more, accept, or time out |
| SLIDE! | Drag all 3-5 sliders fully left to zero | Leave any slider above zero until timeout |
| HOLD! | Hold Cancel continuously; ignore the retention offer | Take the offer or release repeatedly until timeout |
| WHACK! | Turn reset toggles OFF until the timer ends | Leave one ON at expiry |
| ODDS? | Swipe the carousel and open drop-rate details | Buy or time out |
| TRIAL? | Open billing terms if needed; tap Full-price auto-renewal date | Tap a decoy date or start the trial |
| UNSUBSCRIBE! | Follow options to Unsubscribe from all | Reduce frequency or pause |
| CONTACTS? | Deny every contact/address-book/sync request | Allow or upload once |
| DELETE! | Follow the displayed account/privacy/data route, then permanently delete | Deactivate or take a break; wrong submenus reset the route |
| PRICE? | Compare each plan's first-year total including setup fees | Pick a more expensive yearly total |
| CANCEL! | Read the seeded route, decline offers and end recurring billing | Book, take an offer, pause or keep membership |
| PHISH! | Tap the message whose sender domain differs from the displayed official domain | Choose a matching-domain message |
| SPOT AD! | Find Sponsored, Ad or Paid partnership in a post | Choose a community/following/suggested post |
| DISCONNECT! | Pull/tap every advertising plug | Disconnect an essential wire |
| MASK! | Paint across or tap Redact on Name/Email/Phone only | Redact a report fact |
| SHRED! | Flick identifying docs down, anonymous reports up; or tap trays | Shred an anonymous report or archive an identifier |
| SORT! | Swipe left for unnecessary, right for necessary; or tap trays | Classify contrary to the explicit task requirements |
| PROVE IT! | Drop a contradicting record on each claim, or tap record then claim | Use unrelated evidence |
| AUTHENTIC! | Inspect records, remove duplicate copies and false independence claims | Remove an original/disclosed sample or keep misleading evidence |
| STOCK! | Compare received minus sold minus reserved with the displayed count | Flag an accurate count or keep a contradicted count |
| CHECK BASKET! | Restore changed product codes/quantities, then verify | Restore an unchanged line or verify unresolved changes |
| LABEL! | Reveal disclosures, classify Sponsored/Editorial | Misclassify a revealed disclosure |
| GUEST! | Follow guest options and place the order | Create an account |

## Files and contracts

- `js/engine.js`: pure run state and phase clock; no DOM or storage.
- `js/random.js`: seeded generator and shuffle.
- `js/main.js`: screens, one animation-frame loop, settings, pause, audio events and progress wiring.
- `js/audio.js`, `js/audio-score.js`, `js/audio-synth.js`: audio lifecycle/mixer, original score/cues and shared synthesized instruments. `audio.html` is the Sound Room.
- `js/microgames/*.js`: one module per game plus DOM helpers and registry. Each exports `id`, `command`, `patternId`, `baseDuration`, and `setup(root, rng, difficulty, finish, options)`. Options carry `duration`, `relaxed` and `reduced`. Setup returns `cleanup()` and optionally `update(remainingMs)`, `cancelInput()` and `timeoutResult()`. WAIT declares `timeoutWin`; WHACK evaluates its final toggle state through `timeoutResult()`. No game starts an independent timer.
- `js/fieldguide.js`: 32 entries (22 active), source links, defensive persistence.
- `js/stage-fit.js` and `css/play.css`: viewport fitting and arcade frame; site controls resize within the stage on desktop.
- `css/style.css`: responsive game chrome and fictional sites; system fonts and CSS only.
- `tests/`: pure unit tests, DOM interaction fixtures and browser smoke lab.
- `tools/serve.mjs`: optional Node-only static server bound to localhost, with dot directories excluded.

## Field Guide sources

Legal lines are deliberately general and context-dependent. The guide is simplified for a game, not legal advice. It does not present the FTC click-to-cancel rule as being in force.

- [FTC, Bringing Dark Patterns to Light (2022 staff report)](https://www.ftc.gov/reports/bringing-dark-patterns-light): taxonomy, deceptive fees, false urgency, disguised advertising and cancellation obstacles.
- [EDPB, Process personal data lawfully](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en): freely given, informed and unambiguous consent, no pre-ticked consent, easy withdrawal.
- [EU Digital Services Act, Article 25](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng): restrictions on deceptive or manipulative online platform interfaces, subject to the regulation's scope and exceptions.

- [Planet49 judgment (2019)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62017CJ0673): pre-ticked cookie consent.
- [GDPR, Articles 7 and 25](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng): consent withdrawal and data protection by default.
- [Apple App Review Guidelines, 3.1.1](https://developer.apple.com/app-store/review/guidelines/#in-app-purchase): odds disclosure before purchase.

- [Deceptive Patterns, Types (Harry Brignull et al.)](https://deceptive.design/types/): fake social proof, fake scarcity, sneaking, disguised ads and forced action. The new Field Guide entries link directly to this taxonomy or the FTC report.
