import fs from "fs";
import path from "path";

export type ScoreEntry = {
  name: string;
  email: string;
  score: number;
  createdAt: string;
};

const scoreboardPath = path.join(process.cwd(), "data", "scoreboard.json");

function ensureScoreboardFile() {
  const directory = path.dirname(scoreboardPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  if (!fs.existsSync(scoreboardPath)) {
    fs.writeFileSync(scoreboardPath, "[]", "utf-8");
  }
}

export async function readScoreboard(): Promise<ScoreEntry[]> {
  ensureScoreboardFile();
  const raw = fs.readFileSync(scoreboardPath, "utf-8");
  try {
    return JSON.parse(raw) as ScoreEntry[];
  } catch {
    return [];
  }
}

export async function saveScoreboard(entries: ScoreEntry[]): Promise<void> {
  ensureScoreboardFile();
  fs.writeFileSync(scoreboardPath, JSON.stringify(entries, null, 2), "utf-8");
}

export async function addScoreEntry(entry: ScoreEntry): Promise<ScoreEntry[]> {
  const entries = await readScoreboard();
  entries.push(entry);
  entries.sort(
    (a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt),
  );
  await saveScoreboard(entries);
  return entries;
}

export async function getLeaderboard(): Promise<ScoreEntry[]> {
  const entries = await readScoreboard();
  entries.sort(
    (a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt),
  );
  return entries.slice(0, 10);
}

export async function resetLeaderboard(): Promise<void> {
  ensureScoreboardFile();
  fs.writeFileSync(scoreboardPath, "[]", "utf-8");
}
