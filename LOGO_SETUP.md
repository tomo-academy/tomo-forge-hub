# 🎨 Logo Setup Instructions

## Your New Logo
You have a beautiful pink/magenta striped sphere logo that needs to be added to the project.

## Steps to Add the Logo:

### 1. Save the Logo Image
Save the logo image you provided as:
- `public/logo.png` (main logo)
- `public/favicon.ico` (convert to ICO format for browser tab)
- `public/logo-192.png` (192x192 for PWA)
- `public/logo-512.png` (512x512 for PWA)

### 2. Update HTML Head (index.html)
The favicon is already configured in `index.html`:
```html
<link rel="icon" type="image/png" href="/logo.png" />
```

### 3. Logo is Already Used In:
✅ **ID Cards** - `src/components/ui/compact-id-card.tsx` (line 184)
```tsx
<img src="/logo.png" alt="TOMO Academy" className="w-full h-full object-contain" 
  onError={(e) => { e.currentTarget.src = '/TOMO.jpg'; }} />
```

✅ **Navbar** - Uses logo.png with fallback to TOMO.jpg

✅ **Login Modal** - Uses the logo

### 4. Current Logo Fallback
The system currently falls back to `/TOMO.jpg` if `/logo.png` is not found.

## Quick Setup:

1. **Download/Save your pink sphere logo**
2. **Rename it to `logo.png`**
3. **Place it in the `public` folder** of your project
4. **Optionally create favicon.ico** from the same image
5. **Deploy to Vercel** - it will automatically use the new logo!

## Logo Specifications:
- **Format**: PNG with transparent background (recommended)
- **Size**: 512x512px (will be scaled as needed)
- **Colors**: Pink/Magenta (#C75B9B or similar)
- **Style**: Modern, clean, professional

## Where Logo Appears:
- ✅ Browser tab (favicon)
- ✅ ID card headers
- ✅ Navbar
- ✅ Login modal
- ✅ Loading screens
- ✅ PWA app icon (when installed)

---

**Note**: Once you add `logo.png` to the `public` folder and redeploy, it will automatically replace all instances where the logo is used!
