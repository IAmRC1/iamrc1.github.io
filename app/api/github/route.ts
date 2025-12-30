import { NextResponse } from "next/server";
import { GITHUB_ACCEPT_HEADER, PORTFOLIO_USER_AGENT } from "@/lib/http";

export const runtime = "nodejs";

function toString(v: string | null) {
  if (!v) return null;
  const s = v.trim();
  return s ? s : null;
}

function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

type GitHubEvent = {
  type?: string;
  created_at?: string;
  payload?: {
    action?: string;
    pull_request?: { created_at?: string };
  };
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = toString(url.searchParams.get("user"));
  if (!user) {
    return NextResponse.json({ error: "Missing user" }, { status: 400 });
  }

  const endpoint = `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100`;

  const res = await fetch(endpoint, {
    headers: {
      accept: GITHUB_ACCEPT_HEADER,
      "user-agent": PORTFOLIO_USER_AGENT,
    },
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "GitHub fetch failed" }, { status: 502 });
  }

  const events = (await res.json()) as GitHubEvent[];
  const now = new Date();
  const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let lastActivityAt: Date | null = null;
  let prs30d = 0;

  for (const e of events) {
    const created = e.created_at ? new Date(e.created_at) : null;
    if (created && !Number.isNaN(created.getTime())) {
      if (!lastActivityAt || created > lastActivityAt) lastActivityAt = created;
    }

    if (e.type === "PullRequestEvent") {
      const prCreatedRaw = e.payload?.pull_request?.created_at ?? e.created_at;
      const prCreated = prCreatedRaw ? new Date(prCreatedRaw) : null;
      const action = e.payload?.action;
      if (action === "opened" && prCreated && !Number.isNaN(prCreated.getTime()) && prCreated >= since30d) {
        prs30d += 1;
      }
    }
  }

  return NextResponse.json({
    user,
    prs30d,
    lastActivityDaysAgo: lastActivityAt ? daysBetween(now, lastActivityAt) : null,
    updatedAt: now.toISOString(),
  });
}
