// Global Variables
let currentUser = null;
let cart = [];
let allProducts = [];
let supabaseClient = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase if available
    if (typeof window.supabase !== 'undefined') {
        const { createClient } = window.supabase;
        const SUPABASE_URL = 'https://mrqdytkzlwlnpznsopxe.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_zGgTrafDIxkwbZOS0U1jQg_geF2vlva';
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    
    loadProducts();
    checkAuthStatus();
    setupEventListeners();
    loadCartFromLocalStorage();
});

// Setup Event Listeners
function setupEventListeners() {
    // Auth Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Auth Button
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (currentUser) {
                logout();
            } else {
                openAuthModal();
            }
        });
    }

    // Cart Icon
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) cartIcon.addEventListener('click', openCartModal);
}

// Load Products
async function loadProducts() {
    try {
        let data = [];
        
        // Try to load from Supabase
        if (supabaseClient) {
            try {
                const { data: products, error } = await supabaseClient
                    .from('products')
                    .select('*');
                
                if (!error && products) {
                    data = products;
                }
            } catch (e) {
                console.log('Using fallback products...');
            }
        }
        
        // Use default products if no data from Supabase
        if (data.length === 0) {
            data = [
                {
                    id: 1,
                    name: 'Classic T-Shirt',
                    category: 'Tops',
                    price: 499,
                    image: 'https://via.placeholder.com/300x300?text=T-Shirt',
                    description: 'Comfortable and stylish classic t-shirt made from 100% cotton. Perfect for everyday wear.'
                },
                {
                    id: 2,
                    name: 'Denim Jeans',
                    category: 'Bottoms',
                    price: 1299,
                    image: 'https://via.placeholder.com/300x300?text=Jeans',
                    description: 'High-quality denim jeans with a perfect fit. Available in multiple sizes and colors.'
                },
                {
                    id: 3,
                    name: 'Summer Dress',
                    category: 'Dresses',
                    price: 899,
                    image: 'https://via.placeholder.com/300x300?text=Dress',
                    description: 'Light and airy summer dress perfect for warm weather. Easy to style and versatile.'
                },
                {
                    id: 4,
                    name: 'Casual Jacket',
                    category: 'Outerwear',
                    price: 1599,
                    image: 'https://via.placeholder.com/300x300?text=Jacket',
                    description: 'Stylish casual jacket that goes with almost any outfit. Comfortable and durable.'
                },
                {
                    id: 5,
                    name: 'White Sneakers',
                    category: 'Shoes',
                    price: 2499,
                    image: 'https://via.placeholder.com/300x300?text=Sneakers',
                    description: 'Premium white sneakers perfect for casual wear. Comfortable and long-lasting.'
                },
                {
                    id: 6,
                    name: 'Polo Shirt',
                    category: 'Tops',
                    price: 699,
                    image: 'https://via.placeholder.com/300x300?text=Polo',
                    description: 'Classic polo shirt in various colors. Perfect for both casual and semi-formal occasions.'
                }
            ];
        }
        
        allProducts = data;
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        displayProducts([
            {
                id: 1,
                name: 'Classic T-Shirt',
                category: 'Tops',
                price: 499,
                image: 'https://via.placeholder.com/300x300?text=T-Shirt',
                description: 'Comfortable and stylish classic t-shirt made from 100% cotton. Perfect for everyday wear.'
            },
            {
                id: 2,
                name: 'Denim Jeans',
                category: 'Bottoms',
                price: 1299,
                image: 'https://via.placeholder.com/300x300?text=Jeans',
                description: 'High-quality denim jeans with a perfect fit. Available in multiple sizes and colors.'
            },
            {
                id: 3,
                name: 'Summer Dress',
                category: 'Dresses',
                price: 899,
                image: 'https://via.placeholder.com/300x300?text=Dress',
                description: 'Light and airy summer dress perfect for warm weather. Easy to style and versatile.'
            },
            {
                id: 4,
                name: 'Casual Jacket',
                category: 'Outerwear',
                price: 1599,
                image: 'https://via.placeholder.com/300x300?text=Jacket',
                description: 'Stylish casual jacket that goes with almost any outfit. Comfortable and durable.'
            },
            {
                id: 5,
                name: 'White Sneakers',
                category: 'Shoes',
                price: 2499,
                image: 'https://via.placeholder.com/300x300?text=Sneakers',
                description: 'Premium white sneakers perfect for casual wear. Comfortable and long-lasting.'
            },
            {
                id: 6,
                name: 'Polo Shirt',
                category: 'Tops',
                price: 699,
                image: 'https://via.placeholder.com/300x300?text=Polo',
                description: 'Classic polo shirt in various colors. Perfect for both casual and semi-formal occasions.'
            }
        ]);
    }
}

// Display Products
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">₹${product.price}</p>
                <div class="product-buttons">
                    <button class="view-btn" onclick="viewProduct(${product.id})">View Details</button>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// View Product Details
function viewProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const productDetails = document.getElementById('productDetails');
    if (!productDetails) return;
    
    productDetails.innerHTML = `
        <div class="product-details">
            <img src="${product.image}" alt="${product.name}" class="product-details-image">
            <div class="product-details-info">
                <h2>${product.name}</h2>
                <p class="product-details-category">${product.category}</p>
                <p class="product-details-price">₹${product.price}</p>
                <p class="product-details-description">${product.description}</p>
                <div class="quantity-selector">
                    <button onclick="decreaseQuantity()">−</button>
                    <input type="number" id="productQuantity" value="1" min="1">
                    <button onclick="increaseQuantity()">+</button>
                </div>
                <button class="add-to-cart-modal-btn" onclick="addToCartFromModal(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
    
    openProductModal();
}

// Quantity Controls
function increaseQuantity() {
    const input = document.getElementById('productQuantity');
    if (input) input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('productQuantity');
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to Cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToLocalStorage();
    updateCartCount();
    showNotification('Product added to cart!');
}

// Add to Cart from Product Modal
function addToCartFromModal(productId) {
    const quantityInput = document.getElementById('productQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCartToLocalStorage();
    updateCartCount();
    closeProductModal();
    showNotification('Product added to cart!');
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Save Cart to LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartCount();
        } catch (e) {
            console.error('Error loading cart:', e);
        }
    }
}

// Display Cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateCartQuantity(${index}, -1)">−</button>
                <input type="number" value="${item.quantity}" readonly>
                <button onclick="updateCartQuantity(${index}, 1)">+</button>
            </div>
            <div class="cart-item-price">₹${itemTotal}</div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total;
}

// Update Cart Quantity
function updateCartQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            saveCartToLocalStorage();
            updateCartCount();
            displayCart();
        }
    }
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    updateCartCount();
    displayCart();
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');
    
    if (!supabaseClient) {
        if (loginError) loginError.textContent = 'Supabase not configured';
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            if (loginError) loginError.textContent = error.message;
            return;
        }
        
        currentUser = data.user;
        closeAuthModal();
        updateAuthButton();
        showNotification('Login successful!');
    } catch (error) {
        if (loginError) loginError.textContent = error.message;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;
    const registerError = document.getElementById('registerError');
    
    if (password !== confirmPassword) {
        if (registerError) registerError.textContent = 'Passwords do not match';
        return;
    }
    
    if (!supabaseClient) {
        if (registerError) registerError.textContent = 'Supabase not configured';
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) {
            if (registerError) registerError.textContent = error.message;
            return;
        }
        
        if (registerError) {
            registerError.textContent = '';
            registerError.style.color = '#10b981';
            registerError.textContent = 'Registration successful! Please check your email.';
        }
        
        setTimeout(() => {
            switchAuthTab('login');
        }, 2000);
    } catch (error) {
        if (registerError) registerError.textContent = error.message;
    }
}

async function checkAuthStatus() {
    if (!supabaseClient) return;
    
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            currentUser = user;
            updateAuthButton();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

async function logout() {
    if (!supabaseClient) return;
    
    try {
        await supabaseClient.auth.signOut();
        currentUser = null;
        updateAuthButton();
        showNotification('Logged out successfully!');
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (!authBtn) return;
    
    if (currentUser) {
        authBtn.textContent = 'Logout';
    } else {
        authBtn.textContent = 'Login';
    }
}

// Modal Functions
function openAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.add('active');
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (!authModal) return;
    
    authModal.classList.remove('active');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    if (loginError) loginError.textContent = '';
    if (registerError) registerError.textContent = '';
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    const tabElement = event.target;
    if (tabElement) tabElement.classList.add('active');
    
    const formElement = document.getElementById(tab + 'Form');
    if (formElement) formElement.classList.add('active');
}

function openProductModal() {
    const productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.add('active');
}

function closeProductModal() {
    const productModal = document.getElementById('productModal');
    if (productModal) productModal.classList.remove('active');
}

function openCartModal() {
    displayCart();
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.classList.add('active');
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) cartModal.classList.remove('active');
}

function proceedToCheckout() {
    if (!currentUser) {
        showNotification('Please login first!');
        closeCartModal();
        openAuthModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    closeCartModal();
    openCheckoutModal();
}

function openCheckoutModal() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    const checkoutEmail = document.getElementById('checkoutEmail');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (!orderItems || !orderTotal || !checkoutModal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    orderItems.textContent = totalItems;
    orderTotal.textContent = totalAmount;
    
    // Pre-fill email if user is logged in
    if (currentUser && checkoutEmail) {
        checkoutEmail.value = currentUser.email;
    }
    
    checkoutModal.classList.add('active');
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.classList.remove('active');
}

// Utility Functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideUp 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const authModal = document.getElementById('authModal');
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (e.target === authModal) closeAuthModal();
    if (e.target === productModal) closeProductModal();
    if (e.target === cartModal) closeCartModal();
    if (e.target === checkoutModal) closeCheckoutModal();
});