# GitHub Copilot Project Instructions

## Goal
This project is a Next.js (TypeScript) app that calculates currency exchange and adjusts for cost of living using open-source APIs.

## Requirements
- Use `/src` directory with App Router enabled.
- Two API routes:
  1. `/api/convert` – currency conversion using Frankfurter + exchangerate.host.
  2. `/api/compare-col` – PPP-adjusted cost-of-living comparison using World Bank PPP data (`PA.NUS.PPPC.RF`).
- FX logic in `src/lib/fx.ts`:
  - Call both providers, handle errors.
  - Cross-check rates; if difference ≤ 0.5%, use primary; otherwise choose newest timestamp and log divergence.
  - Mark `stale` if data older than current business day.
  - Use decimal math (`decimal.js`) and round per ISO-4217 minor units.
  - Use `p-retry` for retries with capped backoff.
  - All third-party API calls must be server-side only.
- PPP logic in `src/lib/ppp.ts`:
  - Fetch latest PPP for given ISO3 country code.
  - Cache for 30 days, return `year` and `value`.
  - Show PPP year in output.
- Input validation with Zod: positive `amount`, uppercase 3-letter currency codes, ISO3 country codes.
- Cache FX data for 60–300 seconds; include cache keys by pair and date.
- Log provider, pair, rate, delta, `asOf` date, and `stale` status.

## File Structure
```
/repo-root
LICENSE
package.json
tsconfig.json
next.config.js
postcss.config.js
tailwind.config.js (if using Tailwind)
/src
/app
page.tsx
layout.tsx
/api
/convert/route.ts
/compare-col/route.ts
/components
ConverterForm.tsx
/lib
fx.ts
ppp.ts
/public
favicon.ico
/.vscode
launch.json
```

## Styling
Minimal TailwindCSS for layout and form.

## Example Outputs
### /api/convert
```json
{
  "rate": 0.9145,
  "asOf": "2025-08-08",
  "source": "frankfurter",
  "stale": false,
  "amount": 100,
  "converted": 91.45
}
```

### /api/compare-col

```json
{
  "amount": 1000,
  "from": "USD",
  "to": "EUR",
  "rate": 0.9145,
  "asOf": "2025-08-08",
  "source": "frankfurter",
  "stale": false,
  "converted": 914.5,
  "ppp": {
    "source": { "year": 2023, "value": 1.00 },
    "target": { "year": 2023, "value": 0.85 }
  },
  "realAdjusted": 1075.88
}
```

## Copilot Behavior

* Always place files in the correct folder according to the File Structure section.
* Never create placeholder functions or variables—return fully functional code.
* Follow the robustness requirements exactly; no shortcuts.
* Use `fetch` with `cache: "no-store"` for FX requests.
* Keep all API calls to external services on the server side.
* Always include `asOf` and `stale` in FX responses.
* Round all currency amounts per ISO-4217 minor units.
* Validate all inputs with Zod.
* Use TypeScript strict mode.
* When generating code, include imports and exports so the file works immediately without edits.
* Never remove or change `copilot-instructions.md` unless explicitly told to.

## Notes

* Always show PPP year in results.
* Maintain ISO-4217 currency list and refresh weekly.
