import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# --- CONFIGURATION MAISON ROUGE ---
TO_EMAIL = "contact@maison-rouge-cotonou.com"
CC_EMAILS = [
    "directionmaisonrougecotonou@gmail.com",
    "chef.reception.maisonrouge@outlook.com"
]
ALL_RECIPIENTS = [TO_EMAIL] + CC_EMAILS

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
NOM_EXPEDITEUR = "Abel DOTONOU"

def envoyer_mail(sender_email, app_password):
    subject = "Proposition de Collaboration Technique : Optimisation de votre Tunnel de Réservation Directe"
    
    body = f"""Bonjour à l'équipe de Direction de la Maison Rouge,

Je vous remercie pour votre réactivité sur WhatsApp et pour l’opportunité de vous soumettre cette proposition technique.

Pour lever toute ambiguïté sur mon profil : je ne suis pas créateur de contenu ou influenceur sur les réseaux sociaux. Je suis ingénieur logiciel Full-Stack et spécialiste en ingénierie de conversion (CRO) pour les services haut de gamme. 

Mon expertise réside dans la conception d'architectures web robustes et fluides, et dans l'intégration de passerelles de paiement sécurisées. J'ai notamment développé des solutions Fintech et d'Escrow (comme Safe-Deal Bénin) qui traitent des transactions financières complexes via Mobile Money (MTN MoMo, Moov Flooz) et cartes bancaires. 

Pour la Maison Rouge, mon objectif n'est pas d'amener du trafic, mais de sécuriser et maximiser la conversion du trafic que vous possédez déjà, en éliminant les frictions techniques majeures qui causent des abandons de réservation.

Voici le détail de mon diagnostic et de mon offre d'accompagnement :

1. Diagnostic Technique & Frictions Actuelles (Perte de Chiffre d'Affaires Direct)
En analysant votre écosystème de réservation en ligne, j'ai identifié deux freins critiques :
* Instabilité mobile du widget de réservation (SiteMinder/Direct-Book) : Vos plugins de cache WordPress/Elementor créent des conflits de scripts sur mobile, forçant l'affichage d'un message d'alerte rouge invitant l'utilisateur à cliquer ailleurs. En e-commerce hôtelier, chaque étape ou clic supplémentaire génère un taux d'abandon moyen de 25%.
* Absence d'alternative de paiement mobile locale : Pour les voyageurs d'affaires locaux et de la sous-région, l'absence de paiement d'acompte instantané par MTN MoMo ou Moov Flooz est un frein à l'achat d'impulsion ou à la sécurisation immédiate des nuitées.

2. La Solution : Un Tunnel de Réservation Propriétaire Ultra-Rapide (Next.js)
Je propose de développer un micro-système de réservation sur-mesure connecté à vos systèmes existants :
1. Interface Next.js Haute Performance : Une expérience utilisateur fluide, sans rechargement de page, avec un chargement instantané (< 0.8 seconde) sur mobile.
2. Passerelle Multi-Paiements Sécurisée : Intégration de paiements locaux (Mobile Money) et internationaux (Cartes de crédit) via une API robuste (FedaPay/Kkiapay).
3. Automatisations Opérationnelles : Confirmation automatique par SMS/WhatsApp au client et notification instantanée à votre équipe de réception dès validation de la réservation.

3. Modalités de la Phase de Test & Tarification au Résultat
Parce que la confiance se prouve par les faits, je vous propose une formule sans aucun risque financier pour votre établissement :
* Phase 1 : Prototype Fonctionnel Gratuit (5 jours) : Je conçois et développe une maquette interactive complète de votre futur tunnel. Vous pourrez la tester sur mobile et juger de la fluidité avant de prendre la moindre décision.
* Phase 2 : Intégration & Mise en production (3 jours) : Si et seulement si vous validez le prototype, nous procédons au déploiement technique et aux automatisations. Le tarif forfaitaire de mise en place est fixé à 250 000 FCFA (un investissement amorti dès les premières réservations directes sécurisées).
* Garantie Satisfait ou Remboursé (30 jours) : Si après 30 jours de mise en ligne, vous ne constatez pas une amélioration de vos réservations directes ou de la gestion de votre réception, je vous rembourse l'intégralité du montant.

4. Références & Travaux Récents
Vous pouvez consulter mes projets techniques et mon parcours de développeur sur mes espaces professionnels :
👉 Mon Portfolio Technique : https://portofolio-mxxn.vercel.app (présentant mes réalisations Fintech comme Safe-Deal Bénin et FADJI)
👉 Ma Vitrine de Démo : https://vitrine-elite.vercel.app

Je reste à votre entière disposition pour échanger de vive voix lors d'un appel rapide ou directement dans vos locaux à la Haie Vive.

Pour démarrer la création de votre prototype gratuit, il vous suffit de me répondre par retour de mail.

Bien cordialement,

{NOM_EXPEDITEUR}
Ingénieur Logiciel & Spécialiste Systèmes de Vente
Téléphone : +229 01 67 75 00 83
Cotonou, Bénin
"""

    message = MIMEMultipart()
    message["From"] = f"{NOM_EXPEDITEUR} <{sender_email}>"
    message["To"] = TO_EMAIL
    message["Cc"] = ", ".join(CC_EMAILS)
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        # Correction SSL pour Windows
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        print(f"\n📧 Connexion sécurisée au serveur SMTP Gmail...")
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(sender_email, app_password)
            print("🚀 Envoi du mail officiel (To: Maison Rouge | Cc: Direction & Réception)...")
            server.sendmail(sender_email, ALL_RECIPIENTS, message.as_string())
            
        print(f"\n✅ SUCCESS : L'e-mail officiel a été envoyé avec succès !")
        print(f"Destinataire : {TO_EMAIL}")
        print(f"Copies (Cc) : {', '.join(CC_EMAILS)}")
    except Exception as e:
        print(f"\n❌ ERREUR LORS DE L'ENVOI : {e}")
        print("\nNote : Assurez-vous d'utiliser un 'Mot de passe d'application' Gmail (16 caractères) et non votre mot de passe classique.")

if __name__ == "__main__":
    print("==========================================================")
    print("📧 EXPÉDITEUR OFFICIEL DE MAILS - MAISON ROUGE COTONOU")
    print("==========================================================")
    
    try:
        email = input("Entre ton adresse Gmail (ex: abel@gmail.com) : ").strip()
        if not email:
            print("Email requis.")
            sys.exit(1)
            
        print("\nGmail requiert un 'Mot de passe d'application' à 16 caractères pour les connexions tierces.")
        print("Obtiens-le ici : https://myaccount.google.com/apppasswords")
        pwd = input("Entre ton mot de passe d'application : ").strip()
        if not pwd:
            print("Mot de passe requis.")
            sys.exit(1)
            
        envoyer_mail(email, pwd)
    except KeyboardInterrupt:
        print("\nAnnulation de l'envoi.")
