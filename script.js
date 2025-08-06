

// Sample product data
const products = [
    {
        id: 1,
        title: "Wireless Headphones",
        price: 99.99,
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        title: "Smart Watch",
        price: 249.99,
        description: "Advanced fitness tracking smartwatch with heart rate monitor",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        title: "Laptop Stand",
        price: 49.99,
        description: "Ergonomic aluminum laptop stand for better posture",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        title: "Wireless Mouse",
        price: 29.99,
        description: "Ergonomic wireless mouse with precision tracking",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        title: "USB-C Hub",
        price: 39.99,
        description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
        image: "https://images.unsplash.com/photo-1593642632823-8f7856ed8cad?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        title: "Mechanical Keyboard",
        price: 129.99,
        description: "RGB backlit mechanical keyboard with blue switches",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop"
    }
];

// Shopping cart
let cart = [];
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const userBtn = document.getElementById('userBtn');
const cartModal = document.getElementById('cartModal');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    checkLoginStatus();
});

// Load products into the grid
function loadProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartDisplay();
    showNotification(`${product.title} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Cart modal
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
    
    // User authentication
    userBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            logout();
        } else {
            openLogin();
        }
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            answer.classList.toggle('active');
            question.querySelector('i').classList.toggle('fa-chevron-up');
            question.querySelector('i').classList.toggle('fa-chevron-down');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Cart functions
function openCart() {
    updateCartDisplay();
    cartModal.style.display = 'block';
}

function closeCart() {
    cartModal.style.display = 'none';
}

// Authentication functions
function openLogin() {
    closeAllModals();
    loginModal.style.display = 'block';
}

function openRegister() {
    closeAllModals();
    registerModal.style.display = 'block';
}

function showLogin() {
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
}

function showRegister() {
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
}

function closeAllModals() {
    cartModal.style.display = 'none';
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in real app, this would be an API call)
    if (email && password) {
        // Simulate successful login
        isLoggedIn = true;
        currentUser = { email: email };
        
        // Update UI
        userBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        closeAllModals();
        showNotification('Successfully logged in!');
        
        // Clear form
        document.getElementById('loginForm').reset();
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (name && email && password) {
        // Simulate successful registration
        isLoggedIn = true;
        currentUser = { name: name, email: email };
        
        // Update UI
        userBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        closeAllModals();
        showNotification('Account created successfully!');
        
        // Clear form
        document.getElementById('registerForm').reset();
    }
}

// Logout function
function logout() {
    isLoggedIn = false;
    currentUser = null;
    userBtn.innerHTML = '<i class="fas fa-user"></i>';
    showNotification('Logged out successfully');
}

// Check login status (would check with backend in real app)
function checkLoginStatus() {
    // Simulate checking if user is logged in
    // In real app, this would check localStorage or make API call
}

// Checkout function
function checkout() {
    if (!isLoggedIn) {
        closeCart();
        openLogin();
        showNotification('Please log in to checkout');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Simulate checkout process
    showNotification('Processing your order...');
    
    // In real app, this would integrate with payment gateway
    setTimeout(() => {
        cart = [];
        updateCartDisplay();
        closeCart();
        showNotification('Order placed successfully! You will receive a confirmation email.');
    }, 2000);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#10b981';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .cart-item-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cart-item-actions button {
        padding: 0.25rem 0.5rem;
        border: 1px solid #d1d5db;
        background: white;
        cursor: pointer;
        border-radius: 4px;
    }
    
    .cart-item-actions button:hover {
        background: #f3f4f6;
    }
`;
document.head.appendChild(style);

// Search functionality (placeholder)
document.getElementById('searchBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Search feature coming soon!');
});

