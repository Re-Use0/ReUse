// Função principal para configurar o sistema de favoritos
function setupFavorites() {
    // Carregar favoritos do localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Atualizar ícones com base nos favoritos existentes
    updateFavoriteIcons(favorites);
    
    // Usar event delegation para evitar múltiplos listeners
    document.addEventListener('click', function(e) {
        // Verificar se o clique foi em um botão de favorito
        const favoriteBtn = e.target.closest('.favorite-btn, .favorite-btn-bottom');
        if (favoriteBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = favoriteBtn.getAttribute('data-id');
            handleFavoriteClick(productId, favoriteBtn, favorites);
        }
    });
}

// Função para atualizar os ícones de favorito
function updateFavoriteIcons(favorites) {
    document.querySelectorAll('.favorite-btn, .favorite-btn-bottom').forEach(btn => {
        const productId = btn.getAttribute('data-id');
        if (favorites.includes(productId)) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
            }
        } else {
            btn.classList.remove('active');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
            }
        }
    });
}

// Função para lidar com o clique no botão de favorito
function handleFavoriteClick(productId, button, favorites) {
    // Verificar se o produto já está favoritado
    const index = favorites.indexOf(productId);
    const isActive = favorites.includes(productId);
    
    if (isActive) {
        // Remover dos favoritos
        favorites.splice(index, 1);
        // Atualizar todos os botões para este produto
        document.querySelectorAll(`[data-id="${productId}"]`).forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
            }
        });
    } else {
        // Adicionar aos favoritos
        favorites.push(productId);
        // Atualizar todos os botões para este produto
        document.querySelectorAll(`[data-id="${productId}"]`).forEach(btn => {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
            }
        });
    }
    
    // Salvar no localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Mostrar feedback visual
    showFavoriteFeedback(!isActive);
}

// Função para mostrar feedback visual ao favoritar
function showFavoriteFeedback(isAdded) {
    // Remover feedback existente, se houver
    const existingFeedback = document.querySelector('.favorite-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = `favorite-feedback ${isAdded ? 'added' : 'removed'}`;
    feedback.innerHTML = `
        <i class="bi ${isAdded ? 'bi-heart-fill' : 'bi-heart'}"></i>
        <span>Produto ${isAdded ? 'adicionado aos' : 'removido dos'} favoritos</span>
    `;
    
    // Estilos para o feedback
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${isAdded ? '#4CAF50' : '#e74c3c'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Remover após 3 segundos
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
    
    .favorite-btn, .favorite-btn-bottom {
        cursor: pointer;
        transition: color 0.2s;
    }
    
    .favorite-btn.active, .favorite-btn-bottom.active {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', setupFavorites);