// breadcrumbs-unified.js - Sistema Completo de Navegação
class SmartBreadcrumbs {
  constructor() {
    this.config = {
      maxHistory: 15,
      maxBreadcrumbs: 6,
      resetPages: ['cliente.html', 'vendedor.html', 'ong.html', 'ong-2.html'],
      storageKey: 'unifiedBreadcrumbsHistory'
    };

    // Mapeamento completo de todas as páginas
    this.pageTitles = {
      // Páginas gerais
      'cliente.html': 'Página Inicial',
      'Login.html': 'Login',
      'cadastro.html': 'Cadastro',

      // Páginas de produtos
      'produto.html': () => this.getProductTitle(),
      'categoria.html': () => this.getCategoryTitle(),

      // Páginas de vendedor
      'vendedor.html': 'Painel do Vendedor',
      'cadastro_produto.html': 'Cadastrar Produto',
      'estatisticas.html': 'Estatísticas',
      'avaliacoes.html': 'Avaliações',

      // Páginas de ONG
      'ong.html': 'Painel da ONG',
      'ong_produto.html': () => this.getProductTitle(),
      'adicionar_produto_ong.html': 'Adicionar Produto',
      'todas_doacoes.html': 'Histórico de Doações',
      'doacao_espesifico.html': 'Doação Específica',
      'Produtos_Usuario_ONG.html': 'Produtos da ONG',

      // Páginas Patas Conscientes
      'ong-2.html': 'Página Inicial',
      'PatasConcientes_Produtos_Clientes.html': 'Produtos Patas Conscientes',
      'todas_adocoes.html': 'Animais para Adoção'
    };

    this.init();
  }

  init() {
    this.loadHistory();
    this.currentPage = this.getCurrentPage();
    this.updateHistory();
    this.render();
    this.setupEventListeners();
  }

  getCurrentPage() {
    return window.location.pathname.split('/').pop();
  }

  getProductTitle() {
    return document.querySelector('.product-title, .produto-detalhes h1')?.textContent || 'Produto';
  }

  getCategoryTitle() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    return category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'Categoria';
  }

  loadHistory() {
    this.history = JSON.parse(sessionStorage.getItem(this.config.storageKey)) || [];
  }

  saveHistory() {
    sessionStorage.setItem(this.config.storageKey, JSON.stringify(this.history));
  }

  shouldResetHistory(page) {
    return this.config.resetPages.includes(page);
  }

  updateHistory() {
    if (this.shouldResetHistory(this.currentPage)) {
      this.history = [];
    }

    // Não adiciona duplicatas consecutivas
    if (this.history.length === 0 || 
        this.history[this.history.length-1].page !== this.currentPage) {
      
      this.history.push({
        page: this.currentPage,
        title: this.getPageTitle(this.currentPage),
        url: window.location.href,
        timestamp: Date.now()
      });

      // Mantém histórico dentro do limite
      if (this.history.length > this.config.maxHistory) {
        this.history.shift();
      }

      this.saveHistory();
    }
  }

  getPageTitle(page) {
    if (this.pageTitles[page]) {
      return typeof this.pageTitles[page] === 'function' 
        ? this.pageTitles[page]() 
        : this.pageTitles[page];
    }
    return this.formatTitle(page);
  }

  formatTitle(page) {
    return page.replace('.html', '')
               .replace(/_/g, ' ')
               .replace(/(^|\s)\S/g, l => l.toUpperCase());
  }

  getBreadcrumbPath() {
    // Páginas especiais com hierarquia definida
    const specialPaths = {
      'Doação_Espesifico.html': ['ONG.html', 'Produtos_Usuario_ONG.html'],
      'PatasConcientes_Produtos_Clientes.html': ['PatasConscientes.html']
    };

    if (specialPaths[this.currentPage]) {
      return specialPaths[this.currentPage].map(page => ({
        page,
        title: this.getPageTitle(page),
        url: `${window.location.origin}/${page}`
      }));
    }

    // Para outras páginas, usa o histórico
    return this.history
      .filter(item => item.page !== this.currentPage)
      .slice(-(this.config.maxBreadcrumbs - 1));
  }

  generateHTML() {
    const path = this.getBreadcrumbPath();
    let html = '';

    // Determina a página inicial correta
    const homePage = this.determineHomePage();
    html += `<a href="${homePage}">${this.getPageTitle(homePage)}</a>`;

    // Adiciona o caminho
    path.forEach(item => {
      html += ` <span class="separator">›</span> <a href="${item.url}">${item.title}</a>`;
    });

    // Adiciona página atual
    html += ` <span class="separator">›</span> <span class="current-page">${this.getPageTitle(this.currentPage)}</span>`;
    return html;
  }

  determineHomePage() {
    if (this.currentPage.includes('ONG')) return 'ONG.html';
    if (this.currentPage.includes('Patas')) return 'PatasConscientes.html';
    if (this.currentPage.includes('Vendedor')) return 'Vendedor.html';
    return 'Cliente.html';
  }

  render() {
    const container = document.querySelector('.breadcrumbs-container') || 
                     document.querySelector('main') || 
                     document.querySelector('.content-container') ||
                     document.body;

    // Remove existentes
    const existing = container.querySelector('.smart-breadcrumbs');
    if (existing) existing.remove();

    // Cria novo
    const breadcrumbs = document.createElement('nav');
    breadcrumbs.className = 'smart-breadcrumbs';
    breadcrumbs.setAttribute('aria-label', 'Navegação');
    breadcrumbs.innerHTML = this.generateHTML();
    
    // Insere no DOM
    if (container === document.body) {
      container.insertBefore(breadcrumbs, container.firstChild);
    } else {
      container.prepend(breadcrumbs);
    }
  }

  setupEventListeners() {
    window.addEventListener('beforeunload', () => this.updateHistory());
  }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  new SmartBreadcrumbs();
});