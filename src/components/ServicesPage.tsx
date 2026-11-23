"use client";

import Image from "next/image";
import { useState } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { PageIntro } from "@/components/PageIntro";
import { SiteFrame } from "@/components/SiteFrame";
import { servicesPageExtraUi } from "@/lib/products";
import { defaultServicesContent } from "@/lib/services-default";
import type { Locale, SiteContent } from "@/lib/types";

const ctaBtnClass =
  "inline-flex items-center justify-center border border-[var(--ink)] px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--ink)] hover:!text-[var(--bg)]";

function ServicesSections() {
  const { locale, content, t } = useLanguage();
  const [applyOpen, setApplyOpen] = useState(false);
  const copy = content.services || defaultServicesContent(locale);
  const extra = servicesPageExtraUi[locale];

  return (
    <SiteFrame>
        <PageIntro eyebrow={copy.label} title={copy.title} lead={copy.lead} />

        <section className="section bg-white">
          <div className="container">
            <p className="section-label">{copy.offeringsLabel}</p>
            <h2 className="section-title">{copy.offeringsTitle}</h2>
            <p className="section-lead">{copy.offeringsLead}</p>

            <div className="mt-8 grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
              {copy.offerings.map((item, index) => (
                <div key={item.id} className="relative overflow-hidden bg-white p-5 md:p-6">
                  <span className="absolute top-0 right-0 h-10 w-10 bg-[var(--signal)]" aria-hidden />
                  <p className="font-display text-4xl leading-none tracking-[-0.04em] text-[var(--signal)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 inline bg-[var(--ink)] px-1.5 py-0.5 text-[0.95rem] font-semibold tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-[#f5f7f9]">
          <div className="container">
            <p className="section-label">{copy.equipmentLabel}</p>
            <h2 className="section-title">{copy.equipmentTitle}</h2>
            <p className="section-lead">{copy.equipmentLead}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {copy.brands.map((brand) => {
                const cover = brand.products[0]?.image;
                return (
                  <a
                    key={brand.id || brand.slug}
                    href={`/services/${brand.slug}`}
                    className="group flex flex-col overflow-hidden border border-[var(--line)] bg-white transition-colors hover:border-[var(--steel)]"
                  >
                    <div className="relative aspect-[4/3] bg-[#eef1f4]">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={brand.brand}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <h3 className="text-[0.98rem] font-semibold tracking-wide text-[var(--ink)]">
                        {brand.brand}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                        {brand.lead}
                      </p>
                      <span className="mt-4 text-xs font-semibold tracking-[0.08em] text-[var(--steel)]">
                        {copy.viewDocs} →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="mt-10 space-y-4">
              {copy.categories.map((category) => (
                <article
                  key={category.id}
                  id={category.id}
                  className="border border-[var(--line)] bg-white p-5 md:p-6"
                >
                  <h3 className="text-[1.02rem] font-semibold tracking-wide text-[var(--ink)]">
                    {category.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    {category.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <li key={`${category.id}-${item.slug}-${item.label}`}>
                        <a
                          href={`/services/${item.slug}`}
                          className="inline-flex items-center border border-[var(--line)] bg-[#f8fafb] px-3 py-1.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--steel)] hover:bg-white"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {category.file ? (
                    <a
                      href={
                        category.fileName
                          ? `${category.file}?download=${encodeURIComponent(category.fileName)}`
                          : category.file
                      }
                      className="mt-4 inline-flex w-fit border border-[var(--navy)] bg-white px-3.5 py-2 text-sm font-semibold tracking-wide text-[var(--navy)] transition hover:bg-[var(--navy)] hover:!text-white"
                      download={category.fileName || true}
                    >
                      {extra.download}
                      {category.fileName ? (
                        <span className="ml-2 font-normal text-[var(--muted)]">
                          ({category.fileName})
                        </span>
                      ) : null}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--line)] py-12">
          <div className="container flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-medium tracking-tight md:text-2xl">{copy.ctaTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{copy.ctaLead}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a href="/contact#inquiry" className={ctaBtnClass}>
                {copy.ctaButton}
              </a>
              <button type="button" onClick={() => setApplyOpen(true)} className={ctaBtnClass}>
                {t.openApplyCta}
              </button>
            </div>
          </div>
        </section>
      <ApplicationModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </SiteFrame>
  );
}

export function ServicesPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale: Locale;
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <ServicesSections />
    </LanguageProvider>
  );
}
