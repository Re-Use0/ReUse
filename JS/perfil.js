// Perfil.js - Gerenciamento simplificado do perfil do usuário

class ProfileManager {
    constructor() {
        this.initProfilePicture();
        this.profileNavigation = new ProfileNavigation();
        this.passwordManager = new PasswordManager();
        this.addressManager = new AddressManager();
        this.securityManager = new SecurityManager();
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
            this.editButton.innerHTML = '<i class="bi bi-save"></i> Salvar';
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
                this.toggleBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
            }
        } else {
            this.passwordInput.type = 'password';
            if (this.toggleBtn) {
                this.toggleBtn.innerHTML = '<i class="bi bi-eye"></i>';
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
            this.editButton.innerHTML = '<i class="bi bi-pencil"></i> Alterar';
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

        // Event delegation for edit and delete buttons
        if (this.addressList) {
            this.addressList.addEventListener('click', (e) => {
                if (e.target.closest('.edit-btn')) {
                    this.editAddress(e.target.closest('.address-card'));
                } else if (e.target.closest('.delete-btn')) {
                    this.deleteAddress(e.target.closest('.address-card'));
                }
            });
        }
    }

    showAddressForm() {
        this.addressForm.style.display = 'block';
        this.btnAddAddress.style.display = 'none';
    }

    hideAddressForm() {
        this.addressForm.style.display = 'none';
        this.btnAddAddress.style.display = 'block';
    }

    saveAddress() {
        // Validação básica
        const cep = document.getElementById('address-cep').value;
        const street = document.getElementById('address-street').value;
        const number = document.getElementById('address-number').value;
        const city = document.getElementById('address-city').value;
        const state = document.getElementById('address-state').value;
        
        if (!cep || !street || !number || !city || !state) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Simulação de salvamento
        setTimeout(() => {
            alert('Endereço salvo com sucesso!');
            this.hideAddressForm();
            this.resetForm();
        }, 1000);
    }

    resetForm() {
        const form = document.querySelector('.address-form');
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.id !== 'address-country') {
                input.value = '';
            }
        });
    }

    editAddress(addressCard) {
        // Implementar lógica de edição
        alert('Funcionalidade de edição de endereço será implementada em breve.');
    }

    deleteAddress(addressCard) {
        if (confirm('Tem certeza que deseja excluir este endereço?')) {
            addressCard.remove();
            alert('Endereço excluído com sucesso.');
        }
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
    }

    setupEventListeners() {
        if (this.twoFactorToggle) {
            this.twoFactorToggle.addEventListener('change', (e) => {
                this.toggleTwoFactor(e.target.checked);
            });
        }

        if (this.btnChangePassword) {
            this.btnChangePassword.addEventListener('click', () => {
                this.changePassword();
            });
        }

        if (this.btnLogoutAll) {
            this.btnLogoutAll.addEventListener('click', () => {
                this.logoutAllDevices();
            });
        }

        if (this.btnDeleteAccount) {
            this.btnDeleteAccount.addEventListener('click', () => {
                this.deleteAccount();
            });
        }
    }

    toggleTwoFactor(enabled) {
        if (enabled) {
            alert('Autenticação de dois fatores ativada. Você receberá um código por email para confirmar.');
        } else {
            alert('Autenticação de dois fatores desativada.');
        }
    }

    changePassword() {
        alert('Redirecionando para a página de alteração de senha...');
    }

    logoutAllDevices() {
        if (confirm('Tem certeza que deseja desconectar todos os dispositivos?')) {
            alert('Todos os dispositivos foram desconectados com sucesso.');
        }
    }

    deleteAccount() {
        if (confirm('ATENÇÃO: Esta ação é irreversível. Tem certeza que deseja excluir sua conta permanentemente?')) {
            alert('Sua conta será excluída. Você receberá um email de confirmação.');
        }
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
        this.paymentTypes = document.querySelectorAll('.payment-type');
    }

    setupEventListeners() {
        if (this.btnAddPayment) {
            this.btnAddPayment.addEventListener('click', () => this.showPaymentForm());
        }

        if (this.paymentTypes) {
            this.paymentTypes.forEach(type => {
                type.addEventListener('click', (e) => {
                    this.selectPaymentType(e.target);
                });
            });
        }

        // Event delegation for edit and delete buttons
        if (this.paymentMethods) {
            this.paymentMethods.addEventListener('click', (e) => {
                if (e.target.closest('.edit-btn')) {
                    this.editPaymentMethod(e.target.closest('.payment-method'));
                } else if (e.target.closest('.delete-btn')) {
                    this.deletePaymentMethod(e.target.closest('.payment-method'));
                }
            });
        }
    }

    showPaymentForm() {
        this.paymentForm.style.display = 'block';
        this.btnAddPayment.style.display = 'none';
    }

    hidePaymentForm() {
        this.paymentForm.style.display = 'none';
        this.btnAddPayment.style.display = 'block';
    }

    selectPaymentType(element) {
        this.paymentTypes.forEach(type => type.classList.remove('active'));
        element.classList.add('active');
        
        // Aqui você pode adicionar lógica para mostrar formulários específicos
        const paymentType = element.getAttribute('data-type');
        console.log(`Tipo de pagamento selecionado: ${paymentType}`);
    }

    editPaymentMethod(paymentMethod) {
        alert('Funcionalidade de edição de método de pagamento será implementada em breve.');
    }

    deletePaymentMethod(paymentMethod) {
        if (confirm('Tem certeza que deseja excluir este método de pagamento?')) {
            paymentMethod.remove();
            alert('Método de pagamento excluído com sucesso.');
        }
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const profileManager = new ProfileManager();
});