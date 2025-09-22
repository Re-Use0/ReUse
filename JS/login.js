document.addEventListener('DOMContentLoaded', () => {
    // Elementos dos botões de seleção
    const customerButton = document.getElementById('customer-button');
    const sellerButton = document.getElementById('seller-button');
    const institutionButton = document.getElementById('institution-button');

    // Formulários
    const customerForm = document.getElementById('customer-form');
    const sellerForm = document.getElementById('seller-form');
    const institutionForm = document.getElementById('institution-form');

    // Função para trocar entre formulários
    customerButton.addEventListener('click', () => {
        customerButton.classList.add('active');
        sellerButton.classList.remove('active');
        institutionButton.classList.remove('active');
        customerForm.classList.add('active');
        sellerForm.classList.remove('active');
        institutionForm.classList.remove('active');
    });

    sellerButton.addEventListener('click', () => {
        sellerButton.classList.add('active');
        customerButton.classList.remove('active');
        institutionButton.classList.remove('active');
        sellerForm.classList.add('active');
        customerForm.classList.remove('active');
        institutionForm.classList.remove('active');
    });

    institutionButton.addEventListener('click', () => {
        institutionButton.classList.add('active');
        customerButton.classList.remove('active');
        sellerButton.classList.remove('active');
        institutionForm.classList.add('active');
        customerForm.classList.remove('active');
        sellerForm.classList.remove('active');
    });

    // Validação do formulário de cliente
    const customerLoginForm = document.getElementById('customerLoginForm');

    customerLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validação do email
        const email = document.getElementById('customer-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            const emailError = document.getElementById('customer-email-error');
            emailError.textContent = 'O email é obrigatório';
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            const emailError = document.getElementById('customer-email-error');
            emailError.textContent = 'Digite um email válido';
            isValid = false;
        } else {
            const emailError = document.getElementById('customer-email-error');
            emailError.textContent = '';
        }

        // Validação da senha
        const password = document.getElementById('customer-password');
        if (!password.value) {
            const passwordError = document.getElementById('customer-password-error');
            passwordError.textContent = 'A senha é obrigatória';
            isValid = false;
        } else {
            const passwordError = document.getElementById('customer-password-error');
            passwordError.textContent = '';
        }

        // Se o formulário for válido, enviar
        if (isValid) {
            window.location.href = 'cliente.html';
        }
    });

    // Validação do formulário de vendedor (ATUALIZADO)
    const sellerLoginForm = document.getElementById('sellerLoginForm');

    sellerLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validação do código de verificação
        const verificationCode = document.getElementById('verification-code');
        const verificationCodeError = document.getElementById('verification-code-error');
        const verificationCodeRegex = /^[A-Za-z0-9]{3}$/;
        if (!verificationCode.value.trim()) {
            verificationCodeError.textContent = 'O código de verificação é obrigatório';
            isValid = false;
        } else if (!verificationCodeRegex.test(verificationCode.value)) {
            verificationCodeError.textContent = 'O código deve conter exatamente 3 caracteres (letras ou números)';
            isValid = false;
        } else {
            verificationCodeError.textContent = '';
        }

        // Validação da senha
        const password = document.getElementById('seller-password');
        const passwordError = document.getElementById('password-error');
        if (!password.value) {
            passwordError.textContent = 'A senha é obrigatória';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }

        if (isValid) {
            // Verificação dos valores específicos
            if (verificationCode.value.toLowerCase() === 'xcz' && password.value === 'Senha#123') {
                window.location.href = 'vendedor.html'; // Página do vendedor
            } else {
                // Exibir mensagem de erro estilizada
                const errorDiv = document.createElement('div');
                errorDiv.className = 'custom-error-message';
                errorDiv.textContent = 'Usuário ou senha incorretos';
                
                // Remover mensagem de erro anterior se existir
                const existingError = sellerLoginForm.querySelector('.custom-error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                // Inserir a mensagem de erro antes do botão de submit
                const submitBtn = sellerLoginForm.querySelector('.submit-btn');
                sellerLoginForm.insertBefore(errorDiv, submitBtn);
                
                // Adicionar animação de shake ao formulário
                sellerLoginForm.classList.add('shake');
                setTimeout(() => {
                    sellerLoginForm.classList.remove('shake');
                }, 500);
            }
        }
    });

    // Validação do formulário de instituição (ATUALIZADO)
    const institutionLoginForm = document.getElementById('institutionLoginForm');

    institutionLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validação do CNPJ
        const cnpj = document.getElementById('institution-cnpj');
        const cnpjError = document.getElementById('cnpj-error');
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!cnpj.value.trim()) {
            cnpjError.textContent = 'O CNPJ é obrigatório';
            isValid = false;
        } else if (!cnpjRegex.test(cnpj.value)) {
            cnpjError.textContent = 'CNPJ deve estar no formato 00.000.000/0000-00';
            isValid = false;
        } else {
            cnpjError.textContent = '';
        }

        // Validação da senha
        const password = document.getElementById('institution-password');
        const passwordError = document.getElementById('institution-password-error');
        if (!password.value) {
            passwordError.textContent = 'A senha é obrigatória';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }

        if (isValid) {
            // Verificação dos valores específicos
            if (cnpj.value === '12.123.123/1234-12' && password.value === '1235') {
                window.location.href = 'ong-2.html'; // Página especial
            } else if (cnpj.value === '25.456.456/4567-25' && password.value === '1234567') {
                window.location.href = 'ong.html'; // Página específica
            } else {
                // Exibir mensagem de erro estilizada
                const errorDiv = document.createElement('div');
                errorDiv.className = 'custom-error-message';
                errorDiv.textContent = 'Usuário ou senha incorretos';
                
                // Remover mensagem de erro anterior se existir
                const existingError = institutionLoginForm.querySelector('.custom-error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                // Inserir a mensagem de erro antes do botão de submit
                const submitBtn = institutionLoginForm.querySelector('.submit-btn');
                institutionLoginForm.insertBefore(errorDiv, submitBtn);
                
                // Adicionar animação de shake ao formulário
                institutionLoginForm.classList.add('shake');
                setTimeout(() => {
                    institutionLoginForm.classList.remove('shake');
                }, 500);
            }
        }
    });

    // Validação do código de verificação
    const verificationCodeInput = document.getElementById('verification-code');
    verificationCodeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
        if (value.length > 3) value = value.substring(0, 3);
        e.target.value = value.toUpperCase();
    });

    // Formatação do CNPJ
    const cnpjInput = document.getElementById('institution-cnpj');
    cnpjInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        // Limita a 14 caracteres (números)
        if (value.length > 14) {
            value = value.substring(0, 14);
        }

        // Aplica a formatação apenas se tiver dígitos suficientes
        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            if (value.length > 3) value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            if (value.length > 7) value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            if (value.length > 12) value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }

        e.target.value = value;
    });

    // Adiciona validação para garantir que não ultrapasse 14 dígitos
    cnpjInput.addEventListener('keydown', (e) => {
        const currentValue = e.target.value.replace(/\D/g, '');
        if (currentValue.length >= 14 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Toggle password visibility for all password fields
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const icon = this.querySelector('i');
            const input = this.parentElement.querySelector('input');

            // Toggle between password and text type
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Toggle eye icon
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');

            // Toggle active class for styling if needed
            this.classList.toggle('active');
        });
    });
});