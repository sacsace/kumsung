"use client";

import type { SiteContent } from "@/lib/types";
import { sortPerformances } from "@/lib/types";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { LetterMasthead } from "@/components/LetterMasthead";
import { SiteFrame } from "@/components/SiteFrame";
import { isSamplePerformance } from "@/lib/public-content";
import { siteNav } from "@/lib/ui";

function HomeSections() {
  const { content, t } = useLanguage();
  const rows = sortPerformances(content.performances || [], true).filter(
    (row) =>
      (row.date?.trim() || row.detail?.trim() || row.client?.trim()) && !isSamplePerformance(row),
  );
  const note =
    (content.greeting?.body || t.studioStatement)
      .split(/\n+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(" ") || t.studioStatement;
  const hasTeam = Boolean(
    content.team?.ceo?.name?.trim() || content.team?.members?.some((member) => member.name?.trim()),
  );
  const contents = siteNav(t, { includeTeam: hasTeam }).filter((item) => item.href !== "/");

  return (
    <SiteFrame>
      <LetterMasthead />
      <section className="flex flex-wrap items-end justify-between gap-6 px-[var(--page-x)] pt-2 pb-8">
        <div className="max-w-xl">
          <p className="text-[0.72rem] tracking-[0.16em] text-[var(--signal)] uppercase">
            Kumsung Engineering Private Limited
          </p>
          <p className="mt-3 text-[1.05rem] leading-relaxed">{t.heroDiscipline}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/performance" className="btn btn-primary">
            {t.viewProjects}
          </a>
          <a
            href="/contact#inquiry"
            className="inline-flex items-center border border-[var(--ink)] px-5 py-3 text-sm font-semibold hover:border-[var(--signal)] hover:text-[var(--signal)]"
          >
            {t.nav.clients}
          </a>
        </div>
      </section>
      <section className="grid gap-8 border-t border-[var(--ink)] px-[var(--page-x)] py-10 md:grid-cols-[auto_1.25fr_0.75fr] md:gap-10 md:py-14">
        <p
          className="spread-label"
        >
          [ Note ]
        </p>
        <div className="max-w-2xl">
          <p className="font-display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-[1.35] tracking-[-0.03em]">
            {note}
          </p>
        </div>
        <ol className="border-t border-[var(--ink)]">
          {contents.map((item, index) => (
            <li key={item.href} className="border-b border-[var(--line)]">
              <a href={item.href} className="grid grid-cols-[2.6rem_1fr] items-baseline gap-3 py-3 text-sm hover:text-[var(--signal)]">
                <span className="font-display text-[1.15rem] leading-none text-[var(--signal)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
      {rows.length ? (
        <section className="px-[var(--page-x)] pb-16">
          <div className="grid items-end gap-4 border-t border-[var(--ink)] pt-6 sm:grid-cols-[auto_1fr]">
            <p
              className="spread-label"
            >
              [ Index ]
            </p>
            <p className="font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.9] tracking-[-0.05em] text-[var(--signal)]">
              {t.nav.performance}
            </p>
          </div>
          <div className="mt-4">
            {rows.map((row, index) => (
              <a
                key={row.id || `${row.detail}-${index}`}
                href="/performance"
                className="grid gap-4 border-b border-[var(--line)] py-6 sm:grid-cols-[4.5rem_9rem_1fr] sm:items-center sm:gap-6"
              >
                <span className="font-display text-[clamp(2.4rem,4vw,3.4rem)] leading-none tracking-[-0.04em] text-[var(--signal)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="sheet-grid relative block aspect-[4/3] overflow-hidden border border-[var(--line)]" aria-hidden>
                  <span className="absolute top-0 left-0 h-8 w-8 bg-[var(--signal)]" />
                  <span className="absolute right-2 bottom-1 font-display text-5xl leading-none text-[var(--ink)]/15">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <span>
                  <span className="box-decoration-clone inline bg-[var(--signal)] px-1.5 py-0.5 font-display text-[1.15rem] leading-tight text-white">
                    {row.detail}
                  </span>
                  {row.client ? <span className="mt-2 block text-sm text-[var(--muted)]">{row.client}</span> : null}
                  {row.date ? <span className="mt-1 block text-sm text-[var(--muted)]">{row.date}</span> : null}
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </SiteFrame>
  );
}

export function HomePage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: "ko" | "en";
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <HomeSections />
    </LanguageProvider>
  );
}
