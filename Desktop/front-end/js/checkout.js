// checkout.js - Enhanced Checkout Functionality with Doughnut Menu

document.addEventListener('DOMContentLoaded', function() {
    // Doughnut Menu Functionality
    const doughnutToggle = document.getElementById('doughnut-toggle');
    const doughnutMenu = document.querySelector('.doughnut-menu');
    
    if (doughnutToggle && doughnutMenu) {
        // Toggle menu when button is clicked
        doughnutToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            doughnutMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!doughnutMenu.contains(e.target) && e.target !== doughnutToggle) {
                doughnutMenu.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.doughnut-links a').forEach(link => {
            link.addEventListener('click', function() {
                doughnutMenu.classList.remove('active');
            });
        });
    }

    // Load cart items from sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartTotal = parseFloat(sessionStorage.getItem('cartTotal')) || 0;
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');

    // Display order summary
    orderItems.innerHTML = '';
    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your cart is empty</p>';
        // Redirect to shop page if cart is empty
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>${item.name} (${item.formattedPrice || '₵0'})</span>
            <span>${item.formattedPrice || '₵0'}</span>
    `;
        orderItems.appendChild(itemElement);
    });
    // Display total amount 
    orderTotal.textContent = `₵${cartTotal.toFixed(2)}`;

    // Payment method toggle functionality
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentForms = document.querySelectorAll('.payment-form');

    paymentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            paymentTabs.forEach(t => t.classList.remove('active'));
            paymentForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            const formId = this.getAttribute('data-form');
            document.getElementById(formId).classList.add('active');
        });
    });

    // Form submission handlers
    document.getElementById('mobile-money-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment('mobile-money');
    });

    document.getElementById('credit-card-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment('credit-card');
    });

    // Payment processing function
    function processPayment(method) {
        // Basic form validation
        let isValid = true;
        const form = document.querySelector(`#${method}-form`);
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '#2c3930';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields');
            return;
        }

        // Collect payment data
        const paymentData = {
            method: method,
            items: cart,
            total: cartTotal,
            timestamp: new Date().toISOString()
        };

        if (method === 'mobile-money') {
            paymentData.network = document.getElementById('mm-network').value;
            paymentData.number = document.getElementById('mm-number').value;
            paymentData.name = document.getElementById('mm-name').value;
        } else if (method === 'credit-card') {
            paymentData.cardNumber = document.getElementById('card-number').value;
            paymentData.cardName = document.getElementById('card-name').value;
            paymentData.expiry = document.getElementById('expiry-date').value;
            paymentData.cvv = document.getElementById('cvv').value;
        }

        // In a real app, you would send this to your server here
        console.log('Payment processed:', paymentData);

        // Show success message and clear cart
        alert('Payment successful! Thank you for your purchase.');
        sessionStorage.removeItem('cart');
        sessionStorage.removeItem('cartTotal');
        
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    }
});