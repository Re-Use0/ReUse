// Perfil.js - Gerenciamento completo do perfil do usuário (versão atualizada)

class ProfileManager {
    constructor() {
        this.initProfilePicture();
        this.profileNavigation = new ProfileNavigation();
        this.passwordManager = new PasswordManager();
        this.addressManager = new AddressManager();
        this.ordersManager = new OrdersManager();
        this.favoritesManager = new FavoritesManager();
        this.securityManager = new SecurityManager();
        this.notificationsManager = new NotificationsManager();
        this.paymentsManager = new PaymentsManager();
    }

    initProfilePicture() {
        const profilePicInput = document.getElementById('profile-picture-input');
        if (profilePicInput) {
            profilePicInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('profile-picture').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
}

class ProfileNavigation {
    constructor() {
        this.currentSection = 'personal-info';
        this.initElements();
        this.setupEventListeners();
        this.showInitialSection();
    }

    initElements() {
        this.menuLinks = document.querySelectorAll('.profile-menu a');
        this.sections = document.querySelectorAll('.profile-section');
    }

    setupEventListeners() {
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    showInitialSection() {
        const activeLink = document.querySelector('.profile-menu a.active');
        const initialSection = activeLink ? activeLink.getAttribute('data-section') : 'personal-info';
        this.showSection(initialSection);
    }

    showSection(sectionId) {
        // Atualiza o menu ativo
        this.menuLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
        });

        // Atualiza a seção visível
        this.sections.forEach(section => {
            const isActive = section.id === `${sectionId}-section`;
            section.classList.toggle('active', isActive);
            section.style.display = isActive ? 'block' : 'none';
        });

        this.currentSection = sectionId;
        
        // Rola suavemente para o topo da seção
        const activeSection = document.getElementById(`${sectionId}-section`);
        if (activeSection) {
            activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

class PasswordManager {
    constructor() {
        this.isEditing = false;
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.passwordInput = document.getElementById('user-password-input');
        this.editButton = document.getElementById('edit-password-btn');
        this.toggleBtn = document.querySelector('.toggle-password');
        this.saveBtn = document.querySelector('.info-actions .btn-save');
        this.cancelBtn = document.querySelector('.info-actions .btn-cancel');
    }

    setupEventListeners() {
        if (this.editButton) {
            this.editButton.addEventListener('click', () => this.togglePasswordEdit());
        }

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.togglePasswordVisibility());
        }

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.savePassword());
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.cancelEditing());
        }
    }

    togglePasswordEdit() {
        if (this.isEditing) {
            this.savePassword();
        } else {
            this.startEditing();
        }
    }

    startEditing() {
        this.isEditing = true;
        this.passwordInput.disabled = false;
        this.passwordInput.value = '';
        this.passwordInput.type = 'password';
        this.passwordInput.focus();
        
        if (this.editButton) {
            this.editButton.innerHTML = '<i class="fas fa-save"></i> Salvar';
        }
        
        if (this.toggleBtn) {
            this.toggleBtn.style.display = 'block';
        }
        
        document.querySelector('.info-actions').style.display = 'flex';
    }

    togglePasswordVisibility() {
        if (!this.isEditing) return;
        
        if (this.passwordInput.type === 'password') {
            this.passwordInput.type = 'text';
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            }
        } else {
            this.passwordInput.type = 'password';
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            }
        }
    }

    savePassword() {
        const newPassword = this.passwordInput.value;
        
        if (!this.validatePassword(newPassword)) {
            return;
        }
        
        // Simulação de envio para o servidor
        setTimeout(() => {
            this.showAlert('Senha alterada com sucesso!', 'success');
            this.exitEditing();
        }, 1000);
    }

    validatePassword(password) {
        if (password.length < 8) {
            this.showAlert('A senha deve ter pelo menos 8 caracteres', 'error');
            return false;
        }
        
        if (!/[A-Z]/.test(password)) {
            this.showAlert('A senha deve conter pelo menos uma letra maiúscula', 'error');
            return false;
        }
        
        if (!/[0-9]/.test(password)) {
            this.showAlert('A senha deve conter pelo menos um número', 'error');
            return false;
        }
        
        if (!/[!@#$%^&*]/.test(password)) {
            this.showAlert('A senha deve conter pelo menos um símbolo (!@#$%^&*)', 'error');
            return false;
        }
        
        return true;
    }

    cancelEditing() {
        this.exitEditing();
        this.showAlert('Alterações não salvas', 'warning');
    }

    exitEditing() {
        this.isEditing = false;
        this.passwordInput.disabled = true;
        this.passwordInput.value = '••••••••';
        this.passwordInput.type = 'password';
        
        if (this.editButton) {
            this.editButton.innerHTML = '<i class="fas fa-pencil-alt"></i> Alterar';
        }
        
        if (this.toggleBtn) {
            this.toggleBtn.style.display = 'none';
        }
        
        document.querySelector('.info-actions').style.display = 'none';
    }

    showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.body.appendChild(alertBox);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }
}

class AddressManager {
    constructor() {
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.addressList = document.querySelector('.address-list');
        this.addressForm = document.querySelector('.address-form');
        this.btnAddAddress = document.querySelector('.btn-add-address');
        this.btnSaveAddress = this.addressForm?.querySelector('.btn-save');
        this.btnCancelAddress = this.addressForm?.querySelector('.btn-cancel');
    }

    setupEventListeners() {
        if (this.btnAddAddress) {
            this.btnAddAddress.addEventListener('click', () => this.showAddressForm());
        }

        if (this.btnCancelAddress) {
            this.btnCancelAddress.addEventListener('click', () => this.hideAddressForm());
        }

        if (this.btnSaveAddress) {
            this.btnSaveAddress.addEventListener('click', () => this.saveAddress());
        }

        // Delegation for dynamic elements
        this.addressList?.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) {
                this.editAddress(e);
            } else if (e.target.closest('.delete-btn')) {
                this.deleteAddress(e);
            }
        });
    }

    showAddressForm() {
        if (this.addressForm) {
            this.addressForm.style.display = 'block';
            this.btnSaveAddress.textContent = 'Salvar Endereço';
            this.btnSaveAddress.onclick = () => this.saveAddress();
        }
        if (this.btnAddAddress) {
            this.btnAddAddress.style.display = 'none';
        }
    }

    hideAddressForm() {
        if (this.addressForm) {
            this.addressForm.style.display = 'none';
            this.addressForm.reset();
        }
        if (this.btnAddAddress) {
            this.btnAddAddress.style.display = 'block';
        }
    }

    saveAddress() {
        const formData = this.getAddressFormData();
        
        if (!this.validateAddress(formData)) {
            return;
        }
        
        const addressCard = this.createAddressCard(formData);
        
        if (this.addressList && this.btnAddAddress) {
            this.addressList.insertBefore(addressCard, this.btnAddAddress);
        }
        
        this.hideAddressForm();
        this.showAlert('Endereço salvo com sucesso!', 'success');
    }

    getAddressFormData() {
        return {
            name: document.getElementById('address-name')?.value || 'Meu Endereço',
            cep: document.getElementById('address-cep')?.value || '',
            street: document.getElementById('address-street')?.value || '',
            number: document.getElementById('address-number')?.value || '',
            complement: document.getElementById('address-complement')?.value || '',
            city: document.getElementById('address-city')?.value || '',
            state: document.getElementById('address-state')?.value || '',
            phone: document.getElementById('address-phone')?.value || ''
        };
    }

    validateAddress(data) {
        if (!data.cep || !data.street || !data.number || !data.city || !data.state) {
            this.showAlert('Por favor, preencha todos os campos obrigatórios', 'error');
            return false;
        }
        return true;
    }

    createAddressCard(data) {
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        addressCard.innerHTML = `
            <div class="address-header">
                <h3>${data.name}</h3>
                <div class="address-actions">
                    <button class="edit-btn"><i class="fas fa-pencil-alt"></i> Editar</button>
                    <button class="delete-btn"><i class="fas fa-trash"></i> Remover</button>
                </div>
            </div>
            <div class="address-details">
                <p>William Wallace do Carmo</p>
                <p>${data.street}, ${data.number} ${data.complement ? ' - ' + data.complement : ''}</p>
                <p>${data.city} - ${data.state}, ${data.cep}</p>
                <p>Brasil</p>
                <p>Telefone: ${data.phone || '(16) 99713-9654'}</p>
            </div>
        `;
        return addressCard;
    }

    editAddress(e) {
        const addressCard = e.target.closest('.address-card');
        const addressDetails = addressCard.querySelector('.address-details');
        
        const formData = {
            name: addressCard.querySelector('.address-header h3').textContent,
            street: addressDetails.children[1].textContent.split(',')[0].trim(),
            number: addressDetails.children[1].textContent.split(',')[1].trim().split(' ')[0],
            complement: addressDetails.children[1].textContent.includes(' - ') ? 
                addressDetails.children[1].textContent.split(' - ')[1] : '',
            city: addressDetails.children[2].textContent.split(' - ')[0].trim(),
            state: addressDetails.children[2].textContent.split(' - ')[1].split(',')[0].trim(),
            cep: addressDetails.children[2].textContent.split(',')[1].trim(),
            phone: addressDetails.children[4].textContent.split(':')[1].trim()
        };
        
        // Preenche o formulário
        document.getElementById('address-name').value = formData.name;
        document.getElementById('address-street').value = formData.street;
        document.getElementById('address-number').value = formData.number;
        document.getElementById('address-complement').value = formData.complement;
        document.getElementById('address-city').value = formData.city;
        document.getElementById('address-state').value = formData.state;
        document.getElementById('address-cep').value = formData.cep;
        document.getElementById('address-phone').value = formData.phone;
        
        this.showAddressForm();
        
        // Atualiza o botão para salvar as alterações
        this.btnSaveAddress.textContent = 'Atualizar Endereço';
        this.btnSaveAddress.onclick = () => {
            const newData = this.getAddressFormData();
            if (this.validateAddress(newData)) {
                const newCard = this.createAddressCard(newData);
                addressCard.replaceWith(newCard);
                this.hideAddressForm();
                this.showAlert('Endereço atualizado com sucesso!', 'success');
            }
        };
    }

    deleteAddress(e) {
        if (confirm('Tem certeza que deseja remover este endereço?')) {
            const addressCard = e.target.closest('.address-card');
            addressCard.remove();
            this.showAlert('Endereço removido com sucesso!', 'success');
        }
    }

    showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.getElementById('addresses-section').appendChild(alertBox);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }
}

class OrdersManager {
    constructor() {
        this.initElements();
        this.setupEventListeners();
        this.filterOrders('all');
    }

    initElements() {
        this.orderFilter = document.getElementById('order-filter');
        this.ordersList = document.querySelector('.orders-list');
        this.ordersEmpty = document.querySelector('.orders-empty');
    }

    setupEventListeners() {
        if (this.orderFilter) {
            this.orderFilter.addEventListener('change', (e) => {
                this.filterOrders(e.target.value);
            });
        }

        // Delegation for dynamic elements
        this.ordersList?.addEventListener('click', (e) => {
            if (e.target.closest('.btn-details')) {
                this.showOrderDetails(e);
            } else if (e.target.closest('.btn-buy-again')) {
                this.buyAgain(e);
            }
        });
    }

    filterOrders(filter) {
        const orders = document.querySelectorAll('.order-card');
        let hasVisibleOrders = false;

        orders.forEach(order => {
            const shouldShow = filter === 'all' || 
                              order.querySelector('.order-status').classList.contains(filter);
            
            order.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) hasVisibleOrders = true;
        });

        if (this.ordersEmpty && this.ordersList) {
            this.ordersEmpty.style.display = hasVisibleOrders ? 'none' : 'flex';
            this.ordersList.style.display = hasVisibleOrders ? 'block' : 'none';
        }
    }

    showOrderDetails(e) {
        const orderId = e.target.closest('.order-card').querySelector('.order-id').textContent;
        this.showAlert(`Detalhes do ${orderId} serão exibidos aqui`, 'info');
    }

    buyAgain(e) {
        const products = e.target.closest('.order-card').querySelectorAll('.order-product');
        this.showAlert(`${products.length} itens adicionados ao carrinho`, 'success');
    }

    showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.getElementById('orders-section').appendChild(alertBox);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }
}

class FavoritesManager {
    constructor() {
        this.initElements();
        this.setupEventListeners();
        this.filterFavorites('all');
    }

    initElements() {
        this.favoritesFilter = document.getElementById('favorites-filter');
        this.favoritesGrid = document.querySelector('.favorites-grid');
        this.favoritesEmpty = document.querySelector('.favorites-empty');
    }

    setupEventListeners() {
        if (this.favoritesFilter) {
            this.favoritesFilter.addEventListener('change', (e) => {
                this.filterFavorites(e.target.value);
            });
        }

        // Delegation for dynamic elements
        this.favoritesGrid?.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-remove')) {
                this.removeFavorite(e);
            } else if (e.target.closest('.btn-add-cart')) {
                this.addToCart(e);
            } else if (e.target.closest('.btn-notify')) {
                this.notifyAvailability(e);
            }
        });
    }

    filterFavorites(filter) {
        const favorites = document.querySelectorAll('.favorite-item');
        let hasVisibleFavorites = false;

        favorites.forEach(fav => {
            const shouldShow = filter === 'all' || 
                             (filter === 'available' && fav.querySelector('.favorite-status').classList.contains('available')) ||
                             (filter === 'unavailable' && fav.querySelector('.favorite-status').classList.contains('unavailable')) ||
                             fav.querySelector('h4').textContent.toLowerCase().includes(filter);
            
            fav.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) hasVisibleFavorites = true;
        });

        if (this.favoritesEmpty && this.favoritesGrid) {
            this.favoritesEmpty.style.display = hasVisibleFavorites ? 'none' : 'flex';
            this.favoritesGrid.style.display = hasVisibleFavorites ? 'grid' : 'none';
        }
    }

    removeFavorite(e) {
        if (confirm('Remover este item dos favoritos?')) {
            const favoriteItem = e.target.closest('.favorite-item');
            favoriteItem.remove();
            
            const remaining = document.querySelectorAll('.favorite-item').length;
            if (this.favoritesEmpty && this.favoritesGrid) {
                this.favoritesEmpty.style.display = remaining === 0 ? 'flex' : 'none';
                this.favoritesGrid.style.display = remaining === 0 ? 'none' : 'grid';
            }
            
            this.showAlert('Item removido dos favoritos', 'success');
        }
    }

    addToCart(e) {
        const productName = e.target.closest('.favorite-item').querySelector('h4').textContent;
        this.showAlert(`${productName} adicionado ao carrinho`, 'success');
    }

    notifyAvailability(e) {
        const productName = e.target.closest('.favorite-item').querySelector('h4').textContent;
        this.showAlert(`Você será notificado quando ${productName} estiver disponível`, 'info');
    }

    showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.getElementById('favorites-section').appendChild(alertBox);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }
}

class SecurityManager {
    constructor() {
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.twoFactorToggle = document.getElementById('two-factor-toggle');
        this.btnChangePassword = document.querySelector('.btn-change-password');
        this.btnLogoutAll = document.querySelector('.btn-logout-all');
        this.btnDeleteAccount = document.querySelector('.btn-delete-account');
        this.deviceList = document.querySelector('.device-list');
    }

    setupEventListeners() {
        if (this.twoFactorToggle) {
            this.twoFactorToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.enableTwoFactorAuth();
                } else {
                    this.disableTwoFactorAuth();
                }
            });
        }

        if (this.btnChangePassword) {
            this.btnChangePassword.addEventListener('click', () => {
                document.querySelector('[data-section="personal-info"]').click();
                document.getElementById('edit-password-btn').click();
            });
        }

        if (this.btnLogoutAll) {
            this.btnLogoutAll.addEventListener('click', () => {
                if (confirm('Deseja desconectar todos os dispositivos? Você precisará fazer login novamente.')) {
                    this.logoutAllDevices();
                }
            });
        }

        if (this.btnDeleteAccount) {
            this.btnDeleteAccount.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.')) {
                    this.deleteAccount();
                }
            });
        }

        // Delegation for device logout buttons
        this.deviceList?.addEventListener('click', (e) => {
            if (e.target.closest('.btn-logout-device')) {
                this.logoutDevice(e);
            }
        });
    }

    enableTwoFactorAuth() {
        this.showAlert('Autenticação de dois fatores ativada com sucesso!', 'success');
    }

    disableTwoFactorAuth() {
        this.showAlert('Autenticação de dois fatores desativada', 'warning');
    }

    logoutDevice(e) {
        const deviceItem = e.target.closest('.device-item');
        if (confirm('Deseja desconectar este dispositivo?')) {
            deviceItem.remove();
            this.showAlert('Dispositivo desconectado com sucesso', 'success');
        }
    }

    logoutAllDevices() {
        document.querySelectorAll('.device-item').forEach(device => device.remove());
        this.showAlert('Todos os dispositivos foram desconectados', 'success');
    }

    deleteAccount() {
        this.showAlert('Sua conta será excluída permanentemente', 'error');
    }

    showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.getElementById('security-section').appendChild(alertBox);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }
}

class NotificationsManager {
    constructor() {
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.notificationToggles = document.querySelectorAll('.notification-option .toggle-input');
        this.btnSaveSettings = document.querySelector('.notification-actions .btn-save');
        this.btnLoadMore = document.querySelector('.btn-load-more');
        this.notificationsList = document.querySelector('.notifications-list');
    }

    setupEventListeners() {
        if (this.btnSaveSettings) {
            this.btnSaveSettings.addEventListener('click', () => this.saveSettings());
        }

        if (this.btnLoadMore) {
            this.btnLoadMore.addEventListener('click', () => this.loadMoreNotifications());
        }

        // Delegation for notification buttons
        this.notificationsList?.addEventListener('click', (e) => {
            if (e.target.closest('.notification-mark-read')) {
                this.markAsRead(e);
            }
        });
    }

    saveSettings() {
        const settings = {};
        
        this.notificationToggles.forEach(toggle => {
            const label = toggle.closest('.notification-option').querySelector('label').textContent;
            settings[label] = toggle.checked;
        });
        
        this.showAlert('Configurações de notificação salvas com sucesso!', 'success');
    }

    loadMoreNotifications() {
        const loader = document.createElement('div');
        loader.className = 'notification-loader';
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        
        if (this.btnLoadMore) {
            this.btnLoadMore.before(loader);
            this.btnLoadMore.disabled = true;
        }
        
        setTimeout(() => {
            loader.remove();
            if (this.btnLoadMore) this.btnLoadMore.disabled = false;
            
            // Simulate loading more notifications
            for (let i = 0; i < 3; i++) {
                const newNotification = document.createElement('div');
                newNotification.className = 'notification-item';
                newNotification.innerHTML = `
                    <div class="notification-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="notification-content">
                        <h4>Notificação #${Math.floor(Math.random() * 1000)}</h4>
                        <p>Esta é uma nova notificação carregada dinamicamente.</p>
                        <span class="notification-time">Agora há pouco</span>
                    </div>
                    <button class="notification-mark-read"><i class="fas fa-check"></i></button>
                `;
                
                if (this.notificationsList) {
                    this.notificationsList.appendChild(newNotification);
                }
            }
        }, 1500);
    }

    markAsRead(e) {
        const notificationItem = e.target.closest('.notification-item');
        notificationItem.classList.remove('unread');
        notificationItem.style.opacity = '0.7';
    }

    showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.getElementById('notifications-section').appendChild(alertBox);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }
}

class PaymentsManager {
    constructor() {
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.paymentMethods = document.querySelector('.payment-methods');
        this.paymentForm = document.querySelector('.payment-form');
        this.btnAddPayment = document.querySelector('.btn-add-payment');
        this.btnSavePayment = this.paymentForm?.querySelector('.btn-save');
        this.btnCancelPayment = this.paymentForm?.querySelector('.btn-cancel');
        this.paymentTypes = document.querySelectorAll('.payment-type');
        this.creditCardForm = document.getElementById('credit-card-form');
        this.boletoForm = document.getElementById('boleto-form');
        this.pixForm = document.getElementById('pix-form');
    }

    setupEventListeners() {
        if (this.btnAddPayment) {
            this.btnAddPayment.addEventListener('click', () => this.showPaymentForm());
        }

        if (this.btnCancelPayment) {
            this.btnCancelPayment.addEventListener('click', () => this.hidePaymentForm());
        }

        if (this.btnSavePayment) {
            this.btnSavePayment.addEventListener('click', () => this.savePaymentMethod());
        }

        this.paymentTypes.forEach(type => {
            type.addEventListener('click', (e) => this.selectPaymentType(e));
        });

        // Delegation for payment method actions
        this.paymentMethods?.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) {
                this.editPaymentMethod(e);
            } else if (e.target.closest('.delete-btn')) {
                this.deletePaymentMethod(e);
            }
        });
    }

    showPaymentForm() {
        if (this.paymentForm) {
            this.paymentForm.style.display = 'block';
            this.btnSavePayment.textContent = 'Salvar Método';
            this.btnSavePayment.onclick = () => this.savePaymentMethod();
        }
        if (this.btnAddPayment) {
            this.btnAddPayment.style.display = 'none';
        }
    }

    hidePaymentForm() {
        if (this.paymentForm) {
            this.paymentForm.style.display = 'none';
            this.paymentForm.reset();
        }
        if (this.btnAddPayment) {
            this.btnAddPayment.style.display = 'block';
        }
    }

    selectPaymentType(e) {
        const type = e.target.getAttribute('data-type');
        
        this.paymentTypes.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        if (this.creditCardForm) this.creditCardForm.style.display = 'none';
        if (this.boletoForm) this.boletoForm.style.display = 'none';
        if (this.pixForm) this.pixForm.style.display = 'none';
        
        if (type === 'credit' || type === 'debit') {
            if (this.creditCardForm) this.creditCardForm.style.display = 'block';
        } else if (type === 'boleto') {
            if (this.boletoForm) this.boletoForm.style.display = 'block';
        } else if (type === 'pix') {
            if (this.pixForm) this.pixForm.style.display = 'block';
        }
    }

    savePaymentMethod() {
        const selectedType = document.querySelector('.payment-type.active')?.getAttribute('data-type');
        
        if (!this.validatePaymentForm(selectedType)) {
            return;
        }
        
        const newMethod = this.createPaymentMethod(selectedType);
        
        if (this.paymentMethods) {
            this.paymentMethods.appendChild(newMethod);
        }
        
        this.hidePaymentForm();
        this.showAlert('Método de pagamento salvo com sucesso!', 'success');
    }

    validatePaymentForm(type) {
        if (type === 'credit' || type === 'debit') {
            const cardNumber = document.getElementById('card-number')?.value;
            if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
                this.showAlert('Número do cartão inválido', 'error');
                return false;
            }
            
            const cardName = document.getElementById('card-name')?.value;
            if (!cardName) {
                this.showAlert('Nome no cartão é obrigatório', 'error');
                return false;
            }
            
            const cardExpiry = document.getElementById('card-expiry')?.value;
            if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                this.showAlert('Data de validade inválida (use MM/AA)', 'error');
                return false;
            }
            
            const cardCvv = document.getElementById('card-cvv')?.value;
            if (!cardCvv || !/^\d{3,4}$/.test(cardCvv)) {
                this.showAlert('CVV inválido', 'error');
                return false;
            }
        } else if (type === 'boleto') {
            const cpf = document.getElementById('boleto-cpf')?.value;
            if (!cpf || !/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(cpf)) {
                this.showAlert('CPF inválido', 'error');
                return false;
            }
        } else if (type === 'pix') {
            const key = document.getElementById('pix-key')?.value;
            if (!key) {
                this.showAlert('Chave Pix é obrigatória', 'error');
                return false;
            }
        }
        
        return true;
    }

    createPaymentMethod(type) {
        const method = document.createElement('div');
        method.className = 'payment-method';
        
        if (type === 'credit' || type === 'debit') {
            const cardNumber = document.getElementById('card-number')?.value.replace(/\s/g, '');
            const last4 = cardNumber?.slice(-4) || '0000';
            const cardType = type === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito';
            const cardBrand = this.detectCardBrand(cardNumber);
            
            method.innerHTML = `
                <div class="payment-card">
                    <div class="card-logo">
                        <i class="fab ${this.getCardBrandIcon(cardBrand)}"></i>
                    </div>
                    <div class="card-info">
                        <h4>${cardType}</h4>
                        <p>${cardBrand} **** **** **** ${last4}</p>
                        <p>Válido até: ${document.getElementById('card-expiry')?.value || 'MM/AA'}</p>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn"><i class="fas fa-pencil-alt"></i> Editar</button>
                        <button class="delete-btn"><i class="fas fa-trash"></i> Remover</button>
                    </div>
                </div>
            `;
        } else if (type === 'boleto') {
            method.innerHTML = `
                <div class="payment-card">
                    <div class="card-logo">
                        <i class="fas fa-barcode"></i>
                    </div>
                    <div class="card-info">
                        <h4>Boleto Bancário</h4>
                        <p>CPF: ${document.getElementById('boleto-cpf')?.value || 'Não informado'}</p>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn"><i class="fas fa-pencil-alt"></i> Editar</button>
                        <button class="delete-btn"><i class="fas fa-trash"></i> Remover</button>
                    </div>
                </div>
            `;
        } else if (type === 'pix') {
            method.innerHTML = `
                <div class="payment-card">
                    <div class="card-logo">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <div class="card-info">
                        <h4>Pix</h4>
                        <p>Chave: ${document.getElementById('pix-key')?.value || 'Não informada'}</p>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn"><i class="fas fa-pencil-alt"></i> Editar</button>
                        <button class="delete-btn"><i class="fas fa-trash"></i> Remover</button>
                    </div>
                </div>
            `;
        }
        
        return method;
    }

    editPaymentMethod(e) {
        const paymentCard = e.target.closest('.payment-card');
        const cardInfo = paymentCard.querySelector('.card-info h4').textContent;
        
        let paymentType = 'credit';
        if (cardInfo.includes('Débito')) paymentType = 'debit';
        else if (cardInfo.includes('Boleto')) paymentType = 'boleto';
        else if (cardInfo.includes('Pix')) paymentType = 'pix';
        
        this.showPaymentForm();
        document.querySelector(`.payment-type[data-type="${paymentType}"]`).click();
        
        if (paymentType === 'credit' || paymentType === 'debit') {
            const cardNumberText = paymentCard.querySelector('.card-info p').textContent;
            const last4 = cardNumberText.includes('****') ? 
                cardNumberText.split('****')[3].trim() : '0000';
            document.getElementById('card-number').value = `000000000000${last4}`;
            
            const expiry = paymentCard.querySelector('.card-info p:nth-child(3)').textContent.split(':')[1].trim();
            document.getElementById('card-expiry').value = expiry;
        } else if (paymentType === 'boleto') {
            const cpf = paymentCard.querySelector('.card-info p').textContent.split(':')[1].trim();
            document.getElementById('boleto-cpf').value = cpf;
        } else if (paymentType === 'pix') {
            const key = paymentCard.querySelector('.card-info p').textContent.split(':')[1].trim();
            document.getElementById('pix-key').value = key;
        }
        
        this.btnSavePayment.textContent = 'Atualizar Método';
        this.btnSavePayment.onclick = () => {
            if (this.validatePaymentForm(paymentType)) {
                const newMethod = this.createPaymentMethod(paymentType);
                paymentCard.closest('.payment-method').replaceWith(newMethod);
                this.hidePaymentForm();
                this.showAlert('Método de pagamento atualizado!', 'success');
            }
        };
    }

    deletePaymentMethod(e) {
        if (confirm('Tem certeza que deseja remover este método de pagamento?')) {
            const paymentMethod = e.target.closest('.payment-method');
            paymentMethod.remove();
            this.showAlert('Método de pagamento removido!', 'success');
        }
    }

    detectCardBrand(cardNumber) {
        if (/^4/.test(cardNumber)) return 'Visa';
        if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
        if (/^3[47]/.test(cardNumber)) return 'American Express';
        if (/^3(?:0[0-5]|[68])/.test(cardNumber)) return 'Diners Club';
        if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
        return 'Cartão';
    }

    getCardBrandIcon(brand) {
        switch (brand.toLowerCase()) {
            case 'visa': return 'fa-cc-visa';
            case 'mastercard': return 'fa-cc-mastercard';
            case 'american express': return 'fa-cc-amex';
            case 'diners club': return 'fa-cc-diners-club';
            case 'discover': return 'fa-cc-discover';
            default: return 'fa-credit-card';
        }
    }

    showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.innerHTML = `
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        document.getElementById('payments-section').appendChild(alertBox);
        
        alertBox.querySelector('.close-alert').addEventListener('click', () => {
            alertBox.remove();
        });
        
        setTimeout(() => {
            alertBox.classList.add('fade-out');
            setTimeout(() => alertBox.remove(), 500);
        }, 5000);
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});