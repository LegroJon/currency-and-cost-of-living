# Currency & Cost of Living

A Next.js TypeScript app that provides currency conversion with purchasing power parity (PPP) adjustments.

## Features

- **Currency Conversion**: Real-time FX rates from Frankfurter + exchangerate.host
- **Cost of Living Adjustment**: PPP data from World Bank
- **Robust Error Handling**: Cross-provider validation, retry logic, staleness detection
- **Decimal Precision**: Using decimal.js for financial calculations
- **Input Validation**: Zod schemas for type safety

## API Endpoints

### POST /api/convert
Simple currency conversion:
```json
{
  "from": "USD",
  "to": "EUR", 
  "amount": 100
}
```

### POST /api/compare-col
Currency conversion with PPP cost-of-living adjustment:
```json
{
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "fromCountry": "USA", 
  "toCountry": "DEU",
  "amount": 1000
}
```

## Development

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
```

## Architecture

- **FX Logic** (`src/lib/fx.ts`): Multi-provider rate fetching with cross-validation
- **PPP Logic** (`src/lib/ppp.ts`): World Bank PPP data with 30-day caching  
- **API Routes**: RESTful endpoints in `src/app/api/`
- **Components**: React form with real-time conversion

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Zod validation
- decimal.js for precision
- p-retry for resilience
