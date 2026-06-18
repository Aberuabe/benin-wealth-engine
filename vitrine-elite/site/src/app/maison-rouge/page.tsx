"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
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
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Code2,
  TrendingUp,
  Percent,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Camera,
  Coffee,
  Wine
} from "lucide-react";

// ANIMATION PRESETS FOR 4-STAR LUXURY FEEL
const pageTransition: any = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer: any = {
  animate: { transition: { staggerChildren: 0.08 } }
};

const fadeInUp: any = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const scaleIn: any = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function MaisonRougeDemo() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("accueil");

  // BOOKING WIZARD STATES
  const [bookingStep, setBookingStep] = useState<"dates" | "rooms" | "extras" | "checkout">("dates");
  const [formData, setFormData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@gmail.com",
    phone: "+229 01 67 75 00 83",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // default 2 nights
    guests: 2,
    roomType: "classique", // "classique" | "superieure" | "prestige"
    ratePlan: "refundable", // "refundable" | "non_refundable"
    
    // Add-ons (Upsells)
    shuttle: true,      // Included
    breakfast: true,    // Included
    spa: false,         // +25 000 FCFA
    champagne: false,   // +40 000 FCFA
    dinner: false       // +30 000 FCFA/pers
  });

  const [momoNumber, setMomoNumber] = useState("0167750083");
  const [momoOperator, setMomoOperator] = useState<"mtn" | "moov">("mtn");
  const [stage, setStage] = useState<"form" | "payment" | "paying" | "sent" | "reception">("form");
  const [successView, setSuccessView] = useState<"client" | "pms">("client");
  const [preRegisterStage, setPreRegisterStage] = useState<"none" | "start" | "camera" | "scanning" | "done">("none");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showPayload, setShowPayload] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Formatting helpers
  const formatFCFA = (val: number) => {
    return val.toLocaleString("fr-FR") + " FCFA";
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
    let base = 119000; // Chambre Classique
    if (formData.roomType === "superieure") base = 146000; // Chambre Supérieure
    if (formData.roomType === "prestige") base = 190000; // Suite Prestige
    if (formData.ratePlan === "non_refundable") base = base * 0.9; // -10% direct discount
    return Math.round(base);
  };

  const roomPricePerNight = getRoomPricePerNight();
  const roomSubtotal = roomPricePerNight * nights;

  // Add-on calculations
  const spaCost = formData.spa ? 25000 : 0;
  const champagneCost = formData.champagne ? 40000 : 0;
  const dinnerCost = formData.dinner ? 30000 * formData.guests * nights : 0;
  const extrasSubtotal = spaCost + champagneCost + dinnerCost;

  // Tourism Taxes & VAT (Maison Rouge standards)
  const touristTax = 2500 * nights * formData.guests; // 2500 FCFA per person per night
  const taxBase = roomSubtotal + extrasSubtotal;
  const vatAmount = Math.round(taxBase * 0.18); // 18% UEMOA standard VAT
  const grandTotal = taxBase + touristTax + vatAmount;

  // Deposit Guarantee (First night room + UEMOA tax + champagne upsell if selected)
  const roomDeposit = Math.round(roomPricePerNight * 1.18) + champagneCost;

  // ROI / OTA Savings Calculations (Crucial for Abel's sales pitch)
  const otaCommissionRate = 0.20; // Booking.com standard rate in Cotonou (20%)
  const otaCommissionSaved = Math.round(grandTotal * otaCommissionRate);
  const fedapayFee = Math.round(roomDeposit * 0.025); // FedaPay standard Mobile Money fee (2.5%)
  const directProfitGain = otaCommissionSaved - fedapayFee;

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingStep === "dates") setBookingStep("rooms");
    else if (bookingStep === "rooms") setBookingStep("extras");
    else if (bookingStep === "extras") setBookingStep("checkout");
  };

  const handleClientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("paying");
    setTimeout(() => {
      setStage("sent");
      setTimeout(() => {
        setStage("reception");
      }, 1500);
    }, 2500); // Simulate USSD push approval delay on customer's phone
  };

  const resetSandbox = () => {
    setFormData({
      name: "Jean Dupont",
      email: "jean.dupont@gmail.com",
      phone: "+229 01 67 75 00 83",
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      guests: 2,
      roomType: "classique",
      ratePlan: "refundable",
      shuttle: true,
      breakfast: true,
      spa: false,
      champagne: false,
      dinner: false
    });
    setMomoNumber("0167750083");
    setBookingStep("dates");
    setStage("form");
    setSuccessView("client");
    setPreRegisterStage("none");
    setShowPayload(false);
  };

  // Manage webcam stream lifecycle for passport scan mockup
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
          console.warn("Camera blocked or unavailable, using simulated scanning fallback:", err);
          // Auto fallback to loading animation
          setPreRegisterStage("scanning");
          setTimeout(() => {
            setPreRegisterStage("done");
          }, 3000);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [preRegisterStage]);

  // Handle reception and FedaPay webhooks / log system simulation
  useEffect(() => {
    if (stage === "reception") {
      const initialLogs = [
        `SYSTEM: Nouvelle intention de réservation initiée par ${formData.name}`,
        `GATEWAY: Envoi de la requête de prélèvement de ${formatFCFA(roomDeposit)} au numéro MoMo +229 ${momoNumber}`,
        `GATEWAY: Paiement validé avec succès par ${momoOperator.toUpperCase()} Mobile Money`,
        `WEBHOOK: Transaction FedaPay ID tx_${Math.random().toString(36).substr(2, 9)} approuvée`,
        `NOTIFY: Message WhatsApp transactionnel automatisé envoyé à +229 ${momoNumber}`,
        `PMS: Allocation automatique de la chambre ${formData.roomType === "classique" ? "Chambre 104" : formData.roomType === "superieure" ? "Chambre 112" : "Suite Royale 201"} dans la base de données de l'hôtel`
      ];
      setLogs([]);
      initialLogs.forEach((l, idx) => {
        setTimeout(() => {
          const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
          setLogs(prev => [...prev, `[${time}] ${l}`]);
        }, idx * 500);
      });
    }
  }, [stage]);

  // Handle client pre-registration logs in receptionist PMS
  useEffect(() => {
    if (preRegisterStage === "done") {
      const checkinLogs = [
        `CLIENT: Clic sur le lien WhatsApp de pré-enregistrement express`,
        `OCR: Capture d'identité reçue. Lancement de l'OCR de document`,
        `OCR: Extraction réussie. Nom: ${formData.name.toUpperCase()}, Document: PASSEPORT BENIN, validité OK`,
        `PMS: Statut d'attribution mis à jour. Chambre prête à accueillir le client.`
      ];
      checkinLogs.forEach((l, idx) => {
        setTimeout(() => {
          const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
          setLogs(prev => [...prev, `[${time}] ${l}`]);
        }, idx * 500);
      });
    }
  }, [preRegisterStage]);

  return (
    <div className="min-h-screen bg-[#070504] text-[#F5F5F4] font-sans selection:bg-[#9B2C2C] selection:text-white relative overflow-x-hidden grid-bg">
      
      {/* HIGH-END AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#9B2C2C]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-[#CA8A04]/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="noise-overlay" />

      {/* FLOAT NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070504]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9B2C2C] border border-[#CA8A04]/40 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="font-serif font-bold text-[#F5F5F4] text-lg">MR</span>
            </div>
            <div>
              <span className="font-serif font-semibold tracking-[0.2em] text-sm uppercase text-white block">Maison Rouge</span>
              <span className="text-[9px] text-[#CA8A04] uppercase tracking-[0.25em] font-semibold block leading-none mt-0.5">Cotonou • Bénin</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.15em] text-[#A8A29E]">
            <button onClick={() => setActiveTab("accueil")} className={`hover:text-white transition-all duration-300 relative py-1 cursor-pointer ${activeTab === "accueil" ? "text-white" : ""}`}>
              Accueil
              {activeTab === "accueil" && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CA8A04]" />}
            </button>
            <button onClick={() => setActiveTab("chambres")} className={`hover:text-white transition-all duration-300 relative py-1 cursor-pointer ${activeTab === "chambres" ? "text-white" : ""}`}>
              Chambres & Suites
              {activeTab === "chambres" && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CA8A04]" />}
            </button>
            <button onClick={() => setActiveTab("restaurant")} className={`hover:text-white transition-all duration-300 relative py-1 cursor-pointer ${activeTab === "restaurant" ? "text-white" : ""}`}>
              Restaurant & Table Bio
              {activeTab === "restaurant" && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CA8A04]" />}
            </button>
            <button onClick={() => setActiveTab("art")} className={`hover:text-white transition-all duration-300 relative py-1 cursor-pointer ${activeTab === "art" ? "text-white" : ""}`}>
              Art Contemporain
              {activeTab === "art" && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CA8A04]" />}
            </button>
          </div>

          <button
            onClick={() => {
              setBookingStep("dates");
              setIsBookingOpen(true);
            }}
            className="bg-gradient-to-r from-[#9B2C2C] to-[#C53030] hover:from-[#C53030] hover:to-[#E53E3E] text-[#F5F5F4] border border-[#CA8A04]/30 hover:border-[#CA8A04]/60 text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-[#9B2C2C]/25"
          >
            Réserver Directement
          </button>
        </div>
      </nav>

      {/* STRATEGIC SALES BANNER (For Hotel Manager Review) */}
      <div className="relative z-10 pt-24 bg-gradient-to-r from-[#9B2C2C]/20 via-[#CA8A04]/10 to-[#9B2C2C]/20 border-b border-[#CA8A04]/15 px-6 py-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#CA8A04] text-black font-extrabold px-3 py-1 rounded text-[9px] uppercase tracking-wider shadow-md">
              DÉMO ABEL DOTONOU
            </span>
            <p className="text-stone-300 text-xs text-left font-light leading-relaxed">
              Maison Rouge verse actuellement environ <strong>20% de commission</strong> à Booking.com. Notre moteur direct résout la perte de cash-flow avec un acompte Mobile Money sécurisé et un check-in express 100% digital.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-left">
              <span className="text-stone-500 block text-[9px]">OTA Commission Perdue</span>
              <span className="text-red-400 font-bold">~15 000 000 FCFA / an</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-left">
              <span className="text-stone-500 block text-[9px]">Gain Moteur Direct</span>
              <span className="text-emerald-400 font-bold">+20% de marge nette</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEWS CONTAINER */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "accueil" && (
            <motion.div key="accueil" {...pageTransition}>
              
              {/* HERO SECTION */}
              <section className="relative min-h-[95vh] flex items-center justify-center pt-12 overflow-hidden px-6">
                <div className="absolute inset-0 bg-[url('/maison_rouge_hero.png')] bg-cover bg-center opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#070504]/20 via-[#070504]/90 to-[#070504] pointer-events-none" />
                
                <div className="max-w-6xl mx-auto relative z-10 text-center space-y-10">
                  <motion.div {...fadeInUp} className="space-y-4">
                    <span className="text-[11px] uppercase tracking-[0.45em] text-[#CA8A04] font-extrabold block">
                      HÔTEL D'ART 4 ÉTOILES • COTONOU
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-light leading-[1.05] tracking-tight">
                      L'élégance d'une maison d'hôtes,<br />
                      <span className="text-[#CA8A04] font-normal italic font-serif">l'excellence d'un hôtel de luxe.</span>
                    </h1>
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="max-w-3xl mx-auto text-[#D6D3D1] text-sm sm:text-lg font-light leading-relaxed"
                  >
                    Située sur le prestigieux boulevard de la Marina à Cotonou, la Maison Rouge est une escale unique alliant végétation tropicale sauvage, art contemporain africain, deux piscines d'eau douce et une table gastronomique biologique raffinée.
                  </motion.p>

                  {/* ELEGANT FLOATING QUICK BOOKING WIDGET */}
                  <motion.div 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-5xl mx-auto bg-[#131110]/80 border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-stretch justify-between gap-6"
                  >
                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-bold flex items-center gap-2">
                          <Calendar size={13} className="text-[#CA8A04]" /> Arrivée
                        </label>
                        <input 
                          type="date" 
                          value={formData.checkIn} 
                          onChange={(e) => setFormData({...formData, checkIn: e.target.value})} 
                          className="w-full bg-[#1C1917]/70 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#9B2C2C] text-white font-mono" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-bold flex items-center gap-2">
                          <Calendar size={13} className="text-[#CA8A04]" /> Départ
                        </label>
                        <input 
                          type="date" 
                          value={formData.checkOut} 
                          onChange={(e) => setFormData({...formData, checkOut: e.target.value})} 
                          className="w-full bg-[#1C1917]/70 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#9B2C2C] text-white font-mono" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-bold flex items-center gap-2">
                          <Users size={13} className="text-[#CA8A04]" /> Voyageurs
                        </label>
                        <select 
                          value={formData.guests} 
                          onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})} 
                          className="w-full bg-[#1C1917]/70 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#9B2C2C] text-white"
                        >
                          {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n>1 ? "voyageurs" : "voyageur"}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-bold flex items-center gap-2">
                          <Bed size={13} className="text-[#CA8A04]" /> Catégorie
                        </label>
                        <select 
                          value={formData.roomType} 
                          onChange={(e) => setFormData({...formData, roomType: e.target.value})} 
                          className="w-full bg-[#1C1917]/70 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#9B2C2C] text-white"
                        >
                          <option value="classique">Chambre Classique</option>
                          <option value="superieure">Chambre Supérieure</option>
                          <option value="prestige">Suite Prestige</option>
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setBookingStep("rooms");
                        setIsBookingOpen(true);
                      }}
                      className="bg-gradient-to-r from-[#9B2C2C] to-[#C53030] hover:from-[#C53030] hover:to-[#E53E3E] text-white px-8 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-[#9B2C2C]/20"
                    >
                      <span>Vérifier Dispo</span>
                      <ArrowRight size={15} />
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* WHY DIRECT BOOKING COMPARISON SECTION (OTA LEAK PROOF) */}
              <section className="py-24 px-6 border-t border-white/5 bg-[#0A0807]">
                <div className="max-w-6xl mx-auto space-y-12">
                  <div className="text-center space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Comparatif Financier</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-light">Pourquoi Réserver en Direct ?</h2>
                    <p className="text-stone-400 text-sm max-w-xl mx-auto font-light">Visualisez ce que Maison Rouge gagne en contournant les agences en ligne tierces (OTAs).</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Booking.com Card */}
                    <div className="p-8 rounded-3xl bg-[#131110]/40 border border-white/5 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-stone-400 font-serif">Réservation via Booking.com</span>
                          <span className="text-red-400 bg-red-400/10 border border-red-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold">Perte Financière</span>
                        </div>
                        <ul className="space-y-3 text-xs text-stone-400 font-light">
                          <li className="flex items-start gap-2.5"><ShieldAlert size={14} className="text-red-400 mt-0.5 flex-shrink-0" /> Commission de 18% à 22% reversée à l'étranger.</li>
                          <li className="flex items-start gap-2.5"><ShieldAlert size={14} className="text-red-400 mt-0.5 flex-shrink-0" /> Pas de paiement par Mobile Money local (MTN / Moov).</li>
                          <li className="flex items-start gap-2.5"><ShieldAlert size={14} className="text-red-400 mt-0.5 flex-shrink-0" /> Pas de pré-check-in digital : attente de 15 minutes à l'arrivée.</li>
                          <li className="flex items-start gap-2.5"><ShieldAlert size={14} className="text-red-400 mt-0.5 flex-shrink-0" /> Service client délocalisé, pas de lien direct WhatsApp.</li>
                        </ul>
                      </div>
                      <div className="bg-red-400/5 p-4 rounded-xl border border-red-500/10 flex justify-between items-center text-xs">
                        <span className="text-stone-400">Manque à gagner moyen / séjour</span>
                        <strong className="text-red-400 font-mono">-55 000 FCFA</strong>
                      </div>
                    </div>

                    {/* Direct Engine Card */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#9B2C2C]/20 to-transparent border border-[#CA8A04]/25 space-y-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#CA8A04]/10 rounded-full blur-2xl" />
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white font-serif">Notre Moteur Direct Intuitif</span>
                          <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold">100% Cash-Flow Conservé</span>
                        </div>
                        <ul className="space-y-3 text-xs text-stone-300 font-light">
                          <li className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-[#CA8A04] mt-0.5 flex-shrink-0" /> Commission OTA : <strong>0%</strong> (100% de la valeur reste au Bénin).</li>
                          <li className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-[#CA8A04] mt-0.5 flex-shrink-0" /> Intégration Native des wallets locaux <strong>MTN MoMo & Moov Flooz</strong>.</li>
                          <li className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-[#CA8A04] mt-0.5 flex-shrink-0" /> <strong>Express Check-in OCR</strong> : scan de passeport photo en 5 sec.</li>
                          <li className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-[#CA8A04] mt-0.5 flex-shrink-0" /> Relation WhatsApp automatisée avec le client pour upsell VIP.</li>
                        </ul>
                      </div>
                      <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/25 flex justify-between items-center text-xs">
                        <span className="text-stone-300">Bénéfice supplémentaire / séjour</span>
                        <strong className="text-emerald-400 font-mono">+55 000 FCFA</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CONCEPT & ART INTRODUCTION */}
              <section className="py-28 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div {...fadeInUp} className="space-y-8 text-left">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Une expérience immersive unique</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">Vivre au coeur d'une galerie d'art contemporain</h2>
                  <p className="text-stone-400 text-sm sm:text-base font-light leading-relaxed">
                    À la Maison Rouge, l'art n'est pas décoratif, il est structurel. Notre établissement expose de façon permanente des toiles, photographies et sculptures d'artistes majeurs de la scène ouest-africaine. 
                  </p>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">
                    Chaque chambre possède sa propre direction artistique, offrant une sensation d'exclusivité et d'authenticité.
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-4 text-xs font-mono font-bold text-[#CA8A04]">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🖼️</span> Galerie Vivante
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌿</span> Jardin d'Éden Tropical
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏊</span> 2 Piscines Extérieures
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✈️</span> Transfert Aéroport Inclus
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-square rounded-[2.5rem] overflow-hidden p-1 bg-gradient-to-br from-[#9B2C2C] to-[#CA8A04]"
                >
                  <div className="absolute inset-0 bg-[url('/maison_rouge_gallery.png')] bg-cover bg-center rounded-[2.4rem]" />
                  <div className="absolute inset-0 bg-[#070504]/10 rounded-[2.4rem] hover:bg-transparent transition-all duration-500" />
                </motion.div>
              </section>

            </motion.div>
          )}

          {activeTab === "chambres" && (
            <motion.div key="chambres" {...pageTransition} className="py-24 px-6 max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Hébergements de Charme</span>
                <h2 className="text-4xl md:text-5xl font-serif font-light">Chambres & Suites d'Artistes</h2>
                <p className="text-stone-400 text-sm max-w-xl mx-auto font-light">Toutes nos chambres possèdent leur propre décoration sur-mesure et sont équipées de literie haut de gamme.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    id: "classique", 
                    name: "Chambre Classique", 
                    price: 119000, 
                    desc: "24m² de confort intimiste. Mobilier artisanal en bois précieux et œuvres d'art originales.",
                    img: "/maison_rouge_room.png",
                    amenities: ["Climatisation silencieuse", "Douche italienne en marbre", "Wi-Fi Fibre 100 Mbps"] 
                  },
                  { 
                    id: "superieure", 
                    name: "Chambre Supérieure", 
                    price: 146000, 
                    desc: "32m² d'espace raffiné avec grand balcon privatif s'ouvrant sur les jardins tropicaux.",
                    img: "/maison_rouge_room.png",
                    amenities: ["Balcon privatif", "Baignoire et douche", "Machine Espresso dans la chambre"] 
                  },
                  { 
                    id: "prestige", 
                    name: "Suite Prestige", 
                    price: 190000, 
                    desc: "55m² de pur luxe. Salon séparé, grand lit double King-size et terrasse privative face à la piscine.",
                    img: "/maison_rouge_hero.png",
                    amenities: ["Salon privatif", "Terrasse d'angle vue mer", "Service majordome dédié"] 
                  }
                ].map(room => (
                  <div key={room.id} className="bg-[#131110] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col justify-between group shadow-2xl hover:border-[#CA8A04]/30 transition-all duration-500">
                    <div className="aspect-[4/3] bg-stone-950 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#9B2C2C]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <img src={room.img} alt={room.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-white group-hover:text-[#CA8A04] transition-colors duration-300 font-serif">{room.name}</h3>
                          <div className="text-right">
                            <span className="font-mono text-sm font-bold text-[#CA8A04] block">{formatFCFA(room.price)}</span>
                            <span className="text-[9px] text-stone-500 font-light block">/ nuit</span>
                          </div>
                        </div>
                        <p className="text-xs text-stone-400 font-light leading-relaxed">{room.desc}</p>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-2 text-[10px] text-stone-400 font-mono">
                        {room.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-[#CA8A04] font-bold">✓</span> {amenity}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setFormData({ ...formData, roomType: room.id });
                          setBookingStep("extras");
                          setIsBookingOpen(true);
                        }}
                        className="w-full bg-[#9B2C2C] hover:bg-[#C53030] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer shadow-md shadow-[#9B2C2C]/10"
                      >
                        Réserver cette chambre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "restaurant" && (
            <motion.div key="restaurant" {...pageTransition} className="py-24 px-6 max-w-6xl mx-auto space-y-16">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden p-1 bg-gradient-to-br from-[#CA8A04] to-[#9B2C2C]">
                  <img src="/maison_rouge_restaurant.png" alt="Restaurant Bio Maison Rouge" className="absolute inset-0 w-full h-full object-cover rounded-[2.4rem]" />
                </div>
                <div className="space-y-6 text-left">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Cuisine Responsable</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">Une Gastronomie Bio, Locale et Raffinée</h2>
                  <p className="text-[#D6D3D1] text-sm sm:text-base font-light leading-relaxed">
                    Le restaurant de la Maison Rouge offre un concept culinaire unique à Cotonou. Notre Chef prépare chaque jour des recettes métissées associant techniques culinaires françaises et saveurs typiques béninoises.
                  </p>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">
                    Nous travaillons en circuit court, en nous approvisionnant exclusivement auprès de fermes biologiques du Bénin méridional et de coopératives de pêcheurs artisanaux locaux.
                  </p>
                  
                  <div className="border-t border-white/5 pt-6 space-y-3 font-mono text-xs text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Service :</span>
                      <span>De 07h00 à 23h00 (Tous les jours)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Atmosphère :</span>
                      <span>Terrasse ombragée près de la piscine & Salon climatisé</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Gage Qualité :</span>
                      <span className="text-[#CA8A04] font-bold">Produits 100% frais et biologiques</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "art" && (
            <motion.div key="art" {...pageTransition} className="py-24 px-6 max-w-6xl mx-auto space-y-16 text-center">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Collection d'art de l'hôtel</span>
                <h2 className="text-4xl md:text-5xl font-serif font-light">Le Carrefour de la Création Africaine</h2>
                <p className="text-stone-400 text-sm max-w-xl mx-auto font-light">L'hôtel Maison Rouge abrite plus d'une centaine d'œuvres exposées au public. Découvrez la vitalité de l'art contemporain africain.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="aspect-square bg-stone-900 border border-white/5 rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[#9B2C2C]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img src="/maison_rouge_gallery.png" alt="Oeuvre d'art Maison Rouge" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-left opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-[8px] uppercase tracking-wider text-[#CA8A04] block font-bold">Art Plastique</span>
                      <span className="text-[10px] text-white block font-semibold font-serif">Exposition Permanente</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#0A0807] py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm text-[#A8A29E]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#9B2C2C] rounded-lg flex items-center justify-center">
                <span className="font-serif font-bold text-white text-md">MR</span>
              </div>
              <span className="font-serif font-semibold tracking-wider text-sm uppercase text-white">Maison Rouge</span>
            </div>
            <p className="text-xs font-light leading-relaxed">Un hôtel d'art intime et raffiné à Cotonou, mêlant architecture moderne, art africain et services hôteliers 4 étoiles d'exception.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Contact & Réservations</h4>
            <div className="space-y-3 text-xs font-light">
              <p className="flex items-center gap-2"><Phone size={13} className="text-[#CA8A04]" /> +229 01 65 12 69 89</p>
              <p className="flex items-center gap-2"><Mail size={13} className="text-[#CA8A04]" /> contact@maison-rouge-cotonou.com</p>
              <p className="flex items-center gap-2"><MapPin size={13} className="text-[#CA8A04]" /> Boulevard de la Marina, Cotonou</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Plan du site</h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs font-light">
              <button onClick={() => setActiveTab("accueil")} className="text-left hover:text-white transition-colors cursor-pointer">Accueil</button>
              <button onClick={() => setActiveTab("chambres")} className="text-left hover:text-white transition-colors cursor-pointer">Chambres</button>
              <button onClick={() => setActiveTab("restaurant")} className="text-left hover:text-white transition-colors cursor-pointer">Restaurant</button>
              <button onClick={() => setActiveTab("art")} className="text-left hover:text-white transition-colors cursor-pointer">Art contemporain</button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Partenaire Technique</h4>
            <p className="text-xs font-light leading-relaxed">Ce prototype intelligent de réservation directe a été conçu par <strong>Abel Dotonou</strong> pour optimiser le cash-flow et la rentabilité en direct.</p>
          </div>
        </div>
        <div className="text-center text-[10px] text-stone-600 mt-20 pt-8 border-t border-white/5 font-mono">
          &copy; {new Date().getFullYear()} Hôtel Maison Rouge Cotonou - Prototype transactionnel direct v5.0 APEX.
        </div>
      </footer>

      {/* ======================================================== */}
      {/* TRANSACTIONAL BOOKING WIZARD MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-5xl bg-[#131110] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden max-h-[95vh] lg:max-h-[90vh]"
            >
              
              {/* LEFT COLUMN: LIVE BILLING DETAIL & DYNAMIC ROI CALCULATOR */}
              <div className="w-full lg:w-[380px] bg-[#0A0807] p-8 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6 text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#CA8A04] font-extrabold block">DIRECT CASH FLOW MOTOR</span>
                    <h3 className="text-2xl font-serif text-white mt-1">Détails de Réservation</h3>
                  </div>

                  <div className="space-y-5 text-xs font-mono">
                    
                    {/* Stay Summary Card */}
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                      <span className="text-[8px] uppercase text-stone-500 font-sans block font-bold">Votre séjour ({nights} {nights > 1 ? "nuits" : "nuit"})</span>
                      <div className="text-white text-[10px] flex justify-between">
                        <span>Arrivée: {formData.checkIn}</span>
                        <span>Départ: {formData.checkOut}</span>
                      </div>
                      <div className="text-[#CA8A04] text-[10px] font-bold mt-1 font-sans">
                        {formData.roomType === "classique" ? "Chambre Classique" : formData.roomType === "superieure" ? "Chambre Supérieure" : "Suite Prestige"}
                      </div>
                    </div>

                    {/* Cost Calculations */}
                    <div className="space-y-2.5 text-[10px]">
                      <div className="flex justify-between text-stone-400">
                        <span>Chambre ({nights} nuits)</span>
                        <span className="text-white font-bold">{formatFCFA(roomSubtotal)}</span>
                      </div>

                      {extrasSubtotal > 0 && (
                        <div className="border-t border-white/5 pt-2 space-y-1.5">
                          <span className="text-[8px] text-stone-500 font-sans block font-bold">Services VIP supplémentaires:</span>
                          {formData.spa && (
                            <div className="flex justify-between text-stone-300">
                              <span>• Massage & Spa Privé</span>
                              <span>{formatFCFA(25000)}</span>
                            </div>
                          )}
                          {formData.champagne && (
                            <div className="flex justify-between text-stone-300">
                              <span>• Champagne de Bienvenue</span>
                              <span>{formatFCFA(40000)}</span>
                            </div>
                          )}
                          {formData.dinner && (
                            <div className="flex justify-between text-stone-300">
                              <span>• Dîners Bio ({formData.guests} pers.)</span>
                              <span>{formatFCFA(dinnerCost)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-white/5 pt-2.5 space-y-1 text-stone-400">
                        <div className="flex justify-between">
                          <span>Taxe de séjour touristique</span>
                          <span>{formatFCFA(touristTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TVA standard (18%)</span>
                          <span>{formatFCFA(vatAmount)}</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t border-white/10 pt-3 flex justify-between text-xs font-bold font-sans">
                        <span className="text-white">Total Séjour</span>
                        <span className="text-white font-mono">{formatFCFA(grandTotal)}</span>
                      </div>

                      {/* Local Momo Guarantee Deposit */}
                      <div className="bg-[#9B2C2C]/10 border border-[#9B2C2C]/30 p-4 rounded-2xl space-y-1 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-red-400 font-sans">Acompte Requis (MoMo)</span>
                          <span className="font-bold font-mono text-white text-xs">{formatFCFA(roomDeposit)}</span>
                        </div>
                        <span className="text-[7.5px] text-stone-400 block leading-normal">Permet de garantir votre chambre instantanément sans carte bancaire internationale.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC SAVINGS COUNTER FOR CEMINE & MANAGEMENT */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block text-left">
                    💡 Impact Direct Solution (Pour l'Hôtel)
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
                      <span className="text-[7.5px] text-stone-500 block">Com. OTA Sauvée</span>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">+{formatFCFA(otaCommissionSaved)}</span>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
                      <span className="text-[7.5px] text-stone-500 block">Gain Net direct</span>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">+{formatFCFA(directProfitGain)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE FORM & SYSTEM SIMULATION */}
              <div className="flex-grow bg-[#131110] relative flex flex-col justify-between overflow-y-auto max-h-[75vh] lg:max-h-[90vh]">
                
                {/* Navbar within Modal */}
                <div className="flex justify-between items-center px-6 py-5 bg-black/20 border-b border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-bold">
                    {stage === "reception" ? "Dashboard PMS Hôtelier & webhook" : "Moteur Direct Maison Rouge"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingOpen(false);
                      resetSandbox();
                    }}
                    className="text-stone-400 hover:text-white text-xs font-bold cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Fermer ✕
                  </button>
                </div>

                {/* MODAL ACTION WORKSPACE */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  
                  {/* STAGE 1: BOOKING WIZARD FORM */}
                  {stage === "form" && (
                    <form onSubmit={bookingStep === "checkout" ? handleClientFormSubmit : handleSimulateSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Interactive Step Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                          <div className="flex items-center gap-3">
                            {bookingStep !== "dates" && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (bookingStep === "rooms") setBookingStep("dates");
                                  else if (bookingStep === "extras") setBookingStep("rooms");
                                  else if (bookingStep === "checkout") setBookingStep("extras");
                                }}
                                className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <ArrowLeft size={16} />
                              </button>
                            )}
                            <span className="text-[10px] uppercase tracking-widest text-[#CA8A04] font-extrabold">
                              {bookingStep === "dates" && "Étape 1 : Dates & Voyageurs"}
                              {bookingStep === "rooms" && "Étape 2 : Choix de l'Hébergement"}
                              {bookingStep === "extras" && "Étape 3 : Surclassement & Services VIP"}
                              {bookingStep === "checkout" && "Étape 4 : Coordonnées du Client"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {["dates", "rooms", "extras", "checkout"].map((s, idx) => {
                              const steps = ["dates", "rooms", "extras", "checkout"];
                              const currentIdx = steps.indexOf(bookingStep);
                              return (
                                <div 
                                  key={s} 
                                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    idx === currentIdx ? "bg-[#CA8A04] scale-125" : idx < currentIdx ? "bg-emerald-500" : "bg-white/10"
                                  }`} 
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* STEP 1: DATES & GUESTS */}
                        {bookingStep === "dates" && (
                          <div className="space-y-5 animate-slide-in text-left">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Date d'arrivée</label>
                                <input 
                                  type="date" 
                                  required 
                                  value={formData.checkIn} 
                                  onChange={(e) => setFormData({...formData, checkIn: e.target.value})} 
                                  className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#9B2C2C] text-white font-mono" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Date de départ</label>
                                <input 
                                  type="date" 
                                  required 
                                  value={formData.checkOut} 
                                  onChange={(e) => setFormData({...formData, checkOut: e.target.value})} 
                                  className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#9B2C2C] text-white font-mono" 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Nombre de Voyageurs</label>
                              <select 
                                value={formData.guests} 
                                onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})} 
                                className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#9B2C2C] text-white"
                              >
                                {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n > 1 ? "Voyageurs" : "Voyageur"}</option>)}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* STEP 2: ROOM SELECT */}
                        {bookingStep === "rooms" && (
                          <div className="space-y-4 animate-slide-in text-left">
                            <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Sélectionnez la chambre / suite souhaitée</label>
                            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                              {[
                                { id: "classique", name: "Chambre Classique", price: 119000, desc: "24m², lit double Queen-size, douche italienne, Wi-Fi ultra rapide, bio amenities", icon: "🛌" },
                                { id: "superieure", name: "Chambre Supérieure", price: 146000, desc: "32m², balcon privatif sur jardin exotique, lit double King-size, machine café", icon: "🌴" },
                                { id: "prestige", name: "Suite Prestige", price: 190000, desc: "55m², terrasse d'angle vue mer, salon privé, service conciergerie VIP", icon: "🌊" }
                              ].map(r => {
                                const isSelected = formData.roomType === r.id;
                                return (
                                  <button
                                    type="button"
                                    key={r.id}
                                    onClick={() => setFormData({ ...formData, roomType: r.id })}
                                    className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 cursor-pointer ${
                                      isSelected 
                                        ? "border-[#CA8A04] bg-[#CA8A04]/5 shadow-[0_0_15px_rgba(202,138,4,0.05)]"
                                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                    }`}
                                  >
                                    <div className="flex gap-4 items-center">
                                      <span className="text-2xl">{r.icon}</span>
                                      <div>
                                        <span className={`text-xs font-bold block ${isSelected ? "text-[#CA8A04]" : "text-white"}`}>{r.name}</span>
                                        <span className="text-[9px] text-stone-400 block mt-1 leading-normal font-light">{r.desc}</span>
                                      </div>
                                    </div>
                                    <span className="text-xs font-bold text-[#CA8A04] font-mono ml-4">{r.price / 1000}k FCFA</span>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="space-y-2.5 mt-3">
                              <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Sélectionnez le Plan Tarifaire</label>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, ratePlan: "refundable" })}
                                  className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                                    formData.ratePlan === "refundable" ? "border-white/20 bg-white/5 font-semibold" : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  <span className="text-[10px] block text-white">Tarif Flexible</span>
                                  <span className="text-[8px] text-emerald-400 block mt-0.5 font-light">Annulation gratuite à J-2</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, ratePlan: "non_refundable" })}
                                  className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                                    formData.ratePlan === "non_refundable" ? "border-[#CA8A04] bg-[#CA8A04]/5 font-semibold" : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  <span className="text-[10px] block text-[#CA8A04]">Tarif Direct Exclusif</span>
                                  <span className="text-[8px] text-stone-300 block mt-0.5 font-light">Économisez -10% immédiat</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* STEP 3: EXTRAS / UPSELLS */}
                        {bookingStep === "extras" && (
                          <div className="space-y-4 animate-slide-in text-left">
                            <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Améliorez votre séjour avec nos prestations VIP</label>
                            <div className="space-y-3">
                              
                              {/* Spa Option */}
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, spa: !formData.spa })}
                                className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 cursor-pointer ${
                                  formData.spa ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                                }`}
                              >
                                <div className="flex gap-3 items-center">
                                  <span className="text-xl">💆</span>
                                  <div>
                                    <span className="text-xs font-bold block text-white">Séance Massage & Spa Privatif (1 Heure)</span>
                                    <span className="text-[9px] text-stone-400 block mt-0.5">Soin Signature relaxant par nos masseurs certifiés face au jardin tropical.</span>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-[#CA8A04] font-mono ml-4">+25 000 FCFA</span>
                              </button>

                              {/* Champagne Option */}
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, champagne: !formData.champagne })}
                                className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 cursor-pointer ${
                                  formData.champagne ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                                }`}
                              >
                                <div className="flex gap-3 items-center">
                                  <span className="text-xl">🍾</span>
                                  <div>
                                    <span className="text-xs font-bold block text-white font-sans">Bouteille de Champagne VIP de Bienvenue</span>
                                    <span className="text-[9px] text-stone-400 block mt-0.5">Une bouteille de Laurent-Perrier Brut placée au frais dès votre arrivée.</span>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-[#CA8A04] font-mono ml-4">+40 000 FCFA</span>
                              </button>

                              {/* Gourmet Dinner Option */}
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, dinner: !formData.dinner })}
                                className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 cursor-pointer ${
                                  formData.dinner ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                                }`}
                              >
                                <div className="flex gap-3 items-center">
                                  <span className="text-xl">🍽️</span>
                                  <div>
                                    <span className="text-xs font-bold block text-white font-sans">Formule Dîner Gastronomique 3 Services</span>
                                    <span className="text-[9px] text-stone-400 block mt-0.5">Entrée, plat et dessert bio préparés à la commande par notre Chef.</span>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-[#CA8A04] font-mono ml-4">+30 000 FCFA <span className="text-[8px] text-stone-500">/pers/n.</span></span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* STEP 4: CLIENT DETAILS */}
                        {bookingStep === "checkout" && (
                          <div className="space-y-4 animate-slide-in text-left">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Nom Complet</label>
                              <input 
                                type="text" 
                                required 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#9B2C2C]" 
                                placeholder="Ex: Jean Dupont" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Adresse E-mail</label>
                              <input 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#9B2C2C]" 
                                placeholder="Ex: jean.dupont@gmail.com" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Numéro de Téléphone (avec code pays)</label>
                              <input 
                                type="tel" 
                                required 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#9B2C2C] font-mono" 
                                placeholder="Ex: +229 01 67 75 00 83" 
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#9B2C2C] to-[#C53030] hover:from-[#C53030] hover:to-[#E53E3E] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer mt-6 shadow-lg shadow-[#9B2C2C]/15"
                      >
                        {bookingStep === "checkout" ? "Procéder au Paiement Mobile Money" : "Valider & Continuer"}
                      </button>
                    </form>
                  )}

                  {/* STAGE 2: PAYEMENT PLATFORM SIMULATION (FEDAPAY MOCKUP) */}
                  {stage === "payment" && (
                    <form onSubmit={handlePaymentSubmit} className="space-y-6 flex-grow flex flex-col justify-between animate-slide-in text-left">
                      <div className="space-y-5">
                        <div className="text-center pb-3 border-b border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-[#CA8A04] font-extrabold block">FedaPay Mobile Money Gateway</span>
                          <span className="text-[8px] text-stone-400 block mt-1 font-mono">Paiement sécurisé crypté SSL (Bénin)</span>
                        </div>

                        <div className="p-4 bg-[#1C1917] border border-white/5 rounded-2xl space-y-3 text-xs font-mono">
                          <div className="flex justify-between items-center">
                            <span className="text-stone-500">Marchand hôtelier</span>
                            <span className="text-white font-bold font-sans">Maison Rouge Cotonou</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-white/5 pt-2.5">
                            <span className="text-stone-500">Acompte à régler</span>
                            <span className="font-bold text-[#CA8A04] text-sm">{formatFCFA(roomDeposit)}</span>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Sélectionnez votre opérateur local</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setMomoOperator("mtn")}
                              className={`py-3.5 rounded-xl text-[11px] font-bold uppercase border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                                momoOperator === "mtn" ? "bg-amber-500/10 border-amber-500 text-amber-300 font-extrabold" : "bg-white/5 border-white/5 text-stone-500"
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                              MTN MoMo
                            </button>
                            <button
                              type="button"
                              onClick={() => setMomoOperator("moov")}
                              className={`py-3.5 rounded-xl text-[11px] font-bold uppercase border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                                momoOperator === "moov" ? "bg-blue-500/10 border-blue-500 text-blue-300 font-extrabold" : "bg-white/5 border-white/5 text-stone-500"
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              Moov Flooz
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">Saisissez votre numéro de téléphone de facturation</label>
                          <div className="flex gap-2">
                            <span className="bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-stone-300 font-mono flex items-center">+229</span>
                            <input
                              type="tel"
                              required
                              pattern="[0-9]{8,10}"
                              value={momoNumber}
                              onChange={(e) => setMomoNumber(e.target.value)}
                              className="flex-grow bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-[#9B2C2C] text-white font-mono"
                              placeholder="Ex: 01 67 75 00 83"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-600/20 mt-6"
                      >
                        Payer l'acompte de {formatFCFA(roomDeposit)}
                      </button>
                    </form>
                  )}

                  {/* STAGE 3: PUSH USSD SEND WAITING STATE */}
                  {stage === "paying" && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 animate-pulse py-12">
                      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5">
                        <CreditCard size={36} />
                      </div>
                      <div className="space-y-3 max-w-sm">
                        <h4 className="text-lg font-bold text-white">Autorisation push envoyée !</h4>
                        <p className="text-stone-400 text-xs leading-relaxed">
                          Un message USSD automatique vient d'être envoyé sur votre mobile (+229 {momoNumber}). Saisissez votre code PIN secret {momoOperator.toUpperCase()} pour approuver le prélèvement de la garantie de <strong className="text-[#CA8A04]">{formatFCFA(roomDeposit)}</strong>.
                        </p>
                      </div>
                      <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mt-4" />
                    </div>
                  )}

                  {/* STAGE 4: WEBHOOK PROCESSING DISPATCH */}
                  {stage === "sent" && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-5 py-12">
                      <div className="w-14 h-14 border-3 border-[#CA8A04] border-t-transparent rounded-full animate-spin" />
                      <div className="space-y-1.5">
                        <h4 className="text-base font-bold text-white">Traitement de la transaction approuvée...</h4>
                        <p className="text-stone-500 text-[10px] font-mono leading-normal max-w-xs mx-auto">
                          WEBHOOK: Dispatching notifications to customer WhatsApp & receptionist PMS console
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STAGE 5: POST-PAYMENT SPLIT VIEW (CLIENT WHATSAPP OR RECEPTION PMS) */}
                  {stage === "reception" && (
                    <div className="flex-grow flex flex-col justify-between space-y-6">
                      
                      {/* Sub-navigation views */}
                      <div className="flex bg-[#1C1917] p-1 rounded-xl border border-white/5 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setSuccessView("client");
                            setPreRegisterStage("none");
                          }}
                          className={`flex-grow py-2.5 rounded-lg transition-all duration-300 cursor-pointer ${
                            successView === "client" ? "bg-[#9B2C2C] text-white" : "text-stone-400 hover:text-white"
                          }`}
                        >
                          📱 Messagerie Client (WhatsApp)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSuccessView("pms")}
                          className={`flex-grow py-2.5 rounded-lg transition-all duration-300 cursor-pointer ${
                            successView === "pms" ? "bg-[#9B2C2C] text-white" : "text-stone-400 hover:text-white"
                          }`}
                        >
                          💻 Console PMS Réception (Live API)
                        </button>
                      </div>

                      {/* CLIENT SIMULATION VIEW (WHATSAPP + OCR CHECKIN) */}
                      {successView === "client" && (
                        <div className="space-y-5 flex-grow flex flex-col justify-between">
                          
                          {preRegisterStage === "none" && (
                            <div className="space-y-4 flex-grow overflow-y-auto max-h-[350px]">
                              {/* WhatsApp mockup bubble */}
                              <div className="p-4 bg-[#0A5C4A] border border-emerald-500/10 rounded-2xl space-y-2 text-left shadow-2xl max-w-[90%] ml-auto relative">
                                <div className="absolute top-0 right-0 -mr-1.5 w-3 h-3 bg-[#0A5C4A] rotate-45" />
                                <div className="flex justify-between items-center text-[8px] text-emerald-300 font-bold">
                                  <span>Maison Rouge Cotonou (Officiel)</span>
                                  <span className="text-[7.5px] font-normal text-emerald-300/80">✓✓ Delivré</span>
                                </div>
                                <div className="space-y-2 text-white text-[10.5px]">
                                  <p className="leading-relaxed">
                                    Bonjour <strong>{formData.name}</strong>, votre acompte de garantie pour la <strong>{formData.roomType === "classique" ? "Chambre Classique" : formData.roomType === "superieure" ? "Chambre Supérieure" : "Suite Prestige"}</strong> a été validé avec succès !
                                  </p>
                                  <p className="leading-relaxed">
                                    💵 <strong>Reçu FedaPay MoMo :</strong> {formatFCFA(roomDeposit)}.
                                  </p>
                                  <p className="leading-relaxed text-stone-200">
                                    Pour accélérer votre accueil à la réception hôtelière de Cotonou, pré-enregistrez-vous en ligne d'un simple clic :
                                  </p>
                                </div>
                                <div className="text-right text-[7.5px] text-emerald-300/60 font-mono mt-1">À l'instant</div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setPreRegisterStage("start")}
                                className="w-full bg-[#CA8A04] hover:bg-[#CA8A04]/90 text-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer shadow-md shadow-[#CA8A04]/10"
                              >
                                <Sparkles size={13} />
                                Lancer mon Pré-enregistrement Express
                              </button>
                            </div>
                          )}

                          {preRegisterStage === "start" && (
                            <div className="space-y-4 text-left p-6 bg-[#1A1817] border border-white/5 rounded-2xl">
                              <h4 className="text-xs font-bold text-white font-mono">Scan du document d'identité</h4>
                              <p className="text-[10px] text-stone-400 leading-relaxed">
                                Placez votre passeport ou votre carte d'identité devant la caméra de votre smartphone pour extraire automatiquement les informations nécessaires (OCR IA).
                              </p>
                              <button
                                type="button"
                                onClick={() => setPreRegisterStage("camera")}
                                className="w-full py-6 border border-dashed border-white/20 rounded-xl hover:border-[#CA8A04] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.01] transition-all duration-300"
                              >
                                <span className="text-2xl">📷</span>
                                <span className="text-[10px] text-stone-200 font-bold">Activer la caméra pour numérisation</span>
                                <span className="text-[8px] text-stone-500">Scan sécurisé et traitement local crypté</span>
                              </button>
                            </div>
                          )}

                          {preRegisterStage === "camera" && (
                            <div className="space-y-4 relative overflow-hidden rounded-2xl border border-white/10 bg-black aspect-video flex items-center justify-center">
                              <style>{`
                                @keyframes laser-scan {
                                  0% { top: 0%; }
                                  50% { top: 100%; }
                                  100% { top: 0%; }
                                }
                              `}</style>
                              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-80" />
                              <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] z-20" style={{ animation: "laser-scan 2s infinite ease-in-out", position: 'absolute' }} />
                              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 rounded text-[8px] text-emerald-400 font-mono tracking-wider z-20">CAPTURE PASSEPORT</div>
                              
                              <div className="absolute inset-6 border border-white/20 pointer-events-none rounded z-10">
                                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#CA8A04]" />
                                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#CA8A04]" />
                                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#CA8A04]" />
                                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#CA8A04]" />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setPreRegisterStage("scanning");
                                  setTimeout(() => {
                                    setPreRegisterStage("done");
                                  }, 2000);
                                }}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#CA8A04] hover:bg-[#CA8A04]/90 text-black font-extrabold text-[10px] uppercase tracking-widest py-2 px-5 rounded-full shadow-2xl z-30 cursor-pointer transition-transform duration-300 hover:scale-105"
                              >
                                Déclencher la Capture
                              </button>
                            </div>
                          )}

                          {preRegisterStage === "scanning" && (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4 bg-[#1A1817] border border-white/5 rounded-2xl">
                              <div className="w-10 h-10 border-3 border-[#CA8A04] border-t-transparent rounded-full animate-spin" />
                              <p className="text-[10px] text-stone-400 font-mono">Lecture optique OCR et extraction des données d'identité...</p>
                            </div>
                          )}

                          {preRegisterStage === "done" && (
                            <div className="space-y-4 animate-slide-in text-left p-6 bg-[#1A1817] border border-white/5 rounded-2xl">
                              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3.5">
                                <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={24} />
                                <div>
                                  <span className="text-xs font-bold text-white block">Enregistrement Finalisé !</span>
                                  <span className="text-[9px] text-emerald-400 font-light block leading-none mt-1">Données transmises de manière sécurisée au PMS de la réception.</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-stone-400 leading-relaxed">
                                Merci, {formData.name} ! Votre pré-enregistrement est complet. À votre arrivée à la réception de la Maison Rouge, votre clé de chambre numérique ou physique vous sera remise instantanément.
                              </p>
                              <button
                                type="button"
                                onClick={() => setPreRegisterStage("none")}
                                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Retour à la messagerie WhatsApp
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PMS CONSOLE LIVE VIEW (HOTEL SIDE STATS & LOGS) */}
                      {successView === "pms" && (
                        <div className="space-y-4 flex-grow text-left animate-slide-in overflow-y-auto max-h-[380px] pr-1">
                          
                          {/* Live Occupancy Dashboard widgets */}
                          <div className="grid grid-cols-3 gap-3 text-center font-mono">
                            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
                              <span className="text-[8px] text-stone-500 uppercase block font-bold">Taux Occup.</span>
                              <span className="text-sm font-bold text-white block mt-1">78.5%</span>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
                              <span className="text-[8px] text-stone-500 uppercase block font-bold">Marge direct</span>
                              <span className="text-sm font-bold text-emerald-400 block mt-1">100%</span>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
                              <span className="text-[8px] text-stone-500 uppercase block font-bold">Revenu Acompte</span>
                              <span className="text-sm font-bold text-[#CA8A04] block mt-1">{roomDeposit > 1000 ? `${Math.round(roomDeposit/1000)}k` : "120k"} F</span>
                            </div>
                          </div>

                          {/* Room allocation grid grid */}
                          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2.5">
                            <div className="flex justify-between items-center text-[8.5px] font-bold text-stone-500 pb-1.5 border-b border-white/5 font-mono">
                              <span>GRID OCCUPATION CHAMBRES</span>
                              <span className="text-emerald-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE SYNC
                              </span>
                            </div>
                            <div className="space-y-1.5 font-mono text-[9px]">
                              {[
                                { room: "Chambre 101", cat: "Classique", status: "Occupée", guest: "K. GOMEZ (Booking)", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                                { room: "Chambre 102", cat: "Supérieure", status: "Propre / Libre", guest: "Aucun", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                                { room: "Chambre 104", cat: "Classique", status: "Réservée (Direct MoMo)", guest: formData.name, cls: "bg-[#CA8A04]/10 text-[#CA8A04] border-[#CA8A04]/20 animate-pulse font-bold" },
                                { room: "Suite Royale 201", cat: "Prestige", status: formData.roomType === "prestige" ? "Réservée (Direct MoMo)" : "Propre / Libre", guest: formData.roomType === "prestige" ? formData.name : "Aucun", cls: formData.roomType === "prestige" ? "bg-[#CA8A04]/10 text-[#CA8A04] border-[#CA8A04]/20 animate-pulse font-bold" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                                { room: "Suite Royale 202", cat: "Prestige", status: "Départ ce midi", guest: "A. KOFFI", cls: "bg-stone-800 text-stone-400 border-stone-700" }
                              ].map((rm, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/[0.01] border border-white/5">
                                  <span>{rm.room} <span className="text-[8px] text-stone-500 font-light">({rm.cat})</span></span>
                                  <span className={`px-2 py-0.5 rounded border text-[8px] ${rm.cls}`}>{rm.status} : {rm.guest}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* LIVE EVENT LOGS */}
                          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2.5">
                            <div className="text-[9px] font-bold text-stone-400 pb-1.5 border-b border-white/5 flex items-center gap-2 font-mono">
                              <Cpu size={12} className="text-[#CA8A04]" /> LOGS LIVE DES AUTOMATES HÔTEL
                            </div>
                            <div className="font-mono text-[9px] text-[#A8A29E] space-y-2 max-h-[110px] overflow-y-auto pr-1">
                              {logs.length === 0 ? (
                                <div className="text-stone-600 italic">En attente d'événements API...</div>
                              ) : (
                                logs.map((log, idx) => (
                                  <div key={idx} className="leading-relaxed border-l-2 border-emerald-500/30 pl-2.5 py-0.5 animate-slide-in">
                                    {log}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* WEBHOOK PAYLOAD VIEWER */}
                          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-2.5">
                            <div className="flex justify-between items-center text-[9px] font-bold text-stone-400 font-mono">
                              <span className="flex items-center gap-2"><Code2 size={12} className="text-[#CA8A04]" /> PAYLOAD DU WEBHOOK FEDAPAY</span>
                              <button
                                type="button"
                                onClick={() => setShowPayload(!showPayload)}
                                className="text-[#CA8A04] hover:text-white px-2.5 py-0.5 rounded border border-[#CA8A04]/20 text-[8px] font-bold uppercase transition-colors cursor-pointer"
                              >
                                {showPayload ? "Masquer JSON" : "Inspecter JSON"}
                              </button>
                            </div>

                            {showPayload && (
                              <div className="font-mono text-[8px] text-[#A8A29E] bg-black p-3 rounded-xl border border-white/5 overflow-x-auto max-h-[130px] leading-normal animate-slide-in">
                                <pre>{JSON.stringify({
                                  event: "transaction.approved",
                                  entity: "transaction",
                                  id: `tx_fedapay_${Math.random().toString(36).substr(2, 9)}`,
                                  amount: roomDeposit,
                                  currency: "XOF",
                                  status: "approved",
                                  created_at: new Date().toISOString(),
                                  callback_url: "https://maisonrouge-pms.bj/api/webhooks/fedapay",
                                  customer: {
                                    firstname: formData.name ? formData.name.split(" ")[0] : "Jean",
                                    lastname: formData.name ? formData.name.split(" ").slice(1).join(" ") || "Dupont" : "Dupont",
                                    phone: `+229${momoNumber}`,
                                    email: formData.email
                                  },
                                  metadata: {
                                    room_type: formData.roomType,
                                    guests: formData.guests,
                                    nights: nights,
                                    upsell_spa: formData.spa,
                                    upsell_champagne: formData.champagne,
                                    upsell_dinner: formData.dinner
                                  }
                                }, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={resetSandbox}
                        className="w-full border border-white/10 hover:border-white/20 text-stone-400 hover:text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer hover:bg-white/[0.01]"
                      >
                        Simuler une nouvelle transaction client
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
