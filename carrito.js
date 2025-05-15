// Datos de los juegos (simulados)
const gamesData = {
    1: { title: "", price: 59.99, description: "", image: "" },
    2: { title: "", price: 49.99, description: "", image: "" },
    3: { title: "", price: 39.99, description: "", image: "" },
    4: { title: "", price: 29.99, description: "", image: "" },
    5: { title: "", price: 19.99, description: "", image: "" },
    6: { title: "", price: 69.99, description: "", image: "" }
};
// Variables del carrito
let cart = [];
let currentGameId = null;
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartButton = document.getElementById('cartButton');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const addToCartBtn = document.getElementById('addToCartBtn');
const gameModal = document.getElementById('gameModal');
const gameTitle = document.getElementById('gameTitle');
const gameDescription = document.getElementById('gameDescription');
const gamePrice = document.getElementById('gamePrice');

// Event listeners
cartButton.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);
clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', checkout);
addToCartBtn.addEventListener('click', addToCart);

// Configurar modal de juego
gameModal.addEventListener('show.bs.modal', function(event) {
    const button = event.relatedTarget;
    currentGameId = button.getAttribute('data-game-id');
    const game = gamesData[currentGameId];
    
    gameTitle.textContent = game.title;
    gameDescription.textContent = game.description;
    gamePrice.textContent = `$${game.price.toFixed(2)}`;
});
function toggleCart() {
    cartSidebar.classList.toggle('show');
    cartOverlay.classList.toggle('show');
    updateCartUI();
}

function addToCart() {
    if (!currentGameId) return;
    
    const game = gamesData[currentGameId];
    const existingItem = cart.find(item => item.id === currentGameId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: currentGameId,
            title: game.title,
            price: game.price,
            image: game.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    alert(`${game.title} ha sido añadido al carrito!`);
    
    // Cerrar el modal después de agregar al carrito
    const modal = bootstrap.Modal.getInstance(gameModal);
    modal.hide();
}

function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    updateCartUI();
}

function updateCartUI() {
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar lista de items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x mb-3" style="color: var(--secondary-color);"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item d-flex align-items-center mb-3 p-3 bg-dark rounded">
            <img src="${item.image}" class="cart-item-img me-3" alt="${item.title}">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.title}</h6>
                <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</small>
            </div>
            <div class="d-flex flex-column align-items-center">
                <h6 class="mb-2">$${(item.price * item.quantity).toFixed(2)}</h6>
                <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-item')) {
        const gameId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
        removeFromCart(gameId);
    }
    });
    // Actualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        updateCartUI();
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    alert('Orden confirmada! Gracias por tu compra.');
    cart = [];
    updateCartUI();
    toggleCart();
}

// Hacer las funciones accesibles globalmente para los botones en el HTML
window.removeFromCart = function(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    updateCartUI();
};