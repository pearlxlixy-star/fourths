# Fourths

A pixel-style game about money choices. Make an animal character, answer four questions about yourself, then play a branching story where every choice changes the character's wallet, savings, debt, calm and joy. A habit tracker earns XP toward the real goal.

React + Vite + TypeScript + Tailwind. No backend; everything is saved in the browser.

```bash
npm install
npm run dev      # local dev server
npm run build    # writes index.html + assets/ to the repo root (what GitHub Pages serves)
```

Live site: https://pearlxlixy-star.github.io/fourths/ — GitHub Pages serves the repo root of `main`, so run `npm run build` and commit the result before pushing.

- Rename the app: `APP_NAME` in `src/config.ts`.
- Story scenes and branches: `src/data/story.ts`.
- Survey questions and starting stats: `src/data/survey.ts`.
- Habits: `src/data/habits.ts`.
- Character sprites (letter grids): `src/lib/sprite.ts`.
- The earlier pay-later calendar version is on the `calendar-v1` branch.
