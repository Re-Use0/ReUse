// Notificação.js - Gerenciamento de notificações
document.addEventListener('DOMContentLoaded', function() {
    // Carrega notificações do localStorage
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // Função para renderizar notificações
    function renderNotifications() {
        const notificationList = document.querySelector('.notification-list');
        const noNotifications = document.querySelector('.no-notifications');
        
        if (!notificationList) return;
        
        // Limpa a lista atual
        notificationList.innerHTML = '';
        
        // Se não houver notificações, mostra mensagem
        if (notifications.length === 0) {
            if (noNotifications) {
                noNotifications.style.display = 'block';
            } else {
                notificationList.innerHTML = `
                    <div class="no-notifications">
                        <i class="far fa-bell-slash"></i>
                        <h3>Nenhuma notificação</h3>
                        <p>Quando você tiver novas notificações, elas aparecerão aqui.</p>
                    </div>
                `;
            }
            return;
        }
        
        // Esconde mensagem de nenhuma notificação
        if (noNotifications) noNotifications.style.display = 'none';
        
        // Ordena notificações por data (mais recente primeiro)
        notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Renderiza cada notificação
        notifications.forEach(notification => {
            const notificationCard = document.createElement('div');
            notificationCard.className = `notification-card ${notification.read ? '' : 'unread'}`;
            
            notificationCard.innerHTML = `
                <div class="notification-icon">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-footer">
                        <div class="notification-time">${formatNotificationDate(notification.date)}</div>
                        <div class="notification-actions-card">
                            <button class="btn-mark-read"><i class="far fa-check-circle"></i> Marcar como lida</button>
                            <button class="btn-remove"><i class="far fa-trash-alt"></i> Remover</button>
                            ${notification.action ? `<button class="btn-primary">${notification.action.text}</button>` : ''}
                        </div>
                    </div>
                </div>
                ${notification.read ? '' : '<div class="unread-badge"></div>'}
            `;
            
            notificationList.appendChild(notificationCard);
        });
        
        // Atualiza contador de não lidas
        updateUnreadCount();
        
        // Adiciona event listeners aos botões
        addNotificationEventListeners();
    }
    
    // Função para formatar a data da notificação
    function formatNotificationDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
            return `Hoje, ${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
        } else if (diffInHours < 48) {
            return `Ontem, ${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}`;
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    // Função para atualizar contador de não lidas
    function updateUnreadCount() {
        const unreadCount = notifications.filter(n => !n.read).length;
        const unreadElement = document.querySelector('.unread-count');
        
        if (unreadElement) {
            unreadElement.textContent = `${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}`;
        }
    }
    
    // Função para adicionar event listeners aos botões
    function addNotificationEventListeners() {
        // Marcar como lida
        document.querySelectorAll('.btn-mark-read').forEach(button => {
            button.addEventListener('click', function() {
                const notificationCard = this.closest('.notification-card');
                const notificationIndex = Array.from(document.querySelectorAll('.notification-card')).indexOf(notificationCard);
                
                if (notificationIndex !== -1) {
                    notifications[notificationIndex].read = true;
                    localStorage.setItem('notifications', JSON.stringify(notifications));
                    renderNotifications();
                }
            });
        });
        
        // Remover notificação
        document.querySelectorAll('.btn-remove').forEach(button => {
            button.addEventListener('click', function() {
                const notificationCard = this.closest('.notification-card');
                const notificationIndex = Array.from(document.querySelectorAll('.notification-card')).indexOf(notificationCard);
                
                if (notificationIndex !== -1) {
                    notifications.splice(notificationIndex, 1);
                    localStorage.setItem('notifications', JSON.stringify(notifications));
                    renderNotifications();
                }
            });
        });
    }
    
    // Marcar todas como lidas
    const markAllReadButton = document.getElementById('mark-all-read');
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', function() {
            notifications.forEach(notification => {
                notification.read = true;
            });
            localStorage.setItem('notifications', JSON.stringify(notifications));
            renderNotifications();
        });
    }
    
    // Limpar todas as notificações
    const deleteAllButton = document.getElementById('delete-all');
    if (deleteAllButton) {
        deleteAllButton.addEventListener('click', function() {
            notifications = [];
            localStorage.setItem('notifications', JSON.stringify(notifications));
            renderNotifications();
        });
    }
    
    // Inicializa a renderização
    renderNotifications();
});

// Função para adicionar uma nova notificação
function addNotification(title, message, icon = 'fas fa-bell', action = null) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    const newNotification = {
        id: Date.now(),
        title,
        message,
        icon,
        date: new Date().toISOString(),
        read: false,
        action
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Atualiza o contador no ícone de notificação
    updateNotificationBadge();
    
    return newNotification;
}

// Função para atualizar o badge de notificações
function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    const badgeElement = document.querySelector('.notification-badge');
    
    if (badgeElement) {
        badgeElement.textContent = unreadCount > 0 ? unreadCount : '';
        badgeElement.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Chamar esta função quando a página é carregada para inicializar o badge
document.addEventListener('DOMContentLoaded', updateNotificationBadge);