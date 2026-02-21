const fs = require('fs');
const pdfParse = require('pdf-parse');

const pdfPath = 'F:\\00 - quinceañeras\\Antigravity\\Quinceañeras\\Checklist modular de producción integral de quinceañeras.pdf';
const buf = fs.readFileSync(pdfPath);

pdfParse(buf).then(data => {
    fs.writeFileSync('checklist_raw.txt', data.text, 'utf8');
    console.log('OK - ' + data.text.length + ' characters extracted');
}).catch(err => {
    console.error('Error:', err.message);
});
