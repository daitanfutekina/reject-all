# Reject All

A tiny browser arcade about deceptive interfaces. Ten microgames, four lives, one very clingy gym. All brands are fictional; nothing in a fake website buys, downloads, subscribes or sends data anywhere.

## Run

From this folder, run `node tools/serve.mjs`, then open **http://localhost:8080**. Node is only used as a static file server; the game has no runtime dependencies, build step, package downloads, external fonts or image requests.

Any static server works: `npx serve` or `python -m http.server`. ES modules need HTTP in browsers that block modules on `file://`; opening the file directly shows a server hint.

## Play

- Read the big command, then tap or click the fake website before the blue timer runs out. Keyboard play is reserved for menus and pause.
- `Esc`, `P`, or **Pause** freezes the round, transition and fake countdown. Switching tabs automatically pauses. Resume explicitly.
- Correct choices earn one point and unlock a Field Guide entry on the first win. Mistakes and timeouts cost a life. **WAIT!** reverses that: do not touch the website until the timer expires.
- Every four ordinary wins increases speed. Every ten ordinary attempts brings the boss. The boss is worth five points and restores one life, capped at four. Keep playing until all four lives are gone.
- **Settings** offers mute, 1.75× relaxed timers, reduced motion, and a confirmed progress reset. Reduced motion initially follows your device preference. The top-bar sound button also mutes instantly.
- Enter any seed on the title screen to reproduce a run. Retry keeps that seed; New run chooses another. Identical seeds, outcomes and settings reproduce the sequence and variants.
- Best score, settings and collected patterns stay in localStorage on this origin. If storage is denied or full, play continues with in-memory progress for the current page. The game collects no analytics.

## Automated checks

```sh
node --test tests/
```

Node 22 is sufficient. `tests/index.js` makes the exact directory command work with Node's Windows directory-resolution behavior. Tests cover seeded RNG, shuffle bags, boss cadence, speed, lives, score, duration scaling, pause clocks, persistence/reset/throwing storage, content generation, and every game's win/loss controls and listener cleanup across 24 seeds and three difficulties (1,584 interaction scenarios). The Node interaction tests use a small isolated DOM double; they do not claim to validate browser layout or browser event delivery.

Open **http://localhost:8080/tests/smoke.html** for direct links to all eleven timed games with fixed seed `smoke`. Select difficulty 1, 3 or 10. **Run interaction checks** executes 198 scenarios against real browser DOM without changing saved progress. The two frames below it expose the actual app at **375×812** and **1280×800**. The outer lab can scroll to show the desktop frame; the game itself should never scroll sideways.

Direct launch example: `index.html?debug=1&game=gym&seed=smoke&difficulty=3`. IDs: `cookies`, `untick`, `decline`, `remove`, `cheaper`, `wait`, `download`, `trick`, `close`, `private`, `gym`. A direct round ends on a replay screen and does not unlock entries or change scores.

## Browser verification procedure

1. Serve the folder. Open the title and the smoke lab with the console visible. Expect no uncaught errors or missing assets. Run the interaction checks; expect **11/11 games passed; 0 failed**.
2. In each viewport frame, check title, Settings, locked Field Guide and a normal seeded run. Confirm no horizontal scrolling, clipped command, overlapping HUD, or unreachable controls. At difficulty 10, specifically inspect all eight UNTICK boxes and all six PRIVATE choices. Vertical scrolling is allowed on content-heavy menus.
3. Launch each timed game and perform the actions below. Repeat with the wrong choice and with no action. Only WAIT should win by doing nothing; all other games should lose on timeout.
4. Pause mid-round using the button, Esc and P, including during WAIT's countdown and the boss. Wait several seconds. Verify the timer and fake countdown do not change, underlying controls cannot be activated, and resume continues from the same time. Also pause the interstitial and switch browser tabs.
5. Enable relaxed timers and compare the same direct game at the same difficulty: 4 seconds becomes 7; the 19-second initial boss becomes 33.25. Check mute on a win/loss and reduced motion on loss feedback. Reload to check saved settings. Device reduced-motion preference should be the first-run default.
6. Play a normal run: clear four games to see Speed 2; reach ten attempts to see the boss; win it with a missing life and see one restored. Continue past it, then lose all lives. Verify score, best score, newly unlocked patterns and Retry. Reload and verify the guide remains unlocked. Reset progress through Settings and verify it clears after reload.
7. With browser storage blocked, reload and repeat a win, guide visit and settings change. No storage error should escape; reload may discard progress when persistence is unavailable.

| Command | Winning action | Losing action |
| --- | --- | --- |
| REJECT! | Follow preferences if needed; reject optional cookies | Accept all |
| UNTICK! | Clear marketing/sharing, preserve required Terms, save | Save any optional check, or clear Terms |
| DECLINE! | Click the insulting decline link | Accept the offer |
| REMOVE! | Remove the extra item you did not order | Remove your product or pay |
| CHEAPER? | Add each fee and pick the lower total | Pick the lower headline with the higher total |
| WAIT! | Touch nothing in the fake website until time expires | Tap the website or buy button |
| DOWNLOAD! | Choose the original file at folio-crate.example | Choose an Ad or Sponsored download |
| SET IT! | Read the statement, set it for no offers, save | Save the opposite setting |
| CLOSE! | Close each of 2–4 pop-ups using × | Accept a pop-up |
| PRIVATE! | Enable Hide/Keep private/Block; disable public/share/track; save | Save one unsafe choice |
| CANCEL THE GYM | Manage membership → continue → cancel instead → confirm until cancelled | Book, take an offer, pause or keep membership |

## Files and contracts

- `js/engine.js`: pure run state and phase clock; no DOM or storage.
- `js/random.js`: seeded generator and shuffle.
- `js/main.js`: screens, one animation-frame loop, settings, pause, synthesized audio and progress wiring.
- `js/microgames/*.js`: one module per game plus DOM helpers and registry. Each exports `id`, `command`, `patternId`, `baseDuration`, and `setup(root, rng, difficulty, finish)`. Setup returns `cleanup()` and optionally `update(remainingMs)`. WAIT additionally declares `timeoutWin`. No game starts an independent timer.
- `js/fieldguide.js`: eleven entries, official source links, defensive persistence.
- `css/style.css`: responsive game chrome and fictional sites; system fonts and CSS only.
- `tests/`: pure unit tests, DOM interaction fixtures and browser smoke lab.
- `tools/serve.mjs`: optional Node-only static server bound to localhost, with dot directories excluded.

## Field Guide sources

Legal lines are deliberately general and context-dependent. The guide is simplified for a game, not legal advice. It does not present the FTC click-to-cancel rule as being in force.

- [FTC, Bringing Dark Patterns to Light (2022 staff report)](https://www.ftc.gov/reports/bringing-dark-patterns-light): taxonomy, deceptive fees, false urgency, disguised advertising and cancellation obstacles.
- [EDPB, Process personal data lawfully](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en): freely given, informed and unambiguous consent, no pre-ticked consent, easy withdrawal.
- [EU Digital Services Act, Article 25](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng): restrictions on deceptive or manipulative online platform interfaces, subject to the regulation's scope and exceptions.
