"use client";

import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
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

// SPOTLIGHT CARD COMPONENT (Cursor radial light overlay)
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(202, 138, 4, 0.15), transparent 80%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

// MAGNETIC BUTTON COMPONENT (Attracts button slightly to mouse)
function MagneticButton({ children, className = "", onClick, href, target }: { children: React.ReactNode, className?: string, onClick?: () => void, href?: string, target?: string }) {
  const btnRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 15 });
  const springY = useSpring(y, { stiffness: 100, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (href) {
    return (
      <motion.a
        ref={btnRef}
        href={href}
        target={target}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        className={className}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// --- INTERACTIVE ROI SIMULATOR COMPONENT ---
interface RoiSimulatorProps {
  onCtaClick: (presetMsg: string) => void;
}

function RoiSimulator({ onCtaClick }: RoiSimulatorProps) {
  const [traffic, setTraffic] = useState(5000);
  const [conversion, setConversion] = useState(1.2);
  const [basket, setBasket] = useState(30000);

  const currentRevenue = Math.round(traffic * (conversion / 100) * basket);
  const optimizedRevenue = Math.round(traffic * (3.5 / 100) * basket);
  const lostGain = optimizedRevenue - currentRevenue;

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace("XOF", "FCFA");
  };

  const handleAction = () => {
    const presetMsg = `Bonjour Abel, mon simulateur indique un manque à gagner de ${formatFCFA(lostGain)} par mois avec un trafic de ${traffic.toLocaleString("fr-FR")} visiteurs, un taux de conversion actuel de ${conversion}% et un panier moyen de ${formatFCFA(basket)}. Je veux récupérer ce manque à gagner !`;
    onCtaClick(presetMsg);
  };

  // Calculate percentage of current compared to optimized
  const currentPct = Math.max(15, Math.round((currentRevenue / optimizedRevenue) * 100));

  return (
    <div className="liquid-glass p-8 md:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden max-w-4xl mx-auto text-left">
      <div className="absolute top-0 right-0 w-64 h-64 bg-elite-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="grid md:grid-cols-2 gap-12 items-stretch">
        <div className="space-y-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-elite-gold bg-elite-gold/10 px-3 py-1 rounded-full">
              Simulateur de Conversion
            </span>
            <h3 className="text-3xl font-display font-bold mt-4 mb-2">
              Calculez votre manque à gagner
            </h3>
            <p className="text-stone-400 text-sm font-light leading-relaxed">
              Ajustez les curseurs ci-dessous pour voir l'impact immédiat d'une refonte Next.js (optimisée à un taux standard de 3.5%) sur vos revenus mensuels.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300">Trafic Mensuel (Visiteurs)</span>
                <span className="text-white font-mono">{traffic.toLocaleString("fr-FR")} / mois</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-elite-gold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300">Taux de Conversion Actuel</span>
                <span className="text-white font-mono">{conversion}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={conversion}
                onChange={(e) => setConversion(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-elite-gold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-300">Panier Moyen (FCFA)</span>
                <span className="text-white font-mono">{basket.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={basket}
                onChange={(e) => setBasket(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-elite-gold"
              />
            </div>
          </div>
        </div>

        <div className="bg-elite-black/60 border border-white/10 rounded-3xl p-8 space-y-8 flex flex-col justify-between h-full relative shadow-inner">
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-300 pb-2 border-b border-white/5">Visualisation des Pertes</h4>
            
            {/* COMPARATIVE BARS */}
            <div className="space-y-4">
              {/* CURRENT REVENUE BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-stone-400">
                  <span>Revenus Actuels ({conversion}%)</span>
                  <span>{formatFCFA(currentRevenue)}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentPct}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="bg-rose-500/50 h-full rounded-full border border-rose-500/30"
                  />
                </div>
              </div>

              {/* OPTIMIZED REVENUE BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-green-400">
                  <span>Revenus Optimisés (3.5%)</span>
                  <span>{formatFCFA(optimizedRevenue)}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] border border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* LOST GAIN BLOCK */}
            <div className="pt-4 p-5 bg-rose-950/20 border border-rose-500/20 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold block">
                Manque à gagner (par mois) :
              </span>
              <div className="text-3xl font-display font-bold text-rose-500 font-mono drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                - {formatFCFA(lostGain)}
              </div>
              <p className="text-[9px] text-stone-400 italic font-light pt-1">
                Soit un manque à gagner annuel estimé à {formatFCFA(lostGain * 12)}.
              </p>
            </div>
          </div>

          <button
            onClick={handleAction}
            className="w-full bg-elite-gold hover:bg-elite-gold-light text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-elite-gold/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            Récupérer ce manque à gagner
          </button>
        </div>
      </div>
    </div>
  );
}

// --- INTERACTIVE PROTOTYPE SANDBOX COMPONENT ---
function PrototypeSandbox() {
  const [formData, setFormData] = useState({ name: "", guests: 2, time: "20:00" });
  const [stage, setStage] = useState<"form" | "sent" | "reception">("form");

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("sent");
    setTimeout(() => {
      setStage("reception");
    }, 2000);
  };

  const resetSandbox = () => {
    setFormData({ name: "", guests: 2, time: "20:00" });
    setStage("form");
  };

  return (
    <div className="liquid-glass p-8 md:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden max-w-4xl mx-auto text-left">
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="grid md:grid-cols-2 gap-12 items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              Démonstration Interactive
            </span>
            <h3 className="text-3xl font-display font-bold mt-4 mb-2">
              Testez le moteur de réservation
            </h3>
            <p className="text-stone-400 text-sm font-light leading-relaxed mb-6">
              Voici une simulation en temps réel du flux conçu pour l'<strong>Hôtel Maison Rouge</strong>. Remplissez le formulaire mobile de droite pour voir l'automatisation s'exécuter instantanément.
            </p>
          </div>

          {/* VISUAL FLOW DIAGRAM */}
          <div className="space-y-4 bg-elite-black/20 p-6 rounded-2xl border border-white/5 my-6">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-2">Flux Technique Exécuté</span>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold font-mono text-stone-300">1</div>
              <p className="text-[11px] text-stone-300 font-light">Client valide sa table en <strong className="text-white">Next.js</strong> (vitesse instantanée).</p>
            </div>
            <div className="w-[1px] h-3 bg-stone-700 ml-3" />
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold font-mono text-blue-400">2</div>
              <p className="text-[11px] text-stone-300 font-light">Alerte immédiate envoyée à la réception via <strong className="text-blue-400">Telegram API</strong>.</p>
            </div>
            <div className="w-[1px] h-3 bg-stone-700 ml-3" />
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-xs font-bold font-mono text-emerald-400">3</div>
              <p className="text-[11px] text-stone-300 font-light">Confirmation et ticket client envoyés par <strong className="text-emerald-400">WhatsApp API</strong>.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✔</span>
              <span>Aucune perte de temps pour vos serveurs.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✔</span>
              <span>100% de marges gardées chez vous.</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0C0A09]/60 border border-white/10 rounded-3xl p-6 relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl">
          {stage === "form" && (
            <form onSubmit={handleSimulateSubmit} className="space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="text-center pb-3 border-b border-white/5 mb-4">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                    Interface Client (Maison Rouge)
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-elite-gold transition-colors text-white"
                      placeholder="Ex: Christian L."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                        Couverts
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                        className="w-full bg-stone-900 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-elite-gold text-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num > 1 ? "personnes" : "personne"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                        Heure
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-elite-gold text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-elite-gold hover:bg-elite-gold-light text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer mt-6 shadow-lg shadow-elite-gold/15"
              >
                Réserver ma table
              </button>
            </form>
          )}

          {stage === "sent" && (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-white">Routage de l'automatisation...</h4>
                <p className="text-stone-500 text-[10px] mt-1">
                  Envoi des notifications simultanées à la réception et au client
                </p>
              </div>
            </div>
          )}

          {stage === "reception" && (
            <div className="flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-4 flex-grow">
                <div className="text-center pb-2 border-b border-white/5 mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block animate-pulse">
                    🟢 DÉPLOIEMENT ACTIVÉ (TEMPS RÉEL)
                  </span>
                </div>

                {/* Simulated Telegram Notification (Reception Alert) */}
                <div className="p-3.5 bg-slate-900 border border-blue-500/30 rounded-2xl space-y-2 text-left animate-slide-in shadow-lg">
                  <div className="flex justify-between items-center text-[9px] font-bold text-blue-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white font-mono">T</span>
                      <span>TELEGRAM RÉCEPTION (MAISON ROUGE)</span>
                    </div>
                    <span className="font-mono text-stone-500">10:30</span>
                  </div>
                  <div className="text-xs text-stone-200 leading-relaxed font-mono">
                    🚨 <strong>NOUVELLE DEMANDE :</strong>
                    <div className="pl-3 mt-1 border-l border-blue-500/20 text-stone-300">
                      • Client: {formData.name} <br />
                      • Couverts: {formData.guests} <br />
                      • Heure: {formData.time}
                    </div>
                  </div>
                </div>

                {/* Simulated WhatsApp Chat Bubble (Client Ticket) */}
                <div className="p-4 bg-[#005c4b] border border-emerald-500/30 rounded-2xl space-y-1.5 text-left animate-slide-in-delay shadow-lg max-w-[85%] ml-auto relative">
                  {/* Speech Bubble Tail */}
                  <div className="absolute top-0 right-0 -mr-1.5 w-3 h-3 bg-[#005c4b] rotate-45 border-r border-t border-emerald-500/30" />
                  
                  <div className="flex justify-between items-center text-[8px] text-emerald-300 font-bold">
                    <span>Maison Rouge Cotonou (Officiel)</span>
                    <span className="text-[7px] font-normal text-emerald-400">✓✓</span>
                  </div>
                  <p className="text-[11px] text-white leading-relaxed">
                    Bonjour {formData.name}, votre réservation pour {formData.guests} personnes ce soir à{" "}
                    {formData.time} à l'Hôtel Maison Rouge est bien enregistrée. À tout à l'heure ! 🍷
                  </p>
                  <div className="text-right text-[7px] text-emerald-400/80 font-mono">
                    10:30
                  </div>
                </div>
              </div>

              <button
                onClick={resetSandbox}
                className="w-full border border-white/10 hover:border-white/20 text-stone-400 hover:text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:bg-white/[0.02]"
              >
                Réessayer la simulation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- FAQ ACCORDION COMPONENT ---
function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "Pourquoi Next.js plutôt que WordPress ou Shopify ?",
      a: "WordPress est lourd, nécessite des mises à jour constantes pour éviter les piratages et met souvent 3 à 5 secondes à charger sur mobile au Bénin. J'utilise Next.js (la technologie de pointe de Netflix et TikTok). Votre site se charge en moins d'une seconde, ce qui empêche vos clients de quitter la page par impatience. De plus, il est nativement sécurisé et offre un référencement local optimal.",
    },
    {
      q: "Y a-t-il des frais récurrents ou des abonnements ?",
      a: "Non, il n'y a pas d'abonnement coûteux. L'hébergement de votre site sur Vercel est gratuit. Les seuls frais minimes à prévoir concernent les envois de SMS/WhatsApp de confirmation via les passerelles d'API (environ 5 à 10 FCFA par message envoyé). Le système est conçu pour être le plus économique possible.",
    },
    {
      q: "Quelle est la garantie de livraison et de résultats ?",
      a: "Pour prouver mon sérieux, je propose la phase 1 (le Prototype) entièrement gratuitement. Je conçois la maquette visuelle complète de votre nouveau flux de réservation. Vous ne payez les 250 000 FCFA que lorsque vous validez le prototype et que nous passons à la phase d'intégration technique et d'automatisation.",
    },
    {
      q: "Comment fonctionne l'automatisation concrètement pour mon équipe ?",
      a: "C'est 100% transparent. Le client réserve en 3 clics sur mobile. Il reçoit une confirmation WhatsApp automatique. Votre équipe reçoit une notification immédiate sur son téléphone (via Telegram ou WhatsApp interne) avec les détails, et la réservation s'ajoute automatiquement à un tableau de suivi partagé. Zéro action manuelle requise.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4 text-left">
      {faqs.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className="liquid-glass rounded-2xl border-white/5 overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <h4 className="font-display font-semibold text-lg md:text-xl text-white">
                {faq.q}
              </h4>
              <span
                className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-stone-400 font-bold transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                ＋
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 text-stone-400 text-sm font-light leading-relaxed border-t border-white/5">
                {faq.a}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 25, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 192); // 192 is half of w-96 (192px)
      mouseY.set(e.clientY - 192);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const mailTo =
    "mailto:dotonouabel@gmail.com?subject=Demande d'Audit Conversion - Vitrine d'Élite&body=Bonjour Abel, je souhaite doubler mes conversions...";
  const whatsappUrl =
    "https://wa.me/2290167750083?text=Bonjour%20Abel,%20je%20souhaite%20en%20savoir%20plus%20sur%20tes%20machines%20à%20cash.";

  // MODAL & FORM STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", site: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openModalWithPresetMessage = (presetMsg: string) => {
    setFormData((prev) => ({ ...prev, message: presetMsg }));
    setIsModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const messageText = `Bonjour Abel, je suis ${formData.name}. Je souhaite obtenir un audit de conversion pour mon site : ${
      formData.site || "Non spécifié"
    }.\n\nMessage : ${formData.message || "Bonjour, je souhaite doubler mes conversions."}`;
    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/2290167750083?text=${encodedText}`;

    setTimeout(() => {
      window.open(waUrl, "_blank");
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: "", email: "", site: "", message: "" });
    }, 1500);
  };


  return (
    <div className="min-h-screen selection:bg-elite-gold selection:text-black relative bg-elite-black text-white overflow-x-hidden">
      <div className="noise-overlay" />
      
      {/* BARRE DE PROGRESSION */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-elite-gold z-[100] origin-left" style={{ scaleX }} />

      {/* CURSEUR LUMINEUX (FOLLOW MOUSE) - GPU ACCELERATED */}
      <motion.div 
        className="fixed top-0 left-0 w-96 h-96 bg-elite-gold/10 rounded-full blur-[100px] pointer-events-none z-0 hidden lg:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
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
          
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#calculateur" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium hover:text-elite-gold transition-colors">Calculateur</a>
            <a href="#demo" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium hover:text-elite-gold transition-colors">Démo</a>
            <a href="#faq" className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium hover:text-elite-gold transition-colors">FAQ</a>
            <MagneticButton 
              onClick={() => setIsModalOpen(true)} 
              className="bg-elite-gold text-black text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all cursor-pointer shadow-md shadow-elite-gold/10"
            >
              Audit Flash
            </MagneticButton>
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
                className="text-4xl md:text-[clamp(2.5rem,7vw,7.5rem)] font-display font-medium leading-[0.9] md:leading-[0.85] tracking-tighter"
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
              <MagneticButton 
                onClick={() => setIsModalOpen(true)} 
                className="group relative bg-elite-gold text-black px-12 py-6 rounded-full font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:pr-16 text-center w-full sm:w-auto cursor-pointer shadow-lg shadow-elite-gold/15"
              >
                <span className="relative z-10">Lancer l'Audit Gratuit</span>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </MagneticButton>
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

        {/* ROI SIMULATOR SECTION */}
        <section className="py-16 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center">
            <RoiSimulator onCtaClick={openModalWithPresetMessage} />
          </div>
        </section>

        {/* SECTION RÉALISATIONS (SHOWCASE PROJETS) */}
        <section id="realisations" className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div {...fadeIn} className="mb-20">
              <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight tracking-tight">Systèmes Déployés.</h2>
              <p className="text-stone-500 uppercase tracking-[0.5em] text-xs font-bold mt-4">Preuves réelles d'ingénierie transactionnelle</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 text-left">
              {/* CARD 1: SAFE-DEAL BÉNIN */}
              <motion.div 
                {...fadeIn}
                whileHover={{ y: -10 }}
                className="liquid-glass rounded-[2.5rem] border-white/5 overflow-hidden flex flex-col group"
              >
                {/* Visual Header / Mockup */}
                <div className="relative aspect-video bg-gradient-to-br from-elite-black to-stone-900 border-b border-white/5 flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-elite-gold/5 group-hover:bg-elite-gold/10 transition-colors duration-500" />
                  
                  {/* Smartphone Mockup */}
                  <div className="relative w-48 h-64 bg-stone-950 border-[4px] border-stone-850 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col transition-transform duration-500 group-hover:scale-105">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-stone-850 rounded-b-xl z-20" />
                    
                    {/* Screen Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between pt-6 text-left relative z-10 bg-[#0A0A0A]">
                      {/* Top Header */}
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[8px] font-bold tracking-widest uppercase text-elite-gold">Safe-Deal</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      
                      {/* Escrow Widget */}
                      <div className="my-auto space-y-3">
                        <div className="space-y-1">
                          <p className="text-[6px] text-stone-500 uppercase">Montant Garanti</p>
                          <p className="text-sm font-bold text-white">150 000 FCFA</p>
                        </div>
                        <div className="p-2 bg-stone-900/50 rounded-lg border border-elite-gold/20 space-y-1">
                          <div className="flex justify-between text-[6px]">
                            <span className="text-stone-400">Acheteur:</span>
                            <span className="text-white font-medium">Cotonou VIP</span>
                          </div>
                          <div className="flex justify-between text-[6px]">
                            <span className="text-stone-400">Statut:</span>
                            <span className="text-elite-gold font-bold">Fonds Séquestrés 🔒</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* MoMo logo/button */}
                      <div className="w-full bg-elite-gold text-black rounded-lg py-1.5 text-center text-[7px] font-bold">
                        Paiement MTN MoMo Validé
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-elite-gold bg-elite-gold/10 px-3 py-1 rounded-full">Fintech & Escrow</span>
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-3 group-hover:text-elite-gold transition-colors">Safe-Deal Bénin</h3>
                    <p className="text-stone-400 font-light leading-relaxed text-sm mb-6">
                      Système de séquestre (tiers de confiance) sécurisant les transactions entre particuliers. Intègre les API Mobile Money locales (MTN, Moov) via FedaPay pour lever le frein de la confiance en Afrique de l'Ouest.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {["Next.js 15", "Drizzle ORM", "FedaPay API", "PostgreSQL"].map((tag, i) => (
                      <span key={i} className="px-3 py-1 text-[10px] bg-white/5 border border-white/10 rounded-md text-stone-300">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* CARD 2: FADJI */}
              <motion.div 
                {...fadeIn}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -10 }}
                className="liquid-glass rounded-[2.5rem] border-white/5 overflow-hidden flex flex-col group"
              >
                {/* Visual Header / Mockup */}
                <div className="relative aspect-video bg-gradient-to-br from-elite-black to-stone-900 border-b border-white/5 flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />
                  
                  {/* Web App Dashboard Mockup */}
                  <div className="relative w-64 h-40 bg-stone-950 border-[3px] border-stone-850 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-500 group-hover:scale-105">
                    {/* Browser Header */}
                    <div className="h-4 bg-stone-900 flex items-center gap-1.5 px-2 border-b border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    
                    {/* Dashboard Screen */}
                    <div className="flex-1 p-3 flex flex-col justify-between text-left bg-[#0A0A0A]">
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] font-bold text-stone-300">FADJI — Tontine 2.0</span>
                        <span className="text-[6px] text-stone-500">Membres: 12/15</span>
                      </div>
                      
                      {/* Chart placeholder */}
                      <div className="h-12 flex items-end gap-1.5 border-b border-white/5 pb-1 justify-center">
                        <div className="w-3 h-4 bg-stone-800 rounded-t" />
                        <div className="w-3 h-6 bg-stone-800 rounded-t" />
                        <div className="w-3 h-8 bg-stone-800 rounded-t" />
                        <div className="w-3 h-10 bg-elite-gold rounded-t shadow-[0_0_10px_rgba(202,138,4,0.3)]" />
                      </div>
                      
                      {/* Stats */}
                      <div className="flex justify-between text-[6px]">
                        <span className="text-stone-400">Pot Total: 3 600 000 FCFA</span>
                        <span className="text-green-400">Prochain tirage: 20 Juin</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-elite-gold bg-elite-gold/10 px-3 py-1 rounded-full">Tontine Digitale</span>
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-3 group-hover:text-elite-gold transition-colors">FADJI</h3>
                    <p className="text-stone-400 font-light leading-relaxed text-sm mb-6">
                      Digitalisation de l'épargne solidaire traditionnelle (tontine) pour les communautés d'affaires. Automatise la collecte des cotisations, les tirages au sort équitables et la redistribution instantanée.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {["Django", "Python", "PostgreSQL", "Tailwind CSS"].map((tag, i) => (
                      <span key={i} className="px-3 py-1 text-[10px] bg-white/5 border border-white/10 rounded-md text-stone-300">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROTOTYPE SANDBOX SECTION */}
        <section id="demo" className="py-16 px-6 relative overflow-hidden bg-elite-stone/20">
          <div className="max-w-6xl mx-auto text-center">
            <PrototypeSandbox />
          </div>
        </section>

        {/* SECTION TECH STACK (BUSINESS-VALUE FOCUS) */}
        <section id="tech-stack" className="py-32 px-6 relative overflow-hidden border-y border-white/5 bg-elite-black/50">
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div {...fadeIn} className="text-center mb-20">
              <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight tracking-tight">Performance & Intégrations.</h2>
              <p className="text-stone-500 uppercase tracking-[0.5em] text-xs font-bold mt-4">Des solutions sur-mesure au service de votre rentabilité</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {/* FRONTEND PILLAR */}
              <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="liquid-glass p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                    <Layers size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white">Interface Mobile Premium</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Vitesse Next.js", desc: "Chargement en < 0.8s" },
                    { name: "Fluidité tactile mobile", desc: "Optimisé pour smartphones" },
                    { name: "Code haut de gamme", desc: "Sécurité totale anti-piratage" },
                    { name: "Esthétique épurée", desc: "Image de marque valorisée" }
                  ].map((tech, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-medium text-stone-200">{tech.name}</span>
                      <span className="text-[10px] text-stone-500 italic">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* TRANSACTIONS PILLAR */}
              <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="liquid-glass p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-elite-gold/10 rounded-full flex items-center justify-center text-elite-gold">
                    <Database size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white">Paiements & Flux</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Intégrations locales", desc: "Paiements MTN MoMo & Moov Flooz" },
                    { name: "Sécurisation bancaire", desc: "Cartes VISA / Mastercard" },
                    { name: "Marges préservées", desc: "Zéro commission intermédiaire" },
                    { name: "Fichier client", desc: "Vous possédez vos données" }
                  ].map((tech, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-medium text-stone-200">{tech.name}</span>
                      <span className="text-[10px] text-stone-500 italic">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AUTOMATION PILLAR */}
              <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="liquid-glass p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-400">
                    <Cpu size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white">Automatisations</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Alertes instantanées", desc: "Notifications WhatsApp / SMS" },
                    { name: "Suivi équipe", desc: "Canal Telegram de réception" },
                    { name: "Centralisation", desc: "Tableaux de bord partagés" },
                    { name: "Maintenance incluse", desc: "Zéro frais d'hébergement" }
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

        {/* FAQ SECTION */}
        <section id="faq" className="py-32 px-6 border-t border-white/5 bg-elite-stone/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeIn} className="mb-20">
              <h2 className="text-4xl md:text-8xl font-display font-bold mb-6">FAQ</h2>
              <p className="text-stone-500 uppercase tracking-[0.5em] text-xs font-bold">Réponses à vos questions stratégiques</p>
            </motion.div>
            <FaqAccordion />
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
                <MagneticButton 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-elite-gold text-black px-16 py-8 rounded-full font-bold uppercase tracking-[0.2em] text-sm gold-border-glow shadow-[0_20px_50px_rgba(202,138,4,0.3)] cursor-pointer"
                >
                  Réserver mon Audit
                </MagneticButton>
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

      {/* MODAL AUDIT INTERACTIF (CRO SYSTEM) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="relative w-full max-w-lg bg-stone-900 border border-elite-gold/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl z-10 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-elite-gold/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="text-3xl font-display font-bold mb-2 text-center">Demande d'Audit</h3>
            <p className="text-stone-400 text-xs font-light mb-8 uppercase tracking-widest text-center">
              Analyse chirurgicale gratuite sous 48h
            </p>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-elite-gold/20 border border-elite-gold rounded-full flex items-center justify-center mx-auto text-elite-gold animate-bounce">
                  <Zap size={28} />
                </div>
                <h4 className="text-xl font-bold text-white">Demande enregistrée !</h4>
                <p className="text-stone-400 text-xs leading-relaxed max-w-xs mx-auto">
                  Redirection automatique vers WhatsApp pour valider la prise de contact en direct...
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Nom / Entreprise</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-elite-gold transition-colors text-white"
                    placeholder="Ex: Restaurant Le Cordon"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Votre Site Web / Instagram</label>
                  <input 
                    type="url" 
                    name="site" 
                    value={formData.site}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-elite-gold transition-colors text-white"
                    placeholder="Ex: https://monrestaurant.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">Votre Friction ou Problématique</label>
                  <textarea 
                    name="message" 
                    rows={3}
                    value={formData.message}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-elite-gold transition-colors text-white resize-none"
                    placeholder="Ex: Le widget de réservation bug sur mobile, ou je n'ai pas de paiement direct."
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-elite-gold text-black rounded-full py-4 text-xs font-bold uppercase tracking-widest hover:bg-elite-gold-light transition-colors shadow-lg shadow-elite-gold/20 cursor-pointer"
                >
                  Analyser mes conversions
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
