// Banco de dados de produtos
const produtos = {
    "1": {
        id: "1",
        nome: "Camiseta Polo",
        precoVista: 39.90,
        precoParcelado: 39.90,
        parcelas: 1,
        imagem: "IMG/camiseta-polo.jpg",
        descricao: "Camiseta polo usada em bom estado, perfeita para o dia a dia.",
        medidas: ["Tamanho: M"],
        vendedor: "Brechó Elegante",
        vendedorLink: "perfilvendedor.html",
        informacoes: [
            "Material: Algodão",
            "Cor: Azul",
            "Marca: Lacoste",
            "Estado: Bom (pequenos sinais de uso)"
        ],
        condicao: "Usado - Bom estado"
    },
    "2": {
        id: "2",
        nome: "Liquidificador Philips",
        precoVista: 89.90,
        precoParcelado: 89.90 / 3,
        parcelas: 3,
        imagem: "IMG/liquidificador-phill.jpg ",
        descricao: "Liquidificador em perfeito estado, pouco uso.",
        medidas: ["Altura: 30cm", "Largura: 15cm"],
        vendedor: "Casa Usada",
        vendedorLink: "perfilVendedor.html",
        informacoes: [
            "Potência: 500W",
            "Cor: Vermelho",
            "Acessórios: 2 copos medidores",
            "Estado: Excelente"
        ],
        condicao: "Usado - Excelente estado"
    },
    "3": {
        id: "3",
        nome: "Tênis Nike",
        precoVista: 199.99,
        precoParcelado: 199.99 / 10,
        parcelas: 10,
        imagem: "IMG/tenis-nike.avif",
        descricao: "Tênis Nike usado em ótimo estado, ideal para quem busca qualidade e economia.",
        medidas: ["Tamanho do Calçado: 42"],
        vendedor: "Brechó Sustentável",
        vendedorLink: "Perfilvendedor.html",
        informacoes: [
            "Material: mistura de couro, tecido, espuma e borracha",
            "Cor: Azul marinho e Branco",
            "Origem: EUA"
        ],
        condicao: "Usado - Excelente estado"
    },
    "4": {
        id: "4",
        nome: "Vestido Floral",
        precoVista: 65.00,
        precoParcelado: 65.00 / 2,
        parcelas: 2,
        imagem: "IMG/vestido-floral.jpg",
        descricao: "Vestido floral usado poucas vezes, em perfeito estado.",
        medidas: ["Tamanho: 38", "Comprimento: 90cm"],
        vendedor: "Moda Circular",
        vendedorLink: "perfilvendedor.html",
        informacoes: [
            "Material: Viscose",
            "Cor: Floral (rosa, verde e branco)",
            "Estação: Verão",
            "Estado: Como novo"
        ],
        condicao: "Usado - Como novo"
    }
};

// Função para exibir mensagem de confirmação
function showConfirmationMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'cart-message';
    messageElement.textContent = message;

    Object.assign(messageElement.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: '1000',
        transition: 'opacity 0.5s, transform 0.5s',
        opacity: '0',
        transform: 'translateY(-20px)'
    });

    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 3000);
}

// Função para animar o ícone do carrinho
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('cart-pulse');
    setTimeout(() => {
        cartIcon.classList.remove('cart-pulse');
    }, 500);
}

// Função para adicionar ao carrinho
function addToCart(nome, preco, imagem, descricao, id) {
    const cartCount = document.querySelector('.cart-count');
    let itemsInCart = parseInt(cartCount.textContent) || 0;
    itemsInCart++;
    cartCount.textContent = itemsInCart;

    showConfirmationMessage('Produto adicionado ao carrinho com sucesso!');
    animateCartIcon();
}

// Função para carregar os dados do produto
function carregarProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');
    
    if (!produtoId || !produtos[produtoId]) {
        window.location.href = 'cliente.html';
        return;
    }
    
    const produto = produtos[produtoId];
    
    document.getElementById('produto-imagem-principal').src = produto.imagem;
    document.getElementById('produto-imagem-principal').alt = produto.nome;
    document.getElementById('produto-nome').textContent = produto.nome;
    
    document.getElementById('produto-preco-vista').textContent = `R$ ${produto.precoVista.toFixed(2)}`;
    
    if (produto.parcelas > 1) {
        document.getElementById('produto-preco-parcelado').textContent = 
            `${produto.parcelas}x de R$ ${produto.precoParcelado.toFixed(2)} sem juros`;
    } else {
        document.getElementById('produto-preco-parcelado').textContent = 
            `À vista R$ ${produto.precoVista.toFixed(2)}`;
    }
    
    document.getElementById('produto-descricao').textContent = produto.descricao;
    
    const medidasList = document.getElementById('produto-medidas');
    medidasList.innerHTML = '';
    produto.medidas.forEach(medida => {
        const li = document.createElement('li');
        li.textContent = medida;
        medidasList.appendChild(li);
    });
    
    document.getElementById('produto-vendedor').textContent = produto.vendedor;
    document.getElementById('produto-vendedor-link').href = produto.vendedorLink;
    
    const infoList = document.getElementById('produto-informacoes');
    infoList.innerHTML = '';
    produto.informacoes.forEach(info => {
        const li = document.createElement('li');
        li.textContent = info;
        infoList.appendChild(li);
    });
    
    document.querySelector('.condicao-produto strong').nextSibling.textContent = produto.condicao;
    
    const addToCartButton = document.querySelector('.adicionar-carrinho button');
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            addToCart(
                produto.nome,
                produto.precoVista,
                produto.imagem,
                produto.descricao,
                produto.id
            );
        };
    }
}

// Função para buscar informações do CEP
async function buscarCEP(cep) {
    const calcularFreteBtn = document.getElementById('calcular-frete-btn');
    try {
        cep = cep.replace('-', '');

        if (cep.length !== 8) {
            throw new Error('CEP deve conter 8 dígitos');
        }

        calcularFreteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
        calcularFreteBtn.disabled = true;

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        return calcularFreteSimulado(data.uf);

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        mostrarErroFrete(error.message);
        return null;
    } finally {
        calcularFreteBtn.innerHTML = 'Calcular';
        calcularFreteBtn.disabled = false;
    }
}

// Função para simular cálculo de frete
function calcularFreteSimulado(uf) {
    const regiaoSudeste = ['SP', 'RJ', 'MG', 'ES'];
    const regiaoSul = ['PR', 'SC', 'RS'];
    const regiaoCentroOeste = ['DF', 'GO', 'MT', 'MS'];
    const regiaoNordeste = ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'];
    const regiaoNorte = ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'];

    let pac = {}, sedex = {}, expresso = {};

    if (regiaoSudeste.includes(uf)) {
        pac = { valor: 15.90, prazo: 3, nome: 'PAC' };
        sedex = { valor: 25.90, prazo: 1, nome: 'SEDEX' };
        expresso = { valor: 35.90, prazo: 1, nome: 'Expresso' };
    } else if (regiaoSul.includes(uf)) {
        pac = { valor: 18.90, prazo: 4, nome: 'PAC' };
        sedex = { valor: 28.90, prazo: 2, nome: 'SEDEX' };
        expresso = { valor: 38.90, prazo: 1, nome: 'Expresso' };
    } else if (regiaoCentroOeste.includes(uf)) {
        pac = { valor: 21.90, prazo: 5, nome: 'PAC' };
        sedex = { valor: 31.90, prazo: 3, nome: 'SEDEX' };
        expresso = { valor: 41.90, prazo: 2, nome: 'Expresso' };
    } else if (regiaoNordeste.includes(uf)) {
        pac = { valor: 24.90, prazo: 6, nome: 'PAC' };
        sedex = { valor: 34.90, prazo: 4, nome: 'SEDEX' };
        expresso = { valor: 44.90, prazo: 3, nome: 'Expresso' };
    } else if (regiaoNorte.includes(uf)) {
        pac = { valor: 27.90, prazo: 8, nome: 'PAC' };
        sedex = { valor: 37.90, prazo: 6, nome: 'SEDEX' };
        expresso = { valor: 47.90, prazo: 4, nome: 'Expresso' };
    }

    return [pac, sedex, expresso];
}

// Função para mostrar opções de frete
function mostrarOpcoesFrete(opcoes) {
    const freteOptions = document.getElementById('frete-options');
    const freteResult = document.getElementById('frete-result');
    
    freteOptions.innerHTML = '';
    freteOptions.style.padding = '0';
    freteOptions.style.margin = '10px 0 0 0';
    freteOptions.style.listStyle = 'none';

    opcoes.forEach(opcao => {
        if (opcao.valor) {
            const li = document.createElement('li');
            li.style.marginBottom = '10px';
            li.style.padding = '12px';
            li.style.backgroundColor = '#f5f5f5';
            li.style.borderRadius = '4px';
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '8px';
            container.style.width = '100%';

            const radioCustom = document.createElement('div');
            radioCustom.style.width = '16px';
            radioCustom.style.height = '16px';
            radioCustom.style.border = '2px solid #333';
            radioCustom.style.borderRadius = '50%';
            radioCustom.style.position = 'relative';
            radioCustom.style.flexShrink = '0';

            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'frete-option';
            radioInput.id = `frete-${opcao.nome.toLowerCase()}`;
            radioInput.value = opcao.valor;
            radioInput.style.position = 'absolute';
            radioInput.style.opacity = '0';
            radioInput.style.width = '16px';
            radioInput.style.height = '16px';
            radioInput.style.cursor = 'pointer';

            const label = document.createElement('label');
            label.htmlFor = `frete-${opcao.nome.toLowerCase()}`;
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '5px';
            label.style.cursor = 'pointer';
            label.style.flexGrow = '1';
            label.style.marginLeft = '8px';

            const serviceInfo = document.createElement('span');
            serviceInfo.textContent = `${opcao.nome} - R$ ${opcao.valor.toFixed(2)}`;
            serviceInfo.style.fontWeight = '500';

            const prazo = document.createElement('span');
            prazo.textContent = `(entrega em até ${opcao.prazo} dia${opcao.prazo > 1 ? 's' : ''})`;
            prazo.style.color = '#666';
            prazo.style.fontSize = '0.9em';

            label.appendChild(serviceInfo);
            label.appendChild(prazo);
            
            radioCustom.appendChild(radioInput);
            container.appendChild(radioCustom);
            container.appendChild(label);
            li.appendChild(container);
            freteOptions.appendChild(li);

            radioInput.addEventListener('change', function() {
                if (this.checked) {
                    radioCustom.style.borderColor = '#4CAF50';
                    radioCustom.style.backgroundColor = '#4CAF50';
                }
            });
        }
    });

    freteResult.style.display = 'block';
}

// Função para mostrar erro no cálculo de frete
function mostrarErroFrete(mensagem) {
    const freteOptions = document.getElementById('frete-options');
    const freteResult = document.getElementById('frete-result');
    
    freteOptions.innerHTML = `
        <li style="color: #e74c3c; font-size: 0.9em;">
            <i class="fas fa-exclamation-circle"></i> ${mensagem}
        </li>
    `;
    freteResult.style.display = 'block';
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    carregarProduto();

    // Configurar formatação do CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            this.value = value;
        });
    }

    // Configurar botão de calcular frete
    const calcularFreteBtn = document.getElementById('calcular-frete-btn');
    if (calcularFreteBtn) {
        calcularFreteBtn.addEventListener('click', async function() {
            const cep = cepInput.value.trim();

            if (!cep || cep.length < 9) {
                mostrarErroFrete('Por favor, digite um CEP válido');
                return;
            }

            const opcoesFrete = await buscarCEP(cep);
            if (opcoesFrete) {
                mostrarOpcoesFrete(opcoesFrete);
            }
        });

        // Permitir calcular frete pressionando Enter
        cepInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calcularFreteBtn.click();
            }
        });
    }
});