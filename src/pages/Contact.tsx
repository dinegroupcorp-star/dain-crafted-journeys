import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "문의가 접수되었습니다", description: "빠른 시일 내에 연락드리겠습니다." });
    setForm({ name: "", company: "", email: "", phone: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container text-center">
          <motion.div {...fadeUp}>
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-2">Contact</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">문의하기</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              맞춤 주류 제작, 파트너쉽, 컨설팅 등 다인그룹에 대해 궁금한 점을 문의해 주세요.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">연락처 정보</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">이메일</p>
                    <a href="mailto:contact@dinegroup.co.kr" className="text-muted-foreground hover:text-accent transition-colors">
                      contact@dinegroup.co.kr
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">전화</p>
                    <p className="text-muted-foreground">02-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">주소</p>
                    <p className="text-muted-foreground">서울특별시</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-secondary rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">예상 프로젝트 기간</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 전문가 추천 방식: 약 <strong className="text-foreground">2개월</strong></li>
                  <li>• 모든 부분 커스터마이징: 약 <strong className="text-foreground">4개월</strong></li>
                </ul>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">문의 폼</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">이름 *</label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="홍길동"
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">회사명</label>
                    <Input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="회사명"
                      className="bg-secondary border-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">이메일 *</label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@example.com"
                      className="bg-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">연락처</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="010-0000-0000"
                      className="bg-secondary border-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">문의 내용 *</label>
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="맞춤 주류 제작, 파트너쉽, 컨설팅 등 궁금한 내용을 작성해 주세요."
                    rows={5}
                    className="bg-secondary border-0"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full gap-2">
                  <Send size={16} /> 문의 보내기
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
