# Khafī Website

A beautiful landing page for the Khafī app showcasing its features, design, and Islamic theme.

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and design
- `script.js` - Interactive features and animations

## Setup

1. Open `index.html` in a browser to view locally
2. Or host on any static hosting service

## Hosting Options

### Free Hosting:

1. **GitHub Pages**
   - Push to a GitHub repo
   - Go to Settings → Pages
   - Select main branch

2. **Netlify**
   - Drag and drop the `website` folder to netlify.com
   - Or connect your GitHub repo

3. **Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the website folder

4. **Cloudflare Pages**
   - Connect your repo or upload files
   - Automatic deployment

## Customization

### Replace Screenshots:
1. Take screenshots of your app
2. Replace the `.screenshot-placeholder` divs with actual images:
   ```html
   <img src="screenshot1.png" alt="Menu Screen" />
   ```

### Update Colors:
Edit CSS variables in `style.css`:
```css
:root {
    --color-primary: #8B5A3C;
    --color-accent: #D4A574;
    /* ... */
}
```

### Add Waitlist Form:
You can integrate:
- Mailchimp
- ConvertKit
- Firebase
- Or any form service

### Add Analytics:
Add Google Analytics or similar in the `<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Coming Soon Links

The download buttons currently show "Coming Soon". When your app is published:

1. Replace `href="#"` with actual App Store/Play Store links
2. Update the download button text if needed

## Features

✅ Responsive design (mobile, tablet, desktop)
✅ Smooth scrolling animations
✅ Islamic-themed color scheme
✅ SEO-friendly structure
✅ Fast loading (static HTML/CSS/JS)
✅ Easy to customize
