// ===== DATA STORAGE =====
const STORAGE_KEY = "lostFoundItems";
const EMAIL_NOTIFICATION_KEY = "emailNotificationDone";
let items = [];
let currentClaimIndex = -1;

// ===== INITIALIZATION =====
function initializeApp() {
  loadItems();
  setupPhotoPreview();
  createSparkles();
  renderItems();
  // Sample data removed - admin will add items via admin panel
}

// Load items from localStorage
function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  items = saved ? JSON.parse(saved) : [];
}

// Save items to localStorage
function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ===== SAMPLE DATA =====
function loadSampleData() {
  if (items.length > 0) return;
  
  const sampleItems = [
    {
      id: 1,
      name: "Blue Backpack",
      description: "Blue and black backpack found near the cafeteria with a small tear on left side.",
      status: "Found",
      photo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='220'%3E%3Crect fill='%230B4F9C' width='200' height='220'/%3E%3Crect x='30' y='40' width='140' height='120' fill='%233B7DD6' rx='8'/%3E%3Crect x='35' y='35' width='130' height='15' fill='%235A96E4' rx='4'/%3E%3Ccircle cx='50' cy='180' r='12' fill='%23000'/%3E%3Ccircle cx='150' cy='180' r='12' fill='%23000'/%3E%3Ctext x='100' y='210' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3EBackpack%3C/text%3E%3C/svg%3E",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      claimedBy: null,
      requests: []
    },
    {
      id: 2,
      name: "Red Water Bottle",
      description: "Stainless steel red water bottle with school logo found in the library.",
      status: "Found",
      photo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='220'%3E%3Crect fill='%230B4F9C' width='200' height='220'/%3E%3Crect x='70' y='30' width='60' height='150' fill='%23DC143C' rx='6'/%3E%3Crect x='75' y='20' width='50' height='15' fill='%23333'/%3E%3Cpath d='M 85 70 Q 100 80 85 100' stroke='%234A90E2' stroke-width='2' fill='none'/%3E%3Ctext x='100' y='205' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3EWater Bottle%3C/text%3E%3C/svg%3E",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      claimedBy: null,
      requests: []
    },
    {
      id: 3,
      name: "Black Framed Glasses",
      description: "Black framed eyeglasses lost somewhere in the school building.",
      status: "Lost",
      photo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='220'%3E%3Crect fill='%230B4F9C' width='200' height='220'/%3E%3Ccircle cx='70' cy='110' r='35' fill='none' stroke='%23000' stroke-width='4'/%3E%3Ccircle cx='130' cy='110' r='35' fill='none' stroke='%23000' stroke-width='4'/%3E%3Cline x1='105' y1='110' x2='105' y2='110' stroke='%23000' stroke-width='3'/%3E%3Cline x1='40' y1='105' x2='20' y2='95' stroke='%23333' stroke-width='3'/%3E%3Cline x1='160' y1='105' x2='180' y2='95' stroke='%23333' stroke-width='3'/%3E%3Ctext x='100' y='205' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3EGlasses%3C/text%3E%3C/svg%3E",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      claimedBy: null,
      requests: []
    }
  ];
  
  items = sampleItems;
  saveItems();
}

// ===== SPARKLING STARS =====
function createSparkles() {
  const container = document.querySelector('.stars-container');
  if (!container) return;
  
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(star);
  }
}

// ===== ITEM CARD CREATION =====
function createItemCard(item, index) {
  const card = document.createElement("div");
  card.className = "item-card";

  if (item.photo) {
    const img = document.createElement("img");
    img.src = item.photo;
    img.alt = item.name;
    card.appendChild(img);
  }

  const title = document.createElement("div");
  title.className = "item-title";
  title.textContent = item.name;
  card.appendChild(title);

  const status = document.createElement("div");
  status.className = "item-status";
  status.classList.add(item.status.toLowerCase());
  status.textContent = item.status;
  card.appendChild(status);

  const desc = document.createElement("p");
  desc.className = "item-description";
  desc.textContent = item.description;
  card.appendChild(desc);

  if (item.claimedBy) {
    const claimed = document.createElement("div");
    claimed.className = "item-claimed";
    claimed.innerHTML = `<strong>✓ Claimed by:</strong> ${item.claimedBy.name}`;
    card.appendChild(claimed);
  }

  const claimBtn = document.createElement("button");
  claimBtn.className = "btn-claim";
  claimBtn.textContent = item.claimedBy ? "Already Claimed" : "Claim This Item";
  claimBtn.disabled = !!item.claimedBy;
  claimBtn.addEventListener("click", () => openClaimModal(index));
  card.appendChild(claimBtn);

  return card;
}

// ===== RENDER ITEMS =====
function renderItems() {
  const list = document.getElementById("itemsList");
  if (!list) return;

  list.innerHTML = "";

  const searchValue = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const filterValue = document.getElementById("statusFilter")?.value || "all";

  const filtered = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchValue) ||
      item.description.toLowerCase().includes(searchValue);
    const matchesFilter = filterValue === "all" || item.status === filterValue;
    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    list.innerHTML = "<p class='no-items'>No items found</p>";
    return;
  }

  filtered.forEach((item, index) => {
    const originalIndex = items.indexOf(item);
    const card = createItemCard(item, originalIndex);
    list.appendChild(card);
  });
}

// ===== PHOTO PREVIEW =====
function setupPhotoPreview() {
  const photoInput = document.getElementById("itemPhoto");
  const photoPreview = document.getElementById("photoPreview");

  if (!photoInput) return;

  photoInput.addEventListener("change", function() {
    const file = this.files[0];
    if (!file || !photoPreview) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

// ===== MODALS =====
function openClaimModal(index) {
  currentClaimIndex = index;
  const item = items[index];
  document.getElementById("claimItemName").textContent = `Claiming: ${item.name}`;
  document.getElementById("claimModal").style.display = "block";
}

function closeClaimModal() {
  document.getElementById("claimModal").style.display = "none";
  document.getElementById("claimName").value = "";
  document.getElementById("claimEmail").value = "";
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
}

// ===== CLAIM SUBMISSION =====
document.getElementById("claimForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  
  const name = document.getElementById("claimName").value.trim();
  const email = document.getElementById("claimEmail").value.trim();
  
  if (!name || !email) {
    alert("Please fill in all fields");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email");
    return;
  }

  const item = items[currentClaimIndex];
  
  // Add claim request
  if (!item.requests) item.requests = [];
  item.requests.push({
    id: Date.now(),
    name,
    email,
    status: "pending",
    requestedAt: new Date().toISOString()
  });
  
  saveItems();
  closeClaimModal();
  
  document.getElementById("successMessage").textContent = 
    `Thank you, ${name}! Your claim request has been submitted. The admin will review it shortly.`;
  document.getElementById("successModal").style.display = "block";
  
  renderItems();
  this.reset();
});

// ===== FORM SUBMISSION =====
document.getElementById("itemForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("itemName").value.trim();
  const description = document.getElementById("itemDescription").value.trim();
  const status = document.getElementById("itemStatus").value;
  const photoPreview = document.getElementById("photoPreview");

  if (!name || !description) {
    alert("Please fill in all required fields");
    return;
  }

  const newItem = {
    id: Date.now(),
    name,
    description,
    status,
    photo: photoPreview && photoPreview.src ? photoPreview.src : null,
    createdAt: new Date().toISOString(),
    claimedBy: null,
    requests: []
  };

  items.push(newItem);
  saveItems();
  renderItems();

  this.reset();
  if (photoPreview) {
    photoPreview.style.display = "none";
    photoPreview.src = "";
  }

  alert("Item saved successfully!");
});

// ===== SEARCH AND FILTER =====
document.getElementById("searchInput")?.addEventListener("input", renderItems);
document.getElementById("statusFilter")?.addEventListener("change", renderItems);

// ===== CLOSE MODAL ON OUTSIDE CLICK =====
window.addEventListener("click", function(e) {
  const modal = e.target;
  if (modal.classList && modal.classList.contains("modal")) {
    modal.style.display = "none";
  }
});

// ===== INITIALIZE =====
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
