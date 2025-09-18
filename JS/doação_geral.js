document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('donation-form');
    const fileInput = document.getElementById('photos');
    const fileNamesContainer = document.getElementById('selected-files');
    const uploadArea = document.querySelector('.file-upload-area');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successOverlay = document.getElementById('success-overlay');
    const successMessage = document.getElementById('success-message');

    // Debug inicial
    console.log('Elementos carregados:', {
        form, fileInput, fileNamesContainer, uploadArea,
        errorMessage, errorText, successOverlay, successMessage
    });

    // Mostrar nomes dos arquivos selecionados
    fileInput.addEventListener('change', function(e) {
        console.log('Arquivos selecionados:', this.files);
        fileNamesContainer.innerHTML = '';
        
        if (this.files.length > 0) {
            const filesList = document.createElement('ul');
            filesList.style.listStyle = 'none';
            filesList.style.paddingLeft = '0';
            filesList.style.marginTop = '10px';
            
            for (let i = 0; i < this.files.length; i++) {
                if (i >= 5) break; // Limite de 5 arquivos
                
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <i class="fas fa-file-image" style="margin-right: 8px; color: ${i < 5 ? 'var(--primary-color)' : 'var(--error-color)'}"></i>
                    ${this.files[i].name}
                `;
                filesList.appendChild(listItem);
            }
            
            if (this.files.length > 5) {
                const warning = document.createElement('p');
                warning.style.color = 'var(--error-color)';
                warning.style.fontSize = '0.8rem';
                warning.style.marginTop = '8px';
                warning.textContent = 'Apenas os primeiros 5 arquivos serão considerados';
                fileNamesContainer.appendChild(warning);
            }
            
            fileNamesContainer.appendChild(filesList);
        }
    });
    
    // Função para mostrar mensagem de erro
    function showError(message) {
        console.log('Mostrando erro:', message);
        if (!errorMessage || !errorText) {
            console.error('Elementos de erro não encontrados!');
            return;
        }
        
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        
        // Adiciona animação
        errorMessage.style.animation = 'fadeIn 0.3s forwards';
        
        // Esconder após 5 segundos
        setTimeout(() => {
            errorMessage.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 500);
        }, 5000);
    }
    
    // Função para mostrar sucesso
    function showSuccess() {
        console.log('Mostrando mensagem de sucesso');
        if (!successOverlay || !successMessage) {
            console.error('Elementos de sucesso não encontrados!');
            return;
        }
        
        successOverlay.style.display = 'block';
        successMessage.style.display = 'block';
        successMessage.style.animation = 'fadeIn 0.5s forwards';
        
        // Esconder após 5 segundos
        setTimeout(() => {
            successMessage.style.animation = 'fadeOut 0.5s forwards';
            successOverlay.style.opacity = '0';
            setTimeout(() => {
                successOverlay.style.display = 'none';
                successMessage.style.display = 'none';
            }, 500);
        }, 5000);
    }
    
    // Fechar mensagens ao clicar
    if (errorMessage) {
        errorMessage.addEventListener('click', function() {
            this.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                this.style.display = 'none';
            }, 300);
        });
    }
    
    if (successOverlay) {
        successOverlay.addEventListener('click', function() {
            successMessage.style.animation = 'fadeOut 0.3s forwards';
            this.style.opacity = '0';
            setTimeout(() => {
                this.style.display = 'none';
                successMessage.style.display = 'none';
            }, 300);
        });
    }
    
    // Validação do formulário
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulário submetido - Iniciando validação');
            
            // Resetar estados de erro
            uploadArea.style.borderColor = 'var(--primary-light)';
            uploadArea.classList.remove('invalid');
            errorMessage.style.display = 'none';
            
            // Obter valores dos campos
            const itemName = document.getElementById('item-name').value.trim();
            const category = document.getElementById('category').value;
            const quality = document.querySelector('input[name="quality"]:checked');
            const condition = document.querySelector('input[name="condition"]:checked');
            const description = document.getElementById('description').value.trim();
            const photos = fileInput.files.length;
            const ngo = document.getElementById('ngo').value;
            
            console.log('Valores do formulário:', {
                itemName, category, quality, condition, description, photos, ngo
            });
            
            // Validação passo a passo
            if (!itemName) {
                showError('Por favor, informe o nome do item');
                document.getElementById('item-name').focus();
                return;
            }
            
            if (!category) {
                showError('Por favor, selecione uma categoria');
                document.getElementById('category').focus();
                return;
            }
            
            if (!quality) {
                showError('Por favor, selecione a qualidade do item');
                return;
            }
            
            if (!condition) {
                showError('Por favor, selecione o estado do item');
                return;
            }
            
            if (!description) {
                showError('Por favor, informe a descrição do item');
                document.getElementById('description').focus();
                return;
            }
            
            if (photos === 0) {
                showError('Por favor, adicione pelo menos uma foto do item');
                uploadArea.style.borderColor = 'var(--error-color)';
                uploadArea.classList.add('invalid');
                return;
            }
            
            if (!ngo) {
                showError('Por favor, selecione uma instituição para doação');
                document.getElementById('ngo').focus();
                return;
            }
            
            // Se tudo estiver válido
            console.log('Formulário válido - Mostrando sucesso');
            showSuccess();
            
            // Resetar formulário após 2 segundos
            setTimeout(() => {
                form.reset();
                fileNamesContainer.innerHTML = '';
                uploadArea.style.borderColor = 'var(--primary-light)';
                uploadArea.classList.remove('invalid');
                console.log('Formulário resetado');
            }, 2000);
        });
    } else {
        console.error('Formulário não encontrado!');
    }
});