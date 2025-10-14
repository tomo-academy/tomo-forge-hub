# 🔐 Admin Login Guide

## **How to Access Admin Features**

### **Step 1: Login**
1. Go to your deployed site
2. Click the **"Login"** button in the top-right corner of the navbar
3. Enter the admin credentials:
   - **Email**: `tomoacademyofficial@gmail.com`
   - **Password**: `admin123`
4. Click **"Login"**

### **Step 2: Verify You're Logged In**
After logging in, you should see:
- ✅ Your email displayed in the navbar
- ✅ A **"Logout"** button instead of "Login"
- ✅ **Edit buttons** appear when you hover over employee cards (on the Team page)
- ✅ **Add Employee** button visible
- ✅ **Upload Video** button visible

---

## **Admin Features Available**

Once logged in as admin, you can:

### **1. Team Page** (`/team`)
- ✅ **Edit Employee**: Hover over any employee card → Click "Edit" button
- ✅ **Delete Employee**: In the edit modal, click "Delete Employee"
- ✅ **Add Employee**: Click "Add Employee" button at the top
- ✅ **Upload Photos**: Click camera icon on employee cards

### **2. Videos Page** (`/videos`)
- ✅ **Upload Videos**: Click "Upload Video" button
- ✅ **Add YouTube videos** with title and description

### **3. Dashboard** (`/dashboard`)
- ✅ View all analytics and stats
- ✅ See database status

---

## **Troubleshooting**

### **Issue: Edit buttons not showing**
**Solution:**
1. Make sure you're logged in (check if navbar shows your email)
2. Go to Team page (`/team`)
3. **Hover over an employee card** - the edit button appears on hover
4. Open browser console (F12) and type: `localStorage.getItem('adminAuth')`
   - If it returns `null`, you're not logged in
   - If it returns a JSON string, you're logged in

### **Issue: Login button not visible**
**Solution:**
- Check if the navbar is rendering properly
- Look for a "Login" button in the top-right corner
- If not visible, check browser console for errors

### **Issue: Login not working**
**Solution:**
1. Make sure you're using the correct credentials:
   - Email: `tomoacademyofficial@gmail.com`
   - Password: `admin123`
2. Check browser console for errors
3. Try clearing localStorage: `localStorage.clear()` then refresh

### **Issue: Session expired**
**Solution:**
- Admin sessions expire after 24 hours
- Simply login again with the same credentials

---

## **Changing Admin Password**

To change the admin password:

1. Open `src/contexts/AuthContext.tsx`
2. Find line 15: `const ADMIN_PASSWORD = 'admin123';`
3. Change `'admin123'` to your desired password
4. Save and redeploy

**For production**, you should use environment variables:
```typescript
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
```

Then add to Vercel:
- Go to Vercel → Settings → Environment Variables
- Add: `VITE_ADMIN_PASSWORD` = `your-secure-password`
- Redeploy

---

## **Security Notes**

⚠️ **Current Setup (Development):**
- Password is hardcoded in the code
- Suitable for development/testing
- **NOT recommended for production**

✅ **Recommended for Production:**
1. Use environment variables for password
2. Implement proper backend authentication
3. Use JWT tokens
4. Add password hashing
5. Implement rate limiting

---

## **Quick Test**

To verify admin features are working:

1. **Open browser console** (F12)
2. **Run this command**:
   ```javascript
   localStorage.setItem('adminAuth', JSON.stringify({
     email: 'tomoacademyofficial@gmail.com',
     timestamp: Date.now()
   }));
   ```
3. **Refresh the page**
4. You should now see admin features (edit buttons, etc.)

To logout:
```javascript
localStorage.removeItem('adminAuth');
```
Then refresh.

---

## **Current Admin Credentials**

📧 **Email**: `tomoacademyofficial@gmail.com`  
🔑 **Password**: `admin123`

**Remember to change this password before going to production!**

---

**Last Updated**: October 14, 2025  
**Version**: 1.0  
**Status**: Development Mode
