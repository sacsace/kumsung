import type { Locale } from "@/lib/types";

export type ServiceOffering = {
  id: string;
  title: string;
  description: string;
};

export type EquipmentLink = {
  label: string;
  slug: string;
};

export type EquipmentCategory = {
  id: string;
  title: string;
  description: string;
  items: EquipmentLink[];
};

export type ServicesCopy = {
  label: string;
  title: string;
  lead: string;
  offeringsLabel: string;
  offeringsTitle: string;
  offeringsLead: string;
  equipmentLabel: string;
  equipmentTitle: string;
  equipmentLead: string;
  brandsLabel: string;
  viewDocs: string;
  ctaTitle: string;
  ctaLead: string;
  ctaButton: string;
  offerings: ServiceOffering[];
  equipment: EquipmentCategory[];
};

const ko: ServicesCopy = {
  label: "Practice",
  title: "설계",
  lead: "대지, 빛, 재료를 한 장면으로 편집합니다. 점은 머무르고, 선은 사람을 이끕니다.",
  offeringsLabel: "Practice",
  offeringsTitle: "우리가 그리는 것",
  offeringsLead: "건축을 크게 세 가지 호흡으로 나눕니다.",
  equipmentLabel: "Studies",
  equipmentTitle: "작업의 결",
  equipmentLead: "주택, 문화, 업무 공간을 같은 감수성으로 다룹니다.",
  brandsLabel: "",
  viewDocs: "작업 보기",
  ctaTitle: "다음 장면을 함께 편집할까요?",
  ctaLead: "대지와 쓰고 싶은 시간을 들려 주시면, 점과 선부터 시작하겠습니다.",
  ctaButton: "연락",
  offerings: [
    {
      id: "architecture",
      title: "건축",
      description: "신축과 증개축. 구조와 입면, 동선이 하나의 제스처가 되도록 계획합니다.",
    },
    {
      id: "interior",
      title: "실내",
      description: "가구, 빛, 촉감. 머무는 자리가 먼저 보이고 벽은 그 뒤를 받칩니다.",
    },
    {
      id: "landscape",
      title: "사이",
      description: "마당, 골목, 처마. 건물과 바깥이 만나는 선을 설계의 중심으로 둡니다.",
    },
  ],
  equipment: [
    {
      id: "house",
      title: "주택",
      description: "하루의 빛이 방을 건너가는 순서를 먼저 정합니다.",
      items: [],
    },
    {
      id: "culture",
      title: "문화",
      description: "머무름과 스침이 겹치는 공공의 장면을 만듭니다.",
      items: [],
    },
    {
      id: "work",
      title: "업무",
      description: "집중과 마주침이 선을 따라 자연스럽게 이어지게 합니다.",
      items: [],
    },
  ],
};

const en: ServicesCopy = {
  label: "Practice",
  title: "Design",
  lead: "We edit site, light, and material into one scene. A point holds. A line leads.",
  offeringsLabel: "Practice",
  offeringsTitle: "What we draw",
  offeringsLead: "The work moves in three breaths.",
  equipmentLabel: "Studies",
  equipmentTitle: "Kinds of work",
  equipmentLead: "Houses, culture, and workplaces, held in the same sensibility.",
  brandsLabel: "",
  viewDocs: "View work",
  ctaTitle: "Shall we edit the next scene together?",
  ctaLead: "Tell us the site and the time you want to spend there. We begin with points and lines.",
  ctaButton: "Contact",
  offerings: [
    {
      id: "architecture",
      title: "Architecture",
      description: "New buildings and alterations, where structure, facade, and movement share one gesture.",
    },
    {
      id: "interior",
      title: "Interior",
      description: "Furniture, light, and touch. The place to stay appears first. Walls follow.",
    },
    {
      id: "landscape",
      title: "In between",
      description: "Courts, alleys, and eaves. The line where the building meets the outside is the project.",
    },
  ],
  equipment: [
    {
      id: "house",
      title: "Houses",
      description: "We decide the order in which daylight crosses a room.",
      items: [],
    },
    {
      id: "culture",
      title: "Culture",
      description: "Public scenes where lingering and passing overlap.",
      items: [],
    },
    {
      id: "work",
      title: "Work",
      description: "Focus and encounter follow the same line.",
      items: [],
    },
  ],
};

export const servicesCopy: Record<Locale, ServicesCopy> = { ko, en };
