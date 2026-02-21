const fs = require('fs');
const path = require('path');

const inputDir = 'F:\\00 - quinceañeras\\Antigravity\\Quinceañeras\\ajustes a subcategorias';
const outputFile = path.join(__dirname, '..', 'src', 'data', 'serviceCatalog.json');

// Read current catalog to preserve IDs where possible
const currentCatalog = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

function generateId(text) {
    if (!text) return `item_${Math.random().toString(36).substr(2, 9)}`;
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function parsePriceRange(priceStr) {
    if (!priceStr) return { min: 0, max: 0, raw: '' };
    const cleanStr = priceStr.replace(/\$/g, '').replace(/,/g, '');
    const match = cleanStr.match(/(\d+)\s*(?:[-–a]\s*)?(\d+)?/);

    if (match) {
        const min = parseInt(match[1]);
        const max = match[2] ? parseInt(match[2]) : min;
        return { min, max, raw: priceStr.trim() };
    }
    return { min: 0, max: 0, raw: priceStr.trim() };
}

function parseTextFile(filePath, fileName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').map(l => l.trim());

    const categoryName = path.basename(fileName, '.txt');

    // Find matching category in current catalog to reuse ID
    let catId = generateId(categoryName);
    const existingCat = currentCatalog.categories.find(c => generateId(c.name) === catId || c.name.toLowerCase().includes(categoryName.toLowerCase()));
    if (existingCat) catId = existingCat.id;

    const category = {
        id: catId,
        name: categoryName,
        description: "",
        subcategories: []
    };

    let currentSubcat = null;
    let currentItem = null;
    let parseState = 'NORMAL'; // NORMAL, POPUP_INCLUDES, POPUP_FACTORS
    let isRootSubcat = true;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line || line === '________________') {
            parseState = 'NORMAL';
            continue;
        }

        // Detect Subcategory Headers (e.g. "TIPO DE SERVICIO" or "BEBIDAS")
        // They are usually all caps and not followed by a price right away
        if (/^[A-ZÁÉÍÓÚÑ\s]+$/.test(line) && line.length > 3 && !line.includes('$')) {
            // Check if next line is a price, if so, it's an item, not a subcategory
            const nextLine = lines[i + 1] || '';
            const nextNextLine = lines[i + 2] || '';
            if (!nextLine.includes('$') && !nextNextLine.includes('$') && !line.includes('CONTENIDO DEL POPUP')) {
                currentSubcat = {
                    id: generateId(line),
                    name: line.charAt(0).toUpperCase() + line.slice(1).toLowerCase(),
                    items: []
                };
                category.subcategories.push(currentSubcat);
                continue;
            }
        }

        // If we don't have a subcategory yet, create a default one
        if (!currentSubcat && (line.includes('$') || lines[i + 1]?.includes('$'))) {
            currentSubcat = {
                id: generateId(categoryName) + '_items',
                name: 'Servicios de ' + categoryName,
                items: []
            };
            category.subcategories.push(currentSubcat);
        }

        // Detect Item Start (Name followed by Price line)
        // Name might not be all caps, but price line has '$'
        const nextLineForPrice = lines[i + 1] || '';
        if (nextLineForPrice.includes('$') && !line.includes('Texto corto') && parseState === 'NORMAL') {
            currentItem = {
                id: generateId(line),
                name: line.charAt(0).toUpperCase() + line.slice(1).toLowerCase(),
                pricingType: 'range',
                priceRange: parsePriceRange(nextLineForPrice),
                unitLabel: nextLineForPrice.split(/por |\/ /i).pop() || 'evento',
                popupInfo: {
                    shortText: '',
                    buttonText: 'Ver detalles',
                    title: line.charAt(0).toUpperCase() + line.slice(1).toLowerCase(),
                    imageQuery: '',
                    includedText: [],
                    factorsText: [],
                    realValueText: ''
                }
            };
            currentSubcat.items.push(currentItem);
            i++; // skip the price line
            continue;
        }

        if (currentItem) {
            const lowerLine = line.toLowerCase();

            if (lowerLine.startsWith('texto corto visible')) {
                currentItem.popupInfo.shortText = lines[i + 1] || '';
                i++;
            } else if (lowerLine.startsWith('botón:')) {
                currentItem.popupInfo.buttonText = line.split(':')[1].trim();
            } else if (lowerLine === 'contenido del popup') {
                parseState = 'POPUP_START';
            } else if (lowerLine.startsWith('título:')) {
                currentItem.popupInfo.title = lines[i + 1] || line.split(':')[1].trim();
                // skip next if we used it
                if (!line.split(':')[1].trim()) i++;
            } else if (lowerLine.startsWith('imagen sugerida:')) {
                currentItem.popupInfo.imageQuery = lines[i + 1] || 'luxury event ' + currentItem.name;
                i++;
            } else if (lowerLine.includes('incluye') || lowerLine === '¿qué es?') {
                parseState = 'POPUP_INCLUDES';
            } else if (lowerLine.includes('influye en el precio')) {
                parseState = 'POPUP_FACTORS';
            } else if (lowerLine.includes('valor real:')) {
                parseState = 'POPUP_VALUE';
            } else {
                // Determine where the text goes based on state
                if (parseState === 'POPUP_INCLUDES') {
                    if (line && !line.includes(':')) currentItem.popupInfo.includedText.push(line.replace(/^- /, ''));
                } else if (parseState === 'POPUP_FACTORS') {
                    if (line && !line.includes(':')) currentItem.popupInfo.factorsText.push(line.replace(/^- /, ''));
                } else if (parseState === 'POPUP_VALUE') {
                    const cleanLine = line.replace(/^- /, '');
                    if (cleanLine) {
                        currentItem.popupInfo.realValueText += (currentItem.popupInfo.realValueText ? ' ' : '') + cleanLine;
                    }
                }
            }
        }
    }

    // Clean up empty subcategories
    category.subcategories = category.subcategories.filter(s => s.items.length > 0);

    // Assign descriptions to categories and items from old if available
    if (existingCat) {
        category.description = existingCat.description || category.name;
    }

    return category;
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.txt'));
const newCategories = [];

for (const file of files) {
    const parsedCat = parseTextFile(path.join(inputDir, file), file);
    newCategories.push(parsedCat);
}

// Generate new catalog
const newCatalog = {
    version: "3.0",
    currency: "USD",
    locationRules: currentCatalog.locationRules,
    categories: newCategories
};

fs.writeFileSync(outputFile, JSON.stringify(newCatalog, null, 2));
console.log('Catalog updated successfully! Generated', newCategories.length, 'categories.');
