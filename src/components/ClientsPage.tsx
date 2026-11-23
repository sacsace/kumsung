"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { PageIntro } from "@/components/PageIntro";
import { SiteFrame } from "@/components/SiteFrame";
import { SafeSearchInput } from "@/components/SafeSearchInput";
import type { ClientItem, Locale, SiteContent } from "@/lib/types";

function ClientCard({ client }: { client: ClientItem }) {
  return (
    <div className="flex min-h-[112px] flex-col items-center justify-center gap-2.5 rounded-md border border-[var(--line)] bg-white px-4 py-4 text-center">
      <div className="relative flex h-12 w-full items-center justify-center">
        {client.logo ? (
          <Image
            src={client.logo}
            alt={client.name}
            fill
            className="object-contain"
            sizes="220px"
          />
        ) : (
          <div className="h-full w-full rounded-md bg-[#f5f7f9]" aria-hidden />
        )}
      </div>
      <p className="text-sm font-medium tracking-wide text-[var(--ink)]">
        {client.name || "—"}
      </p>
    </div>
  );
}

function ClientsSections() {
  const { content, t } = useLanguage();
  const [query, setQuery] = useState("");
  const clients = content.clients;
  const allItems = clients?.items || [];

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((client) => (client.name || "").toLowerCase().includes(q));
  }, [allItems, query]);

  return (
    <SiteFrame>
        <PageIntro
          eyebrow={t.clientsLabel}
          title={clients?.title || t.clientsTitle}
          lead={clients?.lead || t.clientsLead}
        />

        <section className="section bg-white">
          <div className="container">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--muted)]">
                {query.trim()
                  ? t.clientsResultCount(items.length, allItems.length)
                  : t.clientsTotalCount(allItems.length)}
              </p>
              <label className="block w-full max-w-md sm:ml-auto">
                <span className="sr-only">{t.clientsSearch}</span>
                <SafeSearchInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.clientsSearchPlaceholder}
                  aria-label={t.clientsSearch}
                  className="w-full border border-[var(--line)] bg-[#f8fafb] px-3 py-2.5 text-sm outline-none focus:border-[var(--navy)] focus:bg-white"
                />
              </label>
            </div>

            {allItems.length === 0 ? (
              <p className="text-[var(--muted)]">{t.clientsEmpty}</p>
            ) : items.length === 0 ? (
              <p className="text-[var(--muted)]">{t.clientsNoResults}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </div>
            )}
          </div>
        </section>
    </SiteFrame>
  );
}

export function ClientsPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: Locale;
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <ClientsSections />
    </LanguageProvider>
  );
}
