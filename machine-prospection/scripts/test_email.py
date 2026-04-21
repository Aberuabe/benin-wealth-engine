import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# --- CONFIGURATION TEST ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
NOM_EXPEDITEUR = "Abel DOTONOU"

def envoyer_test(sender_email, app_password, test_recipient):
    subject = "TEST ELITE : J'ai analysé votre tunnel (Rendu Final)"
    
    body = f"""Bonjour [Prénom Test],

Je suis tombé sur votre site (https://votre-site-test.com) ce matin. Votre offre est excellente, mais j'ai détecté une friction majeure qui bride vos résultats :

> Lenteur de chargement critique sur la version mobile (Perte de 25% de conversion estimée).

Cela vous fait probablement perdre une partie importante de vos prospects qualifiés dès l'arrivée.

Je m'appelle {NOM_EXPEDITEUR} et je suis spécialiste en **Systèmes de Vente Automatisés**. Je ne crée pas de simples sites, je répare les machines à cash qui fuient.

**Ma proposition :**
Je ré-optimise votre landing page (Design, Code, Copywriting) pour viser un doublement de votre taux de conversion.

**La garantie "Elite" :**
Si après 30 jours, vous n'avez pas une augmentation mesurable de vos ventes, je travaille gratuitement jusqu'à atteindre l'objectif fixé. Je ne travaille qu'au résultat.

Seriez-vous disponible pour un appel de 10 minutes ce jeudi ou vendredi ? J'ai déjà préparé 2 autres points d'amélioration spécifiques pour vous.

Cordialement,

{NOM_EXPEDITEUR}
Spécialiste Conversion Haute Performance
"""
    
    message = MIMEMultipart()
    message["From"] = f"{NOM_EXPEDITEUR} <{sender_email}>"
    message["To"] = test_recipient
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        # CORRECTION SSL POUR WINDOWS
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
            server.login(sender_email, app_password)
            server.sendmail(sender_email, test_recipient, message.as_string())
        print(f"✅ TEST RÉUSSI ! Le mail a été envoyé à {test_recipient}")
    except Exception as e:
        print(f"❌ ERREUR DE TEST : {e}")

if __name__ == "__main__":
    email = input("Ton Gmail : ")
    pwd = input("Ton MDP d'application : ")
    dest = input("Email de réception du test : ")
    envoyer_test(email, pwd, dest)
