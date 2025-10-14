# 🔐 Admin Guide - TOMO Academy Platform

## Admin Access

### Login Credentials
- **Email**: `tomoacademyofficial@gmail.com` (permanent, cannot be changed)
- **Password**: `admin123` (default - change in `src/contexts/AuthContext.tsx`)

### How to Login
1. Click the **"Login"** button in the navigation bar
2. The admin email is pre-filled and permanent
3. Enter your password
4. Click **"Login as Admin"**
5. Upon successful login:
   - Login button disappears
   - **"Admin"** badge appears
   - **"Logout"** button appears
   - You now have full edit access

### Session Management
- **Duration**: 24 hours
- **Storage**: localStorage
- **Auto-login**: If you close and reopen the browser within 24 hours, you'll still be logged in
- **Logout**: Click the "Logout" button to end your session

---

## Admin Capabilities

### ✅ What Admin Can Do (After Login):
1. **Add New Employees**
   - Upload profile photos
   - Set all employee details
   - Generate ID cards

2. **Edit Employee Details** (Coming Soon)
   - Modify names, roles, departments
   - Update contact information
   - Change profile photos
   - Edit skills and bio

3. **Upload Videos**
   - Full YouTube-style upload
   - Set titles, descriptions, tags
   - Upload custom thumbnails
   - Schedule publishing

4. **Manage Tasks**
   - Create new tasks
   - Assign to team members
   - Update status
   - Set priorities

5. **Manage Resources**
   - Upload files
   - Add links
   - Categorize content
   - Set permissions

### ❌ What Regular Users Can Do (Without Login):
- **View Only** - Everything is read-only
- Browse all pages
- See team members
- View videos
- Check analytics
- View tasks and resources
- **Cannot**: Add, edit, or delete anything

---

## Admin Features

### 1. Navbar Changes
**When NOT logged in:**
- Shows "Login" button
- All navigation links visible
- Read-only mode

**When logged in as Admin:**
- Shows "Admin" badge with shield icon
- Shows "Logout" button
- Edit buttons appear throughout the site
- Full access to all features

### 2. ID Card Management
**Admin can:**
- Upload/change employee photos
- Edit employee details
- Generate new ID cards
- Download vCards
- Share profiles

**Photo Requirements:**
- Format: JPG, PNG, GIF
- Recommended size: 400x400px minimum
- Aspect ratio: Square (1:1) for best results
- Max file size: 5MB

### 3. Professional Photo Display
- Photos use `object-cover` with smart positioning
- Centered on face (top 20% of image)
- Ring effect for professional look
- Fallback to initials if photo fails
- Smooth loading with spinner

---

## Changing Admin Password

### Method 1: In Code (Permanent)
Edit `src/contexts/AuthContext.tsx`:

```typescript
const ADMIN_EMAIL = 'tomoacademyofficial@gmail.com';
const ADMIN_PASSWORD = 'your_new_secure_password'; // Change this
```

### Method 2: Environment Variable (Recommended for Production)
1. Add to Vercel environment variables:
   ```
   VITE_ADMIN_PASSWORD=your_secure_password
   ```

2. Update `AuthContext.tsx`:
   ```typescript
   const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
   ```

---

## Email Notifications (Coming Soon)

### Planned Features:
1. **Login Notifications**
   - Email sent to `tomoacademyofficial@gmail.com` when admin logs in
   - Includes timestamp and IP address

2. **Password Change Alerts**
   - Immediate notification when password is changed
   - Confirmation link required

3. **Activity Notifications**
   - New employee added
   - Video uploaded
   - Task created/completed
   - Resource added

4. **Security Alerts**
   - Failed login attempts
   - Unusual activity
   - Session expiry warnings

### Implementation:
Will use email service (e.g., SendGrid, Resend, or EmailJS) to send notifications to admin email.

---

## Security Best Practices

### 1. Password Security
- ✅ Use a strong password (min 12 characters)
- ✅ Include uppercase, lowercase, numbers, symbols
- ✅ Don't share your password
- ✅ Change password regularly
- ❌ Don't use "admin123" in production

### 2. Session Security
- ✅ Logout when done
- ✅ Don't login on public computers
- ✅ Clear browser cache after logout
- ✅ Use HTTPS only (Vercel provides this)

### 3. Access Control
- ✅ Only one admin account (tomoacademyofficial@gmail.com)
- ✅ No other emails can login
- ✅ Read-only for everyone else
- ✅ Admin actions are logged (coming soon)

---

## Troubleshooting

### Issue: Can't Login
**Solutions:**
1. Check password is correct
2. Clear browser cache
3. Try incognito/private mode
4. Check console for errors (F12)
5. Verify admin email matches exactly

### Issue: Login Button Still Shows After Login
**Solutions:**
1. Refresh the page
2. Check localStorage has `adminAuth` key
3. Clear localStorage and login again
4. Check browser console for errors

### Issue: Session Expired
**Solutions:**
1. Login again
2. Sessions expire after 24 hours
3. Check system time is correct
4. Clear old session data

### Issue: Can't Edit After Login
**Solutions:**
1. Verify "Admin" badge is showing
2. Refresh the page
3. Logout and login again
4. Check browser console for errors

---

## Admin Dashboard Features

### Current Features:
- ✅ Real-time YouTube analytics
- ✅ Team member overview
- ✅ Video statistics
- ✅ Task management
- ✅ Resource library
- ✅ Database status indicator

### Coming Soon:
- ⏳ Admin activity log
- ⏳ User analytics
- ⏳ Content moderation
- ⏳ Bulk operations
- ⏳ Export data
- ⏳ Backup/restore

---

## API Integration

### YouTube Analytics
**Setup:**
1. Get API key from Google Cloud Console
2. Add to Vercel environment variables:
   ```
   VITE_YOUTUBE_API_KEY=your_api_key
   VITE_YOUTUBE_CHANNEL_ID=your_channel_id
   ```
3. Analytics will automatically update

**Without API Key:**
- Platform uses mock data
- All features still work
- No errors displayed

### Database Connection
**Setup:**
1. Create NeonDB project
2. Run SQL schema
3. Add connection string to Vercel:
   ```
   VITE_DATABASE_URL=postgresql://...
   ```

**Without Database:**
- Platform uses mock data
- All features functional
- Database status shows "Using Mock Data"

---

## Mobile Admin Access

### Features:
- ✅ Responsive admin panel
- ✅ Touch-friendly buttons
- ✅ Mobile-optimized modals
- ✅ Swipe gestures
- ✅ Full functionality on mobile

### Best Practices:
- Use landscape mode for ID cards
- Use portrait mode for forms
- Larger tap targets for touch
- Optimized image upload

---

## Support & Contact

### Admin Email:
**tomoacademyofficial@gmail.com**

### For Technical Issues:
1. Check browser console (F12)
2. Check Vercel deployment logs
3. Review error messages
4. Check this guide for solutions

### For Feature Requests:
- Document your request
- Explain use case
- Provide examples
- Submit via GitHub issues

---

## Quick Reference

### Login:
```
Email: tomoacademyofficial@gmail.com
Password: admin123 (change this!)
```

### Session:
- Duration: 24 hours
- Storage: localStorage
- Key: adminAuth

### Permissions:
- Admin: Full access (read + write)
- Users: Read-only access

### Files to Edit:
- Password: `src/contexts/AuthContext.tsx`
- Login UI: `src/components/ui/login-modal.tsx`
- Navbar: `src/components/Navbar.tsx`

---

**Last Updated**: October 14, 2025
**Version**: 2.0
**Status**: Production Ready 🚀
