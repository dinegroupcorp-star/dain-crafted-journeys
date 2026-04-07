import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import PortfolioCard from "@/components/PortfolioCard";
import { portfolioItems, categories, brands, years } from "@/data/portfolio";
import { Input } from "@/components/ui/input";

const Portfolio = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [selectedYear, setSelectedYear] = useState("전체");

  const filtered = useMemo(() => {
    return portfolioItems.filter((item) => {
      const matchSearch =
        !search ||
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "전체" || item.category === selectedCategory;
      const matchBrand = selectedBrand === "전체" || item.brand === selectedBrand;
      const matchYear = selectedYear === "전체" || item.year === Number(selectedYear);
      return matchSearch && matchCategory && matchBrand && matchYear;
    });
  }, [search, selectedCategory, selectedBrand, selectedYear]);

  const FilterButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-accent text-accent-foreground"
          : "bg-secondary text-muted-foreground hover:bg-accent/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <Layout>
      {/* Header */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Portfolio</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">우리의 협업 성과</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              다양한 브랜드와 함께 만들어 온 맞춤 주류 포트폴리오를 확인하세요.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="브랜드 또는 제품명 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full bg-secondary border-0 text-sm"
              />
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 flex-1">
              {["전체", ...categories].map((c) => (
                <FilterButton key={c} label={c} active={selectedCategory === c} onClick={() => setSelectedCategory(c)} />
              ))}
            </div>
          </div>

          {/* Year & Brand row */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-muted-foreground self-center mr-1">연도:</span>
            {["전체", ...years.map(String)].map((y) => (
              <FilterButton key={y} label={y} active={selectedYear === y} onClick={() => setSelectedYear(y)} />
            ))}
            <span className="text-xs text-muted-foreground self-center ml-4 mr-1">브랜드:</span>
            {["전체", ...brands].map((b) => (
              <FilterButton key={b} label={b} active={selectedBrand === b} onClick={() => setSelectedBrand(b)} />
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="container">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`${selectedCategory}-${selectedBrand}-${selectedYear}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <PortfolioCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-20"
              >
                검색 결과가 없습니다.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
