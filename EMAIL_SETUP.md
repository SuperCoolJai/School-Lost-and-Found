# 📧 How to Send Emails to jaineil32624@gmail.com

## Current Status
✅ **Email system is set up and ready**
✅ **Your email configured**: jaineil32624@gmail.com
❌ **EmailJS credentials needed**: See below

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Go to EmailJS.com
1. Visit: https://www.emailjs.com
2. Click "Sign Up" (create free account)
3. Verify your email

### Step 2: Connect Gmail Account
1. Login to EmailJS dashboard
2. Go to **Email Services** (left sidebar)
3. Click **"Add Service"**
4. Select **Gmail**
5. Follow the prompts to connect your Gmail account
   - It will ask to verify - click "Allow"
6. **Copy the Service ID** you see (looks like: `service_abc123def456`)

### Step 3: Create Email Template
1. Go to **Email Templates** section
2. Click **"Create New Template"**
3. Set up the template:
   - **Template Name**: `lost_found_email`
   - **Subject**: `{{subject}}`
   - **HTML Content**:
   ```html
   <h2>{{subject}}</h2>
   <p style="white-space: pre-wrap;">{{message}}</p>
   <br>
   <p style="color: #888;">
     School Lost & Found System
   </p>
   ```
4. **Save** and copy the **Template ID** (looks like: `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to **Account** section
2. Find **Public Key** and copy it (looks like: `abc123xyz789`)

### Step 5: Update Your Website
1. Open `admin.js` file in your editor
2. Find lines 11-16:
   ```javascript
   const EMAILJS_CONFIG = {
     publicKey: "YOUR_PUBLIC_KEY_HERE",
     serviceID: "YOUR_SERVICE_ID_HERE",
     templateID: "YOUR_TEMPLATE_ID_HERE",
     adminEmail: "jaineil32624@gmail.com"
   };
   ```
3. Replace the three `"YOUR_...HERE"` values with your actual keys:
   ```javascript
   const EMAILJS_CONFIG = {
     publicKey: "k1a2b3c4d5e6f7g8h9i0",  // Your Public Key
     serviceID: "service_a1b2c3d4e5f6",  // Your Service ID
     templateID: "template_x9y8z7w6v5u4",  // Your Template ID
     adminEmail: "jaineil32624@gmail.com"
   };
   ```
4. **Save** the file

### Step 6: Test It! 
1. Start your website: `python -m http.server 8000`
2. Go to: http://localhost:8000/admin.html
3. Login:
   - Username: `schooladmin`
   - Password: `L0st&F0und#2026Secure!`
4. Click **"🗑️ Clear All Items"** to ensure database is empty
5. Add a test item
6. Go back to public site (click "Back to Public Site")
7. Search for your test item
8. Click "Claim This Item"
9. Fill in the form with any name/email
10. Go back to Admin
11. Click **"Approve"** on the claim
12. You should get an email at **jaineil32624@gmail.com**! ✅

---

## 📧 What Emails Will Be Sent

### 1. Claim Approved Email
- **When**: Admin approves a user's claim
- **To**: Your email (jaineil32624@gmail.com)
- **Subject**: "Your Claim Has Been Approved!"
- **Content**: Tells user to pick up item at office

### 2. Claim Declined Email
- **When**: Admin declines a user's claim
- **To**: jaineil32624@gmail.com
- **Subject**: "Claim Status Update"
- **Content**: Notifies user claim was declined

### 3. Admin Reminder Email
- **When**: Admin clicks "Send Email Notification"
- **To**: jaineil32624@gmail.com
- **Subject**: "Lost & Found Reminder: [Item Name]"
- **Content**: Shows pending claims and item details

---

## 🔍 Where to Find Your Credentials

### EmailJS Dashboard
```
Account → Public Key (copy this)
Email Services → Gmail → Service ID (copy this)
Email Templates → Your Template → Template ID (copy this)
```

### Your Gmail Address
```
We set it to: jaineil32624@gmail.com
In admin.js line: adminEmail: "jaineil32624@gmail.com"
```

---

## ✅ Checklist

- [ ] Created EmailJS account
- [ ] Connected Gmail service
- [ ] Created email template  
- [ ] Got Public Key
- [ ] Got Service ID
- [ ] Got Template ID
- [ ] Updated admin.js with 3 keys
- [ ] Tested by approving a claim
- [ ] Received email in Gmail inbox ✅

---

## 🐛 Troubleshooting

### "Email not received"
✓ Check that all 3 keys are correct in admin.js
✓ Check Gmail spam folder
✓ Reload website if you updated admin.js
✓ Check browser console for error messages

### "EmailJS says permission denied"
✓ Make sure Gmail account is properly connected
✓ Try disconnecting and reconnecting Gmail in EmailJS

### "Can't find my Service ID"
✓ In EmailJS dashboard: Email Services → Gmail
✓ Click "Gmail" service to see the Service ID

### "Template not working"
✓ Make sure template has these exact variables:
  - `{{subject}}`
  - `{{message}}`
✓ Save template before using

---

## 📝 Without EmailJS Setup

For now, emails will appear in the browser console. This is perfect for testing!

Example console output:
```
🔗 EMAIL WOULD BE SENT (EmailJS not configured)

To: jaineil32624@gmail.com
Subject: Your Claim Has Been Approved!
Message:
Dear [Name],

Good news! Your claim for "[Item]" has been APPROVED by the admin!
...
```

Just follow the setup steps above to send real emails! 

---

## 🎯 Summary

| Step | Action | Result |
|------|--------|--------|
| 1️⃣ | Create EmailJS account | Get credentials |
| 2️⃣ | Connect Gmail | Allow EmailJS access |
| 3️⃣ | Create template | Set up email format |
| 4️⃣ | Copy 3 keys | Public, Service, Template IDs |
| 5️⃣ | Update admin.js | Paste your keys |
| 6️⃣ | Test approval | Email received ✅ |

Once done, you'll get real emails at **jaineil32624@gmail.com** every time you:
- ✉️ Approve a claim
- ✉️ Decline a claim
- ✉️ Send an admin reminder

---

## ❓ Questions?

See GMAIL_SETUP_GUIDE.md for additional help, or check EmailJS documentation at https://www.emailjs.com/docs/
