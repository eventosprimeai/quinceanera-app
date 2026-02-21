'use client';

import { useQuoteStore } from '@/store/quoteStore';
import { X, FileText, Mail, ShoppingBag, CircleDollarSign } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
    onRequestPDF?: () => void;
    mobileMode?: boolean;
}

export default function QuoteSummaryPanel({ onRequestPDF, mobileMode }: Props) {
    const { selectedItems, formData, getTotal, getItemsWithPrice, getItemsQuoteOnly, getSubtotalsByCategory, removeItem } = useQuoteStore();
    const [showMobile, setShowMobile] = useState(false);

    const itemsWithPrice = getItemsWithPrice();
    const itemsQuoteOnly = getItemsQuoteOnly();
    const subtotals = getSubtotalsByCategory();
    const total = getTotal(formData.guestCount, formData.eventHours);

    if (selectedItems.length === 0 && !mobileMode) {
        return (
            <div className="glass-card p-6 text-center">
                <ShoppingBag className="w-8 h-8 text-[#555] mx-auto mb-3" />
                <p className="text-sm text-[#666]">Aún no has seleccionado servicios.</p>
                <p className="text-xs text-[#444] mt-1">Explora las categorías y marca los que te interesen.</p>
            </div>
        );
    }

    const summaryContent = (
        <div className="space-y-4">
            {/* Items with price grouped by category */}
            {Object.entries(subtotals).map(([cat, subtotal]) => {
                const catItems = itemsWithPrice.filter(i => i.categoryName === cat);
                if (catItems.length === 0) return null;
                return (
                    <div key={cat}>
                        <h4 className="text-xs font-semibold text-[#c9a96e] uppercase tracking-wider mb-2">{cat}</h4>
                        {catItems.map(sel => {
                            let lineMin = 0; let lineMax = 0;
                            if (sel.item.pricingType === 'range' && sel.item.priceRange) {
                                let multiplier = 1;
                                const labels = sel.item.unitLabel.toLowerCase();
                                if (labels.includes('invitado') || labels.includes('persona')) multiplier = formData.guestCount;
                                else if (labels.includes('hora')) multiplier = formData.eventHours;
                                else if (labels.includes('unidad') || labels.includes('set') || labels.includes('pastel')) multiplier = sel.quantity;
                                lineMin = sel.item.priceRange.min * multiplier;
                                lineMax = sel.item.priceRange.max * multiplier;
                            } else if (sel.item.priceUSD) {
                                lineMin = sel.item.priceUSD * sel.quantity;
                                lineMax = sel.item.priceUSD * sel.quantity;
                            }

                            return (
                                <div key={sel.item.id} className="flex items-center justify-between py-1.5 group">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-xs text-[#ccc] truncate">{sel.item.name}</p>
                                        <p className="text-[10px] text-[#555]">{sel.quantity}x · {sel.item.unitLabel}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs font-mono text-white text-right">
                                            {lineMin !== lineMax
                                                ? `$${lineMin.toLocaleString()} - $${lineMax.toLocaleString()}`
                                                : `$${lineMin.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeItem(sel.item.id); }}
                                            className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 transition-all"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-between text-xs font-medium text-[#888] border-t border-[#2a2a2a] pt-1.5 mt-1.5">
                            <span>Subtotal Estimado</span>
                            <span>{subtotal.min !== subtotal.max ? `$${subtotal.min.toLocaleString()} - $${subtotal.max.toLocaleString()}` : `$${subtotal.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}</span>
                        </div>
                    </div>
                );
            })}

            {/* Quote-only items */}
            {itemsQuoteOnly.length > 0 && (
                <div>
                    <h4 className="text-xs font-semibold text-[#c9a96e] uppercase tracking-wider mb-2 flex items-center gap-1">
                        <CircleDollarSign className="w-3 h-3" />
                        A cotizar ({itemsQuoteOnly.length})
                    </h4>
                    {itemsQuoteOnly.map(sel => (
                        <div key={sel.item.id} className="flex items-center justify-between py-1 group">
                            <p className="text-xs text-[#888] truncate flex-1">{sel.item.name}</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeItem(sel.item.id); }}
                                className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-400 transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <p className="text-[10px] text-[#555] mt-1">
                        Estos ítems se confirmarán con tu event planner.
                    </p>
                </div>
            )}

            {/* Total */}
            <div className="border-t border-[#c9a96e]/20 pt-3">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">Inversión Estimada</span>
                    <span className="text-xl font-bold text-gold-gradient leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                        {total.min !== total.max ? `$${total.min.toLocaleString()} - $${total.max.toLocaleString()}` : `$${total.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    </span>
                </div>
                {itemsQuoteOnly.length > 0 && (
                    <p className="text-[10px] text-[#555] mt-1">
                        + {itemsQuoteOnly.length} ítems pendientes de cotización
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
                <Link href="/cotizar/resumen" className="btn-gold w-full justify-center text-sm !py-3">
                    <FileText className="w-4 h-4" />
                    Ver resumen y descargar PDF
                </Link>
                <button className="btn-ghost w-full justify-center text-sm !py-3">
                    <Mail className="w-4 h-4" />
                    Enviar a mi correo
                </button>
            </div>

            <p className="text-[10px] text-[#444] text-center">
                Valores referenciales. Sujetos a confirmación final.
            </p>
        </div>
    );

    /* ── MOBILE: fixed bottom bar ── */
    if (mobileMode) {
        return (
            <>
                {/* Fixed bottom bar */}
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#2a2a2a] px-4 py-3 md:hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#888]">{selectedItems.length} servicios</p>
                            <p className="text-lg font-bold text-gold-gradient leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                                {total.min !== total.max ? `$${total.min.toLocaleString()} - $${total.max.toLocaleString()}` : `$${total.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                            </p>
                        </div>
                        <button
                            className="btn-gold text-sm !py-2.5"
                            onClick={() => setShowMobile(true)}
                        >
                            Ver resumen
                        </button>
                    </div>
                </div>

                {/* Mobile overlay */}
                {showMobile && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setShowMobile(false)}>
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#2a2a2a] rounded-t-2xl max-h-[80vh] overflow-y-auto p-5"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                                    Tu selección
                                </h3>
                                <button onClick={() => setShowMobile(false)} className="text-[#888] hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {summaryContent}
                        </div>
                    </div>
                )}
            </>
        );
    }

    /* ── DESKTOP: sticky sidebar ── */
    return (
        <div className="glass-card p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                Tu selección
            </h3>
            {summaryContent}
        </div>
    );
}
