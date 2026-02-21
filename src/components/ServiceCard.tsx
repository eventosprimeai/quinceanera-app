import { useState } from 'react';
import { useQuoteStore } from '@/store/quoteStore';
import type { ServiceItem } from '@/types/catalog';
import { Check, Plus, Minus, CircleDollarSign, Info } from 'lucide-react';
import ServiceInfoPopup from './ServiceInfoPopup';

interface ServiceCardProps {
    item: ServiceItem;
    categoryName: string;
    subcategoryName?: string;
    guestCount: number;
    eventHours: number;
}

function calcPrice(item: ServiceItem, qty: number, guests: number, hours: number): { min: number; max: number } {
    if (item.pricingType === 'range' && item.priceRange) {
        let multiplier = 1;
        const labels = item.unitLabel.toLowerCase();
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

export default function ServiceCard({ item, categoryName, subcategoryName, guestCount, eventHours }: ServiceCardProps) {
    const { addItem, removeItem, isSelected, updateQuantity, selectedItems } = useQuoteStore();
    const [showInfo, setShowInfo] = useState(false);

    const selected = isSelected(item.id);
    const sel = selectedItems.find(s => s.item.id === item.id);
    const qty = sel?.quantity ?? item.defaultQty ?? 1;
    const isQuoteOnly = item.pricingType === 'quoteOnly' || (item.priceUSD === null && item.pricingType !== 'range');
    const estimatedPrice = calcPrice(item, qty, guestCount, eventHours);

    const toggle = () => {
        if (selected) {
            removeItem(item.id);
        } else {
            addItem(item, categoryName, subcategoryName);
        }
    };

    return (
        <>
            <div
                className={`relative rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full ${selected
                    ? 'bg-[#c9a96e]/5 border-[#c9a96e]/40 shadow-[0_0_30px_rgba(201,169,110,0.1)]'
                    : 'bg-[#141414] border-[#2a2a2a] hover:border-[#3a3a3a]'
                    }`}
                onClick={toggle}
            >
                <div className="p-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white leading-tight">{item.name}</h4>
                            <p className="text-xs text-[#888] mt-1 leading-relaxed line-clamp-2">
                                {item.popupInfo?.shortText || item.description || ''}
                            </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all ${selected
                            ? 'bg-[#c9a96e] text-[#0a0a0a]'
                            : 'border border-[#3a3a3a] group-hover:border-[#c9a96e]/50'
                            }`}>
                            {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5">
                            {isQuoteOnly ? (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#c9a96e]/10 text-[#c9a96e] px-2 py-0.5 rounded-full">
                                    <CircleDollarSign className="w-3 h-3" />
                                    A cotizar
                                </span>
                            ) : estimatedPrice.min === 0 && estimatedPrice.max === 0 ? (
                                <span className="text-xs font-semibold text-emerald-400">Gratis</span>
                            ) : (
                                <span className="text-sm font-semibold text-[#c9a96e]">
                                    {estimatedPrice.min !== estimatedPrice.max
                                        ? `$${estimatedPrice.min.toLocaleString()} - $${estimatedPrice.max.toLocaleString()}`
                                        : `$${estimatedPrice.min.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                </span>
                            )}
                            <span className="text-xs text-[#555]">{item.unitLabel}</span>
                        </div>

                        {/* Quantity control */}
                        {selected && item.allowCustomQty && (
                            <div
                                className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg px-1 py-0.5"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    className="w-6 h-6 flex items-center justify-center rounded text-[#888] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                                    onClick={() => updateQuantity(item.id, qty - 1)}
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono text-white w-6 text-center">{qty}</span>
                                <button
                                    className="w-6 h-6 flex items-center justify-center rounded text-[#888] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                                    onClick={() => updateQuantity(item.id, qty + 1)}
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info Button Row */}
                    {item.popupInfo && (
                        <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
                            <button
                                className="flex items-center gap-1.5 text-xs text-[#c9a96e] hover:text-white transition-colors"
                                onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
                            >
                                <Info className="w-3.5 h-3.5" />
                                {item.popupInfo.buttonText || 'Ver detalles'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showInfo && item.popupInfo && (
                <ServiceInfoPopup
                    info={item.popupInfo}
                    onClose={() => setShowInfo(false)}
                />
            )}
        </>
    );
}
