"use client";

import { useMemo, useState } from "react";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { PageIntro } from "@/components/PageIntro";
import { SiteFrame } from "@/components/SiteFrame";
import { SafeSearchInput } from "@/components/SafeSearchInput";
import {
  dateSortKey,
  type Locale,
  type PerformanceItem,
  type SiteContent,
} from "@/lib/types";

type SortKey = "date" | "detail" | "client";
type SortDir = "asc" | "desc";

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
}

function sortRows(items: PerformanceItem[], key: SortKey, dir: SortDir) {
  const factor = dir === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    if (key === "date") {
      return (dateSortKey(a.date) - dateSortKey(b.date)) * factor;
    }
    if (key === "detail") {
      return compareText(a.detail || "", b.detail || "") * factor;
    }
    return compareText(a.client || "", b.client || "") * factor;
  });
}

function SortMark({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return <span className="ml-1 inline-block text-[var(--muted)]">↕</span>;
  }
  return <span className="ml-1 inline-block">{dir === "asc" ? "↑" : "↓"}</span>;
}

function PerformanceSections() {
  const { content, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc"); // 최근일 위

  const allRows = useMemo(
    () =>
      (content.performances || []).filter(
        (row) => row.date?.trim() || row.detail?.trim() || row.client?.trim(),
      ),
    [content.performances],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = !q
      ? allRows
      : allRows.filter((row) => {
          const haystack = `${row.date} ${row.detail} ${row.client}`.toLowerCase();
          return haystack.includes(q);
        });
    return sortRows(filtered, sortKey, sortDir);
  }, [allRows, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    // 일자는 기본 최신순(내림차순), 나머지 컬럼은 오름차순
    setSortDir(key === "date" ? "desc" : "asc");
  }

  const headers: { key: SortKey; label: string }[] = [
    { key: "date", label: t.table.date },
    { key: "detail", label: t.table.details },
    { key: "client", label: t.table.client },
  ];

  return (
    <SiteFrame>
        <PageIntro
          eyebrow={t.performanceLabel}
          title={t.performanceTitle}
          lead={t.performanceLead}
        />

        <section className="section bg-white">
          <div className="container">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--muted)]">
                {query.trim()
                  ? t.performanceResultCount(rows.length, allRows.length)
                  : t.performanceTotalCount(allRows.length)}
              </p>
              <label className="block w-full max-w-md text-sm sm:ml-auto">
                <span className="sr-only">{t.performanceSearch}</span>
                <SafeSearchInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.performanceSearchPlaceholder}
                  aria-label={t.performanceSearch}
                  className="w-full border border-[var(--line)] bg-[#f8fafb] px-3 py-2.5 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                />
              </label>
            </div>

            {allRows.length === 0 ? (
              <p className="text-[var(--muted)]">{t.performanceEmpty}</p>
            ) : rows.length === 0 ? (
              <p className="text-[var(--muted)]">{t.performanceNoResults}</p>
            ) : (
              <>
              <div className="mb-2 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                {headers.map((header) => (
                  <button
                    key={header.key}
                    type="button"
                    onClick={() => toggleSort(header.key)}
                    className="inline-flex items-center border border-[var(--line)] bg-white px-2.5 py-1.5 hover:text-[var(--ink)]"
                  >
                    {header.label}
                    <SortMark active={sortKey === header.key} dir={sortDir} />
                  </button>
                ))}
              </div>
              <div className="border-t border-[var(--ink)]">
                {rows.map((row, i) => (
                  <article
                    key={row.id || `${row.date}-${row.client}-${i}`}
                    className="grid gap-4 border-b border-[var(--line)] py-6 sm:grid-cols-[4.5rem_8.5rem_1fr] sm:items-center"
                  >
                    <p className="font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-none tracking-[-0.04em] text-[var(--signal)]">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div className="sheet-grid relative aspect-[4/3] overflow-hidden border border-[var(--line)]" aria-hidden>
                      <span className="absolute top-0 left-0 h-7 w-7 bg-[var(--signal)]" />
                    </div>
                    <div>
                      <h2 className="box-decoration-clone inline bg-[var(--signal)] px-1.5 py-0.5 font-display text-[clamp(1.2rem,2vw,1.55rem)] leading-tight font-medium text-white">
                        {row.detail || "—"}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {[row.client, row.date].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              </>
            )}
          </div>
        </section>
    </SiteFrame>
  );
}

export function PerformancePage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: Locale;
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <PerformanceSections />
    </LanguageProvider>
  );
}
