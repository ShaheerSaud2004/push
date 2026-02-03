#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const swSource = path.join(__dirname, '..', 'sw.js');
const swDest = path.join(distDir, 'sw.js');
const manifestPath = path.join(distDir, 'manifest.json');
const indexHtmlPath = path.join(distDir, 'index.html');

// Copy service worker
if (fs.existsSync(swSource)) {
  fs.copyFileSync(swSource, swDest);
  console.log('✓ Service worker copied to dist/');
}

// Create manifest.json if it doesn't exist
if (!fs.existsSync(manifestPath)) {
  const manifest = {
    name: "Khafī - The Islamic Hidden Word Game",
    short_name: "Khafī",
    description: "A fun party game for Muslims! Play the classic hidden word game with Islamic categories and find the imposter among your friends.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5E6D3",
    theme_color: "#8B4513",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon"
      }
    ],
    scope: "/",
    lang: "en"
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Manifest.json created');
}

// Update index.html to include manifest and PWA meta tags, and fix scrolling
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Replace the entire style block with fixed version that supports scrolling
  const fixedStyles = `    <style id="expo-reset">
      /* These styles make the body full-height */
      html,
      body {
        height: 100%;
      }
      /* These styles disable body scrolling if you are using <ScrollView> */
      body {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
      }
      /* These styles make the root element full-height */
      #root {
        display: flex;
        height: 100%;
        flex: 1;
        overflow: hidden;
      }
      /* Fix for ScrollView on web - ensure ScrollView components are scrollable */
      [data-scrollview="true"],
      div[style*="overflow-y"],
      .r-scrollview,
      [class*="ScrollView"] {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
        height: 100%;
      }
    </style>`;
  
  // Replace the style block
  html = html.replace(/<style id="expo-reset">[\s\S]*?<\/style>/, fixedStyles);
  
  // Check if manifest link already exists
  if (!html.includes('rel="manifest"')) {
    // Find the closing head tag and insert before it
    html = html.replace(
      /<link rel="shortcut icon"[^>]*>/,
      `$&\n<link rel="manifest" href="/manifest.json" />\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="default">\n<meta name="apple-mobile-web-app-title" content="Khafī">`
    );
  }
  
  fs.writeFileSync(indexHtmlPath, html);
  console.log('✓ index.html updated with PWA meta tags and scrolling fixes');
}

console.log('✓ PWA setup complete!');
