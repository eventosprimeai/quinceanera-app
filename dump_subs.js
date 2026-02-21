const c = require('./src/data/serviceCatalog.json');
const subs = new Set();
c.categories.forEach(cat => {
    (cat.subcategories || []).forEach(sub => {
        subs.add(sub.name);
        (sub.subcategories || []).forEach(nested => subs.add(nested.name));
    });
});
console.log(JSON.stringify(Array.from(subs), null, 2));
