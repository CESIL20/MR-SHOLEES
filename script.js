// Render menu items
function renderMenu(category) {
    const items = menuData[category];
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="menu-item-emoji">${item.emoji}</div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="menu-item-desc">${item.desc}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">S/ ${item.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}// Menu data
const menuData = {
    populares: [
        { id: 1, name: 'Charsiu', desc: 'Chaufa con panceta de cerdo', price: 28, img: 'charsiu.jpg', emoji: '🍜' },
        { id: 2, name: 'Encurtidos', desc: 'Vinagre, sal y especias selectas', price: 25, img: 'encurtidos.jpg', emoji: '🍚' },
        { id: 3, name: 'Pollo Chi Jau Kay', desc: 'Pollo crocante con salsa especial', price: 32, img: 'frejolito.jpg', emoji: '🍗' },
        { id: 4, name: 'Wantan Frito', desc: 'Con salsa tamarindo', price: 22, img: 'wantan.jpg', emoji: '🥟' }
    ],
    tallarines: [
        { id: 5, name: 'Tallarín Saltado', desc: 'Con pollo o carne', price: 24, img: 'tallarin.jpg', emoji: '🍝' },
        { id: 6, name: 'Tallarín con Pollo', desc: 'En salsa de ostión', price: 26, img: 'tallarin.jpg', emoji: '🍜' },
        { id: 7, name: 'Tallarín Especial', desc: 'Combinado de carnes', price: 28, img: 'saltado.jpg', emoji: '🍝' }
    ],
    arroz: [
        { id: 8, name: 'Chaufa de Carne', desc: 'Clásico chaufa peruano', price: 22, img: 'chaufa.jpg', emoji: '🍚' },
        { id: 9, name: 'Chaufa Especial', desc: 'Con charsiu, tallarin salteado y watan', price: 30, img: 'chaufaespecial.jpg', emoji: '🦐' },
        { id: 10, name: 'Chaufa de Champiñones', desc: 'Con champiñones salteados', price: 20, img: 'chaufachampiñones.jpg', emoji: '🥬' }
    ],
    bebidas: [
        { id: 11, name: 'Cerveza Oro Liquido', desc: '330ml', price: 20, img: 'oro.jpg', emoji: '🥤' },
        { id: 12, name: 'Cerveza La Pelirroja', desc: '375ml', price: 35, img: 'pelirroja.jpg', emoji: '🥤' },
        { id: 13, name: 'Pisco Cholo Number Guan', desc: '750ml', price: 180, img: 'pisco.jpg', emoji: '🍋' }
    ]
};

// Cart state
let cart = [];
let activeCategory = 'populares';

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const categoryButtons = document.querySelectorAll('.category-btn');
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const totalAmount = document.getElementById('totalAmount');
const cartBadge = document.getElementById('cartBadge');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMenu(activeCategory);
    setupEventListeners();
    
    // Setup checkout button
    const checkoutButton = document.getElementById('checkoutBtn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', sendWhatsAppOrder);
    }
});

// Setup event listeners
function setupEventListeners() {
    // Category filter
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            renderMenu(activeCategory);
        });
    });

    // Cart toggle
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    });
}

// Render menu items
function renderMenu(category) {
    const items = menuData[category];
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="menu-item-image">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="menu-item-desc">${item.desc}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">S/ ${item.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(itemId) {
    // Find item in menu data
    let item = null;
    for (const category in menuData) {
        const found = menuData[category].find(i => i.id === itemId);
        if (found) {
            item = found;
            break;
        }
    }

    if (!item) return;

    // Check if item already in cart
    const existingItem = cart.find(c => c.id === itemId);
    
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCart();
}

// Remove from cart
function removeFromCart(itemId) {
    const existingItem = cart.find(c => c.id === itemId);
    
    if (existingItem) {
        if (existingItem.qty === 1) {
            cart = cart.filter(c => c.id !== itemId);
        } else {
            existingItem.qty--;
        }
    }

    updateCart();
}

// Delete item from cart
function deleteFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    updateCart();
}

// Update cart display
function updateCart() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    // Update cart button
    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
    cartBadge.textContent = totalItems;
    
    if (totalItems > 0) {
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }

    // Update cart sidebar
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        document.getElementById('cartFooter').style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-name">${item.name}</span>
                    <div class="cart-item-header-right">
                        <span class="cart-item-price">S/ ${(item.price * item.qty).toFixed(2)}</span>
                        <button class="delete-btn" onclick="deleteFromCart(${item.id})" title="Eliminar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="removeFromCart(${item.id})">-</button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="qty-btn" onclick="addToCart(${item.id})">+</button>
                </div>
            </div>
        `).join('');
        
        document.getElementById('cartFooter').style.display = 'block';
        totalAmount.textContent = `S/ ${total.toFixed(2)}`;
    }
}

// Send order to WhatsApp
function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const phoneNumber = '51934075551'; // Número de MR SHOLEES
    
    // Construir mensaje
    let message = '🥢 *PEDIDO - MR SHOLEES*\n\n';
    
    cart.forEach(item => {
        message += `*${item.name}*\n`;
        message += `Cantidad: ${item.qty}\n`;
        message += `Precio: S/ ${item.price} c/u\n`;
        message += `Subtotal: S/ ${(item.price * item.qty).toFixed(2)}\n`;
        message += `--------------------\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    message += `\n*TOTAL: S/ ${total.toFixed(2)}*`;
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    console.log('Abriendo WhatsApp con el pedido...');
}