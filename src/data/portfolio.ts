export interface PortfolioItem {
  id: string;
  brand: string;
  productName: string;
  category: string;
  year: number;
  description: string;
  shortDescription: string;
  image: string;
  clientStory: string;
  timeline: { step: string; description: string }[];
  specs: { label: string; value: string }[];
  instagram?: string;
  brandSite?: string;
  purchaseLink?: string;
  featured?: boolean;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "aurora-craft-gin",
    brand: "Aurora Spirits",
    productName: "오로라 크래프트 진",
    category: "진 (Gin)",
    year: 2024,
    description: "한국 전통 보타니컬을 활용한 프리미엄 크래프트 진. 유자, 솔잎, 감귤 껍질의 조화로운 향이 특징이며, 부드럽고 깔끔한 피니시를 자랑합니다.",
    shortDescription: "한국 보타니컬의 프리미엄 크래프트 진",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80",
    clientStory: "Aurora Spirits는 한국의 자연에서 영감을 받아, 글로벌 시장에서 경쟁력 있는 프리미엄 진을 만들고자 했습니다. 다인그룹과의 협업을 통해 한국 고유의 보타니컬을 활용한 독창적인 레시피를 개발했습니다.",
    timeline: [
      { step: "기획", description: "브랜드 콘셉트 및 타겟 시장 분석" },
      { step: "개발", description: "보타니컬 선정 및 레시피 R&D" },
      { step: "생산", description: "소규모 배치 테스트 후 본 생산" },
      { step: "출시", description: "프리미엄 채널 론칭 및 마케팅" },
    ],
    specs: [
      { label: "용량", value: "700ml" },
      { label: "도수", value: "43%" },
      { label: "원산지", value: "대한민국" },
      { label: "주요 보타니컬", value: "유자, 솔잎, 감귤" },
    ],
    instagram: "https://instagram.com",
    brandSite: "https://example.com",
    purchaseLink: "https://example.com",
    featured: true,
  },
  {
    id: "hanbit-soju",
    brand: "한빛소주",
    productName: "한빛 프리미엄 소주",
    category: "소주",
    year: 2024,
    description: "100% 국내산 쌀로 빚은 프리미엄 소주. 전통 증류 방식과 현대적 기술의 조화로 깨끗하고 부드러운 맛을 완성했습니다.",
    shortDescription: "국내산 쌀로 빚은 프리미엄 소주",
    image: "https://images.unsplash.com/photo-1574006852726-31d127421999?w=600&q=80",
    clientStory: "한빛소주는 전통 소주의 가치를 현대적으로 재해석하고자 했습니다. 다인그룹의 증류 기술과 품질 관리 시스템을 통해 일관된 고품질 소주를 생산할 수 있게 되었습니다.",
    timeline: [
      { step: "기획", description: "전통 소주 시장 조사 및 포지셔닝" },
      { step: "개발", description: "원료 선정 및 증류 프로세스 최적화" },
      { step: "생산", description: "품질 테스트 및 대량 생산 체계 구축" },
      { step: "출시", description: "전국 유통망 확보 및 브랜드 런칭" },
    ],
    specs: [
      { label: "용량", value: "375ml" },
      { label: "도수", value: "21%" },
      { label: "원산지", value: "대한민국" },
      { label: "원료", value: "100% 국내산 쌀" },
    ],
    instagram: "https://instagram.com",
    featured: true,
  },
  {
    id: "bloom-makgeolli",
    brand: "블룸 브루어리",
    productName: "블룸 스파클링 막걸리",
    category: "막걸리",
    year: 2023,
    description: "젊은 세대를 위한 스파클링 막걸리. 자연 발효 탄산과 프루티한 풍미가 어우러진 새로운 형태의 전통주입니다.",
    shortDescription: "젊은 세대를 위한 스파클링 막걸리",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80",
    clientStory: "블룸 브루어리는 MZ세대에게 어필할 수 있는 새로운 형태의 전통주를 원했습니다. 다인그룹과 함께 자연 발효 공법을 적용한 스파클링 막걸리를 개발했습니다.",
    timeline: [
      { step: "기획", description: "MZ세대 음주 트렌드 분석" },
      { step: "개발", description: "자연 발효 탄산 기술 적용" },
      { step: "생산", description: "패키지 디자인 및 생산 라인 구축" },
      { step: "출시", description: "SNS 마케팅 및 팝업스토어 운영" },
    ],
    specs: [
      { label: "용량", value: "500ml" },
      { label: "도수", value: "6%" },
      { label: "원산지", value: "대한민국" },
      { label: "특징", value: "자연 발효 탄산" },
    ],
    brandSite: "https://example.com",
    featured: true,
  },
  {
    id: "terroir-wine",
    brand: "테루아 와이너리",
    productName: "테루아 로제 와인",
    category: "와인",
    year: 2023,
    description: "국내 포도 품종을 활용한 프리미엄 로제 와인. 섬세한 과일향과 우아한 산미가 조화를 이루는 한국형 로제입니다.",
    shortDescription: "국내 포도 품종의 프리미엄 로제",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    clientStory: "테루아 와이너리는 한국 테루아의 가능성을 세계에 알리고 싶었습니다. 다인그룹의 와인 제조 컨설팅을 통해 국제 품평회에서 인정받는 품질을 달성했습니다.",
    timeline: [
      { step: "기획", description: "한국 포도 품종 특성 분석" },
      { step: "개발", description: "와인 메이킹 프로세스 설계" },
      { step: "생산", description: "빈티지 생산 및 숙성" },
      { step: "출시", description: "와인 전문 채널 유통 및 수출" },
    ],
    specs: [
      { label: "용량", value: "750ml" },
      { label: "도수", value: "12.5%" },
      { label: "원산지", value: "대한민국" },
      { label: "품종", value: "캠벨 얼리, MBA" },
    ],
    instagram: "https://instagram.com",
    brandSite: "https://example.com",
    purchaseLink: "https://example.com",
    featured: true,
  },
  {
    id: "midnight-whisky",
    brand: "미드나잇 디스틸러리",
    productName: "미드나잇 싱글몰트",
    category: "위스키",
    year: 2022,
    description: "한국산 보리를 사용한 싱글몰트 위스키. 오크 캐스크에서 3년간 숙성하여 깊은 풍미와 스모키한 여운을 담았습니다.",
    shortDescription: "한국산 보리의 싱글몰트 위스키",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80",
    clientStory: "미드나잇 디스틸러리는 한국 최초의 프리미엄 싱글몰트 위스키를 목표로 했습니다. 다인그룹과 3년 이상의 장기 프로젝트를 통해 독보적인 한국형 위스키를 완성했습니다.",
    timeline: [
      { step: "기획", description: "위스키 시장 분석 및 전략 수립" },
      { step: "개발", description: "몰팅, 증류, 숙성 프로세스 설계" },
      { step: "생산", description: "3년 오크 캐스크 숙성" },
      { step: "출시", description: "한정판 출시 및 프리미엄 유통" },
    ],
    specs: [
      { label: "용량", value: "700ml" },
      { label: "도수", value: "46%" },
      { label: "원산지", value: "대한민국" },
      { label: "숙성", value: "3년 오크 캐스크" },
    ],
    instagram: "https://instagram.com",
  },
  {
    id: "jeju-spirits",
    brand: "제주 스피리츠",
    productName: "제주 감귤 리큐르",
    category: "리큐르",
    year: 2023,
    description: "제주 한라봉과 감귤을 활용한 프리미엄 리큐르. 제주의 청정 자연을 담은 상큼하고 향긋한 맛이 특징입니다.",
    shortDescription: "제주 감귤의 프리미엄 리큐르",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80",
    clientStory: "제주 스피리츠는 제주도의 특산물을 활용한 프리미엄 리큐르를 만들고자 했습니다. 다인그룹의 주류 제조 노하우를 통해 감귤의 풍미를 최대한 살린 제품을 개발했습니다.",
    timeline: [
      { step: "기획", description: "제주 특산물 활용 컨셉 개발" },
      { step: "개발", description: "감귤 추출 및 배합 최적화" },
      { step: "생산", description: "제주 현지 생산 시설 구축" },
      { step: "출시", description: "관광 채널 및 온라인 유통" },
    ],
    specs: [
      { label: "용량", value: "500ml" },
      { label: "도수", value: "23%" },
      { label: "원산지", value: "제주, 대한민국" },
      { label: "주요 원료", value: "한라봉, 감귤" },
    ],
    brandSite: "https://example.com",
    purchaseLink: "https://example.com",
  },
];

export const categories = [...new Set(portfolioItems.map(item => item.category))];
export const brands = [...new Set(portfolioItems.map(item => item.brand))];
export const years = [...new Set(portfolioItems.map(item => item.year))].sort((a, b) => b - a);
