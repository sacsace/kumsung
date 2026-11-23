import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

export type SeoPage =
  | "home"
  | "about"
  | "services"
  | "team"
  | "gallery"
  | "contact"
  | "clients"
  | "performance";

type SeoCopy = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
};

const SITE_NAME = "Kumsung Engineering Private Limited";
const LEGAL_NAME = "Kumsung Engineering Private Limited";
const CONTACT_EMAIL = "hyun.hs@hksc.in";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://hksc.in").replace(/\/$/, "");
}

const seo: Record<Locale, Record<SeoPage, SeoCopy>> = {
  ko: {
    home: {
      title: `${SITE_NAME} | Architecture`,
      description:
        "Kumsung Engineering은 점과 선으로 공간을 편집하는 감각적인 건축 설계 스튜디오입니다.",
      keywords: [
        "Kumsung Engineering",
        "건축 설계",
        "건축",
        "공간",
        "스튜디오",
      ],
      ogTitle: `${SITE_NAME} | Architecture`,
      ogDescription: "점과 선이 만나는 건축 설계.",
    },
    about: {
      title: `회사 소개 | ${SITE_NAME}`,
      description: "대표 인사말, 회사 개요, 연혁 및 인증 안내. Kumsung Engineering Private Limited 회사 소개.",
      keywords: ["회사 소개", "대표 인사말", "연혁", "인증", "Kumsung Engineering Private Limited"],
      ogTitle: `회사 소개 | ${SITE_NAME}`,
      ogDescription: "대표 인사말과 회사 개요, 연혁을 확인하세요.",
    },
    services: {
      title: `설계 | ${SITE_NAME}`,
      description: "건축, 실내, 그 사이를 점과 선으로 편집하는 Kumsung Engineering의 설계.",
      keywords: ["건축 설계", "실내", "공간", "Kumsung Engineering Private Limited"],
      ogTitle: `설계 | ${SITE_NAME}`,
      ogDescription: "대지, 빛, 재료를 한 장면으로 편집합니다.",
    },
    team: {
      title: `팀원 소개 | ${SITE_NAME}`,
      description: "Kumsung Engineering Private Limited 대표 및 팀원 소개.",
      keywords: ["팀원", "대표", "Kumsung Engineering Private Limited"],
      ogTitle: `팀원 소개 | ${SITE_NAME}`,
      ogDescription: "공간을 함께 편집하는 사람들입니다.",
    },
    gallery: {
      title: `갤러리 | ${SITE_NAME}`,
      description: "Kumsung Engineering의 도면과 장면 아카이브.",
      keywords: ["아카이브", "도면", "Kumsung Engineering Private Limited"],
      ogTitle: `아카이브 | ${SITE_NAME}`,
      ogDescription: "도면과 장면이 모이는 자리입니다.",
    },
    contact: {
      title: `문의 | ${SITE_NAME}`,
      description: "Kumsung Engineering Private Limited 설계 의뢰와 방문 안내.",
      keywords: ["문의", "연락처", "건축 설계", "Kumsung Engineering Private Limited"],
      ogTitle: `문의 | ${SITE_NAME}`,
      ogDescription: "문의 양식을 통해 빠르게 상담받으세요.",
    },
    clients: {
      title: `고객사 | ${SITE_NAME}`,
      description: "Kumsung Engineering Private Limited와 함께한 주요 고객사 목록입니다.",
      keywords: ["고객사", "파트너", "Kumsung Engineering Private Limited"],
      ogTitle: `고객사 | ${SITE_NAME}`,
      ogDescription: "함께 성장해 온 주요 고객사를 확인하세요.",
    },
    performance: {
      title: `실적 | ${SITE_NAME}`,
      description: "Kumsung Engineering이 편집한 주택, 문화, 업무 공간.",
      keywords: ["작업", "건축", "주택", "Kumsung Engineering Private Limited"],
      ogTitle: `실적 | ${SITE_NAME}`,
      ogDescription: "주요 수행 실적을 확인하세요.",
    },
  },
  en: {
    home: {
      title: `${SITE_NAME} | Architecture`,
      description:
        "Kumsung Engineering is an architecture studio editing space through points and lines.",
      keywords: [
        "Kumsung Engineering",
        "architecture",
        "architectural design",
        "studio",
        "spatial design",
      ],
      ogTitle: `${SITE_NAME} | Architecture`,
      ogDescription: "Architecture drawn where points meet lines.",
    },
    about: {
      title: `About Us | ${SITE_NAME}`,
      description: "CEO message, company overview, history, and certifications of Kumsung Engineering Private Limited.",
      keywords: ["about", "CEO message", "company history", "certification", "Kumsung Engineering Private Limited"],
      ogTitle: `About Us | ${SITE_NAME}`,
      ogDescription: "Learn about our CEO message, company overview, and history.",
    },
    services: {
      title: `Practice | ${SITE_NAME}`,
      description: "Architecture, interior, and the space between, edited by Kumsung Engineering.",
      keywords: ["architecture", "interior", "spatial design", "Kumsung Engineering Private Limited"],
      ogTitle: `Practice | ${SITE_NAME}`,
      ogDescription: "Site, light, and material, edited into one scene.",
    },
    team: {
      title: `Our Team | ${SITE_NAME}`,
      description: "Meet the director and team behind Kumsung Engineering Private Limited.",
      keywords: ["team", "director", "Kumsung Engineering Private Limited"],
      ogTitle: `Our Team | ${SITE_NAME}`,
      ogDescription: "The people who edit space with us.",
    },
    gallery: {
      title: `Gallery | ${SITE_NAME}`,
      description: "Drawings and scenes from Kumsung Engineering.",
      keywords: ["archive", "drawings", "Kumsung Engineering Private Limited"],
      ogTitle: `Archive | ${SITE_NAME}`,
      ogDescription: "A place for drawings and scenes.",
    },
    contact: {
      title: `Contact | ${SITE_NAME}`,
      description: "Commission a project or arrange a visit with Kumsung Engineering Private Limited.",
      keywords: ["contact", "inquiry", "architecture", "Kumsung Engineering Private Limited"],
      ogTitle: `Contact | ${SITE_NAME}`,
      ogDescription: "Contact us to discuss your requirements. We’ll get back to you shortly.",
    },
    clients: {
      title: `Clients | ${SITE_NAME}`,
      description: "Major clients and partners of Kumsung Engineering Private Limited.",
      keywords: ["clients", "partners", "Kumsung Engineering Private Limited"],
      ogTitle: `Clients | ${SITE_NAME}`,
      ogDescription: "See the partners we have worked with.",
    },
    performance: {
      title: `Projects | ${SITE_NAME}`,
      description: "Houses, cultural rooms, and workplaces edited by Kumsung Engineering.",
      keywords: ["projects", "architecture", "houses", "Kumsung Engineering Private Limited"],
      ogTitle: `Projects | ${SITE_NAME}`,
      ogDescription: "Browse our featured project and service records.",
    },
  },
};

function absoluteUrl(path: string) {
  const siteUrl = getSiteUrl();
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(
  page: SeoPage,
  locale: Locale,
  path = "/",
): Metadata {
  const copy = seo[locale][page];
  const url = absoluteUrl(path);
  const ogLocale = locale === "ko" ? "ko_KR" : "en_IN";
  const altLocale = locale === "ko" ? "en_IN" : "ko_KR";
  const ogImage = {
    url: absoluteUrl("/images/symbol-kumsung.png"),
    width: 1272,
    height: 1153,
    alt: SITE_NAME,
    type: "image/png",
  };

  return {
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Business",
    applicationName: SITE_NAME,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    alternates: {
      canonical: url,
      languages: {
        ko: url,
        en: url,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: [altLocale],
      url,
      siteName: SITE_NAME,
      title: copy.ogTitle,
      description: copy.ogDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.ogTitle,
      description: copy.ogDescription,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "content-language": locale === "ko" ? "ko" : "en",
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();
  const description = seo[locale].home.description;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/symbol-kumsung.png`,
      width: 1272,
      height: 1153,
    },
    image: `${siteUrl}/images/symbol-kumsung.png`,
    description,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: CONTACT_EMAIL,
        availableLanguage: ["en", "ko"],
        areaServed: "IN",
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    inLanguage: locale === "ko" ? "ko" : "en",
  };
}

export function websiteJsonLd(locale: Locale) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: locale === "ko" ? "ko" : "en",
    publisher: { "@id": `${siteUrl}/#organization` },
    description: seo[locale].home.description,
  };
}

/** Safe JSON-LD payload for <script> text content (no HTML injection). */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
