'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const sectionLink = (hash: string) => isHome ? hash : `/${hash}`;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a] py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Sparkles className="w-5 h-5 text-[#c9a96e] group-hover:rotate-12 transition-transform" />
                    <span className="text-xl font-semibold tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
                        <span className="text-gold-gradient">Eventos Prime</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm">
                    <a href={sectionLink('#resultados')} className="text-[#888] hover:text-white transition-colors">Resultados</a>
                    <a href={sectionLink('#como-funciona')} className="text-[#888] hover:text-white transition-colors">Cómo funciona</a>
                    <a href={sectionLink('#inversion')} className="text-[#888] hover:text-white transition-colors">Inversión</a>
                    <a href={sectionLink('#faq')} className="text-[#888] hover:text-white transition-colors">FAQ</a>
                    <a href="https://eventosprimeai.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#c9a96e] hover:text-white transition-colors">
                        E-Prime
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {isHome ? (
                        <Link href="/cotizar" className="btn-gold text-sm !py-2.5 !px-5">
                            Cotizar en 3 min
                        </Link>
                    ) : (
                        <Link href="/" className="text-sm text-[#c9a96e] hover:text-white transition-colors flex items-center gap-1.5 border border-[#c9a96e]/30 rounded-full py-2.5 px-5 hover:bg-[#c9a96e]/10">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Volver al inicio
                        </Link>
                    )}
                </nav>

                <button className="md:hidden text-[#c9a96e] p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {menuOpen && (
                <nav className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#2a2a2a] px-5 py-6 flex flex-col gap-4">
                    <a href={sectionLink('#resultados')} className="text-[#ccc] py-2" onClick={() => setMenuOpen(false)}>Resultados</a>
                    <a href={sectionLink('#como-funciona')} className="text-[#ccc] py-2" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
                    <a href={sectionLink('#inversion')} className="text-[#ccc] py-2" onClick={() => setMenuOpen(false)}>Inversión</a>
                    <a href={sectionLink('#faq')} className="text-[#ccc] py-2" onClick={() => setMenuOpen(false)}>FAQ</a>
                    <a href="https://eventosprimeai.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#c9a96e] py-2" onClick={() => setMenuOpen(false)}>
                        E-Prime
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    {isHome ? (
                        <Link href="/cotizar" className="btn-gold text-center mt-2" onClick={() => setMenuOpen(false)}>
                            Cotizar en 3 min
                        </Link>
                    ) : (
                        <Link href="/" className="text-center text-[#c9a96e] border border-[#c9a96e]/30 rounded-full py-3 mt-2 flex items-center justify-center gap-2" onClick={() => setMenuOpen(false)}>
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
}
