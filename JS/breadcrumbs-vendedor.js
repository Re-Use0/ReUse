// breadcrumbs-vendedor.js - Rastreamento de Navegação para Vendedores
document.addEventListener('DOMContentLoaded', function() {
    // Configurações específicas para o vendedor
    const config = {
        maxHistory: 15,
        maxBreadcrumbs: 6,
        resetPages: ['vendedor.html'],
        storageKey: 'vendedorBreadcrumbsHistory'
    };

    // Mapeamento de títulos customizados para páginas do vendedor
    const pageTitles = {
        // Páginas principais
        'vendedor.html': 'Painel do Vendedor',
        'Cadastro_Produto.html': 'Cadastrar Produto',
        'Detalhes_Produto.html': () => {
            const title = document.querySelector('.produto-title')?.textContent;
            return title || 'Detalhes do Produto';
        },
        'estatisticas.html': 'Estatísticas de Vendas',
        'avaliacoes.html': 'Avaliações dos Clientes',
        
        // Páginas secundárias
        'PerfilVendedor.html': 'Meu Perfil',
        'Produtos_Cadastrados.html': 'Meus Produtos',
        'Vendas.html': 'Minhas Vendas'
    };

    // Gerenciamento do histórico
    const navigationManager = {
        history: JSON.parse(sessionStorage.getItem(config.storageKey)) || [],
        
        addPage: function(page) {
            // Reseta se for uma página de reset
            if (config.resetPages.includes(page)) {
                this.history = [];
            }
            
            // Não adiciona duplicatas consecutivas
            if (this.history.length > 0 && this.history[this.history.length-1].page === page) {
                return;
            }
            
            this.history.push({
                page: page,
                timestamp: Date.now(),
                url: window.location.href
            });
            
            // Mantém o histórico dentro do limite
            if (this.history.length > config.maxHistory) {
                this.history.shift();
            }
            
            sessionStorage.setItem(config.storageKey, JSON.stringify(this.history));
        },
        
        getRelevantPath: function(currentPage) {
            return this.history
                .filter(item => item.page !== currentPage)
                .sort((a, b) => a.timestamp - b.timestamp)
                .slice(-(config.maxBreadcrumbs - 1));
        },
        
        getPageTitle: function(page) {
            if (pageTitles[page]) {
                return typeof pageTitles[page] === 'function' 
                    ? pageTitles[page]() 
                    : pageTitles[page];
            }
            return this.formatDefaultTitle(page);
        },
        
        formatDefaultTitle: function(page) {
            return page.replace('.html', '')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase());
        }
    };

    // Atualiza o histórico com a página atual
    function updateHistory() {
        const currentPage = window.location.pathname.split('/').pop();
        navigationManager.addPage(currentPage);
    }

    // Gera o HTML dos breadcrumbs
    function generateBreadcrumbs() {
        const currentPage = window.location.pathname.split('/').pop();
        const breadcrumbsContainer = document.createElement('div');
        breadcrumbsContainer.className = 'breadcrumbs-vendedor';
        
        // Página inicial do vendedor
        let html = `<a href="vendedor.html">${navigationManager.getPageTitle('vendedor.html')}</a>`;
        
        // Se for a página inicial, retorna simples
        if (currentPage === 'vendedor.html') {
            breadcrumbsContainer.innerHTML = `<span>${navigationManager.getPageTitle('vendedor.html')}</span>`;
            return breadcrumbsContainer;
        }
        
        // Obtém caminho relevante
        const path = navigationManager.getRelevantPath(currentPage);
        
        // Adiciona itens do histórico
        path.forEach(item => {
            html += ` &gt; <a href="${item.url}">${navigationManager.getPageTitle(item.page)}</a>`;
        });
        
        // Adiciona página atual (não clicável)
        html += ` &gt; <span>${navigationManager.getPageTitle(currentPage)}</span>`;
        
        breadcrumbsContainer.innerHTML = html;
        return breadcrumbsContainer;
    }

    // Insere os breadcrumbs no DOM
    function renderBreadcrumbs() {
        const container = document.getElementById('breadcrumbs-container') || 
                         document.querySelector('main') || 
                         document.querySelector('.container');
        
        if (!container) return;
        
        // Remove breadcrumbs existentes
        const existing = container.querySelector('.breadcrumbs-vendedor');
        if (existing) existing.remove();
        
        // Insere no início do container
        container.prepend(generateBreadcrumbs());
    }

    // Inicialização
    updateHistory();
    renderBreadcrumbs();
    
    // Atualiza ao navegar
    window.addEventListener('beforeunload', updateHistory);
});