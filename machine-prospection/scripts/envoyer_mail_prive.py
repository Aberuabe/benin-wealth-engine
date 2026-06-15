import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# --- CONFIGURATION DU MAIL LE PRIVÉ ---
RECIPIENT_EMAIL = "info@leprivecotonou.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
NOM_EXPEDITEUR = "Abel DOTONOU"

def envoyer_mail(sender_email, app_password):
    subject = "Proposition de partenariat : Optimisation de vos réservations (Le Privé)"
    
    body = f"""Bonjour à l'équipe de Direction du Privé,

Je me permets de vous contacter car j'ai identifié un axe d'optimisation majeur sur le site web du restaurant Le Privé.

Pour me présenter brièvement : je suis ingénieur logiciel Full-Stack et spécialiste en ingénierie de conversion (CRO) pour les établissements de prestige. J'ai conçu des architectures complexes et des solutions Fintech sécurisées (comme Safe-Deal Bénin) qui intègrent des paiements Mobile Money (MTN MoMo, Moov Flooz) et cartes bancaires.

En analysant votre présence en ligne, j'ai détecté deux frictions majeures qui brident vos résultats :
1. Prise de contact statique : Vos demandes de privatisation et de réservations passent par un formulaire classique non réactif, ce qui entraîne une perte importante de clients (souvent des professionnels pressés) qui attendent une confirmation.
2. Manque de relance & d'avis : Le parcours client s'arrête après la visite, sans relance automatique pour fidéliser ou inciter à laisser un avis Google (ce qui est crucial pour le référencement d'un restaurant gastronomique).

Ce que je propose d'implémenter :
* Tunnel de Réservation Intuitif & Rapide : Une interface Next.js moderne où le client peut demander une privatisation ou réserver une table en 3 clics, avec confirmation immédiate.
* Automatisations Opérationnelles : Notification instantanée à votre maître d'hôtel dès validation, et envoi automatique de SMS/WhatsApp de confirmation au client.
* Système de relance post-visite : Envoi automatisé d'un message de remerciement 2 heures après le repas pour récolter des avis Google 5 étoiles de manière organique.

Pour vous prouver la valeur de mon travail, je vous propose une formule 100% garantie :
* Phase 1 : Prototype Fonctionnel Gratuit (5 jours) : Je conçois la maquette visuelle complète de votre nouveau flux de réservation. Vous ne payez rien à cette étape et pouvez tester l'expérience sur mobile.
* Phase 2 : Déploiement technique : Si le prototype vous convient, le tarif unique d'intégration et de configuration est de 250 000 FCFA.

Vous pouvez consulter mes travaux et mon profil sur mes espaces professionnels :
👉 Mon Portfolio Personnel : https://portofolio-mxxn.vercel.app (présentant mes réalisations Fintech)
👉 Ma Vitrine Technique : https://vitrine-elite.vercel.app

Seriez-vous disponible pour un court appel de 5 minutes ou pour que je vous présente le prototype gratuit directement à la Haie Vive ?

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Bien cordialement,

{NOM_EXPEDITEUR}
Ingénieur Logiciel & Spécialiste Systèmes de Vente
Téléphone : +229 01 67 75 00 83
Cotonou, Bénin
"""
    
    message = MIMEMultipart()
    message["From"] = f"{NOM_EXPEDITEUR} <{sender_email}>"
    message["To"] = RECIPIENT_EMAIL
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        # Correction SSL pour Windows
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        print(f"\n📧 Connexion au serveur SMTP Gmail...")
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(sender_email, app_password)
            print("🚀 Envoi de l'e-mail à Le Privé...")
            server.sendmail(sender_email, RECIPIENT_EMAIL, message.as_string())
            
        print(f"\n✅ SUCCESS : L'e-mail a été envoyé avec succès à {RECIPIENT_EMAIL} !")
    except Exception as e:
        print(f"\n❌ ERREUR LORS DE L'ENVOI : {e}")
        print("\nNote : Assurez-vous d'utiliser un 'Mot de passe d'application' Gmail (16 caractères) et non votre mot de passe de compte classique.")

if __name__ == "__main__":
    print("==========================================================")
    print("📧 EXPÉDITION DU MAIL - LE PRIVÉ COTONOU")
    print("==========================================================")
    
    try:
        email = input("Entre ton adresse Gmail (ex: abel@gmail.com) : ").strip()
        if not email:
            print("Email requis.")
            sys.exit(1)
            
        print("\nPour des raisons de sécurité, Gmail nécessite un 'Mot de passe d'application' à 16 caractères.")
        print("Obtiens-le ici si besoin : https://myaccount.google.com/apppasswords")
        pwd = input("Entre ton mot de passe d'application : ").strip()
        if not pwd:
            print("Mot de passe requis.")
            sys.exit(1)
            
        envoyer_mail(email, pwd)
    except KeyboardInterrupt:
        print("\nAnnulation de l'envoi.")
