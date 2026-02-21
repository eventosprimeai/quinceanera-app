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
    getSubtotalsByCategory: () => Record<string, number>;
    getTotal: (guestCount: number, eventHours: number) => number;
    clearAll: () => void;
}

const defaultForm: QuoteFormData = {
    fullName: '', email: '', whatsapp: '', city: '',
    isOutsideGuayaquil: false, tentativeDate: '', guestCount: 100, eventHours: 6,
};

function calcLineSubtotal(item: ServiceItem, qty: number, guests: number, hours: number): number {
    if (!item.priceUSD) return 0;
    switch (item.pricingType) {
        case 'fixed': return item.priceUSD;
        case 'perPerson': return item.priceUSD * guests;
        case 'perHour': return item.priceUSD * hours;
        case 'perUnit': return item.priceUSD * qty;
        default: return 0;
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
            getItemsWithPrice: () => get().selectedItems.filter(i => i.item.priceUSD !== null && i.item.pricingType !== 'quoteOnly'),
            getItemsQuoteOnly: () => get().selectedItems.filter(i => i.item.priceUSD === null || i.item.pricingType === 'quoteOnly'),
            getSubtotalsByCategory: () => {
                const { selectedItems, formData } = get();
                const map: Record<string, number> = {};
                for (const sel of selectedItems) {
                    const sub = calcLineSubtotal(sel.item, sel.quantity, formData.guestCount, formData.eventHours);
                    map[sel.categoryName] = (map[sel.categoryName] || 0) + sub;
                }
                return map;
            },
            getTotal: (guests, hours) => {
                const { selectedItems } = get();
                return selectedItems.reduce((sum, sel) =>
                    sum + calcLineSubtotal(sel.item, sel.quantity, guests, hours), 0);
            },
            clearAll: () => set({ selectedItems: [], formData: defaultForm, logisticsMode: 'quote_only' }),
        }),
        { name: 'quinceanera-quote-storage' }
    )
);
