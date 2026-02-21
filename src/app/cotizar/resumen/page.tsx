'use client';

import { useQuoteStore } from '@/store/quoteStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    ArrowLeft, FileText, Mail, MessageCircle, CircleDollarSign,
    CheckCircle2, Loader2
} from 'lucide-react';

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

export default function ResumenPage() {
    const { selectedItems, formData, getTotal, getItemsWithPrice, getItemsQuoteOnly } = useQuoteStore();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const itemsWithPrice = getItemsWithPrice();
    const itemsQuoteOnly = getItemsQuoteOnly();
    const total = getTotal(formData.guestCount, formData.eventHours);

    const handleSendQuote = async () => {
        if (!formData.email || !formData.fullName) {
            alert('Por favor completa tu nombre y email antes de enviar.');
            return;
        }
        setSending(true);
        try {
            const res = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formData, selectedItems, total }),
            });
            if (res.ok) {
                router.push('/gracias');
            } else {
                alert('Hubo un error al enviar. Intenta de nuevo.');
            }
        } catch {
            alert('Error de conexión. Intenta de nuevo.');
        } finally {
            setSending(false);
        }
    };

    // Group by category
    const categories = [...new Set(selectedItems.map(i => i.categoryName))];

    return (
        <>
            <Header />
            <main className="min-h-screen pt-20 pb-16">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Back */}
                    <Link href="/cotizar" className="text-xs text-[#c9a96e] hover:underline flex items-center gap-1 mt-6 mb-4">
                        <ArrowLeft className="w-3 h-3" />
                        Volver al cotizador
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                            Resumen de tu <span className="text-gold-gradient">cotización</span>
                        </h1>
                        <p className="text-sm text-[#888]">
                            Revisa tu selección antes de descargar o enviar.
                        </p>
                    </div>

                    {/* Client info */}
                    <div className="glass-card p-5 mb-6">
                        <h3 className="text-xs font-semibold text-[#c9a96e] uppercase tracking-wider mb-3">Datos del evento</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div><span className="text-[#555]">Nombre:</span> <span className="text-white">{formData.fullName || '—'}</span></div>
                            <div><span className="text-[#555]">Email:</span> <span className="text-white">{formData.email || '—'}</span></div>
                            <div><span className="text-[#555]">WhatsApp:</span> <span className="text-white">{formData.whatsapp || '—'}</span></div>
                            <div><span className="text-[#555]">Ciudad:</span> <span className="text-white">{formData.city || '—'}</span></div>
                            <div><span className="text-[#555]">Fecha:</span> <span className="text-white">{formData.tentativeDate || '—'}</span></div>
                            <div><span className="text-[#555]">Invitados:</span> <span className="text-white">{formData.guestCount}</span></div>
                            <div><span className="text-[#555]">Horas:</span> <span className="text-white">{formData.eventHours}</span></div>
                        </div>
                    </div>

                    {/* Items table */}
                    {categories.map(cat => {
                        const catItems = selectedItems.filter(i => i.categoryName === cat);
                        const catSubtotal = catItems.reduce((sum, sel) => {
                            const line = calcLine(sel.item, sel.quantity, formData.guestCount, formData.eventHours);
                            return { min: sum.min + line.min, max: sum.max + line.max };
                        }, { min: 0, max: 0 });

                        return (
                            <div key={cat} className="mb-6">
                                <h3 className="text-sm font-semibold text-[#c9a96e] uppercase tracking-wider mb-3">{cat}</h3>
                                <div className="glass-card overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[#2a2a2a] text-[#888]">
                                                <th className="text-left py-2.5 px-4 font-medium">Servicio</th>
                                                <th className="text-center py-2.5 px-2 font-medium w-16">Cant.</th>
                                                <th className="text-right py-2.5 px-4 font-medium w-24">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {catItems.map(sel => {
                                                const lineTotal = calcLine(sel.item, sel.quantity, formData.guestCount, formData.eventHours);
                                                const isQuoteOnly = sel.item.pricingType === 'quoteOnly' || !sel.item.priceUSD;
                                                return (
                                                    <tr key={sel.item.id} className="border-b border-[#1a1a1a]">
                                                        <td className="py-2.5 px-4">
                                                            <p className="text-white text-xs">{sel.item.name}</p>
                                                            <p className="text-[10px] text-[#555]">{sel.item.unitLabel}</p>
                                                        </td>
                                                        <td className="text-center py-2.5 px-2 text-xs text-[#888]">{sel.quantity}</td>
                                                        <td className="text-right py-2.5 px-4 text-xs font-mono">
                                                            {isQuoteOnly ? (
                                                                <span className="text-[#c9a96e] flex items-center justify-end gap-1">
                                                                    <CircleDollarSign className="w-3 h-3" /> A cotizar
                                                                </span>
                                                            ) : (
                                                                <span className="text-white">
                                                                    {lineTotal.min !== lineTotal.max
                                                                        ? `$${lineTotal.min.toLocaleString()} - $${lineTotal.max.toLocaleString()}`
                                                                        : `$${lineTotal.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        {catSubtotal.max > 0 && (
                                            <tfoot>
                                                <tr className="border-t border-[#2a2a2a]">
                                                    <td colSpan={2} className="py-2 px-4 text-xs text-[#888] text-right">Subtotal Estimado</td>
                                                    <td className="py-2 px-4 text-right text-xs font-mono text-white font-semibold flex justify-end">
                                                        {catSubtotal.min !== catSubtotal.max
                                                            ? `$${catSubtotal.min.toLocaleString()} - $${catSubtotal.max.toLocaleString()}`
                                                            : `$${catSubtotal.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            </div>
                        );
                    })}

                    {/* Grand total */}
                    <div className="glass-card p-5 mb-6 border-[#c9a96e]/20">
                        <div className="flex flex-col gap-1 items-start">
                            <span className="text-lg font-semibold text-white">Inversión Estimada</span>
                            <span className="text-3xl font-bold text-gold-gradient leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                                {total.min !== total.max
                                    ? `$${total.min.toLocaleString()} - $${total.max.toLocaleString()}`
                                    : `$${total.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            </span>
                        </div>
                        {itemsQuoteOnly.length > 0 && (
                            <p className="text-xs text-[#888] mt-2">
                                + {itemsQuoteOnly.length} ítems pendientes de cotización (estos requieren confirmación con tu event planner).
                            </p>
                        )}
                        <p className="text-[10px] text-[#555] mt-2">
                            Valores referenciales sujetos a confirmación final. Este documento sirve como base
                            para ajustar alcance, calidades y logística con tu event planner.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <button
                            onClick={handleSendQuote}
                            disabled={sending}
                            className="btn-gold flex-1 justify-center !py-3.5"
                        >
                            {sending ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                            ) : (
                                <><Mail className="w-4 h-4" /> Enviar a mi correo</>
                            )}
                        </button>
                        <a
                            href={`https://wa.me/593969324140?text=${encodeURIComponent(
                                `Hola, acabo de armar mi cotización de quinceañera:\n• ${selectedItems.length} servicios seleccionados\n• Inversión estimada: $${total.min.toFixed(2)}${total.max !== total.min ? ` - $${total.max.toFixed(2)}` : ''} USD\n• ${itemsQuoteOnly.length} ítems adicionales para cotizar a la medida\n\nQuiero agendar una llamada para confirmar detalles.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost flex-1 justify-center !py-3.5"
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </a>
                    </div>

                    {/* Next step note */}
                    <div className="text-center">
                        <p className="text-xs text-[#555]">
                            Para cerrar detalles (cronograma, diseño, técnica y proveedores), agenda una llamada
                            de 15–20 min con nuestra event planner.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
