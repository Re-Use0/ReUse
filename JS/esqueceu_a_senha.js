        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('recoveryForm');
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            const successModal = document.getElementById('successModal');
            const userEmailSpan = document.getElementById('userEmail');
            
            // Função para validar email
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
            
            // Event listener para validação em tempo real
            emailInput.addEventListener('input', function() {
                if (validateEmail(emailInput.value)) {
                    emailError.textContent = '';
                    emailInput.style.borderColor = '';
                }
            });
            
            // Event listener para envio do formulário
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                
                // Validar email
                if (!validateEmail(emailInput.value)) {
                    emailError.textContent = 'Por favor, insira um email válido.';
                    emailInput.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    emailError.textContent = '';
                    emailInput.style.borderColor = '';
                }
                
                // Se o formulário for válido, mostrar modal de sucesso
                if (isValid) {
                    userEmailSpan.textContent = emailInput.value;
                    successModal.style.display = 'flex';
                    
                    // Adicionar efeito de confetti (simulado)
                    createConfetti();
                }
            });
            
            // Criar efeito de confetti
            function createConfetti() {
                const confettiContainer = document.querySelector('.particles-container');
                const colors = ['#0066cc', '#00cc99', '#6a5acd', '#ff6b6b', '#ffb400'];
                
                for (let i = 0; i < 20; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'particle';
                    confetti.style.width = `${Math.random() * 10 + 5}px`;
                    confetti.style.height = confetti.style.width;
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.left = `${Math.random() * 100}%`;
                    confetti.style.top = `${Math.random() * 100}%`;
                    confetti.style.animationDuration = `${Math.random() * 5 + 5}s`;
                    confetti.style.animationDelay = `${Math.random() * 2}s`;
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '40% 60% 70% 30% / 40% 50% 60% 50%';
                    
                    confettiContainer.appendChild(confetti);
                    
                    // Remover após a animação
                    setTimeout(() => {
                        confetti.remove();
                    }, 7000);
                }
            }
        });
        
        // Função para fechar o modal
        function closeSuccessModal() {
            document.getElementById('successModal').style.display = 'none';
        }