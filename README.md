# Fourths

One calendar for pay-later installments. React + Vite + TypeScript + Tailwind, no backend.

```bash
npm install
npm run dev      # local dev server
npm run build    # writes index.html + assets/ to the repo root (what GitHub Pages serves)
```

- Rename the app: `APP_NAME` in `src/config.ts`.
- Bank data: `src/data/bank.ts` is the only file that touches it. `USE_MOCK_BANK` in `src/config.ts` switches between the mock and the (empty) Plaid provider.
- Demo data: `src/lib/seed.ts`. "Reset demo data" shows in dev, or on a hosted build with `?dev` in the URL.
- Design tokens: `src/index.css`.

Live site: https://pearlxlixy-star.github.io/fourths/ — GitHub Pages serves the repo root of `main`, so run `npm run build` and commit the result before pushing.
