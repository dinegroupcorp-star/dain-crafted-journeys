import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            DAIN<span className="text-gold">GROUP</span>
          </h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            맞춤 주류 제작의 파트너.<br />
            브랜드의 가치를 함께 만들어갑니다.
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
            <div className="flex items-center gap-2"><Mail size={14} /> contact@daingroup.co.kr</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> 서울특별시 강남구</div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
              <Instagram size={14} /> @daingroup
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} DAIN GROUP. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
