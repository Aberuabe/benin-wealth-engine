# -*- coding: utf-8 -*-
import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class ContractCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Bottom footer separator line
        self.setStrokeColor(colors.HexColor("#D1D5DB"))
        self.setLineWidth(0.5)
        self.line(54, 50, A4[0] - 54, 50)
        
        # Draw footer
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#111827"))
        self.drawString(54, 38, "CONTRAT DE PRESTATION DE SERVICES")
        
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#4B5563"))
        self.drawString(240, 38, "|   Hôtel Maison Rouge Cotonou & Abel DOTONOU")
        
        page_str = f"Page {self._pageNumber} sur {page_count}"
        self.drawRightString(A4[0] - 54, 38, page_str)
        self.restoreState()

def generer_contrat_pdf(output_path):
    margin = 54 # 1.9 cm margins
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin + 10
    )
    
    styles = getSampleStyleSheet()
    
    # Custom contract styles
    styles.add(ParagraphStyle(
        name='ContractTitle',
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#111827"),
        alignment=1, # Centered
        spaceAfter=15
    ))

    styles.add(ParagraphStyle(
        name='ContractSubtitle',
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#4B5563"),
        alignment=1,
        spaceAfter=25
    ))

    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#111827"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='ContractBody',
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='ContractBodyBold',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='SignatureText',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1F2937")
    ))

    story = []
    
    # Title & Subtitle
    story.append(Paragraph("CONTRAT DE PRESTATION DE SERVICES INFORMATIQUES", styles['ContractTitle']))
    story.append(Paragraph("Développement et intégration d'un système automatisé de réservation et de paiement en ligne.", styles['ContractSubtitle']))
    
    # Parties
    story.append(Paragraph("<b>ENTRE LES SOUSSIGNÉS :</b>", styles['SectionHeader']))
    story.append(Paragraph(
        "<b>L'Hôtel Maison Rouge</b>, situé à Cotonou, Bénin, représenté par son Directeur d'établissement dûment habilité aux fins des présentes, ci-après dénommé <b>\"le Client\"</b>, d'une part,",
        styles['ContractBody']
    ))
    story.append(Paragraph("<b>ET :</b>", styles['ContractBodyBold']))
    story.append(Paragraph(
        "<b>Monsieur Abel DOTONOU</b>, Ingénieur Logiciel indépendant, demeurant à Cotonou, Bénin (Téléphone : +229 01 67 75 00 83), ci-après dénommé <b>\"le Prestataire\"</b>, d'autre part.",
        styles['ContractBody']
    ))
    story.append(Paragraph("Il a été convenu et arrêté ce qui suit :", styles['ContractBody']))
    
    story.append(Spacer(1, 10))
    
    # Articles
    story.append(Paragraph("ARTICLE 1 : OBJET DU CONTRAT", styles['SectionHeader']))
    story.append(Paragraph(
        "Le présent contrat a pour objet de définir les conditions dans lesquelles le Prestataire conçoit, intègre et met en service un système de réservation directe automatisé et de paiement en ligne pour le compte du Client.",
        styles['ContractBody']
    ))

    story.append(Paragraph("ARTICLE 2 : DESCRIPTION DES PRESTATIONS", styles['SectionHeader']))
    story.append(Paragraph(
        "Le Prestataire s'engage à développer et intégrer les modules suivants :<br/>"
        "1. Une <b>interface utilisateur</b> (Next.js) de réservation rapide, performante sur réseaux mobiles (MTN/Moov).<br/>"
        "2. Une <b>passerelle de paiement en ligne</b> (via FedaPay/KKiaPay) pour encaisser les acomptes en Mobile Money (MTN MoMo, Moov Flooz) et par carte bancaire.<br/>"
        "3. Un <b>système d'alertes instantanées</b> sur le terminal de réception de l'hôtel (Telegram ou WhatsApp) à chaque nouvelle réservation.<br/>"
        "4. L'<b>hébergement cloud et l'intégration</b> sur un sous-domaine de l'hôtel (ex: <i>reservation.maison-rouge-cotonou.com</i>).",
        styles['ContractBody']
    ))

    story.append(Paragraph("ARTICLE 3 : CALENDRIER ET LIVRABLES", styles['SectionHeader']))
    story.append(Paragraph(
        "• <b>Phase 1 (Prototype) :</b> Livraison d'une maquette fonctionnelle et testable sous 5 jours ouvrés à compter de la signature.<br/>"
        "• <b>Phase 2 (Mise en service) :</b> Déploiement et intégration finale sous 2 jours après validation écrite du prototype par le Client.",
        styles['ContractBody']
    ))

    story.append(Paragraph("ARTICLE 4 : TARIFS ET MODALITÉS DE PAIEMENT", styles['SectionHeader']))
    story.append(Paragraph(
        "Le coût total de la prestation est fixé à un tarif unique et forfaitaire de <b>250 000 FCFA</b>, structuré ainsi :<br/>"
        "1. <b>Frais de Conception et d'Installation (150 000 FCFA) :</b> Dus et payables immédiatement après validation du prototype et mise en service en ligne. Cette somme couvre la création technique et est ferme et non remboursable.<br/>"
        "2. <b>Frais de Succès (100 000 FCFA) :</b> Payables à l'issue d'une période d'essai de 30 jours consécutifs, sous réserve des performances constatées à l'Article 5.",
        styles['ContractBody']
    ))

    story.append(Paragraph("ARTICLE 5 : GARANTIE DE RÉSULTATS", styles['SectionHeader']))
    story.append(Paragraph(
        "La part de succès (100 000 FCFA) est soumise à une garantie de résultats.<br/>"
        "• Le Client s'engage à laisser le bouton de réservation visible et accessible en haut de sa page d'accueil pendant toute la période d'essai.<br/>"
        "• Si l'outil comptabilise moins de 10 réservations automatiques durant les 30 jours d'essai, le Client est dispensé du paiement des 100 000 FCFA restants (ou en obtiendra le remboursement s'ils ont été avancés).",
        styles['ContractBody']
    ))

    story.append(Paragraph("ARTICLE 6 : PROPRIÉTÉ INTELLECTUELLE et CONFIDENTIALITÉ", styles['SectionHeader']))
    story.append(Paragraph(
        "Le transfert de propriété du code source et des accès systèmes s'effectue dès le paiement intégral des 250 000 FCFA. "
        "Le Prestataire s'engage à respecter la confidentialité la plus stricte concernant les données clients de l'établissement.",
        styles['ContractBody']
    ))

    story.append(Paragraph("ARTICLE 7 : LOI APPLICABLE", styles['SectionHeader']))
    story.append(Paragraph(
        "Le présent contrat est régi par le droit en vigueur au Bénin. Tout litige relatif à son interprétation sera soumis à la juridiction exclusive des tribunaux compétents de Cotonou.",
        styles['ContractBody']
    ))

    story.append(Spacer(1, 25))

    # Signature Block - Keep Together to prevent splitting across pages
    sig_data = [
        [
            Paragraph("<b>Pour le Client (Hôtel Maison Rouge)</b><br/>Nom du signataire :<br/>Titre :<br/><br/><i>Mention manuscrite \"Lu et approuvé\" :</i><br/><br/><br/>Signature :", styles['SignatureText']),
            Paragraph("<b>Pour le Prestataire (Abel DOTONOU)</b><br/>Nom : Abel DOTONOU<br/>Titre : Ingénieur Logiciel indépendant<br/><br/><i>Mention manuscrite \"Lu et approuvé\" :</i><br/><br/><br/>Signature :", styles['SignatureText'])
        ]
    ]
    sig_table = Table(sig_data, colWidths=[240, 240])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    
    story.append(KeepTogether([
        Paragraph("Fait à Cotonou, le ______________________ en deux exemplaires originaux.", styles['ContractBody']),
        Spacer(1, 15),
        sig_table
    ]))

    # Build PDF
    doc.build(story, canvasmaker=ContractCanvas)

if __name__ == "__main__":
    output_pdf = r"C:\Users\original\Desktop\UNIR\BENIN_WEALTH_ENGINE\machine-prospection\leads\contrat_prestation_maison_rouge.pdf"
    print(f"Génération du contrat PDF vers : {output_pdf}")
    generer_contrat_pdf(output_pdf)
    print("Contrat PDF généré avec succès !")
