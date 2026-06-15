import urllib.parse
import webbrowser
import os
import sys

# --- DÉFINITION DES CONTACTS LOCAUX ---
CONTACTS = [
    {
        "index": 1,
        "nom": "3.14 Atelier (Restaurant Luxe Cotonou)",
        "phone": "+2290198314314",
        "pitch": "Bonjour, c'est Abel Dotonou. J'adore ce que vous faites au 3.14 Atelier. J'ai remarqué que votre processus de réservation sur Instagram fait perdre pas mal de clients aux heures d'affluence. J'ai conçu un mini-moteur de réservation automatique sur WhatsApp pour régler ça. On s'appelle 5 min aujourd'hui ?"
    },
    {
        "index": 2,
        "nom": "Le Privé (Restaurant Gastronomique Cotonou)",
        "phone": "+2290197291717",
        "pitch": "Bonjour, c'est Abel Dotonou. J'ai remarqué une friction majeure sur le site web du Privé qui bride vos demandes de privatisation. J'ai préparé un schéma d'automatisation simple pour doubler vos leads événementiels en y consacrant 0 minute par jour. Est-ce qu'on peut s'appeler 5 min ?"
    },
    {
        "index": 3,
        "nom": "Hôtel Maison Rouge (Hôtel & Resto Luxe)",
        "phone": "+2290165126989",
        "pitch": "Bonjour, c'est Abel Dotonou. J'ai analysé la page de réservation de la Maison Rouge. Votre widget SiteMinder actuel a des bugs d'affichage fréquents sur mobile (ce qui vous oblige à afficher un message d'avertissement pour cliquer ailleurs) et ne gère pas les paiements locaux MoMo/Flooz. J'ai conçu un prototype de moteur de réservation Next.js ultra-rapide (<1s) pour capter 100% de vos clients sans bug. Je peux vous montrer la maquette gratuitement ? On en parle 5 min ?"
    },
    {
        "index": 4,
        "nom": "L'Imprévu Cotonou (Bistrot & Guesthouse)",
        "phone": "+2290166974040",
        "pitch": "Bonjour, c'est Abel Dotonou. J'adore le cadre de L'Imprévu. J'ai analysé votre flux de réservation : vous donnez trop de commissions aux plateformes. J'ai créé un tunnel de réservation direct qui garde 100% de vos marges chez vous. On en parle pendant 5 min ce midi ?"
    },
    {
        "index": 5,
        "nom": "La Plage by Code Bar (Beach Club Fidjrossè)",
        "phone": "+2290196901010",
        "pitch": "Bonjour, c'est Abel Dotonou. Le Code Bar est top, mais réserver un transat le dimanche est un enfer par téléphone. J'ai maquetté un système de réservation visuel simple pour vos clients VIP. Ça prend 2 minutes à voir. On en parle ?"
    },
    {
        "index": 6,
        "nom": "BENIN-IMMO (Agence Immobilière Cotonou)",
        "phone": "+2290166448484",
        "pitch": "Bonjour, c'est Abel Dotonou. J'ai fait un test de vitesse mobile sur votre site benin-immo.com. Le temps de chargement est de plus de 6 secondes, ce qui fait fuir 40% de vos prospects expatriés. J'ai préparé une solution pour rendre votre catalogue instantané. On s'appelle ?"
    }
]

def main():
    print("==========================================================")
    print("🚀 PIPELINE DE PROSPECTION AUTOMATISÉE SUR WHATSAPP WEB")
    print("==========================================================")
    print("Sélectionne le client local à contacter :\n")
    
    for c in CONTACTS:
        print(f"[{c['index']}] - {c['nom']} ({c['phone']})")
        
    print("\n[0] - Quitter")
    print("==========================================================")
    
    try:
        choix = int(input("Ton choix : "))
    except ValueError:
        print("Choix invalide.")
        return
        
    if choix == 0:
        print("Fermeture du script.")
        return
        
    selected = None
    for c in CONTACTS:
        if c["index"] == choix:
            selected = c
            break
            
    if not selected:
        print("Choix non disponible.")
        return
        
    text_encoded = urllib.parse.quote(selected["pitch"])
    phone_clean = selected["phone"].replace("+", "").replace(" ", "")
    
    # URL de l'API WhatsApp pour ouvrir directement la discussion avec le message pré-rempli
    url = f"https://api.whatsapp.com/send?phone={phone_clean}&text={text_encoded}"
    
    print(f"\n📲 Ouverture de la discussion WhatsApp Web pour {selected['nom']}...")
    print(f"Message pré-chargé : \"{selected['pitch']}\"")
    print("Il te suffira de cliquer sur 'Envoyer' dans ton navigateur.")
    
    try:
        webbrowser.open(url)
        print("\n✅ Discussion ouverte dans ton navigateur par défaut !")
    except Exception as e:
        print(f"❌ Impossible d'ouvrir le navigateur : {e}")

if __name__ == "__main__":
    main()
