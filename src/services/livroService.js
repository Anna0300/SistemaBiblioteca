import {
    listarLivros,
    criarLivro,
    atualizarLivro,
    deletarLivro
} from "../repositor/livroRepository.js";

// 📄 LISTAR
export async function verLivrosService() {
    try {
        return await listarLivros();
    } catch (error) {
        throw new Error("Erro no serviço ao buscar livros: " + error.message);
    }
}

// ➕ CRIAR
export async function adicionarLivroService(titulo, autor, categoria, ano_publicado, quantidade_total, quantidade_disponivel, id_editora) {
    try {
        if (!titulo) throw new Error("Título é obrigatório");
        return await criarLivro(titulo, autor, categoria, ano_publicado, quantidade_total, quantidade_disponivel, id_editora);
    } catch (error) {
        throw new Error("Erro no serviço ao adicionar livro: " + error.message);
    }
}

// 🔄 ATUALIZAR
export async function atualizarLivroService(id, titulo, autor, categoria, ano_publicado, quantidade_total, quantidade_disponivel, id_editora) {
    try {
        if (!id) throw new Error("ID do livro é necessário para atualização");
        return await atualizarLivro(id, titulo, autor, categoria, ano_publicado, quantidade_total, quantidade_disponivel, id_editora);
    } catch (error) {
        throw new Error("Erro no serviço ao atualizar livro: " + error.message);
    }
}

// ❌ DELETAR
export async function deletarLivroService(id) {
    try {
        if (!id) throw new Error("ID do livro é necessário para exclusão");
        return await deletarLivro(id);
    } catch (error) {
        throw new Error("Erro no serviço ao deletar livro: " + error.message);
    }
}
