        // Função para alternar entre abas
        function openTab(evt, tabName) {
            // Esconder todos os conteúdos de abas
            const tabContents = document.getElementsByClassName("tab-content");
            for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove("active");
            }
            
            // Remover a classe ativa de todos os botões
            const tabButtons = document.getElementsByClassName("tab-button");
            for (let i = 0; i < tabButtons.length; i++) {
                tabButtons[i].classList.remove("active");
            }
            
            // Mostrar a aba atual e adicionar a classe ativa ao botão
            document.getElementById(tabName).classList.add("active");
            evt.currentTarget.classList.add("active");
            
            // Atualizar o breadcrumb
            document.getElementById("current-breadcrumb").textContent = evt.currentTarget.textContent;
        }
        
        // Função para mostrar toast de notificação
        function showToast(message, type = "info") {
            const toast = document.getElementById("toast");
            toast.textContent = message;
            toast.className = "toast";
            toast.classList.add(type);
            toast.classList.add("show");
            
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        }
        
        // Função para mostrar modal de confirmação
        function showConfirmationModal(message, callback) {
            const modal = document.getElementById("confirmation-modal");
            const messageElement = document.getElementById("confirmation-message");
            const actionButton = document.getElementById("confirmation-action-button");
            
            messageElement.textContent = message;
            actionButton.onclick = function() {
                callback();
                closeConfirmationModal();
            };
            
            modal.style.display = "flex";
        }
        
        // Função para fechar modal de confirmação
        function closeConfirmationModal() {
            const modal = document.getElementById("confirmation-modal");
            modal.style.display = "none";
        }
        
        // Função para resetar formulário
        function resetForm(formId) {
            document.getElementById(formId).reset();
            showToast("Alterações descartadas", "info");
        }
        
        // Função para verificar força da senha
        function checkPasswordStrength(password) {
            const strengthBar = document.getElementById("password-strength");
            const feedback = document.getElementById("password-feedback");
            
            // Reset
            strengthBar.className = "password-strength";
            feedback.textContent = "";
            
            if (password.length === 0) {
                return;
            }
            
            // Verificar força da senha
            let strength = 0;
            let messages = [];
            
            // Verificar comprimento
            if (password.length >= 8) {
                strength += 1;
            } else {
                messages.push("A senha deve ter pelo menos 8 caracteres.");
            }
            
            // Verificar letras maiúsculas e minúsculas
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                strength += 1;
            } else {
                messages.push("Adicione letras maiúsculas e minúsculas.");
            }
            
            // Verificar números
            if (password.match(/([0-9])/)) {
                strength += 1;
            } else {
                messages.push("Adicione pelo menos um número.");
            }
            
            // Verificar caracteres especiais
            if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/)) {
                strength += 1;
            } else {
                messages.push("Adicione pelo menos um caractere especial.");
            }
            
            // Atualizar a barra de força
            if (strength <= 1) {
                strengthBar.classList.add("strength-weak");
                feedback.textContent = "Senha fraca. " + messages.join(" ");
            } else if (strength <= 3) {
                strengthBar.classList.add("strength-medium");
                feedback.textContent = "Senha média. " + messages.join(" ");
            } else {
                strengthBar.classList.add("strength-strong");
                feedback.textContent = "Senha forte!";
            }
        }
        
        // Função para verificar se as senhas coincidem
        function checkPasswordMatch() {
            const password = document.getElementById("nova-senha").value;
            const confirmPassword = document.getElementById("confirmar-senha").value;
            const matchFeedback = document.getElementById("password-match");
            
            if (confirmPassword.length === 0) {
                matchFeedback.textContent = "";
                return;
            }
            
            if (password === confirmPassword) {
                matchFeedback.textContent = "As senhas coincidem!";
                matchFeedback.style.color = "#2eb82e";
            } else {
                matchFeedback.textContent = "As senhas não coincidem.";
                matchFeedback.style.color = "#ff4d4d";
            }
        }
        
        // Função para selecionar tema
        function selectTheme(element) {
            const themeOptions = document.querySelectorAll(".theme-option");
            themeOptions.forEach(option => option.classList.remove("active"));
            element.classList.add("active");
            
            // Aqui você implementaria a lógica para mudar o tema do sistema
            const theme = element.getAttribute("data-theme");
            showToast(`Tema ${theme} selecionado`, "info");
        }
        
        // Função para exportar dados
        function exportData() {
            const format = document.querySelector('input[name="export-format"]:checked').value;
            showToast(`Exportando dados em formato ${format.toUpperCase()}...`, "info");
            
            // Aqui você implementaria a lógica real de exportação
            setTimeout(() => {
                showToast("Dados exportados com sucesso!", "success");
            }, 2000);
        }
        
        // Função para terminar sessão
        function terminateSession(button) {
            const sessionItem = button.closest(".session-item");
            showConfirmationModal("Tem certeza que deseja terminar esta sessão?", function() {
                sessionItem.remove();
                showToast("Sessão terminada com sucesso", "success");
            });
        }
        
        // Função para sair de todos os dispositivos
        function logoutAllDevices() {
            const sessions = document.querySelectorAll(".session-item:not(.current)");
            sessions.forEach(session => session.remove());
            showToast("Todas as outras sessões foram terminadas", "success");
        }
        
        // Função para redefinir preferências
        function resetPreferences() {
            // Aqui você implementaria a lógica para redefinir as preferências
            showToast("Preferências redefinidas para os valores padrão", "success");
        }
        
        // Preview de imagem ao selecionar um novo logo
        document.getElementById("logo").addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = document.getElementById("logo-preview");
                    preview.style.display = "block";
                    preview.querySelector("img").src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Adicionar event listeners para os formulários
        document.getElementById("profile-form").addEventListener("submit", function(e) {
            e.preventDefault();
            showToast("Perfil atualizado com sucesso!", "success");
        });
        
        document.getElementById("security-form").addEventListener("submit", function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById("senha-atual").value;
            const newPassword = document.getElementById("nova-senha").value;
            const confirmPassword = document.getElementById("confirmar-senha").value;
            
            if (newPassword !== confirmPassword) {
                showToast("As senhas não coincidem", "error");
                return;
            }
            
            // Aqui você implementaria a lógica para alterar a senha
            showToast("Senha alterada com sucesso!", "success");
            this.reset();
            document.getElementById("password-strength").className = "password-strength";
            document.getElementById("password-feedback").textContent = "";
            document.getElementById("password-match").textContent = "";
        });
        
        document.getElementById("notifications-form").addEventListener("submit", function(e) {
            e.preventDefault();
            showToast("Preferências de notificação salvas!", "success");
        });
        
        document.getElementById("preferences-form").addEventListener("submit", function(e) {
            e.preventDefault();
            showToast("Preferências salvas com sucesso!", "success");
        });
        
        // Inicialização quando a página carrega
        document.addEventListener("DOMContentLoaded", function() {
            // Adicionar máscara para o telefone
            const telefoneInput = document.getElementById("telefone");
            telefoneInput.addEventListener("input", function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
                }
                
                e.target.value = value;
            });
        });