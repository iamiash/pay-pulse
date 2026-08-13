import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_report(
    report_title: str, 
    user_name: str, 
    user_id_code: str, 
    subscriptions_data: list,
    filter_meta: dict = None
) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    story = []
    styles = getSampleStyleSheet()

    # PayPulse High-Rich Cyber Dark Palette
    brand_dark = colors.HexColor("#0B0F19")
    card_bg = colors.HexColor("#111827")
    gold_glow = colors.HexColor("#FECB6E")
    cyan_glow = colors.HexColor("#38BDF8")
    emerald_green = colors.HexColor("#10B981")
    text_muted = colors.HexColor("#94A3B8")
    table_border = colors.HexColor("#1E293B")
    alt_row_bg = colors.HexColor("#182232")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=gold_glow,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=text_muted,
        spaceAfter=12
    )

    header_cell_style = ParagraphStyle(
        'HeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        textColor=colors.white
    )

    body_cell_style = ParagraphStyle(
        'BodyCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        textColor=colors.HexColor("#E2E8F0")
    )

    bold_cell_style = ParagraphStyle(
        'BoldCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        textColor=gold_glow
    )

    # Document Title & Security Clean Header
    story.append(Paragraph("PAYPULSE FINANCIAL REPORT", title_style))
    story.append(Paragraph(
        f"<b>Report:</b> {report_title} &nbsp;|&nbsp; <b>User ID:</b> {user_id_code} &nbsp;|&nbsp; <b>Name:</b> {user_name} &nbsp;|&nbsp; <b>Date:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        subtitle_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.5, color=gold_glow, spaceAfter=14))

    # Analytical Metrics Summary Engine
    total_subs = len(subscriptions_data)
    active_subs = sum(1 for s in subscriptions_data if str(s.get("status", "Active")).lower() == "active")
    total_monthly = sum(
        s.get("cost", 0.0) for s in subscriptions_data 
        if str(s.get("status", "Active")).lower() == "active"
    )
    projected_annual = total_monthly * 12.0

    # Executive KPI Summary Cards
    kpi_data = [
        [
            Paragraph("<b>Active Subscriptions</b>", body_cell_style),
            Paragraph("<b>Monthly Spend Rate</b>", body_cell_style),
            Paragraph("<b>Projected Annual Spend</b>", body_cell_style)
        ],
        [
            Paragraph(f"<font size=11 color='#38BDF8'><b>{active_subs} / {total_subs} Active</b></font>", body_cell_style),
            Paragraph(f"<font size=11 color='#10B981'><b>${total_monthly:.2f}/mo</b></font>", body_cell_style),
            Paragraph(f"<font size=11 color='#FECB6E'><b>${projected_annual:.2f}/yr</b></font>", body_cell_style)
        ]
    ]

    kpi_table = Table(kpi_data, colWidths=[180, 180, 180])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), card_bg),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('BOX', (0, 0), (-1, -1), 1, table_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, table_border),
    ]))

    story.append(kpi_table)
    story.append(Spacer(1, 14))

    # Itemized Breakdown Table
    table_data = [
        [
            Paragraph("Subscription", header_cell_style),
            Paragraph("Category", header_cell_style),
            Paragraph("Plan", header_cell_style),
            Paragraph("Payment Channel", header_cell_style),
            Paragraph("Cost", header_cell_style),
            Paragraph("Next Billing", header_cell_style),
            Paragraph("Status", header_cell_style)
        ]
    ]

    total_cost = 0.0
    for sub in subscriptions_data:
        cost_val = float(sub.get("cost", 0.0))
        total_cost += cost_val

        payment_method = str(sub.get("payment_type", "Card")).capitalize()
        status_text = sub.get("status", "Active")
        status_color = "#10B981" if status_text == "Active" else "#F43F5E"

        table_data.append([
            Paragraph(f"<b>{sub.get('name', 'N/A')}</b>", body_cell_style),
            Paragraph(str(sub.get("category", "N/A")), body_cell_style),
            Paragraph(str(sub.get("plan_type", "N/A")), body_cell_style),
            Paragraph(payment_method, body_cell_style),
            Paragraph(f"${cost_val:.2f}", bold_cell_style),
            Paragraph(str(sub.get("next_billing_date", "N/A")), body_cell_style),
            Paragraph(f"<font color='{status_color}'><b>{status_text}</b></font>", body_cell_style)
        ])

    table_data.append([
        Paragraph("<b>TOTAL COMMITMENT</b>", bold_cell_style),
        Paragraph("", body_cell_style),
        Paragraph("", body_cell_style),
        Paragraph("", body_cell_style),
        Paragraph(f"<b>${total_cost:.2f}</b>", bold_cell_style),
        Paragraph("", body_cell_style),
        Paragraph("", body_cell_style)
    ])

    t = Table(table_data, colWidths=[90, 75, 75, 110, 60, 70, 60])
    
    t_style = [
        ('BACKGROUND', (0, 0), (-1, 0), brand_dark),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, table_border),
        ('BACKGROUND', (0, -1), (-1, -1), card_bg),
        ('TOPPADDING', (0, -1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 10),
    ]

    for row_idx in range(1, len(table_data) - 1):
        bg = alt_row_bg if row_idx % 2 == 0 else card_bg
        t_style.append(('BACKGROUND', (0, row_idx), (-1, row_idx), bg))

    t.setStyle(TableStyle(t_style))
    story.append(t)

    doc.build(story)
    buffer.seek(0)
    return buffer