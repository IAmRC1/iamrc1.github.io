import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const STORAGE_KEY = "portfolio:hearts_total";
const DEV_FILE_PATH = path.join(process.cwd(), ".data", "hearts.json");

type Store = {
  get: () => Promise<number>;
  incr: (by?: number) => Promise<number>;
};

function getMemoryStore(): Store {
  const g = globalThis as unknown as {
    __PORTFOLIO_HEARTS__?: { count: number };
  };

  g.__PORTFOLIO_HEARTS__ ??= { count: 0 };

  return {
    async get() {
      return g.__PORTFOLIO_HEARTS__?.count ?? 0;
    },
    async incr(by = 1) {
      const inc = Number.isFinite(by) ? Math.max(1, Math.floor(by)) : 1;
      g.__PORTFOLIO_HEARTS__!.count += inc;
      return g.__PORTFOLIO_HEARTS__!.count;
    },
  };
}

function getDevFileStore(): Store {
  async function readCount(): Promise<number> {
    try {
      const raw = await fs.readFile(DEV_FILE_PATH, "utf8");
      const parsed = JSON.parse(raw) as { count?: unknown };
      return typeof parsed.count === "number" ? parsed.count : 0;
    } catch {
      return 0;
    }
  }

  async function writeCount(count: number) {
    await fs.mkdir(path.dirname(DEV_FILE_PATH), { recursive: true });
    await fs.writeFile(DEV_FILE_PATH, JSON.stringify({ count }, null, 2), "utf8");
  }

  return {
    async get() {
      return await readCount();
    },
    async incr(by = 1) {
      const inc = Number.isFinite(by) ? Math.max(1, Math.floor(by)) : 1;
      const current = await readCount();
      const next = current + inc;
      await writeCount(next);
      return next;
    },
  };
}

async function getStore(): Promise<Store> {
  // Prefer Vercel KV if configured. Falls back to in-memory store when KV
  // isn't available (local dev without env vars, etc.).
  const hasKvEnv = Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );

  if (!hasKvEnv) {
    if (process.env.NODE_ENV !== "production") return getDevFileStore();
    return getMemoryStore();
  }

  try {
    const { kv } = await import("@vercel/kv");

    return {
      async get() {
        try {
          const v = await kv.get<number>(STORAGE_KEY);
          return typeof v === "number" ? v : 0;
        } catch {
          return 0;
        }
      },
      async incr(by = 1) {
        const inc = Number.isFinite(by) ? Math.max(1, Math.floor(by)) : 1;
        try {
          const next = inc === 1 ? await kv.incr(STORAGE_KEY) : await kv.incrby(STORAGE_KEY, inc);
          return typeof next === "number" ? next : 0;
        } catch {
          return 0;
        }
      },
    };
  } catch {
    if (process.env.NODE_ENV !== "production") return getDevFileStore();
    return getMemoryStore();
  }
}

export async function GET() {
  const store = await getStore();
  const count = await store.get();
  return NextResponse.json({ count });
}

export async function POST(req: Request) {
  const store = await getStore();

  let increment = 1;
  try {
    const body = (await req.json()) as { increment?: unknown };
    const n = typeof body?.increment === "number" ? body.increment : Number(body?.increment);
    if (Number.isFinite(n)) increment = Math.max(1, Math.floor(n));
  } catch {
    // no body => default increment
  }

  const count = await store.incr(increment);
  return NextResponse.json({ count });
}
