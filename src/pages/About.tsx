import { motion } from "framer-motion";
import { Sun, Shield, Truck, Globe, Award, Handshake, Beer, MapPin } from "lucide-react";
import Layout from "@/components/Layout";

const capabilities = [
  { icon: Globe, title: "주류 수출 면허", desc: "베트남, 일본, 호주 벤더 보유" },
  { icon: Shield, title: "온라인 판매 면허", desc: "합법적 온라인 주류 유통" },
  { icon: Award, title: "유통 전문 판매업 면허", desc: "전문 유통 채널 운영" },
  { icon: Truck, title: "SCM & 거점 물류", desc: "Barogo 협업, 전국 3PL 물류" },
];

const breweryRegions = [
  { region: "서울", count: 6, breweries: "어메이징브루잉컴퍼니(성수), 구스아일랜드브루하우스(역삼), 가로수브루잉컴퍼니(신사), 미스터브루잉컴퍼니(마포), 브로이하우스바네하임(공릉), 더부스(이태원)" },
  { region: "강원", count: 4, breweries: "강릉브루어리, 버드나무브루어리, 몽트비어, 크래프트루트" },
  { region: "경기&인천", count: 5, breweries: "레비브루잉, 플레이그라운드브루어리, 카브루, 핸드앤몰트, 부족한 녀석들" },
  { region: "경상", count: 5, breweries: "가나다라브루어리, 트레비어, 화수브루어리, 브라이트브루잉컴퍼니, 안동맥주" },
  { region: "충청", count: 6, breweries: "코리아크래프트브루어리, 더랜치브루잉, 칠홉스브루잉코, 브루어리304, 금강브루어리바이젠하우스, 뱅크크릭브루잉" },
  { region: "부산", count: 4, breweries: "와일드웨이브, 갈매기브루잉, 고릴라브루잉, 어드밴스드브루잉컴퍼니" },
  { region: "전라", count: 5, breweries: "장앤크래프트브루어리, 슬로시티, 애프터웍스/무등산브루어리, 파머스맥주, 담주브로이" },
  { region: "제주", count: 3, breweries: "제주맥주브루어리, 사우스바운더, 맥파이브루어리" },
];

const processSteps = [
  { num: "01", title: "프로젝트 기획", desc: "컨셉과 제품명, 맥주 타입(SKU) 결정", duration: "" },
  { num: "02", title: "아이디어 시각화", desc: "디자인 컨셉과 패키지 구성 협의", duration: "" },
  { num: "03", title: "행정 절차 진행", desc: "식약처, 국세청 신고, 주류브랜드 등록", duration: "" },
  { num: "04", title: "프로젝트 완료 및 납품", desc: "생산 및 납품 시작", duration: "" },
];

const timeline = [
  { year: "2020", event: "나미나라공화국(남이섬) 파트너쉽 체결" },
  { year: "2022", event: "경주 황남주택, 효성 세빛섬, 호텔 나루 엠 갤러리 등 협업 확대" },
  { year: "2023", event: "카카오 엔터, 알펜시아, 반얀트리 호텔 파트너쉽" },
  { year: "2024", event: "효성 TNC, 문스타 하이볼, 소노 리조트, 동원 물류 등 대규모 파트너쉽 확장" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => (
  <Layout>
    {/* Hero */}
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun size={20} className="text-accent" />
            <p className="text-accent text-sm font-medium tracking-widest uppercase">About Dine Group</p>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            사람을 잇는 <span className="text-gradient-gold">테이블</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            다인그룹 주식회사는 "For the community, We connect people"이라는 슬로건 아래,
            사람들의 테이블에 소통의 즐거움과 행복을 가득 채우는 것을 목적으로 합니다.
            생명력을 상징하는 햇살처럼, 따스한 진심을 전달합니다.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Vision & Mission */}
    <section className="py-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center md:text-left">
            <h3 className="text-accent font-medium text-sm tracking-widest uppercase mb-2">Vision</h3>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">비전</h2>
            <p className="text-muted-foreground leading-relaxed">
              우리는 테이블이 되고자 합니다. 사람들의 테이블에 소통의 즐거움, 행복을 가득 채우는 것을 목적으로 합니다.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="text-center md:text-left">
            <h3 className="text-accent font-medium text-sm tracking-widest uppercase mb-2">Identity</h3>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">브랜드 정체성</h2>
            <p className="text-muted-foreground leading-relaxed">
              생명력을 상징하는 햇살. 따스한 햇살과 같이 전달되는 진심을 형상화한 것이 다인그룹의 브랜드 정체성입니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Business Areas */}
    <section className="py-20 bg-secondary/50">
      <div className="container">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Business Areas</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">사업 영역</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Beer, title: "모든 주류", desc: "리얼 위스키, 하이볼, 한국 수제맥주, 전통주" },
            { icon: Sun, title: "건강한 식음료", desc: "커스텀 음료 제작, 토닉(Tonic) 음료" },
            { icon: Handshake, title: "브랜딩", desc: "새로운 이야기 전달" },
            { icon: Award, title: "특별한 선물", desc: "맞춤 선물 제작" },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-lg p-6 text-center border border-border/50 hover-lift"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <v.icon size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Capabilities */}
    <section className="py-20">
      <div className="container">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Capabilities</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">회사 역량</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-lg p-6 text-center border border-border/50 hover-lift"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <c.icon size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.p {...fadeUp} className="text-center text-sm text-muted-foreground mt-8">
          산업기사 · 전문가 네트워크를 통한 차별화된 솔루션 제공
        </motion.p>
      </div>
    </section>

    {/* Process */}
    <section className="py-20 bg-secondary/50">
      <div className="container">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Process</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">맞춤 제작 프로세스</h2>
          <p className="text-muted-foreground mt-3">
            전문가 추천 방식 약 <strong className="text-foreground">2개월</strong> · 모든 부분 커스터마이징 약 <strong className="text-foreground">4개월</strong>
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {processSteps.map((s, i) => (
            <motion.div key={s.num} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
              <span className="font-display text-5xl font-bold text-accent/20">{s.num}</span>
              <h3 className="font-semibold text-foreground mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Partner Breweries */}
    <section className="py-20">
      <div className="container">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Partner Network</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">파트너 브루어리</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            전국 수제맥주 브랜드 공급계약 / 전국 3PL물류, 동원, SCM을 활용한 전국을 연결합니다.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {breweryRegions.map((r, i) => (
            <motion.div
              key={r.region}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card rounded-lg p-5 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-accent" />
                <h3 className="font-semibold text-foreground">{r.region}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{r.count}개</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.breweries}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">History</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">연혁</h2>
        </motion.div>
        <div className="max-w-2xl mx-auto space-y-0">
          {timeline.map((t, i) => (
            <motion.div
              key={t.year}
              {...fadeUp}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-6 py-4 border-b border-primary-foreground/10 last:border-0"
            >
              <span className="font-display text-2xl font-bold text-gold w-20 shrink-0">{t.year}</span>
              <span className="text-primary-foreground/80 pt-1">{t.event}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
