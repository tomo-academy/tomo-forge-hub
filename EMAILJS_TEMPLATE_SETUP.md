# 📧 EmailJS Template Setup Guide

## **Issue Fixed:**
```
❌ Email send failed: The recipients address is empty
❌ Response status: 422
```

## **Root Cause:**
EmailJS template was missing the recipient email parameter (`to_email` or `{{to_email}}`).

---

## **✅ Solution: Update Your EmailJS Template**

### **Step 1: Go to EmailJS Dashboard**
1. Visit https://dashboard.emailjs.com/
2. Login to your account
3. Click **"Email Templates"**
4. Find your template (the one with the ID you're using)
5. Click **"Edit"**

---

### **Step 2: Update Template Settings**

#### **In the "To Email" Field:**
Make sure you have one of these:
```
{{to_email}}
```
OR
```
tomoacademyofficial@gmail.com
```

**Important:** The "To Email" field must not be empty!

---

### **Step 3: Update Template Content**

Use this simplified template that works with our parameters:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔐 Admin Login Alert</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">TOMO Academy YouTube Portal</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Login Detected</h2>
            <p style="color: #666; line-height: 1.6;">
                An administrator has logged into the TOMO Academy YouTube Management Portal.
            </p>
            
            <!-- Login Details -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #333; font-size: 16px;">Login Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold; width: 140px;">Admin:</td>
                        <td style="padding: 8px 0; color: #333;">{{adminName}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Time:</td>
                        <td style="padding: 8px 0; color: #333;">{{loginTime}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Browser:</td>
                        <td style="padding: 8px 0; color: #333;">{{browserInfo}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Device:</td>
                        <td style="padding: 8px 0; color: #333;">{{deviceInfo}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">IP Address:</td>
                        <td style="padding: 8px 0; color: #333;">{{ipAddress}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #666; font-weight: bold;">Location:</td>
                        <td style="padding: 8px 0; color: #333;">{{location}}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{portalUrl}}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                    Go to Admin Dashboard
                </a>
            </div>
            
            <!-- Security Notice -->
            <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                    <strong>🔒 Security Notice:</strong> This is an automated notification. If you did not perform this login, please secure your account immediately.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; color: #6c757d; font-size: 12px;">
                © 2025 TOMO Academy. All rights reserved.<br>
                This email was sent to {{to_email}}
            </p>
        </div>
    </div>
</body>
</html>
```

---

### **Step 4: Configure Template Variables**

In the EmailJS template editor, make sure these variables are mapped:

**Required Variables:**
- `{{to_email}}` - Recipient email (REQUIRED!)
- `{{adminName}}` - Admin email/name
- `{{loginTime}}` - Login timestamp
- `{{browserInfo}}` - Browser information
- `{{deviceInfo}}` - Device type
- `{{ipAddress}}` - IP address
- `{{location}}` - Location
- `{{portalUrl}}` - Link to admin dashboard

---

### **Step 5: Test Template**

1. Click **"Test"** button in EmailJS
2. Fill in test values:
   ```
   to_email: tomoacademyofficial@gmail.com
   adminName: Test Admin
   loginTime: 2025-10-14 9:48 PM
   browserInfo: Chrome
   deviceInfo: Desktop
   ipAddress: 192.168.1.1
   location: India
   portalUrl: https://your-site.com/admin
   ```
3. Click **"Send Test"**
4. Check your email inbox

---

### **Step 6: Save Template**

1. Click **"Save"** button
2. Copy your **Template ID** (looks like: `template_xxxxxxx`)
3. Make sure it matches the one in your Vercel environment variables

---

## **🔧 Alternative: Simple Text Template**

If you want a simpler template, use this:

```
Subject: Admin Login Notification

Hello,

An administrator has logged into the TOMO Academy YouTube Portal.

Login Details:
- Admin: {{adminName}}
- Time: {{loginTime}}
- Browser: {{browserInfo}}
- Device: {{deviceInfo}}
- IP: {{ipAddress}}
- Location: {{location}}

Go to Dashboard: {{portalUrl}}

This is an automated security notification.
If you did not perform this login, please secure your account immediately.

---
TOMO Academy
© 2025 All rights reserved
```

---

## **✅ Verification Checklist:**

- [ ] "To Email" field is set to `{{to_email}}` or `tomoacademyofficial@gmail.com`
- [ ] Template uses `{{adminName}}` variable
- [ ] Template uses `{{loginTime}}` variable
- [ ] Template uses `{{browserInfo}}` variable
- [ ] Template uses `{{deviceInfo}}` variable
- [ ] Template saved successfully
- [ ] Test email sent successfully
- [ ] Test email received in inbox

---

## **🎯 Expected Console Output After Fix:**

```javascript
📧 Attempting to send email notification...
📧 Service ID: service_zskl03k
📧 Template ID: ✅ Set
📧 Public Key: ✅ Set
📧 Is Configured: true
📧 Sending email with params: {...}
📧 Recipient: tomoacademyofficial@gmail.com
✅ Email sent successfully to tomoacademyofficial@gmail.com
```

---

## **🐛 Common Issues:**

### **Issue: "The recipients address is empty"**
**Solution:**
- Add `{{to_email}}` to the "To Email" field in EmailJS template settings
- OR hardcode: `tomoacademyofficial@gmail.com`

### **Issue: "Template not found"**
**Solution:**
- Check Template ID matches in Vercel environment variables
- Make sure template is saved and active

### **Issue: "Invalid public key"**
**Solution:**
- Check Public Key in Vercel matches your EmailJS account
- Get it from: EmailJS Dashboard → Account → API Keys

---

## **📧 EmailJS Template Settings:**

### **Service Settings:**
- **Service ID:** `service_zskl03k` ✅
- **Service Type:** Gmail (or your email provider)

### **Template Settings:**
- **Template Name:** Admin Login Notification
- **Subject:** `Admin Login Alert - TOMO Academy`
- **To Email:** `{{to_email}}` ⚠️ **MUST BE SET!**
- **From Name:** `TOMO Academy System`
- **Reply To:** `{{to_email}}`

---

## **🚀 After Setup:**

1. **Save template**
2. **Redeploy your app** (if you changed template ID)
3. **Test login:**
   - Go to your site
   - Login as admin
   - Check console for success message
   - Check email inbox for notification

---

## **📝 Summary:**

**Problem:**
```
❌ The recipients address is empty
```

**Solution:**
```
✅ Add {{to_email}} to EmailJS template "To Email" field
✅ Or hardcode: tomoacademyofficial@gmail.com
```

**Result:**
```
✅ Email sent successfully to tomoacademyofficial@gmail.com
```

---

**Last Updated:** October 14, 2025  
**Status:** ✅ Email Configuration Fixed  
**Ready to Send:** Yes 📧
