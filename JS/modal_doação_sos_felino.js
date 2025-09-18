
  // Função para abrir o modal de doação
  function openDonationModal() {
    document.getElementById('donationModal').style.display = 'block';
  }
  
  // Função para fechar o modal de doação
  function closeDonationModal() {
    document.getElementById('donationModal').style.display = 'none';
  }
  
  // Configurar eventos quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', function() {
    // Obter o modal
    const modal = document.getElementById('donationModal');
    
    // Quando o usuário clicar no botão de doação, abrir o modal
    const donateButtons = document.querySelectorAll('.donate-btn, .donate-button');
    donateButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        openDonationModal();
      });
    });
    
    // Quando o usuário clicar no (x), fechar o modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDonationModal);
    }
    
    // Quando o usuário clicar fora do modal, fechar
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        closeDonationModal();
      }
    });
    
    // Manipular envio do formulário
    const donationForm = document.getElementById('doacao-form');
    if (donationForm) {
      donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para processar a doação
        alert('Doação enviada com sucesso!');
        closeDonationModal();
      });
    }
  });
