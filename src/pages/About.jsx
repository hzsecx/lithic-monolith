import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ABOUT_IMAGE = 'https://media.base44.com/images/public/69f2e4b70bf151eda077e6ed/3b85f2360_generated_eb7782aa.png';

const values = [
  { num: '01', title: 'Jeolojik Bütünlük', desc: 'Her levhayı kaynağından izleyerek, doğanın milyonlarca yıllık eserine saygı duyuyoruz.' },
  { num: '02', title: 'Mimari Mükemmellik', desc: 'Dünyanın en prestijli projelerinde, en yüksek standartlara uygun mermerler sunuyoruz.' },
  { num: '03', title: 'Sürdürülebilir Çıkarım', desc: 'Çevreye duyarlı ocak işletmeciliği ve sorumlu kaynak yönetimi ilkelerimizin temelidir.' },
  { num: '04', title: 'Küresel Erişim', desc: '24 ülkede faaliyet göstererek, dünya genelinde premium mermer erişimi sağlıyoruz.' },
];

export default function About() {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <img src={ABOUT_IMAGE} alt="Mimari mermer merdiven" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1600px] mx-auto"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3">Hakkımızda</p>
            <h1 className="font-display text-4xl lg:text-7xl font-bold text-white tracking-tight">
              Taşın Hikâyesi,
              <br />
              <span className="italic font-normal">Bizim Hikâyemiz.</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6">Vizyonumuz</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold leading-snug tracking-tight">
              Dünyanın en derin ocaklarından, en zarif mekânlara köprü kuruyoruz.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base leading-[1.8] text-muted-foreground"
          >
            <p className="mb-6">
              40 yılı aşkın süredir, Lithic Monolith olarak dünyanın en prestijli mermer ocaklarından
              en kaliteli doğal taşları seçiyor, işliyor ve dünya genelindeki mimari projelere sunuyoruz.
            </p>
            <p>
              Her mermer levha, milyonlarca yıllık jeolojik süreçlerin benzersiz bir eseridir.
              Biz bu eserleri, modern mimarinin zarafetiyle buluşturarak, mekânlara zamansız
              bir karakter kazandırıyoruz.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="border-y border-border">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {values.map((v, i) => (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-xs text-muted-foreground font-mono">{v.num}</span>
                <h3 className="font-display text-xl font-semibold mt-3 mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl lg:text-5xl font-semibold tracking-tight mb-6">
            Projenizi Birlikte Şekillendirelim
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            İletişime Geçin
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}