// =============================================
// QUEM PEGOU — TABELA DE EMPRÉSTIMOS ATIVOS
// Usa histórico local + livros da API
// =============================================

function mostrarQuemPegou() {
    const divEmprestados = document.getElementById('livrosEmprestados');
    if (!divEmprestados) return;

    const ativos = historico.filter(h => h.acao === 'pegou');

    if (ativos.length === 0) {
        divEmprestados.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">📭 Nenhum livro emprestado no momento</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Livro</th>
                    <th>Aluno</th>
                    <th>Matrícula</th>
                    <th>Turma</th>
                    <th>Empréstimo</th>
                    <th>Devolução</th>
                    <th>Prazo</th>
                </tr>
            </thead>
            <tbody>
    `;

    ativos.forEach(emp => {
        const dias = emp.dataDevolucao ? calcularDiasRestantes(emp.dataDevolucao) : null;
        let prazoTexto = '—', prazoColor = '#333';

        if (dias !== null) {
            if (dias < 0)       { prazoTexto = `⚠️ ${Math.abs(dias)}d atrasado`; prazoColor = '#ef4444'; }
            else if (dias === 0) { prazoTexto = '⚠️ Último dia!'; prazoColor = '#f59e0b'; }
            else if (dias <= 2)  { prazoTexto = `⏳ ${dias}d`; prazoColor = '#f59e0b'; }
            else                 { prazoTexto = `📅 ${dias}d`; prazoColor = '#10b981'; }
        }

        html += `
            <tr>
                <td><strong>${emp.livro}</strong></td>
                <td>${emp.usuario || '—'}</td>
                <td>${emp.matricula || '—'}</td>
                <td>${emp.turma || '—'}</td>
                <td>${emp.data || '—'}</td>
                <td>${emp.dataDevolucao || '—'}</td>
                <td style="color:${prazoColor};font-weight:600;">${prazoTexto}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    divEmprestados.innerHTML = html;
}

document.addEventListener('dadosCarregados', mostrarQuemPegou);
