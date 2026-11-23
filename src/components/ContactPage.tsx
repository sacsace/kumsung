"use client";

import { ContactForm } from "@/components/ContactForm";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { PageIntro } from "@/components/PageIntro";
import { SiteFrame } from "@/components/SiteFrame";
import { OfficeMaps } from "@/components/OfficeMaps";
import type { SiteContent } from "@/lib/types";

function ContactSections() {
  const { content, t } = useLanguage();
  const { company } = content;

  return (
    <SiteFrame>
        <PageIntro eyebrow={t.contactLabel} title={t.contactTitle} lead={t.contactLead} />

        <section id="inquiry" className="section scroll-mt-24 bg-white text-[var(--ink)]">
          <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div id="visit" className="scroll-mt-24 space-y-4 text-sm text-[var(--muted)]">
              <h2 className="font-display text-3xl tracking-[-0.04em] text-[var(--signal)]">{t.nav.contact}</h2>
              {company.branchIndia?.trim() ? (
                <div>
                  <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">
                    {t.fields.branchIndia}
                  </p>
                  <p className="mt-1 leading-relaxed text-[var(--ink)]">{company.branchIndia}</p>
                </div>
              ) : null}
              {company.chennaiOffice?.trim() ? (
                <div>
                  <p className="text-xs font-semibold tracking-wide text-[var(--steel)]">
                    {t.fields.chennaiOffice}
                  </p>
                  <p className="mt-1 leading-relaxed text-[var(--ink)]">{company.chennaiOffice}</p>
                </div>
              ) : null}
              {company.email ? (
                <p>
                  <a
                    className="font-semibold text-[var(--ink)] underline underline-offset-4"
                    href={`mailto:${company.email}`}
                  >
                    {company.email}
                  </a>
                </p>
              ) : null}
              {company.cin?.trim() || company.pan?.trim() ? (
                <p className="text-xs text-[var(--muted)]">
                  {company.cin?.trim() ? `CIN: ${company.cin}` : ""}
                  {company.pan?.trim() ? `${company.cin?.trim() ? " · " : ""}PAN: ${company.pan}` : ""}
                </p>
              ) : null}
            </div>

            <ContactForm />
          </div>

          {company.branchIndiaMapEmbed?.trim() || company.chennaiMapEmbed?.trim() ? (
          <div className="container">
            <OfficeMaps
              bangaloreLabel={t.fields.branchIndia}
              bangaloreAddress={company.branchIndia}
              bangaloreMapEmbed={company.branchIndiaMapEmbed}
              chennaiLabel={t.fields.chennaiOffice}
              chennaiAddress={company.chennaiOffice}
              chennaiMapEmbed={company.chennaiMapEmbed}
              openInMapsLabel={t.openInMaps}
            />
          </div>
          ) : null}
        </section>
    </SiteFrame>
  );
}

export function ContactPage({
  content,
  initialLocale,
}: {
  content: SiteContent;
  initialLocale?: "ko" | "en";
}) {
  return (
    <LanguageProvider siteContent={content} initialLocale={initialLocale}>
      <ContactSections />
    </LanguageProvider>
  );
}
