import os
from datetime import datetime

# --- CONFIGURATION DES LEADS CIBLES ---
LEADS = [
    # Leads Bénin (Marché Local)
    {
        "type": "local",
        "entreprise": "3.14 Atelier",
        "secteur": "Restaurant de Luxe (Cotonou)",
        "contact": "+22998314314",
        "canal": "WhatsApp",
        "contact_link": "https://wa.me/22998314314",
        "friction": "Pas d'outil de réservation en ligne, tout passe par des DMs Instagram lents. Perte d'environ 30% des clients aux heures de pointe.",
        "solution": "Un mini-moteur de réservation sur WhatsApp avec confirmation instantanée par SMS.",
        "pitch": "Bonjour, c'est Abel Dotonou. J'adore ce que vous faites au 3.14 Atelier. J'ai remarqué que votre processus de réservation sur Instagram fait perdre pas mal de clients aux heures d'affluence. J'ai conçu un mini-moteur de réservation automatique sur WhatsApp pour régler ça. On s'appelle 5 min aujourd'hui ?"
    },
    {
        "type": "local",
        "entreprise": "Le Privé",
        "secteur": "Restaurant Gastronomique (Cotonou)",
        "contact": "+22997291717",
        "canal": "WhatsApp & Email",
        "email": "info@leprivecotonou.com",
        "contact_link": "https://wa.me/22997291717",
        "friction": "Site web statique, aucun tunnel pour retenir et relancer les clients de passage. Aucune automatisation d'avis Google.",
        "solution": "Un tunnel de capture de leads (événementiel/privatisation) avec suivi automatique et relance par email.",
        "pitch": "Bonjour, c'est Abel Dotonou. J'ai remarqué une friction majeure sur le site web du Privé qui bride vos demandes de privatisation. J'ai préparé un schéma d'automatisation simple pour doubler vos leads événementiels en y consacrant 0 minute par jour. Est-ce qu'on peut s'appeler 5 min ?"
    },
    {
        "type": "local",
        "entreprise": "Hôtel Maison Rouge",
        "secteur": "Hôtel & Resto Luxe (Cotonou)",
        "contact": "+2290165126989",
        "canal": "WhatsApp & Email",
        "email": "contact@maison-rouge-cotonou.com",
        "contact_link": "https://wa.me/2290165126989",
        "friction": "Formulaire de contact classique sans confirmation automatique. Friction majeure pour les clients internationaux pressés.",
        "solution": "Un système de réservation de table Next.js ultra-rapide connecté à une feuille de gestion interne.",
        "pitch": "Bonjour, c'est Abel Dotonou. Je viens de voir votre restaurant face à la mer. J'ai détecté un point de fuite de clients sur votre formulaire de réservation actuel (pas de validation automatique, temps de réponse trop long). J'ai fait une maquette rapide pour rendre cela instantané. On s'appelle 5 min ?"
    },
    {
        "type": "local",
        "entreprise": "L'Imprévu Cotonou",
        "secteur": "Bistrot & Guesthouse (Cotonou)",
        "contact": "+22966974040",
        "canal": "WhatsApp & Email",
        "email": "limprevubj@gmail.com",
        "contact_link": "https://wa.me/22966974040",
        "friction": "Réservations dépendantes de plateformes tierces coûteuses en commissions. Aucun canal d'acquisition direct et automatisé.",
        "solution": "Une landing page de réservation directe avec code promo automatique pour contourner Booking.com.",
        "pitch": "Bonjour, c'est Abel Dotonou. J'adore le cadre de L'Imprévu. J'ai analysé votre flux de réservation : vous donnez trop de commissions aux plateformes. J'ai créé un tunnel de réservation direct qui garde 100% de vos marges chez vous. On en parle pendant 5 min ce midi ?"
    },
    {
        "type": "local",
        "entreprise": "La Plage by Code Bar",
        "secteur": "Resto & Bar de Plage (Fidjrossè)",
        "contact": "+22996901010",
        "canal": "WhatsApp",
        "contact_link": "https://wa.me/22996901010",
        "friction": "Absence de système de réservation de transats/tables pour les week-ends d'affluence. Perte de revenus sur la clientèle VIP.",
        "solution": "Un plan de table interactif en ligne avec paiement d'acompte mobile money intégré.",
        "pitch": "Bonjour, c'est Abel Dotonou. Le Code Bar est top, mais réserver un transat le dimanche est un enfer par téléphone. J'ai maquetté un système de réservation visuel simple pour vos clients VIP. Ça prend 2 minutes à voir. On en parle ?"
    },
    {
        "type": "local",
        "entreprise": "BENIN-IMMO",
        "secteur": "Agence Immobilière (Cotonou)",
        "contact": "+22966448484",
        "canal": "WhatsApp & Email",
        "email": "contact@benin-immo.com",
        "contact_link": "https://wa.me/22966448484",
        "friction": "Moteur de recherche de biens lent et non responsive sur mobile. Les clients internationaux abandonnent la recherche en 10 secondes.",
        "solution": "Une refonte Next.js ultra-rapide de la recherche de catalogue, optimisée pour le SEO local.",
        "pitch": "Bonjour, c'est Abel Dotonou. J'ai fait un test de vitesse mobile sur votre site benin-immo.com. Le temps de chargement est de plus de 6 secondes, ce qui fait fuir 40% de vos prospects expatriés. J'ai préparé une solution pour rendre votre catalogue instantané. On s'appelle ?"
    },
    
    # Leads Internationaux (Agences Europe)
    {
        "type": "international",
        "entreprise": "KEXINO",
        "decideur": "Gee Ranasinha",
        "email": "gee@kexino.com",
        "site": "https://www.kexino.com",
        "friction": "Le bloc de texte 'Growth' noie la valeur de l'agence sur écran mobile. Manque d'appel à l'action immédiat.",
        "solution": "Refonte du Hero Header mobile avec une proposition de valeur impactante et un CTA collant.",
    },
    {
        "type": "international",
        "entreprise": "Les DIGIVORES",
        "decideur": "Yves Latour",
        "email": "yves@lesdigivores.ch",
        "site": "https://lesdigivores.ch",
        "friction": "Le formulaire de contact a trop de champs obligatoires, ce qui détruit le taux de conversion de plus de 35%.",
        "solution": "Formulaire de capture progressif en 2 étapes avec qualification automatique par IA.",
    },
    {
        "type": "international",
        "entreprise": "Izoard",
        "decideur": "Bert Onckelinx",
        "email": "bert@izoard.be",
        "site": "https://izoard.be",
        "friction": "Landing page trop technique et générique. Ne valorise pas les études de cas ROIstes.",
        "solution": "Copwriting orienté résultats avec bento-grid d'études de cas interactives.",
    }
]

def generer_markdown():
    # Déterminer le chemin absolu du fichier de sortie par rapport à l'emplacement du script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    path_output = os.path.join(project_root, "machine-prospection", "leads", "campagne_personnalisee_du_jour.md")
    
    with open(path_output, "w", encoding="utf-8") as f:
        f.write(f"# 🎯 CAMPAGNE DE PROSPECTION AUTOMATISÉE ET PERSONNALISÉE\n")
        f.write(f"*Générée le : {datetime.now().strftime('%d/%m/%Y à %H:%M:%S')}*\n\n")
        
        f.write("> [!TIP]\n")
        f.write("> Cette campagne a été automatiquement générée pour toi. Il te suffit de copier les messages WhatsApp pré-remplis ou d'exécuter le script d'e-mailing.\n\n")
        
        f.write("## 🟢 PROSPECTION LOCALE (WHATSAPP - COTONOU)\n")
        f.write("*(Méthode ultra-rapide et encaissement direct par Mobile Money)*\n\n")
        
        for lead in LEADS:
            if lead["type"] == "local":
                f.write(f"### 📍 {lead['entreprise']} ({lead['secteur']})\n")
                f.write(f"- **Canal :** {lead['canal']}\n")
                f.write(f"- **Numéro :** `{lead['contact']}`\n")
                if "email" in lead:
                    f.write(f"- **Email :** `{lead['email']}`\n")
                f.write(f"- **Lien WhatsApp Direct :** [Ouvrir la discussion]({lead['contact_link']})\n")
                f.write(f"- **Friction détectée :** {lead['friction']}\n")
                f.write(f"- **Solution proposée :** {lead['solution']}\n")
                f.write(f"- **Message à copier/coller :**\n")
                f.write(f"```text\n{lead['pitch']}\n```\n")
                f.write("---\n\n")
                
        f.write("## 🔵 PROSPECTION INTERNATIONALE (EMAIL - EUROPE)\n")
        f.write("*(Méthode de la Gifle de Valeur via Upwork Direct Contract/Wise)*\n\n")
        
        for lead in LEADS:
            if lead["type"] == "international":
                f.write(f"### 🌍 {lead['entreprise']} - {lead['decideur']}\n")
                f.write(f"- **Site Web :** {lead['site']}\n")
                f.write(f"- **Email :** `{lead['email']}`\n")
                f.write(f"- **Friction détectée :** {lead['friction']}\n")
                f.write(f"- **Solution proposée :** {lead['solution']}\n")
                
                subject = f"Audit Flash : friction détectée sur le tunnel de {lead['entreprise']}"
                body = f"Bonjour {lead['decideur'].split(' ')[0]},\n\nJ'ai analysé le tunnel de conversion de votre site ({lead['site']}) ce matin.\n\nJ'ai détecté un point de fuite de prospects majeur :\n> {lead['friction']}\n\nCela vous fait probablement perdre entre 20% et 35% de vos conversions mobiles.\n\nJe m'appelle Abel Dotonou et je suis spécialiste en Systèmes de Vente Automatisés. Je ne crée pas de simples sites, je répare les machines à cash qui fuient.\n\nMa proposition :\nJe ré-optimise votre landing page pour doubler votre taux de conversion.\n\nMa garantie : Si après 30 jours vous n'avez pas de hausse de ventes mesurable, je travaille gratuitement. Je ne travaille qu'au résultat.\n\nSeriez-vous disponible pour un appel de 10 min ce jeudi ? J'ai préparé 2 pistes de solutions spécifiques pour vous.\n\nCordialement,\nAbel Dotonou"
                
                f.write(f"- **Email rédigé prêt à envoyer :**\n")
                f.write(f"```text\nObjet : {subject}\n\n{body}\n```\n")
                f.write("---\n\n")

    try:
        print(f"[SUCCESS] Fichier de campagne genere avec succes dans : {path_output}")
    except Exception:
        pass

if __name__ == "__main__":
    generer_markdown()
