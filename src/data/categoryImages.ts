/**
 * Maps category IDs (from serviceCatalog.json) to their preview images.
 * Images are in /public/images/categories/
 * 
 * Category IDs from catalog:
 * 1. creative_direction       → concepto-creativo.png
 * 2. planning_management      → planificacion.png
 * 3. venue_logistics          → locacion.png
 * 4. technical_production     → produccion-tecnica.png
 * 5. decor_design             → decoracion.png
 * 6. catering_bar             → catering.png
 * 7. beauty_aesthetics        → belleza.png
 * 8. wardrobe                 → vestuario.png
 * 9. choreography_entertainment → coreografia.png
 * 10. photo_video             → foto-video.png
 * 11. stationery              → papeleria.png
 * 12. security_protocol       → seguridad.png
 * 13. guest_experience        → experiencia-invitados.png
 * 14. post_event              → post-evento.png
 */
export const categoryImages: Record<string, string> = {
    'creative_direction': '/images/categories/concepto-creativo.png',
    'planning_management': '/images/categories/planificacion.png',
    'venue_logistics': '/images/categories/locacion.png',
    'technical_production': '/images/categories/produccion-tecnica.png',
    'decor_design': '/images/categories/decoracion.png',
    'catering_bar': '/images/categories/catering.png',
    'beauty_aesthetics': '/images/categories/belleza.png',
    'wardrobe': '/images/categories/vestuario.png',
    'choreography_entertainment': '/images/categories/coreografia.png',
    'photo_video': '/images/categories/foto-video.png',
    'stationery': '/images/categories/papeleria.png',
    'security_protocol': '/images/categories/seguridad.png',
    'guest_experience': '/images/categories/experiencia-invitados.png',
    'post_event': '/images/categories/post-evento.png',
};

export function getCategoryImage(categoryId: string): string | null {
    return categoryImages[categoryId] || null;
}
