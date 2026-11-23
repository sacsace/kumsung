"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitBeacon() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const key = `kumsung-visit:${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return;
    }

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer,
      language: navigator.language,
      width: window.innerWidth,
    });

    void fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
