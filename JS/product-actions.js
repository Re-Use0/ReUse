document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const removeProductBtn = document.getElementById('remove-product-btn');
    const editProductBtn = document.getElementById('edit-product-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const editModal = document.getElementById('edit-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-edit-modal');
    const cancelRemoveBtn = document.getElementById('cancel-remove-btn');
    const confirmRemoveBtn = document.getElementById('confirm-remove-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editProductForm = document.getElementById('edit-product-form');

    // Função para mostrar o modal com animação
    function showModal(modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transition = 'opacity 0.3s ease';
        }, 10);
    }

    // Função para esconder o modal com animação
    function hideModal(modal) {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Evento para abrir modal de remoção
    removeProductBtn.addEventListener('click', function() {
        showModal(confirmModal);
    });

    // Evento para abrir modal de edição
    editProductBtn.addEventListener('click', function() {
        showModal(editModal);
    });

    // Eventos para fechar modais
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });

    // Evento para cancelar remoção
    cancelRemoveBtn.addEventListener('click', function() {
        hideModal(confirmModal);
    });

    // Evento para cancelar edição
    cancelEditBtn.addEventListener('click', function() {
        hideModal(editModal);
    });

    // Evento para confirmar remoção
    confirmRemoveBtn.addEventListener('click', function() {
        // Aqui você faria a chamada para a API ou manipulação do DOM para remover o produto
        console.log('Produto removido!');
        
        // Simulação de remoção - redireciona para a página do vendedor
        alert('Produto removido com sucesso!');
        window.location.href = 'vendedor.html';
        
        hideModal(confirmModal);
    });

    // Evento para submeter o formulário de edição
    editProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta os valores do formulário
        const productData = {
            name: document.getElementById('edit-product-name').value,
            price: document.getElementById('edit-product-price').value,
            category: document.getElementById('edit-product-category').value,
            condition: document.getElementById('edit-product-condition').value,
            description: document.getElementById('edit-product-description').value,
            size: document.getElementById('edit-product-size').value,
            color: document.getElementById('edit-product-color').value,
            material: document.getElementById('edit-product-material').value
        };
        
        console.log('Dados do produto atualizados:', productData);
        
        // Atualiza os dados na página
        document.querySelector('.product-info h1').textContent = productData.name;
        document.querySelector('.product-price').textContent = `R$ ${parseFloat(productData.price).toFixed(2).replace('.', ',')}`;
        document.querySelector('.product-category').textContent = productData.category;
        document.querySelector('.product-condition').textContent = productData.condition;
        document.querySelector('.product-description p').textContent = productData.description;
        
        const specsList = document.querySelectorAll('.product-specs li');
        specsList[0].innerHTML = `<strong>Tamanho:</strong> ${productData.size}`;
        specsList[1].innerHTML = `<strong>Cor:</strong> ${productData.color}`;
        specsList[2].innerHTML = `<strong>Material:</strong> ${productData.material}`;
        
        // Simulação de upload de imagem (se uma nova imagem foi selecionada)
        const imageInput = document.getElementById('edit-product-image');
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.product-images img').src = e.target.result;
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
        
        // Feedback para o usuário
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = 'Alterações salvas com sucesso!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        hideModal(editModal);
    });

    // Fechar o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            hideModal(event.target);
        }
    });

    // Adiciona máscara para o campo de preço
    const priceInput = document.getElementById('edit-product-price');
    priceInput.addEventListener('input', function() {
        // Garante que o valor tenha sempre duas casas decimais
        if (this.value.indexOf('.') === -1) {
            this.value = parseFloat(this.value || 0).toFixed(2);
        }
    });
});