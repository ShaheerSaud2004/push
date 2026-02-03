# PWA Setup for Khafī

The app is now available as a Progressive Web App (PWA) that can be installed on any device!

## Building the PWA

1. **Build the web version:**
   ```bash
   npm run build:web
   ```
   This will:
   - Export the app for web
   - Automatically set up PWA files (manifest, service worker)
   - Create a `dist/` folder with all the files

2. **Test locally:**
   ```bash
   npm run serve:web
   ```
   Then open http://localhost:3000 in your browser

## Deploying the PWA

The `dist/` folder contains everything needed to deploy the PWA. You can:

1. **Deploy to any static hosting:**
   - Netlify
   - Vercel
   - GitHub Pages
   - Firebase Hosting
   - Any web server

2. **Upload the entire `dist/` folder** to your hosting provider

## Installing the PWA

Users can install the PWA on their devices:

- **Desktop (Chrome/Edge):** Click the install icon in the address bar
- **Mobile (iOS Safari):** Tap Share → Add to Home Screen
- **Mobile (Android Chrome):** Tap the menu → Install App

## Features

- ✅ Works offline (service worker caches resources)
- ✅ Installable on any device
- ✅ Looks and feels like a native app
- ✅ Same functionality as the mobile app
- ✅ No app store needed!

## Notes

- The PWA uses the same codebase as the mobile app
- Haptics won't work on web (they'll fail silently)
- All game features work identically to the mobile version
- Data is stored locally using AsyncStorage (works on web too)
