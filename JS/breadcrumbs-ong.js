// breadcrumbs-ong.js - Versão Completa e Corrigida
class ONGBreadcrumbs {
  constructor() {
    this.config = {
      maxHistory: 12,
      maxBreadcrumbs: 6,
      resetPages: ['ong.html'],
      storageKey: 'ongNavigationHistory'
    };

    this.pageTitles = {
      // Páginas principais
      'ong.html': 'Painel da ONG',
      'ong_produto.html': () => {
        const productName = document.querySelector('.product-title')?.textContent || 
                           document.querySelector('h1')?.textContent || 
                           'Produto';
        return `Produto: ${productName}`;
      },
      'adicionar_produto_ong.html': 'Cadastrar Produto',
      'todas_doacoes.html': 'Histórico de Doações',
      
      // Páginas de gestão
      'Editar_Produto_ONG.html': 'Editar Produto',
      'Relatorios_Doacoes.html': 'Relatórios',
      'Metas_ONG.html': 'Metas e Objetivos'
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

  loadHistory() {
    this.history = JSON.parse(sessionStorage.getItem(this.config.storageKey)) || [];
  }

  saveHistory() {
    sessionStorage.setItem(this.config.storageKey, JSON.stringify(this.history));
  }

  getCurrentPage() {
    return window.location.pathname.split('/').pop();
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
               .replace(/\b\w/g, l => l.toUpperCase());
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

  getBreadcrumbPath() {
    return this.history
      .filter(item => item.page !== this.currentPage)
      .slice(-(this.config.maxBreadcrumbs - 1));
  }

  generateHTML() {
    const path = this.getBreadcrumbPath();
    let html = `<a href="ong.html">${this.getPageTitle('ong.html')}</a>`;

    path.forEach(item => {
      html += ` &gt; <a href="${item.url}">${item.title}</a>`;
    });

    html += ` &gt; <span>${this.getPageTitle(this.currentPage)}</span>`;
    return html;
  }

  render() {
    const container = document.querySelector('.ong-breadcrumbs-container') || 
                     document.querySelector('main') || 
                     document.body;

    // Remove existentes
    const existing = container.querySelector('.ong-breadcrumbs');
    if (existing) existing.remove();

    // Cria novo
    const breadcrumbs = document.createElement('div');
    breadcrumbs.className = 'ong-breadcrumbs';
    breadcrumbs.innerHTML = this.generateHTML();
    
    // Insere no container
    if (container === document.body) {
      container.insertBefore(breadcrumbs, container.firstChild);
    } else {
      container.prepend(breadcrumbs);
    }
  }

  setupEventListeners() {
    window.addEventListener('beforeunload', () => {
      this.updateHistory();
    });
  }
}

// Inicializa quando o DOM estiver pronto
new ONGBreadcrumbs();