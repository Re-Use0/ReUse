document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('ongProductForm');
    const uploadBtn = document.getElementById('uploadBtn');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const successMessage = document.getElementById('successMessage');

    let uploadedImages = [];
    let formSubmitted = false;

    // Configuração inicial
    function init() {
        setupEventListeners();
    }

    // Configurar todos os event listeners
    function setupEventListeners() {
        // Upload de imagens
        uploadBtn.addEventListener('click', () => imageUpload.click());
        imageUpload.addEventListener('change', handleImageUpload);

        // Validação em tempo real
        setupRealTimeValidation();

        // Submissão do formulário
        form.addEventListener('submit', handleFormSubmit);
    }

    // Manipulador de upload de imagens
    function handleImageUpload(e) {
        const files = e.target.files;
        if (files.length > 0) {
            uploadedImages = Array.from(files);
            updateImagePreview();

            // Limpar erro se existir
            clearError('product-images-error');
            uploadBtn.classList.remove('input-error');

            // Validar novamente se o formulário já foi submetido
            if (formSubmitted) {
                validateImageUpload();
            }
        }
    }

    // Atualizar visualização da imagem
    function updateImagePreview() {
        imagePreview.innerHTML = '';

        if (uploadedImages.length > 0) {
            const firstImage = uploadedImages[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.appendChild(img);

                if (uploadedImages.length > 1) {
                    const countBadge = document.createElement('div');
                    countBadge.textContent = `+${uploadedImages.length - 1}`;
                    countBadge.classList.add('image-count-badge');
                    imagePreview.appendChild(countBadge);
                }
            };

            reader.readAsDataURL(firstImage);
        } else {
            imagePreview.innerHTML = '<span>Nenhuma imagem selecionada</span>';
        }
    }

    // Configurar validação em tempo real
    function setupRealTimeValidation() {
        // Limpar erros quando o usuário começa a digitar
        document.getElementById('product-name').addEventListener('input', function () {
            clearError('product-name-error');
            this.classList.remove('input-error');
        });

        document.getElementById('product-category').addEventListener('change', function () {
            clearError('product-category-error');
            this.classList.remove('input-error');
        });

        document.getElementById('product-quantity').addEventListener('input', function () {
            clearError('product-quantity-error');
            this.classList.remove('input-error');
        });

        document.getElementById('product-description').addEventListener('input', function () {
            clearError('product-description-error');
            this.classList.remove('input-error');
        });
    }

    // Manipulador de submissão do formulário
    function handleFormSubmit(e) {
        e.preventDefault();
        formSubmitted = true;

        // Executar todas as validações
        const validations = [
            validateProductName(),
            validateProductCategory(),
            validateProductQuantity(),
            validateProductDescription(),
            validateImageUpload()
        ];

        // Verificar se todas as validações passaram
        const isValid = validations.every(valid => valid === true);

        if (isValid) {
            showSuccessMessage();
            resetForm();
        }
    }

    // Funções de validação
    function validateProductName() {
        const element = document.getElementById('product-name');
        const value = element.value.trim();
        const errorId = 'product-name-error';

        if (!value) {
            showError(errorId, 'Por favor, insira o nome do produto');
            element.classList.add('input-error');
            return false;
        }

        clearError(errorId);
        element.classList.remove('input-error');
        return true;
    }

    function validateProductCategory() {
        const element = document.getElementById('product-category');
        const value = element.value;
        const errorId = 'product-category-error';

        if (!value) {
            showError(errorId, 'Por favor, selecione uma categoria');
            element.classList.add('input-error');
            return false;
        }

        clearError(errorId);
        element.classList.remove('input-error');
        return true;
    }

    function validateProductQuantity() {
        const element = document.getElementById('product-quantity');
        const value = element.value;
        const errorId = 'product-quantity-error';

        if (!value || isNaN(value) || parseInt(value) < 1) {
            showError(errorId, 'Por favor, insira uma quantidade válida (mínimo 1)');
            element.classList.add('input-error');
            return false;
        }

        clearError(errorId);
        element.classList.remove('input-error');
        return true;
    }

    function validateProductDescription() {
        const element = document.getElementById('product-description');
        const value = element.value.trim();
        const errorId = 'product-description-error';

        if (!value) {
            showError(errorId, 'Por favor, insira uma descrição');
            element.classList.add('input-error');
            return false;
        } else if (value.length < 20) {
            showError(errorId, 'A descrição deve ter pelo menos 20 caracteres');
            element.classList.add('input-error');
            return false;
        }

        clearError(errorId);
        element.classList.remove('input-error');
        return true;
    }

    function validateImageUpload() {
        const errorId = 'product-images-error';

        if (uploadedImages.length === 0) {
            showError(errorId, 'Por favor, adicione pelo menos uma imagem do produto');
            uploadBtn.classList.add('input-error');
            return false;
        }

        clearError(errorId);
        uploadBtn.classList.remove('input-error');
        return true;
    }

    // Mostrar mensagem de erro
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Limpar mensagem de erro
    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    // Mostrar mensagem de sucesso
    function showSuccessMessage() {
        successMessage.textContent = 'Produto cadastrado com sucesso para doação!';
        successMessage.style.display = 'block';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }

    // Resetar formulário
    function resetForm() {
        form.reset();
        uploadedImages = [];
        updateImagePreview();
        formSubmitted = false;
    }

    // Inicializar a aplicação
    init();
});