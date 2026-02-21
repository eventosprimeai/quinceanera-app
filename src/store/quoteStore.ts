'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ServiceItem, QuoteFormData, SelectedItem } from '@/types/catalog';

interface QuoteStore {
    selectedItems: SelectedItem[];
    formData: QuoteFormData;
    logisticsMode: 'percent' | 'fixed_fee' | 'quote_only';
    addItem: (item: ServiceItem, categoryName: string, subcategoryName?: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, qty: number) => void;
    isSelected: (itemId: string) => boolean;
    setFormData: (data: Partial<QuoteFormData>) => void;
    setLogisticsMode: (mode: 'percent' | 'fixed_fee' | 'quote_only') => void;
    getItemsWithPrice: () => SelectedItem[];
    getItemsQuoteOnly: () => SelectedItem[];
    getSubtotalsByCategory: () => Record<string, { min: number; max: number }>;
    getTotal: (guestCount: number, eventHours: number) => { min: number; max: number };
    clearAll: () => void;
}

const defaultForm: QuoteFormData = {
    fullName: '', email: '', whatsapp: '', city: '',
    isOutsideGuayaquil: false, tentativeDate: '', guestCount: 100, eventHours: 6,
};

function calcLineSubtotal(item: ServiceItem, qty: number, guests: number, hours: number): { min: number; max: number } {
    if (item.pricingType === 'range' && item.priceRange) {
        // Rangos se asumen por ahora como per unit o per project, pero ajustaremos por gests según necesidad.
        // Dado que los rangos del doc son a veces "por invitado", necesitamos multiplicarlo por la cantidad adecuada
        // según el unitLabel. Si dice "invitado", multiplicamos por guests.
        let multiplier = 1;
        const labels = item.unitLabel.toLowerCase();
        if (labels.includes('invitado') || labels.includes('persona')) {
            multiplier = guests;
        } else if (labels.includes('hora')) {
            multiplier = hours;
        } else if (labels.includes('unidad') || labels.includes('set') || labels.includes('pastel')) {
            multiplier = qty;
        }
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

export const useQuoteStore = create<QuoteStore>()(
    persist(
        (set, get) => ({
            selectedItems: [],
            formData: defaultForm,
            logisticsMode: 'quote_only',
            addItem: (item, categoryName, subcategoryName) => {
                const exists = get().selectedItems.find(s => s.item.id === item.id);
                if (exists) return;
                set(s => ({
                    selectedItems: [...s.selectedItems, {
                        item, categoryName, subcategoryName,
                        quantity: item.defaultQty ?? 1,
                    }],
                }));
            },
            removeItem: (itemId) => set(s => ({
                selectedItems: s.selectedItems.filter(i => i.item.id !== itemId),
            })),
            updateQuantity: (itemId, qty) => set(s => ({
                selectedItems: s.selectedItems.map(i =>
                    i.item.id === itemId ? { ...i, quantity: Math.max(1, qty) } : i
                ),
            })),
            isSelected: (itemId) => get().selectedItems.some(i => i.item.id === itemId),
            setFormData: (data) => set(s => ({ formData: { ...s.formData, ...data } })),
            setLogisticsMode: (mode) => set({ logisticsMode: mode }),
            getItemsWithPrice: () => get().selectedItems.filter(i => (i.item.priceUSD !== null || i.item.pricingType === 'range') && i.item.pricingType !== 'quoteOnly'),
            getItemsQuoteOnly: () => get().selectedItems.filter(i => (i.item.priceUSD === null && i.item.pricingType !== 'range') || i.item.pricingType === 'quoteOnly'),
            getSubtotalsByCategory: () => {
                const { selectedItems, formData } = get();
                const map: Record<string, { min: number; max: number }> = {};
                for (const sel of selectedItems) {
                    const sub = calcLineSubtotal(sel.item, sel.quantity, formData.guestCount, formData.eventHours);
                    if (!map[sel.categoryName]) map[sel.categoryName] = { min: 0, max: 0 };
                    map[sel.categoryName].min += sub.min;
                    map[sel.categoryName].max += sub.max;
                }
                return map;
            },
            getTotal: (guests, hours) => {
                const { selectedItems } = get();
                return selectedItems.reduce((sum, sel) => {
                    const sub = calcLineSubtotal(sel.item, sel.quantity, guests, hours);
                    return { min: sum.min + sub.min, max: sum.max + sub.max };
                }, { min: 0, max: 0 });
            },
            clearAll: () => set({ selectedItems: [], formData: defaultForm, logisticsMode: 'quote_only' }),
        }),
        { name: 'quinceanera-quote-storage' }
    )
);
