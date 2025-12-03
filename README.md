# Playwright test for dev.3snet.info/eventswidget

This repository contains an automated Playwright test (TypeScript) for the web page:
`https://dev.3snet.info/eventswidget/`.

## What is covered

- Page loads successfully (HTTP 200).
- The main events widget container is present.
- At least one event card/item is rendered.
- Each event card has a title and a date/time text (if available).
- If an event has a "details" / "show more" action, the test will click it and verify a details panel or modal opens.
- Basic accessibility checks: visibility and that interactive elements are clickable.

The test is intentionally written defensively — it tolerates small variations in the page structure but will flag missing core functionality.

## How to run (one-line)

1. Clone the repo:
```bash
git clone <this-repo-url>
cd playwright-eventswidget
```

2. Install dependencies (recommended):
```bash
npm ci
```

3. Run the test:
```bash
npm run test:ci
```

The `test:ci` script will install Playwright browsers and run the tests producing a small report in the console and an HTML report in `playwright-report/`.

## Notes & observations

- The test targets `https://dev.3snet.info/eventswidget/`. If the site is behind auth, blocked, or rate-limited from your environment, the test will fail to reach it.
- If UI elements change (text labels, DOM layout), update selectors in `tests/eventswidget.spec.ts`.
- Tests run headless by default. To see the browser, run with `npx playwright test --headed`.

## Files of interest

- `tests/eventswidget.spec.ts` — the main test file.
- `playwright.config.ts` — Playwright configuration.
- `package.json` — scripts and devDependencies.

## Contact / Submission

Package is prepared for local execution. Once you push to a public git repository, share the link as requested.

