# 🎀 Quinceañeras Premium — Cotizador Modular

Aplicación web de producción integral de quinceañeras de lujo para **PrimeAI Events** (Guayaquil, Ecuador).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — diseño dark premium con acentos dorados
- **Zustand** — estado del cotizador con persistencia en localStorage
- **@react-pdf/renderer** — generación de PDF server-side
- **better-sqlite3** — almacenamiento de cotizaciones
- **Nodemailer** — envío de emails con PDF adjunto

## Estructura

```
src/
├── app/
│   ├── page.tsx                 # Landing page (8 secciones)
│   ├── layout.tsx               # Layout global + fuentes
│   ├── globals.css              # Design system
│   ├── cotizar/
│   │   ├── page.tsx             # Cotizador modular (179 servicios)
│   │   └── resumen/page.tsx     # Resumen + envío
│   ├── gracias/page.tsx         # Confirmación post-envío
│   └── api/quote/route.ts       # API: DB → PDF → Email
├── components/
│   ├── Header.tsx               # Sticky + glassmorphism
│   ├── Footer.tsx
│   ├── ServiceCard.tsx          # Tarjeta interactiva
│   └── QuoteSummaryPanel.tsx    # Panel sticky / barra mobile
├── data/
│   └── serviceCatalog.json      # 179 ítems, 14 categorías
├── lib/
│   ├── db.ts                    # SQLite (better-sqlite3)
│   ├── email.ts                 # Nodemailer
│   └── pdf.ts                   # react-pdf
├── store/
│   └── quoteStore.ts            # Zustand + localStorage
└── types/
    └── catalog.ts               # Interfaces TS
```

## Desarrollo

```bash
npm install
npm run dev        # → http://localhost:3000
```

## Producción

```bash
npm run build
npm start
```

## Variables de entorno

Crea `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=contraseña-de-aplicación
SALES_EMAIL=ventas@eventosprimeai.com
```

> Sin SMTP configurado, el email se logea en consola (modo dev).

## Funcionalidades

- **Landing page** — Hero, Para quién es, 4 pasos, Diferenciadores, 179+ servicios, Inversión, FAQs, CTA final
- **Cotizador modular** — Formulario → 14 categorías → 179 servicios → panel sticky con total en tiempo real
- **Cálculo dinámico** — Precio fijo, por persona, por hora, por unidad, o "A cotizar"
- **Viáticos** — Auto-detección si el evento es fuera de Guayaquil
- **PDF** — Documento A4 dark+gold con desglose por categoría
- **Email** — Cotización al cliente + copia a ventas@ + PDF adjunto
- **Base de datos** — SQLite con registro de todas las cotizaciones
- **Persistencia** — El cotizador guarda progreso en localStorage
