import db from "../database/connection.js";

// 📄 LISTAR
export async function listarLivros() {
    try {
        const [rows] = await db.query(`
            SELECT 
                livros.id_livro AS id,
                livros.titulo,
                livros.autor,
                livros.categoria,
                livros.ano_publicado,
                livros.quantidade_total,
                livros.quantidade_disponivel,
                livros.id_editora,
                editora.nome AS editora
            FROM livros
            LEFT JOIN editora ON livros.id_editora = editora.id_editora
        `);
        return rows;
    } catch (error) {
        throw new Error("Erro ao listar livros no banco de dados: " + error.message);
    }
}

// ➕ CRIAR
export async function criarLivro(titulo, autor, categoria, ano_publicado, qtd_total, qtd_disponivel, id_editora) {
    try {
        const [result] = await db.query(
            `INSERT INTO livros 
            (titulo, autor, categoria, ano_publicado, quantidade_total, quantidade_disponivel, id_editora) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [titulo, autor || null, categoria || null, ano_publicado || null,
             qtd_total || 1, qtd_disponivel ?? qtd_total ?? 1, id_editora || null]
        );
        return { id: result.insertId, titulo };
    } catch (error) {
        throw new Error("Erro ao inserir livro no banco: " + error.message);
    }
}

// 🔄 ATUALIZAR
export async function atualizarLivro(id, titulo, autor, categoria, ano_publicado, qtd_total, qtd_disponivel, id_editora) {
    try {
        const [result] = await db.query(
            `UPDATE livros SET 
                titulo = ?, 
                autor = ?,
                categoria = ?,
                ano_publicado = ?, 
                quantidade_total = ?, 
                quantidade_disponivel = ?, 
                id_editora = ? 
            WHERE id_livro = ?`,
            [titulo, autor || null, categoria || null, ano_publicado || null,
             qtd_total, qtd_disponivel, id_editora || null, id]
        );
        if (result.affectedRows === 0) throw new Error("Livro não encontrado para atualizar");
        return { mensagem: "Livro atualizado com sucesso" };
    } catch (error) {
        throw new Error("Erro ao atualizar livro no banco: " + error.message);
    }
}

// ❌ DELETAR
export async function deletarLivro(id) {
    try {
        const [result] = await db.query(`DELETE FROM livros WHERE id_livro = ?`, [id]);
        if (result.affectedRows === 0) throw new Error("Livro não encontrado para deletar");
        return { mensagem: "Livro deletado com sucesso" };
    } catch (error) {
        throw new Error("Erro ao deletar livro: " + error.message);
    }
}
