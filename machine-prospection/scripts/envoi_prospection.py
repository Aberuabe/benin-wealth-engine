import smtplib
import ssl
import time
import random
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# --- CONFIGURATION ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
NOM_EXPEDITEUR = "Abel DOTONOU"

def envoyer_email(sender_email, app_password, recipient_email, subject, body):
    message = MIMEMultipart()
    message["From"] = f"{NOM_EXPEDITEUR} <{sender_email}>"
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    # CORRECTION SSL POUR WINDOWS
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(sender_email, app_password)
        server.sendmail(sender_email, recipient_email, message.as_string())

def charger_leads(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    leads = []
    for line in lines:
        if "|" in line and "20/04" in line:
            parts = [p.strip() for p in line.split("|") if p.strip()]
            if len(parts) >= 6:
                leads.append({
                    "entreprise": parts[1],
                    "decideur": parts[2],
                    "email": parts[3],
                    "site": parts[4],
                    "friction": parts[5]
                })
    return leads

def main():
    print(f"🚀 DÉMARRAGE DE LA MACHINE À PROSPECTION - AU NOM DE {NOM_EXPEDITEUR.upper()}")
    sender_email = input("Ton email Gmail : ")
    app_password = input("Ton mot de passe d'application (16 caractères) : ")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    leads_path = os.path.join(script_dir, "..", "leads", "suivi_leads.md")
    leads = charger_leads(leads_path)
    total = len(leads)
    
    print(f"📈 {total} leads détectés. Début de l'envoi...")

    for i, lead in enumerate(leads):
        if "@" not in lead["email"] or "Recherche" in lead["email"]:
            continue
            
        prenom = lead["decideur"].split(" ")[0] if lead["decideur"] != "CEO" else "Bonjour"
        
        subject = f"Audit Flash : J'ai analysé le tunnel de {lead['entreprise']}"
        body = f"""Bonjour {prenom},

Je suis tombé sur votre site ({lead['site']}) ce matin. Votre offre est excellente, mais j'ai détecté une friction majeure qui bride vos résultats :

> {lead['friction']}

Cela vous fait probablement perdre entre 20% et 30% de vos prospects qualifiés dès l'arrivée.

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
        
        try:
            envoyer_email(sender_email, app_password, lead["email"], subject, body)
            print(f"✅ [{i+1}/{total}] Email envoyé à {lead['decideur']} ({lead['entreprise']})")
            
            attente = random.randint(90, 240) 
            if i < total - 1:
                print(f"⏳ Sécurité Gmail : Attente de {attente}s...")
                time.sleep(attente)
        except Exception as e:
            print(f"❌ Erreur pour {lead['entreprise']}: {e}")

if __name__ == "__main__":
    main()
