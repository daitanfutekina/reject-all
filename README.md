# Reject All

A tiny browser arcade about deceptive interfaces. Twenty microgames, four lives, one very clingy gym. All brands are fictional; nothing in a fake website buys, downloads, subscribes or sends data anywhere.

## Run

From this folder, run `node tools/serve.mjs`, then open **http://localhost:8080**. Node is only used as a static file server; the game has no runtime dependencies, build step, package downloads, external fonts or image requests.

Any static server works: `npx serve` or `python -m http.server`. ES modules need HTTP in browsers that block modules on `file://`; opening the file directly shows a server hint.

## Play

- Read the big command, then tap, drag, scroll or hold in the fake website before the blue timer runs out. Keyboard play is reserved for menus and pause.
- `Esc`, `P`, or **Pause** freezes the round, transition and fake countdown. Switching tabs automatically pauses. Resume explicitly.
- Correct choices earn one point and unlock a Field Guide entry on the first win. Mistakes and timeouts cost a life. **WAIT!** reverses that: do not touch the website until the timer expires.
- Every six ordinary wins increases speed. Every ten ordinary attempts brings the boss. The boss is worth five points and restores one life, capped at four. Keep playing until all four lives are gone.
- **Settings** offers mute, 1.75× relaxed timers, reduced motion, and a confirmed progress reset. Reduced motion initially follows your device preference. The top-bar sound button also mutes instantly.
- Enter any seed on the title screen to reproduce a run. Retry keeps that seed; New run chooses another. Identical seeds, outcomes and settings reproduce the sequence and variants.
- Best score, settings and collected patterns stay in localStorage on this origin. If storage is denied or full, play continues with in-memory progress for the current page. The game collects no analytics.

## Timing and encounter history

Tune the curve in `js/engine.js` (`CURVE`): 1.4 times v1 base duration initially; subtract 0.05 times base every six ordinary wins; floor 0.55 times for ordinary games and 0.8 times for the boss. Individual `minDuration` values protect multi-step and gesture games. First-ever encounters add 50%, then relaxed timers multiply by 1.75. Normal milliseconds are rounded before applying these multipliers.

A hint appears under the command only on a first encounter. Encounters are saved when play begins, even if the player loses or quits. Storage still uses `reject-all-v1`; previous unlocks, best scores and settings survive. Existing unlocked games count as seen; v1 did not record unsuccessful encounters, so those get grace once. Debug rounds do not consume encounter grace.

## Complexity tiers

All 20 microgames and the boss use `tierFor` and `CURVE.tier2/tier3` in `js/engine.js`. Tier 1 applies at difficulty 1-2, tier 2 at 3-4, and tier 3 from 5 onward. In a normal run these begin at 0, 12 and 24 ordinary wins. Bosses and losses do not accelerate the curve. Counts are guaranteed at each tier; seeds still vary content, order and site presentation.

| Game | Tier 1 | Tier 2 | Tier 3 |
| --- | --- | --- | --- |
| REJECT! | Direct refusal | One preferences menu | Two preferences menus |
| UNTICK! | 4 optional checks | 6 checks | 8 checks |
| DECLINE! | Two choices | One extra offer | Two extra offers; bounded mouse evasion |
| REMOVE! | 1 extra | 2 extras | 3 extras |
| CHEAPER? | 1 fee per offer | 2 fees | 3 fees |
| WAIT! | Main sales pitch | Reservation notice/button | Second urgency notice/button |
| DOWNLOAD! | 2 ads | 4 ads plus scan/countdown/checkbox noise | 6 ads plus noise and toolbar installer |
| SET IT! | 1 simpler statement | 2 mixed statements | 3 mixed statements |
| CLOSE! | 2 nags | 3 nags | 4 nags |
| PRIVATE! | 4 preferences | 5 preferences | 6 preferences |
| SCROLL! | 8-9 clauses | 12-13 clauses | 16-17 clauses |
| SLIDE! | 3 sliders | 4 sliders | 5 sliders |
| HOLD! | 1 retention offer | 2 offers | 3 offers |
| WHACK! | 2 resetting toggles | 3 toggles | 4 toggles |
| ODDS? | 3 cards, info on last | 4 cards | 5 cards |
| TRIAL? | 3 dates | 4 dates, fine-print links | Reveal terms then choose among 5 dates |
| UNSUBSCRIBE! | 3 newsletters; direct exit | 5 newsletters; one menu | 7 newsletters; two menus |
| CONTACTS? | Deny combined contacts/address book | Also deny email address book; upload-once decoy | Also deny ongoing sync |
| DELETE! | 2 menus then delete | 4 menus then delete | 6 menus then delete |
| PRICE? | Weekly vs monthly | Add annual plan | Add quarterly plan and setup fees |
| Gym boss | 4 cancellation actions | 5 actions | 6 actions |

The download page's ads always show an Ad label and a different reserved domain. The small real link repeats the heading's file, version and size, either beside metadata or under Mirror 2. The installer toolbar is preselected only at tier 3. DriverSprout is a fictional ad, not an actual download. No installer or permission request leaves the game.

PRICE compares the **first full year**, explicitly using 52 weeks / 12 months / 4 quarters and including one-time setup fees. TRIAL uses fictional April dates with labelled purposes; no calendar or current date is consulted.

Late-run floors protect the extra steps: DOWNLOAD 6.5 s, TRIAL 6 s, UNSUBSCRIBE/CONTACTS 5.5 s, DELETE 7 s, PRICE 8 s. Existing affected floors: REJECT 3.8 s, UNTICK/CHEAPER/REMOVE/ODDS 5 s, DECLINE 3.5 s, SET IT/SLIDE 5.5 s, CLOSE/PRIVATE 4.5 s, SCROLL 6 s. First-encounter hint/grace and relaxed multipliers remain unchanged.

## Automated checks

```sh
node --test tests/
```

Node 22 is sufficient. `tests/index.js` makes the exact directory command work with Node's Windows directory-resolution behavior. Tests cover seeded RNG, shuffle bags, boss cadence, speed, lives, score, duration scaling, pause clocks, persistence/reset/throwing storage, content generation, and every game's win/loss controls and listener cleanup across 24 seeds and three difficulties with both mouse and touch pointers (6,048 interaction scenarios), plus input edge cases and main-screen integration. The Node interaction tests use a small isolated DOM double; they do not claim to validate browser layout or browser event delivery.

Open **http://localhost:8080/tests/smoke.html** for direct links to all twenty-one timed games with fixed seed `smoke`. Select difficulty 1, 3 or 10. **Run interaction checks** executes 756 scenarios against real browser DOM without changing saved progress. The two frames below it expose the actual app at **375×812** and **1280×800**. The outer lab can scroll to show the desktop frame; the game itself should never scroll sideways.

Direct launch example: `index.html?debug=1&game=gym&seed=smoke&difficulty=3`. IDs: `cookies`, `untick`, `decline`, `remove`, `cheaper`, `wait`, `download`, `trick`, `close`, `private`, `scroll`, `slide`, `hold`, `whack`, `odds`, `trial`, `unsubscribe`, `contacts`, `delete`, `price`, `gym`. A direct round ends on a replay screen and does not unlock entries or change scores.

## Browser verification procedure

1. Serve the folder. Open the title and the smoke lab with the console visible. Expect no uncaught errors or missing assets. Run the interaction checks; expect **21/21 games passed; 0 failed**.
2. In each viewport frame, check title, Settings, locked Field Guide and a normal seeded run. Confirm no horizontal scrolling, clipped command, overlapping HUD, or unreachable controls. At difficulty 10, specifically inspect all eight UNTICK boxes and all six PRIVATE choices. Vertical scrolling is allowed on content-heavy menus.
3. Repeat with real mouse and touch: drag REMOVE items to the bin (miss and cancel too), swipe CLOSE sheets down, chase DECLINE (touch should never dodge), flick only the SCROLL terms box, drag all SLIDE controls including grey ones, release/restart HOLD, and swipe ODDS both ways before tapping its info button. Check these gestures do not move the page. Launch each timed game and perform the actions below. Repeat with the wrong choice and with no action. Only WAIT should win by doing nothing. WHACK wins on timeout only with every toggle OFF for the final 350 ms; all other games lose on timeout.
4. Pause mid-round using the button, Esc and P, including during WAIT's countdown and the boss. Wait several seconds. Verify the timer and fake countdown do not change, underlying controls cannot be activated, and resume continues from the same time. Also pause the interstitial and switch browser tabs.
5. Enable relaxed timers and compare the same direct game at the same difficulty: direct WAIT at level 1 is 5.6 seconds normally and 9.8 relaxed; the initial direct boss is 26.6 seconds normally and 46.55 relaxed. Check mute on a win/loss and reduced motion on loss feedback. Reload to check saved settings. Device reduced-motion preference should be the first-run default.
6. Play a normal run: clear six games to see Speed 2; reach ten attempts to see the boss; win it with a missing life and see one restored. Continue past it, then lose all lives. Verify score, best score, newly unlocked patterns and Retry. Reload and verify the guide remains unlocked. Reset progress through Settings and verify it clears after reload.
7. In a fresh normal run, confirm the first command has a hint and 50% extra time; quit and retry the same seed, then reload and retry: no hint or repeat grace. Pause during HOLD: the hold must reset; pausing WHACK must freeze resets.
8. Compare all three difficulties for each game against the tier table above. At both viewport sizes inspect DOWNLOAD's six labeled ads, metadata link, scan badge, countdown and checked ad recommendation. Take the real link, leave the toolbar checked to lose; replay and untick it to win. Check the plain link and ad labels stay readable and touch targets are reachable.
9. Play the five new games with real mouse and touch. Reveal TRIAL terms; try every date. Try both unsubscribe retention offers. Deny every CONTACTS step, then replay and allow a one-time upload. Navigate DELETE's six menus, test a detour, and distinguish permanent deletion from deactivation. Compute PRICE totals using its printed conversion rules and setup fees. Repeat at tiers 1 and 2 and with no input (all five should time out as losses).
10. With browser storage blocked, reload and repeat a win, guide visit and settings change. No storage error should escape; reload may discard progress when persistence is unavailable.

| Command | Winning action | Losing action |
| --- | --- | --- |
| REJECT! | Follow preferences if needed; reject optional cookies | Accept all |
| UNTICK! | Clear marketing/sharing, preserve required Terms, save | Save any optional check, or clear Terms |
| DECLINE! | Click the insulting decline link | Accept the offer |
| REMOVE! | Remove every extra, or drag each into the bin when shown | Remove your product or pay |
| CHEAPER? | Add each fee and pick the lower total | Pick the lower headline with the higher total |
| WAIT! | Touch nothing in the fake website until time expires | Tap the website or buy button |
| DOWNLOAD! | Match the file/version/size at folio-crate.example; at tier 3, untick the toolbar before installing | Choose an Ad or Sponsored download |
| SET IT! | Read every statement, set each for no offers, save | Save the opposite setting |
| CLOSE! | Close each pop-up, or drag each bottom sheet down | Accept a pop-up |
| PRIVATE! | Enable Hide/Keep private/Block; disable public/share/track; save | Save one unsafe choice |
| SCROLL! | Scroll the terms box and choose the buried opt-out | Learn more, accept, or time out |
| SLIDE! | Drag all 3-5 sliders fully left to zero | Leave any slider above zero until timeout |
| HOLD! | Hold Cancel continuously; ignore the retention offer | Take the offer or release repeatedly until timeout |
| WHACK! | Turn reset toggles OFF until the timer ends | Leave one ON, or turn the last one OFF too late |
| ODDS? | Swipe the carousel and open drop-rate details | Buy or time out |
| TRIAL? | Open billing terms if needed; tap Full-price auto-renewal date | Tap a decoy date or start the trial |
| UNSUBSCRIBE! | Follow options to Unsubscribe from all | Reduce frequency or pause |
| CONTACTS? | Deny every contact/address-book/sync request | Allow or upload once |
| DELETE! | Follow Settings, Account, Privacy, Data, ownership and deletion options as shown, then permanently delete | Deactivate or take a break; wrong submenus reset the route |
| PRICE? | Compare each plan's first-year total including setup fees | Pick a more expensive yearly total |
| CANCEL THE GYM | Manage membership → continue → cancel instead → confirm until cancelled | Book, take an offer, pause or keep membership |

## Files and contracts

- `js/engine.js`: pure run state and phase clock; no DOM or storage.
- `js/random.js`: seeded generator and shuffle.
- `js/main.js`: screens, one animation-frame loop, settings, pause, synthesized audio and progress wiring.
- `js/microgames/*.js`: one module per game plus DOM helpers and registry. Each exports `id`, `command`, `patternId`, `baseDuration`, and `setup(root, rng, difficulty, finish, options)`. Options carry `duration`, `relaxed` and `reduced`. Setup returns `cleanup()` and optionally `update(remainingMs)`, `cancelInput()` and `timeoutResult()`. WAIT declares `timeoutWin`; WHACK evaluates its final toggle state through `timeoutResult()`. No game starts an independent timer.
- `js/fieldguide.js`: twenty-one entries, official source links, defensive persistence.
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
