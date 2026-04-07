import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { PortfolioItem } from "@/data/portfolio";

const PortfolioCard = ({ item }: { item: PortfolioItem }) => (
  <Link to={`/portfolio/${item.id}`} className="group block hover-lift">
    <div className="overflow-hidden rounded-lg bg-card border border-border/50">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.productName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-medium tracking-wider uppercase text-accent mb-1">{item.brand}</p>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.productName}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.shortDescription}</p>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2 transition-all">
          상세보기 <ArrowRight size={12} />
        </span>
      </div>
    </div>
  </Link>
);

export default PortfolioCard;
