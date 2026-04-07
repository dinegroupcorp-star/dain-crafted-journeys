import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "홈", path: "/" },
  { label: "회사 소개", path: "/about" },
  { label: "포트폴리오", path: "/portfolio" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          DAIN<span className="text-gradient-gold">GROUP</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-accent ${
                location.pathname === item.path ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6">
            <Link to="/portfolio">문의하기</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-background border-t border-border px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium py-2 text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="w-full bg-accent text-accent-foreground rounded-full">
            <Link to="/portfolio" onClick={() => setMobileOpen(false)}>문의하기</Link>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
