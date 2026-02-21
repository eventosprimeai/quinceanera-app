'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopupSystem from '@/components/PopupSystem';
import {
  Sparkles, ArrowRight, CheckCircle2, Crown, Shield, Palette,
  Users, Clock, FileText, MessageCircle, ChevronDown, Star,
  Music, Camera, Utensils, Lightbulb, Zap, Heart, Award, TrendingUp,
  AlertTriangle, Phone
} from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  { name: 'Carolina M.', role: 'Mamá de Valentina (XV, Guayaquil)', text: 'Contraté 8 proveedores por separado para la fiesta de mi sobrina y fue un caos. Con Eventos Prime todo fue diferente: un solo equipo, cero estrés, y la fiesta de Valentina superó todo lo que imaginamos.', rating: 5 },
  { name: 'Patricia L.', role: 'Mamá de Isabella (XV, Samborondón)', text: 'El cotizador me ayudó a ver exactamente cuánto iba a gastar antes de llamar. Eso me dio confianza. Luego el equipo ajustó todo a nuestro presupuesto sin sacrificar calidad.', rating: 5 },
  { name: 'Gabriela R.', role: 'Mamá de Camila (XV, Cuenca)', text: 'Evento fuera de Guayaquil y ni se notó. Todo el equipo viajó, montó y desmontó sin que yo moviera un dedo. Camila bailó su vals con humo bajo y chispas frías. Lloré de la emoción.', rating: 5 },
];

const painPoints = [
  { icon: AlertTriangle, stat: '73%', text: 'de las familias que organizan solas terminan gastando más de lo presupuestado.' },
  { icon: Clock, stat: '120+ hrs', text: 'promedio que una mamá invierte coordinando proveedores sin un director de evento.' },
  { icon: Zap, stat: '4 de 10', text: 'eventos tienen al menos un problema grave el día del evento por falta de ensayo general.' },
];

const steps = [
  { icon: Palette, title: 'Selecciona', desc: 'Explora 179 servicios en 14 categorías. Marca solo lo que necesitas.', cta: 'Ver categorías →' },
  { icon: Users, title: 'Personaliza', desc: 'Ajusta cantidades, invitados y horas. El precio se actualiza al instante.', cta: 'Es gratis →' },
  { icon: FileText, title: 'Recibe tu PDF', desc: 'Descarga o recibe por email un desglose profesional con precios detallados.', cta: 'Sin compromiso →' },
  { icon: Phone, title: 'Agenda 15 min', desc: 'Tu event planner confirma precios finales y arma el cronograma maestro.', cta: 'Llamada gratuita →' },
];

const diffs = [
  { icon: Crown, title: '1 equipo, 0 estrés', desc: 'No coordinamos proveedores: somos la productora completa. Sonido, luces, decoración, catering — todo bajo un mismo director.' },
  { icon: Shield, title: 'Método de 47 checkpoints', desc: 'Cronograma maestro, run of show, ensayo general, plan B por lluvia y protocolo de contingencias. Nada improvisado.' },
  { icon: Sparkles, title: 'Diseño con storyboard', desc: 'Desde el color de las servilletas hasta la entrada con humo bajo: cada elemento sigue un storyboard visual de la experiencia.' },
  { icon: Lightbulb, title: 'Producción técnica real', desc: 'Moving heads, hazer, CO2 jets, pista LED, IMAG en pantalla — a nivel de show profesional, no "alquiler de parlantes".' },
];

const categoryPreviews = [
  { icon: Palette, name: 'Concepto creativo', count: 9 },
  { icon: Music, name: 'Producción técnica', count: 34 },
  { icon: Utensils, name: 'Catering y bar', count: 15 },
  { icon: Camera, name: 'Foto y video', count: 15 },
  { icon: Star, name: 'Shows y coreografía', count: 15 },
  { icon: Heart, name: 'Belleza y vestuario', count: 27 },
];

const faqs = [
  { q: '¿Cuánto cuesta una quinceañera con Eventos Prime?', a: 'Depende del alcance. Una producción técnica básica arranca desde $2,500. Un evento completo de lujo va de $5,000 a $15,000+. El cotizador te da un estimado en 3 minutos según lo que selecciones.' },
  { q: '¿Atienden fuera de Guayaquil?', a: 'Sí. Hemos producido eventos en Cuenca, Quito, Salinas y Manta. Los viáticos se calculan automáticamente y se detallan en tu cotización.' },
  { q: '¿Puedo seleccionar solo algunos servicios?', a: '100%. El sistema es modular: puedes elegir solo producción técnica, solo decoración, o el paquete completo. Tú controlas el alcance y el presupuesto.' },
  { q: '¿Los precios del cotizador son finales?', a: 'Son estimados referenciales con ±10% de precisión. Tu event planner confirma los valores exactos después de la llamada de 15 minutos.' },
  { q: '¿Cuánto tiempo antes debo empezar?', a: 'Lo ideal: 6-12 meses antes. Lo mínimo: 3 meses. Cuanto antes reserves, mayor disponibilidad de venue y proveedores premium.' },
  { q: '¿Qué pasa si llueve? (eventos al aire libre)', a: 'Todos nuestros eventos incluyen un Plan B documentado. Carpas, toldos, reubicación interior y protocolo de comunicación a invitados.' },
];

const statsBar = [
  { value: '179+', label: 'Servicios modulares' },
  { value: '14', label: 'Categorías' },
  { value: '3 min', label: 'Para cotizar' },
  { value: '24h', label: 'Respuesta garantizada' },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Header />
      <PopupSystem />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Ken Burns animated background image */}
          <div className="absolute inset-0">
            <img
              src="/images/hero-bg.png"
              alt=""
              className="hero-kenburns w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />
          {/* Subtle gold glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#c9a96e]/8 blur-[150px]" />
          <div className="relative z-10 max-w-4xl mx-auto px-5 text-center pt-28 pb-20">
            <div className="inline-flex items-center gap-2 bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#c9a96e]/20 rounded-full px-4 py-1.5 text-xs text-[#c9a96e] mb-8 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Producción integral · Guayaquil y todo Ecuador
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'var(--font-serif)' }}>
              Tu hija merece una producción de{' '}
              <span className="text-gold-gradient">179 servicios.</span>{' '}
              No una fiesta improvisada.
            </h1>
            <p className="text-lg md:text-xl text-[#ccc] max-w-2xl mx-auto mb-4 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Arma tu cotización en 3 minutos. Elige exactamente lo que necesitas de 14 categorías:
              desde el concepto creativo hasta la pirotecnia fría del cierre.
            </p>
            <p className="text-xs text-[#aaa] mb-8 drop-shadow-md">Sin compromiso · Sin tarjeta · PDF profesional al instante</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/cotizar" className="btn-gold text-lg !py-4 !px-8">
                Cotizar mi evento gratis <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="https://wa.me/593969324140?text=Hola%2C%20quiero%20cotizar%20la%20quinceañera%20de%20mi%20hija" target="_blank" rel="noopener noreferrer" className="btn-ghost text-lg !py-4 !px-8 backdrop-blur-sm">
                <MessageCircle className="w-5 h-5" /> Hablar por WhatsApp
              </a>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-[#c9a96e]/40" />
          </div>
        </section>

        {/* STATS BAR */}
        <section className="border-y border-[#2a2a2a] bg-[#080808]">
          <div className="max-w-5xl mx-auto px-5 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statsBar.map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-gold-gradient" style={{ fontFamily: 'var(--font-serif)' }}>{s.value}</p>
                <p className="text-xs text-[#555] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PAIN POINTS */}
        <section className="section-padding">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Organizar una quinceañera sin director <span className="text-gold-gradient">es una apuesta cara</span>
            </h2>
            <p className="text-[#888] max-w-2xl mx-auto mb-12 text-lg">La diferencia entre &ldquo;salió bien&rdquo; y &ldquo;fue perfecto&rdquo; es tener una productora con método.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {painPoints.map((p, i) => (
                <div key={i} className="glass-card p-6 text-center">
                  <p.icon className="w-6 h-6 text-red-400/70 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{p.stat}</p>
                  <p className="text-sm text-[#888] leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
            <Link href="/cotizar" className="text-sm text-[#c9a96e] hover:underline inline-flex items-center gap-1">Calcula tu presupuesto real aquí <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="resultados" className="section-padding bg-[#080808]">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Lo que dicen las mamás que <span className="text-gold-gradient">ya confiaron en nosotros</span>
            </h2>
            <p className="text-[#888] max-w-xl mx-auto mb-12">Cada testimonio es de una familia real en Ecuador.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {testimonials.map((t, i) => (
                <div key={i} className="glass-card p-6 text-left">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#c9a96e] text-[#c9a96e]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#ccc] leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#555]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/cotizar" className="text-sm text-[#c9a96e] hover:underline inline-flex items-center gap-1">Vive la misma experiencia — cotiza gratis <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="section-padding">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              De idea a cotización en <span className="text-gold-gradient">4 pasos y 3 minutos</span>
            </h2>
            <p className="text-[#888] max-w-xl mx-auto mb-14 text-lg">No necesitas saber de eventos. Solo marca lo que te gusta.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="glass-card p-6 text-center relative group">
                  <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#c9a96e]/20 transition-colors">
                    <step.icon className="w-5 h-5 text-[#c9a96e]" />
                  </div>
                  <span className="absolute top-4 right-4 text-xs text-[#555] font-mono">{`0${i + 1}`}</span>
                  <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed mb-3">{step.desc}</p>
                  <p className="text-xs text-[#c9a96e] font-medium">{step.cta}</p>
                </div>
              ))}
            </div>
            <Link href="/cotizar" className="btn-gold mt-10 inline-flex">Empezar ahora — es gratis <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        <hr className="divider-gold max-w-xl mx-auto opacity-40" />

        {/* DIFERENCIADORES */}
        <section className="section-padding bg-[#080808]">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              No alquilamos cosas. <span className="text-gold-gradient">Producimos experiencias.</span>
            </h2>
            <p className="text-[#888] max-w-2xl mx-auto mb-14 text-lg">La distancia entre &ldquo;contratar proveedores&rdquo; y tener una productora integral es ±120 horas de estrés que no necesitas vivir.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {diffs.map((d, i) => (
                <div key={i} className="glass-card p-6 text-left flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center">
                    <d.icon className="w-5 h-5 text-[#c9a96e]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{d.title}</h3>
                    <p className="text-sm text-[#888] leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/cotizar" className="text-sm text-[#c9a96e] hover:underline inline-flex items-center gap-1">Arma tu producción — ver servicios <ArrowRight className="w-3 h-3" /></Link>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="section-padding">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="text-gold-gradient">179 servicios</span> en 14 categorías
            </h2>
            <p className="text-[#888] max-w-xl mx-auto mb-12 text-lg">Selecciona lo que quieras. Deja fuera lo que no. Tu evento, tu alcance.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {categoryPreviews.map((cat, i) => (
                <div key={i} className="glass-card p-5 text-center group cursor-default">
                  <cat.icon className="w-6 h-6 text-[#c9a96e] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-xs text-[#555]">{cat.count} servicios</p>
                </div>
              ))}
            </div>
            <Link href="/cotizar" className="btn-gold">Explorar el catálogo completo <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        {/* INVERSIÓN */}
        <section id="inversion" className="section-padding bg-[#080808]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Rangos reales de <span className="text-gold-gradient">inversión en 2025</span>
            </h2>
            <p className="text-[#888] max-w-2xl mx-auto mb-12 text-lg">Basados en eventos reales producidos en Guayaquil. El cotizador te da tu número exacto.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Producción técnica', range: 'Desde $2,500', desc: 'Sonido, iluminación, DJ, pantalla LED y coordinación el día del evento.', popular: false },
                { label: 'Evento completo', range: '$5,000 – $15,000', desc: 'Dirección creativa + técnica + decoración + catering + belleza + coreografía.', popular: true },
                { label: 'Producción sin límites', range: '$15,000+', desc: 'Todo lo anterior + hora loca, artista sorpresa, pista LED, pirotecnia fría y más.', popular: false },
              ].map((tier, i) => (
                <div key={i} className={`glass-card p-6 text-left relative ${tier.popular ? 'border-[#c9a96e]/30 glow-gold' : ''}`}>
                  {tier.popular && <span className="absolute -top-3 left-5 bg-[#c9a96e] text-[#0a0a0a] text-xs font-bold px-3 py-1 rounded-full">Más elegido</span>}
                  <h3 className="text-lg font-semibold text-white mb-1 mt-2">{tier.label}</h3>
                  <p className="text-2xl font-bold text-gold-gradient mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{tier.range}</p>
                  <p className="text-sm text-[#888] leading-relaxed mb-4">{tier.desc}</p>
                  <Link href="/cotizar" className="text-xs text-[#c9a96e] hover:underline inline-flex items-center gap-1">Calcular mi inversión <ArrowRight className="w-3 h-3" /></Link>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#555] max-w-lg mx-auto">Valores en USD. El cotizador calcula según tus selecciones reales.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-padding">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center" style={{ fontFamily: 'var(--font-serif)' }}>
              Preguntas que nos hacen <span className="text-gold-gradient">antes de decir sí</span>
            </h2>
            <p className="text-[#888] text-center mb-12">Si no encuentras tu pregunta, escríbenos por WhatsApp.</p>
            <div className="space-y-3 mb-8">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button className="w-full flex items-center justify-between cursor-pointer p-5 text-white font-medium text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#c9a96e] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-sm text-[#888] leading-relaxed border-t border-[#2a2a2a] pt-4">{faq.a}</div>}
                </div>
              ))}
            </div>
            <div className="text-center">
              <a href="https://wa.me/593969324140?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20quinceañeras" target="_blank" rel="noopener noreferrer" className="text-sm text-[#c9a96e] hover:underline inline-flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> ¿Más preguntas? Escríbenos al WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* URGENCIA */}
        <section className="bg-[#080808] border-y border-[#2a2a2a]">
          <div className="max-w-3xl mx-auto px-5 py-10 text-center">
            <p className="text-sm text-[#888] mb-2">📅 Los mejores venues y fechas se reservan con <strong className="text-white">6+ meses de anticipación</strong>.</p>
            <p className="text-xs text-[#555]">Si tu evento es en los próximos 8 meses, te recomendamos cotizar esta semana para asegurar disponibilidad.</p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#100e0a] to-[#0a0a0a]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#c9a96e]/5 blur-[100px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              179 servicios. 3 minutos. <span className="text-gold-gradient">0 estrés.</span>
            </h2>
            <p className="text-lg text-[#888] mb-10 max-w-xl mx-auto">Arma tu cotización ahora y recibe el PDF al instante. Sin llamadas, sin compromiso, con total transparencia.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/cotizar" className="btn-gold text-lg !py-4 !px-10">Cotizar mi quinceañera <ArrowRight className="w-5 h-5" /></Link>
              <a href="https://wa.me/593969324140?text=Hola%2C%20quiero%20cotizar%20una%20quinceañera" target="_blank" rel="noopener noreferrer" className="btn-ghost text-lg !py-4 !px-8">
                <MessageCircle className="w-5 h-5" /> WhatsApp directo
              </a>
            </div>
            <p className="text-xs text-[#555] mt-6">Respuesta garantizada en menos de 24 horas.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
