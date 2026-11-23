import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  appendVisit,
  classifySource,
  deviceFromWidth,
  isBot,
  parseBrowser,
  parseOs,
  readVisits,
  summarizeVisits,
  type VisitRange,
} from "@/lib/visits";

export const runtime = "nodejs";

const recentPosts = new Map<string, { count: number; reset: number }>();

function allowPost(key: string) {
  const now = Date.now();
  const current = recentPosts.get(key);
  if (!current || current.reset < now) {
    recentPosts.set(key, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (current.count >= 40) return false;
  current.count += 1;
  return true;
}

function cleanPath(value: unknown) {
  const path = String(value || "").trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return "";
  const bare = path.split("?")[0].slice(0, 180);
  if (bare.startsWith("/admin") || bare.startsWith("/api")) return "";
  return bare;
}

function cleanReferrer(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return `${url.origin}${url.pathname}`.slice(0, 180);
  } catch {
    return "";
  }
}

function cleanLanguage(value: unknown) {
  const language = String(value || "").trim().slice(0, 12);
  return /^[a-z]{2}(?:-[a-z0-9]{2,8})?$/i.test(language) ? language.toLowerCase() : "";
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rangeParam = new URL(request.url).searchParams.get("range");
  const range: VisitRange = rangeParam === "today" || rangeParam === "30d" ? rangeParam : "7d";
  const visits = await readVisits();
  return NextResponse.json(summarizeVisits(visits, range));
}

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  if (!ua || isBot(ua)) return NextResponse.json({ ok: true, skipped: true });
  if (!allowPost(ua.slice(0, 80))) return NextResponse.json({ ok: true, skipped: true });

  const body = await request.json().catch(() => null);
  const path = cleanPath(body?.path);
  if (!path) return NextResponse.json({ ok: true, skipped: true });

  const referrer = cleanReferrer(body?.referrer);
  const siteHost = (request.headers.get("host") || "").split(":")[0].replace(/^www\./, "");
  const width = Number(body?.width);
  const language = cleanLanguage(body?.language);

  await appendVisit({
    id: `${Date.now()}-${randomBytes(3).toString("hex")}`,
    at: new Date().toISOString(),
    path,
    referrer,
    source: classifySource(referrer, siteHost),
    device: deviceFromWidth(Number.isFinite(width) ? width : 0, ua),
    browser: parseBrowser(ua),
    os: parseOs(ua),
    language: language || "other",
  });

  return NextResponse.json({ ok: true });
}
