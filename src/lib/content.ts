import { promises as fs } from "fs";
import { ensureServicesContent } from "@/lib/services-default";
import { sortPerformances, type SiteContent } from "@/lib/types";
import {
  ensureRuntimeContentFile,
  ensureSeedUploads,
  contentFilePath,
} from "@/lib/storage";

export type {
  Locale,
  HistoryItem,
  PerformanceItem,
  CertificateItem,
  GalleryItem,
  HeroSlide,
  TeamMember,
  LocaleContent,
  SiteContent,
} from "@/lib/types";

export { dateSortKey, sortPerformances } from "@/lib/types";

const RETIRED_HERO_VIDEO = "/videos/air-compressor.mp4";
const CURRENT_HERO_VIDEO = "/videos/hero-reel.mp4";
/** Temporary CP product hero slides — restore original facility/pipe set once. */
const CP_HERO_SLIDE_SRCS = new Set([
  "/images/hero/cp-75-220.jpg",
  "/images/hero/cp-cpf221.jpg",
  "/images/hero/cp-cpc-40-60.jpg",
  "/images/hero/cp-cpm60.jpg",
  "/images/hero/cp-oil-free.jpg",
  "/images/hero/cp-piston.jpg",
]);

const CP_FLAGSHIP_PRODUCT_IDS = [
  "cp-75-220",
  "cp-cpf221",
  "cp-cpc-40-60",
  "cp-cpm60",
  "cp-oil-free",
  "cp-piston",
] as const;

function defaultHeroSlides(locale: "ko" | "en") {
  if (locale === "ko") {
    return [
      {
        id: "studio",
        type: "image" as const,
        src: "",
        label: "Kumsung",
        brand: "Kumsung Engineering Private Limited",
        headline: "점과 선",
        subheadline: "대지와 빛을 하나의 장면으로 편집합니다.",
        ctaLabel: "연락",
        ctaHref: "/contact",
      },
    ];
  }

  return [
    {
      id: "studio",
      type: "image" as const,
      src: "",
      label: "Kumsung",
      brand: "Kumsung Engineering Private Limited",
      headline: "Points & lines",
      subheadline: "We edit site and light into one architectural scene.",
      ctaLabel: "Contact",
      ctaHref: "/contact",
    },
  ];
}

function replaceRetiredHeroVideo(value: string) {
  return value === RETIRED_HERO_VIDEO ? CURRENT_HERO_VIDEO : value;
}

function needsHeroSlideRefresh(slides: { src?: string; id?: string }[] | undefined) {
  if (!slides?.length) return true;
  // Roll back the temporary CP product hero set; leave admin-managed slides alone.
  return slides.some(
    (slide) =>
      CP_HERO_SLIDE_SRCS.has(slide.src || "") ||
      (slide.id || "").startsWith("slide-cp-"),
  );
}

/** Ensure product/category catalog file fields exist on volume content. */
function ensureCatalogFileFields(content: SiteContent): boolean {
  let changed = false;
  for (const locale of ["ko", "en"] as const) {
    const brands = content[locale]?.services?.brands;
    if (Array.isArray(brands)) {
      for (const brand of brands) {
        for (const product of brand.products || []) {
          if (product.file === undefined) {
            product.file = "";
            changed = true;
          }
          if (product.fileName === undefined) {
            product.fileName = "";
            changed = true;
          }
        }
      }
    }
    const categories = content[locale]?.services?.categories;
    if (Array.isArray(categories)) {
      for (const category of categories) {
        if (category.file === undefined) {
          category.file = "";
          changed = true;
        }
        if (category.fileName === undefined) {
          category.fileName = "";
          changed = true;
        }
      }
    }
  }
  return changed;
}

function ensureChicagoPneumaticFlagships(
  content: SiteContent,
  locale: "ko" | "en",
): boolean {
  const brands = content[locale]?.services?.brands;
  if (!Array.isArray(brands)) return false;
  const brand = brands.find((item) => item.slug === "chicago-pneumatic");
  if (!brand || !Array.isArray(brand.products)) return false;

  const existing = new Set(brand.products.map((product) => product.id));
  const missing = CP_FLAGSHIP_PRODUCT_IDS.filter((id) => !existing.has(id));
  if (!missing.length) return false;

  const seedBrand = content.ko?.services?.brands?.find(
    (item) => item.slug === "chicago-pneumatic",
  );
  const seedProducts =
    (locale === "en"
      ? content.en?.services?.brands?.find((item) => item.slug === "chicago-pneumatic")
          ?.products
      : seedBrand?.products) || [];

  // Prefer same-locale product copy already present in bundled content defaults.
  const catalogById = new Map(
    (seedProducts.length ? seedProducts : brand.products).map((product) => [
      product.id,
      product,
    ]),
  );

  const fallbackCopy: Record<
    (typeof CP_FLAGSHIP_PRODUCT_IDS)[number],
    { title: string; image: string; description: string }
  > =
    locale === "ko"
      ? {
          "cp-75-220": {
            title: "CP 75-220 Screw Compressor",
            image: "/images/products/chicago-pneumatic--75-220.jpg",
            description:
              "Chicago Pneumatic CP 75-220 시리즈 오일 주입식 스크류 컴프레서. 산업 현장의 안정적인 압축공기 공급을 위한 주력 모델입니다.",
          },
          "cp-cpf221": {
            title: "CPF 220-450 Fixed Speed",
            image: "/images/products/chicago-pneumatic--cpf221.jpg",
            description:
              "CPF 시리즈 고정속 대용량 스크류 컴프레서. 중대형 공장의 연속 가동과 높은 공기 수요에 적합합니다.",
          },
          "cp-cpc-40-60": {
            title: "CPC 40-60 Package",
            image: "/images/products/chicago-pneumatic--cpc-40-60.jpg",
            description:
              "CPC 40-60 오일 주입식 스크류 컴프레서 패키지. 설치와 유지보수가 용이한 현장 맞춤형 솔루션입니다.",
          },
          "cp-cpm60": {
            title: "CPM / CPMV / CPVS Series",
            image: "/images/products/chicago-pneumatic--cpm60.jpg",
            description:
              "CPM 고정속 및 CPMV·CPVS 가변속 스크류 컴프레서. 부하 변동에 맞춘 에너지 효율적인 운영을 지원합니다.",
          },
          "cp-oil-free": {
            title: "Oil-Free Screw Compressor",
            image: "/images/products/chicago-pneumatic--oil-free.jpg",
            description:
              "Chicago Pneumatic 오일프리 스크류 컴프레서. 청정 압축공기가 필요한 공정에 적합합니다.",
          },
          "cp-piston": {
            title: "Piston Air Compressor",
            image: "/images/products/chicago-pneumatic--piston.jpg",
            description:
              "Chicago Pneumatic 피스톤 컴프레서. 워크숍과 소규모 산업 현장에 적합한 실용형 모델입니다.",
          },
        }
      : {
          "cp-75-220": {
            title: "CP 75-220 Screw Compressor",
            image: "/images/products/chicago-pneumatic--75-220.jpg",
            description:
              "Chicago Pneumatic CP 75-220 oil-injected screw compressors — our flagship series for reliable industrial compressed air.",
          },
          "cp-cpf221": {
            title: "CPF 220-450 Fixed Speed",
            image: "/images/products/chicago-pneumatic--cpf221.jpg",
            description:
              "CPF fixed-speed high-capacity screw compressors for continuous operation and high air demand in mid- to large-scale plants.",
          },
          "cp-cpc-40-60": {
            title: "CPC 40-60 Package",
            image: "/images/products/chicago-pneumatic--cpc-40-60.jpg",
            description:
              "CPC 40-60 oil-injected screw compressor packages — easy to install and service for site-ready solutions.",
          },
          "cp-cpm60": {
            title: "CPM / CPMV / CPVS Series",
            image: "/images/products/chicago-pneumatic--cpm60.jpg",
            description:
              "CPM fixed-speed and CPMV/CPVS variable-speed screw compressors for energy-efficient operation under changing load.",
          },
          "cp-oil-free": {
            title: "Oil-Free Screw Compressor",
            image: "/images/products/chicago-pneumatic--oil-free.jpg",
            description:
              "Chicago Pneumatic oil-free screw compressors for processes that require clean compressed air.",
          },
          "cp-piston": {
            title: "Piston Air Compressor",
            image: "/images/products/chicago-pneumatic--piston.jpg",
            description:
              "Chicago Pneumatic piston compressors suited to workshops and smaller industrial sites.",
          },
        };

  const inserts = missing.map((id) => {
    const fromSeed = catalogById.get(id);
    const fallback = fallbackCopy[id];
    return {
      id,
      title: fromSeed?.title || fallback.title,
      image: fromSeed?.image || fallback.image,
      description: fromSeed?.description || fallback.description,
    };
  });

  brand.products = [...inserts, ...brand.products.filter((p) => p.title?.trim())];
  brand.lead =
    locale === "ko"
      ? "Chicago Pneumatic 주력 스크류·오일프리·피스톤 컴프레서 라인업입니다."
      : "Flagship Chicago Pneumatic screw, oil-free, and piston compressor lineup.";
  return true;
}

export async function getContent(): Promise<SiteContent> {
  const contentPath = await ensureRuntimeContentFile();
  // Restore bundled CMS images into the volume when missing (survives redeploy).
  await ensureSeedUploads();
  const raw = await fs.readFile(contentPath, "utf-8");
  const content = JSON.parse(raw) as SiteContent;
  let contentMigrated = false;

  for (const locale of ["ko", "en"] as const) {
    const hero = content[locale]?.hero;
    if (!hero) continue;
    if (hero.videoUrl === RETIRED_HERO_VIDEO) {
      hero.videoUrl = CURRENT_HERO_VIDEO;
      contentMigrated = true;
    }
    for (const slide of hero.slides || []) {
      if (slide.src === RETIRED_HERO_VIDEO) {
        slide.src = replaceRetiredHeroVideo(slide.src);
        contentMigrated = true;
      }
    }
    if (needsHeroSlideRefresh(hero.slides)) {
      hero.slides = defaultHeroSlides(locale);
      if (!hero.videoUrl || hero.videoUrl === RETIRED_HERO_VIDEO) {
        hero.videoUrl = CURRENT_HERO_VIDEO;
      }
      contentMigrated = true;
    }
    if (ensureChicagoPneumaticFlagships(content, locale)) {
      contentMigrated = true;
    }
  }

  if (ensureCatalogFileFields(content)) {
    contentMigrated = true;
  }

  if (contentMigrated) {
    await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");
  }

  for (const locale of ["ko", "en"] as const) {
    const localeData = content[locale];
    if (!localeData.hero.videoUrl) localeData.hero.videoUrl = "";
    if (!localeData.hero.slides?.length) {
      localeData.hero.slides = defaultHeroSlides(locale);
    }
    if (!localeData.team) {
      localeData.team = {
        title: locale === "ko" ? "팀 소개" : "Our Team",
        lead: "",
        ceo: { name: "", role: "", bio: "", photo: "" },
        members: [],
      };
    }
    if (!localeData.media) {
      localeData.media = {
        title: locale === "ko" ? "현장 영상" : "Field Videos",
        lead: "",
        items: [],
      };
    }
    if (!localeData.gallery) {
      localeData.gallery = {
        title: locale === "ko" ? "갤러리" : "Gallery",
        lead: "",
        items: [],
      };
    }
    if (!localeData.clients) {
      const names = Array.from(
        new Set(
          (localeData.performances || [])
            .map((p) => p.client?.trim())
            .filter(Boolean),
        ),
      );
      localeData.clients = {
        title: locale === "ko" ? "고객사" : "Clients",
        lead: locale === "ko" ? "함께 장면을 만든 사람들." : "People we have made scenes with.",
        items: names.map((name, i) => ({
          id: `c-${i + 1}`,
          name,
          logo: "",
        })),
      };
    }
    localeData.services = ensureServicesContent(localeData.services, locale);
    localeData.history = (localeData.history || []).map((item, index) =>
      item.id ? item : { ...item, id: `h-${locale}-${index}` },
    );
    localeData.performances = (localeData.performances || []).map((item, index) =>
      item.id ? item : { ...item, id: `p-${locale}-${index}` },
    );
    localeData.performances = sortPerformances(localeData.performances, true);
  }

  return content;
}

export async function saveContent(content: SiteContent): Promise<void> {
  for (const locale of ["ko", "en"] as const) {
    content[locale].performances = sortPerformances(content[locale].performances, true);
  }
  const contentPath = contentFilePath();
  await ensureRuntimeContentFile();
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");
}
