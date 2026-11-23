import { promises as fs } from "fs";
import path from "path";
import { getDataDir } from "@/lib/storage";

export type VisitSource = "direct" | "search" | "social" | "referral" | "internal";
export type VisitDevice = "mobile" | "tablet" | "desktop";

export type Visit = {
  id: string;
  at: string;
  path: string;
  referrer: string;
  source: VisitSource;
  device: VisitDevice;
  browser: string;
  os: string;
  language: string;
};

export type VisitRange = "today" | "7d" | "30d";

const MAX_VISITS = 3000;
let writeQueue: Promise<void> = Promise.resolve();

export function visitsFilePath() {
  return path.join(getDataDir(), "visits.json");
}

export async function readVisits(): Promise<Visit[]> {
  try {
    const raw = await fs.readFile(visitsFilePath(), "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendVisit(visit: Visit) {
  const run = writeQueue.then(async () => {
    const items = await readVisits();
    items.unshift(visit);
    await fs.mkdir(getDataDir(), { recursive: true });
    const file = visitsFilePath();
    const next = JSON.stringify(items.slice(0, MAX_VISITS), null, 2);
    await fs.writeFile(file, next, "utf-8");
  });
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

const SEARCH_HOSTS = ["google.", "bing.", "yahoo.", "duckduckgo.", "naver.", "daum.", "baidu.", "ecosia."];
const SOCIAL_HOSTS = [
  "facebook.",
  "instagram.",
  "l.instagram.",
  "t.co",
  "twitter.",
  "x.com",
  "linkedin.",
  "pinterest.",
  "youtube.",
  "tiktok.",
  "threads.net",
];

export function classifySource(referrer: string, siteHost: string): VisitSource {
  if (!referrer) return "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "direct";
  }
  if (!host) return "direct";
  if (siteHost && (host === siteHost || host.endsWith(`.${siteHost}`))) return "internal";
  if (SEARCH_HOSTS.some((name) => host.includes(name))) return "search";
  if (SOCIAL_HOSTS.some((name) => host === name || host.endsWith(name) || host.includes(name))) return "social";
  return "referral";
}

export function parseBrowser(ua: string) {
  const agent = ua.toLowerCase();
  if (agent.includes("edg/")) return "Edge";
  if (agent.includes("chrome/") || agent.includes("crios/")) return "Chrome";
  if (agent.includes("firefox/") || agent.includes("fxios/")) return "Firefox";
  if (agent.includes("safari/") && !agent.includes("chrome/")) return "Safari";
  return "Other";
}

export function parseOs(ua: string) {
  const agent = ua.toLowerCase();
  if (agent.includes("android")) return "Android";
  if (agent.includes("iphone") || agent.includes("ipad") || agent.includes("ios")) return "iOS";
  if (agent.includes("mac os")) return "macOS";
  if (agent.includes("windows")) return "Windows";
  if (agent.includes("linux")) return "Linux";
  return "Other";
}

export function deviceFromWidth(width: number, ua: string): VisitDevice {
  if (width > 0) {
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }
  const agent = ua.toLowerCase();
  if (agent.includes("ipad") || agent.includes("tablet")) return "tablet";
  if (agent.includes("mobile") || agent.includes("iphone") || agent.includes("android")) return "mobile";
  return "desktop";
}

export function isBot(ua: string) {
  return /bot|crawler|spider|preview|slurp|facebookexternalhit|headless/i.test(ua);
}

export function rangeStart(range: VisitRange, now = new Date()) {
  if (range === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }
  const days = range === "30d" ? 30 : 7;
  return now.getTime() - days * 24 * 60 * 60 * 1000;
}

function tally(visits: Visit[], pick: (visit: Visit) => string) {
  const counts = new Map<string, number>();
  for (const visit of visits) {
    const key = pick(visit) || "Other";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function summarizeVisits(visits: Visit[], range: VisitRange) {
  const start = rangeStart(range);
  const rows = visits.filter((visit) => {
    const time = Date.parse(visit.at);
    return Number.isFinite(time) && time >= start;
  });
  const landings = rows.filter((visit) => visit.source !== "internal");
  const direct = landings.filter((visit) => visit.source === "direct").length;
  const mobile = rows.filter((visit) => visit.device === "mobile").length;

  return {
    range,
    totals: {
      visits: rows.length,
      landings: landings.length,
      direct,
      external: landings.length - direct,
      mobileShare: rows.length ? Math.round((mobile / rows.length) * 100) : 0,
    },
    sources: tally(landings, (visit) => visit.source),
    devices: tally(rows, (visit) => visit.device),
    browsers: tally(rows, (visit) => visit.browser),
    systems: tally(rows, (visit) => visit.os),
    languages: tally(rows, (visit) => visit.language || "Other"),
    pages: tally(rows, (visit) => visit.path).slice(0, 8),
    recent: rows.slice(0, 12),
  };
}
