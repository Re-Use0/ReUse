// Variáveis globais
let allProducts = [];
let allInstitutions = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Função para carregar estado dos favoritos
function loadFavoritesState() {
    const favoriteIcons = document.querySelectorAll('.product-info .favorite-icon');
    
    favoriteIcons.forEach(icon => {
        const productId = icon.getAttribute('data-id');
        
        if (favorites.includes(productId)) {
            icon.classList.add('active');
            icon.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            icon.classList.remove('active');
            icon.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Função auxiliar para mostrar notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    // Configurar dados de pesquisa
    function setupSearchData() {
        allProducts = [
            { 
                id: 1,
                name: 'Camiseta Polo', 
                category: 'Masculino',
                price: 'R$ 39,90',
                dateAdded: new Date('2025-01-15')
            },
            { 
                id: 2,
                name: 'Liquidificador Philips', 
                category: 'Casa/Cozinha',
                price: 'R$ 89,90',
                dateAdded: new Date('2025-02-20')
            },
            { 
                id: 3,
                name: 'Tênis Nike', 
                category: 'Esportivo',
                price: 'R$ 199,99',
                dateAdded: new Date('2025-03-10')
            },
            { 
                id: 4,
                name: 'Vestido Floral', 
                category: 'Feminino',
                price: 'R$ 65,00',
                dateAdded: new Date('2025-04-05')
            }
        ];
    }

    // Função para aplicar filtros (simplificada)
    function applyFilters(searchTerm, filterValue) {
        let matchedProducts = [...allProducts];
        let matchedInstitutions = [...allInstitutions];

        // Aplicar termo de pesquisa se existir
        if (searchTerm && searchTerm.length > 0) {
            const term = searchTerm.toLowerCase();
            matchedProducts = matchedProducts.filter(item => 
                item.name.toLowerCase().includes(term) || 
                item.category.toLowerCase().includes(term)
            );
        }

        return { matchedProducts, matchedInstitutions };
    }

    // Função para configurar a barra de pesquisa
    function setupSearchBar() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        // Criar elemento de sugestões se não existir
        const searchContainer = document.querySelector('.search-input');
        if (searchContainer && !document.getElementById('searchSuggestions')) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'searchSuggestions';
            suggestionsDiv.className = 'search-suggestions-container';
            suggestionsDiv.style.display = 'none';
            searchContainer.appendChild(suggestionsDiv);
        }

        // Evento de input na barra de pesquisa
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            
            if (searchTerm.length === 0) {
                document.getElementById('searchSuggestions').style.display = 'none';
                return;
            }

            const { matchedProducts } = applyFilters(searchTerm, '');
            displaySuggestions(matchedProducts);
        });

        // Função para exibir sugestões
        function displaySuggestions(products) {
            const searchSuggestions = document.getElementById('searchSuggestions');
            if (!searchSuggestions) return;
            
            if (products.length === 0) {
                searchSuggestions.style.display = 'none';
                return;
            }

            searchSuggestions.innerHTML = '';
            
            if (products.length > 0) {
                const productsHeader = document.createElement('div');
                productsHeader.className = 'search-suggestion-header';
                productsHeader.textContent = 'Produtos Populares';
                searchSuggestions.appendChild(productsHeader);

                products.slice(0, 5).forEach(product => {
                    const suggestion = createSuggestionElement(product.name, product.category, 'product', product.id);
                    searchSuggestions.appendChild(suggestion);
                });
            }

            searchSuggestions.style.display = 'block';
        }

        function createSuggestionElement(name, category, type, id) {
            const suggestion = document.createElement('div');
            suggestion.className = 'search-suggestion';
            suggestion.dataset.type = type;
            suggestion.dataset.id = id;
            
            const nameElement = document.createElement('div');
            nameElement.textContent = name;
            nameElement.style.fontWeight = '500';
            
            const categoryElement = document.createElement('div');
            categoryElement.textContent = category;
            categoryElement.style.fontSize = '12px';
            categoryElement.style.color = '#666';
            
            suggestion.appendChild(nameElement);
            suggestion.appendChild(categoryElement);
            
            suggestion.addEventListener('mousedown', function(e) {
                e.preventDefault();
                searchInput.value = name;
                const suggestions = document.getElementById('searchSuggestions');
                if (suggestions) {
                    suggestions.style.display = 'none';
                }
                redirectToItem(type, id);
            });
            
            return suggestion;
        }

        // Função para redirecionar
        function redirectToItem(type, id) {
            if (type === 'product') {
                window.location.href = 'produto.html?id=' + id;
            }
        }

        // Configurar eventos de pesquisa
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    const { matchedProducts } = applyFilters(searchTerm, '');
                    if (matchedProducts.length > 0) {
                        redirectToItem('product', matchedProducts[0].id);
                    } else {
                        alert('Nenhum resultado encontrado.');
                    }
                }
            });
        }

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Função para alternar favoritos
    function setupFavoriteIcons() {
        const favoriteIcons = document.querySelectorAll('.product-info .favorite-icon');

        favoriteIcons.forEach(icon => {
            const productId = icon.getAttribute('data-id');
            
            // Verificar se o produto já está nos favoritos
            if (favorites.includes(productId)) {
                icon.classList.add('active');
                icon.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                icon.innerHTML = '<i class="far fa-heart"></i>';
            }

            icon.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                const productId = this.getAttribute('data-id');
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.product-name').textContent;

                this.classList.toggle('active');

                if (this.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-heart"></i>';
                    if (!favorites.includes(productId)) {
                        favorites.push(productId);
                        localStorage.setItem('favorites', JSON.stringify(favorites));
                        showNotification('Produto adicionado aos favoritos!');
                    }
                } else {
                    this.innerHTML = '<i class="far fa-heart"></i>';
                    favorites = favorites.filter(id => id !== productId);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    showNotification('Produto removido dos favoritos!');
                }
            });
        });
    }

    // Função para atualizar o contador do carrinho
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
    }

    // Configurar redirecionamento para cards de produtos
    function setupProductCardRedirects() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('a') || e.target.closest('.favorite-icon')) {
                    return;
                }
                
                const productId = this.getAttribute('data-id');
                window.location.href = 'produto.html?id=' + productId;
            });
        });
    }

    // Inicialização
    setupSearchData();
    setupFavoriteIcons();
    setupSearchBar();
    setupProductCardRedirects();
    updateCartCount();
    loadFavoritesState();

    // Debug
    console.log('Favoritos carregados:', favorites);
    console.log('Ícones de favoritos encontrados:', document.querySelectorAll('.favorite-icon').length);
});