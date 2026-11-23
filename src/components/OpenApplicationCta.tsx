"use client";

import { useState } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useLanguage } from "@/components/LanguageProvider";

export function OpenApplicationCta() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section className="section bg-white pt-0">
      <div className="container">
        <div className="border border-[var(--line)] bg-[var(--surface)] px-6 py-8 md:px-8 md:py-10">
          <h2 className="font-display text-xl font-medium tracking-tight md:text-2xl">
            {t.openApplyTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            {t.openApplyLead}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex items-center justify-center border border-[var(--ink)] px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--ink)] hover:!text-[var(--bg)]"
          >
            {t.openApplyCta}
          </button>
        </div>
      </div>

      <ApplicationModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
