// Script para generar el catálogo JSON completo
const fs = require('fs');

const catalog = {
    version: "2.0",
    currency: "USD",
    locationRules: {
        baseCity: "Guayaquil",
        outsideCityLogisticsRule: {
            modeOptions: ["percent", "fixed_fee", "quote_only"],
            defaultMode: "quote_only",
            percentDefault: 0.15,
            fixedFeeDefaultUSD: 250,
            note: "Si el evento es fuera de Guayaquil, se puede aplicar un porcentaje sobre el subtotal cotizable o un fee fijo; o dejar como 'A cotizar'."
        },
        outsideCityLogisticsItem: {
            id: "logistics_outside_city",
            name: "Logística y viáticos fuera de Guayaquil",
            description: "Traslado de equipo y staff a otra provincia. Se calcula según ciudad, carga, tiempos y condiciones del venue.",
            pricingType: "quoteOnly",
            priceUSD: null,
            unitLabel: "por proyecto",
            imageQuery: "event production truck loading equipment"
        }
    },
    categories: []
};

// Helper
const item = (id, name, desc, type, price, unit, img, qty, custom) => ({
    id, name, description: desc, pricingType: type, priceUSD: price,
    unitLabel: unit, imageQuery: img,
    ...(qty !== undefined ? { defaultQty: qty } : {}),
    ...(custom ? { allowCustomQty: true } : {})
});

const Q = null; // quoteOnly price shorthand

catalog.categories = [
    {
        id: "creative_direction",
        name: "Concepto y dirección creativa",
        description: "Definimos la visión estética, narrativa y experiencia del evento.",
        subcategories: [
            {
                id: "concept_theme",
                name: "Concepto, temática y moodboard",
                items: [
                    item("creative_brief_session", "Sesión creativa inicial (brief + estilo)", "Reunión guiada para definir estilo, paleta de color, referencias visuales y prioridades.", "fixed", Q, "por sesión", "luxury event planning moodboard meeting"),
                    item("theme_development", "Desarrollo de temática completa", "Concepto integral: estética, referencias, dress code, materiales, atmósfera y momentos icónicos.", "fixed", Q, "por proyecto", "luxury quinceanera theme concept design"),
                    item("color_palette_design", "Paleta de color + guía de estilo", "Documento visual: colores, tipografías, texturas y lineamientos de decoración.", "fixed", Q, "por proyecto", "event color palette luxury pastel gold"),
                    item("storyboard_experience", "Storyboard de experiencia", "Mapa de la noche: entrada, protocolo, cena, vals, show, fiesta, cierre; con intención estética y musical.", "fixed", Q, "por proyecto", "event storyboard luxury timeline planning"),
                ]
            },
            {
                id: "branding_graphics",
                name: "Branding del evento",
                items: [
                    item("monogram_logo", "Monograma / logo del evento", "Identidad visual para invitación, pantalla, señalética, recuerdos y PDF.", "fixed", Q, "por proyecto", "luxury monogram design quinceanera"),
                    item("visual_assets_pack", "Paquete de assets visuales", "Fondos, patterns, firmas digitales para coherencia visual.", "fixed", Q, "por proyecto", "graphic design assets luxury branding"),
                    item("screen_content_design", "Diseño de contenido para pantalla", "Nombre, monograma, transiciones, fondos y loop para LED.", "fixed", Q, "por proyecto", "LED screen content design event"),
                ]
            },
            {
                id: "musical_identity",
                name: "Identidad musical",
                items: [
                    item("music_curation", "Curaduría musical por momentos", "Selección por bloque: entrada, cena, vals, brindis, fiesta y cierre.", "fixed", Q, "por evento", "DJ music playlist luxury event"),
                    item("no_play_list", "Lista 'No poner' + tonos sensibles", "Control de canciones prohibidas; alineación con familia.", "fixed", Q, "por evento", "music production headphones studio"),
                ]
            }
        ]
    },
    {
        id: "planning_management",
        name: "Planificación y producción ejecutiva",
        description: "Gestión profesional: cronograma, proveedores, presupuesto y control.",
        subcategories: [
            {
                id: "project_management",
                name: "Gestión del proyecto",
                items: [
                    item("master_timeline", "Cronograma maestro", "Run of show y calendarización por hitos: reuniones, pagos, pruebas y ensayos.", "fixed", Q, "por proyecto", "event run of show timeline production sheet"),
                    item("budget_control", "Control de presupuesto y priorización", "Estructura por categorías; control de desviaciones.", "fixed", Q, "por proyecto", "budget spreadsheet planning financial"),
                    item("vendor_sourcing", "Búsqueda y negociación de proveedores", "Selección, negociación, contratación y coordinación.", "quoteOnly", Q, "por proyecto", "event planner vendor coordination"),
                    item("contract_admin", "Administración de contratos y pagos", "Gestión documental: anticipos, calendarios, supervisión.", "fixed", Q, "por proyecto", "contract signing business document"),
                ]
            },
            {
                id: "on_site_coordination",
                name: "Coordinación en sitio",
                items: [
                    item("event_day_director", "Director(a) general del evento", "Dirección en sitio: tiempos, proveedores, protocolo y contingencias.", "fixed", Q, "por evento", "event director headset luxury gala"),
                    item("assistant_coordinators", "Asistentes de coordinación", "Equipo de apoyo para backstage, invitados y timing.", "perUnit", Q, "por persona", "event staff coordination team", 2, true),
                    item("backstage_manager", "Backstage manager", "Responsable de camerinos, cambios y cues de entrada.", "fixed", Q, "por evento", "backstage event manager production"),
                    item("rehearsal_coordination", "Ensayo general", "Ensayo de entrada, vals, coreografías y cues.", "fixed", Q, "por ensayo", "quinceanera rehearsal ballroom"),
                ]
            },
            {
                id: "guests_protocol",
                name: "Invitados, padrinos y protocolo",
                items: [
                    item("guest_list_system", "Sistema de lista de invitados", "Consolidación, RSVP, control de mesas y recordatorios.", "fixed", Q, "por proyecto", "guest list invitation event management"),
                    item("seating_plan_design", "Diseño de seating plan", "Estrategia de mesas, jerarquías y plano final.", "fixed", Q, "por proyecto", "seating chart design luxury wedding"),
                    item("padrinos_coordination", "Coordinación de padrinos y aportes", "Control de compromisos, entregas y aportes.", "fixed", Q, "por proyecto", "family meeting planning celebration"),
                ]
            }
        ]
    },
    {
        id: "venue_logistics",
        name: "Locación y logística",
        description: "Selección de espacio, layout, transporte, permisos y plan B.",
        subcategories: [
            {
                id: "venue_selection",
                name: "Locación",
                items: [
                    item("venue_scouting", "Búsqueda y scouting de locación", "Opciones y visitas para evaluar aforo, acústica, energía y altura.", "quoteOnly", Q, "por proyecto", "luxury event venue scouting walkthrough"),
                    item("site_inspection", "Visita técnica (site inspection)", "Mediciones, accesos, energía, rigging y plan de montaje.", "fixed", Q, "por visita", "event venue technical inspection"),
                    item("venue_negotiation", "Asesoría en reserva y negociación", "Soporte para cerrar contrato: horarios, restricciones, staff.", "quoteOnly", Q, "por proyecto", "venue contract negotiation meeting"),
                ]
            },
            {
                id: "layout_zoning",
                name: "Layout y zoning",
                items: [
                    item("space_layout_design", "Diseño de layout (plano)", "Plano con mesas, pista, escenario, DJ, barras, backstage y flujos.", "fixed", Q, "por plano", "event floor plan layout design"),
                    item("flow_signage", "Señalización de flujos", "Señalización de circulación para evitar congestión.", "fixed", Q, "por evento", "event directional signage elegant"),
                ]
            },
            {
                id: "transport_parking",
                name: "Transporte y parqueo",
                items: [
                    item("classic_car", "Auto clásico para la quinceañera", "Llegada icónica según disponibilidad.", "quoteOnly", Q, "por servicio", "classic car quinceanera arrival luxury"),
                    item("limousine", "Limosina", "Transporte premium para quinceañera y corte.", "quoteOnly", Q, "por servicio", "limousine luxury event transport"),
                    item("shuttle_service", "Van / shuttle para corte", "Transporte coordinado para damas y chambelanes.", "quoteOnly", Q, "por ruta", "event shuttle van luxury transportation"),
                    item("valet_service", "Valet parking", "Recepción premium de invitados.", "quoteOnly", Q, "por evento", "valet parking luxury event entrance"),
                ]
            },
            {
                id: "permits_planb",
                name: "Permisos y plan B",
                items: [
                    item("rain_plan_b", "Plan B por lluvia / clima", "Carpas, toldos, reubicación y plan alterno.", "quoteOnly", Q, "por proyecto", "outdoor event tent rain cover luxury"),
                    item("permits", "Permisos y autorizaciones", "Gestión de permisos municipales, ruidos, pirotecnia fría.", "quoteOnly", Q, "por proyecto", "event permit document city hall"),
                    item("liability_insurance", "Seguro de responsabilidad civil", "Cobertura según requerimientos del venue.", "quoteOnly", Q, "por evento", "insurance document event coverage"),
                ]
            }
        ]
    },
    {
        id: "technical_production",
        name: "Producción técnica",
        description: "Audio, iluminación, video, escenario, energía y efectos.",
        subcategories: [
            {
                id: "sound",
                name: "Sonido",
                items: [
                    item("dj_service", "DJ profesional", "DJ con guía musical por momentos y lectura de pista.", "fixed", Q, "por evento", "professional DJ setup luxury event"),
                    item("sound_system_pa", "Sistema de sonido PA", "Sistema principal + subwoofers ajustado al venue.", "quoteOnly", Q, "por evento", "concert sound system speakers line array"),
                    item("mixing_console", "Consola digital", "Consola adecuada al número de canales.", "quoteOnly", Q, "por evento", "digital mixing console audio event"),
                    item("wireless_microphones", "Micrófonos inalámbricos", "Para discursos, MC, brindis y protocolo.", "perUnit", Q, "por unidad", "wireless microphone handheld premium", 2, true),
                    item("headset_mic", "Micrófono headset para MC", "Para maestro de ceremonias.", "perUnit", Q, "por unidad", "headset microphone event MC", 1),
                    item("stage_monitors", "Monitores de escenario", "Para performances, vals y músicos.", "quoteOnly", Q, "por set", "stage monitor speaker event"),
                    item("sound_technician", "Técnico de sonido", "Operación durante montaje, pruebas y evento.", "fixed", Q, "por evento", "sound engineer mixing live event"),
                ]
            },
            {
                id: "lighting",
                name: "Iluminación",
                subcategories: [
                    {
                        id: "ambient_lighting",
                        name: "Ambientación y arquitectura",
                        items: [
                            item("architectural_uplighting", "Uplighting arquitectónico", "Iluminación de paredes/columnas para transformar el espacio.", "quoteOnly", Q, "por evento", "architectural uplighting ballroom"),
                            item("warm_dinner_lighting", "Diseño de luz cálida para cena", "Capa de iluminación cálida para mesa y rostros.", "quoteOnly", Q, "por evento", "warm dinner lighting luxury event candles"),
                            item("string_lights", "Guirnaldas / string lights", "Luces cálidas decorativas estilo jardín romántico.", "quoteOnly", Q, "por montaje", "string lights luxury event ceiling"),
                        ]
                    },
                    {
                        id: "dancefloor_lighting",
                        name: "Pista, show y dinámica",
                        items: [
                            item("moving_heads", "Luces robóticas (moving heads)", "Iluminación dinámica para show y fiesta.", "quoteOnly", Q, "por set", "moving head lights stage club"),
                            item("beam_effects", "Beam / efectos de haz", "Efectos de haz finos para momentos de alto impacto.", "quoteOnly", Q, "por set", "beam lights event stage effects"),
                            item("follow_spot", "Seguidor / follow spot", "Seguimiento puntual para entrada, vals y momentos principales.", "quoteOnly", Q, "por evento", "follow spot light event stage"),
                            item("hazer", "Hazer (neblina ligera)", "Realza haces de luz; ideal para show y fotos.", "quoteOnly", Q, "por evento", "hazer fog machine light beams event"),
                            item("lighting_operator", "Operador de iluminación", "Programación y operación en vivo por momentos.", "fixed", Q, "por evento", "lighting operator console event"),
                        ]
                    }
                ]
            },
            {
                id: "video_screens",
                name: "Video y pantallas",
                items: [
                    item("led_screen", "Pantalla LED", "Para visuales, videos, nombre y cámara en vivo.", "quoteOnly", Q, "por evento", "LED screen event stage quinceanera"),
                    item("projection_system", "Proyector + pantalla", "Alternativa a LED según venue y luz.", "quoteOnly", Q, "por evento", "projector screen ballroom event"),
                    item("live_cameras", "Cámaras para IMAG", "Para mostrar en pantallas momentos clave.", "quoteOnly", Q, "por evento", "live camera event IMAG production"),
                    item("video_switcher", "Switcher / mezclador de video", "Control de fuentes: cámaras + videos.", "quoteOnly", Q, "por evento", "video switcher production event"),
                    item("private_streaming", "Streaming privado", "Transmisión para familiares que no asisten.", "quoteOnly", Q, "por evento", "live streaming event private broadcast"),
                ]
            },
            {
                id: "stage_structures",
                name: "Escenario y estructuras",
                items: [
                    item("main_stage", "Tarima / escenario principal", "Plataforma para entrada, protocolo y performance.", "quoteOnly", Q, "por montaje", "event stage platform truss luxury"),
                    item("dj_stage", "Tarima para DJ", "Tarima dedicada para DJ y control técnico.", "quoteOnly", Q, "por montaje", "DJ booth stage platform event"),
                    item("runway_pasarela", "Pasarela / runway", "Pasarela para entrada y fotos.", "quoteOnly", Q, "por montaje", "event runway pasarela quinceanera entrance"),
                    item("truss_structure", "Estructura truss", "Para colgar iluminación y elementos escénicos.", "quoteOnly", Q, "por montaje", "truss lighting structure event"),
                    item("dance_floor", "Pista de baile", "Pista según tamaño (m²).", "quoteOnly", Q, "por evento", "dance floor luxury event ballroom"),
                    item("led_dance_floor", "Pista LED (opcional)", "Pista de baile LED para efecto wow.", "quoteOnly", Q, "por evento", "LED dance floor party lights"),
                ]
            },
            {
                id: "power_distribution",
                name: "Energía y distribución",
                items: [
                    item("power_distribution", "Distribución eléctrica y cableado", "Plan de energía para audio/luces/LED; canalización segura.", "quoteOnly", Q, "por evento", "electrical distribution event power cable"),
                    item("ups_backup", "UPS / respaldo crítico", "Respaldo para equipos de control.", "quoteOnly", Q, "por evento", "UPS backup power event production"),
                    item("generator", "Generador eléctrico", "Para venues sin capacidad suficiente.", "quoteOnly", Q, "por día", "generator outdoor event power"),
                ]
            },
            {
                id: "special_effects",
                name: "Efectos especiales",
                items: [
                    item("cold_sparks", "Chispas frías (cold sparks)", "Efecto seguro para entrada/vals.", "quoteOnly", Q, "por set", "cold sparks indoor event entrance"),
                    item("low_fog", "Humo bajo (low fog) para vals", "Efecto 'nube' para un vals cinematográfico.", "quoteOnly", Q, "por evento", "low fog dance floor wedding quinceanera"),
                    item("confetti_cannon", "Confeti (máquina/cañón)", "Confeti para clímax musical o cierre.", "quoteOnly", Q, "por activación", "confetti cannon luxury party"),
                    item("co2_jets", "CO2 jets / efecto frío", "Efecto de impacto para momentos de fiesta.", "quoteOnly", Q, "por set", "CO2 jet blast event stage effect"),
                    item("bubble_machine", "Máquina de burbujas", "Efecto suave para entradas o momentos familiares.", "quoteOnly", Q, "por evento", "bubble machine event outdoor ceremony"),
                ]
            }
        ]
    },
    {
        id: "decor_design",
        name: "Decoración y ambientación",
        description: "Diseño estético completo: flor, mobiliario, backdrops, mesas y espacios.",
        subcategories: [
            {
                id: "decor_integral",
                name: "Diseño decorativo integral",
                items: [
                    item("decor_concept", "Diseño decorativo (concepto + render)", "Dirección decor con referencias y criterios.", "fixed", Q, "por proyecto", "luxury event decoration concept render"),
                    item("decor_team", "Equipo de montaje decor", "Personal para instalación y desmontaje.", "fixed", Q, "por evento", "event decoration team setup installation"),
                ]
            },
            {
                id: "main_areas",
                name: "Áreas principales",
                items: [
                    item("welcome_area", "Área de bienvenida + photo moment", "Panel de bienvenida y spot fotográfico.", "quoteOnly", Q, "por montaje", "event welcome area photo backdrop luxury"),
                    item("main_stage_backdrop", "Backdrop principal (escenografía)", "Fondo principal personalizado.", "quoteOnly", Q, "por montaje", "luxury quinceanera backdrop stage floral"),
                    item("floral_wall", "Muro floral (floral wall)", "Pared floral para fotos de alto impacto.", "quoteOnly", Q, "por montaje", "luxury floral wall photo backdrop"),
                    item("sweet_table_styling", "Mesa de dulces: diseño y styling", "Diseño visual de mesa dulce.", "quoteOnly", Q, "por montaje", "luxury dessert table candy bar styling"),
                    item("guest_book_table", "Mesa de firmas / libro de recuerdos", "Mesa para firmas y mensajes.", "quoteOnly", Q, "por montaje", "guest book table event elegant"),
                    item("gift_table", "Mesa de regalos", "Mesa dedicada y señalización.", "quoteOnly", Q, "por montaje", "gift table event display luxury"),
                ]
            },
            {
                id: "floristry",
                name: "Florería",
                items: [
                    item("low_centerpieces", "Centros de mesa bajos", "Arreglos bajos elegantes.", "perUnit", Q, "por mesa", "low floral centerpiece luxury", 10, true),
                    item("tall_centerpieces", "Centros de mesa altos", "Arreglos altos para impacto visual.", "perUnit", Q, "por mesa", "tall floral centerpiece luxury ballroom", 10, true),
                    item("main_table_flowers", "Flor para mesa principal", "Arreglo floral central o lineal.", "quoteOnly", Q, "por montaje", "luxury head table floral arrangement"),
                    item("quince_bouquet", "Ramo de quinceañera", "Ramo para fotos y momentos ceremoniales.", "quoteOnly", Q, "por ramo", "quinceanera bouquet elegant flowers"),
                ]
            },
            {
                id: "furniture_textiles",
                name: "Mobiliario y textiles",
                items: [
                    item("lounge_furniture", "Mobiliario lounge", "Sofás, puffs y mesas auxiliares.", "quoteOnly", Q, "por montaje", "luxury lounge area event furniture"),
                    item("premium_chairs", "Sillas premium (Tiffany/Ghost)", "Sillas de lujo.", "perPerson", Q, "por invitado", "tiffany chairs luxury event table setup"),
                    item("premium_linens", "Mantelería premium + caminos", "Mantelería, overlays y servilletas de tela.", "perUnit", Q, "por mesa", "luxury table linen overlay event", 10, true),
                    item("premium_tableware", "Vajilla y cristalería premium", "Cargadores, vajilla, cristalería.", "perPerson", Q, "por invitado", "luxury table setting charger plates glassware"),
                    item("ceiling_draping", "Drapeado con telas (techo/pared)", "Telas para transformar espacio.", "quoteOnly", Q, "por montaje", "ceiling draping fabric luxury event"),
                ]
            }
        ]
    },
    {
        id: "catering_bar",
        name: "Catering y bebidas",
        description: "Experiencia gastronómica: cena, estaciones, postres, bar y mesa dulce.",
        subcategories: [
            {
                id: "food_service",
                name: "Tipo de servicio",
                items: [
                    item("plated_dinner", "Cena servida (plato a la mesa)", "Servicio formal premium.", "perPerson", Q, "por invitado", "plated dinner luxury banquet"),
                    item("buffet", "Buffet", "Variedad con logística de flujo.", "perPerson", Q, "por invitado", "buffet luxury event catering"),
                    item("cocktail_style", "Cóctel / finger food premium", "Formato social con estaciones.", "perPerson", Q, "por invitado", "finger food cocktail reception luxury"),
                ]
            },
            {
                id: "menu_options",
                name: "Menú y restricciones",
                items: [
                    item("menu_design", "Diseño de menú (propuesta gastronómica)", "Propuesta de menú por tiempos.", "fixed", Q, "por proyecto", "luxury menu design food photography"),
                    item("kids_menu", "Menú infantil", "Opción para niños.", "perPerson", Q, "por invitado", "kids menu event fun food"),
                    item("vegetarian_option", "Opción vegetariana/vegana", "Alternativas alimentarias.", "perPerson", Q, "por invitado", "vegetarian vegan gourmet plate"),
                ]
            },
            {
                id: "beverages",
                name: "Bebidas",
                items: [
                    item("soft_drinks_unlimited", "Bebidas soft ilimitadas", "Bebidas no alcohólicas ilimitadas.", "quoteOnly", Q, "por evento", "soft drinks station event"),
                    item("coffee_tea_station", "Estación de café, agua, té", "Estación permanente de bebidas calientes.", "quoteOnly", Q, "por evento", "coffee station event hospitality"),
                    item("mocktail_bar", "Bar de mocktails (sin alcohol)", "Coctelería sin alcohol premium.", "quoteOnly", Q, "por evento", "mocktail bar setup luxury event"),
                ]
            },
            {
                id: "desserts",
                name: "Postres y mesa dulce",
                items: [
                    item("main_cake", "Pastel/torta principal", "Pastel acorde a temática.", "quoteOnly", Q, "por pastel", "luxury quinceanera cake multi tier"),
                    item("fake_cake", "Torta falsa para foto", "Torta falsa para sesión + torta real.", "quoteOnly", Q, "por pieza", "fake cake display event photo"),
                    item("dessert_table", "Mesa dulce / candy bar", "Mesa temática con dulces.", "quoteOnly", Q, "por montaje", "luxury dessert table candy bar quinceanera"),
                    item("chocolate_fountain", "Fuente de chocolate", "Estación de chocolate con frutas.", "quoteOnly", Q, "por evento", "chocolate fountain luxury dessert"),
                ]
            },
            {
                id: "service_staff",
                name: "Personal de servicio",
                items: [
                    item("waiters", "Meseros", "Meseros según aforo.", "perHour", Q, "por hora", "waiter formal event service", 6, true),
                    item("bartenders", "Bartenders / baristas", "Personal para barras.", "perHour", Q, "por hora", "bartender cocktail luxury event", 4, true),
                ]
            }
        ]
    },
    {
        id: "beauty_aesthetics",
        name: "Belleza y estética",
        description: "Imagen personal para quinceañera y familia.",
        subcategories: [
            {
                id: "quince_beauty",
                name: "Quinceañera",
                items: [
                    item("makeup_professional", "Maquillaje profesional", "Maquillaje fotográfico acorde a temática.", "fixed", Q, "por servicio", "quinceanera makeup glam soft glam"),
                    item("hair_quinceanera", "Peinado quinceañera", "Peinado ceremonial resistente para baile.", "fixed", Q, "por servicio", "beautiful quinceanera hairstyle updo tiara"),
                    item("beauty_trial", "Prueba previa (makeup + peinado)", "Prueba completa para definir estilo final.", "fixed", Q, "por prueba", "hair and makeup trial bridal studio"),
                    item("touch_up_kit", "Kit de retoque", "Kit personalizado para mantener el look.", "fixed", Q, "por kit", "makeup touch up kit event"),
                    item("event_touch_up", "Retoque durante el evento", "Retoque de maquillaje y peinado.", "perHour", Q, "por hora", "makeup artist event touch up", 2, true),
                ]
            },
            {
                id: "family_beauty",
                name: "Familia y corte",
                items: [
                    item("mom_makeup", "Maquillaje mamá", "Maquillaje elegante y fotográfico.", "fixed", Q, "por servicio", "mother event makeup elegant"),
                    item("mom_hair", "Peinado mamá", "Peinado acorde a estilo general.", "fixed", Q, "por servicio", "mother elegant hairstyle event"),
                    item("court_beauty_pack", "Paquete belleza corte", "Makeup/peinado para corte.", "perUnit", Q, "por persona", "bridesmaids makeup hairstyle event", 6, true),
                    item("family_look_coordination", "Coordinación de look familiar", "Coherencia de colores/estilo en familia.", "quoteOnly", Q, "por familia", "family formal wear coordinated outfits"),
                ]
            },
            {
                id: "pre_event_beauty",
                name: "Pre evento",
                items: [
                    item("facial_treatments", "Plan de cuidado de piel", "Rutina previa sugerida por profesional.", "quoteOnly", Q, "por plan", "facial treatment spa skincare"),
                    item("manicure", "Manicure", "Manicure (clásico, gel, diseño).", "fixed", Q, "por servicio", "luxury manicure nude nails"),
                    item("pedicure", "Pedicure", "Pedicure completo con esmalte.", "fixed", Q, "por servicio", "spa pedicure elegant"),
                ]
            }
        ]
    },
    {
        id: "wardrobe",
        name: "Vestuario y accesorios",
        description: "Vestido principal, segundo vestido, calzado, accesorios y corte.",
        subcategories: [
            {
                id: "quince_wardrobe",
                name: "Quinceañera",
                items: [
                    item("main_dress", "Vestido principal", "Vestido ceremonial + fittings.", "quoteOnly", Q, "por vestido", "luxury quinceanera dress ball gown"),
                    item("second_dress", "Segundo vestido (cambio para fiesta)", "Vestido más cómodo para bailar.", "quoteOnly", Q, "por vestido", "quinceanera second dress party dress"),
                    item("shoes", "Zapatos", "Calzado elegante y cómodo.", "quoteOnly", Q, "por par", "quinceanera heels glitter shoes"),
                    item("tiara_crown", "Tiara / corona", "Accesorio principal.", "quoteOnly", Q, "por pieza", "quinceanera tiara crystal crown"),
                    item("jewelry", "Joyería / accesorios", "Aretes, collar, pulsera.", "quoteOnly", Q, "por set", "luxury jewelry set quinceanera"),
                    item("getting_ready_robe", "Bata 'getting ready'", "Bata para preparación y fotos.", "quoteOnly", Q, "por unidad", "getting ready robe quinceanera silk"),
                    item("dress_alterations", "Ajustes de vestido (sastrería)", "Ajustes según complejidad.", "quoteOnly", Q, "por vestido", "dress alteration tailor fitting"),
                ]
            },
            {
                id: "family_wardrobe",
                name: "Familia y corte",
                items: [
                    item("dad_suit", "Traje del papá", "Traje formal acorde a temática.", "quoteOnly", Q, "por traje", "formal suit father luxury event"),
                    item("mom_dress", "Vestido de la mamá", "Vestido formal acorde a estética.", "quoteOnly", Q, "por vestido", "mother formal dress luxury event"),
                    item("chambelanes_suits", "Vestuario de chambelanes", "Trajes / camisas / corbatas.", "perUnit", Q, "por persona", "chambelanes suit formal event", 6, true),
                    item("damas_dresses", "Vestidos de damas de honor", "Vestidos coordinados.", "perUnit", Q, "por persona", "bridesmaids dresses quinceanera coordinated", 6, true),
                    item("boutonnieres_corsages", "Boutonnieres y corsages", "Flores para solapas y muñecas.", "perUnit", Q, "por unidad", "boutonniere corsage luxury event flowers", 8, true),
                ]
            },
            {
                id: "ceremonial_accessories",
                name: "Accesorios ceremoniales",
                items: [
                    item("toast_set", "Set de brindis (copas + accesorios)", "Copas y accesorios para brindis.", "quoteOnly", Q, "por set", "champagne toast set quinceanera"),
                    item("candle_ceremony", "Ceremonia de velas", "Velas, set ceremonial y guion.", "quoteOnly", Q, "por set", "candle ceremony quinceanera symbolic"),
                    item("guest_book", "Libro de firmas", "Libro físico para mensajes.", "quoteOnly", Q, "por unidad", "guest book signing luxury event"),
                ]
            }
        ]
    },
    {
        id: "choreography_entertainment",
        name: "Coreografía y entretenimiento",
        description: "Vals, coreografías, shows, artistas y animación.",
        subcategories: [
            {
                id: "dance",
                name: "Vals y coreografías",
                items: [
                    item("traditional_waltz", "Vals tradicional", "Dirección de vals clásico con marcas escénicas.", "quoteOnly", Q, "por montaje", "quinceanera waltz ballroom dance"),
                    item("father_daughter_dance", "Baile quinceañera + papá", "Montaje de baile emotivo.", "quoteOnly", Q, "por montaje", "father daughter dance quinceanera emotional"),
                    item("surprise_dance", "Baile sorpresa (coreografía moderna)", "Coreografía moderna para impacto.", "quoteOnly", Q, "por montaje", "quinceanera surprise dance performance"),
                    item("extra_rehearsals", "Ensayos adicionales", "Ensayos por hora.", "perHour", Q, "por hora", "dance rehearsal studio practice", 4, true),
                    item("choreographer", "Coreógrafo(a)", "Dirección artística y técnica.", "quoteOnly", Q, "por proyecto", "choreographer dance director event"),
                ]
            },
            {
                id: "mc_music",
                name: "Maestro de ceremonias y música",
                items: [
                    item("mc_host", "Maestro(a) de ceremonias (MC)", "Conduce protocolo con tono elegante.", "fixed", Q, "por evento", "master of ceremonies MC quinceanera"),
                    item("live_band", "Banda en vivo", "Música en vivo para bloques seleccionados.", "quoteOnly", Q, "por evento", "live band performance luxury event"),
                    item("mariachi", "Mariachi (opcional)", "Bloque musical tradicional.", "quoteOnly", Q, "por evento", "mariachi band celebration traditional"),
                    item("saxophonist", "Saxofonista / música ambiental", "Música elegante para cóctel o cena.", "perHour", Q, "por hora", "saxophone ambient music elegant dinner", 2, true),
                ]
            },
            {
                id: "hora_loca",
                name: "Hora loca y show",
                items: [
                    item("hora_loca_classic", "Hora loca clásica (show)", "Show con animación, segmentos y cotillón.", "quoteOnly", Q, "por show", "hora loca dancers led costumes party"),
                    item("hora_loca_characters", "Hora loca: paquete de personajes", "Packs de 2–5 personajes. Duración ~40 min.", "quoteOnly", Q, "por show", "hora loca characters costumes party performers"),
                    item("extra_cotillon", "Cotillón adicional", "Accesorios adicionales para invitados.", "quoteOnly", Q, "por set", "party cotillon accessories neon glow"),
                    item("themed_show", "Show temático", "Show alineado a temática.", "quoteOnly", Q, "por show", "themed performance luxury event show"),
                ]
            },
            {
                id: "special_acts",
                name: "Actos especiales",
                items: [
                    item("surprise_artist", "Artista sorpresa / performance", "Acto especial según preferencia.", "quoteOnly", Q, "por acto", "surprise performer singer event stage"),
                    item("cold_pyro", "Pirotecnia fría (si aplica)", "Efecto pirotecnia fría sujeto a permisos.", "quoteOnly", Q, "por set", "cold pyrotechnics event celebration sparks"),
                ]
            }
        ]
    },
    {
        id: "photo_video",
        name: "Fotografía y video",
        description: "Cobertura profesional: pre-quince, evento, highlight, álbum, reels.",
        subcategories: [
            {
                id: "pre_event_photo",
                name: "Pre evento",
                items: [
                    item("pre_quince_session", "Sesión pre quince (foto)", "Sesión conceptual en locación.", "fixed", Q, "por sesión", "quinceanera photoshoot outdoor luxury"),
                    item("save_the_date_video", "Video save-the-date", "Video corto para invitación digital.", "fixed", Q, "por pieza", "save the date video cinematic short"),
                ]
            },
            {
                id: "event_coverage",
                name: "Cobertura del evento",
                items: [
                    item("photo_coverage", "Cobertura fotográfica", "Fotografía profesional por horas.", "perHour", Q, "por hora", "event photographer luxury quinceanera", 6, true),
                    item("video_coverage", "Cobertura de video", "Video por horas con edición.", "perHour", Q, "por hora", "videographer event cinematic filming", 6, true),
                    item("drone", "Drone (si el venue permite)", "Tomas aéreas en exteriores.", "quoteOnly", Q, "por evento", "drone aerial video event outdoor"),
                ]
            },
            {
                id: "deliverables",
                name: "Entregables",
                items: [
                    item("cinematic_highlight", "Video highlight cinematográfico", "Resumen emocionante 3–6 min.", "fixed", Q, "por pieza", "cinematic event video filming gimbal"),
                    item("full_event_video", "Video completo del evento", "Registro extendido con edición.", "fixed", Q, "por pieza", "full event video recording production"),
                    item("reels_pack", "Paquete de reels (vertical)", "Clips verticales para Instagram/TikTok.", "fixed", Q, "por pack", "vertical video reels social media event"),
                    item("online_gallery", "Galería online privada", "Galería para compartir con invitados.", "fixed", Q, "por evento", "online photo gallery private sharing"),
                    item("premium_album", "Álbum físico premium", "Álbum impreso de lujo.", "quoteOnly", Q, "por álbum", "luxury photo album coffee table"),
                ]
            },
            {
                id: "booths",
                name: "Cabinas y activaciones",
                items: [
                    item("photobooth", "Cabina fotográfica / photobooth", "Cabina con cámara, props e impresión.", "quoteOnly", Q, "por evento", "photobooth event props luxury setup"),
                    item("mirror_booth", "Espejo mágico (mirror booth)", "Photobooth tipo espejo interactivo.", "quoteOnly", Q, "por evento", "mirror booth event interactive photo"),
                    item("video_360", "Video booth 360", "Plataforma 360 para clips cortos.", "quoteOnly", Q, "por evento", "360 video booth platform event"),
                ]
            }
        ]
    },
    {
        id: "stationery",
        name: "Invitaciones, papelería y señalética",
        description: "Invitación, menús, seating plan, números de mesa y recuerdos.",
        subcategories: [
            {
                id: "invitations",
                name: "Invitaciones",
                items: [
                    item("invitations_printed", "Invitación física premium", "Diseño + impresión (foil, relieve, acrílico).", "quoteOnly", Q, "por set", "luxury quinceanera invitation gold foil"),
                    item("invitations_digital", "Invitación digital (WhatsApp/redes)", "Diseño digital animada.", "fixed", Q, "por pieza", "digital invitation animated luxury"),
                    item("save_the_date", "Save the date", "Pieza previa (digital o impresa).", "fixed", Q, "por pieza", "save the date card elegant luxury"),
                ]
            },
            {
                id: "event_day_stationery",
                name: "Papelería del día",
                items: [
                    item("printed_menus", "Menús impresos", "Menú por mesa o invitado.", "perUnit", Q, "por unidad", "printed menu card luxury event", 10, true),
                    item("place_cards", "Place cards / tarjetas de puesto", "Tarjetas para asignar lugar.", "perUnit", Q, "por unidad", "place card name tag event luxury", 80, true),
                    item("table_numbers", "Números de mesa", "Acrílico, papel o metal.", "perUnit", Q, "por unidad", "table number acrylic luxury event", 10, true),
                    item("seating_plan_printed", "Seating plan impreso/instalado", "Panel de asignación de mesas.", "quoteOnly", Q, "por montaje", "seating chart board luxury event"),
                    item("welcome_panel", "Panel de bienvenida", "Panel con monograma y tema.", "quoteOnly", Q, "por montaje", "welcome sign board luxury event entrance"),
                ]
            },
            {
                id: "souvenirs_labels",
                name: "Recuerdos y etiquetas",
                items: [
                    item("thank_you_cards", "Tarjetas de agradecimiento", "Tarjetas para recuerdos.", "quoteOnly", Q, "por set", "thank you card luxury event stationery"),
                    item("custom_labels", "Etiquetas personalizadas", "Etiquetas adhesivas con monograma.", "quoteOnly", Q, "por set", "custom label sticker event branding"),
                ]
            }
        ]
    },
    {
        id: "security_protocol",
        name: "Seguridad y protocolo",
        description: "Control de acceso, seguridad, protocolo ceremonial.",
        subcategories: [
            {
                id: "security",
                name: "Seguridad",
                items: [
                    item("private_security", "Seguridad privada", "Personal de seguridad para control.", "perHour", Q, "por hora", "event security staff suit", 6, true),
                    item("parking_security", "Seguridad en parqueo", "Personal adicional para exterior.", "perHour", Q, "por hora", "parking security event outdoor", 4, true),
                ]
            },
            {
                id: "checkin",
                name: "Ingreso y control",
                items: [
                    item("checkin_staff", "Staff de check-in", "Recepción con lista y pulseras/QR.", "perUnit", Q, "por persona", "event check in desk qr code", 2, true),
                    item("wristbands_qr", "Pulseras/QR de control", "Sistema de control para invitados.", "quoteOnly", Q, "por evento", "event wristband QR access control"),
                ]
            },
            {
                id: "ceremony_protocol",
                name: "Protocolo ceremonial",
                items: [
                    item("protocol_script", "Guion de protocolo", "Guion: entrada, brindis, vals, cake, speeches.", "fixed", Q, "por evento", "event protocol script ceremony guide"),
                    item("gift_custody", "Custodia de regalos", "Zona segura y responsable asignado.", "quoteOnly", Q, "por evento", "gift area event security custody"),
                ]
            }
        ]
    },
    {
        id: "guest_experience",
        name: "Experiencia para invitados",
        description: "Lounge, activaciones, regalos y momentos instagrammables.",
        subcategories: [
            {
                id: "hospitality",
                name: "Hospitalidad",
                items: [
                    item("welcome_drink", "Bebida de bienvenida", "Recepción con mocktail/soft.", "perPerson", Q, "por invitado", "welcome drink reception event elegant"),
                    item("amenities_kit", "Kit de amenidades", "Abanicos, pañuelos, mini hidratación.", "perPerson", Q, "por invitado", "event amenity kit fan cooling luxury"),
                    item("lounge_area", "Área lounge", "Zona de descanso premium.", "quoteOnly", Q, "por montaje", "luxury lounge area event furniture"),
                ]
            },
            {
                id: "activations",
                name: "Activaciones",
                items: [
                    item("instagram_spot", "Zona instagrammable", "Rincón de foto con iluminación.", "quoteOnly", Q, "por montaje", "instagrammable spot event photo neon"),
                    item("glitter_bar", "Glitter bar / beauty bar", "Station de brillo para fiesta.", "quoteOnly", Q, "por evento", "glitter bar beauty station event party"),
                    item("neon_sign", "Neón personalizado", "Letrero tipo neón para fondo y fotos.", "quoteOnly", Q, "por pieza", "custom neon sign event quinceanera name"),
                ]
            },
            {
                id: "souvenirs",
                name: "Recuerdos",
                items: [
                    item("personalized_favors", "Recuerdos personalizados", "Recuerdos con empaque premium.", "perPerson", Q, "por invitado", "luxury event favors personalized"),
                    item("on_site_prints", "Impresión de fotos en sitio", "Impresión para recuerdos.", "quoteOnly", Q, "por evento", "instant photo printing event souvenir"),
                ]
            }
        ]
    },
    {
        id: "post_event",
        name: "Post evento",
        description: "Entregables finales, cierre y memoria del evento.",
        items: [
            item("final_delivery", "Paquete de entrega final", "Entrega organizada de fotos, videos y materiales.", "fixed", Q, "por proyecto", "digital delivery gallery event photos"),
            item("post_event_meeting", "Reunión post evento", "Revisión final, aprendizajes y pendientes.", "fixed", Q, "por sesión", "post event meeting review feedback"),
        ]
    }
];

fs.writeFileSync(
    'src/data/serviceCatalog.json',
    JSON.stringify(catalog, null, 2),
    'utf8'
);

// Count items
let count = 0;
function countItems(cats) {
    for (const c of cats) {
        if (c.items) count += c.items.length;
        if (c.subcategories) countItems(c.subcategories);
    }
}
countItems(catalog.categories);
console.log('Catalogo generado: ' + count + ' items en ' + catalog.categories.length + ' categorias');
