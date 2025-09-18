       // Simples funcionalidade JavaScript para a página de notificações
        document.addEventListener('DOMContentLoaded', function() {
            // Marcar todas como lidas
            document.getElementById('mark-all-read').addEventListener('click', function() {
                const unreadNotifications = document.querySelectorAll('.notification-card.unread');
                unreadNotifications.forEach(notification => {
                    notification.classList.remove('unread');
                });
                alert('Todas as notificações foram marcadas como lidas.');
            });
            
            // Limpar todas as notificações
            document.getElementById('delete-all').addEventListener('click', function() {
                if (confirm('Tem certeza que deseja remover todas as notificações?')) {
                    const notificationList = document.querySelector('.notification-list');
                    notificationList.innerHTML = `
                        <div class="no-notifications">
                            <i class="far fa-bell-slash"></i>
                            <h3>Nenhuma notificação</h3>
                            <p>Quando você tiver novas notificações, elas aparecerão aqui.</p>
                        </div>
                    `;
                }
            });
            
            // Funcionalidade para os botões de cada notificação
            document.querySelectorAll('.notification-actions-card button').forEach(button => {
                button.addEventListener('click', function() {
                    const notificationCard = this.closest('.notification-card');
                    const action = this.textContent.trim();
                    
                    if (action === 'Marcar como lida') {
                        notificationCard.classList.remove('unread');
                        this.textContent = 'Lida';
                        this.style.color = '#4CAF50';
                    } else if (action === 'Remover') {
                        notificationCard.style.opacity = '0';
                        setTimeout(() => {
                            notificationCard.remove();
                            // Verifica se não há mais notificações
                            if (document.querySelectorAll('.notification-card').length === 0) {
                                document.querySelector('.notification-list').innerHTML = `
                                    <div class="no-notifications">
                                        <i class="far fa-bell-slash"></i>
                                        <h3>Nenhuma notificação</h3>
                                        <p>Quando você tiver novas notificações, elas aparecerão aqui.</p>
                                    </div>
                                `;
                            }
                        }, 300);
                    } else if (action === 'Responder') {
                        alert('Redirecionando para a página de mensagens...');
                    } else if (action === 'Ver promoções') {
                        alert('Redirecionando para a página de promoções...');
                    } else if (action === 'Acompanhar pedido') {
                        alert('Redirecionando para o acompanhamento do pedido...');
                    } else if (action === 'Avaliar agora') {
                        alert('Redirecionando para a página de avaliação...');
                    }
                });
            });
        });