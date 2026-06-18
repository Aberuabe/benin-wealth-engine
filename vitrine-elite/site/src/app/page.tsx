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
  ExternalLink,
  Bed,
  Utensils,
  Calendar,
  Users,
  Clock,
  CreditCard,
  ArrowLeft,
  Check,
  CheckCircle2,
  ListChecks,
  TrendingUp,
  Sparkles
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

// --- INTERACTIVE PROTOTYPE SANDBOX ---
function PrototypeSandbox() {
  const [bookingType, setBookingType] = useState<"room" | "table">("room");
  const [bookingStep, setBookingStep] = useState<"dates" | "rooms" | "extras" | "checkout">("dates");
  const [formData, setFormData] = useState({
    name: "",
    // Common fields
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 2,
    time: "20:00",
    
    // Room fields
    roomType: "suite", // "executive" | "suite" | "royale"
    ratePlan: "refundable", // "refundable" | "non_refundable"
    
    // Table fields
    tableLocation: "terrasse", // "terrasse" | "climatisee" | "vip"
    tableDate: new Date().toISOString().split("T")[0],
    
    // Add-on Options (Upsells)
    shuttle: false,     // +10 000 FCFA
    breakfast: false,   // +7 500 FCFA/day/person
    spa: false,         // +25 000 FCFA
    champagne: false    // +40 000 FCFA
  });
  const [requireDeposit, setRequireDeposit] = useState(true);
  const [momoNumber, setMomoNumber] = useState("0167750083");
  const [momoOperator, setMomoOperator] = useState<"mtn" | "moov">("mtn");
  const [stage, setStage] = useState<"form" | "payment" | "paying" | "sent" | "reception">("form");
  const [successView, setSuccessView] = useState<"client" | "pms">("client");
  const [preRegisterStage, setPreRegisterStage] = useState<"none" | "start" | "camera" | "scanning" | "done">("none");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Manage webcam stream lifecycle
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (preRegisterStage === "camera") {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          activeStream = stream;
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera access failed, falling back to simulated scanning:", err);
          setPreRegisterStage("scanning");
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [preRegisterStage]);

  // Handle reception and FedaPay webhooks / log system
  useEffect(() => {
    if (stage === "reception") {
      const initialLogs = [
        `SYSTEM: Nouvelle réservation reçue pour ${formData.name || "Client VIP"}`,
        `GATEWAY: Paiement acompte de ${formatFCFA(depositRequired)} via ${momoOperator.toUpperCase()} MoMo validé`,
        `WEBHOOK: FedaPay transaction TX-${Math.floor(Math.random() * 90000 + 10000)} approuvée`,
        `NOTIFY: Message WhatsApp de confirmation délivré à ${formData.name || "Client VIP"} (+229 ${momoNumber})`,
        `PMS: Allocation de la chambre pour Suite 201 effectuée`
      ];
      setLogs([]);
      initialLogs.forEach((l, idx) => {
        setTimeout(() => {
          const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
          setLogs(prev => [...prev, `[${time}] ${l}`]);
        }, idx * 400);
      });
    }
  }, [stage]);

  // Handle client pre-registration logs
  useEffect(() => {
    if (preRegisterStage === "done") {
      const checkinLogs = [
        `CLIENT: Accès au portail check-in express via lien WhatsApp`,
        `OCR: Capture et lecture du document d'identité effectuée`,
        `IA: Extraction réussie. Nom: ${formData.name || "Client VIP"}, nationalité validée`,
        `PMS: Pré-enregistrement complété. Statut Chambre 201: PRÊTE (Clé numérique générée)`
      ];
      checkinLogs.forEach((l, idx) => {
        setTimeout(() => {
          const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
          setLogs(prev => [...prev, `[${time}] ${l}`]);
        }, idx * 400);
      });
    }
  }, [preRegisterStage]);

  // Format helper
  const formatFCFA = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
  };

  const getStayNights = () => {
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end.getTime() - start.getTime();
    if (isNaN(diffTime) || diffTime <= 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const nights = getStayNights();

  const getRoomPricePerNight = () => {
    let base = 25000; // Chambre Executive
    if (formData.roomType === "suite") base = 45000; // Suite Executive
    if (formData.roomType === "royale") base = 75000; // Suite Royale
    if (formData.ratePlan === "non_refundable") base = base * 0.9; // 10% discount
    return Math.round(base);
  };

  const roomPricePerNight = getRoomPricePerNight();
  const roomSubtotal = roomPricePerNight * nights;

  // Add-on Cost Calculations
  const shuttleCost = formData.shuttle ? 10000 : 0;
  const breakfastCost = formData.breakfast ? 7500 * nights * formData.guests : 0;
  const spaCost = formData.spa ? 25000 : 0;
  const champagneCost = formData.champagne ? 40000 : 0;
  const extrasSubtotal = shuttleCost + breakfastCost + spaCost + champagneCost;

  // Hotel booking taxes
  const touristTax = bookingType === "room" ? 1000 * nights * formData.guests : 0; // 1000 FCFA per person per night
  const taxBase = roomSubtotal + extrasSubtotal;
  const vatAmount = Math.round(taxBase * 0.18); // TVA 18%
  const grandTotal = taxBase + touristTax + vatAmount;

  // Guaranteed Booking Deposit
  // Room: 1 night base + VAT & extras or just flat 1 night
  const roomDeposit = Math.round(roomPricePerNight * 1.18) + (formData.champagne ? 40000 : 0);

  // Table Booking
  const tableDeposit = formData.tableLocation === "vip" ? 10000 : (requireDeposit ? 5000 : 0);

  const getDepositRequired = () => {
    return bookingType === "room" ? roomDeposit : tableDeposit;
  };

  const depositRequired = getDepositRequired();

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingStep !== "checkout") {
      // Step progression
      if (bookingStep === "dates") setBookingStep("rooms");
      else if (bookingStep === "rooms") setBookingStep("extras");
      else if (bookingStep === "extras") setBookingStep("checkout");
    } else {
      const needsPay = bookingType === "room" || depositRequired > 0;
      if (needsPay) {
        setStage("payment");
      } else {
        triggerProcessing();
      }
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("paying");
    setTimeout(() => {
      triggerProcessing();
    }, 2500); // Simulate MOMO push approval delay
  };

  const triggerProcessing = () => {
    setStage("sent");
    setTimeout(() => {
      setStage("reception");
    }, 2000);
  };

  const resetSandbox = () => {
    setFormData({
      name: "",
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      guests: 2,
      time: "20:00",
      roomType: "suite",
      ratePlan: "refundable",
      tableLocation: "terrasse",
      tableDate: new Date().toISOString().split("T")[0],
      shuttle: false,
      breakfast: false,
      spa: false,
      champagne: false
    });
    setRequireDeposit(true);
    setMomoNumber("0167750083");
    setBookingStep("dates");
    setStage("form");
    setSuccessView("client");
    setPreRegisterStage("none");
  };

  return (
    <div className="liquid-glass p-8 md:p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden max-w-4xl mx-auto text-left">
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="grid md:grid-cols-2 gap-12 items-stretch">
        
        {/* LEFT PANEL - SALES PROPOSITION */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              Simulateur de Systèmes Hôteliers PMS
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-2">
              Le standard des hôtels 5 étoiles
            </h3>
            <p className="text-stone-400 text-sm font-light leading-relaxed mb-6">
              Démontrez la puissance d'un moteur de vente directe moderne face aux décideurs de la <strong>Maison Rouge</strong>. Ce simulateur montre comment nous gérons la réservation, l'encaissement et le suivi opérationnel.
            </p>
          </div>

          {/* VISUAL FLOW DIAGRAM */}
          <div className="space-y-4 bg-elite-black/20 p-6 rounded-2xl border border-white/5 my-6">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-2">Cycle Opérationnel Simulé</span>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold font-mono text-stone-300">1</div>
              <p className="text-[11px] text-stone-300 font-light">
                Réservation directe avec options : <strong className="text-white">Navette aéroport, Spa, Petit-déjeuner</strong>.
              </p>
            </div>
            <div className="w-[1px] h-3 bg-stone-700 ml-3" />
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-xs font-bold font-mono text-amber-400">2</div>
              <p className="text-[11px] text-stone-300 font-light">Calcul automatique des <strong className="text-amber-400">Taxes de Séjour & TVA locale</strong> de 18%.</p>
            </div>
            <div className="w-[1px] h-3 bg-stone-700 ml-3" />
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold font-mono text-blue-400">3</div>
              <p className="text-[11px] text-stone-300 font-light">Vérification de l'acompte de garantie requis sur le <strong className="text-blue-400">PMS de la Réception</strong>.</p>
            </div>
            <div className="w-[1px] h-3 bg-stone-700 ml-3" />
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-xs font-bold font-mono text-emerald-400">4</div>
              <p className="text-[11px] text-stone-300 font-light">Flux de <strong className="text-emerald-400">Pré-enregistrement avec Passeport</strong> envoyé par WhatsApp.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✔</span>
              <span>Augmente le panier moyen client de +25% via le surclassement de services (upsell).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">✔</span>
              <span>Supprime le temps d'attente à la réception à l'arrivée (Check-in en 30s).</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - PHONE CONTAINER */}
        <div className="bg-[#0C0A09]/80 border border-white/10 rounded-3xl relative min-h-[460px] flex flex-col justify-between overflow-hidden shadow-2xl">
          
          {/* iOS-Style Top Status Bar */}
          <div className="flex justify-between items-center px-5 py-2 bg-black/40 text-[9px] text-stone-400 font-mono border-b border-white/5 select-none">
            <span>13:47</span>
            <div className="flex items-center gap-1.5">
              <span>LTE</span>
              <span className="w-4.5 h-2.5 border border-stone-500 rounded-sm p-[1px] flex items-center">
                <span className="bg-emerald-400 h-full w-[80%] rounded-[1px]" />
              </span>
            </div>
          </div>

          {/* MAIN SIMULATOR AREA */}
          <div className="p-5 flex-grow flex flex-col justify-between">
            {stage === "form" && (
              <form onSubmit={handleSimulateSubmit} className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  {/* Step header indicator */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <div className="flex items-center gap-2">
                      {bookingStep !== "dates" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (bookingStep === "rooms") setBookingStep("dates");
                            else if (bookingStep === "extras") setBookingStep("rooms");
                            else if (bookingStep === "checkout") setBookingStep("extras");
                          }}
                          className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <ArrowLeft size={14} />
                        </button>
                      )}
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                        {bookingType === "room" ? "Hébergement" : "Restaurant"} (Maison Rouge)
                      </span>
                    </div>
                    
                    {/* Progression dots */}
                    <div className="flex gap-1.5">
                      {["dates", "rooms", "extras", "checkout"].map((s, idx) => {
                        const steps = ["dates", "rooms", "extras", "checkout"];
                        const currentIdx = steps.indexOf(bookingStep);
                        return (
                          <div 
                            key={s} 
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentIdx ? "bg-elite-gold scale-125" : idx < currentIdx ? "bg-emerald-500" : "bg-white/10"
                            }`} 
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 1: DATES & TYPE */}
                  {bookingStep === "dates" && (
                    <div className="space-y-3 animate-fade-in">
                      {/* TYPE DE RESERVATION SELECTOR */}
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-4">
                        <button
                          type="button"
                          onClick={() => setBookingType("room")}
                          className={`flex-grow flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            bookingType === "room" ? "bg-elite-gold text-black font-semibold" : "text-stone-400 hover:text-white"
                          }`}
                        >
                          <Bed size={13} />
                          Hébergement
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingType("table")}
                          className={`flex-grow flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            bookingType === "table" ? "bg-elite-gold text-black font-semibold" : "text-stone-400 hover:text-white"
                          }`}
                        >
                          <Utensils size={13} />
                          Restaurant
                        </button>
                      </div>

                      {/* NOM COMPLET */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                          Nom Complet du Client
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-elite-gold transition-colors text-white"
                          placeholder="Ex: M. Jean Dupont"
                        />
                      </div>

                      {/* DATE PICKERS */}
                      {bookingType === "room" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                              Arrivée
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                required
                                value={formData.checkIn}
                                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-elite-gold text-white font-mono"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                              Départ
                            </label>
                            <input
                              type="date"
                              required
                              value={formData.checkOut}
                              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-elite-gold text-white font-mono"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                              Date de visite
                            </label>
                            <input
                              type="date"
                              required
                              value={formData.tableDate}
                              onChange={(e) => setFormData({ ...formData, tableDate: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-elite-gold text-white font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                              Heure
                            </label>
                            <input
                              type="time"
                              required
                              value={formData.time}
                              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-elite-gold text-white font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* GUESTS SELECTOR */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                          Nombre de voyageurs / couverts
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                          className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-elite-gold text-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                              {num} {num > 1 ? "Personnes" : "Personne"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: ROOM SELECTION / TABLE SELECTION */}
                  {bookingStep === "rooms" && (
                    <div className="space-y-3 animate-fade-in">
                      {bookingType === "room" ? (
                        <>
                          <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold mb-1">
                            Sélectionnez votre Hébergement
                          </label>
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {[
                              { id: "executive", name: "Chambre Executive Cosy", price: 25000, desc: "28m², vue jardin arboré, lit Queen Size", icon: "🛌" },
                              { id: "suite", name: "Suite Executive Vue Mer", price: 45000, desc: "45m², terrasse privée face mer, salon", icon: "🌊" },
                              { id: "royale", name: "Suite Royale Maison Rouge", price: 75000, desc: "85m², jacuzzi privatif, salon d'affaires", icon: "👑" }
                            ].map((r) => {
                              const isSelected = formData.roomType === r.id;
                              return (
                                <button
                                  type="button"
                                  key={r.id}
                                  onClick={() => setFormData({ ...formData, roomType: r.id })}
                                  className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                    isSelected 
                                      ? "border-elite-gold bg-elite-gold/5 shadow-[0_0_12px_rgba(202,138,4,0.08)]"
                                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <div className="flex gap-2.5 items-center">
                                    <span className="text-xl">{r.icon}</span>
                                    <div>
                                      <span className={`text-[10px] font-bold block ${isSelected ? "text-elite-gold" : "text-white"}`}>
                                        {r.name}
                                      </span>
                                      <span className="text-[8px] text-stone-400 block font-light leading-none mt-0.5">{r.desc}</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-elite-gold font-mono ml-2">
                                    {r.price / 1000}k F/nuit
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* RATE PLANS - PROFESSIONAL SYSTEM */}
                          <div className="space-y-2 mt-2">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                              Tarification
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ratePlan: "refundable" })}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  formData.ratePlan === "refundable"
                                    ? "border-white/20 bg-white/5"
                                    : "border-white/5 bg-transparent opacity-65 hover:opacity-100"
                                }`}
                              >
                                <span className="text-[10px] font-bold block text-white">Tarif Flexible</span>
                                <span className="text-[8px] text-emerald-400 block mt-0.5">Annulation gratuite</span>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ratePlan: "non_refundable" })}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  formData.ratePlan === "non_refundable"
                                    ? "border-elite-gold bg-elite-gold/5"
                                    : "border-white/5 bg-transparent opacity-65 hover:opacity-100"
                                }`}
                              >
                                <span className="text-[10px] font-bold block text-elite-gold">Tarif Non-Remb.</span>
                                <span className="text-[8px] text-stone-300 block mt-0.5">Économisez -10% direct</span>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold mb-1">
                            Emplacement de votre table
                          </label>
                          <div className="space-y-2">
                            {[
                              { id: "terrasse", name: "Côté Mer (Terrasse)", price: "Gratuit", desc: "Brise marine, vue panoramique" },
                              { id: "climatisee", name: "Salle Intérieure Climatisée", price: "Gratuit", desc: "Cadre feutré, calme et climatisé" },
                              { id: "vip", name: "Salon VIP (Acompte requis)", price: "10 000 FCFA", desc: "Service discret exclusif, table privative" }
                            ].map((loc) => {
                              const isSelected = formData.tableLocation === loc.id;
                              return (
                                <button
                                  key={loc.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, tableLocation: loc.id });
                                    if (loc.id === "vip") {
                                      setRequireDeposit(true);
                                    }
                                  }}
                                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer ${
                                    isSelected 
                                      ? "border-elite-gold bg-elite-gold/5 shadow-[0_0_12px_rgba(202,138,4,0.08)]"
                                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <div>
                                    <span className={`text-[10px] font-bold block ${isSelected ? "text-elite-gold" : "text-white"}`}>
                                      {loc.name}
                                    </span>
                                    <span className="text-[8px] text-stone-400 block font-light leading-none mt-0.5">{loc.desc}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-elite-gold font-mono ml-2">
                                    {loc.price}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* STEP 3: EXTRAS / UPSELLS */}
                  {bookingStep === "extras" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="mb-2">
                        <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                          Services VIP (Surclassement)
                        </label>
                        <p className="text-[8px] text-stone-450 italic mt-0.5">Augmentez le panier moyen avec les services de l'hôtel.</p>
                      </div>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {/* Airport shuttle */}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, shuttle: !formData.shuttle })}
                          className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                            formData.shuttle ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold block text-white flex items-center gap-1.5">
                              {formData.shuttle && <span className="text-emerald-500 text-xs">✓</span>}
                              🚖 Navette Aéroport
                            </span>
                            <span className="text-[8px] text-stone-400 block mt-0.5">Chauffeur privé A/R (Cadjehoun)</span>
                          </div>
                          <span className="text-[10px] font-bold text-elite-gold font-mono whitespace-nowrap ml-2">
                            +10 000 F
                          </span>
                        </button>

                        {/* Buffet Breakfast */}
                        {bookingType === "room" && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, breakfast: !formData.breakfast })}
                            className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                              formData.breakfast ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                            }`}
                          >
                            <div>
                              <span className="text-[10px] font-bold block text-white flex items-center gap-1.5">
                                {formData.breakfast && <span className="text-emerald-500 text-xs">✓</span>}
                                🥐 Petit-déjeuner Royal
                              </span>
                              <span className="text-[8px] text-stone-400 block mt-0.5">Buffet gourmet complet / jour / pers.</span>
                            </div>
                            <span className="text-[10px] font-bold text-elite-gold font-mono whitespace-nowrap ml-2">
                              +7.5k F/j
                            </span>
                          </button>
                        )}

                        {/* Luxury Spa */}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, spa: !formData.spa })}
                          className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                            formData.spa ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold block text-white flex items-center gap-1.5">
                              {formData.spa && <span className="text-emerald-500 text-xs">✓</span>}
                              💆 Massage & Spa Vue Mer
                            </span>
                            <span className="text-[8px] text-stone-400 block mt-0.5">Session d'une heure de relaxation</span>
                          </div>
                          <span className="text-[10px] font-bold text-elite-gold font-mono whitespace-nowrap ml-2">
                            +25 000 F
                          </span>
                        </button>

                        {/* Welcome Champagne */}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, champagne: !formData.champagne })}
                          className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                            formData.champagne ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold block text-white flex items-center gap-1.5">
                              {formData.champagne && <span className="text-emerald-500 text-xs">✓</span>}
                              🍾 Champagne de Bienvenue
                            </span>
                            <span className="text-[8px] text-stone-400 block mt-0.5">Une bouteille fraîche à votre arrivée</span>
                          </div>
                          <span className="text-[10px] font-bold text-elite-gold font-mono whitespace-nowrap ml-2">
                            +40 000 F
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CHECKOUT / BILL BREAKDOWN */}
                  {bookingStep === "checkout" && (
                    <div className="space-y-3 animate-fade-in">
                      <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                        Facturation Détaillée (Normes Bénin)
                      </label>
                      
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5 text-[10px] font-mono">
                        {/* Room item */}
                        {bookingType === "room" ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-stone-400">
                                {formData.roomType === "executive" ? "Chambre Executive" : formData.roomType === "suite" ? "Suite Executive" : "Suite Royale"} ({nights} nuits)
                              </span>
                              <span className="text-white">{formatFCFA(roomSubtotal)}</span>
                            </div>
                            {formData.ratePlan === "non_refundable" && (
                              <div className="flex justify-between text-amber-500 text-[9px]">
                                <span>↳ Remise tarif non-remboursable</span>
                                <span>Inclus</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex justify-between">
                            <span className="text-stone-400">Réservation de table ({formData.tableLocation.toUpperCase()})</span>
                            <span className="text-white">Gratuit</span>
                          </div>
                        )}

                        {/* Extras list */}
                        {extrasSubtotal > 0 && (
                          <div className="border-t border-white/5 pt-1.5 space-y-1">
                            <span className="text-[8px] text-stone-550 block font-sans">Options additionnelles :</span>
                            {formData.shuttle && (
                              <div className="flex justify-between text-[9px] text-stone-300">
                                <span>• Navette Aéroport Cadjehoun</span>
                                <span>{formatFCFA(10000)}</span>
                              </div>
                            )}
                            {formData.breakfast && bookingType === "room" && (
                              <div className="flex justify-between text-[9px] text-stone-300">
                                <span>• Petit-déjeuner royal</span>
                                <span>{formatFCFA(breakfastCost)}</span>
                              </div>
                            )}
                            {formData.spa && (
                              <div className="flex justify-between text-[9px] text-stone-300">
                                <span>• Massage & Spa</span>
                                <span>{formatFCFA(25000)}</span>
                              </div>
                            )}
                            {formData.champagne && (
                              <div className="flex justify-between text-[9px] text-stone-300">
                                <span>• Bouteille Champagne VIP</span>
                                <span>{formatFCFA(40000)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Taxes */}
                        <div className="border-t border-white/5 pt-1.5 space-y-1">
                          {bookingType === "room" && (
                            <div className="flex justify-between text-[9px] text-stone-400">
                              <span>Taxe de séjour touristique</span>
                              <span>{formatFCFA(touristTax)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[9px] text-stone-400">
                            <span>TVA Locale (18%)</span>
                            <span>{formatFCFA(vatAmount)}</span>
                          </div>
                        </div>

                        {/* Grand Total */}
                        <div className="border-t border-white/10 pt-2 flex justify-between text-xs font-bold">
                          <span className="text-white uppercase">Montant Total Séjour</span>
                          <span className="text-white font-mono">{formatFCFA(grandTotal)}</span>
                        </div>

                        {/* Deposit Required */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg flex justify-between items-center text-[10px] font-sans mt-2">
                          <div>
                            <span className="font-bold text-emerald-400 block">Acompte de Garantie</span>
                            <span className="text-[8px] text-stone-400 block">Requis en ligne pour valider</span>
                          </div>
                          <span className="font-bold font-mono text-emerald-400 text-xs">{formatFCFA(depositRequired)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-elite-gold hover:bg-elite-gold-light text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer mt-6 shadow-lg shadow-elite-gold/15"
                >
                  {bookingStep === "checkout" ? "Payer l'acompte" : "Continuer"}
                </button>
              </form>
            )}

            {stage === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 flex-grow flex flex-col justify-between animate-fade-in">
                <div className="space-y-4">
                  <div className="text-center pb-2 border-b border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold block">
                      Passerelle de Paiement (Simulé FedaPay)
                    </span>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400">Établissement</span>
                      <span className="font-bold text-white">Hôtel Maison Rouge</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-2 font-mono">
                      <span className="text-stone-400">Garantie Requise</span>
                      <span className="font-bold text-elite-gold">{formatFCFA(depositRequired)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                      Mode de Paiement
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMomoOperator("mtn")}
                        className={`py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                          momoOperator === "mtn"
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-white/5 border-white/10 text-stone-400 hover:text-white"
                        }`}
                      >
                        MTN MoMo
                      </button>
                      <button
                        type="button"
                        onClick={() => setMomoOperator("moov")}
                        className={`py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                          momoOperator === "moov"
                            ? "bg-blue-500/20 border-blue-500 text-blue-300"
                            : "bg-white/5 border-white/10 text-stone-400 hover:text-white"
                        }`}
                      >
                        Moov Flooz
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                      Numéro de téléphone Bénin
                    </label>
                    <div className="flex gap-2">
                      <span className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-stone-300 font-mono flex items-center">
                        +229
                      </span>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{8,10}"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-elite-gold text-white font-mono"
                        placeholder="Ex: 01 67 75 00 83"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-emerald-500/20 mt-6"
                >
                  Valider l'acompte
                </button>
              </form>
            )}

            {stage === "paying" && (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse text-emerald-400">
                  <CreditCard size={28} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">Demande USSD envoyée !</h4>
                  <p className="text-stone-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                    Un pop-up de validation a été envoyé sur le numéro{" "}
                    <strong className="font-mono text-white">+229 {momoNumber}</strong>.
                    <br />
                    Saisissez votre code PIN {momoOperator.toUpperCase()} sur votre mobile pour valider l'acompte de{" "}
                    <strong className="text-elite-gold">{formatFCFA(depositRequired)}</strong>.
                  </p>
                </div>
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mt-4" />
              </div>
            )}

            {stage === "sent" && (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-white">Synchronisation de la chambre...</h4>
                  <p className="text-stone-500 text-[10px] mt-1 font-mono">
                    WEBHOOK: Dispatching details to Telegram, WhatsApp & PMS Dashboard
                  </p>
                </div>
              </div>
            )}

            {stage === "reception" && (
              <div className="flex-grow flex flex-col justify-between space-y-4 animate-fade-in">
                
                {/* SUCCESS VIEW TAB SELECTOR */}
                <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-[9px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessView("client");
                      setPreRegisterStage("none");
                    }}
                    className={`flex-grow py-1.5 rounded-md transition-all cursor-pointer ${
                      successView === "client" ? "bg-elite-gold text-black" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    📱 Vue Client (WhatsApp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessView("pms")}
                    className={`flex-grow py-1.5 rounded-md transition-all cursor-pointer ${
                      successView === "pms" ? "bg-elite-gold text-black" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    💻 PMS Réception (Dashboard)
                  </button>
                </div>

                {/* VIEW 1: CLIENT WHATSAPP PRE-CHECKIN EXPERIENCE */}
                {successView === "client" && (
                  <div className="space-y-4 flex-grow flex flex-col justify-between">
                    
                    {preRegisterStage === "none" && (
                      <div className="space-y-3 flex-grow overflow-y-auto max-h-[300px]">
                        {/* WhatsApp bubble */}
                        <div className="p-4 bg-[#005c4b] border border-emerald-500/30 rounded-2xl space-y-2.5 text-left shadow-lg max-w-[95%] ml-auto relative">
                          <div className="absolute top-0 right-0 -mr-1.5 w-3 h-3 bg-[#005c4b] rotate-45 border-r border-t border-emerald-500/30" />
                          
                          <div className="flex justify-between items-center text-[8px] text-emerald-300 font-bold">
                            <span>Maison Rouge Cotonou (Officiel)</span>
                            <span className="text-[7px] font-normal text-emerald-400">✓✓</span>
                          </div>
                          
                          {bookingType === "room" ? (
                            <div className="space-y-2">
                              <p className="text-[11px] text-white leading-relaxed">
                                Bonjour <strong>{formData.name}</strong>, votre réservation pour la <strong>{formData.roomType === "executive" ? "Chambre Executive" : formData.roomType === "suite" ? "Suite Executive Vue Mer" : "Suite Royale"}</strong> ({nights} nuits) est validée. <br />
                                💵 <strong>Acompte reçu :</strong> {formatFCFA(roomDeposit)} via Mobile Money ({momoOperator.toUpperCase()}).
                              </p>
                              <div className="p-2.5 bg-black/20 rounded-xl border border-white/5 space-y-1 text-[9px] text-stone-250 font-mono">
                                <div>• Arrivée: {formData.checkIn} (14h00)</div>
                                <div>• Départ: {formData.checkOut} (12h00)</div>
                                <div>• Extras: {formData.shuttle ? "Navette aéroport" : ""} {formData.breakfast ? "Petit-dej" : ""} {formData.spa ? "Spa" : ""} {formData.champagne ? "Champagne" : ""}</div>
                              </div>
                              <p className="text-[10px] text-stone-200">
                                Pour gagner du temps à l'arrivée et ne pas faire la queue, faites votre pré-enregistrement en ligne :
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-white leading-relaxed">
                              Bonjour <strong>{formData.name}</strong>, votre table ({formData.tableLocation.toUpperCase()}) est bien réservée le {formData.tableDate} à {formData.time}. <br />
                              💵 Acompte validé : {formatFCFA(tableDeposit)}. À très bientôt !
                            </p>
                          )}
                          <div className="text-right text-[7px] text-emerald-400/80 font-mono">
                            A l'instant
                          </div>
                        </div>

                        {/* Premium check-in button in WhatsApp */}
                        {bookingType === "room" && (
                          <button
                            type="button"
                            onClick={() => setPreRegisterStage("start")}
                            className="w-full bg-elite-gold hover:bg-elite-gold-light text-black py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                          >
                            <Sparkles size={12} />
                            Faire mon Pré-enregistrement
                          </button>
                        )}
                      </div>
                    )}

                    {/* Pre-registration flow screen */}
                    {preRegisterStage !== "none" && (
                      <div className="p-4 bg-stone-900 border border-white/10 rounded-2xl text-left space-y-3 animate-fade-in flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-elite-gold font-bold block mb-1">Portail Client Maison Rouge</span>
                          <h4 className="text-xs font-bold text-white mb-2">Check-in Express en Ligne</h4>
                          
                          {preRegisterStage === "start" && (
                            <div className="space-y-3">
                              <p className="text-[9px] text-stone-400 leading-relaxed">
                                Merci de scanner la page principale de votre passeport ou carte d'identité pour validation instantanée par reconnaissance de caractères.
                              </p>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setPreRegisterStage("camera");
                                }}
                                className="w-full py-4 border border-dashed border-white/25 rounded-xl hover:border-elite-gold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.01] transition-colors"
                              >
                                <span className="text-lg">📷</span>
                                <span className="text-[10px] text-stone-300 font-bold">Lancer mon Appareil Photo</span>
                                <span className="text-[8px] text-stone-500">Scan OCR intelligent en direct</span>
                              </button>
                            </div>
                          )}

                          {preRegisterStage === "camera" && (
                            <div className="space-y-3 relative overflow-hidden rounded-xl border border-white/10 bg-black aspect-video flex items-center justify-center">
                              <style>{`
                                @keyframes laser-scan {
                                  0% { top: 0%; }
                                  50% { top: 100%; }
                                  100% { top: 0%; }
                                }
                              `}</style>
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              
                              {/* Laser line overlay */}
                              <div 
                                className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"
                                style={{ animation: "laser-scan 2.5s infinite ease-in-out" }}
                              />
                              
                              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[7px] text-emerald-400 font-mono tracking-wider z-20 animate-pulse">
                                CAMÉRA EN DIRECT
                              </div>

                              <div className="absolute inset-4 border border-white/20 pointer-events-none rounded z-10">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-elite-gold" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-elite-gold" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-elite-gold" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-elite-gold" />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setPreRegisterStage("scanning");
                                  setTimeout(() => {
                                    setPreRegisterStage("done");
                                  }, 2000);
                                }}
                                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-elite-gold hover:bg-elite-gold-light text-black font-bold text-[9px] uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg z-30 cursor-pointer"
                              >
                                Capturer & Analyser
                              </button>
                            </div>
                          )}

                          {preRegisterStage === "scanning" && (
                            <div className="flex flex-col items-center justify-center py-6 space-y-3">
                              <div className="w-8 h-8 border-2 border-elite-gold border-t-transparent rounded-full animate-spin" />
                              <p className="text-[9px] text-stone-400 font-mono">Lecture optique et OCR en cours...</p>
                            </div>
                          )}

                          {preRegisterStage === "done" && (
                            <div className="space-y-3 animate-fade-in">
                              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                                <div>
                                  <span className="text-[10px] font-bold text-white block">Passeport enregistré</span>
                                  <span className="text-[8px] text-emerald-400 font-light block leading-none mt-0.5">Vérifié via IA (Nationalité: Française/Béninoise)</span>
                                </div>
                              </div>
                              <p className="text-[9px] text-stone-400 leading-relaxed">
                                Votre enregistrement est validé ! Votre clé numérique de chambre a été générée. Présentez-vous directement à la réception pour récupérer votre badge en 5 secondes.
                              </p>
                            </div>
                          )}
                        
                          {preRegisterStage === "done" && (
                            <button
                              type="button"
                              onClick={() => setPreRegisterStage("none")}
                              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Retour à la messagerie
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW 2: PMS DASHBOARD (THE WOW REAL-WORLD PORTAL FOR THE HOTEL MANAGER) */}
                {successView === "pms" && (
                  <div className="space-y-3.5 flex-grow text-left animate-fade-in overflow-y-auto max-h-[320px] pr-1">
                    
                    {/* STATS HEADER */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-stone-900 border border-white/5 p-2 rounded-xl text-center">
                        <span className="text-[8px] text-stone-500 uppercase block font-bold">Occupation</span>
                        <span className="text-xs font-bold text-white font-mono">75%</span>
                      </div>
                      <div className="bg-stone-900 border border-white/5 p-2 rounded-xl text-center">
                        <span className="text-[8px] text-stone-500 uppercase block font-bold">Ventes Dir.</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">+12%</span>
                      </div>
                      <div className="bg-stone-900 border border-white/5 p-2 rounded-xl text-center">
                        <span className="text-[8px] text-stone-500 uppercase block font-bold">Net Acompte</span>
                        <span className="text-xs font-bold text-elite-gold font-mono">{depositRequired > 10000 ? `${depositRequired / 1000}k` : "10k"}</span>
                      </div>
                    </div>

                    {/* TIMELINE / OCCUPANCY GRID */}
                    <div className="bg-stone-950 border border-white/5 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-bold text-stone-400 pb-1.5 border-b border-white/5">
                        <span>PLANNING DES CHAMBRES (Aujourd'hui)</span>
                        <span className="text-emerald-400">En direct</span>
                      </div>
                      <div className="space-y-1.5 font-mono text-[9px]">
                        {[
                          { room: "Chambre 101", cat: "Executive", status: "Occupée", guest: "M. KOFFI", cls: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
                          { room: "Chambre 102", cat: "Executive", status: "Propre / Libre", guest: "Aucun", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
                          { room: "Suite 201", cat: "Prestige", status: "Arrivée Prévue", guest: formData.name || "M. DUPONT", cls: "bg-amber-500/30 text-elite-gold border-elite-gold/30 animate-pulse font-bold" },
                          { room: "Suite 202", cat: "Royale", status: "En nettoyage", guest: "Départ ce matin", cls: "bg-stone-800 text-stone-400 border-stone-700" }
                        ].map((rm, idx) => (
                          <div key={idx} className="flex justify-between items-center p-1.5 rounded-lg border border-transparent bg-white/[0.01]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{rm.room}</span>
                              <span className="text-[7px] text-stone-500">({rm.cat})</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded text-[8px] border ${rm.cls}`}>
                              {rm.status} : {rm.guest}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HOUSEKEEPING & UPSELL ALERTS */}
                    <div className="bg-stone-950 border border-white/5 p-3 rounded-xl space-y-2">
                      <div className="text-[8px] font-bold text-stone-400 pb-1.5 border-b border-white/5 flex items-center gap-1">
                        <ListChecks size={10} />
                        <span>LOGISTIQUE & ACCUEIL VIP</span>
                      </div>
                      <ul className="text-[9px] space-y-1.5 text-stone-300">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>FedaPay Transaction `TX-{Math.floor(Math.random() * 90000 + 10000)}` : <strong>PAYÉE</strong></span>
                        </li>
                        {formData.shuttle && (
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">🚖</span>
                            <span>Alerte Chauffeur : Navette aéroport Cadjehoun activée.</span>
                          </li>
                        )}
                        {formData.champagne && (
                          <li className="flex items-center gap-2">
                            <span className="text-amber-400">🍾</span>
                            <span>Accueil VIP : Placer bouteille de Champagne au frais en Suite 201.</span>
                          </li>
                        )}
                        {bookingType === "room" && (
                          <li className="flex items-center gap-2 text-stone-400 font-sans">
                            <span className="text-stone-500">•</span>
                            <span>Statut d'enregistrement en ligne (Pre-check-in) : <strong>{preRegisterStage === "done" ? "COMPLÉTÉ (Passeport scanné)" : "En attente client"}</strong></span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* SYSTEM AUTOMATION REAL-TIME JOURNAL */}
                    <div className="bg-stone-950 border border-white/5 p-3 rounded-xl space-y-2">
                      <div className="text-[8px] font-bold text-stone-400 pb-1.5 border-b border-white/5 flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <Cpu size={10} />
                          JOURNAL D'AUTOMATISATION (LIVE LOGS)
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1 text-[7px] font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          ACTIF
                        </span>
                      </div>
                      <div className="font-mono text-[8px] text-stone-300 space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                        {logs.length === 0 ? (
                          <div className="text-stone-500 italic">En attente d'événements...</div>
                        ) : (
                          logs.map((log, idx) => (
                            <div key={idx} className="leading-normal border-l border-emerald-500/30 pl-1.5 py-0.5 animate-fade-in">
                              {log}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={resetSandbox}
                  className="w-full border border-white/10 hover:border-white/20 text-stone-400 hover:text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:bg-white/[0.02]"
                >
                  Simuler une nouvelle réservation
                </button>
              </div>
            )}
          </div>
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
