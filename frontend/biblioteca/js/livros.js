// =============================================
// LISTAGEM DE LIVROS — USA DADOS DA API
// =============================================

function mostrarLivros() {
    const selectCategoria = document.getElementById('filtroCategoria');
    const divLivros = document.getElementById('livrosCadastrados');
    if (!divLivros) return;

    const categoria = selectCategoria ? selectCategoria.value : 'todos';

    let lista = livros;
    if (categoria !== 'todos') {
        lista = livros.filter(l => l.categoria === categoria);
    }

    if (lista.length === 0) {
        divLivros.innerHTML = '<p class="sem-resultados" style="text-align:center;color:#666;padding:20px;">📭 Nenhum livro nesta categoria</p>';
        return;
    }

    let html = '';
    lista.forEach(livro => {
        const disponivel = livro.quantidade_disponivel > 0;
        const statusClass = disponivel ? 'status-disponivel' : 'status-indisponivel';
        const statusTexto = disponivel ? '✅ Disponível' : '❌ Indisponível';

        // Verificar prazo pelo histórico local
        let prazoHTML = '';
        const emprestimo = historico.find(h => h.livroId === livro.id && h.acao === 'pegou');
        if (!disponivel && emprestimo?.dataDevolucao) {
            const dias = calcularDiasRestantes(emprestimo.dataDevolucao);
            if (dias !== null) {
                const cor = dias < 0 ? '#ef4444' : dias <= 2 ? '#f59e0b' : '#10b981';
                const texto = dias < 0
                    ? `⚠️ Atrasado ${Math.abs(dias)} dias`
                    : dias === 0 ? '⚠️ Último dia!'
                    : `📅 ${dias} dias restantes`;
                prazoHTML = `<p style="color:${cor};font-weight:600;font-size:0.85rem;">${texto}</p>`;
            }
        }

        html += `
            <div class="livro-card">
                <h3>📖 ${livro.titulo}</h3>
                ${livro.autor    ? `<p>✍️ <strong>${livro.autor}</strong></p>` : ''}
                ${livro.categoria ? `<p>📚 ${livro.categoria}</p>` : ''}
                ${livro.editora  ? `<p>🏢 ${livro.editora}</p>` : ''}
                <p>Total: <strong>${livro.quantidade_total}</strong> | Disponível: <strong>${livro.quantidade_disponivel}</strong></p>
                <p class="${statusClass}"><strong>${statusTexto}</strong></p>
                ${prazoHTML}
            </div>
        `;
    });

    divLivros.innerHTML = html;
}

// Atualizar quando dados da API chegarem
document.addEventListener('dadosCarregados', mostrarLivros);

document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('filtroCategoria');
    if (sel) sel.addEventListener('change', mostrarLivros);
});
