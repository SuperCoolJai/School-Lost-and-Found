// ===== ADMIN PANEL =====
const STORAGE_KEY = "lostFoundItems";
const ADMIN_CREDENTIALS = {
  username: "schooladmin",
  password: "L0st&F0und#2026Secure!"
};
let items = [];
let isAdminLoggedIn = false;
let nextItemId = 1;

// ===== EMAILJS CONFIGURATION =====
const EMAILJS_CONFIG = {
  publicKey: "nC3gM3Wjq5JNhD9SO",  // Public key from EmailJS
  serviceID: "service_tqtjfwj",  // Gmail service ID in EmailJS
  templateID: "template_mpbs8js", // Email template ID in EmailJS
  adminEmail: "jaineil32624@gmail.com" // Your email for notifications
};

// Initialize EmailJS (configure after getting credentials)
function initializeEmailJS() {
  if (EMAILJS_CONFIG.publicKey !== "YOUR_PUBLIC_KEY_HERE") {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log("✓ EmailJS initialized");
  } else {
    console.log("⚠ EmailJS not configured - see setup instructions");
  }
}

// ===== AUTHENTICATION =====
function handleAdminLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value;
  const errorDiv = document.getElementById("loginError");
  
  // Clear previous error
  if (errorDiv) {
    errorDiv.style.display = "none";
    errorDiv.textContent = "";
  }
  
  // Validate credentials
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    isAdminLoggedIn = true;
    sessionStorage.setItem("adminLoggedIn", "true");
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("adminDashboard").style.display = "block";
    document.getElementById("logoutBtn").style.display = "block";
    
    loadItems();
    renderAdminClaims();
    renderAdmin();
    setupAddItemForm();
    
    // Scroll to top
    window.scrollTo(0, 0);
  } else {
    // Show error on page
    if (errorDiv) {
      errorDiv.textContent = "❌ Invalid username or password. Please try again.";
      errorDiv.style.display = "block";
    }
    
    // Also show console error
    console.error("Login failed - invalid credentials");
  }
  
  // Clear form
  document.getElementById("adminLoginForm").reset();
}

// ===== DATA MANAGEMENT =====
function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  items = saved ? JSON.parse(saved) : [];
  // Maintain nextItemId so newly created items get unique IDs
  if (items.length > 0) {
    const maxId = items.reduce((max, it) => Math.max(max, it.id || 0), 0);
    nextItemId = maxId + 1;
  } else {
    nextItemId = 1;
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Clear all items from database (admin function)
function clearDatabase() {
  if (confirm("⚠️ Are you sure you want to delete ALL items from the database? This cannot be undone!")) {
    items = [];
    saveItems();
    renderAdminClaims();
    renderAdmin();
    alert("✓ Database cleared - all items deleted");
  }
}

// ===== ADMIN INTERFACE =====

// Render Claims for Approval/Decline (TOP PRIORITY SECTION)
function renderAdminClaims() {
  const claimsList = document.getElementById("adminClaimsList");
  if (!claimsList) return;

  claimsList.innerHTML = "";

  // Walk original items array so we keep correct indices for approve/decline
  let foundAny = false;
  items.forEach((item, itemIndex) => {
    if (!item.requests || item.requests.length === 0) return;
    foundAny = true;

    const itemCard = document.createElement("div");
    itemCard.className = "admin-card";
    itemCard.style.marginBottom = "20px";
    itemCard.style.borderLeft = "4px solid #ffed4e";

    // Item header
    const header = document.createElement("div");
    header.className = "admin-header";
    header.style.marginBottom = "15px";
    const titleEl = document.createElement("strong");
    titleEl.textContent = `📋 ${item.name}`;
    header.appendChild(titleEl);

    const statusEl = document.createElement("span");
    statusEl.className = `status-badge ${item.status.toLowerCase()}`;
    statusEl.textContent = item.status;
    header.appendChild(statusEl);
    itemCard.appendChild(header);

    // Item description
    const desc = document.createElement("p");
    desc.textContent = item.description;
    desc.style.fontSize = "14px";
    desc.style.color = "#ccc";
    desc.style.marginBottom = "15px";
    itemCard.appendChild(desc);

    // Claim Requests Section
    item.requests.forEach((request, reqIndex) => {
      const requestCard = document.createElement("div");
      requestCard.className = `request-card request-${request.status}`;
      requestCard.style.marginBottom = "12px";
      requestCard.style.padding = "15px";
      requestCard.style.borderRadius = "6px";
      requestCard.style.backgroundColor = request.status === "pending" ? "rgba(255, 237, 74, 0.1)" : "rgba(200, 200, 200, 0.1)";
      requestCard.style.borderLeft = request.status === "pending" ? "4px solid #ffed4e" : "4px solid #888";

      const requestInfo = document.createElement("div");
      requestInfo.innerHTML = `
        <strong style="font-size: 16px;">${request.name}</strong><br>
        <small style="color: #aaa;">Email: ${request.email}</small><br>
        <small style="color: #aaa;">Status: <span class="request-status" style="color: ${request.status === "pending" ? "#ffed4e" : request.status === "approved" ? "#4caf50" : "#ff6b6b"}; font-weight: bold;">${request.status.toUpperCase()}</span></small>
      `;
      requestCard.appendChild(requestInfo);

      if (request.status === "pending") {
        const btnGroup = document.createElement("div");
        btnGroup.className = "request-buttons";
        btnGroup.style.marginTop = "12px";
        btnGroup.style.display = "flex";
        btnGroup.style.gap = "10px";

        const approveBtn = document.createElement("button");
        approveBtn.className = "btn-approve";
        approveBtn.textContent = "✓ Approve";
        approveBtn.style.flex = "1";
        approveBtn.addEventListener("click", () => approveClaim(itemIndex, reqIndex, request.email, request.name, item.name));
        btnGroup.appendChild(approveBtn);

        const declineBtn = document.createElement("button");
        declineBtn.className = "btn-decline";
        declineBtn.textContent = "✗ Decline";
        declineBtn.style.flex = "1";
        declineBtn.addEventListener("click", () => declineClaim(itemIndex, reqIndex, request.email, request.name, item.name));
        btnGroup.appendChild(declineBtn);

        requestCard.appendChild(btnGroup);
      }

      itemCard.appendChild(requestCard);
    });

    claimsList.appendChild(itemCard);
  });

  if (!foundAny) {
    claimsList.innerHTML = "<p class='no-items'>No pending claim requests at this time.</p>";
  }
}

// Render Items for Deletion (SECOND PRIORITY SECTION)
function renderAdmin() {
  const list = document.getElementById("adminItemsList");
  if (!list) return;

  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "<p class='no-items'>No items in the system.</p>";
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "admin-card";
    card.style.marginBottom = "12px";

    // Item name and status
    const header = document.createElement("div");
    header.className = "admin-header";
    header.style.marginBottom = "10px";
    const titleEl = document.createElement("strong");
    titleEl.textContent = item.name;
    header.appendChild(titleEl);

    const statusEl = document.createElement("span");
    statusEl.className = `status-badge ${item.status.toLowerCase()}`;
    statusEl.textContent = item.status;
    header.appendChild(statusEl);
    card.appendChild(header);

    // Description
    const desc = document.createElement("p");
    desc.textContent = item.description;
    desc.style.fontSize = "13px";
    desc.style.margin = "8px 0";
    card.appendChild(desc);

    // Delete button
    const btnDiv = document.createElement("div");
    btnDiv.style.marginTop = "10px";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "🗑️ Delete";
    deleteBtn.style.width = "100%";
    deleteBtn.addEventListener("click", () => deleteItem(index));
    btnDiv.appendChild(deleteBtn);
    card.appendChild(btnDiv);

    list.appendChild(card);
  });
}

// ===== CLAIM APPROVAL =====
function approveClaim(itemIndex, requestIndex, email, name, itemName) {
  const item = items[itemIndex];
  const request = item.requests[requestIndex];

  // Mark as claimed
  item.claimedBy = {
    name: request.name,
    email: request.email,
    claimedAt: new Date().toISOString()
  };

  // Update request status
  item.requests[requestIndex].status = "approved";

  saveItems();
  renderAdminClaims();
  renderAdmin();

  // Send approval email
  sendApprovalEmail(email, name, itemName);
  alert(`✓ Claim approved for ${name}!`);
}

// ===== CLAIM DECLINE =====
function declineClaim(itemIndex, requestIndex, email, name, itemName) {
  const item = items[itemIndex];
  item.requests[requestIndex].status = "declined";

  saveItems();
  renderAdminClaims();
  renderAdmin();

  // Send decline email
  sendDeclineEmail(email, name, itemName);
  alert(`✗ Claim declined for ${name}`);
}

// ===== DELETE ITEM =====
function deleteItem(index) {
  const item = items[index];
  
  if (!confirm(`Delete "${item.name}"? This action cannot be undone.`)) {
    return;
  }

  items.splice(index, 1);
  saveItems();
  renderAdminClaims();
  renderAdmin();
  alert("✓ Item deleted successfully");
}

// ===== ITEM CREATION =====
function setupAddItemForm() {
  const form = document.getElementById("adminAddItemForm");
  const clearDbBtn = document.getElementById("clearDbBtn");
  
  if (form) {
    form.addEventListener("submit", addNewItem);
  }
  
  if (clearDbBtn) {
    clearDbBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearDatabase();
    });
  }
}

function addNewItem(e) {
  e.preventDefault();
  
  const name = document.getElementById("itemName").value.trim();
  const description = document.getElementById("itemDescription").value.trim();
  const status = document.getElementById("itemStatus").value;
  const photoInput = document.getElementById("itemPhoto");
  
  if (!name || !description) {
    alert("Please fill in all required fields");
    return;
  }
  
  // Handle photo upload or use default SVG
  let photoData = generateDefaultItemPhoto(name);
  
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      photoData = event.target.result;
      saveNewItem(name, description, status, photoData);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    saveNewItem(name, description, status, photoData);
  }
}

function saveNewItem(name, description, status, photo) {
  const newItem = {
    id: nextItemId++,
    name: name,
    description: description,
    status: status,
    photo: photo,
    createdAt: new Date().toISOString(),
    claimedBy: null,
    requests: []
  };
  
  items.push(newItem);
  saveItems();
  renderAdminClaims();
  renderAdmin();
  
  // Reset form
  document.getElementById("adminAddItemForm").reset();
  alert(`✓ Item "${name}" added to the database!`);
}

function generateDefaultItemPhoto(itemName) {
  // Generate a simple SVG based on item name
  const colors = ["#3B7DD6", "#DC143C", "#2E7D32", "#F57C00"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="220">
    <rect fill="#0B4F9C" width="200" height="220"/>
    <circle cx="100" cy="80" r="40" fill="${color}"/>
    <rect x="60" y="130" width="80" height="60" fill="${color}" rx="8"/>
    <text x="100" y="210" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${itemName}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ===== EMAIL FUNCTIONS (GMAIL INTEGRATION) =====
function sendApprovalEmail(email, name, itemName) {
  const subject = "Your Claim Has Been Approved!";
  const message = `Dear ${name},\n\nGood news! Your claim for "${itemName}" has been APPROVED by the admin!\n\nPlease visit the school office during office hours to claim your item.\n\nThank you!\nSchool Lost & Found Admin`;
  
  sendEmailViaGmail(email, subject, message);
}

function sendDeclineEmail(email, name, itemName) {
  const subject = "Claim Status Update";
  const message = `Dear ${name},\n\nUnfortunately, your claim for "${itemName}" has been DECLINED.\n\nIf you believe this is an error, please contact the school office.\n\nThank you!\nSchool Lost & Found Admin`;
  
  sendEmailViaGmail(email, subject, message);
}

function sendAdminEmail(itemIndex) {
  const item = items[itemIndex];
  const subject = `Lost & Found Reminder: ${item.name}`;
  const hasClaims = item.requests && item.requests.length > 0;
  const message = hasClaims 
    ? `Item "${item.name}" has ${item.requests.length} claim request(s) pending review.\n\nStatus: ${item.status}\n\nItem Details:\n${item.description}`
    : `Item "${item.name}" is in the Lost & Found system.\n\nStatus: ${item.status}\n\nItem Details:\n${item.description}`;
  
  sendEmailViaGmail(EMAILJS_CONFIG.adminEmail, subject, message);
}

function sendEmailViaGmail(recipientEmail, subject, message) {
  // Check if EmailJS is configured
  if (EMAILJS_CONFIG.publicKey === "YOUR_PUBLIC_KEY_HERE") {
    console.warn("📧 EMAIL WOULD BE SENT (EmailJS not configured)");
    console.log(`\nTo: ${recipientEmail}\nSubject: ${subject}\nMessage:\n${message}`);
    
    alert(`📧 Email Ready to Send\n\nTo: ${recipientEmail}\nSubject: ${subject}\n\nNote: EmailJS needs to be configured to send real emails.\nSee GMAIL_SETUP_GUIDE.md for setup instructions.`);
    return;
  }

  // Prepare EmailJS template variables
  const templateParams = {
    to_email: recipientEmail,
    subject: subject,
    message: message
  };

  // Send via EmailJS
  emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
    .then((response) => {
      console.log("✓ Email sent successfully!", response);
      alert(`✅ Email sent to ${recipientEmail}`);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      alert(`❌ Failed to send email: ${error.message}`);
    });
}

// ===== LOGOUT FUNCTION =====
function handleLogout() {
  isAdminLoggedIn = false;
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("adminDashboard").style.display = "none";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("adminLoginForm").reset();
  window.location.href = "index.html";
}

// ===== INITIALIZATION =====
function initializeAdmin() {
  initializeEmailJS();
  
  const loginForm = document.getElementById("adminLoginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  
  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLogin);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
  
  // Check if admin is already logged in (session)
  const sessionCheck = sessionStorage.getItem("adminLoggedIn");
  if (sessionCheck === "true") {
    isAdminLoggedIn = true;
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("adminDashboard").style.display = "block";
    document.getElementById("logoutBtn").style.display = "block";
    
    loadItems();
    renderAdminClaims();
    renderAdmin();
    setupAddItemForm();
  }
}

// Start admin panel on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAdmin);
} else {
  initializeAdmin();
}
