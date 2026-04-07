import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import PortfolioCard from "@/components/PortfolioCard";
import { portfolioItems } from "@/data/portfolio";
import heroBg from "@/assets/hero-bg.jpg";

const partnerBrands = ["Aurora Spirits", "한빛소주", "블룸 브루어리", "테루아 와이너리", "미드나잇 디스틸러리", "제주 스피리츠"];

const Index = () => {
  const featured = portfolioItems.filter((p) => p.featured).slice(0, 4);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="다인그룹 히어로" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">Custom Spirits Partner</p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              함께 만드는<br />
              <span className="text-gradient-gold">브랜드의 가치</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              맞춤 주류 제작 전문 기업 다인그룹이 브랜드의 비전을 현실로 만들어 드립니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
                <Link to="/portfolio">포트폴리오 보기</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8">
                <Link to="/about">회사 소개</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="py-12 border-b border-border overflow-hidden bg-secondary/50">
        <div className="container mb-6">
          <p className="text-center text-xs font-medium tracking-widest uppercase text-muted-foreground">Trusted Partners</p>
        </div>
        <div className="relative">
          <div className="flex animate-scroll-x gap-16 whitespace-nowrap">
            {[...partnerBrands, ...partnerBrands].map((brand, i) => (
              <span key={i} className="text-lg font-display font-semibold text-muted-foreground/50 select-none">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Portfolio</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">협업 하이라이트</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <PortfolioCard item={item} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link to="/portfolio" className="inline-flex items-center gap-2">
                포트폴리오 전체 보기 <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            당신의 브랜드에 맞는<br />
            <span className="text-gold">특별한 주류</span>를 만들어 보세요
          </h2>
          <p className="text-primary-foreground/70 max-w-md mx-auto mb-8">
            기획부터 생산, 출시까지 — 다인그룹이 전 과정을 함께합니다.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10">
            <Link to="/about">상담 문의</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
