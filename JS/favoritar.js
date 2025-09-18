
// Função para favoritar produtos
function setupFavorites() {
    // Carregar favoritos do localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Atualizar ícones com base nos favoritos existentes
    document.querySelectorAll('.favorite-btn, .favorite-btn-bottom').forEach(btn => {
        const productId = btn.getAttribute('data-id');
        if (favorites.includes(productId)) {
            btn.classList.add('active');
            btn.querySelector('i').classList.remove('bi-heart');
            btn.querySelector('i').classList.add('bi-heart-fill');
        }
    });
    
    // Adicionar event listeners para os botões de favoritar
    document.querySelectorAll('.favorite-btn, .favorite-btn-bottom').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-id');
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            // Verificar se o produto já está favoritado
            const index = favorites.indexOf(productId);
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Remover dos favoritos
                favorites.splice(index, 1);
                this.classList.remove('active');
                this.querySelector('i').classList.remove('bi-heart-fill');
                this.querySelector('i').classList.add('bi-heart');
                
                // Atualizar todos os botões para este produto
                document.querySelectorAll(`[data-id="${productId}"]`).forEach(btn => {
                    btn.classList.remove('active');
                    btn.querySelector('i').classList.remove('bi-heart-fill');
                    btn.querySelector('i').classList.add('bi-heart');
                });
            } else {
                // Adicionar aos favoritos
                favorites.push(productId);
                this.classList.add('active');
                this.querySelector('i').classList.remove('bi-heart');
                this.querySelector('i').classList.add('bi-heart-fill');
                
                // Atualizar todos os botões para este produto
                document.querySelectorAll(`[data-id="${productId}"]`).forEach(btn => {
                    btn.classList.add('active');
                    btn.querySelector('i').classList.remove('bi-heart');
                    btn.querySelector('i').classList.add('bi-heart-fill');
                });
            }
            
            // Salvar no localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
            
            // Mostrar feedback visual
            showFavoriteFeedback(!isActive);
        });
    });
}

// Função para mostrar feedback visual ao favoritar
function showFavoriteFeedback(isAdded) {
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
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', setupFavorites);
