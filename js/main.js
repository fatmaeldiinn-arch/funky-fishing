// --- Cart Functionality ---

// Get cart from Local Storage
function getCart() {
  return JSON.parse(localStorage.getItem("funkyFishCart")) || {};
}

// Save cart to Local Storage
function saveCart(cart) {
  localStorage.setItem("funkyFishCart", JSON.stringify(cart));
  updateCartUI();
}

// Add item to cart
function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
}

// Update the cart count in the header
function updateCartUI() {
  const cart = getCart();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count;

  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  
  if (cartItemsEl && cartTotalEl) {
    renderCheckout(cart, cartItemsEl, cartTotalEl);
  }
}

// --- Render Products (Shop Page) ---
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = products.map(product => {
    // Handle if product has one or multiple images
    const imagesHtml = product.images.map((img, index) => 
      `<img src="${img}" alt="${product.name} - View ${index + 1}" class="slider-img">`
    ).join("");

    return `
      <article class="product-card">
        <div class="slider-wrapper">
          <div class="image-slider">
            ${imagesHtml}
          </div>
          ${product.images.length > 1 ? '<div class="slider-hint">← Swipe →</div>' : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="short-desc">${product.short}</p>
          <details class="product-details">
            <summary>Details & Benefits</summary>
            <p><strong>Usage:</strong> ${product.usage}</p>
            <p><strong>Benefits:</strong> ${product.benefits}</p>
          </details>
          <div class="product-footer">
            <span class="price">£${product.price.toFixed(2)}</span>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); this.textContent='Added ✓'; setTimeout(() => this.textContent='Add to Basket', 1500);">Add to Basket</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// --- Cart Functionality ---

function getCart() {
  return JSON.parse(localStorage.getItem("funkyFishCart")) || {};
}

function saveCart(cart) {
  localStorage.setItem("funkyFishCart", JSON.stringify(cart));
  updateCartUI();
}

// Add item to cart (Default 1)
function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
}

// Increase Quantity
function increaseQty(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
}

// Decrease Quantity
function decreaseQty(productId) {
  const cart = getCart();
  if (cart[productId] > 1) {
    cart[productId] -= 1;
  } else {
    delete cart[productId]; // Remove if it reaches 0
  }
  saveCart(cart);
}

// Remove Item completely
function removeItem(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
}

// Update Header Count
function updateCartUI() {
  const cart = getCart();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count;

  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  
  if (cartItemsEl && cartTotalEl) {
    renderCheckout(cart, cartItemsEl, cartTotalEl);
  }
}

// --- Render Products (Shop Page) ---
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = products.map(product => {
    const imagesHtml = product.images.map((img, index) => 
      `<img src="${img}" alt="${product.name} - View ${index + 1}" class="slider-img">`
    ).join("");

    return `
      <article class="product-card">
        <div class="slider-wrapper">
          <div class="image-slider">
            ${imagesHtml}
          </div>
          ${product.images.length > 1 ? '<div class="slider-hint">← Swipe →</div>' : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="short-desc">${product.short}</p>
          <details class="product-details">
            <summary>Details & Benefits</summary>
            <p><strong>Usage:</strong> ${product.usage}</p>
            <p><strong>Benefits:</strong> ${product.benefits}</p>
          </details>
          <div class="product-footer">
            <span class="price">£${product.price.toFixed(2)}</span>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); this.textContent='Added ✓'; setTimeout(() => this.textContent='Add to Basket', 1500);">Add to Basket</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// --- Render Checkout with +/- buttons (Order Page) ---
function renderCheckout(cart, container, totalEl) {
  let html = "";
  let total = 0;

  if (Object.keys(cart).length === 0) {
    html = "<p>Your basket is empty.</p>";
  } else {
    for (const [id, qty] of Object.entries(cart)) {
      const product = products.find(p => p.id == id);
      if (product) {
        const itemTotal = product.price * qty;
        total += itemTotal;
        html += `
          <div class="cart-item">
            <div class="cart-item-info">
              <span class="cart-item-name">${product.name}</span>
              <span class="cart-item-price">£${product.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-actions">
              <div class="qty-controls">
                <button onclick="decreaseQty(${product.id})" class="qty-btn">-</button>
                <span class="qty-num">${qty}</span>
                <button onclick="increaseQty(${product.id})" class="qty-btn">+</button>
              </div>
              <span class="item-total">£${itemTotal.toFixed(2)}</span>
              <button onclick="removeItem(${product.id})" class="remove-btn" title="Remove item">&times;</button>
            </div>
          </div>
        `;
      }
    }
  }

  container.innerHTML = html;
  totalEl.textContent = `£${total.toFixed(2)}`;
}

// --- Checkout Form Logic ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();

  const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
  const addressGroup = document.getElementById("address-group");
  
  if (deliveryRadios.length > 0 && addressGroup) {
    deliveryRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        addressGroup.style.display = e.target.value === "delivery" ? "block" : "none";
      });
    });
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cart = getCart();
      if (Object.keys(cart).length === 0) {
        alert("Your basket is empty! Please add items first.");
        return;
      }
      showToast("Order placed successfully! Thank you for shopping with Funky Fish.");
      localStorage.removeItem("funkyFishCart"); 
      updateCartUI();
      checkoutForm.reset();
      // Function to show Toast Notification
function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.className = "toast show";
    
    // إخفاء الرسالة بعد 3.5 ثواني
    setTimeout(function(){ 
      toast.className = toast.className.replace("toast show", "toast"); 
    }, 3500);
  } else {
    alert(message); // Fallback if element not found
  }
}
      document.getElementById("address-group").style.display = "none";
    });
  }
});