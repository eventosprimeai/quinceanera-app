import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';

/* ─── STYLES ─── */
const c = {
    gold: '#c9a96e',
    bg: '#1a1a1a',
    card: '#222222',
    border: '#333333',
    text: '#e0e0e0',
    muted: '#888888',
    dark: '#111111',
};

const s = StyleSheet.create({
    page: { backgroundColor: c.dark, padding: 40, fontFamily: 'Helvetica', color: c.text, fontSize: 10 },
    header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: c.border, paddingBottom: 15 },
    title: { fontSize: 22, color: c.gold, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    subtitle: { fontSize: 10, color: c.muted },
    quoteId: { fontSize: 8, color: c.muted, marginTop: 4 },
    section: { marginBottom: 16 },
    sectionTitle: { fontSize: 11, color: c.gold, fontFamily: 'Helvetica-Bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
    infoItem: { backgroundColor: c.card, borderRadius: 6, padding: 8, width: '48%' },
    infoLabel: { fontSize: 7, color: c.muted, marginBottom: 2, textTransform: 'uppercase' },
    infoValue: { fontSize: 10, color: c.text },
    table: { borderWidth: 1, borderColor: c.border, borderRadius: 6, overflow: 'hidden' },
    tableHeader: { flexDirection: 'row', backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.border, paddingVertical: 6, paddingHorizontal: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#1a1a1a', paddingVertical: 5, paddingHorizontal: 8 },
    colName: { width: '55%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '30%', textAlign: 'right' },
    thText: { fontSize: 8, color: c.muted, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' },
    tdText: { fontSize: 9, color: c.text },
    tdMuted: { fontSize: 7, color: c.muted, marginTop: 1 },
    tdGold: { fontSize: 9, color: c.gold },
    totalBox: { backgroundColor: c.card, borderWidth: 1, borderColor: c.gold, borderRadius: 8, padding: 16, marginTop: 12, alignItems: 'flex-end' },
    totalLabel: { fontSize: 9, color: c.muted },
    totalAmount: { fontSize: 28, color: c.gold, fontFamily: 'Helvetica-Bold', marginTop: 2 },
    totalNote: { fontSize: 7, color: c.muted, marginTop: 4 },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: c.border, paddingTop: 10 },
    footerText: { fontSize: 7, color: '#555555', textAlign: 'center', lineHeight: 1.5 },
    cta: { backgroundColor: c.gold, color: c.dark, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 24, textAlign: 'center', marginTop: 16, fontSize: 11, fontFamily: 'Helvetica-Bold' },
});

/* ─── TYPES ─── */
interface QuotePDFData {
    quoteId: string;
    formData: {
        fullName: string;
        email: string;
        whatsapp: string;
        city: string;
        tentativeDate: string;
        guestCount: number;
        eventHours: number;
        isOutsideGuayaquil: boolean;
    };
    selectedItems: Array<{
        item: { id: string; name: string; pricingType: string; priceUSD?: number | null; priceRange?: { min: number; max: number }; unitLabel: string };
        categoryName: string;
        quantity: number;
    }>;
    total: { min: number; max: number };
}

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

/* ─── PDF COMPONENT ─── */
function QuoteDocument({ data }: { data: QuotePDFData }) {
    const { quoteId, formData: fd, selectedItems, total } = data;
    const categories = [...new Set(selectedItems.map(i => i.categoryName))];
    const quoteOnlyCount = selectedItems.filter(s => (!s.item.priceUSD && !s.item.priceRange) || s.item.pricingType === 'quoteOnly').length;

    return React.createElement(Document, {},
        React.createElement(Page, { size: 'A4', style: s.page },
            // Header
            React.createElement(View, { style: s.header },
                React.createElement(Text, { style: s.title }, 'Cotización Preliminar'),
                React.createElement(Text, { style: s.subtitle }, 'Producción integral de quinceañera · PrimeAI Events'),
                React.createElement(Text, { style: s.quoteId }, `Ref: ${quoteId} · ${new Date().toLocaleDateString('es-EC')}`)
            ),

            // Client info
            React.createElement(View, { style: s.section },
                React.createElement(Text, { style: s.sectionTitle }, 'Datos del evento'),
                React.createElement(View, { style: s.infoGrid },
                    ...[
                        ['Nombre', fd.fullName],
                        ['Email', fd.email],
                        ['WhatsApp', fd.whatsapp || '—'],
                        ['Ciudad', fd.city || '—'],
                        ['Fecha', fd.tentativeDate || '—'],
                        ['Invitados', String(fd.guestCount)],
                        ['Horas', String(fd.eventHours)],
                        ['Viáticos', fd.isOutsideGuayaquil ? 'Sí (fuera de Guayaquil)' : 'No aplica'],
                    ].map(([label, value], i) =>
                        React.createElement(View, { key: i, style: s.infoItem },
                            React.createElement(Text, { style: s.infoLabel }, label),
                            React.createElement(Text, { style: s.infoValue }, value)
                        )
                    )
                )
            ),

            // Items by category
            ...categories.map(cat => {
                const items = selectedItems.filter(si => si.categoryName === cat);
                return React.createElement(View, { key: cat, style: s.section },
                    React.createElement(Text, { style: s.sectionTitle }, cat),
                    React.createElement(View, { style: s.table },
                        // Table header
                        React.createElement(View, { style: s.tableHeader },
                            React.createElement(Text, { style: { ...s.thText, ...s.colName } }, 'Servicio'),
                            React.createElement(Text, { style: { ...s.thText, ...s.colQty } }, 'Cant.'),
                            React.createElement(Text, { style: { ...s.thText, ...s.colPrice } }, 'Subtotal')
                        ),
                        // Rows
                        ...items.map((si, idx) => {
                            const isQO = (!si.item.priceUSD && !si.item.priceRange) || si.item.pricingType === 'quoteOnly';
                            const line = calcLine(si.item, si.quantity, fd.guestCount, fd.eventHours);
                            const valStr = isQO ? 'A cotizar' : (line.min !== line.max ? '$' + line.min.toLocaleString('en-US') + ' - $' + line.max.toLocaleString('en-US') : '$' + line.min.toLocaleString('en-US', { minimumFractionDigits: 2 }));

                            return React.createElement(View, { key: idx, style: s.tableRow },
                                React.createElement(View, { style: s.colName },
                                    React.createElement(Text, { style: s.tdText }, si.item.name),
                                    React.createElement(Text, { style: s.tdMuted }, si.item.unitLabel)
                                ),
                                React.createElement(Text, { style: { ...s.tdText, ...s.colQty } }, String(si.quantity)),
                                React.createElement(Text, { style: { ...(isQO ? s.tdGold : s.tdText), ...s.colPrice } },
                                    valStr
                                )
                            );
                        })
                    )
                );
            }),

            // Total
            React.createElement(View, { style: s.totalBox },
                React.createElement(Text, { style: s.totalLabel }, 'Total estimado'),
                React.createElement(Text, { style: s.totalAmount }, total.min !== total.max ? `$${total.min.toLocaleString('en-US')} - $${total.max.toLocaleString('en-US')}` : `$${total.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`),
                quoteOnlyCount > 0
                    ? React.createElement(Text, { style: s.totalNote }, `+ ${quoteOnlyCount} ítems pendientes de cotización`)
                    : null
            ),

            // CTA
            React.createElement(View, { style: { alignItems: 'center', marginTop: 20 } },
                React.createElement(Text, { style: s.cta }, 'Agendar llamada: wa.me/593969324140')
            ),

            // Footer
            React.createElement(View, { style: s.footer },
                React.createElement(Text, { style: s.footerText },
                    'Valores referenciales sujetos a confirmación final. Este documento sirve como base para ajustar alcance, calidades y logística con tu event planner.\n© ' + new Date().getFullYear() + ' PrimeAI Events · Guayaquil, Ecuador'
                )
            )
        )
    );
}

/* ─── EXPORT ─── */
export async function generateQuotePDF(data: QuotePDFData): Promise<Buffer> {
    const doc = React.createElement(QuoteDocument, { data });
    const buffer = await renderToBuffer(doc as any);
    return Buffer.from(buffer);
}
