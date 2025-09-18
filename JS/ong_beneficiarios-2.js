        // Função para abrir o modal de adicionar beneficiário
        function openAddBeneficiaryModal() {
            document.getElementById('modal-title').textContent = 'Adicionar Beneficiário';
            document.getElementById('beneficiary-form').reset();
            document.getElementById('beneficiary-id').value = '';
            document.getElementById('beneficiary-modal').style.display = 'block';
        }

        // Função para fechar o modal
        function closeModal() {
            document.getElementById('beneficiary-modal').style.display = 'none';
        }

        // Função para abrir o modal de confirmação
        function openConfirmationModal(beneficiaryId) {
            document.getElementById('confirmation-modal').style.display = 'block';
            document.getElementById('confirm-delete').onclick = function() {
                deleteBeneficiary(beneficiaryId);
            };
        }

        // Função para fechar o modal de confirmação
        function closeConfirmationModal() {
            document.getElementById('confirmation-modal').style.display = 'none';
        }

        // Função para excluir beneficiário
        function deleteBeneficiary(id) {
            closeConfirmationModal();
            // Em uma implementação real, aqui você faria uma requisição para o servidor
        }

        // Fechar modais ao clicar fora deles
        window.onclick = function(event) {
            const modal = document.getElementById('beneficiary-modal');
            const confirmModal = document.getElementById('confirmation-modal');
            
            if (event.target === modal) {
                closeModal();
            }
            
            if (event.target === confirmModal) {
                closeConfirmationModal();
            }
        }

        // Manipular envio do formulário
        document.getElementById('beneficiary-form').addEventListener('submit', function(e) {
            e.preventDefault();
            closeModal();
        });

        // Adicionar event listeners para os botões de editar e excluir
        document.addEventListener('DOMContentLoaded', function() {
            const editButtons = document.querySelectorAll('.beneficiary-actions .fa-edit');
            const deleteButtons = document.querySelectorAll('.beneficiary-actions .fa-trash');
            
            editButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Em uma implementação real, preencheria o formulário com os dados do beneficiário
                    document.getElementById('modal-title').textContent = 'Editar Beneficiário';
                    document.getElementById('beneficiary-modal').style.display = 'block';
                });
            });
            
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    openConfirmationModal('123'); // ID do beneficiário
                });
            });
        });


           // Gerenciamento de Beneficiários
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar dados se não existirem
        if (!localStorage.getItem('beneficiaries')) {
            const initialBeneficiaries = [
                {
                    id: 1,
                    name: "Maria Silva",
                    email: "maria.silva@email.com",
                    phone: "(11) 99999-9999",
                    address: "São Paulo, SP",
                    animals: 3,
                    type: "individual",
                    status: "active"
                },
                {
                    id: 2,
                    name: "João Santos",
                    email: "joao.santos@email.com",
                    phone: "(11) 98888-8888",
                    address: "Rio de Janeiro, RJ",
                    animals: 2,
                    type: "individual",
                    status: "active"
                },
                {
                    id: 3,
                    name: "Abrigo Amigo dos Animais",
                    email: "contato@abrigoamigo.com.br",
                    phone: "(11) 97777-7777",
                    address: "Campinas, SP",
                    animals: 15,
                    type: "institution",
                    status: "inactive"
                }
            ];
            localStorage.setItem('beneficiaries', JSON.stringify(initialBeneficiaries));
        }

        // Carregar beneficiários
        loadBeneficiaries();

        // Configurar filtros e busca
        setupFilters();
    });

    // Carregar lista de beneficiários
    function loadBeneficiaries() {
        const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
        const container = document.getElementById('beneficiaries-container');
        
        if (beneficiaries.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhum beneficiário cadastrado.</p>';
            return;
        }

        container.innerHTML = '';
        beneficiaries.forEach(beneficiary => {
            const card = document.createElement('div');
            card.className = 'beneficiary-card';
            card.innerHTML = `
                <div class="beneficiary-info">
                    <h3>${beneficiary.name}</h3>
                    <p><i class="fas fa-envelope"></i> ${beneficiary.email}</p>
                    <p><i class="fas fa-phone"></i> ${beneficiary.phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${beneficiary.address}</p>
                    <p><i class="fas fa-paw"></i> ${beneficiary.animals} animais resgatados</p>
                </div>
                <div class="beneficiary-status ${beneficiary.status}">
                    <span class="status-badge">${beneficiary.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    <div class="beneficiary-actions">
                        <button class="icon-button" title="Editar" onclick="editBeneficiary(${beneficiary.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-button" title="Excluir" onclick="openConfirmationModal(${beneficiary.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Configurar filtros e busca
    function setupFilters() {
        const searchInput = document.getElementById('beneficiary-search');
        const statusFilter = document.getElementById('status-filter');
        const categoryFilter = document.getElementById('category-filter');
        
        const filterFunction = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const statusValue = statusFilter.value;
            const categoryValue = categoryFilter.value;
            
            const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
            const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
                const matchesSearch = beneficiary.name.toLowerCase().includes(searchTerm) || 
                                     beneficiary.email.toLowerCase().includes(searchTerm);
                const matchesStatus = statusValue === 'all' || beneficiary.status === statusValue;
                const matchesCategory = categoryValue === 'all' || beneficiary.type === categoryValue;
                
                return matchesSearch && matchesStatus && matchesCategory;
            });
            
            renderFilteredBeneficiaries(filteredBeneficiaries);
        };
        
        searchInput.addEventListener('input', filterFunction);
        statusFilter.addEventListener('change', filterFunction);
        categoryFilter.addEventListener('change', filterFunction);
    }

    // Renderizar beneficiários filtrados
    function renderFilteredBeneficiaries(beneficiaries) {
        const container = document.getElementById('beneficiaries-container');
        
        if (beneficiaries.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhum beneficiário encontrado.</p>';
            return;
        }

        container.innerHTML = '';
        beneficiaries.forEach(beneficiary => {
            const card = document.createElement('div');
            card.className = 'beneficiary-card';
            card.innerHTML = `
                <div class="beneficiary-info">
                    <h3>${beneficiary.name}</h3>
                    <p><i class="fas fa-envelope"></i> ${beneficiary.email}</p>
                    <p><i class="fas fa-phone"></i> ${beneficiary.phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${beneficiary.address}</p>
                    <p><i class="fas fa-paw"></i> ${beneficiary.animals} animais resgatados</p>
                </div>
                <div class="beneficiary-status ${beneficiary.status}">
                    <span class="status-badge">${beneficiary.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    <div class="beneficiary-actions">
                        <button class="icon-button" title="Editar" onclick="editBeneficiary(${beneficiary.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-button" title="Excluir" onclick="openConfirmationModal(${beneficiary.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Função para excluir beneficiário
    function deleteBeneficiary(id) {
        let beneficiaries = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
        beneficiaries = beneficiaries.filter(beneficiary => beneficiary.id !== id);
        localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
        
        closeConfirmationModal();
        loadBeneficiaries();
        
        // Mostrar mensagem de sucesso
        showNotification('Beneficiário excluído com sucesso!', 'success');
    }

    // Função para editar beneficiário
    function editBeneficiary(id) {
        const beneficiaries = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
        const beneficiary = beneficiaries.find(b => b.id === id);
        
        if (beneficiary) {
            document.getElementById('modal-title').textContent = 'Editar Beneficiário';
            document.getElementById('beneficiary-id').value = beneficiary.id;
            document.getElementById('beneficiary-name').value = beneficiary.name;
            document.getElementById('beneficiary-type').value = beneficiary.type;
            document.getElementById('beneficiary-email').value = beneficiary.email;
            document.getElementById('beneficiary-phone').value = beneficiary.phone;
            document.getElementById('beneficiary-address').value = beneficiary.address;
            
            // Separar cidade e estado do endereço (assumindo formato "Cidade, Estado")
            const addressParts = beneficiary.address.split(', ');
            if (addressParts.length >= 2) {
                document.getElementById('beneficiary-city').value = addressParts[0];
                document.getElementById('beneficiary-state').value = addressParts[1];
            } else {
                document.getElementById('beneficiary-city').value = beneficiary.address;
            }
            
            document.getElementById('beneficiary-animals').value = beneficiary.animals;
            document.getElementById('beneficiary-status').value = beneficiary.status;
            
            document.getElementById('beneficiary-modal').style.display = 'block';
        }
    }

    // Mostrar notificação
    function showNotification(message, type) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Estilizar a notificação
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        
        if (type === 'success') {
            notification.style.background = '#4CAF50';
        } else {
            notification.style.background = '#F44336';
        }
        
        document.body.appendChild(notification);
        
        // Animação de entrada
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Manipular envio do formulário
    document.getElementById('beneficiary-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('beneficiary-id').value;
        const name = document.getElementById('beneficiary-name').value;
        const type = document.getElementById('beneficiary-type').value;
        const email = document.getElementById('beneficiary-email').value;
        const phone = document.getElementById('beneficiary-phone').value;
        const city = document.getElementById('beneficiary-city').value;
        const state = document.getElementById('beneficiary-state').value;
        const animals = document.getElementById('beneficiary-animals').value;
        const status = document.getElementById('beneficiary-status').value;
        
        const address = `${city}, ${state}`;
        
        let beneficiaries = JSON.parse(localStorage.getItem('beneficiaries') || '[]');
        
        if (id) {
            // Editar beneficiário existente
            const index = beneficiaries.findIndex(b => b.id === parseInt(id));
            if (index !== -1) {
                beneficiaries[index] = {
                    ...beneficiaries[index],
                    name,
                    type,
                    email,
                    phone,
                    address,
                    animals: parseInt(animals),
                    status
                };
            }
        } else {
            // Adicionar novo beneficiário
            const newId = beneficiaries.length > 0 ? Math.max(...beneficiaries.map(b => b.id)) + 1 : 1;
            beneficiaries.push({
                id: newId,
                name,
                type,
                email,
                phone,
                address,
                animals: parseInt(animals),
                status
            });
        }
        
        localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
        closeModal();
        loadBeneficiaries();
        
        // Mostrar mensagem de sucesso
        showNotification(`Beneficiário ${id ? 'atualizado' : 'adicionado'} com sucesso!`, 'success');
    });

    // Atualizar a função openConfirmationModal para receber o ID
    function openConfirmationModal(beneficiaryId) {
        document.getElementById('confirmation-modal').style.display = 'block';
        document.getElementById('confirm-delete').onclick = function() {
            deleteBeneficiary(beneficiaryId);
        };
    }