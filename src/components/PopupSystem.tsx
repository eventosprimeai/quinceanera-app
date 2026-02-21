'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X, Calculator, Star, Gift, ArrowRight, MessageCircle } from 'lucide-react';

/* ──────────────────────────────────────────────
   PopupSystem — 3 popups con reglas de conflicto
   1. Exit-intent: calculadora de presupuesto
   2. Scroll 50%: caso de estudio quinceañera
   3. Time-delayed 45s: servicio gratis de regalo
   
   Reglas:
   - Solo 1 popup a la vez
   - No mostrar si ya se cerró en esta sesión
   - No mostrar si usuario ya está en /cotizar
────────────────────────────────────────────── */

type PopupType = 'exit' | 'scroll' | 'delayed' | null;

export default function PopupSystem() {
    const [activePopup, setActivePopup] = useState<PopupType>(null);
    const [dismissed, setDismissed] = useState<Set<PopupType>>(new Set());

    const showPopup = useCallback((type: PopupType) => {
        if (!type) return;
        if (dismissed.has(type)) return;
        if (activePopup) return;
        if (window.location.pathname.includes('/cotizar')) return;
        setActivePopup(type);
    }, [dismissed, activePopup]);

    const closePopup = useCallback(() => {
        if (activePopup) {
            setDismissed(prev => new Set(prev).add(activePopup));
        }
        setActivePopup(null);
    }, [activePopup]);

    useEffect(() => {
        // Exit-intent: detecta mouse saliendo del viewport (desktop only)
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY < 10) showPopup('exit');
        };
        document.addEventListener('mouseleave', handleMouseLeave);

        // Scroll 50%: dispara al llegar a la mitad de la página
        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent >= 50) showPopup('scroll');
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Time-delayed 45s
        const timer = setTimeout(() => showPopup('delayed'), 45000);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, [showPopup]);

    if (!activePopup) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closePopup}
        >
            <div
                className="relative w-full max-w-md bg-[#0e0e0e] border border-[#2a2a2a] rounded-2xl p-0 overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'popupIn 0.3s ease-out' }}
            >
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 z-10 text-[#555] hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* ── EXIT-INTENT: Calculadora ── */}
                {activePopup === 'exit' && (
                    <div className="p-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                            <Calculator className="w-7 h-7 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                            ¿Cuánto dinero pierdes por <span className="text-red-400">mala planificación?</span>
                        </h3>
                        <p className="text-sm text-[#888] mb-6 leading-relaxed">
                            El 73% de las familias que organizan sin director terminan gastando
                            <strong className="text-white"> $800–$2,000 más</strong> de lo presupuestado en cambios de último minuto,
                            proveedores de emergencia y horas extras.
                        </p>
                        <p className="text-xs text-[#555] mb-5">
                            Usa nuestro cotizador gratuito para saber exactamente cuánto necesitas — antes de comprometer un peso.
                        </p>
                        <Link
                            href="/cotizar"
                            className="btn-gold w-full justify-center mb-3"
                            onClick={closePopup}
                        >
                            <Calculator className="w-4 h-4" />
                            Calcular mi presupuesto real
                        </Link>
                        <button onClick={closePopup} className="text-xs text-[#555] hover:text-[#888] transition-colors">
                            Prefiero improvisar
                        </button>
                    </div>
                )}

                {/* ── SCROLL 50%: Caso de estudio ── */}
                {activePopup === 'scroll' && (
                    <div>
                        <div className="bg-gradient-to-r from-[#c9a96e]/20 to-transparent p-6 pb-4">
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#c9a96e] text-[#c9a96e]" />)}
                            </div>
                            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                                Caso real: La quinceañera de Isabella
                            </h3>
                            <p className="text-xs text-[#c9a96e]">Samborondón, Guayaquil · 120 invitados</p>
                        </div>
                        <div className="p-6 pt-3">
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-[#141414] rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold text-gold-gradient">87</p>
                                    <p className="text-[10px] text-[#555]">Servicios</p>
                                </div>
                                <div className="bg-[#141414] rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold text-gold-gradient">0</p>
                                    <p className="text-[10px] text-[#555]">Problemas</p>
                                </div>
                                <div className="bg-[#141414] rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold text-gold-gradient">100%</p>
                                    <p className="text-[10px] text-[#555]">En presupuesto</p>
                                </div>
                            </div>
                            <p className="text-sm text-[#888] leading-relaxed mb-5 italic">
                                &ldquo;El cotizador me ayudó a ver exactamente cuánto iba a gastar antes de llamar.
                                Luego el equipo ajustó todo a nuestro presupuesto sin sacrificar calidad.&rdquo;
                                <span className="text-[#555] not-italic block mt-1">— Patricia L., mamá de Isabella</span>
                            </p>
                            <Link
                                href="/cotizar"
                                className="btn-gold w-full justify-center mb-3"
                                onClick={closePopup}
                            >
                                Quiero resultados así — cotizar gratis
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button onClick={closePopup} className="text-xs text-[#555] hover:text-[#888] transition-colors w-full text-center">
                                Ahora no
                            </button>
                        </div>
                    </div>
                )}

                {/* ── DELAYED 45s: Servicio gratis ── */}
                {activePopup === 'delayed' && (
                    <div className="p-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center mx-auto mb-5">
                            <Gift className="w-7 h-7 text-[#c9a96e]" />
                        </div>
                        <p className="text-xs text-[#c9a96e] uppercase tracking-wider font-semibold mb-2">
                            Oferta por tiempo limitado
                        </p>
                        <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                            1 servicio de regalo al cotizar hoy
                        </h3>
                        <p className="text-sm text-[#888] mb-4 leading-relaxed">
                            Cotiza tu quinceañera ahora y recibe <strong className="text-white">1 servicio 100% gratis</strong> de esta lista:
                        </p>
                        <div className="bg-[#141414] rounded-xl p-4 mb-5 text-left">
                            <ul className="space-y-2 text-sm">
                                {[
                                    'Sesión creativa inicial (brief + estilo)',
                                    'Diseño de seating plan',
                                    'Guion de protocolo completo',
                                    'Lista de invitados + sistema RSVP',
                                    'Storyboard de experiencia',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[#ccc]">
                                        <Gift className="w-3.5 h-3.5 text-[#c9a96e] shrink-0 mt-0.5" />
                                        <span className="text-xs">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link
                            href="/cotizar"
                            className="btn-gold w-full justify-center mb-3"
                            onClick={closePopup}
                        >
                            <Gift className="w-4 h-4" />
                            Cotizar y elegir mi servicio gratis
                        </Link>
                        <a
                            href="https://wa.me/593969324140?text=Hola%2C%20vi%20la%20oferta%20del%20servicio%20gratis%20y%20quiero%20cotizar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#c9a96e] hover:underline inline-flex items-center gap-1 mt-1"
                        >
                            <MessageCircle className="w-3 h-3" />
                            O pregunta por WhatsApp
                        </a>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes popupIn {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
