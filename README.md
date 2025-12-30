
# Portfolio (Next.js + Tailwind + Three.js)

Modernized version of my portfolio built with Next.js App Router, TailwindCSS, and a lightweight Three.js hero.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Global heart counter (optional)

The heart button uses a global counter via `POST /api/hearts`.

- On Vercel, enable **Vercel KV** for this project and it will persist across deploys/visitors.
- Without KV configured, the app falls back to an in-memory counter (resets on server restart) and then to local browser storage.

