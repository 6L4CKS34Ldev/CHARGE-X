// scripts.js - Main JavaScript file for CHARGE X website
// =============================================
// NAVIGATION FUNCTIONALITY
// =============================================

// Home link functionality
document.getElementById("home-link")?.addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "index.html";
});

// Shop link functionality
document.getElementById("shop-link")?.addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "products.html";
});

// Shop now button functionality
document.getElementById("shop-now")?.addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "products.html";
});

// About Us link functionality
document
  .getElementById("aboutus-link")
  ?.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "aboutus.html";
  });

// Search functionality
document
  .querySelector(".search-bar input")
  ?.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const sneakers = document.querySelectorAll(".sneaker");

    sneakers.forEach((sneaker) => {
      const name = sneaker.querySelector("h3").textContent.toLowerCase();
      if (name.includes(searchTerm)) {
        sneaker.style.display = "block";
      } else {
        sneaker.style.display = "none";
      }
    });
  });

// =============================================
// DOUGHNUT MENU FUNCTIONALITY
// =============================================
function initializeDoughnutMenu() {
  const doughnutToggle = document.getElementById("doughnut-toggle");
  const doughnutMenu = document.querySelector(".doughnut-menu");

  if (doughnutToggle && doughnutMenu) {
    doughnutToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      doughnutMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!doughnutMenu.contains(e.target) && e.target !== doughnutToggle) {
        doughnutMenu.classList.remove("active");
      }
    });

    // Close menu when clicking on a link
    document.querySelectorAll(".doughnut-links a").forEach((link) => {
      link.addEventListener("click", function () {
        doughnutMenu.classList.remove("active");
      });
    });
  }
}

// =============================================
// CART FUNCTIONALITY - UPDATED FOR MULTI-PAGE SUPPORT
// =============================================

console.log("Current cart:", JSON.parse(sessionStorage.getItem("cart")));

let cart = [];
let cartTotal = 0;

// Initialize cart from sessionStorage on page load
function initializeCart() {
  const savedCart = sessionStorage.getItem("cart");
  const savedTotal = sessionStorage.getItem("cartTotal");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  if (savedTotal) {
    cartTotal = parseFloat(savedTotal);
  }

  updateCartCount();
  updateCartUI();
}

// Update cart count indicator
function updateCartCount() {
  const countElement = document.querySelector(".cart-count");
  if (cart.length > 0) {
    if (!countElement) {
      const cartLink = document.getElementById("cart-link");
      if (cartLink) {
        const count = document.createElement("span");
        count.className = "cart-count";
        cartLink.appendChild(count);
      }
    }
    document.querySelector(".cart-count").textContent = cart.length;
  } else if (countElement) {
    countElement.remove();
  }
}

// Add item to cart
function addToCart(name, price, imageUrl) {
  // Convert price to number consistently
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

  cart.push({ name, price: numericPrice, formattedPrice: price, imageUrl });
  cartTotal += numericPrice;
  saveCartToStorage();
  updateCartCount();
  updateCartUI();
}

// Remove item from cart
function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    const removedItem = cart.splice(index, 1)[0];
    cartTotal -= removedItem.price;
    saveCartToStorage();
    updateCartCount();
    updateCartUI();
  }
}

// Save cart to sessionStorage
function saveCartToStorage() {
  sessionStorage.setItem("cart", JSON.stringify(cart));
  sessionStorage.setItem("cartTotal", cartTotal.toString());
}

// Update cart UI
function updateCartUI() {
  const cartItemsElement = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (!cartItemsElement || !cartTotalElement) return;

  cartItemsElement.innerHTML = "";

  if (cart.length === 0) {
    cartItemsElement.innerHTML = "<p>Your cart is empty</p>";
    cartTotalElement.textContent = "₵0";
    return;
  }

  cart.forEach((item, index) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.className = "cart-item";
    cartItemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.imageUrl}" alt="${item.name}" />
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${item.price}</div>
        <button class="remove-item" data-index="${index}">Remove</button>
      </div>
    `;
    cartItemsElement.appendChild(cartItemElement);
  });

  cartTotalElement.textContent = `₵${cartTotal}`;

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", function () {
      removeFromCart(parseInt(this.getAttribute("data-index")));
    });
  });
}

// Setup checkout button
function setupCheckoutButton() {
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      window.location.href = "checkout.html";
    });
  }
}

// =============================================
// CART TOGGLE FUNCTIONALITY - UPDATED FOR SAFER ELEMENT SELECTION
// =============================================
function initializeCartToggle() {
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCart = document.getElementById("close-cart");
  const cartLink = document.getElementById("cart-link");

  if (cartSidebar && cartOverlay && closeCart && cartLink) {
    cartLink.addEventListener("click", function (e) {
      e.preventDefault();
      cartSidebar.classList.add("open");
      cartOverlay.classList.add("active");
    });

    closeCart.addEventListener("click", function () {
      cartSidebar.classList.remove("open");
      cartOverlay.classList.remove("active");
    });

    cartOverlay.addEventListener("click", function () {
      cartSidebar.classList.remove("open");
      cartOverlay.classList.remove("active");
    });
  }
}

// =============================================
// PRODUCT FUNCTIONALITY
// =============================================
function initializeProductButtons() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".sneaker");
      if (!card) return;

      const name = card.querySelector("h3")?.textContent;
      const price = card.querySelector(".price")?.textContent;
      const imageUrl = card.querySelector("img")?.src;

      if (name && price && imageUrl) {
        addToCart(name, price, imageUrl);

        // Visual feedback
        this.textContent = "Added to Cart!";
        this.style.backgroundColor = "#a27b5c"; // Change to a different color
        setTimeout(() => {
          this.textContent = "Add to Cart";
          this.style.backgroundColor = "#2c3930";
        }, 2000);
      }
    });
  });
}

// =============================================
// PAGE INITIALIZATION - UPDATED FOR MULTI-PAGE SUPPORT
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart from storage
  initializeCart();

  // Initialize cart toggle functionality
  initializeCartToggle();

  // Initialize product buttons if they exist
  initializeProductButtons();

  // Setup checkout button if it exists
  setupCheckoutButton();

  // Initialize doughnut menu if it exists
  initializeDoughnutMenu();
});
