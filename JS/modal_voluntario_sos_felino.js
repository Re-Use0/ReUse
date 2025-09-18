
  // Função para abrir o modal de voluntário
  function openVolunteerModal() {
    document.getElementById('volunteerModal').style.display = 'block';
    populateDateSelectors();
  }
  
  // Função para fechar o modal de voluntário
  function closeVolunteerModal() {
    document.getElementById('volunteerModal').style.display = 'none';
  }
  
  // Preencher os seletores de data
  function populateDateSelectors() {
    const daySelect = document.getElementById('birthDay');
    const monthSelect = document.getElementById('birthMonth');
    const yearSelect = document.getElementById('birthYear');
    
    // Preencher dias (1-31)
    if (daySelect && daySelect.options.length <= 1) {
      for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
      }
    }
    
    // Preencher meses
    if (monthSelect && monthSelect.options.length <= 1) {
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
      });
    }
    
    // Preencher anos (1900-ano atual)
    if (yearSelect && yearSelect.options.length <= 1) {
      const currentYear = new Date().getFullYear();
      for (let i = currentYear; i >= 1900; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
      }
    }
  }
  
  // Configurar eventos quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', function() {
    // Obter o modal
    const volunteerModal = document.getElementById('volunteerModal');
    
    // Quando o usuário clicar no botão de voluntário, abrir o modal
    const volunteerButtons = document.querySelectorAll('.Voluntário-button');
    volunteerButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        openVolunteerModal();
      });
    });
    
    // Quando o usuário clicar no (x), fechar o modal
    const closeBtn = document.querySelector('.volunteer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeVolunteerModal);
    }
    
    // Quando o usuário clicar fora do modal, fechar
    window.addEventListener('click', function(event) {
      if (event.target == volunteerModal) {
        closeVolunteerModal();
      }
    });
    
    // Mostrar/ocultar campo de experiência baseado na seleção
    const volunteerYes = document.getElementById('volunteerYes');
    const volunteerNo = document.getElementById('volunteerNo');
    const experienceGroup = document.getElementById('experienceGroup');
    
    if (volunteerYes && volunteerNo && experienceGroup) {
      volunteerYes.addEventListener('change', function() {
        experienceGroup.style.display = 'block';
      });
      
      volunteerNo.addEventListener('change', function() {
        experienceGroup.style.display = 'none';
      });
    }
    
    // Buscar CEP
    const cepButton = document.getElementById('cep-button');
    if (cepButton) {
      cepButton.addEventListener('click', searchCEP);
    }
    
    // Auto-calcular idade quando a data de nascimento for alterada
    const birthDay = document.getElementById('birthDay');
    const birthMonth = document.getElementById('birthMonth');
    const birthYear = document.getElementById('birthYear');
    const ageInput = document.getElementById('age');
    
    if (birthDay && birthMonth && birthYear && ageInput) {
      [birthDay, birthMonth, birthYear].forEach(select => {
        select.addEventListener('change', calculateAge);
      });
    }
    
    // Formatar telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', formatPhone);
    }
    
    // Formatar CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
      cepInput.addEventListener('input', formatCEP);
    }
    
    // Manipular envio do formulário
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
      volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (validateVolunteerForm()) {
          // Aqui você pode adicionar a lógica para processar o cadastro
          showSuccessMessage();
          setTimeout(() => {
            closeVolunteerModal();
            volunteerForm.reset();
            document.getElementById('volunteer-success-overlay').style.display = 'none';
            document.getElementById('volunteer-success-message').style.display = 'none';
          }, 2000);
        }
      });
    }
  });
  
  // Função para buscar CEP
  function searchCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      alert('CEP inválido. Digite um CEP com 8 dígitos.');
      return;
    }
    
    // Simulação de busca de CEP (substitua por uma API real)
    alert('Buscando CEP: ' + cep);
    // Exemplo de como seria com a API ViaCEP:
    // fetch(`https://viacep.com.br/ws/${cep}/json/`)
    //   .then(response => response.json())
    //   .then(data => {
    //     if (!data.erro) {
    //       document.getElementById('address').value = data.logradouro;
    //       document.getElementById('neighborhood').value = data.bairro;
    //       document.getElementById('city').value = data.localidade;
    //       document.getElementById('state').value = data.uf;
    //     } else {
    //       alert('CEP não encontrado.');
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Erro ao buscar CEP:', error);
    //     alert('Erro ao buscar CEP. Tente novamente.');
    //   });
  }
  
  // Função para calcular idade
  function calculateAge() {
    const day = document.getElementById('birthDay').value;
    const month = document.getElementById('birthMonth').value;
    const year = document.getElementById('birthYear').value;
    const ageInput = document.getElementById('age');
    
    if (day && month && year) {
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      ageInput.value = age;
    }
  }
  
  // Função para formatar telefone
  function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    e.target.value = value;
  }
  
  // Função para formatar CEP
  function formatCEP(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    
    e.target.value = value;
  }
  
  // Função para validar formulário
  function validateVolunteerForm() {
    const ageInput = document.getElementById('age');
    const age = parseInt(ageInput.value);
    
    if (age < 18) {
      alert('Você deve ter pelo menos 18 anos para se voluntariar.');
      return false;
    }
    
    return true;
  }
  
  // Função para mostrar mensagem de sucesso
  function showSuccessMessage() {
    document.getElementById('volunteer-success-overlay').style.display = 'block';
    document.getElementById('volunteer-success-message').style.display = 'block';
  }
