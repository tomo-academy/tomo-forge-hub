# TOMO Academy Favicon & Logo Setup

## Current Logo Files
- `logo.png` - Main logo file
- `TOMO.jpg` - Alternative logo format
- `tomo.png` - Additional logo variant

## Required Favicon Files (to be created from logo.png)

### Standard Favicon Files Needed:
1. `favicon.ico` (16x16, 32x32 combined)
2. `favicon-16x16.png` 
3. `favicon-32x32.png`
4. `apple-touch-icon.png` (180x180)
5. `android-chrome-192x192.png`
6. `android-chrome-512x512.png`
7. `mstile-150x150.png`
8. `og-image.jpg` (1200x630 for social sharing)

## Favicon Creation Instructions

### Option 1: Use Online Favicon Generator
1. Go to https://realfavicongenerator.net/
2. Upload `logo.png`
3. Customize settings:
   - **iOS**: Use original design, add margin if needed
   - **Android**: Use original design with background color #1f2937
   - **Windows**: Use original design with background color #1f2937
   - **Desktop**: Use original design
4. Download and extract files to `/public/` folder

### Option 2: Manual Creation with Image Editor
1. Open `logo.png` in image editor (Photoshop, GIMP, etc.)
2. Create versions:
   - 16x16px (favicon-16x16.png)
   - 32x32px (favicon-32x32.png) 
   - 180x180px (apple-touch-icon.png)
   - 192x192px (android-chrome-192x192.png)
   - 512x512px (android-chrome-512x512.png)
   - 150x150px (mstile-150x150.png)
3. Ensure logo is centered and not cropped
4. For favicon.ico, combine 16x16 and 32x32 versions

### Option 3: Command Line (if ImageMagick installed)
```bash
# Convert logo to different sizes
convert logo.png -resize 16x16 favicon-16x16.png
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 180x180 apple-touch-icon.png
convert logo.png -resize 192x192 android-chrome-192x192.png
convert logo.png -resize 512x512 android-chrome-512x512.png
convert logo.png -resize 150x150 mstile-150x150.png

# Create ICO file
convert favicon-16x16.png favicon-32x32.png favicon.ico
```

## Tips for Best Results

### Logo Design Considerations:
- **Simplicity**: Logo should be recognizable at 16x16 pixels
- **Contrast**: Ensure good visibility on browser tabs
- **Padding**: Add small margin to prevent cropping
- **Format**: PNG preferred for transparency

### Current Setup:
- Meta tags configured for tomoacademy.site domain
- Web manifest created with TOMO Academy branding
- Structured data for SEO
- Open Graph and Twitter Card meta tags
- Theme color: #1f2937 (dark gray)

## Files Added/Modified:
- `index.html` - Updated with comprehensive meta tags
- `public/site.webmanifest` - PWA manifest
- `public/browserconfig.xml` - Windows tile configuration

## Next Steps:
1. Create favicon files from existing logo.png
2. Test favicon display in different browsers
3. Verify social media sharing previews
4. Push changes to GitHub repository