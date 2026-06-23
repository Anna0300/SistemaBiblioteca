// =============================================
// PEGAR LIVRO — CONECTADO AO BANCO
// Decrementa quantidade_disponivel via PUT /livros/:id
// =============================================

let livrosFiltradosPegar = [];

// Pesquisa em tempo real
function filtrarLivrosPegar() {
    const termo = document.getElementById('pesquisaLivroPegar').value.toLowerCase().trim();
    const disponiveis = livros.filter(l => l.quantidade_disponivel > 0);

    if (!termo) {
        livrosFiltradosPegar = [];
        document.getElementById('resultadosPesquisaLivros').innerHTML = '';
        return;
    }

    livrosFiltradosPegar = disponiveis.filter(l =>
        l.titulo.toLowerCase().includes(termo) ||
        (l.autor || '').toLowerCase().includes(termo) ||
        (l.categoria || '').toLowerCase().includes(termo)
    );

    exibirResultadosPesquisaLivros();
}

function exibirResultadosPesquisaLivros() {
    const container = document.getElementById('resultadosPesquisaLivros');

    if (livrosFiltradosPegar.length === 0) {
        container.innerHTML = '<div style="padding:10px;color:#666;text-align:center;">📭 Nenhum livro encontrado</div>';
        return;
    }

    let html = '<div style="border:1px solid #ddd;border-radius:8px;overflow:hidden;">';
    livrosFiltradosPegar.forEach(livro => {
        html += `
            <div class="item-livro-pesquisa" onclick="selecionarLivroPesquisa(${livro.id})"
                 style="padding:12px;border-bottom:1px solid #eee;cursor:pointer;transition:background 0.2s;">
                <strong>📖 ${livro.titulo}</strong><br>
                <small>
                    ${livro.autor ? `✍️ ${livro.autor}` : ''}
                    ${livro.categoria ? ` | 📚 ${livro.categoria}` : ''}
                    | ✅ ${livro.quantidade_disponivel} disponível(is)
                </small>
            </div>`;
    });
    html += '</div>';
    container.innerHTML = html;

    document.querySelectorAll('.item-livro-pesquisa').forEach(el => {
        el.addEventListener('mouseenter', () => el.style.background = '#f0f4ff');
        el.addEventListener('mouseleave', () => el.style.background = 'white');
    });
}

function selecionarLivroPesquisa(livroId) {
    document.getElementById('selectLivroPegar').value = livroId;
    document.getElementById('pesquisaLivroPegar').value = '';
    document.getElementById('resultadosPesquisaLivros').innerHTML = '';

    const livro = livros.find(l => l.id === livroId);
    if (livro) {
        const msg = document.getElementById('mensagemPegar');
        msg.className = 'mensagem success';
        msg.textContent = `✅ "${livro.titulo}" selecionado!`;
        setTimeout(() => { msg.textContent = ''; msg.className = 'mensagem'; }, 2000);
    }
}

// =============================================
// CONFIRMAR EMPRÉSTIMO
// =============================================
async function pegarLivroADM() {
    const livroId  = parseInt(document.getElementById('selectLivroPegar').value);
    const matricula = document.getElementById('matriculaAluno').value.trim();
    const nomeAluno = document.getElementById('nomeAluno').value.trim();
    const turma     = document.getElementById('turmaAluno').value;
    const mensagemDiv = document.getElementById('mensagemPegar');

    if (!livroId)   { mensagemDiv.className='mensagem error'; mensagemDiv.textContent='❌ Selecione um livro!'; return; }
    if (!matricula) { mensagemDiv.className='mensagem error'; mensagemDiv.textContent='❌ Digite a matrícula!'; return; }
    if (!nomeAluno) { mensagemDiv.className='mensagem error'; mensagemDiv.textContent='❌ Digite o nome do aluno!'; return; }
    if (!turma)     { mensagemDiv.className='mensagem error'; mensagemDiv.textContent='❌ Selecione a turma!'; return; }

    const livro = livros.find(l => l.id === livroId);
    if (!livro || livro.quantidade_disponivel <= 0) {
        mensagemDiv.className = 'mensagem error';
        mensagemDiv.textContent = '❌ Livro não disponível!';
        return;
    }

    // Limite de 3 livros por matrícula
    const jaTemLivros = historico.filter(h => h.matricula === matricula && h.acao === 'pegou').length;
    if (jaTemLivros >= 3) {
        mensagemDiv.className = 'mensagem error';
        mensagemDiv.textContent = '❌ Este aluno já tem 3 livros emprestados!';
        return;
    }

    mensagemDiv.className = 'mensagem'; mensagemDiv.textContent = '⏳ Registrando empréstimo...';

    try {
        // Atualizar quantidade_disponivel no banco via PUT
        const res = await fetch(`${API_URL}/livros/${livroId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: livro.titulo,
                autor: livro.autor,
                categoria: livro.categoria,
                ano_publicado: livro.ano_publicado,
                quantidade_total: livro.quantidade_total,
                quantidade_disponivel: livro.quantidade_disponivel - 1,
                id_editora: livro.id_editora
            })
        });

        if (!res.ok) throw new Error("Falha ao atualizar livro no banco");

        // Calcular datas
        const hoje = new Date();
        const devData = new Date(hoje);
        devData.setDate(hoje.getDate() + PRAZO_DEVOLUCAO);
        const dataEmprestimo = hoje.toLocaleDateString('pt-BR');
        const dataDevolucao  = devData.toLocaleDateString('pt-BR');

        // Salvar no histórico local
        historico.push({
            livroId,
            livro: livro.titulo,
            usuario: nomeAluno,
            matricula,
            turma,
            data: dataEmprestimo,
            dataDevolucao,
            acao: 'pegou'
        });
        salvarHistorico();

        // Recarregar livros do banco
        await carregarLivros();

        mensagemDiv.className = 'mensagem success';
        mensagemDiv.innerHTML = `
            <strong>✅ Empréstimo registrado com sucesso!</strong><br>
            📚 ${livro.titulo}<br>
            👤 ${nomeAluno} | 🆔 ${matricula} | 🏫 ${turma}<br>
            📅 Devolver até: <strong>${dataDevolucao}</strong>
        `;

        // Limpar formulário
        document.getElementById('selectLivroPegar').value = '';
        document.getElementById('matriculaAluno').value = '';
        document.getElementById('nomeAluno').value = '';
        document.getElementById('turmaAluno').value = '';

        atualizarSelectPegarLivro();
        if (typeof mostrarLivros === 'function') mostrarLivros();
        if (typeof mostrarQuemPegou === 'function') mostrarQuemPegou();

        setTimeout(() => { mensagemDiv.textContent = ''; mensagemDiv.className = 'mensagem'; }, 6000);

    } catch (err) {
        console.error(err);
        mensagemDiv.className = 'mensagem error';
        mensagemDiv.textContent = '❌ Erro ao registrar. Servidor está rodando?';
    }
}

// Atualizar select quando dados chegarem
document.addEventListener('dadosCarregados', atualizarSelectPegarLivro);
