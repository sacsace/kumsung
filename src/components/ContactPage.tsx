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

        <section id="inquiry" className="scroll-mt-24 bg-white px-[var(--page-x)] py-12 text-[var(--ink)] md:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-16">
            <div id="visit" className="scroll-mt-24 space-y-4 text-sm text-[var(--muted)]">
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
              {company.phone?.trim() ? (
                <p className="font-semibold text-[var(--ink)]">{company.phone}</p>
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

          {company.chennaiOffice?.trim() || company.chennaiMapEmbed?.trim() ? (
            <OfficeMaps
              bangaloreLabel=""
              bangaloreAddress=""
              chennaiLabel={t.fields.chennaiOffice}
              chennaiAddress={company.chennaiOffice}
              chennaiMapEmbed={company.chennaiMapEmbed}
              openInMapsLabel={t.openInMaps}
            />
          ) : null}

          <div id="privacy" className="mt-12 grid gap-8 border-t border-[var(--line)] pt-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl tracking-[-0.04em]">{t.contactForm.stepsTitle}</h2>
              <ol className="mt-4 space-y-2 text-sm leading-relaxed">
                {t.contactForm.steps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="font-display text-2xl tracking-[-0.04em]">{t.contactForm.privacyTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{t.contactForm.privacyBody}</p>
            </div>
          </div>
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
