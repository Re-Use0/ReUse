        // Função para mostrar/ocultar abas
        function showTab(tabName) {
            // Esconder todos os conteúdos de abas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active-tab');
            });
            
            // Desativar todas as abas
            document.querySelectorAll('.institution-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Ativar a aba clicada
            document.getElementById(tabName).classList.add('active-tab');
            document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
        }
        
        // Função para abrir as abas de configurações
        function openTab(evt, tabName) {
            // Esconder todos os conteúdos de abas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Desativar todos os botões de abas
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Mostrar a aba atual
            document.getElementById(tabName).classList.add('active');
            
            // Adicionar classe active ao botão que abriu a aba
            evt.currentTarget.classList.add('active');
        }
        
        // Função para resetar formulários
        function resetForm(formId) {
            document.getElementById(formId).reset();
            showToast('Alterações descartadas', 'info');
        }
        
        // Função para verificar força da senha
        function checkPasswordStrength(password) {
            const strengthBar = document.getElementById('password-strength');
            const feedback = document.getElementById('password-feedback');
            
            if (!password) {
                strengthBar.style.width = '0%';
                strengthBar.className = 'password-strength';
                feedback.textContent = '';
                return;
            }
            
            // Verificar critérios de força
            let strength = 0;
            let feedbackText = '';
            
            // Comprimento mínimo
            if (password.length >= 8) strength += 20;
            
            // Letras maiúsculas
            if (/[A-Z]/.test(password)) strength += 20;
            
            // Números
            if (/[0-9]/.test(password)) strength += 20;
            
            // Caracteres especiais
            if (/[^A-Za-z0-9]/.test(password)) strength += 20;
            
            // Comprimento extra
            if (password.length >= 12) strength += 20;
            
            // Definir classe e texto de feedback baseado na força
            let strengthClass = '';
            if (strength < 40) {
                strengthClass = 'weak';
                feedbackText = 'Senha fraca';
            } else if (strength < 80) {
                strengthClass = 'medium';
                feedbackText = 'Senha média';
            } else {
                strengthClass = 'strong';
                feedbackText = 'Senha forte';
            }
            
            // Atualizar a barra e feedback
            strengthBar.style.width = strength + '%';
            strengthBar.className = 'password-strength ' + strengthClass;
            feedback.textContent = feedbackText;
        }
        
        // Função para verificar se as senhas coincidem
        function checkPasswordMatch() {
            const password = document.getElementById('nova-senha').value;
            const confirmPassword = document.getElementById('confirmar-senha').value;
            const matchElement = document.getElementById('password-match');
            
            if (!confirmPassword) {
                matchElement.textContent = '';
                return;
            }
            
            if (password === confirmPassword) {
                matchElement.textContent = 'Senhas coincidem';
                matchElement.className = 'password-feedback match';
            } else {
                matchElement.textContent = 'Senhas não coincidem';
                matchElement.className = 'password-feedback no-match';
            }
        }
        
        // Função para terminar sessão
        function terminateSession(button) {
            const sessionItem = button.closest('.session-item');
            sessionItem.remove();
            showToast('Sessão terminada com sucesso', 'success');
        }
        
        // Função para mostrar toast de notificação
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast show ' + type;
            
            // Esconder o toast após 3 segundos
            setTimeout(() => {
                toast.className = 'toast';
            }, 3000);
        }
        
        // Função para mostrar modal de confirmação
        function showConfirmationModal(message, callback) {
            const modal = document.getElementById('confirmation-modal');
            const messageElement = document.getElementById('confirmation-message');
            const actionButton = document.getElementById('confirmation-action-button');
            
            messageElement.textContent = message;
            
            // Definir a função de callback no botão de confirmação
            actionButton.onclick = function() {
                callback();
                closeConfirmationModal();
            };
            
            modal.style.display = 'flex';
        }
        
        // Função para fechar modal de confirmação
        function closeConfirmationModal() {
            document.getElementById('confirmation-modal').style.display = 'none';
        }
        
        // Função para sair de todos os dispositivos
        function logoutAllDevices() {
            const sessions = document.querySelectorAll('.session-item:not(.current)');
            sessions.forEach(session => session.remove());
            showToast('Todas as outras sessões foram terminadas', 'success');
        }
        
        // Função para selecionar tema
        function selectTheme(element) {
            document.querySelectorAll('.theme-option').forEach(option => {
                option.classList.remove('active');
            });
            
            element.classList.add('active');
            
            const theme = element.getAttribute('data-theme');
            showToast(`Tema ${theme} selecionado`, 'success');
        }
        
        // Função para exportar dados
        function exportData() {
            const format = document.querySelector('input[name="export-format"]:checked').value;
            showToast(`Exportando dados em formato ${format.toUpperCase()}`, 'info');
        }
        
        // Função para redefinir preferências
        function resetPreferences() {
            document.getElementById('preferences-form').reset();
            document.querySelector('.theme-option.theme-light').classList.add('active');
            document.querySelector('.theme-option.theme-dark').classList.remove('active');
            document.querySelector('.theme-option.theme-auto').classList.remove('active');
            showToast('Preferências redefinidas para os valores padrão', 'success');
        }
        
        // Preview de imagem ao fazer upload
        document.getElementById('logo').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('logo-preview');
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview da nova logo">`;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Prevenir envio dos formulários (apenas para demonstração)
        document.querySelectorAll('.settings-form').forEach(form => {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                showToast('Alterações salvas com sucesso', 'success');
            });
        });