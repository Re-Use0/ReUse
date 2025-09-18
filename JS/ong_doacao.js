        // Dados de exemplo para as doações
        const donationsData = [
            {
                id: 1,
                date: "15/05/2025",
                status: "received",
                items: [
                    { name: "Cobertores", quantity: "7 peças", category: "blankets" },
                    { name: "Roupas", quantity: "4 peças", category: "clothing" },
                    { name: "Brinquedos", quantity: "12 unidades", category: "toys" }
                ],
                donor: "Maria Silva",
                donorContact: "maria.silva@email.com",
                donorPhone: "(11) 99999-9999",
                address: "Rua das Flores, 123 - São Paulo/SP",
                notes: "Doação em perfeito estado. Entregue pessoalmente."
            },
            {
                id: 2,
                date: "12/05/2025",
                status: "received",
                items: [
                    { name: "Roupas", quantity: "9 peças", category: "clothing" },
                    { name: "Produtos de Higiene", quantity: "10 unidades", category: "hygiene" }
                ],
                donor: "João Oliveira",
                donorContact: "joao.oliveira@email.com",
                donorPhone: "(11) 98888-8888",
                address: "Av. Paulista, 1000 - São Paulo/SP",
                notes: "Doação entregue via correio."
            },
            {
                id: 3,
                date: "10/05/2025",
                status: "pending",
                items: [
                    { name: "Roupas", quantity: "5 peças", category: "clothing" },
                    { name: "Ração", quantity: "3 kg", category: "food" }
                ],
                donor: "Ana Santos",
                donorContact: "ana.santos@email.com",
                donorPhone: "(11) 97777-7777",
                address: "Rua Augusta, 500 - São Paulo/SP",
                notes: "Aguardando confirmação de data para retirada."
            },
            {
                id: 4,
                date: "08/05/2025",
                status: "scheduled",
                items: [
                    { name: "Cobertores", quantity: "3 peças", category: "blankets" },
                    { name: "Brinquedos", quantity: "8 unidades", category: "toys" }
                ],
                donor: "Pedro Costa",
                donorContact: "pedro.costa@email.com",
                donorPhone: "(11) 96666-6666",
                address: "Rua Vergueiro, 2000 - São Paulo/SP",
                notes: "Retirada agendada para 12/05/2025 às 14h."
            },
            {
                id: 5,
                date: "05/05/2025",
                status: "received",
                items: [
                    { name: "Produtos de Higiene", quantity: "15 unidades", category: "hygiene" },
                    { name: "Roupas", quantity: "6 peças", category: "clothing" }
                ],
                donor: "Carla Mendes",
                donorContact: "carla.mendes@email.com",
                donorPhone: "(11) 95555-5555",
                address: "Alameda Santos, 800 - São Paulo/SP",
                notes: "Doação em ótimo estado. Entregue na sede."
            },
            {
                id: 6,
                date: "02/05/2025",
                status: "received",
                items: [
                    { name: "Roupas", quantity: "12 peças", category: "clothing" },
                    { name: "Brinquedos", quantity: "5 unidades", category: "toys" }
                ],
                donor: "Marcos Silva",
                donorContact: "marcos.silva@email.com",
                donorPhone: "(11) 94444-4444",
                address: "Rua da Consolação, 1500 - São Paulo/SP",
                notes: "Doação entregue pelo motorista de aplicativo."
            },
            {
                id: 7,
                date: "28/04/2025",
                status: "pending",
                items: [
                    { name: "Ração", quantity: "5 kg", category: "food" },
                    { name: "Produtos de Higiene", quantity: "8 unidades", category: "hygiene" }
                ],
                donor: "Fernanda Lima",
                donorContact: "fernanda.lima@email.com",
                donorPhone: "(11) 93333-3333",
                address: "Rua Oscar Freire, 700 - São Paulo/SP",
                notes: "Aguardando confirmação de disponibilidade para entrega."
            },
            {
                id: 8,
                date: "25/04/2025",
                status: "scheduled",
                items: [
                    { name: "Cobertores", quantity: "4 peças", category: "blankets" },
                    { name: "Roupas", quantity: "10 peças", category: "clothing" }
                ],
                donor: "Ricardo Almeida",
                donorContact: "ricardo.almeida@email.com",
                donorPhone: "(11) 92222-2222",
                address: "Av. Brigadeiro Faria Lima, 2000 - São Paulo/SP",
                notes: "Retirada agendada para 30/04/2025 às 10h."
            }
        ];

        // Variáveis globais
        let currentPage = 1;
        const donationsPerPage = 4;
        let filteredDonations = [...donationsData];

        // Elementos DOM
        const donationsContainer = document.getElementById('donations-container');
        const statusFilter = document.getElementById('status-filter');
        const dateFilter = document.getElementById('date-filter');
        const categoryFilter = document.getElementById('category-filter');
        const filterButton = document.getElementById('filter-button');
        const prevPageButton = document.getElementById('prev-page');
        const nextPageButton = document.getElementById('next-page');
        const pageButtonsContainer = document.getElementById('page-buttons');
        const detailsModal = document.getElementById('details-modal');
        const donationDetails = document.getElementById('donation-details');
        const closeModal = document.querySelector('.close');
        const toast = document.getElementById('toast');

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            // Destacar a página ativa no menu
            const currentPage = window.location.pathname.split('/').pop();
            const menuItems = document.querySelectorAll('.sidebar-nav a');
            
            menuItems.forEach(item => {
                if (item.getAttribute('href') === currentPage) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Carregar doações
            renderDonations();
            setupPagination();

            // Event Listeners
            filterButton.addEventListener('click', applyFilters);
            prevPageButton.addEventListener('click', () => changePage(currentPage - 1));
            nextPageButton.addEventListener('click', () => changePage(currentPage + 1));
            closeModal.addEventListener('click', () => detailsModal.style.display = 'none');
            
            // Fechar modal ao clicar fora dele
            window.addEventListener('click', (event) => {
                if (event.target === detailsModal) {
                    detailsModal.style.display = 'none';
                }
            });
        });

        // Função para renderizar as doações
        function renderDonations() {
            donationsContainer.innerHTML = '';
            
            const startIndex = (currentPage - 1) * donationsPerPage;
            const endIndex = startIndex + donationsPerPage;
            const donationsToShow = filteredDonations.slice(startIndex, endIndex);
            
            if (donationsToShow.length === 0) {
                donationsContainer.innerHTML = '<p class="no-results">Nenhuma doação encontrada com os filtros selecionados.</p>';
                return;
            }
            
            donationsToShow.forEach(donation => {
                const donationCard = document.createElement('div');
                donationCard.className = 'donation-card';
                
                // Definir cor do status
                let statusColor = '';
                let statusText = '';
                
                switch(donation.status) {
                    case 'received':
                        statusColor = '#4CAF50';
                        statusText = 'Recebida';
                        break;
                    case 'pending':
                        statusColor = '#FF9800';
                        statusText = 'Pendente';
                        break;
                    case 'scheduled':
                        statusColor = '#2196F3';
                        statusText = 'Agendada';
                        break;
                }
                
                donationCard.innerHTML = `
                    <div class="donation-header">
                        <span class="donation-date">${donation.date}</span>
                        <span class="donation-status" style="background-color: ${statusColor};">${statusText}</span>
                    </div>
                    <div class="donation-items">
                        <h3>Itens doados:</h3>
                        <ul>
                            ${donation.items.map(item => `<li>${item.name} - ${item.quantity}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="donation-donor">
                        <p><strong>Doador:</strong> ${donation.donor}</p>
                    </div>
                    <div class="donation-actions">
                        <button class="details-button" data-id="${donation.id}">
                            <i class="fas fa-eye"></i> Ver detalhes
                        </button>
                        ${donation.status !== 'received' ? `
                        <button class="confirm-button" data-id="${donation.id}">
                            <i class="fas fa-check"></i> Confirmar recebimento
                        </button>
                        ` : ''}
                    </div>
                `;
                
                donationsContainer.appendChild(donationCard);
            });
            
            // Adicionar event listeners aos botões
            document.querySelectorAll('.details-button').forEach(button => {
                button.addEventListener('click', () => showDonationDetails(button.dataset.id));
            });
            
            document.querySelectorAll('.confirm-button').forEach(button => {
                button.addEventListener('click', () => confirmDonationReceipt(button.dataset.id));
            });
        }

        // Função para configurar a paginação
        function setupPagination() {
            const pageCount = Math.ceil(filteredDonations.length / donationsPerPage);
            pageButtonsContainer.innerHTML = '';
            
            // Atualizar estado dos botões de navegação
            prevPageButton.disabled = currentPage === 1;
            nextPageButton.disabled = currentPage === pageCount || pageCount === 0;
            
            // Criar botões de página
            for (let i = 1; i <= pageCount; i++) {
                const pageButton = document.createElement('button');
                pageButton.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
                pageButton.textContent = i;
                pageButton.addEventListener('click', () => changePage(i));
                pageButtonsContainer.appendChild(pageButton);
            }
        }

        // Função para mudar de página
        function changePage(page) {
            const pageCount = Math.ceil(filteredDonations.length / donationsPerPage);
            
            if (page < 1 || page > pageCount) return;
            
            currentPage = page;
            renderDonations();
            setupPagination();
            
            // Scroll para o topo da lista
            donationsContainer.scrollIntoView({ behavior: 'smooth' });
        }

        // Função para aplicar filtros
        function applyFilters() {
            const statusValue = statusFilter.value;
            const dateValue = dateFilter.value;
            const categoryValue = categoryFilter.value;
            
            filteredDonations = donationsData.filter(donation => {
                // Filtro por status
                if (statusValue !== 'all' && donation.status !== statusValue) {
                    return false;
                }
                
                // Filtro por categoria
                if (categoryValue !== 'all') {
                    const hasCategory = donation.items.some(item => item.category === categoryValue);
                    if (!hasCategory) return false;
                }
                
                // Filtro por data (simplificado para demonstração)
                if (dateValue !== 'all') {
                    // Implementação básica para demonstração
                    const donationDate = new Date(donation.date.split('/').reverse().join('-'));
                    const today = new Date();
                    
                    if (dateValue === 'week') {
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(today.getDate() - 7);
                        if (donationDate < oneWeekAgo) return false;
                    } else if (dateValue === 'month') {
                        const oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(today.getMonth() - 1);
                        if (donationDate < oneMonthAgo) return false;
                    } else if (dateValue === 'quarter') {
                        const threeMonthsAgo = new Date();
                        threeMonthsAgo.setMonth(today.getMonth() - 3);
                        if (donationDate < threeMonthsAgo) return false;
                    } else if (dateValue === 'year') {
                        const oneYearAgo = new Date();
                        oneYearAgo.setFullYear(today.getFullYear() - 1);
                        if (donationDate < oneYearAgo) return false;
                    }
                }
                
                return true;
            });
            
            currentPage = 1;
            renderDonations();
            setupPagination();
        }

        // Função para mostrar detalhes da doação
        function showDonationDetails(id) {
            const donation = donationsData.find(d => d.id === parseInt(id));
            
            if (!donation) return;
            
            // Definir texto do status
            let statusText = '';
            switch(donation.status) {
                case 'received':
                    statusText = 'Recebida';
                    break;
                case 'pending':
                    statusText = 'Pendente';
                    break;
                case 'scheduled':
                    statusText = 'Agendada';
                    break;
            }
            
            donationDetails.innerHTML = `
                <div class="detail-item">
                    <span><strong>Data:</strong></span>
                    <span>${donation.date}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Status:</strong></span>
                    <span>${statusText}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Doador:</strong></span>
                    <span>${donation.donor}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Contato:</strong></span>
                    <span>${donation.donorContact}<br>${donation.donorPhone}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Endereço:</strong></span>
                    <span>${donation.address}</span>
                </div>
                <div class="detail-item">
                    <span><strong>Itens doados:</strong></span>
                    <span>
                        ${donation.items.map(item => `${item.name} - ${item.quantity}`).join('<br>')}
                    </span>
                </div>
                <div class="detail-item">
                    <span><strong>Observações:</strong></span>
                    <span>${donation.notes}</span>
                </div>
            `;
            
            detailsModal.style.display = 'block';
        }

        // Função para confirmar recebimento de doação
        function confirmDonationReceipt(id) {
            const donationIndex = donationsData.findIndex(d => d.id === parseInt(id));
            
            if (donationIndex === -1) return;
            
            // Atualizar status para recebido
            donationsData[donationIndex].status = 'received';
            
            // Mostrar mensagem de sucesso
            showToast('Doação marcada como recebida com sucesso!');
            
            // Reaplicar filtros e renderizar novamente
            applyFilters();
        }

        // Função para mostrar notificação toast
        function showToast(message) {
            toast.textContent = message;
            toast.className = 'toast show';
            
            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }