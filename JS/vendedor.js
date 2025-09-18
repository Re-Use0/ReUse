        // Modal de Doação
document.addEventListener('DOMContentLoaded', function() {
    const doacaoLink = document.getElementById('doacao-link');
    const doacaoModal = document.getElementById('doacao-modal');
    const successModal = document.getElementById('doacao-success-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const cancelBtn = document.querySelector('.doacao-form .cancel-btn');
    const doacaoForm = document.querySelector('.doacao-form');
    const fecharConfirmacaoBtn = document.getElementById('fechar-confirmacao');
    
    // Definir data mínima como hoje
    const dataRetiradaInput = document.getElementById('data-retirada');
    const hoje = new Date().toISOString().split('T')[0];
    dataRetiradaInput.min = hoje;
    
    // Abrir modal de doação
    doacaoLink.addEventListener('click', function(e) {
        e.preventDefault();
        doacaoModal.style.display = 'flex';
    });
    
    // Fechar modais
    function fecharModal(modal) {
        modal.style.display = 'none';
    }
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            fecharModal(modal);
        });
    });
    
    cancelBtn.addEventListener('click', function() {
        fecharModal(doacaoModal);
    });
    
    fecharConfirmacaoBtn.addEventListener('click', function() {
        fecharModal(successModal);
    });
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            fecharModal(e.target);
        }
    });
    
    // Processar formulário de doação
    doacaoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar data
        const dataSelecionada = new Date(dataRetiradaInput.value);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (dataSelecionada < hoje) {
            alert('A data de retirada não pode ser anterior ao dia atual.');
            return;
        }
        
        // Se tudo estiver válido, mostrar confirmação
        fecharModal(doacaoModal);
        successModal.style.display = 'flex';
        
        // Limpar formulário
        doacaoForm.reset();
    });
});


        // Configuração do gráfico
        document.addEventListener('DOMContentLoaded', function() {
            const ctx = document.getElementById('salesChart').getContext('2d');
            const salesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [
                        {
                            label: 'Vendas',
                            data: [12, 19, 8, 15, 14, 17],
                            backgroundColor: '#2196F3',
                        },
                        {
                            label: 'Doações',
                            data: [5, 3, 6, 4, 7, 5],
                            backgroundColor: '#FF9800',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
