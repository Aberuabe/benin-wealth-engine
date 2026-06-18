"use client";

import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
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
  ListChecks, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Code2
} from "lucide-react";

// ANIMATION CONSTANTS
const fadeIn: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function MaisonRougeDemo() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // PAGE NAVIGATION STATES
  const [activeTab, setActiveTab] = useState("accueil");

  // BOOKING WIZARD STATES
  const [bookingStep, setBookingStep] = useState<"dates" | "rooms" | "extras" | "checkout">("dates");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 2,
    roomType: "classique", // "classique" | "superieure" | "prestige"
    ratePlan: "refundable", // "refundable" | "non_refundable"
    
    // Add-on Options (Upsells)
    shuttle: true,      // Included/Free
    breakfast: true,    // Included/Free
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
    let base = 119000; // Chambre Classique
    if (formData.roomType === "superieure") base = 146000; // Chambre Supérieure
    if (formData.roomType === "prestige") base = 190000; // Suite Prestige
    if (formData.ratePlan === "non_refundable") base = base * 0.9; // -10% discount
    return Math.round(base);
  };

  const roomPricePerNight = getRoomPricePerNight();
  const roomSubtotal = roomPricePerNight * nights;

  // Add-on Cost Calculations
  const spaCost = formData.spa ? 25000 : 0;
  const champagneCost = formData.champagne ? 40000 : 0;
  const dinnerCost = formData.dinner ? 30000 * formData.guests * nights : 0;
  const extrasSubtotal = spaCost + champagneCost + dinnerCost;

  // Hotel booking taxes (Maison Rouge standard)
  const touristTax = 2500 * nights * formData.guests; // 2500 FCFA per person per night
  const taxBase = roomSubtotal + extrasSubtotal;
  const vatAmount = Math.round(taxBase * 0.18); // TVA 18%
  const grandTotal = taxBase + touristTax + vatAmount;

  // Guaranteed Booking Deposit (First night + VAT of first night)
  const roomDeposit = Math.round(roomPricePerNight * 1.18) + (formData.champagne ? 40000 : 0);

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
      email: "",
      phone: "",
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
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
        `GATEWAY: Paiement acompte de ${formatFCFA(roomDeposit)} via ${momoOperator.toUpperCase()} MoMo validé`,
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

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#F5F5F4] font-sans selection:bg-[#7F1D1D] selection:text-white relative overflow-x-hidden">
      
      {/* BACKGROUND GRAPHIC OVERLAYS */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#7F1D1D]/10 to-transparent pointer-events-none z-0" />
      <div className="noise-overlay" />

      {/* HEADER NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0C0A09]/75 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#7F1D1D] border border-[#CA8A04]/40 rounded-full flex items-center justify-center shadow-lg">
              <span className="font-serif font-bold text-[#CA8A04] text-sm">MR</span>
            </div>
            <div>
              <span className="font-serif font-semibold tracking-[0.15em] text-sm uppercase text-white block">Maison Rouge</span>
              <span className="text-[8px] text-[#CA8A04] uppercase tracking-[0.2em] font-semibold block leading-none">Cotonou • Bénin</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.1em] text-stone-400">
            <button onClick={() => setActiveTab("accueil")} className={`hover:text-white transition-colors cursor-pointer ${activeTab === "accueil" ? "text-white border-b-2 border-[#7F1D1D] pb-1" : ""}`}>Accueil</button>
            <button onClick={() => setActiveTab("chambres")} className={`hover:text-white transition-colors cursor-pointer ${activeTab === "chambres" ? "text-white border-b-2 border-[#7F1D1D] pb-1" : ""}`}>Chambres & Suites</button>
            <button onClick={() => setActiveTab("restaurant")} className={`hover:text-white transition-colors cursor-pointer ${activeTab === "restaurant" ? "text-white border-b-2 border-[#7F1D1D] pb-1" : ""}`}>Restaurant Bio</button>
            <button onClick={() => setActiveTab("art")} className={`hover:text-white transition-colors cursor-pointer ${activeTab === "art" ? "text-white border-b-2 border-[#7F1D1D] pb-1" : ""}`}>Art contemporain</button>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-[#7F1D1D] hover:bg-[#991B1B] text-[#F5F5F4] border border-[#CA8A04]/30 hover:border-[#CA8A04]/60 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md shadow-[#7F1D1D]/10"
          >
            Réserver mon Séjour
          </button>
        </div>
      </nav>

      {/* SALES PROPOSAL BANNER (FOR THE HOTEL MANAGER - SHOWING ABEL'S COGNITIVE DEPTH) */}
      <div className="relative z-10 pt-24 bg-gradient-to-r from-[#CA8A04]/20 via-[#7F1D1D]/20 to-[#CA8A04]/10 border-b border-[#CA8A04]/15 px-6 py-3.5 text-center text-[10px] sm:text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="bg-[#CA8A04] text-black font-extrabold px-2 py-0.5 rounded text-[8px] uppercase tracking-wider">PROTOTYPE TRANSACTIONNEL DIRECT</span>
          <p className="text-stone-300 font-medium">
            Maison Rouge perd actuellement <strong>18% à 25%</strong> de commissions via Booking.com. Ce prototype Next.js montre votre futur moteur de réservation directe avec paiement Mobile Money local et Express Check-in.
          </p>
        </div>
      </div>

      {activeTab === "accueil" && (
        <>
          {/* HERO SECTION */}
          <section className="relative min-h-[90vh] flex items-center justify-center pt-12 overflow-hidden px-6">
            <div className="absolute inset-0 bg-[url('https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/01/hotel-maison-rouge-cotonou-benin48.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[#0C0A09]/80 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
              <motion.div {...fadeIn}>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#CA8A04] font-bold block mb-4">Hôtel d'art 4 étoiles face à la mer</span>
                <h1 className="text-4xl md:text-7xl font-serif font-light leading-[1.05] tracking-tight">
                  L'élégance d'une maison d'hôtes,<br />
                  <span className="text-[#CA8A04] font-normal italic">l'excellence d'un hôtel de luxe.</span>
                </h1>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="max-w-2xl mx-auto text-stone-400 text-sm sm:text-base font-light leading-relaxed"
              >
                Située sur le boulevard de la Marina de Cotonou, la Maison Rouge est un havre atypique où se mêlent végétation luxuriante, art contemporain africain, piscines rafraîchissantes et une table gastronomique biologique de premier ordre.
              </motion.p>

              {/* QUICK BOOKING WIDGET */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-4xl mx-auto bg-stone-900/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-stretch justify-between gap-4"
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1.5"><Calendar size={11} /> Arrivée</label>
                    <input type="date" value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7F1D1D] text-white font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1.5"><Calendar size={11} /> Départ</label>
                    <input type="date" value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7F1D1D] text-white font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1.5"><Users size={11} /> Voyageurs</label>
                    <select value={formData.guests} onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})} className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7F1D1D] text-white">
                      {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n>1 ? "voyageurs" : "voyageur"}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 font-bold flex items-center gap-1.5"><Bed size={11} /> Catégorie</label>
                    <select value={formData.roomType} onChange={(e) => setFormData({...formData, roomType: e.target.value})} className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7F1D1D] text-white">
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
                  className="bg-[#7F1D1D] hover:bg-[#991B1B] text-white px-8 py-3 md:py-0 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#7F1D1D]/15"
                >
                  Vérifier Disponibilité
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            </div>
          </section>

          {/* CONCEPT & ART SECTION */}
          <section className="py-24 px-6 border-t border-white/5 bg-[#0A0908]">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeIn} className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Un hôtel galerie d'art unique</span>
                <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight">Vivre au milieu des œuvres d'art contemporain</h2>
                <p className="text-stone-400 text-sm font-light leading-relaxed">
                  L'Hôtel Maison Rouge Cotonou n'est pas seulement un lieu de repos, c'est un oasis d'exposition vivant. Nos couloirs, nos chambres et nos salons accueillent des peintures et sculptures d'artistes d'Afrique de l'Ouest.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4 text-xs font-bold font-mono text-[#CA8A04]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span> Expositions tournantes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌿</span> Jardin tropical
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏊</span> Deux piscines extérieures
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✈️</span> Navette aéroport incluse
                  </div>
                </div>
              </motion.div>
              
              <motion.div {...fadeIn} className="relative aspect-square bg-gradient-to-br from-[#7F1D1D] to-[#CA8A04] p-1 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/01/hotel-maison-rouge-cotonou-benin48.jpg')] bg-cover bg-center rounded-3xl" />
              </motion.div>
            </div>
          </section>
        </>
      )}

      {activeTab === "chambres" && (
        <section className="py-24 px-6 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Hébergements de Prestige</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light">Nos Chambres et Suites</h2>
            <p className="text-stone-400 text-sm font-light max-w-xl mx-auto">Chacune de nos chambres offre un aménagement unique avec du mobilier sur-mesure et une sélection d'œuvres d'art originales.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: "classique", name: "Chambre Classique", price: 119000, desc: "24m² de confort et de design africain épuré.", img: "hotel-maison-rouge-cotonou-benin48.jpg" },
              { id: "superieure", name: "Chambre Supérieure", price: 146000, desc: "32m² avec balcon privé donnant sur les jardins exotiques.", img: "hotel-maison-rouge-cotonou-benin48.jpg" },
              { id: "prestige", name: "Suite Prestige", price: 190000, desc: "55m² avec salon indépendant, terrasse face piscine et vue mer.", img: "hotel-maison-rouge-cotonou-benin48.jpg" }
            ].map(room => (
              <div key={room.id} className="bg-stone-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-xl">
                <div className="aspect-[4/3] bg-stone-950 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#7F1D1D]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <div className="absolute inset-0 bg-[url('https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/01/hotel-maison-rouge-cotonou-benin48.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#CA8A04] transition-colors">{room.name}</h3>
                      <span className="font-mono text-xs font-bold text-[#CA8A04]">{formatFCFA(room.price)}<span className="text-[9px] text-stone-500 font-light block text-right">/ nuit</span></span>
                    </div>
                    <p className="text-xs text-stone-400 font-light leading-relaxed">{room.desc}</p>
                  </div>
                  <div className="border-t border-white/5 pt-4 space-y-2 text-[10px] text-stone-400 font-mono">
                    <div className="flex items-center gap-2">✓ Petit-déjeuner buffet inclus</div>
                    <div className="flex items-center gap-2">✓ Navette aéroport A/R incluse</div>
                    <div className="flex items-center gap-2">✓ Wi-Fi Fibre à haut débit</div>
                  </div>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, roomType: room.id });
                      setBookingStep("extras");
                      setIsBookingOpen(true);
                    }}
                    className="w-full bg-[#7F1D1D] hover:bg-[#991B1B] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "restaurant" && (
        <section className="py-24 px-6 max-w-6xl mx-auto space-y-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square bg-[#7F1D1D]/20 rounded-3xl overflow-hidden p-1">
              <div className="absolute inset-0 bg-[url('https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/01/hotel-maison-rouge-cotonou-benin48.jpg')] bg-cover bg-center rounded-3xl" />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Notre Table</span>
              <h2 className="text-3xl md:text-5xl font-serif font-light leading-tight">Une Gastronomie Bio et Raisonnée</h2>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Le restaurant de la Maison Rouge privilégie une alimentation saine et inventive. Notre Chef s'approvisionne quotidiennement auprès de fermes biologiques et de coopératives locales de pêcheurs pour proposer des plats métissés mêlant savoir-faire béninois et gastronomie française.
              </p>
              <div className="border-t border-white/5 pt-6 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Ouverture :</span>
                  <span className="text-white">Tous les jours de 07h00 à 23h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Cadre :</span>
                  <span className="text-white">Terrasse vue mer, Salle Climatisée, Jardin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Approvisionnement :</span>
                  <span className="text-[#CA8A04] font-bold">100% Bio & Local</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "art" && (
        <section className="py-24 px-6 max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#CA8A04] font-bold block">Expositions d'art contemporain</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light">Une collection vivante d'art africain</h2>
            <p className="text-stone-400 text-sm font-light max-w-xl mx-auto">Chaque recoin de l'hôtel est une fenêtre ouverte sur la création plastique du continent.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="aspect-square bg-stone-900 border border-white/5 rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-[#7F1D1D]/20 group-hover:bg-transparent transition-colors z-10" />
                <div className="absolute inset-0 bg-[url('https://hotel-benin-maison-rouge-cotonou.com/wp-content/uploads/2023/01/hotel-maison-rouge-cotonou-benin48.jpg')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/15 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] uppercase tracking-wider text-[#CA8A04] block font-bold">Peinture Contemporaine</span>
                  <span className="text-[10px] text-white block font-semibold">Exposition courante</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080706] py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm text-stone-400">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#7F1D1D] rounded-full flex items-center justify-center">
                <span className="serif font-bold text-[#CA8A04] text-xs">MR</span>
              </div>
              <span className="font-serif font-semibold tracking-wider text-sm uppercase text-white">Maison Rouge</span>
            </div>
            <p className="text-xs font-light leading-relaxed">Un hôtel d'art atypique et haut de gamme à Cotonou, engagé dans la promotion de l'art local et une restauration biologique de terroir.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Contact</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2"><Phone size={13} /> +229 01 65 12 69 89</p>
              <p className="flex items-center gap-2"><Mail size={13} /> contact@maison-rouge-cotonou.com</p>
              <p className="flex items-center gap-2"><MapPin size={13} /> Boulevard de la Marina, Cotonou</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Menu</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => setActiveTab("accueil")} className="text-left hover:text-white transition-colors cursor-pointer">Accueil</button>
              <button onClick={() => setActiveTab("chambres")} className="text-left hover:text-white transition-colors cursor-pointer">Chambres</button>
              <button onClick={() => setActiveTab("restaurant")} className="text-left hover:text-white transition-colors cursor-pointer">Restaurant</button>
              <button onClick={() => setActiveTab("art")} className="text-left hover:text-white transition-colors cursor-pointer">Art</button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Hôtel Partenaire</h4>
            <p className="text-xs font-light">Simulation réalisée par **Abel Dotonou** pour valider la transition vers la réservation directe et le pré-check-in automatisé.</p>
          </div>
        </div>
        <div className="text-center text-[10px] text-stone-600 mt-16 pt-8 border-t border-white/5">
          &copy; {new Date().getFullYear()} Hôtel Maison Rouge Cotonou - Tous droits réservés.
        </div>
      </footer>

      {/* ======================================================== */}
      {/* FULL SCREEN BOOKING MODAL WIZARD */}
      {/* ======================================================== */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-4xl bg-stone-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            
            {/* LEFT SIDE PANEL - INVOICE BREAKDOWN */}
            <div className="w-full md:w-[350px] bg-[#0E0B0A] p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-[#CA8A04] font-bold block">Moteur Direct Maison Rouge</span>
                  <h3 className="text-xl font-serif text-white mt-1">Détails de la Facture</h3>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  {/* Selected dates & nights */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <span className="text-[8px] uppercase text-stone-500 font-sans block">Séjour ({nights} {nights > 1 ? "nuits" : "nuit"})</span>
                    <div className="text-white text-[10px] flex justify-between">
                      <span>Du : {formData.checkIn}</span>
                      <span>Au : {formData.checkOut}</span>
                    </div>
                    <div className="text-[#CA8A04] text-[10px] font-bold mt-1">
                      {formData.roomType === "classique" ? "Chambre Classique" : formData.roomType === "superieure" ? "Chambre Supérieure" : "Suite Prestige"}
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between text-stone-400">
                      <span>Tarif Chambre ({nights} n.)</span>
                      <span className="text-white">{formatFCFA(roomSubtotal)}</span>
                    </div>

                    {/* Extras */}
                    {extrasSubtotal > 0 && (
                      <div className="border-t border-white/5 pt-2 space-y-1">
                        <span className="text-[8px] text-stone-500 font-sans block">Prestations VIP :</span>
                        {formData.spa && (
                          <div className="flex justify-between text-stone-300">
                            <span>• Massage & Spa</span>
                            <span>{formatFCFA(25000)}</span>
                          </div>
                        )}
                        {formData.champagne && (
                          <div className="flex justify-between text-stone-300">
                            <span>• Champagne VIP</span>
                            <span>{formatFCFA(40000)}</span>
                          </div>
                        )}
                        {formData.dinner && (
                          <div className="flex justify-between text-stone-300">
                            <span>• Dîner gastronomique</span>
                            <span>{formatFCFA(dinnerCost)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Taxes */}
                    <div className="border-t border-white/5 pt-2 space-y-1">
                      <div className="flex justify-between text-stone-400">
                        <span>Taxe de séjour touristique</span>
                        <span>{formatFCFA(touristTax)}</span>
                      </div>
                      <div className="flex justify-between text-stone-400">
                        <span>TVA (18%)</span>
                        <span>{formatFCFA(vatAmount)}</span>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="border-t border-white/10 pt-3 flex justify-between text-xs font-bold">
                      <span className="text-white">Total à régler</span>
                      <span className="text-white font-mono">{formatFCFA(grandTotal)}</span>
                    </div>

                    {/* Guarantee Deposit */}
                    <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl flex justify-between items-center text-[10px] font-sans mt-3">
                      <div>
                        <span className="font-bold text-emerald-400 block">Acompte de Garantie</span>
                        <span className="text-[7px] text-stone-400 block mt-0.5">Requis pour bloquer la chambre</span>
                      </div>
                      <span className="font-bold font-mono text-emerald-400 text-xs">{formatFCFA(roomDeposit)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-[9px] text-stone-500 text-center leading-relaxed">
                Services de navette aéroport et petit-déjeuner inclus par défaut sur tous nos tarifs.
              </div>
            </div>

            {/* RIGHT SIDE PANEL - CLIENT INTERACTIVE PHONE SIMULATOR */}
            <div className="flex-grow bg-[#131110] relative flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-[90vh]">
              
              {/* Top Bar Navigation */}
              <div className="flex justify-between items-center px-6 py-4 bg-black/30 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                  {stage === "reception" ? "Console PMS Hôtelier" : "Moteur de Réservation"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingOpen(false);
                    resetSandbox();
                  }}
                  className="text-stone-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Fermer ✕
                </button>
              </div>

              {/* SIMULATOR CORE CONTAINER */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                
                {/* STAGE 1: THE BOOKING WIZARD FORM */}
                {stage === "form" && (
                  <form onSubmit={bookingStep === "checkout" ? handleClientFormSubmit : handleSimulateSubmit} className="space-y-5 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Step Indicator Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
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
                          <span className="text-[9px] uppercase tracking-widest text-[#CA8A04] font-bold">
                            Étape {bookingStep === "dates" ? "1 : Dates" : bookingStep === "rooms" ? "2 : Hébergement" : bookingStep === "extras" ? "3 : Services VIP" : "4 : Vos Coordonnées"}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {["dates", "rooms", "extras", "checkout"].map((s, idx) => {
                            const steps = ["dates", "rooms", "extras", "checkout"];
                            const currentIdx = steps.indexOf(bookingStep);
                            return (
                              <div 
                                key={s} 
                                className={`w-2 h-2 rounded-full transition-all ${
                                  idx === currentIdx ? "bg-[#CA8A04] scale-125" : idx < currentIdx ? "bg-emerald-500" : "bg-white/10"
                                }`} 
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* STEP 1: DATES & GUESTS */}
                      {bookingStep === "dates" && (
                        <div className="space-y-4 animate-fade-in text-left">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Arrivée</label>
                              <input type="date" required value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7F1D1D] text-white font-mono" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Départ</label>
                              <input type="date" required value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7F1D1D] text-white font-mono" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Nombre de Voyageurs</label>
                            <select value={formData.guests} onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})} className="w-full bg-[#0C0A09] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white">
                              {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n > 1 ? "Personnes" : "Personne"}</option>)}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* STEP 2: ROOM SELECTION */}
                      {bookingStep === "rooms" && (
                        <div className="space-y-3 animate-fade-in text-left">
                          <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Choisissez votre Chambre / Suite</label>
                          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                            {[
                              { id: "classique", name: "Chambre Classique", price: 119000, desc: "24m², lit Queen, petit-déjeuner et navette inclus", icon: "🛌" },
                              { id: "superieure", name: "Chambre Supérieure", price: 146000, desc: "32m², balcon vue jardin, petit-déjeuner et navette inclus", icon: "🌴" },
                              { id: "prestige", name: "Suite Prestige", price: 190000, desc: "55m², terrasse vue mer, petit-déjeuner et navette inclus", icon: "🌊" }
                            ].map(r => {
                              const isSelected = formData.roomType === r.id;
                              return (
                                <button
                                  type="button"
                                  key={r.id}
                                  onClick={() => setFormData({ ...formData, roomType: r.id })}
                                  className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                    isSelected 
                                      ? "border-[#CA8A04] bg-[#CA8A04]/5 shadow-[0_0_12px_rgba(202,138,4,0.08)]"
                                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                  }`}
                                >
                                  <div className="flex gap-3 items-center">
                                    <span className="text-xl">{r.icon}</span>
                                    <div>
                                      <span className={`text-[10px] font-bold block ${isSelected ? "text-[#CA8A04]" : "text-white"}`}>{r.name}</span>
                                      <span className="text-[8px] text-stone-400 block mt-0.5 font-light">{r.desc}</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-[#CA8A04] font-mono ml-2">{r.price / 1000}k /nuit</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="space-y-2 mt-2">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Tarification</label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ratePlan: "refundable" })}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  formData.ratePlan === "refundable" ? "border-white/20 bg-white/5" : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                                }`}
                              >
                                <span className="text-[9px] font-bold block text-white">Tarif Flexible</span>
                                <span className="text-[7px] text-emerald-400 block mt-0.5">Annulation gratuite</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, ratePlan: "non_refundable" })}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  formData.ratePlan === "non_refundable" ? "border-[#CA8A04] bg-[#CA8A04]/5" : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                                }`}
                              >
                                <span className="text-[9px] font-bold block text-[#CA8A04]">Tarif Non-Remboursable</span>
                                <span className="text-[7px] text-stone-300 block mt-0.5">Économisez -10% direct</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: EXTRAS / UPSELLS */}
                      {bookingStep === "extras" && (
                        <div className="space-y-3 animate-fade-in text-left">
                          <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Ajoutez des prestations VIP (Surclassement)</label>
                          <div className="space-y-2">
                            {/* Spa Option */}
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, spa: !formData.spa })}
                              className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                formData.spa ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-bold block text-white">💆 Séance Massage & Spa Privatif</span>
                                <span className="text-[8px] text-stone-400 block mt-0.5">Massage relaxant 1h vue sur les jardins</span>
                              </div>
                              <span className="text-[10px] font-bold text-[#CA8A04] font-mono ml-2">+25 000 F</span>
                            </button>

                            {/* Champagne Option */}
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, champagne: !formData.champagne })}
                              className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                formData.champagne ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-bold block text-white">🍾 Champagne VIP de Bienvenue</span>
                                <span className="text-[8px] text-stone-400 block mt-0.5">Une bouteille de Champagne de marque placée au frais</span>
                              </div>
                              <span className="text-[10px] font-bold text-[#CA8A04] font-mono ml-2">+40 000 F</span>
                            </button>

                            {/* Gourmet Dinner Option */}
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, dinner: !formData.dinner })}
                              className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                formData.dinner ? "border-emerald-500/50 bg-emerald-500/[0.02]" : "border-white/5 bg-white/[0.02]"
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-bold block text-white">🍽️ Dîner Gastronomique (Menu Découverte)</span>
                                <span className="text-[8px] text-stone-400 block mt-0.5">Menu 3 services bio par notre Chef en terrasse</span>
                              </div>
                              <span className="text-[10px] font-bold text-[#CA8A04] font-mono ml-2">+30k F/pers/n.</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STEP 4: CLIENT DETAILS FORM */}
                      {bookingStep === "checkout" && (
                        <div className="space-y-4 animate-fade-in text-left">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Nom Complet</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#7F1D1D]" placeholder="Ex: Jean Dupont" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Email</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#7F1D1D]" placeholder="Ex: jeandupont@gmail.com" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Téléphone (avec indicatif)</label>
                            <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#7F1D1D] font-mono" placeholder="Ex: +229 01 67 75 00 83" />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#7F1D1D] hover:bg-[#991B1B] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer mt-6 shadow-lg shadow-[#7F1D1D]/15"
                    >
                      {bookingStep === "checkout" ? "Procéder au Paiement" : "Continuer"}
                    </button>
                  </form>
                )}

                {/* STAGE 2: PAYEMENT PLATFORM SIMULATION */}
                {stage === "payment" && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4 flex-grow flex flex-col justify-between animate-fade-in text-left">
                    <div className="space-y-4">
                      <div className="text-center pb-2 border-b border-white/5">
                        <span className="text-[9px] uppercase tracking-widest text-[#CA8A04] font-bold block">Passerelle de Paiement Sécurisé (FedaPay)</span>
                      </div>

                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-400">Marchand</span>
                          <span className="font-bold text-white">Hôtel Maison Rouge Cotonou</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-2 font-mono">
                          <span className="text-stone-400">Garantie d'acompte requise</span>
                          <span className="font-bold text-[#CA8A04]">{formatFCFA(roomDeposit)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Mode de Paiement local</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setMomoOperator("mtn")}
                            className={`py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                              momoOperator === "mtn" ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-white/5 border-white/10 text-stone-400"
                            }`}
                          >
                            MTN MoMo
                          </button>
                          <button
                            type="button"
                            onClick={() => setMomoOperator("moov")}
                            className={`py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                              momoOperator === "moov" ? "bg-blue-500/20 border-blue-500 text-blue-300" : "bg-white/5 border-white/10 text-stone-400"
                            }`}
                          >
                            Moov Flooz
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Numéro de Mobile Money</label>
                        <div className="flex gap-2">
                          <span className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-xs text-stone-300 font-mono flex items-center">+229</span>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{8,10}"
                            value={momoNumber}
                            onChange={(e) => setMomoNumber(e.target.value)}
                            className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#7F1D1D] text-white font-mono"
                            placeholder="Ex: 01 67 75 00 83"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-emerald-600/20 mt-6"
                    >
                      Payer l'acompte ({formatFCFA(roomDeposit)})
                    </button>
                  </form>
                )}

                {/* STAGE 3: MOMO PUSH WAITING STATE */}
                {stage === "paying" && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 animate-fade-in py-12">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse text-emerald-400">
                      <CreditCard size={28} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white">Demande USSD envoyée !</h4>
                      <p className="text-stone-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                        Saisissez le code PIN secret de votre compte {momoOperator.toUpperCase()} Mobile Money sur votre mobile (+229 {momoNumber}) pour autoriser le prélèvement de l'acompte de <strong className="text-[#CA8A04]">{formatFCFA(roomDeposit)}</strong>.
                      </p>
                    </div>
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mt-4" />
                  </div>
                )}

                {/* STAGE 4: WEBHOOK PROCESSING STATE */}
                {stage === "sent" && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 animate-fade-in py-12">
                    <div className="w-12 h-12 border-2 border-[#CA8A04] border-t-transparent rounded-full animate-spin" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Traitement du paiement en cours...</h4>
                      <p className="text-stone-500 text-[9px] mt-1 font-mono">
                        WEBHOOK: Dispatching details to Telegram, WhatsApp & Receptionist PMS
                      </p>
                    </div>
                  </div>
                )}

                {/* STAGE 5: RECEPTION / DASHBOARD & WHATSAPP Express portal */}
                {stage === "reception" && (
                  <div className="flex-grow flex flex-col justify-between space-y-4 animate-fade-in">
                    
                    {/* View Switcher Tab */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-[9px] font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setSuccessView("client");
                          setPreRegisterStage("none");
                        }}
                        className={`flex-grow py-2 rounded-lg transition-all cursor-pointer ${
                          successView === "client" ? "bg-[#7F1D1D] text-white" : "text-stone-400 hover:text-white"
                        }`}
                      >
                        📱 Vue Client (WhatsApp)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuccessView("pms")}
                        className={`flex-grow py-2 rounded-lg transition-all cursor-pointer ${
                          successView === "pms" ? "bg-[#7F1D1D] text-white" : "text-stone-400 hover:text-white"
                        }`}
                      >
                        💻 Vue PMS Réception (Console Live)
                      </button>
                    </div>

                    {/* VUE 1: CLIENT EXPRESS WHATSAPP CHECK-IN */}
                    {successView === "client" && (
                      <div className="space-y-4 flex-grow flex flex-col justify-between">
                        
                        {preRegisterStage === "none" && (
                          <div className="space-y-3 flex-grow overflow-y-auto max-h-[350px]">
                            {/* WhatsApp bubble mockup */}
                            <div className="p-4 bg-[#005c4b] border border-emerald-500/20 rounded-2xl space-y-2 text-left shadow-lg max-w-[95%] ml-auto relative">
                              <div className="absolute top-0 right-0 -mr-1.5 w-3 h-3 bg-[#005c4b] rotate-45 border-r border-t border-emerald-500/20" />
                              <div className="flex justify-between items-center text-[8px] text-emerald-300 font-bold">
                                <span>Maison Rouge Cotonou (Officiel)</span>
                                <span className="text-[7px] font-normal text-emerald-400">✓✓</span>
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-[10px] text-white leading-relaxed">
                                  Bonjour <strong>{formData.name || "Client VIP"}</strong>, votre réservation pour la <strong>{formData.roomType === "classique" ? "Chambre Classique" : formData.roomType === "superieure" ? "Chambre Supérieure" : "Suite Prestige"}</strong> est validée.
                                  💵 <strong>Acompte garanti reçu :</strong> {formatFCFA(roomDeposit)} via {momoOperator.toUpperCase()} MoMo.
                                </p>
                                <p className="text-[9px] text-stone-200">
                                  Pour un passage éclair à la réception à votre arrivée, effectuez votre pré-enregistrement express en ligne :
                                </p>
                              </div>
                              <div className="text-right text-[7px] text-emerald-400/80 font-mono">A l'instant</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setPreRegisterStage("start")}
                              className="w-full bg-[#CA8A04] hover:bg-[#CA8A04]/90 text-black py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                            >
                              <Sparkles size={12} />
                              Effectuer mon Pré-enregistrement Express
                            </button>
                          </div>
                        )}

                        {preRegisterStage === "start" && (
                          <div className="space-y-3 text-left p-4 bg-stone-900 border border-white/10 rounded-2xl">
                            <h4 className="text-xs font-bold text-white">Scanner votre document d'identité</h4>
                            <p className="text-[9px] text-stone-400 leading-relaxed">
                              Veuillez positionner la page principale de votre passeport ou de votre carte d'identité devant la caméra de votre mobile pour extraction OCR automatique.
                            </p>
                            <button
                              type="button"
                              onClick={() => setPreRegisterStage("camera")}
                              className="w-full py-4 border border-dashed border-white/20 rounded-xl hover:border-[#CA8A04] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/[0.01]"
                            >
                              <span className="text-xl">📷</span>
                              <span className="text-[10px] text-stone-200 font-bold">Lancer ma Caméra</span>
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
                            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20 animate-pulse" style={{ animation: "laser-scan 2.5s infinite ease-in-out", position: 'absolute' }} />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[7px] text-emerald-400 font-mono tracking-wider z-20">CAMÉRA EN DIRECT</div>
                            
                            <div className="absolute inset-4 border border-white/20 pointer-events-none rounded z-10">
                              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#CA8A04]" />
                              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#CA8A04]" />
                              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#CA8A04]" />
                              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#CA8A04]" />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setPreRegisterStage("scanning");
                                setTimeout(() => {
                                  setPreRegisterStage("done");
                                }, 2000);
                              }}
                              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#CA8A04] text-black font-bold text-[9px] uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg z-30 cursor-pointer"
                            >
                              Prendre la Photo
                            </button>
                          </div>
                        )}

                        {preRegisterStage === "scanning" && (
                          <div className="flex flex-col items-center justify-center py-6 space-y-3 bg-stone-900 border border-white/5 rounded-2xl">
                            <div className="w-8 h-8 border-2 border-[#CA8A04] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[9px] text-stone-400 font-mono">Lecture de l'identité et extraction OCR...</p>
                          </div>
                        )}

                        {preRegisterStage === "done" && (
                          <div className="space-y-4 animate-fade-in text-left p-4 bg-stone-900 border border-white/5 rounded-2xl">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-3">
                              <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                              <div>
                                <span className="text-[10px] font-bold text-white block">Enregistrement Validé</span>
                                <span className="text-[8px] text-emerald-400 font-light block leading-none mt-0.5">Identité extraite & validée avec succès</span>
                              </div>
                            </div>
                            <p className="text-[9px] text-stone-400 leading-relaxed">
                              Merci ! Votre pré-enregistrement est complété. Votre badge d'accès sera généré en 5 secondes à votre arrivée à la réception de la Maison Rouge.
                            </p>
                            <button
                              type="button"
                              onClick={() => setPreRegisterStage("none")}
                              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Retour à la messagerie
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* VUE 2: RECEPTIONIST PMS CONSOLE LOGS & PAYLOAD */}
                    {successView === "pms" && (
                      <div className="space-y-3.5 flex-grow text-left animate-fade-in overflow-y-auto max-h-[350px] pr-1">
                        
                        {/* PMS stats overview */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-stone-950 border border-white/5 p-2 rounded-xl">
                            <span className="text-[7px] text-stone-500 uppercase block font-bold">Occupation</span>
                            <span className="text-xs font-bold text-white font-mono">75%</span>
                          </div>
                          <div className="bg-stone-950 border border-white/5 p-2 rounded-xl">
                            <span className="text-[7px] text-stone-500 uppercase block font-bold">Ventes Directes</span>
                            <span className="text-xs font-bold text-emerald-400 font-mono">+18%</span>
                          </div>
                          <div className="bg-stone-950 border border-white/5 p-2 rounded-xl">
                            <span className="text-[7px] text-stone-500 uppercase block font-bold">Acompte Net</span>
                            <span className="text-xs font-bold text-[#CA8A04] font-mono">{roomDeposit > 100000 ? `${Math.round(roomDeposit/1000)}k` : "120k"}</span>
                          </div>
                        </div>

                        {/* Room Allocations Grid */}
                        <div className="bg-stone-950 border border-white/5 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-[7px] font-bold text-stone-400 pb-1 border-b border-white/5 font-mono">
                            <span>GRID D'OCCUPATION CHAMBRES</span>
                            <span className="text-emerald-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> LIVE</span>
                          </div>
                          <div className="space-y-1 font-mono text-[8px]">
                            {[
                              { room: "Chambre 101", cat: "Classique", status: "Occupée", guest: "M. GOMEZ", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                              { room: "Chambre 102", cat: "Supérieure", status: "Propre / Libre", guest: "Aucun", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                              { room: "Suite 201", cat: "Prestige", status: "Réservée (Acompte)", guest: formData.name || "M. DUPONT", cls: "bg-amber-500/10 text-[#CA8A04] border-[#CA8A04]/20 animate-pulse font-bold" },
                              { room: "Suite 202", cat: "Prestige", status: "Départ prévu", guest: "M. KOFFI", cls: "bg-stone-800 text-stone-400 border-stone-700" }
                            ].map((rm, idx) => (
                              <div key={idx} className="flex justify-between items-center p-1.5 rounded-lg bg-white/[0.01]">
                                <span>{rm.room} <span className="text-[7px] text-stone-500">({rm.cat})</span></span>
                                <span className={`px-1.5 py-0.5 rounded border ${rm.cls}`}>{rm.status} : {rm.guest}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* LIVE LOGS PANEL */}
                        <div className="bg-stone-950 border border-white/5 p-3 rounded-xl space-y-2">
                          <div className="text-[8px] font-bold text-stone-400 pb-1.5 border-b border-white/5 flex justify-between items-center font-mono">
                            <span className="flex items-center gap-1"><Cpu size={10} /> LOGS DES AUTOMATES</span>
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

                        {/* WEBHOOK PAYLOAD INSPECTOR */}
                        <div className="bg-stone-950 border border-white/5 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-[8px] font-bold text-stone-400 font-mono">
                            <span className="flex items-center gap-1"><Code2 size={10} /> PAYLOAD WEBHOOK (JSON FEDAPAY)</span>
                            <button
                              type="button"
                              onClick={() => setShowPayload(!showPayload)}
                              className="text-[#CA8A04] hover:text-white px-2 py-0.5 rounded border border-[#CA8A04]/20 text-[7px] font-bold uppercase transition-colors cursor-pointer"
                            >
                              {showPayload ? "Masquer" : "Inspecter"}
                            </button>
                          </div>

                          {showPayload && (
                            <div className="font-mono text-[7px] text-stone-300 bg-black p-2 rounded border border-white/5 overflow-x-auto max-h-[120px] leading-relaxed animate-fade-in">
                              <pre>{JSON.stringify({
                                event: "transaction.approved",
                                entity: "transaction",
                                id: `tx_fedapay_${Math.random().toString(36).substr(2, 9)}`,
                                amount: roomDeposit,
                                currency: "XOF",
                                status: "approved",
                                mode: "live",
                                callback_url: "https://maisonrouge-pms.bj/api/webhooks/fedapay",
                                customer: {
                                  firstname: formData.name ? formData.name.split(" ")[0] : "Client",
                                  lastname: formData.name ? formData.name.split(" ").slice(1).join(" ") || "VIP" : "VIP",
                                  phone: `+229${momoNumber}`
                                }
                              }, null, 2)}</pre>
                            </div>
                          )}
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
      )}
    </div>
  );
}
