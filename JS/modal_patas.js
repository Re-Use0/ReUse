// ========== CÓDIGO PARA MODAL DE DOAÇÃO ==========
// Função para abrir o modal de doação
function openDonationModal() {
  document.getElementById('donationModal').style.display = 'block';
}

// Função para fechar o modal de doação
function closeDonationModal() {
  document.getElementById('donationModal').style.display = 'none';
}

// ========== CÓDIGO PARA MODAL DE VOLUNTÁRIO ==========
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

// Função para buscar endereço via API dos Correios (ViaCEP)
async function buscarEnderecoPorCEP(cep) {
  try {
    // Limpar o CEP (remover caracteres não numéricos)
    cep = cep.replace(/\D/g, '');
    
    // Verificar se o CEP tem 8 dígitos
    if (cep.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }
    
    // Fazer a requisição para a API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar CEP');
    }
    
    const data = await response.json();
    
    // Verificar se o CEP foi encontrado
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    // Preencher os campos com os dados retornados
    document.getElementById('address').value = data.logradouro || '';
    document.getElementById('neighborhood').value = data.bairro || '';
    document.getElementById('city').value = data.localidade || '';
    document.getElementById('state').value = data.uf || '';
    
    // Dar foco ao campo de complemento
    document.getElementById('complement').focus();
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    alert(`Erro ao buscar endereço: ${error.message}`);
    
    // Limpar os campos em caso de erro
    document.getElementById('address').value = '';
    document.getElementById('neighborhood').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
  }
}

// Formatar CEP (xxxxx-xxx)
function formatarCEP(cep) {
  cep = cep.replace(/\D/g, '');
  cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  return cep;
}

// Formatar telefone ((xx) xxxxx-xxxx)
function formatarTelefone(telefone) {
  telefone = telefone.replace(/\D/g, '');
  telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2');
  telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
  return telefone;
}

// Calcular idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  
  // Ajustar idade se ainda não fez aniversário este ano
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || 
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

// Validar e-mail
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar formulário de voluntário
function validarFormularioVoluntario(formData) {
  const errors = [];
  
  // Validar nome
  if (!formData.fullName || formData.fullName.trim().length < 3) {
    errors.push('Nome completo deve ter pelo menos 3 caracteres');
  }
  
  // Validar idade (mínimo 16 anos)
  if (!formData.age || formData.age < 16) {
    errors.push('Idade mínima para voluntariado é 16 anos');
  }
  
  // Validar CEP
  if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) {
    errors.push('CEP inválido');
  }
  
  // Validar telefone
  if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
    errors.push('Telefone inválido');
  }
  
  // Validar e-mail
  if (!formData.email || !validarEmail(formData.email)) {
    errors.push('E-mail inválido');
  }
  
  // Validar disponibilidade
  if (!formData.availableDays || !formData.availableHours) {
    errors.push('Informe sua disponibilidade');
  }
  
  return errors;
}

// Configurar eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // ========== CONFIGURAÇÃO DO MODAL DE DOAÇÃO ==========
  const donationModal = document.getElementById('donationModal');
  
  // Quando o usuário clicar no botão de doação, abrir o modal
  const donateButtons = document.querySelectorAll('.donate-button');
  donateButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openDonationModal();
    });
  });
  
  // Quando o usuário clicar no (x), fechar o modal
  const closeDonationBtn = document.querySelector('#donationModal .close');
  if (closeDonationBtn) {
    closeDonationBtn.addEventListener('click', closeDonationModal);
  }
  
  // Quando o usuário clicar fora do modal, fechar
  window.addEventListener('click', function(event) {
    if (event.target == donationModal) {
      closeDonationModal();
    }
  });
  
  // Manipular envio do formulário de doação
  const donationForm = document.getElementById('doacao-form');
  if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Coletar dados do formulário
      const formData = new FormData(donationForm);
      const donationData = {
        item: formData.get('nome-item'),
        categoria: formData.get('categoria'),
        qualidade: formData.get('qualidade'),
        estado: formData.get('estado'),
        descricao: formData.get('descricao'),
        fotos: document.getElementById('fotos').files
      };
      
      // Aqui você pode adicionar a lógica para processar a doação
      console.log('Dados da doação:', donationData);
      alert('Doação enviada com sucesso! Em breve entraremos em contato para combinar a coleta.');
      closeDonationModal();
      donationForm.reset();
    });
  }
  
  // ========== CONFIGURAÇÃO DO MODAL DE VOLUNTÁRIO ==========
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
  const closeVolunteerBtn = document.querySelector('.volunteer-close');
  if (closeVolunteerBtn) {
    closeVolunteerBtn.addEventListener('click', closeVolunteerModal);
  }
  
  // Quando o usuário clicar fora do modal, fechar
  window.addEventListener('click', function(event) {
    if (event.target == volunteerModal) {
      closeVolunteerModal();
    }
  });
  
  // Formatar CEP automaticamente
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', function(e) {
      this.value = formatarCEP(this.value);
    });
    
    // Buscar endereço quando o CEP estiver completo
    cepInput.addEventListener('blur', function() {
      const cep = this.value.replace(/\D/g, '');
      if (cep.length === 8) {
        buscarEnderecoPorCEP(cep);
      }
    });
  }
  
  // Botão de busca de CEP
  const cepButton = document.getElementById('cep-button');
  if (cepButton) {
    cepButton.addEventListener('click', function() {
      const cep = document.getElementById('cep').value.replace(/\D/g, '');
      if (cep.length === 8) {
        buscarEnderecoPorCEP(cep);
      } else {
        alert('CEP inválido. Digite um CEP com 8 dígitos.');
      }
    });
  }
  
  // Formatar telefone automaticamente
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      this.value = formatarTelefone(this.value);
    });
  }
  
  // Mostrar/ocultar campo de experiência
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
  
  // Calcular idade automaticamente quando a data de nascimento for alterada
  const daySelect = document.getElementById('birthDay');
  const monthSelect = document.getElementById('birthMonth');
  const yearSelect = document.getElementById('birthYear');
  const ageInput = document.getElementById('age');
  const birthDateInput = document.getElementById('birthDate');
  
  function atualizarIdade() {
    if (daySelect.value && monthSelect.value && yearSelect.value) {
      const dataNascimento = `${yearSelect.value}-${monthSelect.value.padStart(2, '0')}-${daySelect.value.padStart(2, '0')}`;
      const idade = calcularIdade(dataNascimento);
      
      if (ageInput) ageInput.value = idade;
      if (birthDateInput) birthDateInput.value = dataNascimento;
    }
  }
  
  if (daySelect && monthSelect && yearSelect) {
    daySelect.addEventListener('change', atualizarIdade);
    monthSelect.addEventListener('change', atualizarIdade);
    yearSelect.addEventListener('change', atualizarIdade);
  }
  
  // Manipular envio do formulário de voluntário
  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Coletar dados do formulário
      const formData = new FormData(volunteerForm);
      const volunteerData = {
        fullName: formData.get('fullName'),
        birthDate: formData.get('birthDate'),
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        cep: formData.get('cep'),
        address: formData.get('address'),
        complement: formData.get('complement'),
        neighborhood: formData.get('neighborhood'),
        city: formData.get('city'),
        state: formData.get('state'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        volunteerBefore: formData.get('volunteerBefore'),
        experience: formData.get('experience'),
        availableDays: formData.get('availableDays'),
        availableHours: formData.get('availableHours'),
        trainingAvailable: formData.get('trainingAvailable'),
        healthCondition: formData.get('healthCondition'),
        motivation: formData.get('motivation')
      };
      
      // Validar dados
      const errors = validarFormularioVoluntario(volunteerData);
      
      if (errors.length > 0) {
        alert('Por favor, corrija os seguintes erros:\n' + errors.join('\n'));
        return;
      }
      
      try {
        // Aqui você pode adicionar a lógica para enviar os dados para o servidor
        // Simulando uma requisição assíncrona
        console.log('Dados do voluntário:', volunteerData);
        
        // Mostrar mensagem de sucesso
        document.getElementById('volunteer-success-overlay').style.display = 'block';
        document.getElementById('volunteer-success-message').style.display = 'block';
        
        // Fechar a mensagem após 3 segundos e resetar o formulário
        setTimeout(function() {
          document.getElementById('volunteer-success-overlay').style.display = 'none';
          document.getElementById('volunteer-success-message').style.display = 'none';
          closeVolunteerModal();
          volunteerForm.reset();
        }, 3000);
        
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Erro ao enviar formulário. Tente novamente.');
      }
    });
  }
  
  // ========== CONFIGURAÇÃO DAS ABAS ==========
  const tabs = document.querySelectorAll('.institution-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove a classe active de todas as tabs e conteúdos
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Adiciona a classe active à tab clicada
      tab.classList.add('active');
      
      // Mostra o conteúdo correspondente
      const tabId = Array.from(tabs).indexOf(tab);
      tabContents[tabId].classList.add('active');
    });
  });
  
  // ========== CONFIGURAÇÃO DO MAPA ==========
  let mapLoaded = false;
  
  function setupMapTab() {
    const tabs = document.querySelectorAll('.institution-tab');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Se for a aba de Contato (índice 3) e o mapa ainda não foi carregado
        if (index === 3 && !mapLoaded) {
          loadMap();
          mapLoaded = true;
        }
      });
    });
  }
  
  function loadMap() {
    if (window.L) {
      initMap();
      return;
    }
  
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(leafletCSS);
    
    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    leafletJS.onload = initMap;
    document.head.appendChild(leafletJS);
  }
  
  function initMap() {
    // Coordenadas da Fatec Taquaritinga: -21.4064, -48.5047
    const map = L.map('map').setView([-21.4064, -48.5047], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([-21.4064, -48.5047]).addTo(map)
      .bindPopup('<b>Patas Concientes</b><br>Av. Dr. Flávio Henrique Lemos, 585 - Taquaritinga/SP')
      .openPopup();
  }
  
  // Configurar o mapa quando a página carregar
  setupMapTab();
  
  // ========== CONFIGURAÇÃO DO CARROSSEL ==========
  let currentSlide = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  
  function showSlide(index) {
    // Ajusta o índice se for além dos limites
    if (index >= totalSlides) currentSlide = 0;
    if (index < 0) currentSlide = totalSlides - 1;
    
    // Move o carrossel
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Atualiza os indicadores
    updateIndicators();
  }
  
  function updateIndicators() {
    const indicators = document.querySelectorAll('.carousel-indicators span');
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  // Configurar botões de navegação
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  
  if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
      currentSlide--;
      showSlide(currentSlide);
    });
    
    nextButton.addEventListener('click', () => {
      currentSlide++;
      showSlide(currentSlide);
    });
  }
  
  // Criar indicadores
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  if (indicatorsContainer) {
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('span');
      indicator.addEventListener('click', () => {
        currentSlide = i;
        showSlide(currentSlide);
      });
      indicatorsContainer.appendChild(indicator);
    }
    updateIndicators();
  }
  
  // Iniciar rotação automática
  let carouselInterval = setInterval(() => {
    currentSlide++;
    showSlide(currentSlide);
  }, 5000);
  
  // Pausar rotação ao passar o mouse
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(carouselInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
      }, 5000);
    });
  }
  
  // ========== CONFIGURAÇÃO DO MENU MOBILE ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Fechar menu ao clicar em um link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
});