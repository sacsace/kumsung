"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useLanguage } from "@/components/LanguageProvider";
import { siteNav } from "@/lib/ui";

const MVS_URL = process.env.NEXT_PUBLIC_MVS_URL || "https://www.mvsystem.in";

function isActive(pathname: string, href: string, hash: string) {
  const [path, fragment] = href.split("#");
  const target = path || "/";
  const pathMatch = target === "/" ? pathname === "/" : pathname === target || pathname.startsWith(`${target}/`);
  if (!pathMatch) return false;
  if (!fragment) return true;
  const current = hash.replace("#", "") || (pathname === "/contact" ? "inquiry" : "");
  return current === fragment;
}

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t, content } = useLanguage();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [hash, setHash] = useState("");
  const links = siteNav(t);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  function SideNav() {
    let number = 0;
    return (
      <nav className="mt-10 flex flex-col gap-1.5" aria-label={t.menu}>
        {links.map((link) => {
          const active = isActive(pathname, link.href, hash);
          const numbered = link.href !== "/";
          if (numbered) number += 1;
          const index = number;
          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-baseline justify-between gap-3 text-[0.92rem] leading-snug ${
                active ? "text-[var(--signal)]" : "text-[var(--muted)] hover:text-[var(--signal)]"
              }`}
            >
              <span>{link.label}</span>
              {numbered ? (
                <span className="font-display text-[1.05rem] leading-none text-[var(--signal)]">{index}.</span>
              ) : (
                <span className="w-4" />
              )}
            </a>
          );
        })}
      </nav>
    );
  }

  function LocaleSwitch() {
    return (
      <p className="flex items-center gap-1.5 tracking-[0.08em]">
        <button
          type="button"
          onClick={() => setLocale("ko")}
          className={locale === "ko" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
          aria-pressed={locale === "ko"}
        >
          한국어
        </button>
        <span aria-hidden>/</span>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={locale === "en" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
          aria-pressed={locale === "en"}
        >
          EN
        </button>
      </p>
    );
  }

  return (
    <div className="site-shell bg-[var(--bg)] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[var(--rail)] flex-col border-r border-[var(--line)] bg-[var(--bg)] px-6 py-8 lg:flex">
        <a href="/" className="font-display leading-[1.05] tracking-tight">
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-[var(--signal)]" aria-hidden />
            <span className="text-[1.05rem] font-medium">Kumsung</span>
          </span>
          <span className="mt-1 block pl-5 text-[1.05rem] font-medium">Engineering</span>
          <span className="sr-only">Kumsung Engineering Private Limited</span>
        </a>
        <SideNav />
        <div className="mt-auto space-y-3 pt-10 text-[0.78rem] text-[var(--muted)]">
          <LocaleSwitch />
          <button type="button" onClick={() => setApplyOpen(true)} className="block hover:text-[var(--ink)]">
            {t.nav.apply}
          </button>
          <a href={`mailto:${content.company.email}`} className="block break-all hover:text-[var(--ink)]">
            {content.company.email}
          </a>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg)] px-4 py-3 lg:hidden">
        <a href="/" className="font-display text-[0.95rem] font-medium tracking-tight">
          Kumsung Engineering
        </a>
        <button
          type="button"
          aria-expanded={open}
          aria-label={t.menu}
          onClick={() => setOpen((value) => !value)}
          className="text-[0.78rem] tracking-[0.14em] uppercase"
        >
          {open ? (locale === "ko" ? "닫기" : "Close") : t.menu}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <aside className="flex h-full w-[min(18rem,86vw)] flex-col border-r border-[var(--line)] bg-[var(--bg)] px-6 py-8">
            <div className="flex items-start justify-between gap-4">
              <a href="/" className="font-display leading-[1.05] tracking-tight">
                <span className="block text-[1.05rem] font-medium">Kumsung</span>
                <span className="mt-1 block text-[1.05rem] font-medium">Engineering</span>
              </a>
              <button type="button" onClick={() => setOpen(false)} className="text-[0.78rem] tracking-[0.14em] uppercase">
                {locale === "ko" ? "닫기" : "Close"}
              </button>
            </div>
            <SideNav />
            <div className="mt-auto space-y-3 pt-10 text-[0.78rem] text-[var(--muted)]">
              <LocaleSwitch />
              <button type="button" onClick={() => setApplyOpen(true)} className="block text-left">
                {t.nav.apply}
              </button>
            </div>
          </aside>
          <button type="button" aria-label={t.menu} className="h-full flex-1 bg-black/25" onClick={() => setOpen(false)} />
        </div>
      ) : null}

      <div className="flex min-h-svh min-w-0 flex-1 flex-col lg:pl-[var(--rail)]">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--line)] px-[var(--page-x)] py-6 text-[0.75rem] text-[var(--muted)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Kumsung Engineering Private Limited
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <a href="/admin" className="hover:text-[var(--ink)]">
                {t.footerAdmin}
              </a>
              <a href={MVS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--ink)]">
                {t.footerMvs}
              </a>
            </p>
          </div>
        </footer>
      </div>

      <ApplicationModal open={applyOpen} onClose={() => setApplyOpen(false)} />
    </div>
  );
}
