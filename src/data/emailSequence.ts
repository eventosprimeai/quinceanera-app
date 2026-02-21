/**
 * Secuencia de 7 emails para leads que usaron el cotizador.
 * Se activa cuando un lead envía su cotización via /api/quote.
 * 
 * Implementación: Usar un servicio de email automation (ej: Resend sequences,
 * Mailchimp, ConvertKit) configurando estos templates con los delays indicados.
 */

export const emailSequence = [
    {
        id: 'email-1',
        day: 0,
        delay: 'Inmediato',
        subjectA: '✨ Tu cotización de quinceañera está lista — {{quoteId}}',
        subjectB: '{{firstName}}, aquí tienes tu cotización personalizada',
        previewText: 'PDF adjunto con el desglose de {{itemsCount}} servicios seleccionados.',
        structure: `
      BLOQUE 1: Saludo personalizado
      - "Hola {{firstName}},"
      - "Gracias por usar nuestro cotizador. Aquí tienes tu cotización personalizada."

      BLOQUE 2: Resumen visual
      - Total estimado: [TOTAL]
      - Servicios seleccionados: {{itemsCount}}
      - Ítems pendientes de cotización: {{quoteOnlyCount}}
      - Fecha tentativa: {{tentativeDate}}
      - Ciudad: {{city}}

      BLOQUE 3: PDF adjunto
      - "Descarga tu cotización completa en PDF (adjunto a este correo)."

      BLOQUE 4: Siguiente paso
      - "¿Lista para avanzar? Agenda una llamada de 15 minutos con tu event planner:"
      - CTA: "Agendar por WhatsApp" → wa.me/593969324140

      BLOQUE 5: Firma
      - Eventos Prime | Producción integral de quinceañeras
      - EPRAI Eventos Prime AI S.A.S · RUC 0993401502001
    `,
    },
    {
        id: 'email-2',
        day: 2,
        delay: 'Día 2',
        subjectA: '🎀 Cómo la quinceañera de Isabella fue perfecta con 0 estrés',
        subjectB: '{{firstName}}, mira lo que logramos en Samborondón',
        previewText: '120 invitados, 87 servicios, 100% dentro de presupuesto.',
        structure: `
      BLOQUE 1: Hook
      - "Patricia tenía el mismo dilema que tú: ¿organizar sola o delegar?"
      - "Eligió delegar. Esto fue lo que pasó."

      BLOQUE 2: Caso de estudio
      - Familia: Patricia L. (mamá de Isabella)
      - Ubicación: Samborondón, Guayaquil
      - Invitados: 120
      - Servicios contratados: 87 (de los 179 disponibles)
      - Resultado: 0 problemas, dentro de presupuesto
      - Testimonial: "El cotizador me ayudó a ver exactamente cuánto iba a gastar..."

      BLOQUE 3: Datos impactantes
      - "Las familias que contratan un director de evento ahorran un promedio de $800-$2,000
        en gastos no planificados vs. las que organizan solas."

      BLOQUE 4: CTA suave
      - "¿Quieres que revisemos tu cotización juntos?"
      - CTA: "Agendar llamada de 15 min" → wa.me/593969324140
    `,
    },
    {
        id: 'email-3',
        day: 4,
        delay: 'Día 4',
        subjectA: '⚠️ Lo que cuesta NO contratar un event planner a tiempo',
        subjectB: 'Los 3 gastos ocultos que nadie te menciona, {{firstName}}',
        previewText: 'Proveedor de último minuto, horas extras y cambios de venue.',
        structure: `
      BLOQUE 1: Problema real
      - "Nadie te dice esto, pero el 73% de las familias que organizan solas 
        terminan gastando más de lo presupuestado."

      BLOQUE 2: Los 3 costos ocultos
      - 1. Proveedor de emergencia (+$300-$800): "El DJ cancela 3 días antes.
           Consigues uno de último minuto al doble del precio."
      - 2. Horas extras no negociadas (+$200-$500): "El venue cobra $150/hora extra. 
           Tu evento se alarga 2 horas porque no hay run of show."
      - 3. Decoración que no encaja (+$200-$400): "Compras manteles que no combinan, 
           centros de mesa que no caben, y flores que llegan tarde."

      BLOQUE 3: La alternativa
      - "Con un director de evento, nada de esto pasa. Tenemos backup para cada proveedor,
        cronograma maestro con tiempos exactos, y diseño decorativo validado antes del montaje."

      BLOQUE 4: CTA directo
      - "Tu cotización aún está activa. ¿La revisamos?"
      - CTA: "Hablar con mi event planner" → wa.me/593969324140
    `,
    },
    {
        id: 'email-4',
        day: 7,
        delay: 'Día 7',
        subjectA: 'Hotel vs. productora: la comparación honesta',
        subjectB: '{{firstName}}, ¿qué conviene más para tu quinceañera?',
        previewText: 'Desglosamos las diferencias reales para que decidas con datos.',
        structure: `
      BLOQUE 1: Transparencia
      - "Sabemos que estás evaluando opciones. Aquí te damos una comparación honesta."

      BLOQUE 2: Tabla comparativa
      | Aspecto              | Paquete Hotel     | Eventos Prime          |
      |----------------------|-------------------|------------------------|
      | Personalización      | Limitada          | 179 servicios modulares|
      | Director de evento   | No incluido       | Incluido               |
      | Ensayo general       | No                | Sí                     |
      | Plan B por clima     | Básico            | Documentado            |
      | Producción técnica   | Parlante + luces  | PA, moving heads, LED  |
      | Contingencias        | "Vemos ese día"   | Protocolo escrito      |
      | Precio               | $2,000-$5,000     | $2,500-$15,000+        |

      BLOQUE 3: Honestidad
      - "Si tu prioridad es simplificar al máximo y el presupuesto es ajustado,
        un paquete de hotel puede funcionar. Pero si quieres que el evento sea
        memorable, personalizado y sin estrés, necesitas producción profesional."

      BLOQUE 4: CTA
      - "¿Quieres saber exactamente cuánto cuesta la diferencia?"
      - CTA: "Revisar mi cotización" → link al cotizador
    `,
    },
    {
        id: 'email-5',
        day: 10,
        delay: 'Día 10',
        subjectA: '🎬 Detrás de cámaras: así se produce una quinceañera de lujo',
        subjectB: 'Lo que hace nuestro equipo las 120 horas antes del evento',
        previewText: 'Cronograma maestro, site inspection, ensayo general y más.',
        structure: `
      BLOQUE 1: Diferenciador
      - "Lo que ves en el evento son 6 horas. Lo que no ves son las 120+ horas 
        de producción que garantizan que esas 6 horas sean perfectas."

      BLOQUE 2: Timeline de producción
      - Mes 6-4: Brief creativo, moodboard, storyboard de experiencia
      - Mes 3-2: Selección de venue, diseño de layout, curaduría musical
      - Mes 2-1: Montaje decorativo, pruebas de sonido, fitting de vestido
      - Semana -1: Site inspection, ensayo general, run of show final
      - Día D: Director en sitio, backstage manager, técnicos de sonido e iluminación
      - Día +1: Desmontaje, entrega de regalos, reunión post-evento

      BLOQUE 3: El equipo
      - Director(a) general del evento
      - Asistentes de coordinación (2-3)
      - Backstage manager
      - Técnico de sonido + Operador de iluminación
      - Equipo de montaje decorativo

      BLOQUE 4: CTA
      - "Conoce a tu equipo. Agenda una llamada."
      - CTA: "Agendar por WhatsApp" → wa.me/593969324140
    `,
    },
    {
        id: 'email-6',
        day: 14,
        delay: 'Día 14',
        subjectA: '🎁 15% de descuento en tu segundo evento con Eventos Prime',
        subjectB: '{{firstName}}, tenemos algo especial para ti',
        previewText: 'Boda, cumpleaños, graduación — tu próximo evento con 15% off.',
        structure: `
      BLOQUE 1: Oferta
      - "Las familias que confían en nosotros para la quinceañera suelen volver 
        para bodas, graduaciones y cumpleaños importantes."

      BLOQUE 2: Beneficio
      - "Por eso, cuando confirmes tu quinceañera con nosotros, recibirás un
        cupón de 15% de descuento para tu segundo evento (sin fecha de expiración)."
      - Aplica para: bodas, aniversarios, graduaciones, eventos corporativos

      BLOQUE 3: Urgencia ética
      - "Tu cotización de [TOTAL] sigue activa, pero los mejores venues y fechas
        se reservan con 6+ meses de anticipación."
      - "Si tu evento es en los próximos 8 meses, te recomendamos confirmar esta semana."

      BLOQUE 4: CTA
      - "Asegura tu fecha y activa tu 15% para el futuro."
      - CTA: "Confirmar con event planner" → wa.me/593969324140
    `,
    },
    {
        id: 'email-7',
        day: 21,
        delay: 'Día 21',
        subjectA: '{{firstName}}, ¿aún piensas en la quinceañera de tu hija?',
        subjectB: 'Último recordatorio: tu cotización expira pronto',
        previewText: 'Carolina, Patricia y Gabriela ya confiaron en nosotros. ¿Tú también?',
        structure: `
      BLOQUE 1: Empatía
      - "Sabemos que planificar una quinceañera es una decisión importante.
        No queremos presionarte — solo recordarte que estamos aquí."

      BLOQUE 2: Testimonios (3)
      - Carolina M.: "Contraté 8 proveedores por separado para mi sobrina y fue un caos.
        Con Eventos Prime todo fue diferente..."
      - Patricia L.: "El cotizador me ayudó a ver exactamente cuánto iba a gastar..."
      - Gabriela R.: "Evento fuera de Guayaquil y ni se notó..."

      BLOQUE 3: Resumen de su cotización
      - "Hace 3 semanas armaste una cotización con {{itemsCount}} servicios 
        por un estimado de [TOTAL]."
      - "Tu event planner está lista para revisar los detalles contigo."

      BLOQUE 4: CTA final
      - "Esta es la última vez que te escribiremos sobre esto."
      - CTA primario: "Confirmar mi evento" → wa.me/593969324140
      - CTA secundario: "Ya no me interesa" → link de unsub

      BLOQUE 5: P.S.
      - "P.S. Si decides no avanzar, no hay problema. Pero si en 6 meses 
        cambias de opinión, escríbenos. Tu cotización quedará guardada."
    `,
    },
];
