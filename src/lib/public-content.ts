import type { GalleryItem, PerformanceItem, SiteContent } from "@/lib/types";

const BLANK_COMPANY = new Set(["", "—", "-", "–", "스튜디오", "studio"]);

export function visibleCompanyValue(value: string | undefined) {
  const text = (value || "").trim();
  return BLANK_COMPANY.has(text.toLowerCase()) || BLANK_COMPANY.has(text) ? "" : text;
}

export function isSamplePerformance(row: Pick<PerformanceItem, "client">) {
  return /설계 스터디|design study/i.test(row.client || "");
}

export function isTestGalleryItem(item: Pick<GalleryItem, "title" | "caption">) {
  const junk = (value: string) => {
    const text = value.trim();
    return text.length >= 5 && /^(.)\1+$/.test(text);
  };
  return junk(item.title || "") || junk(item.caption || "");
}

const SERVICE_COPY = {
  ko: {
    lead: "건축 설계, 실내 설계, 외부 공간을 수행합니다. 상담에서 업무 범위를 정하고, 배치와 평면부터 재료와 도면까지 제안합니다.",
    offeringsLabel: "업무",
    offeringsTitle: "수행하는 일",
    offeringsLead: "각 업무는 상담으로 범위를 정한 뒤, 해당 프로젝트 문의로 이어집니다.",
    offerings: {
      architecture: {
        title: "건축 설계",
        description:
          "신축과 증축·개축의 배치, 평면, 입면, 구조 계획을 합니다. 주택, 업무 공간, 상업시설, 문화시설이 대상입니다.",
      },
      interior: {
        title: "실내 설계",
        description:
          "실의 구성, 동선, 재료, 조명, 가구 배치를 제안합니다. 사무실, 상점, 주거 실내가 대상입니다.",
      },
      between: {
        title: "외부 공간",
        description:
          "마당, 진입, 건물과 길이 만나는 공간을 설계합니다. 대지 안의 외부와 사이 공간이 대상입니다.",
      },
    },
    ctaTitle: "프로젝트 상담",
    ctaLead: "프로젝트 위치와 필요한 업무, 희망 일정을 알려주세요. 내용을 검토한 후 상담을 통해 진행 방향을 안내해드리겠습니다.",
    ctaButton: "프로젝트 문의",
  },
  en: {
    lead: "We carry out architectural design, interior design, and outdoor space. The scope is set in consultation, from layout and plan through materials and drawings.",
    offeringsLabel: "Work",
    offeringsTitle: "What we do",
    offeringsLead: "Each service starts with an agreed scope and continues as a project inquiry.",
    offerings: {
      architecture: {
        title: "Architectural design",
        description:
          "Layout, plans, elevations, and structure for new buildings, extensions, and alterations. For houses, workplaces, retail, and cultural buildings.",
      },
      interior: {
        title: "Interior design",
        description:
          "Room layout, circulation, materials, lighting, and furniture. For offices, shops, and homes.",
      },
      between: {
        title: "Outdoor space",
        description:
          "Courts, entries, and the ground where a building meets the street. For outdoor and in-between space on a site.",
      },
    },
    ctaTitle: "Project consultation",
    ctaLead:
      "Tell us the project location, the work you need, and your preferred schedule. We will review it and explain the next step in a consultation.",
    ctaButton: "Project inquiry",
  },
} as const;

const EN_GREETING = {
  title: "We build the value of a space on trust.",
  body: "Thank you for visiting Kumsung Engineering.\nWe begin by understanding what you have in mind and what the space is for. We look at comfort, movement, function, and appearance, including the small details, and propose a space that holds its value in daily use.\nA good result comes from clear communication and keeping our word. We listen to what you need, propose a practical response to the site, and take responsibility for every project.\nWe will work with you so that your idea becomes something you can use.\nThank you.",
};

export function migratePublicPlaceholders(content: SiteContent) {
  let changed = false;

  for (const locale of ["ko", "en"] as const) {
    const block = content[locale];
    if (!block) continue;

    const company = block.company;
    if (company) {
      if (visibleCompanyValue(company.founded) === "" && company.founded) {
        company.founded = "";
        changed = true;
      }
      if (visibleCompanyValue(company.employees) === "" && company.employees) {
        company.employees = "";
        changed = true;
      }
    }

    const performances = (block.performances || []).filter((row) => !isSamplePerformance(row));
    if (performances.length !== (block.performances || []).length) {
      block.performances = performances;
      changed = true;
    }

    const galleryItems = (block.gallery?.items || []).filter((item) => !isTestGalleryItem(item));
    if (block.gallery && galleryItems.length !== block.gallery.items.length) {
      block.gallery.items = galleryItems;
      changed = true;
    }

    if (locale === "en" && block.greeting?.body?.includes("An idea that begins at one point")) {
      block.greeting.title = EN_GREETING.title;
      block.greeting.body = EN_GREETING.body;
      changed = true;
    }

    const services = block.services;
    if (!services) continue;
    const copy = SERVICE_COPY[locale];
    if (/설비|유지관리/.test(services.lead) || services.lead.includes("the space between")) {
      services.lead = copy.lead;
      changed = true;
    }
    services.offerings = (services.offerings || []).map((item) => {
      const known = copy.offerings[item.id as keyof typeof copy.offerings];
      if (!known) return item;
      if (item.title === known.title && item.description === known.description) return item;
      changed = true;
      return { ...item, title: known.title, description: known.description };
    });
    if (services.offeringsTitle !== copy.offeringsTitle) {
      services.offeringsLabel = copy.offeringsLabel;
      services.offeringsTitle = copy.offeringsTitle;
      services.offeringsLead = copy.offeringsLead;
      services.ctaTitle = copy.ctaTitle;
      services.ctaLead = copy.ctaLead;
      services.ctaButton = copy.ctaButton;
      changed = true;
    }
    const categories = (services.categories || []).filter(
      (category) => (category.items || []).length > 0 || Boolean(category.file?.trim()),
    );
    if (categories.length !== (services.categories || []).length) {
      services.categories = categories;
      changed = true;
    }
  }

  return changed;
}
