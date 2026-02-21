import Link from 'next/link';
import { Sparkles, Instagram, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-[#2a2a2a] bg-[#080808]">
            <div className="max-w-7xl mx-auto px-5 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-[#c9a96e]" />
                            <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-serif)' }}>
                                <span className="text-gold-gradient">Eventos Prime</span>
                            </span>
                        </div>
                        <p className="text-[#888] text-sm leading-relaxed mb-3">
                            Producción integral de quinceañeras de lujo en Guayaquil y todo Ecuador.
                        </p>
                        <p className="text-[10px] text-[#444] leading-relaxed">
                            EPRAI Eventos Prime AI S.A.S<br />
                            RUC: 0993401502001<br />
                            Guayaquil, Ecuador
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navegación</h4>
                        <ul className="space-y-3 text-sm text-[#888]">
                            <li><a href="#resultados" className="hover:text-[#c9a96e] transition-colors">Resultados</a></li>
                            <li><a href="#como-funciona" className="hover:text-[#c9a96e] transition-colors">Cómo funciona</a></li>
                            <li><a href="#inversion" className="hover:text-[#c9a96e] transition-colors">Inversión</a></li>
                            <li><Link href="/cotizar" className="hover:text-[#c9a96e] transition-colors">Cotizador</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contacto</h4>
                        <ul className="space-y-3 text-sm text-[#888]">
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#c9a96e]" />
                                <a href="https://wa.me/593969324140" className="hover:text-white transition-colors">
                                    +593 96 932 4140
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#c9a96e]" />
                                <a href="mailto:ventas@eventosprimeai.com" className="hover:text-white transition-colors">
                                    ventas@eventosprimeai.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-[#c9a96e]" />
                                <a href="#" className="hover:text-white transition-colors">@eventosprime.ec</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="divider-gold my-10 opacity-30" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#555]">
                    <p>© {new Date().getFullYear()} EPRAI Eventos Prime AI S.A.S · RUC 0993401502001</p>
                    <p>Guayaquil, Ecuador</p>
                </div>
            </div>
        </footer>
    );
}
