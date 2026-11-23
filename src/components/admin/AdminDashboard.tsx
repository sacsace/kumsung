"use client";

import { useEffect, useState } from "react";
import type { Locale, SiteContent } from "@/lib/types";
import type { VisitRange, VisitSource } from "@/lib/visits";

type Bucket = { label: string; count: number };
type RecentVisit = {
  id: string;
  at: string;
  path: string;
  referrer: string;
  source: VisitSource;
  device: string;
  browser: string;
  os: string;
  language: string;
};

type Summary = {
  totals: {
    visits: number;
    landings: number;
    direct: number;
    external: number;
    mobileShare: number;
  };
  sources: Bucket[];
  devices: Bucket[];
  browsers: Bucket[];
  systems: Bucket[];
  languages: Bucket[];
  pages: Bucket[];
  recent: RecentVisit[];
};

const RANGES: VisitRange[] = ["today", "7d", "30d"];

function copy(locale: Locale) {
  const en = locale === "en";
  return {
    lead: en
      ? "Where visits begin, and the environment they arrive in."
      : "방문이 어디서 시작되는지, 어떤 환경으로 들어왔는지.",
    ranges: {
      today: en ? "Today" : "오늘",
      "7d": en ? "7 days" : "7일",
      "30d": en ? "30 days" : "30일",
    } as Record<VisitRange, string>,
    visits: en ? "Page views" : "페이지 조회",
    landings: en ? "Arrivals" : "유입",
    direct: en ? "Direct" : "직접 유입",
    external: en ? "Referred" : "외부 유입",
    mobile: en ? "Mobile" : "모바일",
    sources: en ? "Source" : "유입 경로",
    environment: en ? "Environment" : "유입 환경",
    device: en ? "Device" : "기기",
    browser: en ? "Browser" : "브라우저",
    system: en ? "System" : "운영체제",
    language: en ? "Language" : "언어",
    pages: en ? "Pages" : "페이지",
    recent: en ? "Recent arrivals" : "최근 유입",
    empty: en ? "No visits in this period yet." : "이 기간에 기록된 방문이 없습니다.",
    time: en ? "Time" : "시간",
    path: en ? "Page" : "페이지",
    from: en ? "From" : "들어온 곳",
    loading: en ? "Loading…" : "불러오는 중…",
    failed: en ? "Could not load visits." : "방문 기록을 불러오지 못했습니다.",
    adminExcluded: en
      ? "Visits to the admin pages are not counted."
      : "관리자 화면 방문은 집계하지 않습니다.",
    work: en ? "To do" : "운영",
    openInquiries: en ? "Open inquiries" : "미처리 문의",
    missingMedia: en ? "Missing photos" : "사진 없는 항목",
    translation: en ? "English still empty" : "영어 미입력",
    storage: en ? "File storage" : "파일 저장소",
    mail: en ? "Mail" : "메일 발송",
    storageOk: en ? "Ready" : "정상",
    storageSetup: en ? "Setup needed" : "설정 필요",
    mailOn: en ? "Ready to send" : "발송 가능",
    mailOff: en ? "Not ready" : "설정 필요",
    backup: en ? "Last backup" : "마지막 백업",
    backupNone: en ? "Not recorded" : "기록 없음",
    sourceLabel: {
      direct: en ? "Direct" : "직접",
      search: en ? "Search" : "검색",
      social: en ? "Social" : "소셜",
      referral: en ? "Referral" : "다른 사이트",
      internal: en ? "On site" : "사이트 안",
    } as Record<string, string>,
    deviceLabel: {
      mobile: en ? "Mobile" : "모바일",
      tablet: en ? "Tablet" : "태블릿",
      desktop: en ? "Desktop" : "데스크톱",
    } as Record<string, string>,
  };
}

function Bars({
  items,
  labelFor,
}: {
  items: Bucket[];
  labelFor?: (label: string) => string;
}) {
  const max = Math.max(1, ...items.map((item) => item.count));
  if (!items.length) return <p className="text-sm text-[var(--muted)]">—</p>;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span>{labelFor ? labelFor(item.label) : item.label}</span>
            <span className="text-[var(--muted)]">{item.count}</span>
          </div>
          <div className="mt-1.5 h-px bg-[var(--line)]">
            <div
              className="h-px bg-[var(--signal)]"
              style={{ width: `${Math.max(6, (item.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--line)] bg-white px-4 py-4">
      <p className="text-[0.68rem] tracking-[0.16em] text-[var(--muted)] uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl tracking-[-0.04em]">{value}</p>
    </div>
  );
}

function hostOf(referrer: string) {
  if (!referrer) return "—";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

function contentGaps(content: SiteContent) {
  let missingMedia = 0;
  let translation = 0;
  for (const locale of ["ko", "en"] as const) {
    const page = content[locale];
    if (!page?.team?.ceo?.photo?.trim() && page?.team?.ceo?.name?.trim()) missingMedia += 1;
    for (const member of page?.team?.members || []) {
      if (member.name?.trim() && !member.photo?.trim()) missingMedia += 1;
    }
    for (const item of page?.gallery?.items || []) {
      if (!item.image?.trim()) missingMedia += 1;
    }
    for (const slide of page?.hero?.slides || []) {
      if (!slide.src?.trim()) missingMedia += 1;
    }
  }
  const pairs: [string, string][] = [
    [content.ko?.greeting?.title, content.en?.greeting?.title],
    [content.ko?.greeting?.body, content.en?.greeting?.body],
    [content.ko?.services?.title, content.en?.services?.title],
    [content.ko?.services?.lead, content.en?.services?.lead],
    [content.ko?.company?.chennaiOffice, content.en?.company?.chennaiOffice],
    [content.ko?.hero?.headline, content.en?.hero?.headline],
  ];
  for (const [ko, en] of pairs) {
    if (ko?.trim() && !en?.trim()) translation += 1;
    if (en?.trim() && !ko?.trim()) translation += 1;
  }
  return { missingMedia, translation };
}

export function AdminDashboard({ locale, content }: { locale: Locale; content: SiteContent }) {
  const t = copy(locale);
  const [range, setRange] = useState<VisitRange>("7d");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [ops, setOps] = useState({ inquiries: 0, mailReady: false, storageOk: true });

  const gaps = contentGaps(content);

  useEffect(() => {
    let cancelled = false;
    setError("");
    void fetch(`/api/visits?range=${range}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("failed");
        return response.json() as Promise<Summary>;
      })
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setError(t.failed);
      });
    return () => {
      cancelled = true;
    };
  }, [range, t.failed]);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      fetch("/api/inquiries").then((response) => (response.ok ? response.json() : [])),
      fetch("/api/mail").then((response) => (response.ok ? response.json() : null)),
      fetch("/api/storage").then((response) => (response.ok ? response.json() : null)),
    ]).then(([inquiries, mail, storage]) => {
      if (cancelled) return;
      const list = Array.isArray(inquiries) ? inquiries : [];
      setOps({
        inquiries: list.filter((item) => !item?.status || item.status !== "replied").length,
        mailReady: Boolean(mail?.enabled && mail?.hasPassword && mail?.to),
        storageOk: storage?.state !== "setup",
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-3 py-6 sm:px-4 md:px-6 md:py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="max-w-xl text-sm text-[var(--muted)]">{t.lead}</p>
          <p className="mt-2 text-xs text-[var(--muted)]">{t.adminExcluded}</p>
        </div>
        <div className="flex border border-[var(--line)] bg-white">
          {RANGES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`px-3 py-1.5 text-xs tracking-[0.08em] ${
                range === item ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"
              }`}
            >
              {t.ranges[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label={t.openInquiries} value={String(ops.inquiries)} />
        <Stat label={t.missingMedia} value={String(gaps.missingMedia)} />
        <Stat label={t.translation} value={String(gaps.translation)} />
        <Stat label={t.storage} value={ops.storageOk ? t.storageOk : t.storageSetup} />
        <Stat label={t.mail} value={ops.mailReady ? t.mailOn : t.mailOff} />
        <Stat label={t.backup} value={t.backupNone} />
      </div>

      {error ? <p className="mt-6 text-sm text-red-700">{error}</p> : null}
      {!summary && !error ? <p className="mt-6 text-sm text-[var(--muted)]">{t.loading}</p> : null}

      {summary ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label={t.visits} value={String(summary.totals.visits)} />
            <Stat label={t.landings} value={String(summary.totals.landings)} />
            <Stat label={t.external} value={String(summary.totals.external)} />
            <Stat label={t.mobile} value={`${summary.totals.mobileShare}%`} />
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="border border-[var(--line)] bg-white p-5">
              <h2 className="text-[0.68rem] tracking-[0.16em] uppercase">{t.sources}</h2>
              <div className="mt-5">
                <Bars items={summary.sources} labelFor={(label) => t.sourceLabel[label] || label} />
              </div>
              <p className="mt-5 text-xs text-[var(--muted)]">
                {t.direct} {summary.totals.direct}
              </p>
            </section>

            <section className="border border-[var(--line)] bg-white p-5">
              <h2 className="text-[0.68rem] tracking-[0.16em] uppercase">{t.environment}</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-xs text-[var(--muted)]">{t.device}</p>
                  <Bars items={summary.devices} labelFor={(label) => t.deviceLabel[label] || label} />
                </div>
                <div>
                  <p className="mb-3 text-xs text-[var(--muted)]">{t.browser}</p>
                  <Bars items={summary.browsers} />
                </div>
                <div>
                  <p className="mb-3 text-xs text-[var(--muted)]">{t.system}</p>
                  <Bars items={summary.systems} />
                </div>
                <div>
                  <p className="mb-3 text-xs text-[var(--muted)]">{t.language}</p>
                  <Bars items={summary.languages} />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[0.7fr_1.3fr]">
            <section className="border border-[var(--line)] bg-white p-5">
              <h2 className="text-[0.68rem] tracking-[0.16em] uppercase">{t.pages}</h2>
              <div className="mt-5">
                <Bars items={summary.pages} />
              </div>
            </section>

            <section className="border border-[var(--line)] bg-white">
              <h2 className="border-b border-[var(--line)] px-5 py-4 text-[0.68rem] tracking-[0.16em] uppercase">
                {t.recent}
              </h2>
              {summary.recent.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-left text-sm">
                    <thead className="text-[0.68rem] tracking-[0.12em] text-[var(--muted)] uppercase">
                      <tr>
                        <th className="px-5 py-3 font-medium">{t.time}</th>
                        <th className="px-3 py-3 font-medium">{t.path}</th>
                        <th className="px-3 py-3 font-medium">{t.sources}</th>
                        <th className="px-3 py-3 font-medium">{t.from}</th>
                        <th className="px-5 py-3 font-medium">{t.environment}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recent.map((visit) => (
                        <tr key={visit.id} className="border-t border-[var(--line)]">
                          <td className="px-5 py-3 whitespace-nowrap text-[var(--muted)]">
                            {new Date(visit.at).toLocaleString(locale === "ko" ? "ko-KR" : "en-GB", {
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-3 py-3">{visit.path}</td>
                          <td className="px-3 py-3">{t.sourceLabel[visit.source] || visit.source}</td>
                          <td className="px-3 py-3 text-[var(--muted)]">{hostOf(visit.referrer)}</td>
                          <td className="px-5 py-3 text-[var(--muted)]">
                            {[t.deviceLabel[visit.device] || visit.device, visit.browser, visit.os, visit.language]
                              .filter(Boolean)
                              .join(" · ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-5 py-8 text-sm text-[var(--muted)]">{t.empty}</p>
              )}
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
