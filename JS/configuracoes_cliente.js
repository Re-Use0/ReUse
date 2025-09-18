        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('settings-form');
            const cancelButton = document.getElementById('cancel-button');
            const exportButton = document.getElementById('export-data');
            const deleteButton = document.getElementById('delete-account');
            const saveIndicator = document.getElementById('save-indicator');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            const passwordStrength = document.getElementById('password-strength');
            const passwordValidation = document.getElementById('password-validation');
            
            // Função para mostrar mensagens personalizadas
            function showCustomAlert(message, type = 'info', duration = 5000) {
                const alertContainer = document.getElementById('custom-alert-container');
                const alertId = 'alert-' + Date.now();
                
                const alert = document.createElement('div');
                alert.className = `custom-alert ${type}`;
                alert.id = alertId;
                
                let icon = 'bi-info-circle';
                if (type === 'success') icon = 'bi-check-circle';
                if (type === 'error') icon = 'bi-exclamation-circle';
                if (type === 'warning') icon = 'bi-exclamation-triangle';
                
                alert.innerHTML = `
                    <i class="bi ${icon}"></i>
                    <span>${message}</span>
                    <button onclick="document.getElementById('${alertId}').remove()" style="margin-left: auto; background: none; border: none; color: white; cursor: pointer;">
                        <i class="bi bi-x"></i>
                    </button>
                `;
                
                alertContainer.appendChild(alert);
                
                // Mostrar alerta
                setTimeout(() => {
                    alert.classList.add('show');
                }, 10);
                
                // Auto-remover após um tempo
                if (duration > 0) {
                    setTimeout(() => {
                        if (document.getElementById(alertId)) {
                            alert.classList.remove('show');
                            setTimeout(() => {
                                if (document.getElementById(alertId)) {
                                    alert.remove();
                                }
                            }, 300);
                        }
                    }, duration);
                }
                
                return alertId;
            }
            
            // Validação de campos em tempo real
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    // Limpar indicação de salvamento quando o usuário modificar algo
                    saveIndicator.textContent = '';
                    saveIndicator.className = 'save-indicator';
                    
                    // Validar campo em tempo real
                    if (this.value.trim() !== '') {
                        validateField(this);
                    }
                });
            });
            
            function validateField(field) {
                const validationMessage = document.getElementById(`${field.id}-validation`);
                
                if (field.checkValidity()) {
                    field.style.borderColor = '#ddd';
                    if (validationMessage) validationMessage.style.display = 'none';
                    return true;
                } else {
                    field.style.borderColor = '#e74c3c';
                    if (validationMessage) validationMessage.style.display = 'block';
                    return false;
                }
            }
            
            // Validação de força de senha
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 'weak';
                
                if (password.length >= 8) {
                    strength = 'medium';
                    
                    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                        strength = 'strong';
                    }
                }
                
                passwordStrength.className = `password-strength ${strength}`;
                
                // Validar confirmação de senha em tempo real
                if (confirmPasswordInput.value) {
                    validatePasswordMatch();
                }
            });
            
            confirmPasswordInput.addEventListener('input', validatePasswordMatch);
            
            function validatePasswordMatch() {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    confirmPasswordInput.style.borderColor = '#e74c3c';
                    passwordValidation.style.display = 'block';
                    return false;
                } else {
                    confirmPasswordInput.style.borderColor = '#ddd';
                    passwordValidation.style.display = 'none';
                    return true;
                }
            }
            
            // Submissão do formulário
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar todos os campos
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) {
                    showCustomAlert('Por favor, corrija os campos destacados antes de salvar.', 'error');
                    return;
                }
                
                // Validação de senha
                if (passwordInput.value && !validatePasswordMatch()) {
                    showCustomAlert('As senhas não coincidem!', 'error');
                    return;
                }
                
                // Simular salvamento com feedback visual
                saveIndicator.textContent = 'Salvando...';
                saveIndicator.className = 'save-indicator saving';
                
                setTimeout(() => {
                    saveIndicator.textContent = 'Alterações salvas!';
                    saveIndicator.className = 'save-indicator saved';
                    
                    showCustomAlert('Suas configurações foram salvas com sucesso!', 'success');
                    
                    // Restaurar indicador após alguns segundos
                    setTimeout(() => {
                        saveIndicator.textContent = '';
                        saveIndicator.className = 'save-indicator';
                    }, 3000);
                }, 1500);
            });
            
            // Botão cancelar
            cancelButton.addEventListener('click', function() {
                const hasUnsavedChanges = Array.from(inputs).some(input => {
                    const originalValue = input.defaultValue;
                    return input.value !== originalValue;
                });
                
                if (hasUnsavedChanges) {
                    const confirmId = showCustomAlert(
                        '<div style="display: flex; flex-direction: column; gap: 10px;">' +
                        '<span style="font-weight: bold;">Alterações não salvas</span>' +
                        '<span>Você tem alterações não salvas. Deseja descartá-las?</span>' +
                        '<div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">' +
                        '<button style="padding: 8px 16px; border: none; border-radius: 4px; background: #95a5a6; color: white; cursor: pointer;" onclick="document.getElementById(\'' + confirmId + '\').remove();">Cancelar</button>' +
                        '<button style="padding: 8px 16px; border: none; border-radius: 4px; background: #e74c3c; color: white; cursor: pointer;" onclick="window.location.href = \'perfil.html\';">Descartar Alterações</button>' +
                        '</div></div>',
                        'warning',
                        0
                    );
                } else {
                    window.location.href = 'perfil.html';
                }
            });
            
            // Exportar dados
            exportButton.addEventListener('click', function() {
                showCustomAlert('Preparando seus dados para exportação...', 'info');
                
                setTimeout(() => {
                    showCustomAlert(
                        'Solicitação de exportação de dados recebida! Em até 24 horas você receberá um e-mail com um link para baixar todos os seus dados em formato ZIP.',
                        'success',
                        6000
                    );
                }, 1500);
            });
            
            // Excluir conta
            deleteButton.addEventListener('click', function() {
                const confirmId = showCustomAlert(
                    '<div style="display: flex; flex-direction: column; gap: 15px;">' +
                    '<span style="font-weight: bold;">Tem certeza que deseja excluir sua conta?</span>' +
                    '<span>Esta ação é irreversível. Todos os seus dados, histórico de compras e favoritos serão permanentemente removidos.</span>' +
                    '<div style="display: flex; gap: 10px; justify-content: flex-end;">' +
                    '<button style="padding: 8px 16px; border: none; border-radius: 4px; background: #95a5a6; color: white; cursor: pointer;" onclick="document.getElementById(\'' + confirmId + '\').remove()">Cancelar</button>' +
                    '<button style="padding: 8px 16px; border: none; border-radius: 4px; background: #e74c3c; color: white; cursor: pointer;" onclick="confirmAccountDeletion()">Sim, Excluir Minha Conta</button>' +
                    '</div></div>',
                    'error',
                    0
                );
            });
            
            // Função global para confirmação de exclusão
            window.confirmAccountDeletion = function() {
                document.querySelectorAll('.custom-alert').forEach(alert => alert.remove());
                
                showCustomAlert('Solicitação de exclusão de conta recebida. Nossa equipe entrará em contato para confirmar esta ação dentro de 24 horas.', 'info', 8000);
            };
        });