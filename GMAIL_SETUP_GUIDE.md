# 📧 Gmail Integration Setup Guide

## Admin Credentials

Your admin account has been updated with stronger credentials:

```
Username: schooladmin
Password: L0st&F0und#2026Secure!
```

⚠️ **IMPORTANT**: Store these credentials securely. Change them later if needed by editing `admin.js`.

---

## 🚀 How to Set Up EmailJS with Gmail

### Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com
2. Click "Sign Up" and create a free account
3. Verify your email

### Step 2: Connect Gmail Account

1. In EmailJS dashboard, go to **Email Services** (left sidebar)
2. Click **"Add Service"**
3. Choose **Gmail**
4. Follow the steps to:
   - Sign in with your Gmail account
   - Allow EmailJS to access your Gmail
   - Copy the **Service ID** (looks like: `service_xxxxxxxxxx`)

### Step 3: Get Your Public Key

1. Go to **Account** (left sidebar)
2. Find your **Public Key** (looks like: `xxxxxxxxxxxxxxxxxxx`)
3. Copy it

### Step 4: Create an Email Template

1. Go to **Email Templates** (left sidebar)
2. Click **"Create New Template"**
3. Copy this template structure:

**Template Name**: `lost_found_email`

**Template Content** (in the "HTML" tab):
```html
<h2>{{subject}}</h2>
<p>{{message}}</p>
<br>
<p>Best regards,<br>School Lost & Found Admin</p>
```

**Variables used**:
- `{{subject}}` - Email subject
- `{{message}}` - Email message body

4. Save and note the **Template ID** (looks like: `template_xxxxxxxxxx`)

### Step 5: Update Your Website Code

Open `admin.js` and find these lines (around line 13-18):

```javascript
const EMAILJS_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY_HERE",        // ← Replace with your public key
  serviceID: "YOUR_SERVICE_ID_HERE",        // ← Replace with Gmail service ID
  templateID: "YOUR_TEMPLATE_ID_HERE"       // ← Replace with template ID
};
```

**Example** (with fake credentials):
```javascript
const EMAILJS_CONFIG = {
  publicKey: "xyz123abc456def789",
  serviceID: "service_a1b2c3d4e5f6",
  templateID: "template_p9o8i7u6y5t4"
};
```

### Step 6: Test Email Sending

1. Start the server: `python -m http.server 8000`
2. Go to: http://localhost:8000/admin.html
3. Login with credentials:
   - Username: `schooladmin`
   - Password: `L0st&F0und#2026Secure!`
4. Add a test item
5. Submit a claim on the main site with test email
6. Go to Admin and click "Approve" on the claim
7. Check the recipient email inbox - you should receive an approval email!

---

## 📋 What Emails Are Sent

### 1. **Claim Approved Email**
Sent when admin clicks "Approve" on a claim request
- **To**: Claimant's email
- **Subject**: "Your Claim Has Been Approved!"
- **Content**: Tells them to pick up their item at the office

### 2. **Claim Declined Email**
Sent when admin clicks "Decline" on a claim request
- **To**: Claimant's email
- **Subject**: "Claim Status Update"
- **Content**: Notifies them the claim was declined

### 3. **Admin Reminder Email**
Sent when admin clicks "Send Email Notification" on an item
- **To**: Admin's email (they enter it manually)
- **Subject**: Item status reminder
- **Content**: Reminds about pending claims or item status

---

## ✅ Checklist

- [ ] Created EmailJS account at emailjs.com
- [ ] Connected Gmail account to EmailJS
- [ ] Got Public Key from Account settings
- [ ] Got Service ID from Gmail service
- [ ] Created email template with `{{subject}}` and `{{message}}`
- [ ] Got Template ID from template
- [ ] Updated admin.js with all three IDs
- [ ] Tested by submitting and approving a claim
- [ ] Received approval email in inbox

---

## 🔒 Security Notes

1. **Public Key is Public**: The public key in `admin.js` is visible in the browser (it's meant to be public)
2. **Admin Credentials**: Your username/password are stored in `admin.js` - in production, use backend authentication
3. **Gmail Security**: EmailJS uses OAuth, so your Gmail password is never stored
4. **Template Variables**: Make sure template uses `{{subject}}` and `{{message}}` exactly

---

## 🐛 Troubleshooting

### "Email not sending"
1. Check that all 3 IDs in `admin.js` are correct
2. Verify template variable names match: `{{subject}}`, `{{message}}`
3. Check EmailJS dashboard for error logs
4. Make sure Gmail account connected is correct

### "EmailJS not initialized"
1. Refresh the page after updating `admin.js`
2. Check browser console for errors
3. Verify public key is not `"YOUR_PUBLIC_KEY_HERE"`

### "Gmail account disconnected"
1. Go to EmailJS > Email Services
2. Disconnect and reconnect Gmail
3. Update Service ID in `admin.js`

### "Permission denied errors"
1. Make sure you allowed EmailJS access to Gmail
2. Check your Gmail security settings
3. Try signing out and back in to EmailJS

---

## 📞 Support

For EmailJS issues: https://www.emailjs.com/docs/
For Gmail issues: https://accounts.google.com/signin/recovery

---

## 🎯 Quick Start Summary

1. Sign up to emailjs.com
2. Connect Gmail service → Get Service ID
3. Get your Public Key from Account
4. Create template with `{{subject}}` and `{{message}}` → Get Template ID
5. Update `admin.js` with all 3 IDs
6. Test by sending an approval email
7. Done! ✓

