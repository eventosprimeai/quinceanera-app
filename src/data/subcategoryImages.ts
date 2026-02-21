// src/data/subcategoryImages.ts

// Premium Unsplash imagery curated for each Quinceañera luxury subcategory
export const subcategoryImages: Record<string, string> = {
    "Quinceañera": "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?q=80&w=2000&auto=format&fit=crop", // Elegant dress / detail
    "Familia y corte": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop", // Elegant group / wedding style
    "Pre evento": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop", // Engagement/Pre-shoot style
    "Catering y bebidas": "https://images.unsplash.com/photo-1654922207993-2952fec328ae?q=80&w=2000&auto=format&fit=crop", // Elegant plating
    "Servicios de Concepto y dirección creativa": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop", // Creative direction / moodboards
    "Vals y coreografías": "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2000&auto=format&fit=crop", // Dancing / elegant
    "Maestro de ceremonias y música": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop", // DJ / Party
    "Hora loca y show": "https://images.unsplash.com/photo-1533174000273-fa28c2c510c4?q=80&w=2000&auto=format&fit=crop", // Neon / Party / Fun
    "Actos especiales": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop", // Emotional moments
    "Decoración y ambientación": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop", // Luxury event design
    "Hospitalidad": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2000&auto=format&fit=crop", // Ushers / Waiters / Staff
    "Activaciones": "https://images.unsplash.com/photo-1532007271951-c4877e606b02?q=80&w=2000&auto=format&fit=crop", // Photobooth vibe / fun
    "Recuerdos": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop", // Gifts / detailed boxes
    "Cobertura del evento": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop", // Pro Cameras
    "Entregables": "https://images.unsplash.com/photo-1582218084661-26ecbda7040d?q=80&w=2000&auto=format&fit=crop", // Fine art albums
    "Cabinas y activaciones": "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2000&auto=format&fit=crop", // Party photobooth
    "Invitaciones": "https://images.unsplash.com/photo-1507290439931-a861cfedc27e?q=80&w=2000&auto=format&fit=crop", // Calligraphy / envelopes
    "Papelería del día": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop", // Menus on tables (reusing great table shot)
    "Recuerdos y etiquetas": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop", // Reusing gifts
    "Locación y logística": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2000&auto=format&fit=crop", // Grand venue / hall
    "Planificación y producción ejecutiva": "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2000&auto=format&fit=crop", // Event planner vibe
    "Servicios de Post evento": "https://images.unsplash.com/photo-1518302057166-bd98aaeb34d2?q=80&w=2000&auto=format&fit=crop", // Aftermath / Clean / Post
    "Producción técnica": "https://images.unsplash.com/photo-1470229722913-7c090be5f5ae?q=80&w=2000&auto=format&fit=crop", // Concert lights / truss
    "Iluminación": "https://images.unsplash.com/photo-1508247271927-4a11f2a36b56?q=80&w=2000&auto=format&fit=crop", // Stage lighting
    "Seguridad": "https://images.unsplash.com/photo-1506306509618-e7c65f9bf6ca?q=80&w=2000&auto=format&fit=crop", // Security / Walkie talkie
    "Ingreso y control": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop", // Wristbands / Entrance
    "Protocolo ceremonial": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop", // Toast / glasses
    "Familia": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop", // Elegant family
    "Corte": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop", // Court / Friends
    "Accesorios ceremoniales": "https://images.unsplash.com/photo-1535924765792-bf393c52aef0?q=80&w=2000&auto=format&fit=crop", // Tiara / Shoes
};

export function getSubcategoryImage(name: string): string | null {
    if (!name) return null;
    const key = Object.keys(subcategoryImages).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? subcategoryImages[key] : null;
}
