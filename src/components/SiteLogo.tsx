export function SiteLogo({
  tone = "color",
  className = "",
  priority = false,
}: {
  tone?: "color" | "light";
  className?: string;
  priority?: boolean;
}) {
  const textTone = tone === "light" ? "!text-white" : "text-[var(--ink)]";

  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/symbol-kumsung.png"
        alt=""
        width={1272}
        height={1153}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
        className={`h-7 w-auto shrink-0 bg-transparent object-contain md:h-8 ${className}`}
        aria-hidden
      />
      <span className={`font-display leading-[1.05] ${textTone}`}>
        <span className="block text-[0.62rem] font-semibold tracking-[0.02em] sm:text-[0.68rem] md:text-[0.74rem]">
          KUMSUNG ENGINEERING
        </span>
        <span className="mt-0.5 block text-[0.48rem] font-medium tracking-[0.12em] opacity-80 sm:text-[0.52rem] md:text-[0.56rem]">
          PRIVATE LIMITED
        </span>
      </span>
      <span className="sr-only">Kumsung Engineering Private Limited</span>
    </span>
  );
}
