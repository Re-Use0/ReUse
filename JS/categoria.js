document.addEventListener('DOMContentLoaded', function () {
    // Função para mostrar erros personalizados
    function showError(message) {
        const errorElement = document.getElementById('error-message-global');
        const errorText = document.getElementById('error-text-global');

        if (errorElement && errorText) {
            errorText.textContent = message;
            errorElement.style.display = 'flex';

            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    // Fechar mensagem ao clicar
    const errorMessage = document.getElementById('error-message-global');
    if (errorMessage) {
        errorMessage.addEventListener('click', function () {
            this.style.display = 'none';
        });
    }

    // Form toggling functionality
    const clientBtn = document.getElementById('client-btn');
    const sellerBtn = document.getElementById('seller-btn');
    const institutionBtn = document.getElementById('institution-btn');
    const clientForm = document.getElementById('client-form');
    const sellerForm = document.getElementById('seller-form');
    const institutionForm = document.getElementById('institution-form');

    if (clientBtn && sellerBtn && institutionBtn && clientForm && sellerForm && institutionForm) {
        function toggleForms(activeBtn, activeForm) {
            [clientBtn, sellerBtn, institutionBtn].forEach(btn => btn.classList.remove('active'));
            [clientForm, sellerForm, institutionForm].forEach(form => form.style.display = 'none');

            activeBtn.classList.add('active');
            activeForm.style.display = 'block';
        }

        clientBtn.addEventListener('click', () => toggleForms(clientBtn, clientForm));
        sellerBtn.addEventListener('click', () => toggleForms(sellerBtn, sellerForm));
        institutionBtn.addEventListener('click', () => toggleForms(institutionBtn, institutionForm));
    }

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                const passwordInput = document.getElementById(targetId);
                if (passwordInput) {
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);
                    this.classList.toggle('fa-eye');
                    this.classList.toggle('fa-eye-slash');
                }
            }
        });
    });

    // Input formatting functions
    function formatPhoneInput(input) {
        if (input) {
            input.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substring(0, 11);

                if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                if (value.length > 10) value = `${value.substring(0, 10)}-${value.substring(10)}`;

                e.target.value = value;
            });
        }
    }

    function formatZipcodeInput(input) {
        if (input) {
            input.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 8) value = value.substring(0, 8);
                if (value.length > 5) value = `${value.substring(0, 5)}-${value.substring(5)}`;
                e.target.value = value;
            });
        }
    }

    function formatCNPJInput(input) {
        if (input) {
            input.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 14) value = value.substring(0, 14);

                if (value.length > 2) value = `${value.substring(0, 2)}.${value.substring(2)}`;
                if (value.length > 6) value = `${value.substring(0, 6)}.${value.substring(6)}`;
                if (value.length > 10) value = `${value.substring(0, 10)}/${value.substring(10)}`;
                if (value.length > 15) value = `${value.substring(0, 15)}-${value.substring(15)}`;

                e.target.value = value;
            });
        }
    }

    function formatVerificationCode(input) {
        if (input) {
            input.addEventListener('input', function (e) {
                let value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
                if (value.length > 3) value = value.substring(0, 3);
                e.target.value = value.toUpperCase();
            });
        }
    }

    // Initialize input formatting
    formatPhoneInput(document.getElementById('phone'));
    formatPhoneInput(document.getElementById('institution-phone'));
    formatZipcodeInput(document.getElementById('zipcode'));
    formatZipcodeInput(document.getElementById('institution-zipcode'));
    formatCNPJInput(document.getElementById('institution-cnpj'));
    formatVerificationCode(document.getElementById('verification-code'));

    // Password validation
    function validatePassword(password) {
        if (!password) {
            showError('Por favor, insira uma senha');
            return false;
        }

        if (password.length < 8) {
            showError('A senha deve ter pelo menos 8 caracteres');
            return false;
        }

        if (!password.match(/[A-Za-z]/)) {
            showError('A senha deve incluir pelo menos uma letra');
            return false;
        }

        if (!password.match(/\d/)) {
            showError('A senha deve incluir pelo menos um número');
            return false;
        }

        if (!password.match(/[@$!%*#?&]/)) {
            showError('A senha deve incluir pelo menos um caractere especial (@, $, !, %, *, #, ?, &)');
            return false;
        }

        return true;
    }

    // Form validation functions
    function validateClientForm(event) {
        event.preventDefault();
        let isValid = true;

        // Name validation
        const name = document.getElementById('name')?.value.trim();
        if (!name) {
            showError('Por favor, insira seu nome completo');
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('email')?.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo)\.(com|com\.br)$/i;
        if (!email) {
            showError('Por favor, insira seu email');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('Por favor, use apenas email do Gmail, Hotmail ou Yahoo');
            isValid = false;
        }

        // Password validation
        const password = document.getElementById('password')?.value;
        if (!validatePassword(password)) {
            isValid = false;
        }

        // Confirm password
        const confirmPassword = document.getElementById('confirm-password')?.value;
        if (!confirmPassword) {
            showError('Por favor, confirme sua senha');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError('As senhas não coincidem');
            isValid = false;
        }

        if (isValid) {
            redirectToPage('client');
        }
    }

    function validateSellerForm(event) {
        event.preventDefault();
        let isValid = true;

        // Business type validation
        const businessType = document.getElementById('business-type')?.value;
        if (!businessType) {
            showError('Por favor, selecione um tipo de negócio');
            isValid = false;
        }

        // Store name validation
        const storeName = document.getElementById('store-name')?.value.trim();
        if (!storeName) {
            showError('Por favor, insira o nome da loja');
            isValid = false;
        }

        // Phone validation
        const phone = document.getElementById('phone')?.value.trim();
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!phone) {
            showError('Por favor, insira um número de telefone');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError('Por favor, insira um telefone válido (ex: (11) 99999-9999)');
            isValid = false;
        }

        // Zipcode validation
        const zipcode = document.getElementById('zipcode')?.value.trim();
        const zipcodeRegex = /^\d{5}-\d{3}$/;
        if (!zipcode) {
            showError('Por favor, insira o CEP');
            isValid = false;
        } else if (!zipcodeRegex.test(zipcode)) {
            showError('Por favor, insira um CEP válido (ex: 12345-678)');
            isValid = false;
        }

        // Address validation
        const address = document.getElementById('address')?.value.trim();
        if (!address) {
            showError('Por favor, insira o endereço');
            isValid = false;
        }

        // Category validation
        const category = document.getElementById('category')?.value;
        if (!category) {
            showError('Por favor, selecione uma categoria');
            isValid = false;
        }

        // Email validation
        const storeEmail = document.getElementById('store-email')?.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!storeEmail) {
            showError('Por favor, insira o email da loja');
            isValid = false;
        } else if (!emailRegex.test(storeEmail)) {
            showError('Por favor, insira um email válido');
            isValid = false;
        }

        // Verification code validation
        const verificationCode = document.getElementById('verification-code')?.value.trim();
        if (!verificationCode) {
            showError('Por favor, crie um código de verificação');
            isValid = false;
        } else if (verificationCode.length !== 3) {
            showError('O código deve ter exatamente 3 caracteres');
            isValid = false;
        }

        // Password validation
        const password = document.getElementById('seller-password')?.value;
        if (!validatePassword(password)) {
            isValid = false;
        }

        // Confirm password
        const confirmPassword = document.getElementById('seller-confirm-password')?.value;
        if (!confirmPassword) {
            showError('Por favor, confirme sua senha');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError('As senhas não coincidem');
            isValid = false;
        }

        if (isValid) {
            redirectToPage('seller');
        }
    }

    function validateInstitutionForm(event) {
        event.preventDefault();
        let isValid = true;

        // Institution type validation
        const institutionType = document.getElementById('institution-type')?.value;
        if (!institutionType) {
            showError('Por favor, selecione um tipo de instituição');
            isValid = false;
        }

        // Institution name validation
        const institutionName = document.getElementById('institution-name')?.value.trim();
        if (!institutionName) {
            showError('Por favor, insira o nome da instituição');
            isValid = false;
        }

        // Phone validation
        const phone = document.getElementById('institution-phone')?.value.trim();
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!phone) {
            showError('Por favor, insira um número de telefone');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError('Por favor, insira um telefone válido (ex: (11) 99999-9999)');
            isValid = false;
        }

        // Zipcode validation
        const zipcode = document.getElementById('institution-zipcode')?.value.trim();
        const zipcodeRegex = /^\d{5}-\d{3}$/;
        if (!zipcode) {
            showError('Por favor, insira o CEP');
            isValid = false;
        } else if (!zipcodeRegex.test(zipcode)) {
            showError('Por favor, insira um CEP válido (ex: 12345-678)');
            isValid = false;
        }

        // Address validation
        const address = document.getElementById('institution-address')?.value.trim();
        if (!address) {
            showError('Por favor, insira o endereço');
            isValid = false;
        }

        // Email validation
        const institutionEmail = document.getElementById('institution-email')?.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!institutionEmail) {
            showError('Por favor, insira o email da instituição');
            isValid = false;
        } else if (!emailRegex.test(institutionEmail)) {
            showError('Por favor, insira um email válido');
            isValid = false;
        }

        // CNPJ validation
        const cnpj = document.getElementById('institution-cnpj')?.value.trim();
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!cnpj) {
            showError('Por favor, insira o CNPJ');
            isValid = false;
        } else if (!cnpjRegex.test(cnpj)) {
            showError('Por favor, insira um CNPJ válido (ex: 00.000.000/0000-00)');
            isValid = false;
        }

        // Password validation
        const password = document.getElementById('institution-password')?.value;
        if (!validatePassword(password)) {
            isValid = false;
        }

        // Confirm password
        const confirmPassword = document.getElementById('institution-confirm-password')?.value;
        if (!confirmPassword) {
            showError('Por favor, confirme sua senha');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError('As senhas não coincidem');
            isValid = false;
        }

        if (isValid) {
            redirectToPage('institution');
        }
    }

    // Função para redirecionamento
    function redirectToPage(role) {
        setTimeout(() => {
            switch (role) {
                case 'client':
                    window.location.href = 'Cliente.html';
                    break;
                case 'seller':
                    window.location.href = 'Vendedor.html';
                    break;
                case 'institution':
                    window.location.href = 'ONG.html';
                    break;
                default:
                    window.location.href = '#';
            }
        }, 1000);
    }

    // Adiciona os event listeners aos formulários
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', validateClientForm);
    }

    const sellerRegistrationForm = document.getElementById('sellerRegistrationForm');
    if (sellerRegistrationForm) {
        sellerRegistrationForm.addEventListener('submit', validateSellerForm);
    }

    const institutionRegistrationForm = document.getElementById('institutionRegistrationForm');
    if (institutionRegistrationForm) {
        institutionRegistrationForm.addEventListener('submit', validateInstitutionForm);
    }
});