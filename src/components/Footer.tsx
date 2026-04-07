import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            DINE<span className="text-gold">GROUP</span>
          </h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed mb-2">
            For the community, We connect people
          </p>
          <p className="text-primary-foreground/50 text-xs leading-relaxed">
            사람들의 테이블에 소통의 즐거움, 행복을 가득 채우는 다인그룹 주식회사
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-sm tracking-wider uppercase mb-4 text-gold">사이트맵</h4>
          <div className="space-y-2">
            {[
              { label: "홈", path: "/" },
              { label: "회사 소개", path: "/about" },
              { label: "포트폴리오", path: "/portfolio" },
              { label: "문의", path: "/contact" },
            ].map((link) => (
              <Link key={link.path} to={link.path} className="block text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-sm tracking-wider uppercase mb-4 text-gold">연락처</h4>
          <div className="space-y-3 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-2"><Phone size={14} /> 02-1234-5678</div>
            <div className="flex items-center gap-2"><Mail size={14} /> contact@dinegroup.co.kr</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> 서울특별시</div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
              <Instagram size={14} /> @dinegroup
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} 다인그룹 주식회사 (Dine Group Corp). All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
