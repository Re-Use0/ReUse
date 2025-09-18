        // Dados de exemplo para os beneficiários
        const beneficiariesData = [
            {
                id: 1,
                name: "Maria Silva",
                type: "individual",
                email: "maria.silva@email.com",
                phone: "(11) 99999-9999",
                address: "Rua das Flores, 123",
                city: "São Paulo",
                state: "SP",
                animals: 5,
                status: "active",
                lastDonation: "15/03/2025"
            },
            {
                id: 2,
                name: "Família Oliveira",
                type: "family",
                email: "familia.oliveira@email.com",
                phone: "(11) 98888-8888",
                address: "Av. Paulista, 456",
                city: "São Paulo",
                state: "SP",
                animals: 12,
                status: "active",
                lastDonation: "10/03/2025"
            },
            {
                id: 3,
                name: "Lar Temporário Felino",
                type: "institution",
                email: "contato@lartemporario.com",
                phone: "(11) 97777-7777",
                address: "Rua dos Gatos, 789",
                city: "São Paulo",
                state: "SP",
                animals: 25,
                status: "active",
                lastDonation: "05/03/2025"
            },
            {
                id: 4,
                name: "João Santos",
                type: "individual",
                email: "joao.santos@email.com",
                phone: "(11) 96666-6666",
                address: "Rua dos Cães, 321",
                city: "São Paulo",
                state: "SP",
                animals: 3,
                status: "inactive",
                lastDonation: "20/02/2025"
            },
            {
                id: 5,
                name: "Família Costa",
                type: "family",
                email: "familia.costa@email.com",
                phone: "(11) 95555-5555",
                address: "Av. Brasil, 654",
                city: "São Paulo",
                state: "SP",
                animals: 8,
                status: "active",
                lastDonation: "18/03/2025"
            },
            {
                id: 6,
                name: "Abrigo Amigo dos Animais",
                type: "institution",
                email: "contato@abrigoamigo.com",
                phone: "(11) 94444-4444",
                address: "Rua dos Animais, 987",
                city: "São Paulo",
                state: "SP",
                animals: 30,
                status: "active",
                lastDonation: "12/03/2025"
            }
        ];

        // Variáveis globais
        let currentPage = 1;
        const itemsPerPage = 5;
        let filteredBeneficiaries = [...beneficiariesData];
        let beneficiaryToDelete = null;

        // Função para inicializar a página
        function initPage() {
            loadBeneficiaries();
            setupEventListeners();
        }

        // Configurar event listeners
        function setupEventListeners() {
            // Filtros
            document.getElementById('status-filter').addEventListener('change', filterBeneficiaries);
            document.getElementById('category-filter').addEventListener('change', filterBeneficiaries);
            document.getElementById('beneficiary-search').addEventListener('input', filterBeneficiaries);
            
            // Paginação
            document.getElementById('prev-page').addEventListener('click', goToPrevPage);
            document.getElementById('next-page').addEventListener('click', goToNextPage);
            
            // Formulário
            document.getElementById('beneficiary-form').addEventListener('submit', saveBeneficiary);
            
            // Confirmação de exclusão
            document.getElementById('confirm-delete').addEventListener('click', deleteBeneficiary);
        }

        // Carregar beneficiários na página
        function loadBeneficiaries() {
            const container = document.getElementById('beneficiaries-container');
            container.innerHTML = '';
            
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const currentBeneficiaries = filteredBeneficiaries.slice(startIndex, endIndex);
            
            if (currentBeneficiaries.length === 0) {
                container.innerHTML = '<div class="no-results">Nenhum beneficiário encontrado.</div>';
            } else {
                currentBeneficiaries.forEach(beneficiary => {
                    const card = createBeneficiaryCard(beneficiary);
                    container.appendChild(card);
                });
            }
            
            updatePagination();
        }

        // Criar card de beneficiário
        function createBeneficiaryCard(beneficiary) {
            const card = document.createElement('div');
            card.className = 'beneficiary-card';
            
            const typeLabels = {
                'individual': 'Indivíduo',
                'family': 'Família',
                'institution': 'Instituição'
            };
            
            card.innerHTML = `
                <div class="beneficiary-header">
                    <h3>${beneficiary.name}</h3>
                    <span class="status-badge ${beneficiary.status}">${beneficiary.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div class="beneficiary-details">
                    <p><strong>Tipo:</strong> ${typeLabels[beneficiary.type]}</p>
                    <p><strong>E-mail:</strong> ${beneficiary.email}</p>
                    <p><strong>Telefone:</strong> ${beneficiary.phone}</p>
                    <p><strong>Endereço:</strong> ${beneficiary.address}, ${beneficiary.city} - ${beneficiary.state}</p>
                    <p><strong>Animais resgatados:</strong> ${beneficiary.animals}</p>
                </div>
                <div class="beneficiary-footer">
                    <span class="last-donation">Última doação: ${beneficiary.lastDonation}</span>
                    <div class="beneficiary-actions">
                        <button class="action-btn view" title="Visualizar" onclick="viewBeneficiary(${beneficiary.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" title="Editar" onclick="editBeneficiary(${beneficiary.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Excluir" onclick="confirmDelete(${beneficiary.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            return card;
        }

        // Filtrar beneficiários
        function filterBeneficiaries() {
            const statusFilter = document.getElementById('status-filter').value;
            const categoryFilter = document.getElementById('category-filter').value;
            const searchTerm = document.getElementById('beneficiary-search').value.toLowerCase();
            
            filteredBeneficiaries = beneficiariesData.filter(beneficiary => {
                // Filtro por status
                if (statusFilter !== 'all' && beneficiary.status !== statusFilter) {
                    return false;
                }
                
                // Filtro por categoria
                if (categoryFilter !== 'all' && beneficiary.type !== categoryFilter) {
                    return false;
                }
                
                // Filtro por busca
                if (searchTerm && !beneficiary.name.toLowerCase().includes(searchTerm) &&
                    !beneficiary.email.toLowerCase().includes(searchTerm) &&
                    !beneficiary.city.toLowerCase().includes(searchTerm)) {
                    return false;
                }
                
                return true;
            });
            
            currentPage = 1;
            loadBeneficiaries();
        }

        // Atualizar controles de paginação
        function updatePagination() {
            const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
            const prevBtn = document.getElementById('prev-page');
            const nextBtn = document.getElementById('next-page');
            const pageInfo = document.getElementById('pagination-info');
            
            pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
            
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        }

        // Navegar para a página anterior
        function goToPrevPage() {
            if (currentPage > 1) {
                currentPage--;
                loadBeneficiaries();
            }
        }

        // Navegar para a próxima página
        function goToNextPage() {
            const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
            
            if (currentPage < totalPages) {
                currentPage++;
                loadBeneficiaries();
            }
        }

        // Abrir modal para adicionar beneficiário
        function openAddBeneficiaryModal() {
            document.getElementById('modal-title').textContent = 'Adicionar Beneficiário';
            document.getElementById('beneficiary-form').reset();
            document.getElementById('beneficiary-id').value = '';
            document.getElementById('beneficiary-status').value = 'active';
            
            const modal = document.getElementById('beneficiary-modal');
            modal.style.display = 'block';
        }

        // Fechar modal
        function closeModal() {
            const modal = document.getElementById('beneficiary-modal');
            modal.style.display = 'none';
        }

        // Fechar modal de confirmação
        function closeConfirmationModal() {
            const modal = document.getElementById('confirmation-modal');
            modal.style.display = 'none';
            beneficiaryToDelete = null;
        }

        // Visualizar beneficiário
        function viewBeneficiary(id) {
            const beneficiary = beneficiariesData.find(b => b.id === id);
            if (beneficiary) {
                // Preencher o formulário com os dados
                document.getElementById('modal-title').textContent = 'Visualizar Beneficiário';
                document.getElementById('beneficiary-id').value = beneficiary.id;
                document.getElementById('beneficiary-name').value = beneficiary.name;
                document.getElementById('beneficiary-type').value = beneficiary.type;
                document.getElementById('beneficiary-email').value = beneficiary.email;
                document.getElementById('beneficiary-phone').value = beneficiary.phone;
                document.getElementById('beneficiary-address').value = beneficiary.address;
                document.getElementById('beneficiary-city').value = beneficiary.city;
                document.getElementById('beneficiary-state').value = beneficiary.state;
                document.getElementById('beneficiary-animals').value = beneficiary.animals;
                document.getElementById('beneficiary-status').value = beneficiary.status;
                
                // Desabilitar todos os campos
                const form = document.getElementById('beneficiary-form');
                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(input => input.disabled = true);
                
                // Esconder botões de ação
                form.querySelector('.form-actions').classList.add('hidden');
                
                // Abrir o modal
                const modal = document.getElementById('beneficiary-modal');
                modal.style.display = 'block';
            }
        }

        // Editar beneficiário
        function editBeneficiary(id) {
            const beneficiary = beneficiariesData.find(b => b.id === id);
            if (beneficiary) {
                // Preencher o formulário com os dados
                document.getElementById('modal-title').textContent = 'Editar Beneficiário';
                document.getElementById('beneficiary-id').value = beneficiary.id;
                document.getElementById('beneficiary-name').value = beneficiary.name;
                document.getElementById('beneficiary-type').value = beneficiary.type;
                document.getElementById('beneficiary-email').value = beneficiary.email;
                document.getElementById('beneficiary-phone').value = beneficiary.phone;
                document.getElementById('beneficiary-address').value = beneficiary.address;
                document.getElementById('beneficiary-city').value = beneficiary.city;
                document.getElementById('beneficiary-state').value = beneficiary.state;
                document.getElementById('beneficiary-animals').value = beneficiary.animals;
                document.getElementById('beneficiary-status').value = beneficiary.status;
                
                // Habilitar todos os campos
                const form = document.getElementById('beneficiary-form');
                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(input => input.disabled = false);
                
                // Mostrar botões de ação
                form.querySelector('.form-actions').classList.remove('hidden');
                
                // Abrir o modal
                const modal = document.getElementById('beneficiary-modal');
                modal.style.display = 'block';
            }
        }

        // Salvar beneficiário (adicionar ou editar)
        function saveBeneficiary(e) {
            e.preventDefault();
            
            const id = document.getElementById('beneficiary-id').value;
            const name = document.getElementById('beneficiary-name').value;
            const type = document.getElementById('beneficiary-type').value;
            const email = document.getElementById('beneficiary-email').value;
            const phone = document.getElementById('beneficiary-phone').value;
            const address = document.getElementById('beneficiary-address').value;
            const city = document.getElementById('beneficiary-city').value;
            const state = document.getElementById('beneficiary-state').value;
            const animals = document.getElementById('beneficiary-animals').value;
            const status = document.getElementById('beneficiary-status').value;
            
            const today = new Date();
            const lastDonation = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
            
            if (id) {
                // Editar beneficiário existente
                const index = beneficiariesData.findIndex(b => b.id === parseInt(id));
                if (index !== -1) {
                    beneficiariesData[index] = {
                        ...beneficiariesData[index],
                        name,
                        type,
                        email,
                        phone,
                        address,
                        city,
                        state,
                        animals: parseInt(animals),
                        status,
                        lastDonation
                    };
                }
            } else {
                // Adicionar novo beneficiário
                const newId = beneficiariesData.length > 0 ? Math.max(...beneficiariesData.map(b => b.id)) + 1 : 1;
                beneficiariesData.push({
                    id: newId,
                    name,
                    type,
                    email,
                    phone,
                    address,
                    city,
                    state,
                    animals: parseInt(animals),
                    status,
                    lastDonation
                });
            }
            
            // Fechar o modal e recarregar a lista
            closeModal();
            filterBeneficiaries();
            
            // Mostrar mensagem de sucesso (poderia ser um toast notification)
            alert(`Beneficiário ${id ? 'atualizado' : 'adicionado'} com sucesso!`);
        }

        // Confirmar exclusão de beneficiário
        function confirmDelete(id) {
            beneficiaryToDelete = id;
            const modal = document.getElementById('confirmation-modal');
            modal.style.display = 'block';
        }

        // Excluir beneficiário
        function deleteBeneficiary() {
            if (beneficiaryToDelete) {
                const index = beneficiariesData.findIndex(b => b.id === beneficiaryToDelete);
                if (index !== -1) {
                    beneficiariesData.splice(index, 1);
                    filterBeneficiaries();
                    alert('Beneficiário excluído com sucesso!');
                }
                closeConfirmationModal();
            }
        }

        // Inicializar a página quando o DOM estiver carregado
        document.addEventListener('DOMContentLoaded', initPage);

        // Fechar modais ao clicar fora deles
        window.onclick = function(event) {
            const modal = document.getElementById('beneficiary-modal');
            const confirmationModal = document.getElementById('confirmation-modal');
            
            if (event.target === modal) {
                closeModal();
            }
            
            if (event.target === confirmationModal) {
                closeConfirmationModal();
            }
        };