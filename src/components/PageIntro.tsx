export function PageIntro({
  eyebrow,
  title,
  lead,
  before,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  before?: React.ReactNode;
}) {
  return (
      <header className="relative overflow-hidden border-b border-[var(--ink)] px-[var(--page-x)] py-12 md:py-16">
      <span
        className="pointer-events-none absolute -right-[0.18em] -bottom-[0.28em] font-display text-[clamp(6rem,14vw,11rem)] leading-none font-medium tracking-[-0.08em] text-[var(--signal)] select-none"
        aria-hidden
      >
        {title.slice(0, 1)}
      </span>
      <div className="relative max-w-3xl">
        {before ? <div className="mb-5">{before}</div> : null}
        {eyebrow ? (
          <p className="text-[0.72rem] font-medium tracking-[0.16em] text-[var(--signal)] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="relative mt-3 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.92] font-medium tracking-[-0.045em] text-[var(--ink)]">
          <span className="absolute top-[0.42em] -left-3 h-[0.38em] w-[0.38em] bg-[var(--signal)]" aria-hidden />
          <span className="relative">{title}</span>
        </h1>
        {lead ? (
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{lead}</p>
        ) : null}
      </div>
    </header>
  );
}
