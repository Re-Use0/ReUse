document.addEventListener('DOMContentLoaded', function () {
    // Carrega os favoritos do localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Elementos da página
    const emptyFavoritesDiv = document.querySelector('.empty-favorites');
    const favoritesGrid = document.querySelector('.favorites-grid');
    
    // Verifica se há favoritos
    if (favorites.length > 0) {
        // Esconde a mensagem de lista vazia
        if (emptyFavoritesDiv) emptyFavoritesDiv.style.display = 'none';
        
        // Mostra o grid de favoritos
        if (favoritesGrid) {
            favoritesGrid.style.display = 'grid';
            favoritesGrid.innerHTML = ''; // Limpa o grid existente
        }
        
        // Adiciona cada favorito ao grid
        favorites.forEach(productId => {
            const favoriteItem = createFavoriteItem(productId);
            if (favoriteItem && favoritesGrid) {
                favoritesGrid.appendChild(favoriteItem);
            }
        });
    } else {
        // Mostra a mensagem de lista vazia
        if (emptyFavoritesDiv) emptyFavoritesDiv.style.display = 'block';
        if (favoritesGrid) favoritesGrid.style.display = 'none';
    }
    
    // Função para criar um item de favorito
    function createFavoriteItem(productId) {
        // Obtém os dados do produto pelo ID
        const productData = getProductDataById(productId);
        
        if (!productData) {
            console.error('Produto não encontrado para ID:', productId);
            return null;
        }
        
        // Cria o elemento do item de favorito
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.dataset.id = productId;
        
        // HTML do item de favorito (usando classes Bootstrap)
        favoriteItem.innerHTML = `
            <div class="favorite-image">
                <img src="${productData.image}" alt="${productData.name}">
                <button class="favorite-btn active" data-id="${productId}" aria-label="Remover dos favoritos">
                    <i class="bi bi-heart-fill"></i>
                </button>
            </div>
            <div class="favorite-info">
                <div class="favorite-name">${productData.name}</div>
                <div class="favorite-price">${productData.price}</div>
                <div class="product-category">${productData.category}</div>
                <div class="favorite-actions">
                    <a href="carrinho.html" class="btn btn-primary btn-small">
                        <i class="bi bi-cart-plus"></i> Adicionar
                    </a>
                    <button class="btn btn-danger btn-small remove-favorite" data-id="${productId}">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                </div>
            </div>
        `;
        
        // Adiciona evento de clique para remover o favorito
        const removeBtn = favoriteItem.querySelector('.remove-favorite');
        removeBtn.addEventListener('click', function() {
            removeFavorite(productId, favoriteItem);
        });
        
        // Adiciona evento de clique para o ícone de coração
        const heartIcon = favoriteItem.querySelector('.favorite-btn');
        heartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            removeFavorite(productId, favoriteItem);
        });
        
        // Adiciona evento de clique na imagem para ir para a página do produto
        const productImage = favoriteItem.querySelector('.favorite-image img');
        productImage.addEventListener('click', function() {
            window.location.href = 'produto.html?id=' + productId;
        });
        
        // Adiciona evento de clique no nome para ir para a página do produto
        const productName = favoriteItem.querySelector('.favorite-name');
        productName.addEventListener('click', function() {
            window.location.href = 'produto.html?id=' + productId;
        });
        
        return favoriteItem;
    }
    
    // Função para remover um favorito
    function removeFavorite(productId, favoriteItem) {
        // Remove do array de favoritos
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(id => id !== productId);
        
        // Atualiza o localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Remove o item da tela
        favoriteItem.remove();
        
        // Atualiza também na página principal usando a função existente
        if (typeof updateMainPageFavorites === 'function') {
            updateMainPageFavorites(productId, false);
        }
        
        // Se não houver mais favoritos, mostra a mensagem de lista vazia
        if (favorites.length === 0) {
            if (emptyFavoritesDiv) emptyFavoritesDiv.style.display = 'block';
            if (favoritesGrid) favoritesGrid.style.display = 'none';
        }
        
        // Mostra feedback de remoção
        showFavoriteFeedback(false);
    }
    
    // Função para mostrar feedback visual (reutilizando a existente)
    function showFavoriteFeedback(isAdded) {
        if (typeof window.showFavoriteFeedback === 'function') {
            window.showFavoriteFeedback(isAdded);
        }
    }
    
    // Função auxiliar para obter dados do produto pelo ID
    function getProductDataById(productId) {
        // Dados dos produtos baseados nos IDs da página principal
        const products = {
            '1': {
                name: 'Camiseta Polo',
                image: 'IMG/camiseta-polo.png',
                price: 'R$ 39,90',
                category: 'Masculino'
            },
            '2': {
                name: 'Liquidificador Philips',
                image: 'IMG/liquidificador-phill.png',
                price: 'R$ 89,90',
                category: 'Casa/Cozinha'
            },
            '3': {
                name: 'Tênis Nike',
                image: 'IMG/tenis-nike.avif',
                price: 'R$ 199,99',
                category: 'Esportivo'
            },
            '4': {
                name: 'Vestido Floral',
                image: 'IMG/vestido-floral.jpg',
                price: 'R$ 65,00',
                category: 'Feminino'
            }
        };
        
        return products[productId] || null;
    }
});