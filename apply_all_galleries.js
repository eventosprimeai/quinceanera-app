const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'src', 'data', 'serviceCatalog.json');
const catalog = require(catalogPath);
const imagesDir = path.join(__dirname, 'public', 'images', 'services');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Ensure at least one placeholder exists (we generated a beauty one earlier)
// Since the prompt asks for all categories, maybe we just use that one image as a universal placeholder.
const placeholderSource = path.join('C:\\Users\\produ\\.gemini\\antigravity\\brain\\3f634692-322e-4ba4-a94e-09849e85e93d', 'main_maquillaje_profesional_1771702587806.png');

function sanitizeFilename(name) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_');
}

function ensureLocalImageWithPlaceholder(filename) {
    const dest = path.join(imagesDir, filename);
    if (!fs.existsSync(dest) && fs.existsSync(placeholderSource)) {
        fs.copyFileSync(placeholderSource, dest);
    }
    return `/images/services/${filename}`;
}

let itemsUpdated = 0;
let filesCreated = 0;

for (const cat of catalog.categories) {
    const processItems = (items) => {
        if (!items) return;
        for (const item of items) {
            if (!item.popupInfo) {
                // Initialize popupInfo if it doesn't exist to at least put a gallery
                item.popupInfo = {
                    title: item.name,
                    shortText: `Información detallada sobre el servicio de ${item.name}.`,
                    buttonText: "Entendido",
                    includedText: ["Asesoramiento personalizado"],
                    factorsText: ["Cantidad solicitada", "Ubicación del evento"]
                };
            }

            // Always add 1 mainImage and 5 galleryImages
            const normalized = sanitizeFilename(item.name);

            // Generate Main
            const mainFilename = `main_${normalized}.jpg`;
            item.popupInfo.mainImage = ensureLocalImageWithPlaceholder(mainFilename);
            filesCreated++;

            // Generate Gallery (5 images)
            item.popupInfo.galleryImages = [];
            for (let i = 0; i < 5; i++) {
                const galleryFilename = `gallery_${normalized}_${i}.jpg`;
                item.popupInfo.galleryImages.push(ensureLocalImageWithPlaceholder(galleryFilename));
                filesCreated++;
            }
            itemsUpdated++;
        }
    };

    processItems(cat.items);
    if (cat.subcategories) {
        for (const sub of cat.subcategories) {
            processItems(sub.items);
            if (sub.subcategories) {
                for (const nested of sub.subcategories) {
                    processItems(nested.items);
                }
            }
        }
    }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`Successfully mapped ${itemsUpdated} items with galleries.`);
console.log(`Generated ${filesCreated} local image placeholders ready for admin replacement.`);
