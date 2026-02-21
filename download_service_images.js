const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'src', 'data', 'serviceCatalog.json');
const catalog = require(catalogPath);
const imagesDir = path.join(__dirname, 'public', 'images', 'services');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, filepath) {
    if (fs.existsSync(filepath)) {
        return filepath; // Already downloaded
    }
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return filepath;
}

function sanitizeFilename(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.jpg';
}

async function processCatalog() {
    let count = 0;
    for (const cat of catalog.categories) {
        // Items in category
        if (cat.items) {
            for (const item of cat.items) {
                if (item.popupInfo) {
                    if (item.popupInfo.mainImage && item.popupInfo.mainImage.startsWith('http')) {
                        const filename = `main_${sanitizeFilename(item.name)}`;
                        await downloadImage(item.popupInfo.mainImage, path.join(imagesDir, filename));
                        item.popupInfo.mainImage = `/images/services/${filename}`;
                        count++;
                    }
                    if (item.popupInfo.galleryImages) {
                        for (let i = 0; i < item.popupInfo.galleryImages.length; i++) {
                            const url = item.popupInfo.galleryImages[i];
                            if (url.startsWith('http')) {
                                const filename = `gallery_${sanitizeFilename(item.name)}_${i}.jpg`;
                                await downloadImage(url, path.join(imagesDir, filename));
                                item.popupInfo.galleryImages[i] = `/images/services/${filename}`;
                                count++;
                            }
                        }
                    }
                }
            }
        }
        // Subcategories
        if (cat.subcategories) {
            for (const sub of cat.subcategories) {
                if (sub.items) {
                    for (const item of sub.items) {
                        if (item.popupInfo) {
                            if (item.popupInfo.mainImage && item.popupInfo.mainImage.startsWith('http')) {
                                const filename = `main_${sanitizeFilename(item.name)}`;
                                await downloadImage(item.popupInfo.mainImage, path.join(imagesDir, filename));
                                item.popupInfo.mainImage = `/images/services/${filename}`;
                                count++;
                            }
                            if (item.popupInfo.galleryImages) {
                                for (let i = 0; i < item.popupInfo.galleryImages.length; i++) {
                                    const url = item.popupInfo.galleryImages[i];
                                    if (url.startsWith('http')) {
                                        const filename = `gallery_${sanitizeFilename(item.name)}_${i}.jpg`;
                                        await downloadImage(url, path.join(imagesDir, filename));
                                        item.popupInfo.galleryImages[i] = `/images/services/${filename}`;
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                }
                // Nested subcategories
                if (sub.subcategories) {
                    for (const nested of sub.subcategories) {
                        if (nested.items) {
                            for (const item of nested.items) {
                                if (item.popupInfo) {
                                    if (item.popupInfo.mainImage && item.popupInfo.mainImage.startsWith('http')) {
                                        const filename = `main_${sanitizeFilename(item.name)}`;
                                        await downloadImage(item.popupInfo.mainImage, path.join(imagesDir, filename));
                                        item.popupInfo.mainImage = `/images/services/${filename}`;
                                        count++;
                                    }
                                    if (item.popupInfo.galleryImages) {
                                        for (let i = 0; i < item.popupInfo.galleryImages.length; i++) {
                                            const url = item.popupInfo.galleryImages[i];
                                            if (url.startsWith('http')) {
                                                const filename = `gallery_${sanitizeFilename(item.name)}_${i}.jpg`;
                                                await downloadImage(url, path.join(imagesDir, filename));
                                                item.popupInfo.galleryImages[i] = `/images/services/${filename}`;
                                                count++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
    console.log(`Successfully downloaded and mapped ${count} service images to local storage.`);
}

processCatalog().catch(console.error);
