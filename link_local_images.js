const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'src', 'data', 'serviceCatalog.json');
const catalog = require(catalogPath);
const imagesDir = path.join(__dirname, 'public', 'images', 'services');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// We will use the AI image we generated as a beautiful placeholder
const placeholderSource = path.join('C:\\Users\\produ\\.gemini\\antigravity\\brain\\3f634692-322e-4ba4-a94e-09849e85e93d', 'main_maquillaje_profesional_1771702587806.png');

function sanitizeFilename(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.jpg';
}

function ensureLocalImage(filename) {
    const dest = path.join(imagesDir, filename);
    if (!fs.existsSync(dest) && fs.existsSync(placeholderSource)) {
        fs.copyFileSync(placeholderSource, dest);
    }
    return `/images/services/${filename}`;
}

let count = 0;
for (const cat of catalog.categories) {
    const processItems = (items) => {
        if (!items) return;
        for (const item of items) {
            if (item.popupInfo) {
                if (item.popupInfo.mainImage && item.popupInfo.mainImage.startsWith('http')) {
                    const filename = `main_${sanitizeFilename(item.name)}`;
                    item.popupInfo.mainImage = ensureLocalImage(filename);
                    count++;
                }
                if (item.popupInfo.galleryImages) {
                    for (let i = 0; i < item.popupInfo.galleryImages.length; i++) {
                        const url = item.popupInfo.galleryImages[i];
                        if (url.startsWith('http')) {
                            const filename = `gallery_${sanitizeFilename(item.name)}_${i}.jpg`;
                            item.popupInfo.galleryImages[i] = ensureLocalImage(filename);
                            count++;
                        }
                    }
                }
            }
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
console.log(`Successfully mapped ${count} external images to local /public/images/services/ directory using placeholders.`);
