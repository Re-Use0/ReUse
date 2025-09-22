// Dados dos produtos para ordenação
const produtos = [
    { 
        id: 1, 
        nome: "Camisa SOS Felino", 
        preco: 35, 
        vendidos: 15, 
        avaliacao: 4.9, 
        categoria: "roupas",
        descricao: "Camisa casual de algodão, confortável e com estampa da instituição.",
        imagem: "IMG/Camiseta.SOS.jpg"
    },
    { 
        id: 2, 
        nome: "Broche SOS Felino", 
        preco: 15, 
        vendidos: 10, 
        avaliacao: 4.7, 
        categoria: "acessorios",
        descricao: "Broche metálico com logo da instituição.",
        imagem: "IMG/Broche.SOS.jpg"
    },
    { 
        id: 3, 
        nome: "Bolsa SOS Felino", 
        preco: 45, 
        vendidos: 6, 
        avaliacao: 4.5, 
        categoria: "acessorios",
        descricao: "Bolsa de algodão ecologicamente correta.",
        imagem: "IMG/Bolsa.SOS.jpg"
    },
    { 
        id: 4, 
        nome: "Caneca SOS Felino", 
        preco: 20, 
        vendidos: 20, 
        avaliacao: 4.8, 
        categoria: "casa",
        descricao: "Caneca em cerâmica com estampa personalizada.",
        imagem: "IMG/Caneca.SOS.jpg"
    }
];

// Variáveis globais
let produtoAtualId = null;
let produtosFiltrados = [...produtos];
let proximoId = 5; // Próximo ID disponível para novos produtos

// Função para inicializar a página
function inicializarPagina() {
    destacarPaginaAtiva();
    adicionarEventListeners();
    renderizarProdutos();
    atualizarEstatisticas();
}

// Função para destacar a página ativa no menu
function destacarPaginaAtiva() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (href === 'ong_produto.html' && currentPage === '')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Função para adicionar event listeners
function adicionarEventListeners() {
    // Filtros e busca
    document.getElementById('categoria').addEventListener('change', filtrarEOrdenarProdutos);
    document.getElementById('ordenar').addEventListener('change', filtrarEOrdenarProdutos);
    document.getElementById('busca').addEventListener('input', filtrarEOrdenarProdutos);
    
    // Formulário de edição
    document.getElementById('formEditarProduto').addEventListener('submit', salvarEdicaoProduto);
    
    // Formulário de adição
    document.getElementById('formAdicionarProduto').addEventListener('submit', adicionarNovoProduto);
    
    // Botões de fechar modais
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            fecharModal(modal.id);
        });
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            fecharModal(event.target.id);
        }
    });
    
    // Alterar o comportamento do botão "Adicionar Novo Produto"
    const btnAdicionar = document.querySelector('.action-buttons .primary-button');
    if (btnAdicionar) {
        btnAdicionar.onclick = abrirModalAdicionar;
    }
}

// Função para renderizar produtos na grade
function renderizarProdutos() {
    const productsGrid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    
    // Limpar grade atual
    productsGrid.innerHTML = '';
    
    if (produtosFiltrados.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Adicionar produtos à grade
    produtosFiltrados.forEach(produto => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-categoria', produto.categoria);
        productCard.setAttribute('data-vendidos', produto.vendidos);
        productCard.setAttribute('data-preco', produto.preco);
        productCard.setAttribute('data-avaliacao', produto.avaliacao);
        
        productCard.innerHTML = `
            <div class="product-image ${produto.categoria}">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <h3 class="product-name">${produto.nome}</h3>
            <div class="product-price">R$ ${produto.preco.toFixed(2)}</div>
            <p class="product-description">${produto.descricao}</p>
            <div class="product-stats">
                <span><i class="bi bi-cart"></i> ${produto.vendidos} vendidos</span>
                <span><i class="bi bi-star-fill"></i> ${produto.avaliacao} (${Math.round(produto.vendidos * 0.8)} avaliações)</span>
            </div>
            <div class="donation-actions">
                <button class="primary-button small" onclick="editarProduto(${produto.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="danger-button small" onclick="excluirProduto(${produto.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Função para filtrar e ordenar produtos
function filtrarEOrdenarProdutos() {
    const categoria = document.getElementById('categoria').value;
    const busca = document.getElementById('busca').value.toLowerCase();
    const ordenacao = document.getElementById('ordenar').value;
    
    // Filtrar produtos
    produtosFiltrados = produtos.filter(produto => {
        const categoriaMatch = categoria === 'todos' || produto.categoria === categoria;
        const buscaMatch = produto.nome.toLowerCase().includes(busca);
        return categoriaMatch && buscaMatch;
    });
    
    // Ordenar produtos
    produtosFiltrados.sort((a, b) => {
        switch(ordenacao) {
            case 'recentes':
                return b.id - a.id; // IDs mais recentes primeiro
            case 'vendidos':
                return b.vendidos - a.vendidos;
            case 'preco-menor':
                return a.preco - b.preco;
            case 'preco-maior':
                return b.preco - a.preco;
            default:
                return 0;
        }
    });
    
    // Renderizar produtos filtrados/ordenados
    renderizarProdutos();
}

// Função para atualizar estatísticas
function atualizarEstatisticas() {
    const produtosAtivos = produtos.length;
    const totalVendas = produtos.reduce((total, produto) => total + produto.vendidos, 0);
    const faturamentoTotal = produtos.reduce((total, produto) => total + (produto.preco * produto.vendidos), 0);
    const avaliacaoMedia = produtos.reduce((total, produto) => total + produto.avaliacao, 0) / produtos.length;
    
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = produtosAtivos;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = totalVendas;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = `R$ ${faturamentoTotal.toFixed(2)}`;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = avaliacaoMedia.toFixed(1);
}

// Função para abrir modal de edição
function editarProduto(id) {
    produtoAtualId = id;
    const produto = produtos.find(p => p.id === id);
    
    if (produto) {
        document.getElementById('produtoId').value = produto.id;
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('precoProduto').value = produto.preco;
        document.getElementById('categoriaProduto').value = produto.categoria;
        document.getElementById('descricaoProduto').value = produto.descricao;
        document.getElementById('imagemProduto').value = produto.imagem;
        
        abrirModal('modalEditar');
    }
}

// Função para abrir modal de exclusão
function excluirProduto(id) {
    produtoAtualId = id;
    const produto = produtos.find(p => p.id === id);
    
    if (produto) {
        document.getElementById('nomeProdutoExcluir').textContent = produto.nome;
        abrirModal('modalExcluir');
    }
}

// Função para abrir modal de adição
function abrirModalAdicionar() {
    // Limpar o formulário
    document.getElementById('formAdicionarProduto').reset();
    abrirModal('modalAdicionar');
}

// Função para abrir modal
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden'; // Impede scroll da página principal
}

// Função para fechar modal
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll da página principal
}

// Função para salvar edição do produto
function salvarEdicaoProduto(e) {
    e.preventDefault();
    
    const produtoIndex = produtos.findIndex(p => p.id === produtoAtualId);
    
    if (produtoIndex !== -1) {
        // Atualizar produto
        produtos[produtoIndex].nome = document.getElementById('nomeProduto').value;
        produtos[produtoIndex].preco = parseFloat(document.getElementById('precoProduto').value);
        produtos[produtoIndex].categoria = document.getElementById('categoriaProduto').value;
        produtos[produtoIndex].descricao = document.getElementById('descricaoProduto').value;
        produtos[produtoIndex].imagem = document.getElementById('imagemProduto').value;
        
        // Em uma aplicação real, aqui faríamos uma requisição AJAX para o servidor
        
        // Fechar modal e atualizar interface
        fecharModal('modalEditar');
        filtrarEOrdenarProdutos();
        atualizarEstatisticas();
        
        // Feedback para o usuário
        mostrarNotificacao('Produto atualizado com sucesso!', 'sucesso');
    }
}

// Função para adicionar novo produto
function adicionarNovoProduto(e) {
    e.preventDefault();
    
    const novoProduto = {
        id: proximoId++,
        nome: document.getElementById('novoNomeProduto').value,
        preco: parseFloat(document.getElementById('novoPrecoProduto').value),
        categoria: document.getElementById('novoCategoriaProduto').value,
        descricao: document.getElementById('novaDescricaoProduto').value,
        imagem: document.getElementById('novaImagemProduto').value || 'IMG/placeholder.png',
        vendidos: 0,
        avaliacao: 0
    };
    
    // Adicionar o novo produto ao array
    produtos.push(novoProduto);
    
    // Em uma aplicação real, aqui faríamos uma requisição AJAX para o servidor
    
    // Fechar modal e atualizar interface
    fecharModal('modalAdicionar');
    filtrarEOrdenarProdutos();
    atualizarEstatisticas();
    
    // Feedback para o usuário
    mostrarNotificacao('Produto adicionado com sucesso!', 'sucesso');
}

// Função para confirmar exclusão
function confirmarExclusao() {
    const produtoIndex = produtos.findIndex(p => p.id === produtoAtualId);
    
    if (produtoIndex !== -1) {
        // Remover produto
        produtos.splice(produtoIndex, 1);
        
        // Em uma aplicação real, aqui faríamos uma requisição AJAX para o servidor
        
        // Fechar modal e atualizar interface
        fecharModal('modalExcluir');
        filtrarEOrdenarProdutos();
        atualizarEstatisticas();
        
        // Feedback para o usuário
        mostrarNotificacao('Produto excluído com sucesso!', 'sucesso');
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo) {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.textContent = mensagem;
    
    // Estilos para a notificação
    notificacao.style.position = 'fixed';
    notificacao.style.top = '20px';
    notificacao.style.right = '20px';
    notificacao.style.padding = '15px 20px';
    notificacao.style.borderRadius = '4px';
    notificacao.style.color = 'white';
    notificacao.style.zIndex = '10000';
    notificacao.style.opacity = '0';
    notificacao.style.transition = 'opacity 0.3s';
    
    if (tipo === 'sucesso') {
        notificacao.style.background = '#4CAF50';
    } else {
        notificacao.style.background = '#e74c3c';
    }
    
    // Adicionar ao DOM
    document.body.appendChild(notificacao);
    
    // Animação de entrada
    setTimeout(() => {
        notificacao.style.opacity = '1';
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// Função para limpar filtros
function limparFiltros() {
    document.getElementById('categoria').value = 'todos';
    document.getElementById('ordenar').value = 'recentes';
    document.getElementById('busca').value = '';
    filtrarEOrdenarProdutos();
}

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarPagina);