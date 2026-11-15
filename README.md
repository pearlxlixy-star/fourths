# Fourths

One calendar for pay-later installments. React + Vite + TypeScript + Tailwind, no backend.

```bash
npm install
npm run dev      # local dev server
npm run build    # static site in dist/ — host that folder anywhere
```

- Rename the app: `APP_NAME` in `src/config.ts`.
- Bank data: `src/data/bank.ts` is the only file that touches it. `USE_MOCK_BANK` in `src/config.ts` switches between the mock and the (empty) Plaid provider.
- Demo data: `src/lib/seed.ts`. "Reset demo data" shows in dev, or on a hosted build with `?dev` in the URL.
- Design tokens: `src/index.css`.
