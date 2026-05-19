# Logo Images Needed for SEO

To fix the logo display in Google search results, you need to create these image files:

## Required Images:

### 1. og-image.png (Open Graph Image)
- **Size**: 1200 x 630 pixels
- **Format**: PNG or JPG
- **Content**: RMNA logo with "Built Different" tagline on a clean background
- **Purpose**: Shows in Google search results, Facebook, Twitter, WhatsApp previews
- **Location**: `/public/og-image.png`

### 2. logo-512.png (App Icon)
- **Size**: 512 x 512 pixels
- **Format**: PNG with transparent background
- **Content**: Just the RMNA logo (no tagline)
- **Purpose**: PWA app icon, structured data
- **Location**: `/public/logo-512.png`

### 3. logo-192.png (Small App Icon)
- **Size**: 192 x 192 pixels
- **Format**: PNG with transparent background
- **Content**: Just the RMNA logo (no tagline)
- **Purpose**: PWA app icon
- **Location**: `/public/logo-192.png`

## How to Create:

### Option 1: Using Figma/Canva
1. Open Figma or Canva
2. Create a new design with the sizes above
3. Add your RMNA logo (black text with red accents)
4. Add "BUILT DIFFERENT" tagline for og-image
5. Export as PNG

### Option 2: Using Your Logo Component
1. Open your website in browser
2. Open DevTools (F12)
3. Find the Logo SVG element
4. Right-click → "Capture node screenshot"
5. Resize to required dimensions
6. Save as PNG

### Option 3: Quick Fix (Temporary)
Use any product image from your store as og-image.png until you create proper logo images.

## After Creating Images:

1. Place all PNG files in `/public/` folder
2. Commit and push to GitHub
3. Deploy to Vercel
4. Test with: https://www.opengraph.xyz/
5. Wait 1-2 days for Google to re-crawl your site

## Current Status:
- ✅ favicon.svg exists
- ✅ logo.svg exists  
- ❌ og-image.png missing (NEEDED FOR GOOGLE)
- ❌ logo-512.png missing
- ❌ logo-192.png missing

## Design Specs:
- **Colors**: Black (#000000), White (#FFFFFF), Red (#BB0000)
- **Font**: Inter (bold/black weight)
- **Style**: Modern, minimal, streetwear aesthetic
- **Tagline**: "BUILT DIFFERENT" in small caps with red lines on sides
