# 🎯 QUICK REFERENCE CARD

## Admin Credentials

```
👤 Username: schooladmin
🔐 Password: L0st&F0und#2026Secure!
```

## Access Admin Panel

```
1️⃣  Start Server:
    python -m http.server 8000

2️⃣  Open Browser:
    http://localhost:8000/admin.html

3️⃣  Login with credentials above

4️⃣  Use the admin dashboard
```

## Admin Dashboard Features

| Action | Location | Result |
|--------|----------|--------|
| **Add Item** | "Add New Item" form | Item appears in database |
| **Delete Item** | Click "Delete Item" button | Item removed from database |
| **Approve Claim** | Click "Approve" button | Claim approved, email sent |
| **Decline Claim** | Click "Decline" button | Claim declined, email sent |
| **Send Email** | Click "Send Email Notification" | Email sent to recipient |
| **Logout** | Click "Logout" in top right | Returns to login screen |

## Email Setup for Gmail

### Option 1: Skip (Emails logged to console)
Works fine for testing - emails show in browser console

### Option 2: Real Gmail Emails

```
1. Go to emailjs.com
2. Sign up (FREE account)
3. Connect Gmail account
4. Get your Public Key
5. Get your Service ID (Gmail service)
6. Create email template
7. Get your Template ID
8. Open admin.js (line ~13-18)
9. Update EMAILJS_CONFIG with your 3 keys
10. Test by sending approval email
```

See **GMAIL_SETUP_GUIDE.md** for detailed steps

## Files You Edited

```
admin.js       ← Admin logic & email system
admin.html     ← Login form & item creation form
script.js      ← Removed sample data loading
```

## Important Notes

✓ Database starts **EMPTY** - Admin adds items
✓ Credentials are **STRONG** - Keep them safe
✓ Email is **OPTIONAL** - Works without it
✓ All data saved to **localStorage** - Persists across sessions
✓ Session stays **logged in** - Stays in admin until logout

## Troubleshooting

### "Can't login"
✓ Check username: `schooladmin` (case sensitive)
✓ Check password: `L0st&F0und#2026Secure!` (exact match)

### "Can't add items"
✓ Make sure you're logged in
✓ Fill in all required fields
✓ Click "Add Item" button

### "Emails not sending"
✓ If no EmailJS setup: emails log to console (working as expected)
✓ If EmailJS setup: check that all 3 keys are correct
✓ Check GMAIL_SETUP_GUIDE.md for troubleshooting

### "Session lost"
✓ Session stays active while browser is open
✓ Logout or close browser to clear session
✓ Refresh page - you stay logged in

## Testing Checklist

- [ ] Can login to admin
- [ ] Can add items
- [ ] Can see items in admin dashboard
- [ ] Can delete items
- [ ] Can approve claims on public site
- [ ] Emails appear in console or Gmail inbox
- [ ] Can logout

## Documentation Files

```
ADMIN_UPDATE_SUMMARY.md    ← Complete guide to all features
GMAIL_SETUP_GUIDE.md       ← How to set up email with Gmail
VALIDATION_REPORT.html     ← System verification details
README.md                  ← Project overview
```

---

## 🎯 That's it! You're all set!

Start the server and try it out: `python -m http.server 8000`

Questions? See the documentation files above.
