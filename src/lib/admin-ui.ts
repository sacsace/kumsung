import type { Locale } from "@/lib/types";

export type AdminSectionId =
  | "dashboard"
  | "hero"
  | "greeting"
  | "company"
  | "history"
  | "performance"
  | "services"
  | "clients"
  | "team"
  | "gallery"
  | "inquiries"
  | "mail"
  | "security"
  | "system";

export type MenuItem = { id: AdminSectionId; label: string; desc: string };
export type MenuGroup = { id: string; label: string; items: MenuItem[] };

const menuGroupsKo: MenuGroup[] = [
  {
    id: "overview",
    label: "개요",
    items: [{ id: "dashboard", label: "대시보드", desc: "방문과 유입 환경" }],
  },
  {
    id: "company",
    label: "회사 소개",
    items: [
      { id: "greeting", label: "인사말", desc: "소개 문구" },
      { id: "company", label: "회사 정보", desc: "법인·주소·인증" },
      { id: "history", label: "연혁", desc: "회사 히스토리" },
      { id: "team", label: "팀원", desc: "대표·팀원 소개" },
    ],
  },
  {
    id: "site",
    label: "사이트",
    items: [
      { id: "hero", label: "메인 배너", desc: "홈 문장·슬라이드" },
      { id: "gallery", label: "갤러리", desc: "사진 관리" },
    ],
  },
  {
    id: "business",
    label: "사업·서비스",
    items: [
      { id: "services", label: "서비스", desc: "제공 서비스·제품" },
      { id: "performance", label: "실적", desc: "주요 수행" },
      { id: "clients", label: "고객사", desc: "고객사 목록" },
    ],
  },
  {
    id: "ops",
    label: "운영",
    items: [
      { id: "inquiries", label: "문의 내역", desc: "접수된 문의" },
      { id: "mail", label: "메일 설정", desc: "Google SMTP" },
      { id: "security", label: "보안", desc: "비밀번호 변경" },
      { id: "system", label: "시스템", desc: "파일 저장소" },
    ],
  },
];

const menuGroupsEn: MenuGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", desc: "Visits and arrival environment" }],
  },
  {
    id: "company",
    label: "Company",
    items: [
      { id: "greeting", label: "Greeting", desc: "Intro message" },
      { id: "company", label: "Company", desc: "Legal · address · certs" },
      { id: "history", label: "History", desc: "Company timeline" },
      { id: "team", label: "Team", desc: "CEO · members" },
    ],
  },
  {
    id: "site",
    label: "Website",
    items: [
      { id: "hero", label: "Main banner", desc: "Home sentence and slides" },
      { id: "gallery", label: "Gallery", desc: "Photo management" },
    ],
  },
  {
    id: "business",
    label: "Business",
    items: [
      { id: "services", label: "Services", desc: "Offerings and products" },
      { id: "performance", label: "Performance", desc: "Key projects" },
      { id: "clients", label: "Clients", desc: "Client list" },
    ],
  },
  {
    id: "ops",
    label: "Operations",
    items: [
      { id: "inquiries", label: "Inquiries", desc: "Received messages" },
      { id: "mail", label: "Mail", desc: "Google SMTP" },
      { id: "security", label: "Security", desc: "Change password" },
      { id: "system", label: "System", desc: "File storage" },
    ],
  },
];

export function adminMenuGroups(locale: Locale): MenuGroup[] {
  return locale === "en" ? menuGroupsEn : menuGroupsKo;
}

export function adminMenu(locale: Locale): MenuItem[] {
  return adminMenuGroups(locale).flatMap((group) => group.items);
}

export function adminUi(locale: Locale) {
  const en = locale === "en";
  return {
    contentManage: en ? "Content management" : "콘텐츠 관리",
    viewSite: en ? "View site" : "사이트 보기",
    logout: en ? "Log out" : "로그아웃",
    closeMenu: en ? "Close menu" : "메뉴 닫기",
    openMenu: en ? "Menu" : "메뉴",
    save: en ? "Save" : "저장",
    saving: en ? "Saving…" : "저장 중…",
    saved: en ? "Saved · applied to the site" : "저장됨 · 사이트에 반영됨",
    saveFailed: en ? "Save failed. Please log in again." : "저장 실패. 다시 로그인해 주세요.",
    storageOk: en ? "File storage: ready" : "파일 저장소 정상",
    storageSetup: en ? "File storage: setup needed" : "파일 저장소 설정 필요",
    storageOpen: en ? "System settings" : "시스템 설정",
    editing: (label: string) =>
      en ? `English · ${label}` : `한국어 · ${label}`,
    loading: en ? "Loading…" : "로딩 중…",
    contentLoading: en ? "Loading content…" : "콘텐츠 로딩 중…",

    // Common fields
    title: en ? "Title" : "제목",
    body: en ? "Body" : "본문",
    brand: en ? "Brand" : "브랜드",
    headline: en ? "Headline" : "헤드라인",
    subheadline: en ? "Subheadline" : "서브헤드라인",
    ctaLabel: en ? "CTA label" : "CTA 문구",
    ctaHref: en ? "CTA link" : "CTA 링크",
    videoUrl: en ? "Video URL" : "영상 URL",
    intro: en ? "Intro text" : "소개 문구",
    sectionTitle: en ? "Section title" : "섹션 제목",
    add: en ? "Add" : "추가",
    register: en ? "Add" : "등록",
    edit: en ? "Edit" : "수정",
    delete: en ? "Delete" : "삭제",
    cancel: en ? "Cancel" : "취소",
    backToList: en ? "Back to list" : "목록으로",
    confirm: en ? "Confirm" : "확인",
    confirmTitle: en ? "Please confirm" : "확인",
    confirmOk: en ? "OK" : "확인",
    confirmCancel: en ? "Cancel" : "취소",
    applyAdd: en ? "Register" : "등록",
    applyEdit: en ? "Save changes" : "변경사항 저장",
    noChanges: en ? "No unsaved changes" : "변경사항 없음",
    unsaved: en ? "Unsaved changes" : "저장하지 않은 변경사항 있음",
    savedAt: (time: string) => (en ? `Saved ${time}` : `${time} 저장됨`),
    preview: en ? "Preview" : "미리보기",
    discard: en ? "Discard changes" : "변경 취소",
    unsavedLeave: en
      ? "There are unsaved changes. Leave without saving?"
      : "저장하지 않은 변경사항이 있습니다. 저장하지 않고 이동할까요?",
    publishNote: en
      ? "Save publishes the change on the site."
      : "저장하면 사이트에 바로 반영됩니다.",
    total: (n: number) => (en ? `Total ${n}` : `총 ${n}건`),
    totalPeople: (n: number) => (en ? `Total ${n}` : `총 ${n}명`),
    no: "No",
    none: en ? "None" : "없음",
    noTitle: en ? "(No title)" : "(제목 없음)",
    manage: en ? "Manage" : "관리",
    date: en ? "Date" : "일자",
    detail: en ? "Details" : "내용",
    name: en ? "Name" : "이름",
    role: en ? "Role" : "직책",
    bio: en ? "Bio" : "소개",
    photo: en ? "Photo" : "사진",
    photoHint: en ? "JPG, PNG, WEBP" : "JPG, PNG, WEBP",
    caption: en ? "Caption" : "설명",
    image: en ? "Image" : "이미지",
    imageUrl: en ? "Image URL" : "이미지 URL",
    logo: en ? "Logo" : "로고",
    logoHint: en ? "Optional · JPG, PNG, WEBP" : "선택 사항 · JPG, PNG, WEBP",
    logoRemove: en ? "Remove logo" : "로고 제거",

    hero: en ? "Main banner" : "메인 배너",
    heroSlides: en ? "Banner slides" : "배너 슬라이드",
    heroSlidesHint: en
      ? "The home page shows the fallback sentence under the company name. Slide photos and custom sentences are stored here and are not drawn on the current home hero."
      : "홈에는 회사명 아래 기본 문구가 표시됩니다. 슬라이드 사진과 개별 문구는 여기에 저장되며, 현재 홈 상단 화면에는 나오지 않습니다.",
    heroFallbackHeadline: en
      ? "Sentence used when a slide has no text of its own"
      : "슬라이드에 별도 문구가 없을 때 사용하는 문장",
    heroFallbackBody: en
      ? "Supporting sentence used when a slide has no text of its own"
      : "슬라이드에 별도 문구가 없을 때 사용하는 설명",
    heroPreviewTitle: en ? "What the home page shows" : "홈에 표시되는 내용",
    heroCopyDefault: en ? "Use fallback sentence" : "기본 문구 사용",
    heroCopyCustom: en ? "Use this slide's sentence" : "개별 문구 사용",
    heroMediaMissing: en ? "No image" : "이미지 미등록",
    heroMediaFile: en ? "Upload a file" : "파일 업로드",
    heroMediaLink: en ? "External address" : "외부 이미지 주소",
    heroSlidesEmpty: en
      ? "No slides yet. Add an image or video slide."
      : "등록된 슬라이드가 없습니다. 이미지 또는 동영상 슬라이드를 추가하세요.",
    heroSlideAdd: en ? "Add slide" : "슬라이드 추가",
    heroSlideEdit: en ? "Edit slide" : "슬라이드 수정",
    heroSlideDeleteConfirm: en ? "Delete this hero slide?" : "이 히어로 슬라이드를 삭제할까요?",
    heroSlideLabel: en ? "English label above the title" : "상단 영문 표시",
    heroType: en ? "Type" : "유형",
    heroTypeImage: en ? "Image" : "이미지",
    heroTypeVideo: en ? "Video" : "동영상",
    heroMedia: en ? "Media" : "미디어",
    heroMediaUrl: en ? "Media URL" : "미디어 URL",
    heroMediaPick: en ? "Choose file" : "파일 선택",
    heroMediaChange: en ? "Replace file" : "파일 변경",
    heroMediaHint: en
      ? "Image: JPG/PNG/WEBP/GIF (max 8MB) · Video: MP4/WEBM (max 50MB)"
      : "이미지: JPG/PNG/WEBP/GIF (최대 8MB) · 동영상: MP4/WEBM (최대 50MB)",
    heroMediaRequired: en
      ? "Please upload a file or enter a media URL."
      : "파일을 업로드하거나 미디어 URL을 입력하세요.",
    heroUploading: en ? "Uploading…" : "업로드 중…",
    heroUploadFailed: en ? "Upload failed" : "업로드 실패",
    greeting: en ? "Greeting" : "인사말",
    company: en ? "Company" : "회사 정보",
    history: en ? "History" : "연혁",
    historyHint: en
      ? "Add timeline entries. Save after edit."
      : "연혁을 등록·수정합니다. 수정 후 저장하세요.",
    historyAdd: en ? "Add history" : "연혁 추가",
    historyEmpty: en ? "No history yet." : "등록된 연혁이 없습니다.",
    historySave: en ? "Save" : "저장",
    historySaved: en ? "Saved" : "저장됨",
    historyDeleteConfirm: en ? "Delete this history entry?" : "이 연혁을 삭제할까요?",
    performance: en ? "Performance" : "실적",
    performanceHint: en
      ? "Add key project records. Save after edit."
      : "주요 실적을 등록·수정합니다. 수정 후 저장하세요.",
    performanceAdd: en ? "Add performance" : "실적 추가",
    performanceEmpty: en
      ? "No performance records yet. Add one with the button above."
      : "등록된 실적이 없습니다. 위 버튼으로 추가하세요.",
    performanceSave: en ? "Save" : "저장",
    performanceSaved: en ? "Saved" : "저장됨",
    performanceClient: en ? "Client" : "고객사",
    performanceDeleteConfirm: en ? "Delete this performance record?" : "이 실적을 삭제할까요?",
    services: en ? "Services" : "서비스",
    servicesHint: en
      ? "Edit page copy, offerings, brands, and product documents shown on /services."
      : "제공 서비스·브랜드·제품 자료를 관리합니다. 저장하면 /services에 바로 반영됩니다.",
    servicesPage: en ? "Page copy" : "페이지 문구",
    servicesFieldLabel: en ? "English label above the title" : "상단 영문 표시",
    servicesOfferingsTitle: en ? "Service area title" : "서비스 영역 제목",
    servicesOfferingsLead: en ? "Service area description" : "서비스 영역 설명",
    servicesCategoryTitle: en ? "Category title" : "분류 제목",
    servicesCategoryLead: en ? "Category description" : "분류 설명",
    servicesCtaTitle: en ? "Inquiry heading" : "문의 안내 제목",
    servicesCtaLead: en ? "Inquiry description" : "문의 안내 설명",
    servicesCtaButton: en ? "Inquiry button" : "문의 버튼 문구",
    servicesViewDocs: en ? "Document button" : "자료 보기 버튼 문구",
    servicesOfferings: en ? "Offerings" : "제공 서비스",
    servicesBrands: en ? "Brands & products" : "브랜드·제품",
    servicesCategories: en ? "Categories" : "분류",
    servicesAddOffering: en ? "Add offering" : "서비스 추가",
    servicesAddBrand: en ? "Add brand" : "브랜드 추가",
    servicesAddProduct: en ? "Add product" : "제품 추가",
    servicesAddCategory: en ? "Add category" : "분류 추가",
    servicesMoveUp: en ? "Move up" : "위로",
    servicesMoveDown: en ? "Move down" : "아래로",
    servicesBrandName: en ? "Brand name" : "브랜드명",
    servicesSlug: en ? "URL slug" : "URL 슬러그",
    servicesFolder: en ? "Folder / source" : "폴더·출처",
    servicesLead: en ? "Intro" : "소개",
    servicesProductTitle: en ? "Document title" : "자료 제목",
    servicesProductDesc: en ? "Description" : "설명",
    servicesCatalog: en ? "Catalog file" : "카탈로그 파일",
    servicesCatalogHint: en
      ? "PDF, Word, Excel, JPG/PNG (max 40MB)"
      : "PDF, Word, Excel, JPG/PNG (최대 40MB)",
    servicesCatalogPick: en ? "Attach catalog" : "카탈로그 첨부",
    servicesCatalogChange: en ? "Replace catalog" : "카탈로그 변경",
    servicesCatalogRemove: en ? "Remove catalog" : "카탈로그 제거",
    servicesCatalogEmpty: en ? "No file attached" : "첨부된 파일 없음",
    servicesCategoryItems: en ? "Brand links" : "브랜드 링크",
    servicesCategoryPick: en ? "Select brand to add" : "추가할 브랜드 선택",
    servicesCategoryLinksHint: en
      ? "Choose a brand from the dropdown to add a link."
      : "드롭다운에서 브랜드를 선택하면 링크가 추가됩니다.",
    servicesCategoryFile: en ? "Category catalog" : "분류 카탈로그",
    servicesCategoryFileHint: en
      ? "PDF, Word, Excel, JPG/PNG (max 40MB)"
      : "PDF, Word, Excel, JPG/PNG (최대 40MB)",
    servicesCategoryFilePick: en ? "Attach file" : "파일 첨부",
    servicesCategoryFileChange: en ? "Replace file" : "파일 변경",
    servicesCategoryFileRemove: en ? "Remove file" : "파일 제거",
    servicesCategoryFileEmpty: en ? "No file attached" : "첨부된 파일 없음",
    servicesEmptyOfferings: en ? "No offerings yet." : "등록된 제공 서비스가 없습니다.",
    servicesEmptyBrands: en ? "No brands yet." : "등록된 브랜드가 없습니다.",
    clients: en ? "Clients" : "고객사",
    clientsHint: en
      ? "Save after add/edit — applied to the site. If no logo, the name is shown."
      : "등록·수정 후 저장하면 사이트에 바로 반영됩니다. 로고가 없으면 이름으로 표시됩니다.",
    clientsEmpty: en ? "No clients yet. Use Add to create one." : "등록된 고객사가 없습니다. 등록 버튼으로 추가하세요.",
    clientName: en ? "Client name" : "고객사명",
    clientCreate: en ? "Add client" : "고객사 등록",
    clientEdit: en ? "Edit client" : "고객사 수정",
    clientDeleteConfirm: en ? "Delete this client?" : "이 고객사를 삭제할까요?",
    team: en ? "Team" : "팀원 소개",
    teamHint: en
      ? "Save after add/edit — applied to /team."
      : "등록·수정 후 저장하면 /team 페이지에 바로 반영됩니다.",
    teamCeo: en ? "CEO" : "대표",
    teamMember: en ? "Member" : "팀원",
    teamCreate: en ? "Add member" : "팀원 등록",
    teamEditCeo: en ? "Edit CEO" : "대표 수정",
    teamEditMember: en ? "Edit member" : "팀원 수정",
    teamDeleteConfirm: en ? "Delete this member?" : "이 팀원을 삭제할까요?",
    gallery: en ? "Gallery" : "갤러리",
    galleryHint: en
      ? "Register a photo, then use Save in the header to publish it."
      : "사진을 등록한 뒤 상단 저장을 누르면 갤러리에 반영됩니다.",
    galleryFileHint: en
      ? "JPG, PNG, WEBP · max 8MB · a wide photo works best"
      : "JPG, PNG, WEBP · 최대 8MB · 가로로 긴 사진을 권장합니다",
    galleryEmpty: en ? "No photos yet. Use Add to create one." : "등록된 사진이 없습니다. 등록 버튼으로 추가하세요.",
    galleryCreate: en ? "Add photo" : "사진 등록",
    galleryEdit: en ? "Edit photo" : "사진 수정",
    galleryDeleteConfirm: en ? "Delete this photo?" : "이 사진을 삭제할까요?",
    certificates: en ? "Certificates" : "인증 서류",
    certificatesHint: en
      ? "Register certificates for the About page. Save after add/edit — applied immediately."
      : "회사소개에 표시할 인증 서류를 등록합니다. 등록·수정 후 저장하면 바로 반영됩니다.",
    certificatesEmpty: en
      ? "No certificates yet. Use Add to create one."
      : "등록된 인증 서류가 없습니다. 등록 버튼으로 추가하세요.",
    certificatesCreate: en ? "Add certificate" : "인증 서류 등록",
    certificatesEdit: en ? "Edit certificate" : "인증 서류 수정",
    certificatesDeleteConfirm: en ? "Delete this certificate?" : "이 인증 서류를 삭제할까요?",
    affiliate: en ? "Affiliate" : "관계사",
    affiliateName: en ? "Name" : "이름",
    affiliateTel: en ? "Phone" : "전화",
    affiliateFax: en ? "Fax" : "팩스",
    affiliateEmail: en ? "Email" : "이메일",
    affiliateWebsite: en ? "Website" : "웹사이트",

    companyFields: {
      legalName: en ? "Legal name" : "법인명",
      founded: en ? "Established" : "설립일",
      employees: en ? "Employees" : "임직원",
      businessType: en ? "Business type" : "업종",
      businessItem: en ? "Business scope" : "사업 내용",
      branchIndia: en ? "Visit note" : "방문 안내",
      branchIndiaMapEmbed: en ? "Visit-note map address" : "방문 안내 지도 삽입 주소",
      chennaiOffice: en ? "Office address" : "사무실 주소",
      chennaiMapEmbed: en ? "Map embed address" : "지도 삽입 주소",
      cin: "CIN",
      pan: "PAN",
      tan: "TAN",
      email: en ? "Email" : "이메일",
      phone: en ? "Phone" : "전화",
    },

    passwordTitle: en ? "Change password" : "비밀번호 변경",
    passwordHint: en
      ? "Confirm the current password, then set a new one. It is stored securely on the server."
      : "현재 비밀번호 확인 후 새 비밀번호로 변경합니다. 변경된 비밀번호는 서버에 안전하게 저장됩니다.",
    currentPassword: en ? "Current password" : "현재 비밀번호",
    newPassword: en ? "New password" : "새 비밀번호",
    confirmPassword: en ? "Confirm new password" : "새 비밀번호 확인",
    changePassword: en ? "Change password" : "비밀번호 변경",
    changing: en ? "Changing…" : "변경 중…",

    inquiriesTitle: en ? "Inquiries" : "문의 내역",
    inquiriesHint: en
      ? "Messages submitted from the contact form."
      : "문의 양식으로 접수된 메시지입니다.",
    inquiriesEmpty: en ? "No inquiries yet." : "접수된 문의가 없습니다.",
    inquiriesRefresh: en ? "Refresh" : "새로고침",
    inquiriesDelete: en ? "Delete" : "삭제",
    inquiryStatus: en ? "Status" : "상태",
    inquiryAssignee: en ? "Owner" : "담당자",
    inquiryStatusNew: en ? "New" : "신규",
    inquiryStatusRead: en ? "Seen" : "확인",
    inquiryStatusReplied: en ? "Replied" : "답변 완료",
    systemTitle: en ? "File storage" : "파일 저장소",
    systemOk: en
      ? "Uploads are stored on a persistent path and remain after a restart."
      : "업로드 파일은 유지되는 저장 경로에 있습니다.",
    systemLocal: en
      ? "This environment uses the project data folder."
      : "이 환경은 프로젝트의 data 폴더를 사용합니다.",
    systemSetup: en
      ? "No persistent volume is connected. Uploaded images can disappear on the next deploy."
      : "영구 저장소가 연결되어 있지 않습니다. 업로드한 이미지는 다음 배포 때 사라질 수 있습니다.",
    systemHow: en
      ? "On Railway, add a Volume and mount it at /data, then redeploy. This screen changes to Ready when the volume is connected. Do not mount it at /app/data."
      : "Railway에서 Volume을 추가하고 마운트 경로를 /data 로 지정한 뒤 다시 배포하세요. 연결되면 이 화면이 정상으로 바뀝니다. /app/data 에는 연결하지 마세요.",
    systemBackup: en
      ? "No backup time is recorded."
      : "마지막 백업 시각은 기록되어 있지 않습니다.",
    visitsNote: en
      ? "Visits to the admin pages are not counted."
      : "관리자 화면 방문은 집계하지 않습니다.",
    inquiriesDeleteConfirm: en ? "Delete this inquiry?" : "이 문의를 삭제할까요?",
    inquiriesLoading: en ? "Loading inquiries…" : "문의 불러오는 중…",
    inquiryDeleteConfirm: en ? "Delete this inquiry?" : "이 문의를 삭제할까요?",

    mailTitle: en ? "Mail settings" : "메일 설정",
    mailHint: en
      ? "Google SMTP for inquiry email notifications."
      : "문의 알림용 Google SMTP 설정입니다.",
    mailGuide: en
      ? "Use a Google App Password (not your normal Gmail password)."
      : "일반 Gmail 비밀번호가 아닌 Google 앱 비밀번호를 사용하세요.",
    mailEnabled: en ? "Enable sending" : "발송 사용",
    mailHost: en ? "SMTP host" : "SMTP 호스트",
    mailPort: en ? "Port" : "포트",
    mailSecure: en ? "Use SSL/TLS" : "SSL/TLS 사용",
    mailUser: en ? "Gmail address" : "Gmail 주소",
    mailPass: en ? "App password" : "앱 비밀번호",
    mailPassKeep: en ? "Leave blank to keep the current password" : "비워 두면 기존 비밀번호 유지",
    mailFromName: en ? "From name" : "발신자 이름",
    mailFromEmail: en ? "From email" : "발신 이메일",
    mailTo: en ? "Recipient" : "수신자",
    mailSave: en ? "Save mail settings" : "메일 설정 저장",
    mailSaved: en ? "Mail settings saved." : "메일 설정이 저장되었습니다.",
    mailTest: en ? "Send test email" : "테스트 메일 보내기",
    mailTestOk: en ? "Test email sent." : "테스트 메일을 보냈습니다.",
    mailAppPasswordHelp: en
      ? "Google Account → Security → 2-Step Verification → App passwords"
      : "Google 계정 → 보안 → 2단계 인증 → 앱 비밀번호",
  };
}

export type AdminUi = ReturnType<typeof adminUi>;
