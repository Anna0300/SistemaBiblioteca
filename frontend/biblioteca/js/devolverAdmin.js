// =============================================
// DEVOLVER LIVRO (ADMIN) — CONECTADO AO BANCO
// Incrementa quantidade_disponivel via PUT /livros/:id
// =============================================

function pesquisarEmprestimos() {
    const aluno     = document.getElementById('pesquisaAluno').value.trim().toLowerCase();
    const livroNome = document.getElementById('pesquisaLivro').value.trim().toLowerCase();
    const resultadosDiv = document.getElementById('resultadosPesquisa');

    // Filtrar empréstimos ativos do histórico local
    const ativos = historico.filter(h => h.acao === 'pegou');
    const encontrados = ativos.filter(h => {
        const matchAluno = !aluno || (h.usuario || '').toLowerCase().includes(aluno);
        const matchLivro = !livroNome || (h.livro || '').toLowerCase().includes(livroNome);
        return matchAluno && matchLivro;
    });

    if (encontrados.length === 0) {
        resultadosDiv.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">📭 Nenhum empréstimo ativo encontrado</p>';
        return;
    }

    let html = '';
    encontrados.forEach((emp, idx) => {
        const dias = emp.dataDevolucao ? calcularDiasRestantes(emp.dataDevolucao) : null;
        let prazo = emp.dataDevolucao || '—';
        let corPrazo = '#333';
        if (dias !== null) {
            if (dias < 0) { prazo += ` ⚠️ ATRASADO ${Math.abs(dias)}d`; corPrazo = '#ef4444'; }
            else if (dias === 0) { prazo += ' ⚠️ Último dia!'; corPrazo = '#f59e0b'; }
            else if (dias <= 2) { corPrazo = '#f59e0b'; }
        }

        html += `
            <div style="padding:15px;border-bottom:1px solid #e2e8f0;background:white;border-radius:8px;margin-bottom:8px;">
                <p><strong>📖 ${emp.livro}</strong></p>
                <p>👤 ${emp.usuario} | 🆔 ${emp.matricula} | 🏫 ${emp.turma || '—'}</p>
                <p>📅 Empréstimo: ${emp.data}</p>
                <p style="color:${corPrazo};">⏰ Devolver até: <strong>${prazo}</strong></p>
                <button onclick="devolverLivro(${idx})" class="btn-secondary" style="margin-top:10px;">
                    ✅ Confirmar Devolução
                </button>
            </div>`;
    });

    resultadosDiv.innerHTML = html;
    window._emprestimosAtivos = encontrados;
}

async function devolverLivro(idx) {
    const emp = window._emprestimosAtivos?.[idx];
    if (!emp) { alert('❌ Empréstimo não encontrado!'); return; }

    const livro = livros.find(l => l.id === emp.livroId);
    if (!livro) { alert('❌ Livro não encontrado no sistema!'); return; }

    try {
        // Incrementar quantidade_disponivel no banco
        const res = await fetch(`${API_URL}/livros/${livro.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: livro.titulo,
                autor: livro.autor,
                categoria: livro.categoria,
                ano_publicado: livro.ano_publicado,
                quantidade_total: livro.quantidade_total,
                quantidade_disponivel: livro.quantidade_disponivel + 1,
                id_editora: livro.id_editora
            })
        });

        if (!res.ok) throw new Error("Falha ao atualizar livro");

        // Marcar no histórico como devolvido
        const idxHist = historico.indexOf(emp);
        if (idxHist !== -1) {
            historico[idxHist].acao = 'devolveu';
            historico[idxHist].dataDevolvido = new Date().toLocaleDateString('pt-BR');
        }
        salvarHistorico();

        await carregarLivros();

        alert(`✅ "${emp.livro}" devolvido com sucesso!`);

        if (typeof mostrarQuemPegou === 'function') mostrarQuemPegou();
        if (typeof mostrarLivros === 'function') mostrarLivros();
        if (typeof atualizarSelectPegarLivro === 'function') atualizarSelectPegarLivro();
        pesquisarEmprestimos();

    } catch (err) {
        console.error(err);
        alert('❌ Erro ao devolver. Servidor está rodando?');
    }
}

function limparPesquisa() {
    document.getElementById('pesquisaAluno').value = '';
    document.getElementById('pesquisaLivro').value = '';
    document.getElementById('resultadosPesquisa').innerHTML =
        '<p>🔍 Faça uma pesquisa para ver os livros emprestados</p>';
}
