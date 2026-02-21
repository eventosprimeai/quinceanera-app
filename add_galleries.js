const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'src', 'data', 'serviceCatalog.json');
const catalog = require(catalogPath);

const galleryData = {
    "Maquillaje profesional": {
        mainImage: "https://images.unsplash.com/photo-1512496015851-a1c84883bb17?q=80&w=2000&auto=format&fit=crop",
        galleryImages: [
            "https://images.unsplash.com/photo-1596704017254-9b121068fb29?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1620067667503-4852c92b23a5?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1588829584485-6d734eacaf37?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503236823255-94609f598e71?q=80&w=2000&auto=format&fit=crop"
        ]
    },
    "Peinado quinceañera": {
        mainImage: "https://images.unsplash.com/photo-1487627448888-2ed3383084ba?q=80&w=2000&auto=format&fit=crop",
        galleryImages: [
            "https://images.unsplash.com/photo-1560014285-d6e3fb06a928?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520607162513-7770400dd8c3?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511116245362-e95c1c4f2bb4?q=80&w=2000&auto=format&fit=crop"
        ]
    },
    "Prueba previa (makeup + peinado)": {
        mainImage: "https://images.unsplash.com/photo-1457984483737-cd34c91b5c2c?q=80&w=2000&auto=format&fit=crop",
        galleryImages: [
            "https://images.unsplash.com/photo-1487537023671-8dce1b78f8ee?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop"
        ]
    },
    "Kit de retoque": {
        mainImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2000&auto=format&fit=crop",
        galleryImages: [
            "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1629814427506-618e7e11f715?q=80&w=2000&auto=format&fit=crop"
        ]
    },
    "Retoque durante el evento": {
        mainImage: "https://images.unsplash.com/photo-1521783592809-5100085d7fca?q=80&w=2000&auto=format&fit=crop",
        galleryImages: [
            "https://images.unsplash.com/photo-1512496015851-a1c84883bb17?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507290439931-a861cfedc27e?q=80&w=2000&auto=format&fit=crop"
        ]
    }
};

let updated = 0;
catalog.categories.forEach(cat => {
    if (cat.items) {
        cat.items.forEach(item => {
            if (galleryData[item.name] && item.popupInfo) {
                item.popupInfo.mainImage = galleryData[item.name].mainImage;
                item.popupInfo.galleryImages = galleryData[item.name].galleryImages;
                updated++;
            }
        });
    }
    (cat.subcategories || []).forEach(sub => {
        if (sub.items) {
            sub.items.forEach(item => {
                if (galleryData[item.name] && item.popupInfo) {
                    item.popupInfo.mainImage = galleryData[item.name].mainImage;
                    item.popupInfo.galleryImages = galleryData[item.name].galleryImages;
                    updated++;
                }
            });
        }
        (sub.subcategories || []).forEach(nested => {
            if (nested.items) {
                nested.items.forEach(item => {
                    if (galleryData[item.name] && item.popupInfo) {
                        item.popupInfo.mainImage = galleryData[item.name].mainImage;
                        item.popupInfo.galleryImages = galleryData[item.name].galleryImages;
                        updated++;
                    }
                });
            }
        });
    });
});

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`Updated ${updated} items.`);
