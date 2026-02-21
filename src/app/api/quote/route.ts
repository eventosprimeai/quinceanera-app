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
      (s: any) => (!s.item.priceUSD && !s.item.priceRange) || s.item.pricingType === 'quoteOnly'
    );
    const totalObj = typeof total === 'object' && total !== null ? total : { min: Number(total) || 0, max: Number(total) || 0 };

    function calcLine(item: any, qty: number, guests: number, hours: number): { min: number; max: number } {
      if (item.pricingType === 'range' && item.priceRange) {
        let multiplier = 1;
        const labels = (item.unitLabel || '').toLowerCase();
        if (labels.includes('invitado') || labels.includes('persona')) multiplier = guests;
        else if (labels.includes('hora')) multiplier = hours;
        else if (labels.includes('unidad') || labels.includes('set') || labels.includes('pastel')) multiplier = qty;
        return { min: item.priceRange.min * multiplier, max: item.priceRange.max * multiplier };
      }

      if (!item.priceUSD) return { min: 0, max: 0 };
      switch (item.pricingType) {
        case 'fixed': return { min: item.priceUSD, max: item.priceUSD };
        case 'perPerson': return { min: item.priceUSD * guests, max: item.priceUSD * guests };
        case 'perHour': return { min: item.priceUSD * hours, max: item.priceUSD * hours };
        case 'perUnit': return { min: item.priceUSD * qty, max: item.priceUSD * qty };
        default: return { min: 0, max: 0 };
      }
    }

    // 1. Save to database
    try {
      saveQuote({
        quoteId,
        ...cleanData,
        selectedItems,
        totalEstimated: totalObj.min || 0,
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
        total: totalObj,
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
        ${selectedItems.map((s: any) => {
      const isQO = (!s.item.priceUSD && !s.item.priceRange) || s.item.pricingType === 'quoteOnly';
      const line = calcLine(s.item, s.quantity, cleanData.guestCount, cleanData.eventHours);
      const valStr = isQO ? 'A cotizar' : (line.min !== line.max ? '$' + line.min.toLocaleString('en-US') + ' - $' + line.max.toLocaleString('en-US') : '$' + line.min.toLocaleString('en-US', { minimumFractionDigits: 2 }));

      return `
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #1a1a1a; font-size: 12px;">
            <span style="color: #ccc;">${sanitize(s.item.name)}</span>
            <span style="color: ${isQO ? '#c9a96e' : '#fff'};">
              ${valStr}
            </span>
          </div>
        `}).join('')}

        <div style="background: #141414; border: 1px solid rgba(201,169,110,0.2); border-radius: 10px; padding: 16px; margin-top: 16px; text-align: right;">
          <p style="color: #888; font-size: 11px; margin: 0;">Total estimado</p>
          <p style="color: #c9a96e; font-size: 26px; font-weight: bold; margin: 4px 0;">
            ${totalObj.min !== totalObj.max ? '$' + totalObj.min.toLocaleString('en-US') + ' - $' + totalObj.max.toLocaleString('en-US') : '$' + totalObj.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
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

    // 4. Send email
    try {
      const emailSent = await sendQuoteEmail({
        to: cleanData.email,
        clientName: cleanData.fullName,
        quoteId,
        htmlBody: emailHtml,
        pdfBuffer,
      });
      if (emailSent) markEmailSent(quoteId);
    } catch (emailErr) {
      console.error('[EMAIL] Error:', emailErr);
    }

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
