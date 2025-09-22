       // Variáveis globais
        let produtos = [
            {
                id: 1,
                nome: "Camiseta Patas Conscientes",
                preco: 35.00,
                categoria: "roupas",
                descricao: "Camiseta de algodão com estampa da instituição, confortável e com design exclusivo.",
                imagem: "IMG/Camiseta-Patas.jpg",
                vendidos: 18,
                avaliacao: 4.8
            },
            {
                id: 2,
                nome: "Broche Patas Conscientes",
                preco: 12.00,
                categoria: "acessorios",
                descricao: "Broche metálico com logo da instituição, perfeito para mostrar seu apoio.",
                imagem: "IMG/Broche.SOS.jpg",
                vendidos: 12,
                avaliacao: 4.9
            },
            {
                id: 3,
                nome: "Bolsa Patas Conscientes",
                preco: 45.00,
                categoria: "acessorios",
                descricao: "Bolsa ecológica de algodão, ideal para o dia a dia e para carregar suas compras.",
                imagem: "IMG/Bolsa-Patas.jpg",
                vendidos: 8,
                avaliacao: 4.6
            },
            {
                id: 4,
                nome: "Boné Patas Conscientes",
                preco: 25.00,
                categoria: "acessorios",
                descricao: "Boné ajustável com logo bordado, perfeito para proteção solar com estilo.",
                imagem: "IMG/Bone-Patas.jpg",
                vendidos: 4,
                avaliacao: 4.5
            }
        ];

        // Elementos DOM
        const modalAdicionar = document.getElementById('modalAdicionar');
        const modalEditar = document.getElementById('modalEditar');
        const modalExcluir = document.getElementById('modalExcluir');
        const btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
        const formAdicionarProduto = document.getElementById('formAdicionarProduto');
        const formEditarProduto = document.getElementById('formEditarProduto');
        const productsGrid = document.getElementById('products-grid');
        const emptyState = document.getElementById('empty-state');
        const categoriaFilter = document.getElementById('categoria');
        const ordenarFilter = document.getElementById('ordenar');
        const buscaInput = document.getElementById('busca');

        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Botão adicionar produto
            btnAdicionarProduto.addEventListener('click', function() {
                modalAdicionar.style.display = 'block';
            });

            // Formulário adicionar produto
            formAdicionarProduto.addEventListener('submit', function(e) {
                e.preventDefault();
                adicionarProduto();
            });

            // Formulário editar produto
            formEditarProduto.addEventListener('submit', function(e) {
                e.preventDefault();
                salvarEdicaoProduto();
            });

            // Filtros
            categoriaFilter.addEventListener('change', filtrarProdutos);
            ordenarFilter.addEventListener('change', filtrarProdutos);
            buscaInput.addEventListener('input', filtrarProdutos);

            // Botões de cancelar
            document.getElementById('cancelarAdicao').addEventListener('click', function() {
                modalAdicionar.style.display = 'none';
                formAdicionarProduto.reset();
            });

            document.getElementById('cancelarEdicao').addEventListener('click', function() {
                modalEditar.style.display = 'none';
            });

            document.getElementById('cancelarExclusao').addEventListener('click', function() {
                modalExcluir.style.display = 'none';
            });

            // Botão confirmar exclusão
            document.getElementById('confirmarExclusao').addEventListener('click', function() {
                const produtoId = document.getElementById('nomeProdutoExcluir').getAttribute('data-id');
                excluirProdutoConfirmado(parseInt(produtoId));
            });

            // Fechar modais ao clicar no X
            const closeButtons = document.querySelectorAll('.close');
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    modalAdicionar.style.display = 'none';
                    modalEditar.style.display = 'none';
                    modalExcluir.style.display = 'none';
                });
            });

            // Fechar modais ao clicar fora deles
            window.addEventListener('click', function(event) {
                if (event.target == modalAdicionar) {
                    modalAdicionar.style.display = 'none';
                }
                if (event.target == modalEditar) {
                    modalEditar.style.display = 'none';
                }
                if (event.target == modalExcluir) {
                    modalExcluir.style.display = 'none';
                }
            });
        });

        // Função para adicionar produto
        function adicionarProduto() {
            const nome = document.getElementById('novoNomeProduto').value;
            const preco = parseFloat(document.getElementById('novoPrecoProduto').value);
            const categoria = document.getElementById('novoCategoriaProduto').value;
            const descricao = document.getElementById('novaDescricaoProduto').value;
            const imagem = document.getElementById('novaImagemProduto').value || 'IMG/placeholder-produto.png';

            // Criar novo produto
            const novoProduto = {
                id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
                nome: nome,
                preco: preco,
                categoria: categoria,
                descricao: descricao,
                imagem: imagem,
                vendidos: 0,
                avaliacao: 5.0
            };

            // Adicionar ao array
            produtos.push(novoProduto);

            // Atualizar a interface
            renderizarProdutos();

            // Fechar modal e limpar formulário
            modalAdicionar.style.display = 'none';
            formAdicionarProduto.reset();

            // Atualizar estatísticas
            atualizarEstatisticas();
        }

        // Função para editar produto
        function editarProduto(id) {
            const produto = produtos.find(p => p.id === id);
            
            if (produto) {
                document.getElementById('produtoId').value = produto.id;
                document.getElementById('nomeProduto').value = produto.nome;
                document.getElementById('precoProduto').value = produto.preco;
                document.getElementById('categoriaProduto').value = produto.categoria;
                document.getElementById('descricaoProduto').value = produto.descricao;
                document.getElementById('imagemProduto').value = produto.imagem;
                
                modalEditar.style.display = 'block';
            }
        }

        // Função para salvar edição do produto
        function salvarEdicaoProduto() {
            const id = parseInt(document.getElementById('produtoId').value);
            const nome = document.getElementById('nomeProduto').value;
            const preco = parseFloat(document.getElementById('precoProduto').value);
            const categoria = document.getElementById('categoriaProduto').value;
            const descricao = document.getElementById('descricaoProduto').value;
            const imagem = document.getElementById('imagemProduto').value;

            // Encontrar e atualizar o produto
            const index = produtos.findIndex(p => p.id === id);
            if (index !== -1) {
                produtos[index].nome = nome;
                produtos[index].preco = preco;
                produtos[index].categoria = categoria;
                produtos[index].descricao = descricao;
                produtos[index].imagem = imagem;
                
                // Atualizar a interface
                renderizarProdutos();
                
                // Fechar o modal
                modalEditar.style.display = 'none';
            }
        }

        // Função para excluir produto
        function excluirProduto(id) {
            const produto = produtos.find(p => p.id === id);
            
            if (produto) {
                document.getElementById('nomeProdutoExcluir').textContent = produto.nome;
                document.getElementById('nomeProdutoExcluir').setAttribute('data-id', produto.id);
                modalExcluir.style.display = 'block';
            }
        }

        // Função para confirmar exclusão
        function excluirProdutoConfirmado(id) {
            // Remover o produto do array
            produtos = produtos.filter(p => p.id !== id);
            
            // Atualizar a interface
            renderizarProdutos();
            
            // Fechar o modal
            modalExcluir.style.display = 'none';
            
            // Atualizar estatísticas
            atualizarEstatisticas();
        }

        // Função para renderizar produtos
        function renderizarProdutos() {
            // Limpar grid
            productsGrid.innerHTML = '';
            
            // Verificar se há produtos
            if (produtos.length === 0) {
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            // Adicionar cada produto ao grid
            produtos.forEach(produto => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-categoria', produto.categoria);
                productCard.setAttribute('data-vendidos', produto.vendidos);
                productCard.setAttribute('data-preco', produto.preco);
                productCard.setAttribute('data-avaliacao', produto.avaliacao);
                
                productCard.innerHTML = `
                    <div class="product-image ${produto.categoria}"><img src="${produto.imagem}" alt="${produto.nome}"></div>
                    <h3 class="product-name">${produto.nome}</h3>
                    <div class="product-price">R$ ${produto.preco.toFixed(2)}</div>
                    <p class="product-description">${produto.descricao}</p>
                    <div class="product-stats">
                        <span><i class="bi bi-cart"></i> ${produto.vendidos} vendidos</span>
                        <span><i class="bi bi-star-fill"></i> ${produto.avaliacao} (${Math.floor(produto.vendidos * 0.7)} avaliações)</span>
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

        // Função para filtrar produtos
        function filtrarProdutos() {
            const categoria = categoriaFilter.value;
            const ordenar = ordenarFilter.value;
            const busca = buscaInput.value.toLowerCase();
            
            let produtosFiltrados = produtos.filter(produto => {
                const correspondeCategoria = categoria === 'todos' || produto.categoria === categoria;
                const correspondeBusca = produto.nome.toLowerCase().includes(busca) || 
                                        produto.descricao.toLowerCase().includes(busca);
                return correspondeCategoria && correspondeBusca;
            });
            
            // Ordenar produtos
            switch(ordenar) {
                case 'recentes':
                    // Já estão ordenados por adição (mais recentes primeiro)
                    break;
                case 'vendidos':
                    produtosFiltrados.sort((a, b) => b.vendidos - a.vendidos);
                    break;
                case 'preco-menor':
                    produtosFiltrados.sort((a, b) => a.preco - b.preco);
                    break;
                case 'preco-maior':
                    produtosFiltrados.sort((a, b) => b.preco - a.preco);
                    break;
            }
            
            // Atualizar grid com produtos filtrados
            productsGrid.innerHTML = '';
            
            if (produtosFiltrados.length === 0) {
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            produtosFiltrados.forEach(produto => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute('data-categoria', produto.categoria);
                productCard.setAttribute('data-vendidos', produto.vendidos);
                productCard.setAttribute('data-preco', produto.preco);
                productCard.setAttribute('data-avaliacao', produto.avaliacao);
                
                productCard.innerHTML = `
                    <div class="product-image ${produto.categoria}"><img src="${produto.imagem}" alt="${produto.nome}"></div>
                    <h3 class="product-name">${produto.nome}</h3>
                    <div class="product-price">R$ ${produto.preco.toFixed(2)}</div>
                    <p class="product-description">${produto.descricao}</p>
                    <div class="product-stats">
                        <span><i class="bi bi-cart"></i> ${produto.vendidos} vendidos</span>
                        <span><i class="bi bi-star-fill"></i> ${produto.avaliacao} (${Math.floor(produto.vendidos * 0.7)} avaliações)</span>
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

        // Função para limpar filtros
        function limparFiltros() {
            categoriaFilter.value = 'todos';
            ordenarFilter.value = 'recentes';
            buscaInput.value = '';
            renderizarProdutos();
        }

        // Função para atualizar estatísticas
        function atualizarEstatisticas() {
            const statValueElements = document.querySelectorAll('.stat-value');
            if (statValueElements.length >= 1) {
                statValueElements[0].textContent = produtos.length;
            }
        }

        // Inicializar a página
        renderizarProdutos();