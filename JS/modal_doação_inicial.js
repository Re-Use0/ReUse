// Abrir modal de doação
document.addEventListener('DOMContentLoaded', function() {
    const donateButton = document.querySelector('.action-button.donate');
    const donationModal = document.getElementById('donation-modal');
    const closeModalButton = document.getElementById('close-donation-modal');
    const donationForm = document.getElementById('donation-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const successOverlay = document.getElementById('success-overlay');
    const fileInput = document.getElementById('photos');
    const selectedFiles = document.getElementById('selected-files');

    // Abrir modal ao clicar em doar
    if (donateButton) {
        donateButton.addEventListener('click', function(e) {
            e.preventDefault();
            donationModal.classList.add('active');
        });
    }

    // Fechar modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            donationModal.classList.remove('active');
        });
    }

    // Fechar modal clicando fora dele
    donationModal.addEventListener('click', function(e) {
        if (e.target === donationModal) {
            donationModal.classList.remove('active');
        }
    });

    // Manipular envio do formulário
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            let isValid = true;
            const requiredFields = donationForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                errorMessage.style.display = 'flex';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
                return;
            }
            
            // Simular envio bem-sucedido
            donationModal.classList.remove('active');
            successMessage.style.display = 'block';
            successOverlay.style.display = 'block';
            
            // Limpar formulário
            donationForm.reset();
            selectedFiles.innerHTML = '';
            
            // Ocultar mensagem de sucesso após 3 segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
                successOverlay.style.display = 'none';
            }, 3000);
        });
    }

    // Mostrar arquivos selecionados
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            selectedFiles.innerHTML = '';
            if (this.files.length > 0) {
                const fileList = document.createElement('ul');
                fileList.style.listStyle = 'none';
                fileList.style.padding = '0';
                fileList.style.marginTop = '10px';
                
                Array.from(this.files).forEach(file => {
                    const listItem = document.createElement('li');
                    listItem.textContent = file.name;
                    listItem.style.fontSize = '0.9rem';
                    listItem.style.marginBottom = '5px';
                    fileList.appendChild(listItem);
                });
                
                selectedFiles.appendChild(fileList);
            }
        });
    }
});