// Carrinho.js - Gerenciamento completo do carrinho de compras

// Armazena os itens do carrinho no localStorage
let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Salva o carrinho no localStorage e atualiza o contador
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    updateCartInHeader();
}

/**
 * Atualiza o contador de itens no carrinho (header)
 */
function updateCartCount() {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems > 0 ? totalItems : '';
    });
}

/**
 * Atualiza o ícone do carrinho no header
 */
function updateCartInHeader() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon && cartItems.length > 0) {
        cartIcon.classList.add('has-items');
    } else if (cartIcon) {
        cartIcon.classList.remove('has-items');
    }
}

/**
 * Renderiza os itens do carrinho na página
 */
function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const emptyCartContainer = document.querySelector('.empty-cart-container');
    const fullCartContainer = document.querySelector('.cart-container:not(.empty-cart-container)');
    const itemCountElement = document.querySelector('.item-count');
    const orderSummary = document.querySelector('.cart-summary');
    
    // Verifica se o carrinho está vazio
    if (cartItems.length === 0) {
        if (fullCartContainer) fullCartContainer.style.display = 'none';
        if (emptyCartContainer) emptyCartContainer.style.display = 'block';
        return;
    }
    
    // Mostra o carrinho com itens
    if (fullCartContainer) fullCartContainer.style.display = 'block';
    if (emptyCartContainer) emptyCartContainer.style.display = 'none';
    
    // Limpa os itens atuais
    if (cartContainer) cartContainer.innerHTML = '';
    
    // Calcula subtotal
    let subtotal = 0;
    
    // Adiciona cada item ao carrinho
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item animate__animated animate__fadeIn';
        cartItem.id = `cart-item-${index}`;
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image || 'IMG/default-product.jpg'}" alt="${item.name}" class="product-image">
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description || ''}</div>
                ${item.sku ? `<div class="item-sku">SKU: ${item.sku}</div>` : ''}
            </div>
            <div class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decreaseQuantity(${index})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                           id="quantity-${index}" onchange="updateQuantity(${index}, this.value)">
                    <button class="quantity-btn" onclick="increaseQuantity(${index})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">
                    <i class="fas fa-trash-alt"></i> Remover
                </button>
            </div>
        `;
        if (cartContainer) cartContainer.appendChild(cartItem);
    });

    // Atualiza o contador de itens
    if (itemCountElement) {
        itemCountElement.textContent = `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'}`;
    }

    // Atualiza o resumo do pedido
    if (orderSummary) {
        const shipping = calculateShipping();
        const total = subtotal + shipping;
        
        orderSummary.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="summary-row">
                <span>Frete</span>
                <span>R$ ${shipping.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="summary-row">
                <span>Desconto</span>
                <span>-R$ 0,00</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
            </div>
            <button type="button" class="checkout-btn pulse-animation" 
                onclick="window.location.href='finalizar_compra.html'">
                <i class="fas fa-credit-card"></i> Finalizar Compra
            </button>
        `;
    }
}

/**
 * Calcula o valor do frete
 */
function calculateShipping() {
    // Lógica simples de frete - pode ser substituída por cálculo real
    return cartItems.length > 0 ? 10.00 : 0;
}

/**
 * Aumenta a quantidade de um item
 */
function increaseQuantity(index) {
    if (index >= 0 && index < cartItems.length && cartItems[index].quantity < 10) {
        cartItems[index].quantity++;
        saveCart();
        renderCartItems();
    }
}

/**
 * Diminui a quantidade de um item
 */
function decreaseQuantity(index) {
    if (index >= 0 && index < cartItems.length && cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        saveCart();
        renderCartItems();
    }
}

/**
 * Atualiza a quantidade via input
 */
function updateQuantity(index, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (index >= 0 && index < cartItems.length && !isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= 10) {
        cartItems[index].quantity = newQuantity;
        saveCart();
        renderCartItems();
    } else {
        // Restaura o valor anterior se inválido
        renderCartItems();
    }
}

/**
 * Remove um item do carrinho
 */
function removeItem(index) {
    if (index >= 0 && index < cartItems.length) {
        const itemElement = document.querySelector(`#cart-item-${index}`);
        if (itemElement) {
            itemElement.classList.add('animate__fadeOut');
            
            setTimeout(() => {
                cartItems.splice(index, 1);
                saveCart();
                renderCartItems();
                
                // Mostra mensagem de remoção
                showRemovalMessage('Produto removido do carrinho');
            }, 300);
        }
    }
}

/**
 * Adiciona um produto ao carrinho
 */
/**
 * Mostra mensagem de confirmação
 */
function showConfirmationMessage(message) {
    const container = document.getElementById('cartMessageContainer') || document.body;
    const messageElement = document.createElement('div');
    messageElement.className = 'cart-message';
    messageElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(messageElement);
    
    // Remove a mensagem após a animação
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

/**
 * Adiciona um produto ao carrinho
 */
function addToCart(productName, productPrice, productImage = '', productDescription = '', productSku = '') {
    // Verifica se o produto já está no carrinho
    const existingItemIndex = cartItems.findIndex(item => 
        item.name === productName && item.price === productPrice
    );
    
    if (existingItemIndex !== -1) {
        // Se já existe, aumenta a quantidade (até no máximo 10)
        if (cartItems[existingItemIndex].quantity < 10) {
            cartItems[existingItemIndex].quantity++;
        }
    } else {
        // Se não existe, adiciona novo item
        cartItems.push({
            name: productName,
            price: productPrice,
            image: productImage,
            description: productDescription,
            sku: productSku,
            quantity: 1
        });
    }
    
    saveCart();
    showConfirmationMessage('Produto adicionado ao carrinho!');
    animateCartIcon();
}

/**
 * Mostra mensagem de confirmação
 */
function showConfirmationMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'cart-message animate__animated animate__fadeIn';
    messageElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.classList.add('animate__fadeOut');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 3000);
}

/**
 * Mostra mensagem de remoção
 */
function showRemovalMessage(message) {
    const removalMessage = document.getElementById('removalMessage');
    if (removalMessage) {
        removalMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        removalMessage.classList.add('show');
        
        setTimeout(() => {
            removalMessage.classList.remove('show');
        }, 3000);
    }
}

/**
 * Anima o ícone do carrinho
 */
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('animate');
        setTimeout(() => {
            cartIcon.classList.remove('animate');
        }, 600);
    }
}

/**
 * Volta para a página anterior com animação
 */
function goBack() {
    const notification = document.createElement('div');
    notification.className = 'back-notification animate__animated animate__fadeIn';
    notification.innerHTML = `
        <i class="bi bi-arrow-left"></i>
        <span>Redirecionando para os produtos...</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate__fadeOut');
        setTimeout(() => notification.remove(), 300);
    }, 1500);
    
    setTimeout(() => {
        window.history.back();
    }, 1800);
}

/**
 * Atualiza o carrinho (função genérica)
 */
function updateCart() {
    saveCart();
    renderCartItems();
}

// Inicializa o carrinho quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
    updateCartCount();
    updateCartInHeader();
});

// Permite acesso às funções pelo console do navegador (para debug)
window.cartFunctions = {
    getCart: () => cartItems,
    clearCart: () => {
        cartItems = [];
        saveCart();
        renderCartItems();
    },
    addTestItem: () => addToCart('Produto Teste', 99.99, 'IMG/default-product.jpg', 'Descrição teste', 'TEST123')
};