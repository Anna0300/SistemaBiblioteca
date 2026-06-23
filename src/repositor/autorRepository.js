import db from "../database/connection.js";

// 📄 LISTAR (Nome padronizado)
export async function listarAutores() {
    try {
        const [rows] = await db.query("SELECT * FROM Autor");
        return rows;
    } catch (error) {
        throw new Error("Erro ao listar autores no banco de dados");
    }
}

// ➕ CRIAR (Nome padronizado)
export async function criarAutor(nome) {
    try {
        const [result] = await db.query(
            "INSERT INTO Autor (nome) VALUES (?)",
            [nome]
        );

        return {
            id: result.insertId,
            nome
        };
    } catch (error) {
        throw new Error("Erro ao inserir autor no banco de dados");
    }
}

// ❌ DELETAR (Nome padronizado)
export async function deletarAutor(id) {
    try {
        // Verifique se o nome da coluna é id_autor ou apenas id no seu banco
        const [result] = await db.query(
            "DELETE FROM Autor WHERE id_autor = ?", 
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Autor não encontrado para deletar");
        }

        return { mensagem: "Autor deletado com sucesso" };
    } catch (error) {
        // Aqui passamos a mensagem real do erro (ex: erro de chave estrangeira)
        throw new Error(error.message);
    }
}