import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function GraciasPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-lg mx-auto text-center py-20">
                    {/* Success icon */}
                    <div className="w-20 h-20 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-[#c9a96e]" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                        ¡Cotización <span className="text-gold-gradient">enviada!</span>
                    </h1>

                    <p className="text-[#888] text-lg mb-2">
                        Te enviamos la cotización a tu correo electrónico.
                    </p>
                    <p className="text-[#555] text-sm mb-10">
                        Revisa tu bandeja de entrada (y la carpeta de spam/promociones).
                        Tu event planner también recibió una copia.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <a
                            href="https://wa.me/593969324140?text=Hola%2C%20acabo%20de%20enviar%20mi%20cotización%20de%20quinceañera%20y%20quiero%20agendar%20una%20llamada"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-gold !py-3.5"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Agendar llamada por WhatsApp
                        </a>
                        <Link href="/" className="btn-ghost !py-3.5">
                            <ArrowRight className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                    </div>

                    {/* Next steps */}
                    <div className="glass-card p-6 text-left">
                        <h3 className="text-sm font-semibold text-[#c9a96e] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            ¿Qué sigue?
                        </h3>
                        <ol className="space-y-3 text-sm text-[#888]">
                            <li className="flex gap-3">
                                <span className="text-[#c9a96e] font-mono text-xs shrink-0">01</span>
                                <span>Tu event planner revisará tu selección y preparará una propuesta personalizada.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#c9a96e] font-mono text-xs shrink-0">02</span>
                                <span>Agendarán una llamada de 15–20 min para afinar detalles, confirmar precios y resolver dudas.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#c9a96e] font-mono text-xs shrink-0">03</span>
                                <span>Recibirás la propuesta final con cronograma, diseño y contrato para iniciar la producción.</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
