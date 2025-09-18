// night-mode.js - Funcionalidades para modo noturno (MODIFICADO)

// ================ CONFIGURAÇÃO DO MODO NOTURNO ================

/**
 * Alterna entre modo claro e escuro
 */
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeToggle = document.getElementById('themeToggle');
    
    // Adicionar animação de rotação
    themeToggle.style.pointerEvents = 'none';
    themeIcon.style.transform = 'rotate(360deg)';
    themeIcon.style.opacity = '0.7';
    
    setTimeout(() => {
        if (body.classList.contains('night-mode')) {
            // Mudar para modo claro
            body.classList.remove('night-mode');
            themeIcon.classList.remove('bi-moon-fill');
            themeIcon.classList.add('bi-sun-fill');
            localStorage.setItem('theme', 'light');
        } else {
            // Mudar para modo escuro
            body.classList.add('night-mode');
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-fill');
            localStorage.setItem('theme', 'dark');
        }
        
        // Resetar animação
        themeIcon.style.transform = 'rotate(0deg)';
        themeIcon.style.opacity = '1';
        
        setTimeout(() => {
            themeToggle.style.pointerEvents = 'auto';
        }, 300);
    }, 300);
}

/**
 * Carrega o tema salvo ou detecta com base no horário
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const currentHour = new Date().getHours();
    const themeIcon = document.getElementById('themeIcon');
    
    // Se não houver preferência salva, detectar com base no horário
    if (!savedTheme) {
        // Se for noite (entre 18h e 6h), aplicar modo escuro
        if (currentHour >= 18 || currentHour < 6) {
            document.body.classList.add('night-mode');
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-fill');
        }
    } else if (savedTheme === 'dark') {
        document.body.classList.add('night-mode');
        themeIcon.classList.remove('bi-sun-fill');
        themeIcon.classList.add('bi-moon-fill');
    }
}

// ================ SISTEMA DE NOTIFICAÇÕES ================

/**
 * Exibe uma notificação temporária
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de notificação (success, error, info)
 * @param {number} duration - Duração em milissegundos (padrão: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    // Estilos baseados no tipo
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#3498db';
        notification.style.color = 'white';
    }
    
    // Adicionar ao corpo
    document.body.appendChild(notification);
    
    // Remover após a duração especificada
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, duration);
}

// ================ VERIFICAÇÃO DE CONFLITO DE SCRIPTS ================

/**
 * Verifica se o script Favoritar.js já está carregado
 * para evitar conflito de funcionalidades
 */
function checkForFavoritesScript() {
    // Verificar se o script de favoritos já está carregado
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('Favoritar.js') || 
            scripts[i].getAttribute('src') === 'JS/Favoritar.js') {
            return true;
        }
    }
    return false;
}

// ================ SISTEMA DE FAVORITOS (APENAS SE NECESSÁRIO) ================

/**
 * Configura os botões de favoritar apenas se o script específico não estiver carregado
 */
function setupFavoriteButtonsIfNeeded() {
    // Não configurar favoritos se o script especializado já existir
    if (checkForFavoritesScript()) {
        console.log('Script de favoritos detectado - ignorando configuração duplicada');
        return;
    }
    
    const favoriteButtons = document.querySelectorAll('.favorite-btn, .favorite-btn-bottom');
    
    favoriteButtons.forEach(button => {
        // Verificar se já tem um listener para evitar duplicação
        if (button.hasAttribute('data-favorite-listener')) {
            return;
        }
        
        button.setAttribute('data-favorite-listener', 'true');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-id');
            const isActive = this.classList.contains('active');
            
            // Alternar estado
            if (isActive) {
                this.classList.remove('active');
                // Remover dos favoritos
                localStorage.removeItem(`favorite_${productId}`);
            } else {
                this.classList.add('active');
                // Adicionar aos favoritos
                localStorage.setItem(`favorite_${productId}`, 'true');
                
                // Animação de confirmação
                const heartIcon = this.querySelector('i');
                if (heartIcon) {
                    heartIcon.classList.remove('bi-heart');
                    heartIcon.classList.add('bi-heart-fill');
                }
            }
            
            // Atualizar todos os botões do mesmo produto
            document.querySelectorAll(`[data-id="${productId}"]`).forEach(btn => {
                if (btn !== this) {
                    if (isActive) {
                        btn.classList.remove('active');
                        const icon = btn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('bi-heart-fill');
                            icon.classList.add('bi-heart');
                        }
                    } else {
                        btn.classList.add('active');
                        const icon = btn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('bi-heart');
                            icon.classList.add('bi-heart-fill');
                        }
                    }
                }
            });
        });
    });
    
    // Carregar estado dos favoritos
    loadFavoriteStatesIfNeeded();
}

/**
 * Carrega o estado dos favoritos do localStorage apenas se necessário
 */
function loadFavoriteStatesIfNeeded() {
    // Não carregar se o script especializado já existir
    if (checkForFavoritesScript()) {
        return;
    }
    
    const favoriteButtons = document.querySelectorAll('.favorite-btn, .favorite-btn-bottom');
    
    favoriteButtons.forEach(button => {
        const productId = button.getAttribute('data-id');
        if (localStorage.getItem(`favorite_${productId}`) === 'true') {
            button.classList.add('active');
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
            }
        }
    });
}

// ================ INICIALIZAÇÃO ================

/**
 * Inicializa todas as funcionalidades do modo noturno
 */
function initializeNightMode() {
    // Carregar tema
    loadTheme();
    
    // Configurar botão de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Configurar botões de favorito apenas se necessário
    setupFavoriteButtonsIfNeeded();
    
    // Verificar se há produtos para mostrar notificação
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('favorited') === 'true') {
        showNotification('Produto adicionado aos favoritos!', 'success');
    }
}

// ================ EVENT LISTENERS ================

// Inicializar quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNightMode);
} else {
    initializeNightMode();
}

// ================ FUNÇÕES AUXILIARES ================

/**
 * Verifica se o modo noturno está ativo
 * @returns {boolean} True se o modo noturno estiver ativo
 */
function isNightMode() {
    return document.body.classList.contains('night-mode');
}

/**
 * Alterna o modo noturno com base em uma condição
 * @param {boolean} enable - True para ativar modo noturno, false para desativar
 */
function setNightMode(enable) {
    const themeIcon = document.getElementById('themeIcon');
    
    if (enable && !isNightMode()) {
        document.body.classList.add('night-mode');
        themeIcon.classList.remove('bi-sun-fill');
        themeIcon.classList.add('bi-moon-fill');
        localStorage.setItem('theme', 'dark');
    } else if (!enable && isNightMode()) {
        document.body.classList.remove('night-mode');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
        localStorage.setItem('theme', 'light');
    }
}

// ================ EXPORTAÇÃO PARA USO EM OUTROS ARQUIVOS ================

// Torna as funções disponíveis globalmente se necessário
window.NightMode = {
    toggleTheme,
    loadTheme,
    showNotification,
    isNightMode,
    setNightMode
};