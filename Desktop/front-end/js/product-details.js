// product-details.js - Final Optimized Version with Proper Cart Total Calculation
document.addEventListener("DOMContentLoaded", function() {
    // Initialize all modules
    initCartSystem();
    initImageGallery();
    initSizeSelection();
    setupAddToCart();
    initDoughnutMenu();
});

/* ==================== CART SYSTEM ==================== */
function initCartSystem() {
    // cart link behavior
    const cartLink = document.getElementById("cart-link");
    if (cartLink) {
        cartLink.addEventListener("click", function(e) {
            e.preventDefault();
            toggleCartSidebar();
        });
    }
    

    // Add this checkout button setup
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            window.location.href = "checkout.html";
        });
    }

    // cart sidebar setup
    if (document.getElementById("cart-sidebar")) {
        setupCartSidebar();
    }
    
    // Initialize cart UI
    updateCartCount();
    updateCartUI();
}

function setupCartSidebar() {
    const closeBtn = document.getElementById("close-cart");
    const overlay = document.getElementById("cart-overlay");
    
    if (closeBtn) {
        closeBtn.addEventListener("click", toggleCartSidebar);
    }
    
    if (overlay) {
        overlay.addEventListener("click", toggleCartSidebar);
    }
}

function toggleCartSidebar() {
    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-overlay");
    
    if (sidebar) sidebar.classList.toggle("open");
    if (overlay) overlay.classList.toggle("active");
}

function updateCartCount() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const countElement = document.querySelector(".cart-count");
    const cartLink = document.getElementById("cart-link");
    
    if (cartLink) {
        if (cart.length > 0) {
            if (!countElement) {
                const countBadge = document.createElement("span");
                countBadge.className = "cart-count";
                cartLink.appendChild(countBadge);
            }
            document.querySelector(".cart-count").textContent = cart.length;
        } else if (countElement) {
            countElement.remove();
        }
    }
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    if (!cartItemsContainer || !cartTotalElement) return;
    
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = cart.length ? "" : "<p>Your cart is empty</p>";
    
    let total = 0;
    
    cart.forEach((item, index) => {
        // Sum the numeric prices
        total += item.price || 0;
        
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.imageUrl}" alt="${item.name}" />
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.formattedPrice || "₵0"}</div>
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Format total with currency symbol
    cartTotalElement.textContent = `₵${total.toFixed(2)}`;
    
    // Handle remove item buttons
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function() {
            removeFromCart(parseInt(this.getAttribute("data-index")));
        });
    });
}

/* ==================== PRODUCT FEATURES ==================== */
function initImageGallery() {
    const mainImage = document.getElementById("main-product-image");
    const thumbnails = document.querySelectorAll(".thumbnail");
    
    if (mainImage && thumbnails.length) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener("click", function() {
                mainImage.src = this.src;
                mainImage.alt = this.alt;
                document.querySelector(".thumbnail.active")?.classList.remove("active");
                this.classList.add("active");
            });
        });
    }
}

function initSizeSelection() {
    document.querySelectorAll(".size-option").forEach(option => {
        option.addEventListener("click", function() {
            document.querySelector(".size-option.active")?.classList.remove("active");
            this.classList.add("active");
        });
    });
}

function setupAddToCart() {
    const addToCartBtn = document.getElementById("add-to-cart-details");
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener("click", function() {
        const productData = {
            name: document.querySelector(".product-info h2")?.textContent || "Unknown Product",
            price: document.querySelector(".product-price")?.textContent || "₵0",
            imageUrl: document.getElementById("main-product-image")?.src || "",
        };
        
        addToCart(
            productData.name, 
            productData.price, 
            productData.imageUrl
        );
        
        showAddToCartFeedback(this);
    });
}

/* ==================== SHARED FUNCTIONS ==================== */
function addToCart(name, price, imageUrl) {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  
  // Extract numeric price consistently
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  
  cart.push({ 
    name, 
    price: numericPrice,      // Store as number for calculations
    formattedPrice: price,    // Keep original formatted price for display
    imageUrl 
  });
  
  sessionStorage.setItem("cart", JSON.stringify(cart));
  
  // Calculate and store total
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);
  sessionStorage.setItem("cartTotal", cartTotal.toString());
  
  updateCartCount();
  updateCartUI();
}

function removeFromCart(index) {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        updateCartUI();
    }
}

function showAddToCartFeedback(button) {
    const original = {
        text: button.textContent,
        bgColor: button.style.backgroundColor
    };
    
    button.textContent = "Added to Cart!";
    button.style.backgroundColor = "#a27b5c"; // Change to a different color
    
    setTimeout(() => {
        button.textContent = original.text;
        button.style.backgroundColor = original.bgColor;
    }, 2000);
}

// Initialize the doughnut menu functionality
function initDoughnutMenu() {
    const doughnutToggle = document.getElementById("doughnut-toggle");
    const doughnutMenu = document.querySelector(".doughnut-menu");
    
    if (doughnutToggle && doughnutMenu) {
        doughnutToggle.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            doughnutMenu.classList.toggle("active");
        });
        
        document.addEventListener("click", function(e) {
            if (!doughnutMenu.contains(e.target)) {
                doughnutMenu.classList.remove("active");
            }
        });
    }
}