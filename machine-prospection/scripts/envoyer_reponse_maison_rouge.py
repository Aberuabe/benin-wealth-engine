import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
sys.stdout.reconfigure(encoding='utf-8')

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

def envoyer_reponse(sender_email, app_password):
    subject = "Re: Proposition de Collaboration Technique : Optimisation de votre Tunnel de Réservation Directe"
    
    body = f"""Bonjour Céline,

C'est parfait pour moi. Je valide avec plaisir notre rencontre le :
👉 Lundi 22 juin à 10h30 dans vos locaux.

Afin de rendre notre échange le plus concret possible, je viendrai avec une démonstration visuelle simplifiée de l'interface sur smartphone pour que vous puissiez tester la réactivité du système en conditions réelles.

Je vous remercie et vous souhaite une excellente journée.

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
        # Configuration SSL robuste pour Windows
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        print(f"\n📧 Connexion au serveur SMTP Gmail...")
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(sender_email, app_password)
            print("🚀 Envoi de la réponse à la Maison Rouge (avec Cc)...")
            server.sendmail(sender_email, ALL_RECIPIENTS, message.as_string())
            
        print(f"\n✅ SUCCESS : La réponse a été envoyée avec succès à {TO_EMAIL} et en Cc à {', '.join(CC_EMAILS)} !")
    except Exception as e:
        print(f"\n❌ ERREUR LORS DE L'ENVOI : {e}")
        print("\nNote : Assurez-vous d'utiliser un 'Mot de passe d'application' Gmail (16 caractères) et non votre mot de passe de compte classique.")

if __name__ == "__main__":
    print("==========================================================")
    print("📧 ENVOI DE LA RÉPONSE DE RENDEZ-VOUS - MAISON ROUGE")
    print("==========================================================")
    
    try:
        email = "dotonouabel@gmail.com"
        print(f"Expéditeur : {email}")
        
        print("\nPour des raisons de sécurité, Gmail nécessite un 'Mot de passe d'application' à 16 caractères.")
        print("Obtiens-le ici si besoin : https://myaccount.google.com/apppasswords")
        pwd = input("Entre ton mot de passe d'application : ").strip()
        if not pwd:
            print("Mot de passe requis.")
            sys.exit(1)
            
        envoyer_reponse(email, pwd)
    except KeyboardInterrupt:
        print("\nAnnulation de l'envoi.")
