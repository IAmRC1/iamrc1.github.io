import { promises as fs } from "node:fs";
import path from "node:path";

export type StatusData = {
  nowBuilding: string;
  lastShipped: string; // YYYY-MM-DD
  githubUsername: string;
  stravaWeeklyKm: number;
};

const STATUS_PATH = path.join(process.cwd(), "content", "status.json");

export async function getStatus(): Promise<StatusData> {
  const fallback: StatusData = {
    nowBuilding: "",
    lastShipped: "",
    githubUsername: "",
    stravaWeeklyKm: 0,
  };

  try {
    const raw = await fs.readFile(STATUS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<StatusData>;

    return {
      nowBuilding: typeof parsed.nowBuilding === "string" ? parsed.nowBuilding : fallback.nowBuilding,
      lastShipped: typeof parsed.lastShipped === "string" ? parsed.lastShipped : fallback.lastShipped,
      githubUsername: typeof parsed.githubUsername === "string" ? parsed.githubUsername : fallback.githubUsername,
      stravaWeeklyKm: typeof parsed.stravaWeeklyKm === "number" && Number.isFinite(parsed.stravaWeeklyKm)
        ? parsed.stravaWeeklyKm
        : fallback.stravaWeeklyKm,
    };
  } catch {
    return fallback;
  }
}
