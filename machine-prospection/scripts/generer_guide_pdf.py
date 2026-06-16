# -*- coding: utf-8 -*-
import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
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
        
        # Ne pas mettre d'en-tête ni de pied de page sur la page de couverture (page 1)
        if self._pageNumber == 1:
            self.restoreState()
            return
            
        # Draw running header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#CA8A04"))
        self.drawString(54, 790, "BENIN WEALTH ENGINE")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#78716C"))
        self.drawRightString(A4[0] - 54, 790, "Maison Rouge Cotonou - Guide Stratégique de Closing")
        
        # Draw header separator line
        self.setStrokeColor(colors.HexColor("#E7E5E4"))
        self.setLineWidth(0.5)
        self.line(54, 782, A4[0] - 54, 782)
        
        # Draw footer separator line
        self.line(54, 50, A4[0] - 54, 50)
        
        # Draw footer
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1C1917"))
        self.drawString(54, 38, "Abel DOTONOU")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#78716C"))
        self.drawString(135, 38, "|   Ingénieur Logiciel & Spécialiste Vente")
        
        page_str = f"Page {self._pageNumber} sur {page_count}"
        self.drawRightString(A4[0] - 54, 38, page_str)
        self.restoreState()

def generer_pdf(output_path):
    # A4 margins: 2cm top/bottom, 2cm left/right
    margin = 54 # 54 points = 0.75 inch = 1.9 cm
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin + 20,
        bottomMargin=margin + 10
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    styles.add(ParagraphStyle(
        name='CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0C0A09"),
        alignment=0, # Left aligned
        spaceAfter=15
    ))
    
    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#78716C"),
        spaceAfter=30
    ))

    styles.add(ParagraphStyle(
        name='CoverMeta',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1C1917"),
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='H1',
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0C0A09"),
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='H2',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#CA8A04"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='Body',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1C1917"),
        spaceAfter=10
    ))

    styles.add(ParagraphStyle(
        name='BodyBold',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1C1917"),
        spaceAfter=10
    ))

    styles.add(ParagraphStyle(
        name='ResponseQuote',
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#292524"),
    ))

    styles.add(ParagraphStyle(
        name='CalloutText',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#065F46"),
    ))

    story = []
    
    # ------------------ COVER PAGE ------------------
    story.append(Spacer(1, 100))
    story.append(Paragraph("MAISON ROUGE COTONOU", ParagraphStyle(
        name='CoverKicker',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#CA8A04"),
        spaceAfter=10
    )))
    story.append(Paragraph("GUIDE DE CLOSING & TRAITEMENT DES OBJECTIONS", styles['CoverTitle']))
    story.append(Paragraph("Stratégie commerciale d'élite pour la vente et l'intégration du moteur de réservation automatisé.", styles['CoverSubtitle']))
    
    # Decorative line
    d_line = Table([[""]], colWidths=[A4[0] - 108])
    d_line.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 3, colors.HexColor("#CA8A04")),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(d_line)
    story.append(Spacer(1, 150))
    
    # Metadata block
    story.append(Paragraph("<b>Préparé par :</b> Abel DOTONOU", styles['CoverMeta']))
    story.append(Paragraph("<b>Expertise :</b> Ingénieur Logiciel & Systèmes de Vente", styles['CoverMeta']))
    story.append(Paragraph("<b>Date du rendez-vous :</b> Vendredi 19 juin 2026 à 10h30", styles['CoverMeta']))
    story.append(Paragraph("<b>Lieu :</b> Hôtel Maison Rouge, Haie Vive, Cotonou (Bénin)", styles['CoverMeta']))
    story.append(Paragraph("<b>Version :</b> 5.0 APEX (Juin 2026)", styles['CoverMeta']))
    
    story.append(PageBreak())
    
    # ------------------ SECTION 1 : LE RENDEZ-VOUS ------------------
    story.append(Paragraph("1. LE CADRAGE DU RENDEZ-VOUS PHYSIQUE", styles['H1']))
    story.append(Paragraph(
        "Ce rendez-vous dans les locaux de la <b>Maison Rouge</b> est l'opportunité décisive de sécuriser le projet. "
        "Le directeur et ses équipes veulent valider ton professionnalisme en personne. Ta posture doit être celle d'un "
        "<b>consultant apporteur de valeur</b>, et non celle d'un simple exécutant technique.",
        styles['Body']
    ))
    
    story.append(Paragraph("Le Déroulé Stratégique (25 minutes)", styles['H2']))
    story.append(Paragraph(
        "<b>1. Introduction (5 min) :</b> Remercie pour l'accueil, valorise le cadre exceptionnel de la Maison Rouge, et place le débat sur le terrain financier : <i>\"Je ne viens pas vous vendre un site Internet de plus. Je viens vous montrer comment l'alliance du code moderne et de l'automatisation récupère le chiffre d'affaires actuellement capté par Booking.com.\"</i>",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>2. Le Diagnostic (10 min) :</b> Explique qu'en e-commerce, la lenteur mobile coûte cher. Le site actuel met plus de 4 secondes à charger sur mobile au Bénin. Chaque seconde de trop fait fuir 7% de clients. De plus, les réservations manuelles surchargent la réception et provoquent des pertes de réservations à cause du délai de traitement.",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>3. La Démo Mobile Live (5 min) :</b> Ouvre le site <font color='#CA8A04'>https://vitrine-elite.vercel.app/</font> sur ton téléphone. Invite le directeur à saisir son nom dans le bac à sable et cliquer sur <i>Réserver</i>. Montre-lui la vitesse d'affichage, le flux de paiement FedaPay simulé, et l'alerte instantanée sur ton WhatsApp/Telegram.",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>4. L'Offre Commerciale 0 Risque (5 min) :</b> Propose le prototype gratuit sous 5 jours. Ils ne payent l'installation de 250 000 FCFA que s'ils valident la maquette. Garantie satisfait ou remboursé de 30 jours.",
        styles['Body']
    ))
    
    story.append(Spacer(1, 10))
    
    # ------------------ SECTION 2 : LES OBJECTIONS TECHNIQUE ------------------
    story.append(Paragraph("2. LE TRAITEMENT DES OBJECTIONS TECHNIQUES", styles['H1']))
    story.append(Paragraph(
        "Voici les fiches de réponse prêtes à l'emploi face aux questions techniques et doutes de la direction hôtelière.",
        styles['Body']
    ))
    
    def make_objection_card(number, title, explanation, response_text):
        content = [
            Paragraph(f"<b>OBJECTION {number} : \"{title}\"</b>", styles['H2']),
            Paragraph(f"<b>Ce que le client veut valider :</b> {explanation}", styles['Body']),
            Spacer(1, 4),
        ]
        
        # Quote table
        q_para = Paragraph(f"<b>Ta réponse :</b><br/>\"{response_text}\"", styles['ResponseQuote'])
        q_table = Table([[q_para]], colWidths=[A4[0] - 138])
        q_table.setStyle(TableStyle([
            ('LINEBEFORE', (0,0), (0,-1), 4, colors.HexColor("#CA8A04")),
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FAF8F5")),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ]))
        
        content.append(q_table)
        content.append(Spacer(1, 12))
        return KeepTogether(content)

    # Obj 1
    story.append(make_objection_card(
        1, "Comment fonctionne l'automatisation concrètement ?",
        "Est-ce que cela va surcharger le travail de mes réceptionnistes ?",
        "C'est transparent. Le client réserve en 3 clics sur son mobile. Il reçoit une confirmation WhatsApp automatique instantanée. Votre réception reçoit au même moment une alerte structurée sur son téléphone (via Telegram ou WhatsApp). Toutes les réservations s'inscrivent automatiquement dans un tableau Excel de suivi. Zéro ressaisie manuelle."
    ))

    # Obj 2
    story.append(make_objection_card(
        2, "Pourquoi Next.js/React et pas un site WordPress ?",
        "Quelle différence et pourquoi ce prix ?",
        "WordPress est lourd et vulnérable aux piratages. Il met plus de 4 secondes à charger sur mobile au Bénin. Next.js est la technologie ultra-rapide de Netflix et TikTok. Le site charge en moins d'une seconde, éliminant les abandons de clients VIP pressés. Il est nativement sécurisé et offre le meilleur référencement."
    ))

    # Obj 3
    story.append(make_objection_card(
        3, "Y a-t-il des abonnements mensuels récurrents ?",
        "Vais-je me retrouver lié financièrement ?",
        "Non, il n'y a aucun abonnement récurrent. L'hébergement de votre moteur sur Vercel est gratuit à vie. Les seuls frais minimes à prévoir sont les SMS de confirmation (environ 5 à 10 FCFA par envoi via l'API locale), qui sont facturés directement selon votre consommation."
    ))

    # Obj 4
    story.append(make_objection_card(
        4, "Comment allez-vous faire l'intégration sur le site actuel ?",
        "Vais-je subir une panne de mon site ou de mes emails pendant le déploiement ?",
        "L'intégration est 100% sécurisée et sans interruption de service. Nous hébergeons le moteur de réservation sur un sous-domaine dédié (ex: reservation.maison-rouge-cotonou.com). Votre site actuel reste inchangé. Votre webmaster ajoute simplement un bouton 'Réserver' sur votre menu principal qui pointe vers notre moteur. Configuration en 15 minutes."
    ))

    story.append(PageBreak())

    # Obj 5
    story.append(make_objection_card(
        5, "Notre page Instagram/Facebook nous suffit largement.",
        "Pourquoi dépenser dans un site propre ?",
        "Vos réseaux sociaux sont une superbe vitrine, mais ils appartiennent à Meta. Si votre compte est bloqué, vous perdez votre canal de vente. De plus, répondre manuellement aux DM prend du temps à vos équipes et génère des erreurs de réservation. Notre système convertit automatiquement le trafic de vos réseaux 24h/24."
    ))

    # Obj 6
    story.append(make_objection_card(
        6, "Quelle est la garantie que le projet sera bien livré ?",
        "Puis-je vous faire confiance avant de payer ?",
        "Pour prouver mon sérieux, je prends tout le risque sur mes épaules. Je développe gratuitement votre prototype personnalisé sous 5 jours. Vous le testez sur votre propre téléphone. Vous ne payez les 250 000 FCFA que si le prototype vous convient et que nous décidons de le mettre en ligne."
    ))

    # Obj 7
    story.append(make_objection_card(
        7, "Quelles sont vos références ? Avec qui avez-vous travaillé ?",
        "Êtes-vous expérimenté ou un débutant à risque ?",
        "Je suis ingénieur logiciel indépendant spécialisé dans les systèmes de vente rapides. Plutôt que des logos, ma meilleure référence est le prototype fonctionnel que je conçois gratuitement pour vous. Contrairement aux grandes agences qui vous traitent comme un numéro parmi 50, je me consacre exclusivement à la réussite de Maison Rouge. C'est pourquoi je propose un prototype gratuit et une garantie de remboursement de 30 jours."
    ))

    # Obj 8
    story.append(make_objection_card(
        8, "Comment avez-vous trouvé cette lacune sur notre site ?",
        "Est-ce une démarche de prospection structurée ?",
        "En tant que spécialiste local, j'analyse les outils de vente à Cotonou. J'ai effectué un audit technique de performance mobile sur votre site. Le chargement mobile prend plus de 4 secondes locales. En e-commerce, chaque seconde supplémentaire fait perdre environ 7% de clients. C'est en mesurant ce manque à gagner que j'ai décidé de concevoir ce prototype."
    ))

    story.append(PageBreak())

    # ------------------ SECTION 3 : NEGOCIATION & CADRAGE ------------------
    story.append(Paragraph("3. NÉGOCIATION & SÉCURISATION DU CONTRAT", styles['H1']))
    
    story.append(Paragraph("Comment négocier le prix de 250 000 FCFA ?", styles['H2']))
    story.append(Paragraph(
        "Ne baisse jamais ton prix sous la pression sans réduire le travail. 250 000 FCFA est déjà un tarif très bas. Si le client insiste pour négocier, utilise ces deux solutions :",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>Solution 1 : L'échelonnement (Facilité de paiement)</b><br/>"
        "<i>\"Pour faciliter votre trésorerie, nous pouvons échelonner le règlement : 125 000 FCFA à la livraison du prototype opérationnel, et 125 000 FCFA 30 jours après le lancement en ligne.\"</i>",
        styles['Body']
    ))
    story.append(Paragraph(
        "<b>Solution 2 : La réduction de périmètre technique</b><br/>"
        "<i>\"Si votre budget limite est de 200 000 FCFA, c'est possible. Cependant, nous devrons retirer le module d'envoi automatique de SMS pour ne conserver que les alertes automatiques WhatsApp et Telegram, car l'intégration de la passerelle SMS nécessite une configuration supplémentaire.\"</i>",
        styles['Body']
    ))
    
    story.append(Spacer(1, 10))

    story.append(Paragraph("Comment te protéger de la garantie de remboursement ?", styles['H2']))
    story.append(Paragraph(
        "Pour éviter d'avoir à rembourser la totalité de l'argent après 30 jours si tu l'as déjà utilisé, structure clairement ton contrat commercial et ta proposition :",
        styles['Body']
    ))
    
    # Alert block for contract structure
    c_text = Paragraph(
        "<b>CONTRAT SÉCURISÉ - STRUCTURE DE PAIEMENT :</b><br/>"
        "1. <b>Frais de Conception et d'Installation (150 000 FCFA) :</b> Rémunère les heures de codage, de mise en place de la base de données et de configuration. Cette somme est <b>ferme et non remboursable</b> dès la livraison du prototype.<br/>"
        "2. <b>Frais de Succès Optionnels (100 000 FCFA) :</b> C'est cette seconde partie qui est soumise à la garantie de 30 jours. Si le système n'enregistre aucune réservation directe sous 30 jours, tu ne rembourses que cette part de succès.<br/>"
        "3. <b>Critère de Résultat Objectif :</b> La garantie s'applique uniquement si le bouton de réservation est resté visible en haut de page d'accueil pendant 30 jours continus et que l'outil a comptabilisé moins de 10 réservations automatiques.",
        styles['CalloutText']
    )
    c_table = Table([[c_text]], colWidths=[A4[0] - 108])
    c_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#D1FAE5")),
        ('BORDER', (0,0), (-1,-1), 0.5, colors.HexColor("#10B981")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('RIGHTPADDING', (0,0), (-1,-1), 15),
    ]))
    story.append(c_table)
    
    story.append(Spacer(1, 15))

    # ------------------ SECTION 4 : CHECK-LIST DU RENDEZ-VOUS ------------------
    story.append(Paragraph("4. CHECK-LIST POUR RÉUSSIR TON RENDEZ-VOUS", styles['H1']))
    
    checklist_text = Paragraph(
        "<b>AVANT DE PARTIR :</b><br/>"
        "• Charge ton smartphone à 100%. Garde l'onglet de ta démonstration ouvert : <font color='#CA8A04'>https://vitrine-elite.vercel.app/</font>.<br/>"
        "• Assure-toi d'avoir une connexion Internet mobile stable (MTN ou Moov) pour faire la démonstration en direct.<br/>"
        "• Prépare un carnet physique et un stylo. Prendre des notes montre que tu es un consultant attentif.<br/><br/>"
        "<b>PENDANT LE RENDEZ-VOUS :</b><br/>"
        "• Ne parle pas de code complexe. Parle de <b>conversion, de clients récupérés et de commissions Booking évitées</b>.<br/>"
        "• Pose des questions ouvertes : <i>\"Comment se passe la gestion des réservations aujourd'hui ? Combien d'heures cela prend-il à vos équipes ?\"</i>.<br/>"
        "• Fais tester la démo par le directeur lui-même. C'est le clic sur son propre écran qui déclenche l'acte d'achat.",
        styles['Body']
    )
    story.append(checklist_text)
    
    story.append(Spacer(1, 40))
    story.append(Paragraph("<b>Force à toi Abel ! Tu as toutes les clés pour réussir ce closing.</b>", ParagraphStyle(
        name='FooterNote',
        fontName='Helvetica-BoldOblique',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#CA8A04"),
        alignment=1 # Centered
    )))
    
    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == "__main__":
    output_pdf = r"C:\Users\original\Desktop\UNIR\BENIN_WEALTH_ENGINE\machine-prospection\leads\guide_negociation_maison_rouge.pdf"
    print(f"Génération du fichier PDF vers : {output_pdf}")
    generer_pdf(output_pdf)
    print("PDF généré avec succès !")
