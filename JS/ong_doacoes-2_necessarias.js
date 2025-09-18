        // Dados de exemplo para as doações necessárias
        const necessaryDonationsData = [
            {
                id: 1,
                title: "Ração para Gatos Adultos",
                category: "Alimentação",
                description: "Ração de boa qualidade para gatos adultos, preferencialmente sem corantes.",
                priority: "Alta",
                quantityNeeded: 50,
                quantityCollected: 25,
                status: "Ativo",
                image: "https://via.placeholder.com/300x200?text=Racao+Gatos"
            },
            {
                id: 2,
                title: "Areia Sanitária",
                category: "Higiene",
                description: "Areia higiênica para gatos, qualquer marca é bem-vinda.",
                priority: "Alta",
                quantityNeeded: 30,
                quantityCollected: 10,
                status: "Ativo",
                image: "https://via.placeholder.com/300x200?text=Areia+Sanitaria"
            },
            {
                id: 3,
                title: "Brinquedos para Gatos",
                category: "Brinquedos",
                description: "Brinquedos interativos, arranhadores e bolinhas para nossos felinos.",
                priority: "Média",
                quantityNeeded: 20,
                quantityCollected: 15,
                status: "Ativo",
                image: "https://via.placeholder.com/300x200?text=Brinquedos+Gatos"
            },
            {
                id: 4,
                title: "Vermífugo para Gatos",
                category: "Medicamentos",
                description: "Medicamento para controle de vermes em gatos adultos e filhotes.",
                priority: "Alta",
                quantityNeeded: 40,
                quantityCollected: 40,
                status: "Atendido",
                image: "https://via.placeholder.com/300x200?text=Vermifugo+Gatos"
            },
            {
                id: 5,
                title: "Coleiras Ajustáveis",
                category: "Outros",
                description: "Coleiras de identificação para gatos, de vários tamanhos.",
                priority: "Baixa",
                quantityNeeded: 15,
                quantityCollected: 5,
                status: "Ativo",
                image: "https://via.placeholder.com/300x200?text=Coleiras+Gatos"
            },
            {
                id: 6,
                title: "Caixas de Transporte",
                category: "Outros",
                description: "Caixas para transporte seguro de gatos para consultas veterinárias.",
                priority: "Média",
                quantityNeeded: 10,
                quantityCollected: 3,
                status: "Ativo",
                image: "https://via.placeholder.com/300x200?text=Caixas+Transporte"
            }
        ];

        // Variáveis globais
        let currentPage = 1;
        const itemsPerPage = 6;
        let filteredDonations = [...necessaryDonationsData];
        let donationToDelete = null;

        // Inicialização quando a página carrega
        document.addEventListener('DOMContentLoaded', function() {
            loadDonations();
            setupEventListeners();
        });

        // Configurar event listeners
        function setupEventListeners() {
            // Pesquisa em tempo real
            document.getElementById('searchInput').addEventListener('input', function() {
                applyFilters();
            });
            
            // Filtros que disparam automaticamente
            document.getElementById('categoryFilter').addEventListener('change', applyFilters);
            document.getElementById('priorityFilter').addEventListener('change', applyFilters);
            document.getElementById('statusFilter').addEventListener('change', applyFilters);
            
            // Formulário de doação
            document.getElementById('donationForm').addEventListener('submit', function(e) {
                e.preventDefault();
                saveDonation();
            });
            
            // Confirmação de exclusão
            document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
                if (donationToDelete) {
                    deleteDonation(donationToDelete);
                    closeDeleteModal();
                }
            });
        }

        // Carregar doações na página
        function loadDonations() {
            const donationsContainer = document.getElementById('necessaryDonations');
            const noResultsElement = document.getElementById('noResults');
            const paginationElement = document.getElementById('pagination');
            
            // Verificar se há resultados
            if (filteredDonations.length === 0) {
                donationsContainer.innerHTML = '';
                noResultsElement.style.display = 'block';
                paginationElement.innerHTML = '';
                return;
            }
            
            noResultsElement.style.display = 'none';
            
            // Calcular índices para a página atual
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, filteredDonations.length);
            const currentDonations = filteredDonations.slice(startIndex, endIndex);
            
            // Gerar HTML para as doações
            donationsContainer.innerHTML = '';
            currentDonations.forEach(donation => {
                const progressPercentage = (donation.quantityCollected / donation.quantityNeeded) * 100;
                
                donationsContainer.innerHTML += `
                    <div class="donation-card">
                        <div class="donation-header">
                            <h3 class="donation-title">${donation.title}</h3>
                            <span class="priority-badge priority-${donation.priority.toLowerCase()}">${donation.priority}</span>
                        </div>
                        <div class="donation-category">${donation.category}</div>
                        <p class="donation-description">${donation.description}</p>
                        
                        <div class="progress-container">
                            <div class="progress-info">
                                <span>Arrecadado: ${donation.quantityCollected} de ${donation.quantityNeeded}</span>
                                <span>${Math.round(progressPercentage)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
                            </div>
                        </div>
                        
                        <div class="donation-actions">
                            <button class="secondary-button small" onclick="editDonation(${donation.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="danger-button small" onclick="confirmDelete(${donation.id})">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `;
            });
            
            // Gerar paginação
            generatePagination();
        }

        // Gerar controles de paginação
        function generatePagination() {
            const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
            const paginationElement = document.getElementById('pagination');
            
            if (totalPages <= 1) {
                paginationElement.innerHTML = '';
                return;
            }
            
            let paginationHTML = '';
            
            // Botão anterior
            if (currentPage > 1) {
                paginationHTML += `<button onclick="goToPage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
            }
            
            // Páginas
            for (let i = 1; i <= totalPages; i++) {
                if (i === currentPage) {
                    paginationHTML += `<button class="active">${i}</button>`;
                } else {
                    paginationHTML += `<button onclick="goToPage(${i})">${i}</button>`;
                }
            }
            
            // Botão próximo
            if (currentPage < totalPages) {
                paginationHTML += `<button onclick="goToPage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
            }
            
            paginationElement.innerHTML = paginationHTML;
        }

        // Navegar para uma página específica
        function goToPage(page) {
            currentPage = page;
            loadDonations();
        }

        // Aplicar filtros
        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const priority = document.getElementById('priorityFilter').value;
            const status = document.getElementById('statusFilter').value;
            
            filteredDonations = necessaryDonationsData.filter(donation => {
                // Filtro de pesquisa
                const matchesSearch = searchTerm === '' || 
                    donation.title.toLowerCase().includes(searchTerm) ||
                    donation.description.toLowerCase().includes(searchTerm) ||
                    donation.category.toLowerCase().includes(searchTerm);
                
                // Filtro de categoria
                const matchesCategory = category === '' || donation.category === category;
                
                // Filtro de prioridade
                const matchesPriority = priority === '' || donation.priority === priority;
                
                // Filtro de status
                const matchesStatus = status === '' || donation.status === status;
                
                return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
            });
            
            currentPage = 1;
            loadDonations();
        }

        // Limpar filtros
        function clearFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('categoryFilter').value = '';
            document.getElementById('priorityFilter').value = '';
            document.getElementById('statusFilter').value = '';
            
            applyFilters();
        }

        // Abrir modal para adicionar/editar doação
        function openDonationModal(donationId = null) {
            const modal = document.getElementById('donationModal');
            const modalTitle = document.getElementById('modalTitle');
            const form = document.getElementById('donationForm');
            
            // Limpar formulário
            form.reset();
            hideAllErrorMessages();
            
            if (donationId) {
                // Modo edição
                modalTitle.textContent = 'Editar Doação Necessária';
                const donation = necessaryDonationsData.find(d => d.id === donationId);
                
                if (donation) {
                    document.getElementById('donationId').value = donation.id;
                    document.getElementById('itemName').value = donation.title;
                    document.getElementById('itemDescription').value = donation.description;
                    document.getElementById('itemCategory').value = donation.category;
                    document.getElementById('itemPriority').value = donation.priority;
                    document.getElementById('itemQuantity').value = donation.quantityNeeded;
                    document.getElementById('itemCollected').value = donation.quantityCollected;
                    document.getElementById('itemImage').value = donation.image || '';
                    document.getElementById('itemStatus').value = donation.status;
                }
            } else {
                // Modo adição
                modalTitle.textContent = 'Nova Doação Necessária';
                document.getElementById('donationId').value = '';
                document.getElementById('itemCollected').value = 0;
                document.getElementById('itemStatus').value = 'Ativo';
            }
            
            modal.style.display = 'block';
        }

        // Fechar modal de doação
        function closeDonationModal() {
            document.getElementById('donationModal').style.display = 'none';
        }

        // Salvar doação (adicionar ou editar)
        function saveDonation() {
            // Validar formulário
            if (!validateForm()) {
                return;
            }
            
            const donationId = document.getElementById('donationId').value;
            const donationData = {
                title: document.getElementById('itemName').value,
                description: document.getElementById('itemDescription').value,
                category: document.getElementById('itemCategory').value,
                priority: document.getElementById('itemPriority').value,
                quantityNeeded: parseInt(document.getElementById('itemQuantity').value),
                quantityCollected: parseInt(document.getElementById('itemCollected').value),
                image: document.getElementById('itemImage').value,
                status: document.getElementById('itemStatus').value
            };
            
            if (donationId) {
                // Editar doação existente
                const index = necessaryDonationsData.findIndex(d => d.id === parseInt(donationId));
                if (index !== -1) {
                    donationData.id = parseInt(donationId);
                    necessaryDonationsData[index] = donationData;
                }
            } else {
                // Adicionar nova doação
                const newId = necessaryDonationsData.length > 0 
                    ? Math.max(...necessaryDonationsData.map(d => d.id)) + 1 
                    : 1;
                donationData.id = newId;
                necessaryDonationsData.push(donationData);
            }
            
            // Atualizar lista e fechar modal
            applyFilters();
            closeDonationModal();
            
            // Mostrar mensagem de sucesso (poderia ser um toast/alert)
            alert(`Doação ${donationId ? 'atualizada' : 'adicionada'} com sucesso!`);
        }

        // Validar formulário
        function validateForm() {
            let isValid = true;
            hideAllErrorMessages();
            
            // Validar nome do item
            const itemName = document.getElementById('itemName').value.trim();
            if (!itemName) {
                showError('itemNameError', 'Por favor, informe o nome do item.');
                isValid = false;
            }
            
            // Validar descrição
            const itemDescription = document.getElementById('itemDescription').value.trim();
            if (!itemDescription) {
                showError('itemDescriptionError', 'Por favor, informe a descrição do item.');
                isValid = false;
            }
            
            // Validar categoria
            const itemCategory = document.getElementById('itemCategory').value;
            if (!itemCategory) {
                showError('itemCategoryError', 'Por favor, selecione uma categoria.');
                isValid = false;
            }
            
            // Validar prioridade
            const itemPriority = document.getElementById('itemPriority').value;
            if (!itemPriority) {
                showError('itemPriorityError', 'Por favor, selecione uma prioridade.');
                isValid = false;
            }
            
            // Validar quantidade necessária
            const itemQuantity = document.getElementById('itemQuantity').value;
            if (!itemQuantity || parseInt(itemQuantity) <= 0) {
                showError('itemQuantityError', 'Por favor, informe uma quantidade válida.');
                isValid = false;
            }
            
            // Validar quantidade arrecadada
            const itemCollected = document.getElementById('itemCollected').value;
            if (itemCollected && parseInt(itemCollected) < 0) {
                showError('itemCollectedError', 'A quantidade arrecadada não pode ser negativa.');
                isValid = false;
            }
            
            // Validar status
            const itemStatus = document.getElementById('itemStatus').value;
            if (!itemStatus) {
                showError('itemStatusError', 'Por favor, selecione um status.');
                isValid = false;
            }
            
            return isValid;
        }

        // Mostrar mensagem de erro
        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Ocultar todas as mensagens de erro
        function hideAllErrorMessages() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.style.display = 'none';
            });
        }

        // Editar doação
        function editDonation(donationId) {
            openDonationModal(donationId);
        }

        // Confirmar exclusão
        function confirmDelete(donationId) {
            donationToDelete = donationId;
            document.getElementById('deleteModal').style.display = 'block';
        }

        // Fechar modal de exclusão
        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
            donationToDelete = null;
        }

        // Excluir doação
        function deleteDonation(donationId) {
            const index = necessaryDonationsData.findIndex(d => d.id === donationId);
            if (index !== -1) {
                necessaryDonationsData.splice(index, 1);
                applyFilters();
                alert('Doação excluída com sucesso!');
            }
        }

        // Fechar modais ao clicar fora deles
        window.onclick = function(event) {
            const donationModal = document.getElementById('donationModal');
            const deleteModal = document.getElementById('deleteModal');
            
            if (event.target === donationModal) {
                closeDonationModal();
            }
            
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        }