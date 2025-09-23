// JavaScript - Adicionar este código
document.getElementById('botaoMenu').addEventListener('click', function(e) {
    e.stopPropagation();
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('mostrar');
});

// Fechar menu ao clicar fora
document.addEventListener('click', function() {
    const menu = document.getElementById('navMenu');
    menu.classList.remove('mostrar');
});

// Impedir que clique no menu feche
document.getElementById('navMenu').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Opcional: Fechar ao redimensionar acima de 950px
window.addEventListener('resize', function() {
    if (window.innerWidth > 950) {
        const menu = document.getElementById('navMenu');
        menu.classList.remove('mostrar');
    }
});