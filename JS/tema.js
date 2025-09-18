document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há uma preferência de tema salva
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Adicionar event listeners aos botões de tema
    document.querySelectorAll('.theme-option').forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });
    });
    
    function setTheme(theme) {
        // Remover classes existentes
        document.body.classList.remove('light-mode', 'dark-mode');
        
        // Adicionar a classe do tema selecionado
        document.body.classList.add(theme + '-mode');
        
        // Atualizar botões ativos
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
        
        // Salvar preferência
        localStorage.setItem('theme', theme);
    }
});