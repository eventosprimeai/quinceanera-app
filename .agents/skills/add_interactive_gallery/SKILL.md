---
name: Add Interactive Gallery to Service Popup
description: Injects local hero images and interactive lightbox galleries into specified services in the Quinceañeras quoting tool catalog.
---

# Add Interactive Gallery to Service Popup

When you are requested to "add a gallery" or "add a hero image" to a new service category for the Quinceañeras quoting tool, follow this workflow to seamlessly integrate them with the existing UI.

## Context
The React component `ServiceInfoPopup.tsx` and the Catalog `PopupInfo` TypeScript definitions natively support `mainImage` (string) and `galleryImages` (array of strings). The frontend provides a Mobile-First layout, `object-position: top` UI logic to prevent face-cropping, and a full-screen Interactive Carousel Lightbox. Your job is ONLY to store the images properly and link them in the database.

## Step-by-Step Procedure

### 1. Image Conception & Naming
Locate or generate premium/luxury vertical photographs. You will need:
- **1 Main Hero Image**: Recommended aspect ratio ~ 3:4.
- **N Gallery References**: Any aspect ratio (displayed in a grid).

Convert the exact name of the service (e.g., "Maquillaje profesional") into a normalized `snake_case` format by:
- Converting to lowercase
- Replacing spaces and special characters with underscores `_`
- Removing diacritics/accents

Name the images following this strict convention:
- Hero: `main_{normalized_name}.jpg` (e.g., `main_maquillaje_profesional.jpg`)
- Gallery items: `gallery_{normalized_name}_0.jpg`, `gallery_{normalized_name}_1.jpg`, etc.

### 2. File Emplacement (Strict Local Policy)
You **MUST** place all acquired/generated images precisely inside the local Next.js repository at:
`public/images/services/`

**Note:** Never use external URLs (like Unsplash direct links). They frequently cause `404 Forbidden` errors due to hotlinking protections. Always store files locally to give the administrator absolute control over replacements via FTP.

### 3. Update the Catalog Database (`serviceCatalog.json`)
Open `src/data/serviceCatalog.json` and locate the specific service `"item"` within the target category or subcategory.

Inside the `popupInfo` object for that item, append the absolute paths mapping to the `public` folder:
```json
"popupInfo": {
  "shortText": "...",
  "mainImage": "/images/services/main_{normalized_name}.jpg",
  "galleryImages": [
    "/images/services/gallery_{normalized_name}_0.jpg",
    "/images/services/gallery_{normalized_name}_1.jpg"
  ]
}
```
*You may write a quick Node.js parser script to automatically inject these keys if you are making changes in bulk.*

### 4. Verification and Deployment
After updating the JSON file and adding the images:
1. Validate the syntax by running a local Next.js build: `npm run build`
2. Commit the new gallery image binaries and the modified `serviceCatalog.json` to GitHub.
3. Deploy to the production VPS (e.g., `git pull` -> `npm run build` -> `pm2 restart quinceanera`).
