// =============================================
// CADASTRO DE LIVRO — CONECTADO AO BANCO
// Campos do banco: titulo, autor, categoria,
//   ano_publicado, quantidade_total,
//   quantidade_disponivel, id_editora
// =============================================

async function adicionarLivro() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || usuarioLogado.tipo !== 'administrador') {
        alert('Apenas administradores podem cadastrar livros!');
        return;
    }

    const titulo     = document.getElementById("novoLivro").value.trim();
    const autor      = document.getElementById("autorLivro").value.trim();
    const categoria  = document.getElementById("categoriaLivro").value;
    const quantidade = parseInt(document.getElementById("quantidadeLivro").value);
    const mensagemDiv = document.getElementById("mensagemCadastro");

    // Validações
    if (!titulo)    { mostrarMensagem(mensagemDiv, 'error', '❌ Digite o nome do livro!'); return; }
    if (!autor)     { mostrarMensagem(mensagemDiv, 'error', '❌ Digite o nome do autor!'); return; }
    if (!categoria) { mostrarMensagem(mensagemDiv, 'error', '❌ Selecione a categoria!'); return; }
    if (isNaN(quantidade) || quantidade < 1)  { mostrarMensagem(mensagemDiv, 'error', '❌ Quantidade inválida!'); return; }
    if (quantidade > 50) { mostrarMensagem(mensagemDiv, 'error', '❌ Máximo de 50 cópias!'); return; }

    mostrarMensagem(mensagemDiv, '', '⏳ Cadastrando...');

    try {
        const body = {
            titulo,
            autor,
            categoria,
            ano_publicado: new Date().getFullYear(),
            quantidade_total: quantidade,
            quantidade_disponivel: quantidade,
            id_editora: null   // sem editora por enquanto
        };

        const res = await fetch(`${API_URL}/livros`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const erro = await res.json();
            throw new Error(erro.erro || "Erro desconhecido");
        }

        // Recarregar lista da API
        await carregarLivros();

        // Limpar campos
        document.getElementById("novoLivro").value = "";
        document.getElementById("autorLivro").value = "";
        document.getElementById("categoriaLivro").value = "";
        document.getElementById("quantidadeLivro").value = "1";

        mostrarMensagem(mensagemDiv, 'success',
            quantidade === 1
                ? `✅ Livro "${titulo}" cadastrado com sucesso!`
                : `✅ "${titulo}" cadastrado com ${quantidade} cópias!`
        );

        setTimeout(() => mostrarMensagem(mensagemDiv, '', ''), 3000);

        if (typeof mostrarLivros === 'function') mostrarLivros();
        if (typeof atualizarSelectPegarLivro === 'function') atualizarSelectPegarLivro();

    } catch (err) {
        console.error(err);
        mostrarMensagem(mensagemDiv, 'error', `❌ Erro: ${err.message}`);
    }
}

// =============================================
// SELECT DE PEGAR LIVRO
// =============================================
function atualizarSelectPegarLivro() {
    const select = document.getElementById('selectLivroPegar');
    if (!select) return;

    const disponiveis = livros.filter(l => l.quantidade_disponivel > 0);

    let options = '<option value="">📖 Selecione um livro</option>';
    if (disponiveis.length === 0) {
        options += `<option disabled>${livros.length === 0 ? '📭 Nenhum livro cadastrado' : '📭 Todos os livros estão emprestados'}</option>`;
    } else {
        disponiveis.forEach(l => {
            const info = l.autor ? ` — ${l.autor}` : '';
            const cat  = l.categoria ? ` (${l.categoria})` : '';
            options += `<option value="${l.id}">${l.titulo}${info}${cat} · Disp: ${l.quantidade_disponivel}</option>`;
        });
    }
    select.innerHTML = options;
}

// =============================================
// UTILITÁRIO DE MENSAGEM
// =============================================
function mostrarMensagem(div, tipo, texto) {
    div.className = tipo ? `mensagem ${tipo}` : 'mensagem';
    div.textContent = texto;
}
