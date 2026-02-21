'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import QuoteSummaryPanel from '@/components/QuoteSummaryPanel';
import { useQuoteStore } from '@/store/quoteStore';
import catalogData from '@/data/serviceCatalog.json';
import { getCategoryImage } from '@/data/categoryImages';
import type { ServiceCategory, ServiceSubcategory, ServiceItem } from '@/types/catalog';
import Image from 'next/image';
import {
    Sparkles, Users, Calendar, MapPin, Clock, ChevronRight, Search,
    ArrowLeft
} from 'lucide-react';

const catalog = catalogData as { categories: ServiceCategory[]; locationRules: any };

/* ── Flatten items from (sub)categories ── */
function getAllItems(cat: ServiceCategory | ServiceSubcategory): ServiceItem[] {
    const items: ServiceItem[] = [];
    if (cat.items) items.push(...(cat.items as ServiceItem[]));
    if (cat.subcategories) {
        for (const sub of cat.subcategories) {
            items.push(...getAllItems(sub));
        }
    }
    return items;
}

export default function CotizarPage() {
    const { formData, setFormData, selectedItems } = useQuoteStore();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(true);

    /* ── Parallax: measure banner dimensions for fixed background ── */
    const bannerRef = useRef<HTMLDivElement>(null);
    const [bannerRect, setBannerRect] = useState({ width: 0, left: 0 });

    useEffect(() => {
        const measure = () => {
            if (bannerRef.current) {
                const rect = bannerRef.current.getBoundingClientRect();
                setBannerRect({ width: rect.width, left: rect.left });
            }
        };
        measure();
        window.addEventListener('resize', measure, { passive: true });
        window.addEventListener('scroll', measure, { passive: true });
        return () => {
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', measure);
        };
    }, [activeCategory]);

    const activeCat = catalog.categories.find(c => c.id === activeCategory);

    /* ── Search filter ── */
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const q = searchQuery.toLowerCase();
        const results: { item: ServiceItem; catName: string; subName?: string }[] = [];
        for (const cat of catalog.categories) {
            const allItems = getAllItems(cat);
            for (const item of allItems) {
                if (item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)) {
                    results.push({ item, catName: cat.name });
                }
            }
        }
        return results;
    }, [searchQuery]);

    return (
        <>
            <Header />
            <main className="min-h-screen pt-20 pb-24 md:pb-10">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Title */}
                    <div className="text-center py-8">
                        <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                            Arma tu <span className="text-gold-gradient">cotización</span>
                        </h1>
                        <p className="text-sm text-[#888] max-w-lg mx-auto">
                            Selecciona los servicios que deseas y obtén un estimado al instante. Sin compromiso.
                        </p>
                    </div>

                    {/* ── Form section ── */}
                    {showForm && (
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-semibold text-[#c9a96e] uppercase tracking-wider mb-4">
                                    Datos de tu evento
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-[#888] mb-1 block">Tu nombre</label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ fullName: e.target.value })}
                                            placeholder="María García"
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#888] mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ email: e.target.value })}
                                            placeholder="maria@email.com"
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#888] mb-1 block">WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={formData.whatsapp}
                                            onChange={e => setFormData({ whatsapp: e.target.value })}
                                            placeholder="+593 99 999 9999"
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#888] mb-1 block flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Ciudad del evento
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={e => {
                                                const city = e.target.value;
                                                setFormData({
                                                    city,
                                                    isOutsideGuayaquil: !city.toLowerCase().includes('guayaquil') && city.length > 2,
                                                });
                                            }}
                                            placeholder="Guayaquil"
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#888] mb-1 block flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Fecha tentativa
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.tentativeDate}
                                            onChange={e => setFormData({ tentativeDate: e.target.value })}
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#888] mb-1 block flex items-center gap-1">
                                            <Users className="w-3 h-3" /> Nº de invitados
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.guestCount}
                                            onChange={e => setFormData({ guestCount: Math.max(1, parseInt(e.target.value) || 1) })}
                                            min={1}
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#888] mb-1 block flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Horas de evento
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.eventHours}
                                            onChange={e => setFormData({ eventHours: Math.max(1, parseInt(e.target.value) || 1) })}
                                            min={1}
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {formData.isOutsideGuayaquil && (
                                    <div className="mt-4 bg-[#c9a96e]/5 border border-[#c9a96e]/20 rounded-lg p-3">
                                        <p className="text-xs text-[#c9a96e]">
                                            📍 Evento fuera de Guayaquil — Los viáticos y logística de traslado se agregarán automáticamente como &quot;A cotizar&quot; en tu resumen.
                                        </p>
                                    </div>
                                )}

                                <button
                                    className="btn-gold w-full mt-6 justify-center"
                                    onClick={() => setShowForm(false)}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Continuar a servicios
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Services grid ── */}
                    {!showForm && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Categories / Items */}
                            <div className="lg:col-span-2">
                                {/* Search bar */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setActiveCategory(null); }}
                                        placeholder="Buscar servicios (ej: DJ, maquillaje, vals, decoración...)"
                                        className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#444] focus:border-[#c9a96e]/50 focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Search results */}
                                {searchResults !== null ? (
                                    <div>
                                        <p className="text-xs text-[#888] mb-3">
                                            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para &quot;{searchQuery}&quot;
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {searchResults.map(r => (
                                                <ServiceCard
                                                    key={r.item.id}
                                                    item={r.item}
                                                    categoryName={r.catName}
                                                    subcategoryName={r.subName}
                                                    guestCount={formData.guestCount}
                                                    eventHours={formData.eventHours}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : activeCategory === null ? (
                                    /* ── Category grid ── */
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-semibold text-[#888] uppercase tracking-wider">
                                                Categorías ({catalog.categories.length})
                                            </h3>
                                            <button
                                                onClick={() => setShowForm(true)}
                                                className="text-xs text-[#c9a96e] hover:underline flex items-center gap-1"
                                            >
                                                Editar datos del evento
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {catalog.categories.map(cat => {
                                                const count = getAllItems(cat).length;
                                                const selectedCount = selectedItems.filter(s => s.categoryName === cat.name).length;
                                                const img = getCategoryImage(cat.id);
                                                return (
                                                    <div
                                                        key={cat.id}
                                                        className="glass-card cursor-pointer group overflow-hidden relative"
                                                        onClick={() => setActiveCategory(cat.id)}
                                                    >
                                                        {img && (
                                                            <div className="relative h-44 w-full">
                                                                <Image src={img} alt={cat.name} fill className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/30 to-transparent" />
                                                            </div>
                                                        )}
                                                        <div className="p-5">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <h3 className="text-sm font-semibold text-white group-hover:text-[#c9a96e] transition-colors">
                                                                        {cat.name}
                                                                    </h3>
                                                                    <p className="text-xs text-[#555] mt-1">{count} servicios</p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {selectedCount > 0 && (
                                                                        <span className="bg-[#c9a96e]/20 text-[#c9a96e] text-xs px-2 py-0.5 rounded-full font-medium">
                                                                            {selectedCount}
                                                                        </span>
                                                                    )}
                                                                    <ChevronRight className="w-4 h-4 text-[#555] group-hover:text-[#c9a96e] transition-colors" />
                                                                </div>
                                                            </div>
                                                            {cat.description && (
                                                                <p className="text-xs text-[#666] mt-2 line-clamp-2">{cat.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    /* ── Category detail: items ── */
                                    <div>
                                        <button
                                            onClick={() => setActiveCategory(null)}
                                            className="text-xs text-[#c9a96e] hover:underline flex items-center gap-1 mb-4"
                                        >
                                            <ArrowLeft className="w-3 h-3" />
                                            Volver a categorías
                                        </button>
                                        {activeCat && getCategoryImage(activeCat.id) && (
                                            <div
                                                ref={bannerRef}
                                                className="relative w-full h-[295px] md:h-[370px] rounded-xl overflow-hidden mb-6"
                                                style={{
                                                    backgroundImage: `url(${getCategoryImage(activeCat.id)})`,
                                                    backgroundAttachment: 'fixed',
                                                    backgroundSize: bannerRect.width ? `${bannerRect.width}px auto` : 'cover',
                                                    backgroundPosition: bannerRect.width ? `${bannerRect.left}px 35%` : 'center 35%',
                                                    backgroundRepeat: 'no-repeat',
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                                                <div className="absolute bottom-4 left-5 z-10">
                                                    <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-serif)' }}>
                                                        {activeCat.name}
                                                    </h2>
                                                    {activeCat.description && (
                                                        <p className="text-xs text-[#ccc] mt-1 drop-shadow-md max-w-md">{activeCat.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* Title is now inside the parallax banner above */}

                                        {/* Render subcategories and items */}
                                        {activeCat?.subcategories?.map(sub => (
                                            <div key={sub.id} className="mb-6">
                                                <h3 className="text-sm font-semibold text-[#c9a96e] uppercase tracking-wider mb-3">
                                                    {sub.name}
                                                </h3>
                                                {/* Nested subcategories */}
                                                {sub.subcategories?.map(nested => (
                                                    <div key={nested.id} className="mb-4 ml-2">
                                                        <h4 className="text-xs font-medium text-[#888] mb-2">{nested.name}</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {nested.items?.map(item => (
                                                                <ServiceCard
                                                                    key={item.id}
                                                                    item={item as ServiceItem}
                                                                    categoryName={activeCat.name}
                                                                    subcategoryName={nested.name}
                                                                    guestCount={formData.guestCount}
                                                                    eventHours={formData.eventHours}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Direct items */}
                                                {sub.items && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {sub.items.map(item => (
                                                            <ServiceCard
                                                                key={item.id}
                                                                item={item as ServiceItem}
                                                                categoryName={activeCat.name}
                                                                subcategoryName={sub.name}
                                                                guestCount={formData.guestCount}
                                                                eventHours={formData.eventHours}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Items directly on category */}
                                        {activeCat?.items && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {activeCat.items.map(item => (
                                                    <ServiceCard
                                                        key={item.id}
                                                        item={item as ServiceItem}
                                                        categoryName={activeCat.name}
                                                        guestCount={formData.guestCount}
                                                        eventHours={formData.eventHours}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: Summary Panel (desktop) */}
                            <div className="hidden lg:block">
                                <QuoteSummaryPanel />
                            </div>

                            {/* Mobile summary bar */}
                            <div className="lg:hidden">
                                {selectedItems.length > 0 && <QuoteSummaryPanel mobileMode />}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
