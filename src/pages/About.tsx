import { motion } from "framer-motion";
import { Lightbulb, Award, Handshake, FlaskConical } from "lucide-react";
import Layout from "@/components/Layout";

const values = [
  { icon: Lightbulb, title: "창의적 혁신", desc: "전통과 현대를 융합하는 독창적인 레시피 개발" },
  { icon: Award, title: "최상의 품질", desc: "엄격한 품질 관리 시스템으로 일관된 프리미엄 제품 생산" },
  { icon: Handshake, title: "신뢰의 파트너십", desc: "클라이언트와의 긴밀한 소통으로 최적의 결과 도출" },
  { icon: FlaskConical, title: "기술력", desc: "최신 R&D 역량과 전문 인력으로 차별화된 솔루션 제공" },
];

const timeline = [
  { year: "2010", event: "다인그룹 설립" },
  { year: "2013", event: "첫 번째 맞춤 주류 프로젝트 완료" },
  { year: "2016", event: "프리미엄 증류 시설 확장" },
  { year: "2019", event: "해외 수출 파트너십 체결" },
  { year: "2021", event: "R&D 센터 설립" },
  { year: "2023", event: "누적 50+ 브랜드 협업 달성" },
  { year: "2024", event: "글로벌 시장 확장 및 신규 카테고리 진출" },
];

const processSteps = [
  { num: "01", title: "상담 & 기획", desc: "브랜드 비전과 목표를 분석하고 최적의 제품 콘셉트를 설계합니다." },
  { num: "02", title: "R&D & 개발", desc: "전문 연구진이 레시피 개발 및 시제품을 제작합니다." },
  { num: "03", title: "테스트 & 생산", desc: "품질 테스트를 거쳐 본 생산 체계를 구축합니다." },
  { num: "04", title: "출시 & 지원", desc: "제품 출시와 마케팅, 유통까지 전방위 지원합니다." },
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
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">About Us</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            맞춤 주류 제작의 <span className="text-gradient-gold">전문 파트너</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            다인그룹은 브랜드의 비전을 담은 맞춤 주류를 기획·개발·생산하는 토탈 솔루션 기업입니다.
            10년 이상의 경험과 50개 이상의 브랜드 협업 실적을 바탕으로, 최상의 품질과 차별화된 가치를 제공합니다.
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
              대한민국 맞춤 주류 제작의 글로벌 리더로서, 각 브랜드의 고유한 스토리와 가치를 세계에 전달합니다.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="text-center md:text-left">
            <h3 className="text-accent font-medium text-sm tracking-widest uppercase mb-2">Mission</h3>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">미션</h2>
            <p className="text-muted-foreground leading-relaxed">
              전문적인 기술력과 창의적인 협업을 통해 클라이언트의 브랜드 가치를 극대화하는 프리미엄 주류를 창조합니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Core Values */}
    <section className="py-20 bg-secondary/50">
      <div className="container">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Core Values</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">핵심 가치</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {values.map((v, i) => (
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

    {/* Process */}
    <section className="py-20">
      <div className="container">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Process</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">맞춤 제작 프로세스</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {processSteps.map((s, i) => (
            <motion.div key={s.num} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
              <span className="font-display text-5xl font-bold text-accent/20">{s.num}</span>
              <h3 className="font-semibold text-foreground mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < processSteps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 w-8 h-px bg-border" />
              )}
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
