import {
    verLivrosService,
    adicionarLivroService,
    atualizarLivroService,
    deletarLivroService
} from "../services/livroService.js";

// 📄 LISTAR
export async function listarLivros(req, res) {
    try {
        const livros = await verLivrosService();
        res.status(200).json(livros);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar livros: " + error.message });
    }
}

// ➕ CRIAR
export async function criarLivro(req, res) {
    try {
        const { titulo, autor, categoria, ano_publicado, quantidade_total, quantidade_disponivel, id_editora } = req.body;

        if (!titulo) {
            return res.status(400).json({ erro: "Título é obrigatório" });
        }

        const resultado = await adicionarLivroService(
            titulo,
            autor,
            categoria,
            ano_publicado,
            quantidade_total,
            quantidade_disponivel,
            id_editora
        );
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao adicionar livro: " + error.message });
    }
}

// 🔄 ATUALIZAR
export async function atualizarLivro(req, res) {
    try {
        const { id } = req.params;
        const { titulo, autor, categoria, ano_publicado, quantidade_total, quantidade_disponivel, id_editora } = req.body;

        if (!id) {
            return res.status(400).json({ erro: "ID do livro é obrigatório" });
        }

        const resultado = await atualizarLivroService(
            id,
            titulo,
            autor,
            categoria,
            ano_publicado,
            quantidade_total,
            quantidade_disponivel,
            id_editora
        );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar livro: " + error.message });
    }
}

// ❌ DELETAR
export async function deletarLivro(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ erro: "ID do livro é obrigatório" });
        }
        const resultado = await deletarLivroService(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar livro: " + error.message });
    }
}
