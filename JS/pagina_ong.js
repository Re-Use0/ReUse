// Função para alternar entre as tabs
function showTab(tabName) {
    // Esconde todas as tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active-tab');
    });

    // Remove a classe active de todas as tabs
    document.querySelectorAll('.institution-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostra a tab selecionada
    document.getElementById(tabName + '-tab').classList.add('active-tab');

    // Adiciona a classe active à tab clicada
    event.currentTarget.classList.add('active');

    // Se for a tab de relatórios, atualiza o gráfico
    if (tabName === 'reports') {
        updateSummary();
    }
}

// Dados de exemplo para relatórios
const reportData = {
    monthly: {
        '2025-05': {
            donations: 24,
            items: 156,
            beneficiaries: 5,
            chartData: [10, 5, 8, 1], // Semanas do mês
            chartLabels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']
        },
        '2025-04': {
            donations: 18,
            items: 120,
            beneficiaries: 3,
            chartData: [6, 4, 5, 3],
            chartLabels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']
        }
    },
    quarterly: {
        '2025-Q2': {
            donations: 42,
            items: 276,
            beneficiaries: 8,
            chartData: [18, 24], // Meses do trimestre
            chartLabels: ['Abril', 'Maio']
        }
    },
    annual: {
        '2025': {
            donations: 150,
            items: 950,
            beneficiaries: 25,
            chartData: [30, 25, 35, 60], // Trimestres do ano
            chartLabels: ['1° Trim', '2° Trim', '3° Trim', '4° Trim']
        }
    }
};

// Variável para o gráfico
let donationsChart;

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    // Configura os listeners
    document.getElementById('report-type').addEventListener('change', updateFilterUI);
    document.getElementById('update-summary-btn').addEventListener('click', updateSummary);
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);

    // Configura a data atual como padrão
    const today = new Date();
    document.getElementById('report-month').value = today.toISOString().slice(0, 7);
    document.getElementById('start-date').valueAsDate = new Date(today.getFullYear(), today.getMonth(), 1);
    document.getElementById('end-date').valueAsDate = today;

    // Inicializa o gráfico
    initChart();
});

// Atualiza a UI dos filtros
function updateFilterUI() {
    const reportType = document.getElementById('report-type').value;
    const monthSelection = document.getElementById('month-selection');
    const customRange = document.getElementById('custom-range');

    if (reportType === 'custom') {
        monthSelection.style.display = 'none';
        customRange.style.display = 'flex';
    } else {
        monthSelection.style.display = 'block';
        customRange.style.display = 'none';
    }
}

// Atualiza o resumo com base nos filtros
function updateSummary() {
    const reportType = document.getElementById('report-type').value;
    let periodKey, periodTitle;

    // Determina o período selecionado
    if (reportType === 'custom') {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
            alert('Por favor, selecione um período válido');
            return;
        }

        periodKey = `custom-${startDate}-${endDate}`;
        periodTitle = `${formatDate(startDate)} até ${formatDate(endDate)}`;

        // Simula dados para período customizado
        const customData = {
            donations: 15,
            items: 90,
            beneficiaries: 4,
            chartData: [5, 10],
            chartLabels: ['Primeira metade', 'Segunda metade']
        };

        updateSummaryUI(customData, periodTitle);
    } else {
        if (reportType === 'monthly') {
            periodKey = document.getElementById('report-month').value;
            const [year, month] = periodKey.split('-');
            periodTitle = `${getMonthName(month)} ${year}`;
        } else if (reportType === 'quarterly') {
            const monthValue = document.getElementById('report-month').value;
            const quarter = Math.floor(parseInt(monthValue.split('-')[1]) / 3) + 1;
            periodKey = `${monthValue.split('-')[0]}-Q${quarter}`;
            periodTitle = `${periodKey} (Trimestre)`;
        } else { // annual
            periodKey = document.getElementById('report-month').value.split('-')[0];
            periodTitle = `Ano ${periodKey}`;
        }

        // Busca os dados correspondentes ou usa valores padrão
        const data = reportData[reportType]?.[periodKey] || {
            donations: 0,
            items: 0,
            beneficiaries: 0,
            chartData: [0, 0, 0, 0],
            chartLabels: ['Período 1', 'Período 2', 'Período 3', 'Período 4']
        };

        updateSummaryUI(data, periodTitle);
    }
}

// Atualiza a UI do resumo
function updateSummaryUI(data, periodTitle) {
    // Atualiza o título do período
    document.getElementById('period-title').textContent = periodTitle;

    // Atualiza as estatísticas
    document.getElementById('donations-count').textContent = data.donations;
    document.getElementById('items-count').textContent = data.items;
    document.getElementById('beneficiaries-count').textContent = data.beneficiaries;

    // Atualiza o gráfico
    updateChart(data.chartData, data.chartLabels);
}

// Inicializa o gráfico
function initChart() {
    const ctx = document.getElementById('donations-chart').getContext('2d');
    donationsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{
                label: 'Doações',
                data: [0, 0, 0, 0],
                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade de Doações'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Período'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.parsed.y} doações`;
                        }
                    }
                }
            }
        }
    });
}

// Atualiza o gráfico
function updateChart(data, labels) {
    donationsChart.data.datasets[0].data = data;
    donationsChart.data.labels = labels || donationsChart.data.labels;
    donationsChart.update();
}

// Gera o relatório em PDF
function generateReport() {
    // Verifica se jsPDF está disponível
    if (typeof jsPDF === 'undefined') {
        alert('Biblioteca jsPDF não carregada. Por favor, tente novamente.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Dados da ONG
    const ongData = {
        name: document.getElementById('institution-name').value,
        category: document.getElementById('institution-category').value,
        description: document.getElementById('institution-description').value,
        period: document.getElementById('period-title').textContent,
        donations: document.getElementById('donations-count').textContent,
        items: document.getElementById('items-count').textContent,
        beneficiaries: document.getElementById('beneficiaries-count').textContent
    };

    // Configurações do documento
    const title = `Relatório - ${ongData.name}`;
    const currentDate = new Date().toLocaleDateString('pt-BR');

    // Cabeçalho
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Período: ${ongData.period}`, 105, 27, { align: 'center' });
    doc.text(`Emitido em: ${currentDate}`, 105, 34, { align: 'center' });

    // Linha divisória
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Informações da ONG
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Informações da Instituição", 20, 50);

    doc.setFontSize(12);
    doc.text(`Nome: ${ongData.name}`, 20, 60);
    doc.text(`Categoria: ${ongData.category}`, 20, 70);

    // Descrição com quebra de linha
    const splitDescription = doc.splitTextToSize(ongData.description, 170);
    doc.text("Descrição:", 20, 80);
    doc.text(splitDescription, 20, 90);

    // Estatísticas
    doc.setFontSize(14);
    doc.text("Estatísticas do Período", 20, doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 120);

    doc.autoTable({
        startY: (doc.previousAutoTable ? doc.previousAutoTable.finalY : 120) + 10,
        head: [['Item', 'Quantidade']],
        body: [
            ['Doações Recebidas', ongData.donations],
            ['Itens Distribuídos', ongData.items],
            ['Beneficiários', ongData.beneficiaries]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [76, 175, 80]
        }
    });

    // Gráfico (imagem base64)
    const chartCanvas = document.getElementById('donations-chart');
    const chartImage = chartCanvas.toDataURL('image/png');

    doc.addImage(chartImage, 'PNG', 20, doc.autoTable.previous.finalY + 20, 170, 80);

    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Relatório gerado automaticamente pelo sistema ReUse", 105, 285, { align: 'center' });

    // Salva o PDF
    doc.save(`Relatorio_${ongData.name.replace(/\s+/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`);
}

// Funções auxiliares
function getMonthName(month) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[parseInt(month) - 1];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Configura o upload do logo
document.getElementById('logo-upload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            document.querySelector('.current-logo').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});