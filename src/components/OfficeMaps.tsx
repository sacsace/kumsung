function mapEmbedSrc(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
}

export function OfficeMaps({
  bangaloreLabel,
  bangaloreAddress,
  bangaloreMapEmbed,
  chennaiLabel,
  chennaiAddress,
  chennaiMapEmbed,
  openInMapsLabel,
}: {
  bangaloreLabel: string;
  bangaloreAddress: string;
  bangaloreMapEmbed?: string;
  chennaiLabel: string;
  chennaiAddress: string;
  chennaiMapEmbed?: string;
  openInMapsLabel: string;
}) {
  const showBangalore = Boolean(bangaloreAddress?.trim() || bangaloreMapEmbed?.trim());
  const showChennai = Boolean(chennaiAddress?.trim() || chennaiMapEmbed?.trim());

  return (
    <div className={`mt-14 grid gap-5 ${showBangalore && showChennai ? "md:grid-cols-2" : ""}`}>
      {showBangalore ? (
      <MapCard
        label={bangaloreLabel}
        address={bangaloreAddress}
        embedSrc={bangaloreMapEmbed}
        openLabel={openInMapsLabel}
      />
      ) : null}
      {showChennai ? (
      <MapCard
        label={chennaiLabel}
        address={chennaiAddress}
        embedSrc={chennaiMapEmbed}
        openLabel={openInMapsLabel}
      />
      ) : null}
    </div>
  );
}

function MapCard({
  label,
  address,
  embedSrc,
  openLabel,
}: {
  label: string;
  address: string;
  embedSrc?: string;
  openLabel: string;
}) {
  if (!address?.trim() && !embedSrc?.trim()) return null;

  const src = embedSrc?.trim() || mapEmbedSrc(address);
  const mapsOpen = embedSrc?.trim()
    ? embedSrc.replace("&output=embed", "").replace("?output=embed", "")
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="border border-[var(--ink)] bg-white">
      <div className="flex items-end justify-between gap-4 px-4 py-4 md:px-6">
        <div className="min-w-0">
          <p className="text-[0.72rem] font-medium tracking-[0.16em] text-[var(--signal)] uppercase">{label}</p>
          {address ? <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{address}</p> : null}
        </div>
        <a
          href={mapsOpen}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-semibold text-[var(--signal)] underline underline-offset-4"
        >
          {openLabel}
        </a>
      </div>
      <div className="relative h-[22rem] w-full border-t border-[var(--ink)] bg-[var(--bg)] md:h-[28rem]">
        <iframe
          title={label}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
