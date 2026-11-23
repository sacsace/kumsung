import { servicesCopy } from "@/lib/services";
import type {
  Locale,
  ServiceBrandItem,
  ServiceCategoryItem,
  ServiceOfferingItem,
  ServicesContent,
} from "@/lib/types";

function defaultBrands(): ServiceBrandItem[] {
  return [];
}

function defaultOfferings(locale: Locale): ServiceOfferingItem[] {
  return servicesCopy[locale].offerings.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
  }));
}

function defaultCategories(locale: Locale): ServiceCategoryItem[] {
  return servicesCopy[locale].equipment.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    items: item.items.map((link) => ({ label: link.label, slug: link.slug })),
  }));
}

export function defaultServicesContent(locale: Locale): ServicesContent {
  const copy = servicesCopy[locale];
  return {
    label: copy.label,
    title: copy.title,
    lead: copy.lead,
    offeringsLabel: copy.offeringsLabel,
    offeringsTitle: copy.offeringsTitle,
    offeringsLead: copy.offeringsLead,
    equipmentLabel: copy.equipmentLabel,
    equipmentTitle: copy.equipmentTitle,
    equipmentLead: copy.equipmentLead,
    viewDocs: copy.viewDocs,
    ctaTitle: copy.ctaTitle,
    ctaLead: copy.ctaLead,
    ctaButton: copy.ctaButton,
    offerings: defaultOfferings(locale),
    brands: defaultBrands(),
    categories: defaultCategories(locale),
  };
}

export function ensureServicesContent(
  services: ServicesContent | undefined,
  locale: Locale,
): ServicesContent {
  if (!services) return defaultServicesContent(locale);

  const fallback = defaultServicesContent(locale);
  return {
    label: services.label || fallback.label,
    title: services.title || fallback.title,
    lead: services.lead || fallback.lead,
    offeringsLabel: services.offeringsLabel || fallback.offeringsLabel,
    offeringsTitle: services.offeringsTitle || fallback.offeringsTitle,
    offeringsLead: services.offeringsLead || fallback.offeringsLead,
    equipmentLabel: services.equipmentLabel || fallback.equipmentLabel,
    equipmentTitle: services.equipmentTitle || fallback.equipmentTitle,
    equipmentLead: services.equipmentLead || fallback.equipmentLead,
    viewDocs: services.viewDocs || fallback.viewDocs,
    ctaTitle: services.ctaTitle || fallback.ctaTitle,
    ctaLead: services.ctaLead || fallback.ctaLead,
    ctaButton: services.ctaButton || fallback.ctaButton,
    offerings: Array.isArray(services.offerings) ? services.offerings : fallback.offerings,
    brands: Array.isArray(services.brands) ? services.brands : fallback.brands,
    categories: Array.isArray(services.categories) ? services.categories : fallback.categories,
  };
}
