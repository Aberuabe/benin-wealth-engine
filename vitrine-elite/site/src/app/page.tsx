"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  Zap, 
  ShieldCheck, 
  Target, 
  ArrowRight, 
  Code2, 
  LayoutTemplate, 
  PenTool,
  ChevronRight,
  MessageCircle,
  Database,
  Layers,
  Cpu,
  Globe,
  ExternalLink
} from "lucide-react";

// ANIMATION CONSTANTS
const fadeIn: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const mailTo = "mailto:dotonouabel@gmail.com?subject=Demande d'Audit Conversion - Vitrine d'Élite&body=Bonjour Abel, je souhaite doubler mes conversions...";
  const whatsappUrl = "https://wa.me/2290167750083?text=Bonjour%20Abel,%20je%20souhaite%20en%20savoir%20plus%20sur%20tes%20machines%20à%20cash.";

  return (
    <div className="min-h-screen selection:bg-elite-gold selection:text-black relative bg-elite-black text-white overflow-x-hidden">
      <div className="noise-overlay" />
      
      {/* BARRE DE PROGRESSION */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-elite-gold z-[100] origin-left" style={{ scaleX }} />

      {/* CURSEUR LUMINEUX (FOLLOW MOUSE) */}
      <motion.div 
        className="fixed top-0 left-0 w-96 h-96 bg-elite-gold/10 rounded-full blur-[100px] pointer-events-none z-0 hidden lg:block"
        animate={{
          x: mousePos.x - 192,
          y: mousePos.y - 192,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 150, mass: 0.5 }}
      />

      {/* BOUTON WHATSAPP FLOTTANT */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] cursor-pointer"
      >
        <MessageCircle size={28} />
      </motion.a>

      {/* NAVBAR FLOTTANTE */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between border-white/5 shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-8 h-8 bg-elite-gold rounded-full flex items-center justify-center"
            >
              <span className="font-display font-bold text-black text-xs">V.E</span>
            </motion.div>
            <span className="font-display font-semibold tracking-widest text-sm uppercase hidden sm:block">Vitrine d'Élite</span>
          </div>
          
          <div className="flex items-center gap-6 sm:gap-10">
            <a href="#tech-stack" className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-elite-gold transition-colors">Tech Stack</a>
            <motion.a 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(202, 138, 4, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              href={mailTo} 
              className="bg-elite-gold text-black text-[10px] uppercase tracking-[0.2em] font-bold px-5 py-2 rounded-full transition-all"
            >
              Audit Flash
            </motion.a>
          </div>
        </motion.div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            <div className="overflow-hidden mb-8 mt-12">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-[7.5rem] font-display font-medium leading-[0.85] tracking-tighter"
              >
                Vos réseaux sont une location. <br />
                <span className="gold-gradient italic">Bâtissez votre empire.</span>
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-3xl mx-auto text-stone-400 text-lg md:text-xl font-light leading-relaxed mb-12"
            >
              Instagram et Facebook ne vous appartiennent pas. J'aide les PME ambitieuses à s'émanciper des plateformes sociales en créant des <span className="text-white font-medium">machines de vente autonomes</span> qui convertissent votre audience en capital réel.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={mailTo} 
                className="group relative bg-elite-gold text-black px-12 py-6 rounded-full font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:pr-16 text-center w-full sm:w-auto"
              >
                <span className="relative z-10">Lancer l'Audit Gratuit</span>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </motion.a>
              <a 
                href="https://portofolio-mxxn.vercel.app" 
                target="_blank"
                className="text-white text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-3 group px-4 py-2"
              >
                Portfolio 2026
                <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* SCROLL INDICATOR */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-elite-gold to-transparent" />
          </motion.div>
        </section>

        {/* BENTO GRID ARGUMENTS */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: <Globe size={24} />, 
                  title: "Indépendance Totale", 
                  desc: "Ne dépendez plus des algorithmes capricieux. Soyez le seul maître de votre trafic et de vos données clients.",
                  largeIcon: <Globe size={80} />
                },
                { 
                  icon: <Zap size={24} />, 
                  title: "Ventes Automatisées", 
                  desc: "Transformez vos abonnés en clients sans passer 10h par jour à répondre manuellement aux DMs.",
                  largeIcon: <Zap size={80} />
                },
                { 
                  icon: <ShieldCheck size={24} />, 
                  title: "Autorité Maximale", 
                  desc: "Une plateforme premium décuple votre valeur perçue face à des concurrents qui n'ont qu'une page Facebook.",
                  largeIcon: <ShieldCheck size={80} />
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  {...fadeIn}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  whileHover={{ y: -10 }}
                  className="liquid-glass p-10 rounded-[2.5rem] border-white/5 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                    {item.largeIcon}
                  </div>
                  <div className="w-12 h-12 bg-elite-gold/10 rounded-2xl flex items-center justify-center mb-8 border border-elite-gold/20 group-hover:bg-elite-gold group-hover:text-black transition-colors duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-4">{item.title}</h3>
                  <p className="text-stone-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION TECH STACK (FULL-STACK PROOF) */}
        <section id="tech-stack" className="py-32 px-6 relative overflow-hidden border-y border-white/5 bg-elite-black/50">
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div {...fadeIn} className="text-center mb-20">
              <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight tracking-tight">Arsenal Technique.</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {/* FRONTEND PILLAR */}
              <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="liquid-glass p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                    <Layers size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">Interface Élite</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Next.js 15+", desc: "Performance & SEO natif" },
                    { name: "React 19", desc: "Composants réactifs" },
                    { name: "Tailwind 4", desc: "Design atomique" },
                    { name: "Framer Motion", desc: "Transitions fluides" }
                  ].map((tech, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-medium text-stone-200">{tech.name}</span>
                      <span className="text-[10px] text-stone-500 italic">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* BACKEND PILLAR */}
              <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="liquid-glass p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-elite-gold/10 rounded-full flex items-center justify-center text-elite-gold">
                    <Database size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">Moteur Robuste</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "PostgreSQL", desc: "Données structurées" },
                    { name: "Drizzle ORM", desc: "Type-safety absolue" },
                    { name: "Redis", desc: "Cache ultra-rapide" },
                    { name: "Docker", desc: "Déploiement scalable" }
                  ].map((tech, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-medium text-stone-200">{tech.name}</span>
                      <span className="text-[10px] text-stone-500 italic">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI & AUTOMATION PILLAR */}
              <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="liquid-glass p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-400">
                    <Cpu size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">Intelligence</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "OpenAI / Claude", desc: "Agents personnalisés" },
                    { name: "Automation IA", desc: "Prospection & Lead" },
                    { name: "Vector DB", desc: "Mémoire sémantique" },
                    { name: "API Native", desc: "Flux de données" }
                  ].map((tech, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-medium text-stone-200">{tech.name}</span>
                      <span className="text-[10px] text-stone-500 italic">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION GARANTIE PARALLAX */}
        <section className="py-40 bg-elite-stone relative overflow-hidden">
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" 
          />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div {...fadeIn}>
              <h2 className="text-5xl md:text-[5rem] font-display font-bold mb-16 tracking-tight">
                LA GARANTIE <span className="text-elite-gold">ABSORPTION</span>
              </h2>
              <div className="liquid-glass p-12 md:p-24 rounded-[4rem] border-elite-gold/20 relative group">
                <motion.div 
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 bg-elite-gold text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(202,138,4,0.3)]"
                >
                  Contrat d'Excellence
                </motion.div>
                <p className="text-3xl md:text-5xl font-display italic leading-[1.1] text-stone-100">
                  "Si mes systèmes ne génèrent pas une augmentation mesurable de votre cash-flow, <span className="gold-gradient">je refuse d'être payé</span>."
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION MÉTHODE STAGGERED */}
        <section id="methode" className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-24">
              <h2 className="text-4xl md:text-8xl font-display font-bold mb-6">MÉTHODE</h2>
              <p className="text-stone-500 uppercase tracking-[0.5em] text-xs font-bold">Extraction de Valeur en 3 Phases</p>
            </motion.div>

            <div className="space-y-6">
              {[
                { step: "01", title: "Audit Chirurgical", desc: "Identification des frictions qui tuent vos conversions." },
                { step: "02", title: "Refonte Élite", desc: "Reconstruction de votre interface pour le luxe et la vitesse." },
                { step: "03", title: "Déploiement Engine", desc: "Automatisation et scaling pour pérenniser les gains." }
              ].map((m, idx) => (
                <motion.div 
                  key={idx}
                  {...fadeIn}
                  transition={{ delay: idx * 0.2 }}
                  whileHover={{ x: 20, borderColor: "rgba(202, 138, 4, 0.4)" }}
                  className="group liquid-glass p-10 rounded-[2.5rem] border-white/5 flex items-center justify-between transition-all cursor-default"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <span className="text-6xl md:text-8xl font-display font-bold text-white/5 group-hover:text-elite-gold/20 transition-colors duration-700 leading-none">
                      {m.step}
                    </span>
                    <div>
                      <h4 className="text-2xl md:text-3xl font-display font-bold mb-2 group-hover:text-elite-gold transition-colors">{m.title}</h4>
                      <p className="text-stone-500 text-lg font-light max-w-xl">{m.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-stone-700 group-hover:text-elite-gold group-hover:translate-x-2 transition-all" size={32} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section id="audit" className="py-40 px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-elite-gold/30 to-transparent" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div {...fadeIn}>
              <h2 className="text-5xl md:text-9xl font-display font-bold mb-12 tracking-tighter">Prêt à <br />dominer ?</h2>
              <p className="text-stone-500 text-xl mb-16 font-light">Le coût de l'inaction est votre plus grande perte. <br />Récupérez votre dû maintenant.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <motion.a 
                  href={mailTo}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-elite-gold text-black px-16 py-8 rounded-full font-bold uppercase tracking-[0.2em] text-sm gold-border-glow shadow-[0_20px_50px_rgba(202,138,4,0.3)]"
                >
                  Réserver mon Audit
                </motion.a>
                <motion.a 
                  href={whatsappUrl}
                  target="_blank"
                  className="flex items-center gap-4 text-stone-400 uppercase tracking-widest text-xs font-bold hover:text-white transition-all group"
                >
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 group-hover:border-green-500/30 transition-all">
                    <MessageCircle size={24} className="text-green-500" />
                  </div>
                  Direct WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-elite-gold/5 rounded-full blur-[120px] -mb-48" />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-8 font-display font-bold tracking-[1em] text-elite-gold uppercase text-sm"
        >
          Abel Dotonou — 2026
        </motion.div>
        <div className="text-[9px] text-stone-600 uppercase tracking-[0.6em] font-bold">
          L'excellence est une habitude, pas un acte.
        </div>
      </footer>
    </div>
  );
}
