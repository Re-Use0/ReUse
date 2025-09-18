// Dados de exemplo para demonstração
const dadosDoacoes = [
    { data: '2025-01-15', doador: 'Maria Silva', categoria: 'Roupas', item: 'Camisetas', quantidade: 20, status: 'Distribuída' },
    { data: '2025-01-18', doador: 'João Santos', categoria: 'Alimentos', item: 'Arroz', quantidade: 50, status: 'Distribuída' },
    { data: '2025-01-20', doador: 'Ana Costa', categoria: 'Higiene', item: 'Sabonetes', quantidade: 100, status: 'Processamento' },
    { data: '2025-01-22', doador: 'Pedro Alves', categoria: 'Roupas', item: 'Calças', quantidade: 15, status: 'Recebida' },
    { data: '2025-01-25', doador: 'Carla Mendes', categoria: 'Alimentos', item: 'Feijão', quantidade: 30, status: 'Distribuída' },
    { data: '2025-01-28', doador: 'Roberto Lima', categoria: 'Livros', item: 'Livros Infantis', quantidade: 45, status: 'Recebida' },
    { data: '2025-02-01', doador: 'Fernanda Oliveira', categoria: 'Brinquedos', item: 'Bonecas', quantidade: 12, status: 'Processamento' },
    { data: '2025-02-05', doador: 'Ricardo Souza', categoria: 'Alimentos', item: 'Macarrão', quantidade: 40, status: 'Distribuída' },
    { data: '2025-02-08', doador: 'Amanda Rocha', categoria: 'Roupas', item: 'Casacos', quantidade: 8, status: 'Distribuída' },
    { data: '2025-02-12', doador: 'Marcos Ferreira', categoria: 'Higiene', item: 'Pasta de Dente', quantidade: 60, status: 'Recebida' },
    { data: '2025-02-15', doador: 'Patrícia Nunes', categoria: 'Brinquedos', item: 'Carrinhos', quantidade: 18, status: 'Processamento' },
    { data: '2025-02-18', doador: 'José Carvalho', categoria: 'Alimentos', item: 'Óleo de Cozinha', quantidade: 25, status: 'Distribuída' },
    { data: '2025-02-22', doador: 'Tatiana Dias', categoria: 'Livros', item: 'Livros Didáticos', quantidade: 30, status: 'Recebida' },
    { data: '2025-02-25', doador: 'Luiz Gonçalves', categoria: 'Roupas', item: 'Bermudas', quantidade: 22, status: 'Distribuída' },
    { data: '2025-02-28', doador: 'Sandra Martins', categoria: 'Higiene', item: 'Escovas de Dente', quantidade: 45, status: 'Processamento' }
];

// Configurações de paginação
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...dadosDoacoes];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráficos
    inicializarGraficos();
    
    // Inicializar tabela
    renderizarTabela();
    
    // Inicializar resumo estatístico
    atualizarResumoEstatistico();
    
    // Configurar eventos
    configurarEventos();
});

// Inicializar gráficos
function inicializarGraficos() {
    // Gráfico de Doações por Mês
    const ctxDoacoes = document.getElementById('doacoesChart').getContext('2d');
    new Chart(ctxDoacoes, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Doações Recebidas',
                data: [12, 19, 8, 15, 10, 13],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Itens por Categoria
    const ctxCategorias = document.getElementById('categoriasChart').getContext('2d');
    new Chart(ctxCategorias, {
        type: 'pie',
        data: {
            labels: ['Roupas', 'Alimentos', 'Higiene', 'Brinquedos', 'Livros'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });

    // Gráfico de Distribuição por Beneficiários
    const ctxBeneficiarios = document.getElementById('beneficiariosChart').getContext('2d');
    new Chart(ctxBeneficiarios, {
        type: 'doughnut',
        data: {
            labels: ['Lar Infantil', 'Asilo São Francisco', 'Comunidade Carente', 'Abrigo de Animais'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });

    // Gráfico de Evolução de Distribuição
    const ctxDistribuicao = document.getElementById('distribuicaoChart').getContext('2d');
    new Chart(ctxDistribuicao, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Itens Distribuídos',
                data: [65, 59, 80, 81, 56, 72],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Renderizar tabela com paginação
function renderizarTabela() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    if (paginatedData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum dado encontrado</td></tr>';
        return;
    }
    
    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        
        // Formatar a data para exibição
        const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');
        
        // Determinar a classe CSS com base no status
        let statusClass = '';
        if (item.status === 'Recebida') statusClass = 'recebida';
        else if (item.status === 'Processamento') statusClass = 'processamento';
        else if (item.status === 'Distribuída') statusClass = 'distribuida';
        
        row.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${item.doador}</td>
            <td>${item.categoria}</td>
            <td>${item.item}</td>
            <td>${item.quantidade}</td>
            <td><span class="status-badge ${statusClass}">${item.status}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
    
    atualizarControlesPaginacao();
}

// Atualizar controles de paginação
function atualizarControlesPaginacao() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = document.getElementById('page-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    // Atualizar botões de navegação
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    
    // Atualizar números de página
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageElement = document.createElement('div');
        pageElement.className = `pagination-page ${i === currentPage ? 'active' : ''}`;
        pageElement.textContent = i;
        pageElement.addEventListener('click', () => {
            currentPage = i;
            renderizarTabela();
        });
        
        pageNumbers.appendChild(pageElement);
    }
}

// Atualizar resumo estatístico
function atualizarResumoEstatistico() {
    // Calcular totais
    const totalDoacoes = filteredData.length;
    const totalItens = filteredData.reduce((acc, item) => acc + item.quantidade, 0);
    
    // Calcular itens distribuídos (apenas os com status "Distribuída")
    const itensDistribuidos = filteredData
        .filter(item => item.status === 'Distribuída')
        .reduce((acc, item) => acc + item.quantidade, 0);
    
    // Calcular taxa de distribuição
    const taxaDistribuicao = totalItens > 0 ? Math.round((itensDistribuidos / totalItens) * 100) : 0;
    
    // Atualizar elementos na página
    document.getElementById('total-doacoes').textContent = totalDoacoes;
    document.getElementById('total-itens').textContent = totalItens;
    document.getElementById('itens-distribuidos').textContent = itensDistribuidos;
    document.getElementById('taxa-distribuicao').textContent = `${taxaDistribuicao}%`;
}

// Configurar eventos
function configurarEventos() {
    // Evento para o seletor de período
    document.getElementById('periodo').addEventListener('change', function() {
        const customDateGroup = document.querySelector('.custom-date');
        if (this.value === 'custom') {
            customDateGroup.style.display = 'flex';
        } else {
            customDateGroup.style.display = 'none';
        }
    });
    
    // Evento para o botão de gerar relatório
    document.getElementById('gerar-relatorio').addEventListener('click', function() {
        // Mostrar indicador de carregamento
        document.getElementById('loading-indicator').style.display = 'block';
        
        // Simular processamento
        setTimeout(() => {
            // Aplicar filtros (simulação)
            aplicarFiltros();
            
            // Atualizar visualizações
            renderizarTabela();
            atualizarResumoEstatistico();
            
            // Esconder indicador de carregamento
            document.getElementById('loading-indicator').style.display = 'none';
        }, 1000);
    });
    
    // Evento para o botão de exportar PDF
    document.getElementById('exportar-pdf').addEventListener('click', function() {
        exportarPDF();
    });
    
    // Evento para o botão de exportar Excel
    document.getElementById('exportar-excel').addEventListener('click', function() {
        exportarExcel();
    });
    
    // Eventos de paginação
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderizarTabela();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderizarTabela();
        }
    });
}

// Aplicar filtros aos dados
function aplicarFiltros() {
    const periodo = document.getElementById('periodo').value;
    const tipoRelatorio = document.getElementById('tipo-relatorio').value;
    
    // Filtrar por período (simulação)
    if (periodo === 'custom') {
        const dataInicio = new Date(document.getElementById('data-inicio').value);
        const dataFim = new Date(document.getElementById('data-fim').value);
        
        // Filtrar dados dentro do intervalo personalizado
        filteredData = dadosDoacoes.filter(item => {
            const dataItem = new Date(item.data);
            return dataItem >= dataInicio && dataItem <= dataFim;
        });
    } else {
        // Simular filtro por dias (apenas para demonstração)
        const dias = parseInt(periodo);
        filteredData = dadosDoacoes.slice(0, Math.min(dias, dadosDoacoes.length));
    }
    
    // Filtrar por tipo de relatório (simulação)
    if (tipoRelatorio === 'distribuicao') {
        filteredData = filteredData.filter(item => item.status === 'Distribuída');
    } else if (tipoRelatorio === 'categorias') {
        // Agrupar por categoria (simulação)
        // Na implementação real, isso seria mais complexo
        filteredData = filteredData.slice(0, 8);
    }
    
    // Resetar para a primeira página após filtrar
    currentPage = 1;
}

// Função para exportar para PDF
function exportarPDF() {
    // Mostrar indicador de carregamento
    document.getElementById('loading-indicator').style.display = 'block';
    
    setTimeout(() => {
        // Usar jsPDF com autoTable para gerar o PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Adicionar título
        doc.setFontSize(18);
        doc.text('Relatório de Doações - SOS Felino', 14, 15);
        
        // Adicionar data de geração
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);
        
        // Adicionar resumo estatístico
        doc.setFontSize(12);
        doc.text('Resumo Estatístico', 14, 32);
        
        doc.setFontSize(10);
        doc.text(`Total de Doações: ${document.getElementById('total-doacoes').textContent}`, 14, 40);
        doc.text(`Itens Recebidos: ${document.getElementById('total-itens').textContent}`, 14, 46);
        doc.text(`Itens Distribuídos: ${document.getElementById('itens-distribuidos').textContent}`, 14, 52);
        doc.text(`Taxa de Distribuição: ${document.getElementById('taxa-distribuicao').textContent}`, 14, 58);
        
        // Preparar dados para a tabela
        const tableData = filteredData.map(item => [
            new Date(item.data).toLocaleDateString('pt-BR'),
            item.doador,
            item.categoria,
            item.item,
            item.quantidade.toString(),
            item.status
        ]);
        
        // Adicionar tabela
        doc.autoTable({
            startY: 65,
            head: [['Data', 'Doador', 'Categoria', 'Item', 'Quantidade', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [54, 162, 235],
                textColor: 255
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            }
        });
        
        // Adicionar número de páginas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }
        
        // Salvar o PDF
        doc.save('relatorio_doacoes.pdf');
        
        // Esconder indicador de carregamento
        document.getElementById('loading-indicator').style.display = 'none';
    }, 500);
}

// Função para exportar para Excel
function exportarExcel() {
    // Mostrar indicador de carregamento
    document.getElementById('loading-indicator').style.display = 'block';
    
    setTimeout(() => {
        // Criar uma nova pasta de trabalho
        const wb = XLSX.utils.book_new();
        
        // Preparar dados para a planilha
        const wsData = [
            ['Relatório de Doações - SOS Felino'],
            [`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`],
            [],
            ['Resumo Estatístico'],
            [`Total de Doações: ${document.getElementById('total-doacoes').textContent}`],
            [`Itens Recebidos: ${document.getElementById('total-itens').textContent}`],
            [`Itens Distribuídos: ${document.getElementById('itens-distribuidos').textContent}`],
            [`Taxa de Distribuição: ${document.getElementById('taxa-distribuicao').textContent}`],
            [],
            ['Detalhes das Doações'],
            ['Data', 'Doador', 'Categoria', 'Item', 'Quantidade', 'Status']
        ];
        
        // Adicionar dados das doações
        filteredData.forEach(item => {
            wsData.push([
                new Date(item.data).toLocaleDateString('pt-BR'),
                item.doador,
                item.categoria,
                item.item,
                item.quantidade,
                item.status
            ]);
        });
        
        // Criar a planilha
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Adicionar a planilha à pasta de trabalho
        XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Doações');
        
        // Gerar o arquivo Excel e fazer o download
        XLSX.writeFile(wb, 'relatorio_doacoes.xlsx');
        
        // Esconder indicador de carregamento
        document.getElementById('loading-indicator').style.display = 'none';
    }, 500);
}