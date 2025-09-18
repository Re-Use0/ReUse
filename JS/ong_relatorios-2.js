       // Dados de exemplo para as doações (baseado em ONG_Doacoes-2.html)
        const donationsData = [
            {
                id: 1,
                donor: "Maria Silva",
                date: "15/03/2025",
                items: [
                    { name: "Ração para gatos", quantity: 2, category: "food" },
                    { name: "Brinquedos para pets", quantity: 5, category: "toys" }
                ],
                status: "received",
                notes: "Doação em perfeito estado. Agradecemos muito!"
            },
            {
                id: 2,
                donor: "João Santos",
                date: "12/03/2025",
                items: [
                    { name: "Cobertores", quantity: 3, category: "blankets" },
                    { name: "Produtos de higiene", quantity: 2, category: "hygiene" }
                ],
                status: "pending",
                notes: "Precisa buscar até sexta-feira."
            },
            {
                id: 3,
                donor: "Ana Costa",
                date: "10/03/2025",
                items: [
                    { name: "Roupas para pets", quantity: 4, category: "clothing" },
                    { name: "Ração para cães", quantity: 1, category: "food" }
                ],
                status: "scheduled",
                notes: "Agendado para retirada no dia 18/03."
            },
            {
                id: 4,
                donor: "Pedro Almeida",
                date: "08/03/2025",
                items: [
                    { name: "Brinquedos para pets", quantity: 3, category: "toys" },
                    { name: "Produtos de higiene", quantity: 2, category: "hygiene" }
                ],
                status: "received",
                notes: "Muito obrigado pela contribuição!"
            },
            {
                id: 5,
                donor: "Carla Mendes",
                date: "05/03/2025",
                items: [
                    { name: "Ração para gatos", quantity: 3, category: "food" },
                    { name: "Cobertores", quantity: 2, category: "blankets" }
                ],
                status: "received",
                notes: "Doação em ótimo estado."
            },
            {
                id: 6,
                donor: "Roberto Lima",
                date: "02/03/2025",
                items: [
                    { name: "Roupas para pets", quantity: 5, category: "clothing" },
                    { name: "Brinquedos para pets", quantity: 2, category: "toys" }
                ],
                status: "pending",
                notes: "Aguardando confirmação de retirada."
            }
        ];

        // Inicialização quando a página carrega
        document.addEventListener('DOMContentLoaded', function() {
            // Configurar evento para mostrar/ocultar datas personalizadas
            document.getElementById('periodo').addEventListener('change', function() {
                const customDateContainer = document.querySelector('.custom-date');
                customDateContainer.style.display = this.value === 'custom' ? 'block' : 'none';
            });
            
            // Configurar botão de gerar relatório
            document.getElementById('gerar-relatorio').addEventListener('click', generateReport);
            
            // Configurar botão de exportar PDF
            document.getElementById('exportar-pdf').addEventListener('click', exportToPDF);
            
            // Configurar botão de exportar Excel
            document.getElementById('exportar-excel').addEventListener('click', exportToExcel);
            
            // Gerar relatório inicial
            generateReport();
        });

        // Gerar relatório
        function generateReport() {
            // Mostrar indicador de carregamento
            document.getElementById('loading-indicator').style.display = 'flex';
            
            // Simular tempo de processamento
            setTimeout(() => {
                // Obter filtros selecionados
                const periodo = document.getElementById('periodo').value;
                const tipoRelatorio = document.getElementById('tipo-relatorio').value;
                
                // Filtrar dados conforme período selecionado
                let dadosFiltrados = [...donationsData];
                
                // Atualizar tabela
                updateTable(dadosFiltrados);
                
                // Atualizar gráficos
                updateCharts(dadosFiltrados, tipoRelatorio);
                
                // Atualizar resumo estatístico
                updateSummary(dadosFiltrados);
                
                // Esconder indicador de carregamento
                document.getElementById('loading-indicator').style.display = 'none';
            }, 1000);
        }

        // Atualizar tabela com dados
        function updateTable(dados) {
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '';
            
            dados.forEach(doacao => {
                doacao.items.forEach(item => {
                    const row = document.createElement('tr');
                    
                    // Determinar texto de status
                    let statusText = '';
                    switch(doacao.status) {
                        case 'received':
                            statusText = 'Recebida';
                            break;
                        case 'pending':
                            statusText = 'Pendente';
                            break;
                        case 'scheduled':
                            statusText = 'Agendada';
                            break;
                    }
                    
                    row.innerHTML = `
                        <td>${doacao.date}</td>
                        <td>${doacao.donor}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${statusText}</td>
                    `;
                    
                    tableBody.appendChild(row);
                });
            });
            
            // Configurar paginação (simplificada)
            setupPagination();
        }

        // Obter nome da categoria
        function getCategoryName(category) {
            const categories = {
                'clothing': 'Roupas',
                'blankets': 'Cobertores',
                'toys': 'Brinquedos',
                'hygiene': 'Produtos de Higiene',
                'food': 'Ração'
            };
            
            return categories[category] || category;
        }

        // Configurar paginação (simplificada)
        function setupPagination() {
            // Implementação básica de paginação
            // Em uma implementação real, isso seria mais complexo
            document.getElementById('prev-page').disabled = true;
            document.getElementById('next-page').disabled = true;
            document.getElementById('page-numbers').innerHTML = '1';
        }

        // Atualizar gráficos
        function updateCharts(dados, tipoRelatorio) {
            // Dados para os gráficos (exemplo)
            const doacoesPorMes = [12, 19, 15, 22, 18, 24];
            const itensPorCategoria = [25, 15, 20, 30, 10]; // Roupas, Cobertores, Brinquedos, Higiene, Ração
            const distribuicaoPorBeneficiario = [40, 30, 20, 10]; // Exemplo de distribuição
            const evolucaoDistribuicao = [5, 10, 8, 15, 12, 20]; // Evolução ao longo do tempo
            
            // Atualizar gráfico de doações por mês
            updateChart('doacoesChart', 'bar', ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], doacoesPorMes, 'Doações Recebidas');
            
            // Atualizar gráfico de itens por categoria
            updateChart('categoriasChart', 'pie', ['Roupas', 'Cobertores', 'Brinquedos', 'Higiene', 'Ração'], itensPorCategoria, 'Itens por Categoria');
            
            // Atualizar gráfico de distribuição por beneficiários
            updateChart('beneficiariosChart', 'doughnut', ['Família Silva', 'Família Oliveira', 'Família Santos', 'Família Costa'], distribuicaoPorBeneficiario, 'Distribuição por Beneficiários');
            
            // Atualizar gráfico de evolução de distribuição
            updateChart('distribuicaoChart', 'line', ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'], evolucaoDistribuicao, 'Itens Distribuídos');
        }

        // Atualizar um gráfico específico
        function updateChart(canvasId, type, labels, data, label) {
            const ctx = document.getElementById(canvasId).getContext('2d');
            
            // Destruir gráfico existente se houver
            if (window[canvasId + 'ChartInstance']) {
                window[canvasId + 'ChartInstance'].destroy();
            }
            
            // Criar novo gráfico
            window[canvasId + 'ChartInstance'] = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: label
                        }
                    }
                }
            });
        }

        // Atualizar resumo estatístico
        function updateSummary(dados) {
            // Calcular totais
            let totalDoacoes = dados.length;
            let totalItens = 0;
            let itensDistribuidos = 0;
            
            dados.forEach(doacao => {
                doacao.items.forEach(item => {
                    totalItens += item.quantity;
                    if (doacao.status === 'received') {
                        itensDistribuidos += item.quantity;
                    }
                });
            });
            
            // Calcular taxa de distribuição
            let taxaDistribuicao = totalItens > 0 ? (itensDistribuidos / totalItens * 100).toFixed(2) : 0;
            
            // Atualizar elementos HTML
            document.getElementById('total-doacoes').textContent = totalDoacoes;
            document.getElementById('total-itens').textContent = totalItens;
            document.getElementById('itens-distribuidos').textContent = itensDistribuidos;
            document.getElementById('taxa-distribuicao').textContent = `${taxaDistribuicao}%`;
        }

        // Exportar para PDF
        function exportToPDF() {
            // Mostrar indicador de carregamento
            document.getElementById('loading-indicator').style.display = 'flex';
            
            setTimeout(() => {
                // Usar jsPDF para gerar o PDF
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Adicionar título
                doc.setFontSize(20);
                doc.text('Relatório de Doações - Patas Conscientes', 14, 22);
                
                // Adicionar data de geração
                doc.setFontSize(12);
                doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
                
                // Adicionar filtros aplicados
                const periodo = document.getElementById('periodo');
                const tipoRelatorio = document.getElementById('tipo-relatorio');
                
                doc.text(`Período: ${periodo.options[periodo.selectedIndex].text}`, 14, 40);
                doc.text(`Tipo de Relatório: ${tipoRelatorio.options[tipoRelatorio.selectedIndex].text}`, 14, 48);
                
                // Adicionar resumo estatístico
                doc.setFontSize(16);
                doc.text('Resumo Estatístico', 14, 60);
                
                doc.setFontSize(12);
                doc.text(`Total de Doações: ${document.getElementById('total-doacoes').textContent}`, 14, 70);
                doc.text(`Itens Recebidos: ${document.getElementById('total-itens').textContent}`, 14, 78);
                doc.text(`Itens Distribuídos: ${document.getElementById('itens-distribuidos').textContent}`, 14, 86);
                doc.text(`Taxa de Distribuição: ${document.getElementById('taxa-distribuicao').textContent}`, 14, 94);
                
                // Adicionar tabela de dados
                doc.setFontSize(16);
                doc.text('Detalhamento de Doações', 14, 110);
                
                // Preparar dados da tabela para o PDF
                const tableData = [];
                const tableHeaders = ['Data', 'Doador', 'Categoria', 'Item', 'Quantidade', 'Status'];
                
                document.querySelectorAll('#detalhamento-table tbody tr').forEach(row => {
                    const rowData = [];
                    row.querySelectorAll('td').forEach(cell => {
                        rowData.push(cell.textContent);
                    });
                    tableData.push(rowData);
                });
                
                // Adicionar tabela ao PDF
                doc.autoTable({
                    head: [tableHeaders],
                    body: tableData,
                    startY: 115,
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [66, 139, 202] }
                });
                
                // Adicionar gráficos (simulação - em produção real, converteríamos os canvas para imagens)
                doc.setFontSize(16);
                doc.text('Gráficos', 14, doc.lastAutoTable.finalY + 15);
                doc.setFontSize(12);
                doc.text('Os gráficos estão disponíveis apenas na versão web do relatório.', 14, doc.lastAutoTable.finalY + 25);
                
                // Salvar o PDF
                doc.save('relatorio_doacoes.pdf');
                
                // Esconder indicador de carregamento
                document.getElementById('loading-indicator').style.display = 'none';
            }, 500);
        }

        // Exportar para Excel
        function exportToExcel() {
            // Mostrar indicador de carregamento
            document.getElementById('loading-indicator').style.display = 'flex';
            
            setTimeout(() => {
                // Preparar dados para a planilha
                const data = [];
                
                // Adicionar cabeçalhos
                data.push(['Relatório de Doações - Patas Conscientes']);
                data.push([]);
                data.push(['Gerado em:', new Date().toLocaleDateString('pt-BR')]);
                
                const periodo = document.getElementById('periodo');
                const tipoRelatorio = document.getElementById('tipo-relatorio');
                data.push(['Período:', periodo.options[periodo.selectedIndex].text]);
                data.push(['Tipo de Relatório:', tipoRelatorio.options[tipoRelatorio.selectedIndex].text]);
                data.push([]);
                
                // Adicionar resumo estatístico
                data.push(['Resumo Estatístico']);
                data.push(['Total de Doações:', document.getElementById('total-doacoes').textContent]);
                data.push(['Itens Recebidos:', document.getElementById('total-itens').textContent]);
                data.push(['Itens Distribuídos:', document.getElementById('itens-distribuidos').textContent]);
                data.push(['Taxa de Distribuição:', document.getElementById('taxa-distribuicao').textContent]);
                data.push([]);
                
                // Adicionar cabeçalhos da tabela
                data.push(['Data', 'Doador', 'Categoria', 'Item', 'Quantidade', 'Status']);
                
                // Adicionar dados da tabela
                document.querySelectorAll('#detalhamento-table tbody tr').forEach(row => {
                    const rowData = [];
                    row.querySelectorAll('td').forEach(cell => {
                        rowData.push(cell.textContent);
                    });
                    data.push(rowData);
                });
                
                // Criar planilha
                const ws = XLSX.utils.aoa_to_sheet(data);
                
                // Ajustar largura das colunas
                const colWidths = [
                    { wch: 15 }, // Data
                    { wch: 20 }, // Doador
                    { wch: 15 }, // Categoria
                    { wch: 25 }, // Item
                    { wch: 12 }, // Quantidade
                    { wch: 15 }  // Status
                ];
                ws['!cols'] = colWidths;
                
                // Criar livro de trabalho e adicionar a planilha
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Doações');
                
                // Salvar o arquivo
                XLSX.writeFile(wb, 'relatorio_doacoes.xlsx');
                
                // Esconder indicador de carregamento
                document.getElementById('loading-indicator').style.display = 'none';
            }, 500);
        }