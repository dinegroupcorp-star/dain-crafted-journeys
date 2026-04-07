import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Instagram, Globe, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PortfolioCard from "@/components/PortfolioCard";
import { portfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams();
  const product = portfolioItems.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">제품을 찾을 수 없습니다.</p>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link to="/portfolio">포트폴리오로 돌아가기</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const related = portfolioItems.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <Layout>
      {/* Back */}
      <div className="container pt-8">
        <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft size={16} /> 포트폴리오로 돌아가기
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary">
                <img src={product.image} alt={product.productName} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">{product.brand}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{product.productName}</h1>
              <div className="flex gap-2 mb-6">
                <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">{product.category}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">{product.year}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.specs.map((s) => (
                  <div key={s.label} className="bg-secondary rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="font-semibold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {product.instagram && (
                  <a href={product.instagram} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                      <Instagram size={14} /> Instagram
                    </Button>
                  </a>
                )}
                {product.brandSite && (
                  <a href={product.brandSite} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                      <Globe size={14} /> 브랜드 사이트
                    </Button>
                  </a>
                )}
                {product.purchaseLink ? (
                  <a href={product.purchaseLink} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="rounded-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      <ShoppingBag size={14} /> 구매하기
                    </Button>
                  </a>
                ) : (
                  <Button size="sm" disabled className="rounded-full gap-2">
                    <ShoppingBag size={14} /> Coming Soon
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Story */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Client Story</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">우리가 함께 한 이유</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{product.clientStory}</p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Collaboration Process</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-10">협업 과정</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {product.timeline.map((t, i) => (
              <motion.div
                key={t.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-bold text-accent">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t.step}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">관련 포트폴리오</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {related.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
