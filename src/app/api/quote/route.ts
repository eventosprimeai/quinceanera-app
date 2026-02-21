import { NextRequest, NextResponse } from 'next/server';
import { saveQuote, markEmailSent, markPdfGenerated } from '@/lib/db';
import { sendQuoteEmail } from '@/lib/email';
import { generateQuotePDF } from '@/lib/pdf';

function sanitize(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, selectedItems, total } = body;

    // Validate required fields
    if (!formData?.fullName || !formData?.email) {
      return NextResponse.json({ error: 'Nombre y email son requeridos.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    // Sanitize
    const cleanData = {
      fullName: sanitize(formData.fullName),
      email: sanitize(formData.email),
      whatsapp: sanitize(formData.whatsapp || ''),
      city: sanitize(formData.city || ''),
      tentativeDate: sanitize(formData.tentativeDate || ''),
      guestCount: Number(formData.guestCount) || 100,
      eventHours: Number(formData.eventHours) || 6,
      isOutsideGuayaquil: Boolean(formData.isOutsideGuayaquil),
    };

    const quoteId = `Q-${Date.now().toString(36).toUpperCase()}`;
    const itemsQuoteOnly = selectedItems.filter(
      (s: any) => s.item.priceUSD === null || s.item.pricingType === 'quoteOnly'
    );

    // 1. Save to database
    try {
      saveQuote({
        quoteId,
        ...cleanData,
        selectedItems,
        totalEstimated: Number(total) || 0,
        itemsCount: selectedItems.length,
        quoteOnlyCount: itemsQuoteOnly.length,
      });
      console.log(`[DB] Quote ${quoteId} saved.`);
    } catch (dbErr) {
      console.error('[DB] Error saving quote:', dbErr);
      // Continue even if DB fails
    }

    // 2. Generate PDF
    let pdfBuffer: Buffer | undefined;
    try {
      pdfBuffer = await generateQuotePDF({
        quoteId,
        formData: cleanData,
        selectedItems,
        total: Number(total) || 0,
      });
      markPdfGenerated(quoteId);
      console.log(`[PDF] Generated for ${quoteId} (${pdfBuffer.length} bytes)`);
    } catch (pdfErr) {
      console.error('[PDF] Error generating PDF:', pdfErr);
    }

    // 3. Build email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 40px 30px;">
        <h1 style="color: #c9a96e; font-size: 22px; margin-bottom: 4px;">Cotización Preliminar</h1>
        <p style="color: #888; font-size: 12px; margin-bottom: 20px;">Ref: ${quoteId} · Producción integral de quinceañera</p>
        
        <div style="background: #141414; border: 1px solid #2a2a2a; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <p style="color: #888; font-size: 12px; margin: 3px 0;"><strong style="color: #ccc;">Nombre:</strong> ${cleanData.fullName}</p>
          <p style="color: #888; font-size: 12px; margin: 3px 0;"><strong style="color: #ccc;">Email:</strong> ${cleanData.email}</p>
          <p style="color: #888; font-size: 12px; margin: 3px 0;"><strong style="color: #ccc;">Ciudad:</strong> ${cleanData.city || '—'}</p>
          <p style="color: #888; font-size: 12px; margin: 3px 0;"><strong style="color: #ccc;">Invitados:</strong> ${cleanData.guestCount} · <strong style="color: #ccc;">Horas:</strong> ${cleanData.eventHours}</p>
        </div>

        <h2 style="color: #c9a96e; font-size: 14px; margin: 16px 0 8px;">Servicios (${selectedItems.length})</h2>
        ${selectedItems.map((s: any) => `
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #1a1a1a; font-size: 12px;">
            <span style="color: #ccc;">${sanitize(s.item.name)}</span>
            <span style="color: ${!s.item.priceUSD || s.item.pricingType === 'quoteOnly' ? '#c9a96e' : '#fff'};">
              ${!s.item.priceUSD || s.item.pricingType === 'quoteOnly' ? 'A cotizar' : '$' + (s.item.priceUSD * s.quantity).toFixed(2)}
            </span>
          </div>
        `).join('')}

        <div style="background: #141414; border: 1px solid rgba(201,169,110,0.2); border-radius: 10px; padding: 16px; margin-top: 16px; text-align: right;">
          <p style="color: #888; font-size: 11px; margin: 0;">Total estimado</p>
          <p style="color: #c9a96e; font-size: 26px; font-weight: bold; margin: 4px 0;">$${Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          ${itemsQuoteOnly.length > 0 ? `<p style="color: #555; font-size: 10px;">+ ${itemsQuoteOnly.length} ítems pendientes de cotización</p>` : ''}
        </div>

        <p style="color: #555; font-size: 10px; margin-top: 16px; line-height: 1.6;">
          Valores referenciales sujetos a confirmación final.
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://wa.me/593969324140" style="display: inline-block; background: #c9a96e; color: #0a0a0a; padding: 10px 28px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 13px;">
            Agendar llamada
          </a>
        </div>

        <p style="color: #444; font-size: 9px; text-align: center; margin-top: 24px;">
          © ${new Date().getFullYear()} PrimeAI Events · Guayaquil, Ecuador
        </p>
      </div>
    `;

    // 4. Send email — DESACTIVADO temporalmente
    // try {
    //   const emailSent = await sendQuoteEmail({
    //     to: cleanData.email,
    //     clientName: cleanData.fullName,
    //     quoteId,
    //     htmlBody: emailHtml,
    //     pdfBuffer,
    //   });
    //   if (emailSent) markEmailSent(quoteId);
    // } catch (emailErr) {
    //   console.error('[EMAIL] Error:', emailErr);
    // }
    console.log('[EMAIL] Envío de email desactivado temporalmente.');

    return NextResponse.json({
      success: true,
      message: 'Cotización procesada correctamente.',
      quoteId,
    });
  } catch (error) {
    console.error('Error processing quote:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
