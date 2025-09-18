        // Dados iniciais (serão substituídos pelos dados do localStorage)
        const initialDonations = [
            {
                id: 1,
                name: "Ração para Gatos",
                description: "Precisamos de ração seca e úmida para alimentar nossos resgatados",
                category: "Alimentação",
                priority: "Alta",
                target: 50,
                collected: 22.5,
                image: "IMG/Ração.png",
                status: "Ativo",
                date: "10/05/2025"
            },
            {
                id: 2,
                name: "Cobertores",
                description: "Para manter os animais aquecidos no inverno",
                category: "Roupas",
                priority: "Média",
                target: 20,
                collected: 14,
                image: "IMG/Cobertor.png",
                status: "Ativo",
                date: "05/05/2025"
            },
            {
                id: 3,
                name: "Medicamentos",
                description: "Antipulgas, vermífugos e outros remédios básicos",
                category: "Medicamentos",
                priority: "Alta",
                target: 50,
                collected: 15,
                image: "IMG/Medicamentos.png",
                status: "Ativo",
                date: "01/05/2025"
            },
            {
                id: 4,
                name: "Brinquedos",
                description: "Para enriquecimento ambiental dos gatos",
                category: "Brinquedos",
                priority: "Baixa",
                target: 30,
                collected: 18,
                image: "IMG/Brinquedos.png",
                status: "Ativo",
                date: "28/04/2025"
            }
        ];

        // Configurações da aplicação
        const config = {
            itemsPerPage: 6,
            currentPage: 1
        };

        // Estado da aplicação
        let state = {
            donations: [],
            filteredDonations: [],
            currentDonationId: null,
            searchTerm: '',
            filters: {
                category: '',
                priority: '',
                status: ''
            }
        };

        // Inicialização da aplicação
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            setupEventListeners();
        });

        // Função para inicializar a aplicação
        function initializeApp() {
            // Carregar dados do localStorage ou usar dados iniciais
            loadDonations();
            
            // Aplicar filtros e renderizar doações
            applyFilters();
            
            // Renderizar a primeira página
            renderDonations();
        }

        // Função para carregar doações do localStorage
        function loadDonations() {
            const storedDonations = localStorage.getItem('necessaryDonations');
            
            if (storedDonations) {
                state.donations = JSON.parse(storedDonations);
            } else {
                // Usar dados iniciais e salvar no localStorage
                state.donations = initialDonations;
                saveDonations();
            }
        }

        // Função para salvar doações no localStorage
        function saveDonations() {
            localStorage.setItem('necessaryDonations', JSON.stringify(state.donations));
        }

        // Função para configurar os event listeners
        function setupEventListeners() {
            // Modal de adicionar doação
            document.getElementById('addDonationBtn').addEventListener('click', openAddModal);
            
            // Modal de confirmação
            document.querySelectorAll('.close').forEach(closeBtn => {
                closeBtn.addEventListener('click', closeAllModals);
            });
            
            // Cancelar formulário
            document.getElementById('cancelButton').addEventListener('click', closeAllModals);
            
            // Enviar formulário
            document.getElementById('donationForm').addEventListener('submit', handleFormSubmit);
            
            // Pesquisa
            document.getElementById('searchInput').addEventListener('input', handleSearch);
            document.getElementById('searchButton').addEventListener('click', handleSearch);
            
            // Filtros
            document.getElementById('applyFilters').addEventListener('click', applyFilters);
            document.getElementById('clearFilters').addEventListener('click', clearFilters);
            
            // Exclusão
            document.getElementById('cancelDeleteButton').addEventListener('click', closeAllModals);
            document.getElementById('confirmDeleteButton').addEventListener('click', confirmDelete);
            
            // Fechar modais ao clicar fora deles
            window.addEventListener('click', function(event) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    if (event.target === modal) {
                        closeAllModals();
                    }
                });
            });
        }

        // Função para renderizar as doações na página atual
        function renderDonations() {
            const donationsContainer = document.getElementById('necessaryDonations');
            const paginationContainer = document.getElementById('pagination');
            const noResultsElement = document.getElementById('noResults');
            
            // Verificar se há resultados
            if (state.filteredDonations.length === 0) {
                donationsContainer.innerHTML = '';
                paginationContainer.innerHTML = '';
                noResultsElement.style.display = 'block';
                return;
            }
            
            noResultsElement.style.display = 'none';
            
            // Calcular itens para a página atual
            const startIndex = (config.currentPage - 1) * config.itemsPerPage;
            const endIndex = startIndex + config.itemsPerPage;
            const currentDonations = state.filteredDonations.slice(startIndex, endIndex);
            
            // Renderizar doações
            donationsContainer.innerHTML = currentDonations.map(donation => `
                <div class="donation-card" data-id="${donation.id}">
                    <div class="donation-image">
                        <img src="${donation.image || 'IMG/placeholder.png'}" alt="${donation.name}">
                    </div>
                    <h3>${donation.name}</h3>
                    <p>${donation.description}</p>
                    
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(donation.collected / donation.target) * 100}%; 
                            background-color: ${getProgressColor(donation.collected, donation.target)};">
                        </div>
                        <div class="progress-text">
                            ${donation.collected} / ${donation.target} (${Math.round((donation.collected / donation.target) * 100)}%)
                        </div>
                    </div>
                    
                    <div class="card-details">
                        <div><strong>Categoria:</strong> ${donation.category}</div>
                        <div><strong>Prioridade:</strong> <span class="donation-status priority-${donation.priority.toLowerCase()}">${donation.priority}</span></div>
                        <div><strong>Status:</strong> <span class="donation-status status-${donation.status.toLowerCase()}">${donation.status}</span></div>
                        <div><strong>Data:</strong> ${donation.date}</div>
                    </div>
                    
                    <div class="card-footer">
                        <button class="secondary-button small edit-btn" data-id="${donation.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="danger-button small delete-btn" data-id="${donation.id}">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Adicionar event listeners aos botões de editar e excluir
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    openEditModal(id);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    openDeleteModal(id);
                });
            });
            
            // Renderizar paginação
            renderPagination();
        }

        // Função para renderizar a paginação
        function renderPagination() {
            const paginationContainer = document.getElementById('pagination');
            const totalPages = Math.ceil(state.filteredDonations.length / config.itemsPerPage);
            
            if (totalPages <= 1) {
                paginationContainer.innerHTML = '';
                return;
            }
            
            let paginationHTML = '';
            
            // Botão anterior
            if (config.currentPage > 1) {
                paginationHTML += `<button class="pagination-btn" data-page="${config.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </button>`;
            }
            
            // Páginas
            for (let i = 1; i <= totalPages; i++) {
                if (i === config.currentPage) {
                    paginationHTML += `<button class="pagination-btn active" data-page="${i}">${i}</button>`;
                } else {
                    paginationHTML += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
                }
            }
            
            // Botão próximo
            if (config.currentPage < totalPages) {
                paginationHTML += `<button class="pagination-btn" data-page="${config.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </button>`;
            }
            
            paginationContainer.innerHTML = paginationHTML;
            
            // Adicionar event listeners aos botões de paginação
            document.querySelectorAll('.pagination-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const page = parseInt(this.getAttribute('data-page'));
                    changePage(page);
                });
            });
        }

        // Função para mudar de página
        function changePage(page) {
            config.currentPage = page;
            renderDonations();
            window.scrollTo(0, 0);
        }

        // Função para aplicar filtros e pesquisa
        function applyFilters() {
            // Obter valores dos filtros
            state.filters.category = document.getElementById('categoryFilter').value;
            state.filters.priority = document.getElementById('priorityFilter').value;
            state.filters.status = document.getElementById('statusFilter').value;
            
            // Aplicar filtros
            state.filteredDonations = state.donations.filter(donation => {
                // Verificar pesquisa
                const matchesSearch = donation.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                                     donation.description.toLowerCase().includes(state.searchTerm.toLowerCase());
                
                // Verificar filtros
                const matchesCategory = !state.filters.category || donation.category === state.filters.category;
                const matchesPriority = !state.filters.priority || donation.priority === state.filters.priority;
                const matchesStatus = !state.filters.status || donation.status === state.filters.status;
                
                return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
            });
            
            // Resetar para a primeira página
            config.currentPage = 1;
            
            // Renderizar doações
            renderDonations();
        }

        // Função para lidar com a pesquisa
        function handleSearch() {
            state.searchTerm = document.getElementById('searchInput').value;
            applyFilters();
        }

        // Função para limpar filtros
        function clearFilters() {
            document.getElementById('categoryFilter').value = '';
            document.getElementById('priorityFilter').value = '';
            document.getElementById('statusFilter').value = '';
            document.getElementById('searchInput').value = '';
            
            state.searchTerm = '';
            state.filters = {
                category: '',
                priority: '',
                status: ''
            };
            
            applyFilters();
        }

        // Função para abrir modal de adição
        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Nova Doação Necessária';
            document.getElementById('donationForm').reset();
            document.getElementById('donationId').value = '';
            document.getElementById('itemCollected').value = '0';
            document.getElementById('itemStatus').value = 'Ativo';
            
            // Limpar mensagens de erro
            clearErrorMessages();
            
            document.getElementById('donationModal').style.display = 'block';
        }

        // Função para abrir modal de edição
        function openEditModal(id) {
            const donation = state.donations.find(d => d.id === id);
            
            if (donation) {
                document.getElementById('modalTitle').textContent = 'Editar Doação Necessária';
                document.getElementById('donationId').value = donation.id;
                document.getElementById('itemName').value = donation.name;
                document.getElementById('itemDescription').value = donation.description;
                document.getElementById('itemCategory').value = donation.category;
                document.getElementById('itemPriority').value = donation.priority;
                document.getElementById('itemQuantity').value = donation.target;
                document.getElementById('itemCollected').value = donation.collected;
                document.getElementById('itemImage').value = donation.image || '';
                document.getElementById('itemStatus').value = donation.status;
                
                // Limpar mensagens de erro
                clearErrorMessages();
                
                document.getElementById('donationModal').style.display = 'block';
            }
        }

        // Função para abrir modal de exclusão
        function openDeleteModal(id) {
            state.currentDonationId = id;
            document.getElementById('deleteModal').style.display = 'block';
        }

        // Função para fechar todos os modais
        function closeAllModals() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            
            state.currentDonationId = null;
        }

        // Função para lidar com o envio do formulário
        function handleFormSubmit(e) {
            e.preventDefault();
            
            // Validar formulário
            if (validateForm()) {
                // Obter dados do formulário
                const donationData = {
                    id: document.getElementById('donationId').value ? parseInt(document.getElementById('donationId').value) : generateId(),
                    name: document.getElementById('itemName').value,
                    description: document.getElementById('itemDescription').value,
                    category: document.getElementById('itemCategory').value,
                    priority: document.getElementById('itemPriority').value,
                    target: parseInt(document.getElementById('itemQuantity').value),
                    collected: parseInt(document.getElementById('itemCollected').value) || 0,
                    image: document.getElementById('itemImage').value,
                    status: document.getElementById('itemStatus').value,
                    date: new Date().toLocaleDateString('pt-BR')
                };
                
                // Verificar se é uma edição ou nova doação
                const existingIndex = state.donations.findIndex(d => d.id === donationData.id);
                
                if (existingIndex !== -1) {
                    // Editar doação existente
                    state.donations[existingIndex] = donationData;
                } else {
                    // Adicionar nova doação
                    state.donations.push(donationData);
                }
                
                // Salvar no localStorage
                saveDonations();
                
                // Aplicar filtros e renderizar
                applyFilters();
                
                // Fechar modal
                closeAllModals();
                
                // Mostrar mensagem de sucesso
                alert(existingIndex !== -1 ? 'Doação atualizada com sucesso!' : 'Doação adicionada com sucesso!');
            }
        }

        // Função para confirmar exclusão
        function confirmDelete() {
            if (state.currentDonationId) {
                // Encontrar índice da doação
                const index = state.donations.findIndex(d => d.id === state.currentDonationId);
                
                if (index !== -1) {
                    // Remover doação
                    state.donations.splice(index, 1);
                    
                    // Salvar no localStorage
                    saveDonations();
                    
                    // Aplicar filtros e renderizar
                    applyFilters();
                    
                    // Fechar modal
                    closeAllModals();
                    
                    // Mostrar mensagem de sucesso
                    alert('Doação excluída com sucesso!');
                }
            }
        }

        // Função para validar o formulário
        function validateForm() {
            let isValid = true;
            
            // Limpar mensagens de erro anteriores
            clearErrorMessages();
            
            // Validar nome
            const name = document.getElementById('itemName').value.trim();
            if (!name) {
                showError('itemNameError', 'Por favor, informe o nome do item.');
                isValid = false;
            }
            
            // Validar descrição
            const description = document.getElementById('itemDescription').value.trim();
            if (!description) {
                showError('itemDescriptionError', 'Por favor, informe a descrição do item.');
                isValid = false;
            }
            
            // Validar categoria
            const category = document.getElementById('itemCategory').value;
            if (!category) {
                showError('itemCategoryError', 'Por favor, selecione uma categoria.');
                isValid = false;
            }
            
            // Validar prioridade
            const priority = document.getElementById('itemPriority').value;
            if (!priority) {
                showError('itemPriorityError', 'Por favor, selecione uma prioridade.');
                isValid = false;
            }
            
            // Validar quantidade
            const quantity = document.getElementById('itemQuantity').value;
            if (!quantity || quantity <= 0) {
                showError('itemQuantityError', 'Por favor, informe uma quantidade válida.');
                isValid = false;
            }
            
            // Validar quantidade arrecadada
            const collected = document.getElementById('itemCollected').value;
            if (collected < 0) {
                showError('itemCollectedError', 'A quantidade arrecadada não pode ser negativa.');
                isValid = false;
            }
            
            // Validar URL da imagem (se fornecida)
            const imageUrl = document.getElementById('itemImage').value.trim();
            if (imageUrl && !isValidUrl(imageUrl)) {
                showError('itemImageError', 'Por favor, informe uma URL válida.');
                isValid = false;
            }
            
            return isValid;
        }

        // Função para mostrar mensagem de erro
        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
        }

        // Função para limpar mensagens de erro
        function clearErrorMessages() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
            });
        }

        // Função para verificar se uma URL é válida
        function isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        }

        // Função para gerar um ID único
        function generateId() {
            return state.donations.length > 0 ? Math.max(...state.donations.map(d => d.id)) + 1 : 1;
        }

        // Função para obter a cor da barra de progresso
        function getProgressColor(collected, target) {
            const percentage = (collected / target) * 100;
            
            if (percentage < 30) {
                return '#F44336'; // Vermelho
            } else if (percentage < 70) {
                return '#FF9800'; // Laranja
            } else {
                return '#4CAF50'; // Verde
            }
        }