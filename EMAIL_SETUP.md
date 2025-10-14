# 📧 Email Notification Setup Guide

## ✅ Current Status
- **Service ID**: `service_zskl03k` ✅ (Already configured)
- **Template ID**: ⚠️ Needs to be added
- **Public Key**: ⚠️ Needs to be added

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your EmailJS Credentials

You already have the Service ID: `service_zskl03k`

Now you need to get:
1. **Template ID**
2. **Public Key**

### Step 2: Create Email Template

1. Go to https://dashboard.emailjs.com/
2. Login to your account
3. Click on **"Email Templates"**
4. Click **"Create New Template"**
5. Use this template:

```
Subject: {{subject}}

{{message}}

---
Notification Type: {{type}}
Timestamp: {{timestamp}}

---
This is an automated notification from TOMO Academy Platform.
Do not reply to this email.
```

6. **Save** the template
7. **Copy the Template ID** (looks like: `template_xxxxxxx`)

### Step 3: Get Public Key

1. In EmailJS dashboard, click on **"Account"**
2. Find **"API Keys"** section
3. Copy your **Public Key** (looks like: `xxxxxxxxxxxxxxxx`)

### Step 4: Add to Vercel

1. Go to your Vercel project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these three variables:

```env
VITE_EMAILJS_SERVICE_ID=service_zskl03k
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx  (your template ID)
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx   (your public key)
```

4. Click **"Save"**
5. **Redeploy** your application

---

## 📧 Email Notifications You'll Receive

Once configured, you'll get emails for:

### 1. **Admin Login** 🔐
```
Subject: 🔐 Admin Login Detected
Message: Admin login successful at [timestamp]
```

### 2. **Employee Added** 👤
```
Subject: 👤 New Employee Added
Message: 
New employee added:
Name: [Employee Name]
Role: [Role]
Time: [timestamp]
```

### 3. **Employee Updated** ✏️
```
Subject: ✏️ Employee Updated
Message:
Employee updated:
Name: [Employee Name]
Changes: name, role, photo
Time: [timestamp]
```

### 4. **Employee Deleted** 🗑️
```
Subject: 🗑️ Employee Deleted
Message:
Employee deleted:
Name: [Employee Name]
Time: [timestamp]
```

### 5. **Video Uploaded** 🎬
```
Subject: 🎬 New Video Uploaded
Message:
New video uploaded:
Title: [Video Title]
Uploaded by: Admin
Time: [timestamp]
```

### 6. **Security Alerts** ⚠️
```
Subject: ⚠️ Security Alert
Message: [Custom security message]
Time: [timestamp]
```

---

## 🧪 Testing Email Service

### Test from Browser Console:

1. Open your deployed site
2. Press **F12** to open Developer Console
3. Paste this code:

```javascript
// Test email notification
fetch('https://api.emailjs.com/api/v1.0/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    service_id: 'service_zskl03k',
    template_id: 'YOUR_TEMPLATE_ID',
    user_id: 'YOUR_PUBLIC_KEY',
    template_params: {
      to_email: 'tomoacademyofficial@gmail.com',
      subject: '✅ Email Service Test',
      message: 'This is a test email. Email service is working!',
      type: 'test',
      timestamp: new Date().toLocaleString()
    }
  })
})
.then(response => response.text())
.then(data => console.log('✅ Email sent!', data))
.catch(error => console.error('❌ Error:', error));
```

4. Check your email at **tomoacademyofficial@gmail.com**

---

## 🔧 Troubleshooting

### Issue: Not Receiving Emails

**Solutions:**
1. **Check Spam Folder** - EmailJS emails might go to spam initially
2. **Verify Template ID** - Make sure it's correct in Vercel
3. **Verify Public Key** - Check it matches your EmailJS account
4. **Check Email Service** - Make sure Gmail is connected in EmailJS
5. **Redeploy** - After adding env variables, redeploy on Vercel

### Issue: "Email service not configured" in Console

**Solution:**
- Add all three environment variables to Vercel
- Make sure they start with `VITE_`
- Redeploy the application

### Issue: Emails Working Locally but Not in Production

**Solution:**
- Environment variables must be set in Vercel, not just `.env` file
- Redeploy after adding variables
- Check Vercel deployment logs for errors

---

## 📊 Email Limits (EmailJS Free Tier)

- **200 emails/month** - Free tier
- **Upgrade** for more emails if needed
- Current usage: Check EmailJS dashboard

---

## 🎯 What's Already Working

Even without full email configuration:
- ✅ Platform works perfectly
- ✅ All features functional
- ✅ Notifications logged to console
- ✅ No errors or crashes

With email configured:
- ✅ Real email notifications
- ✅ Sent to tomoacademyofficial@gmail.com
- ✅ Detailed action tracking
- ✅ Security monitoring

---

## 🔐 Security Best Practices

1. **Never commit** API keys to Git
2. **Use environment variables** in Vercel
3. **Restrict API key** to your domain in EmailJS
4. **Monitor email usage** in EmailJS dashboard
5. **Check spam folder** regularly

---

## 📝 Template Variables Reference

Use these in your EmailJS template:

```
{{to_email}}    - Recipient email (tomoacademyofficial@gmail.com)
{{subject}}     - Email subject
{{message}}     - Email body/content
{{type}}        - Notification type (login, employee_added, etc.)
{{timestamp}}   - When the action occurred
```

---

## 🎉 Quick Start Checklist

- [x] Service ID configured: `service_zskl03k`
- [ ] Create email template in EmailJS
- [ ] Copy Template ID
- [ ] Copy Public Key
- [ ] Add Template ID to Vercel env variables
- [ ] Add Public Key to Vercel env variables
- [ ] Redeploy application
- [ ] Test by logging in as admin
- [ ] Check email at tomoacademyofficial@gmail.com

---

## 💡 Pro Tips

1. **Add to Safe Senders**: Add EmailJS to your safe senders list
2. **Create Email Filter**: Auto-label TOMO Academy notifications
3. **Mobile Notifications**: Enable Gmail mobile notifications
4. **Backup Email**: Add a secondary email in EmailJS template
5. **Custom Domain**: Upgrade EmailJS to send from your domain

---

## 🆘 Need Help?

### EmailJS Support:
- Documentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/

### Platform Support:
- Check browser console for errors
- Review Vercel deployment logs
- Test with provided code snippet

---

**Current Configuration:**
- Service ID: ✅ `service_zskl03k`
- Admin Email: ✅ `tomoacademyofficial@gmail.com`
- Status: ⚠️ Waiting for Template ID and Public Key

**Once you add the Template ID and Public Key to Vercel, emails will start working automatically!** 📧

---

**Last Updated**: October 14, 2025  
**Version**: 1.0  
**Status**: Ready for Configuration
