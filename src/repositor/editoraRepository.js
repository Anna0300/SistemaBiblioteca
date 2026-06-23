import db from "../database/connection.js";

// 📄 LISTAR
export async function listarEditoras() {
    try {
        const [rows] = await db.query("SELECT * FROM Editora");
        return rows;
    } catch (error) {
        throw new Error("Erro ao listar editoras no banco de dados");
    }
}

// ➕ CRIAR
export async function criarEditora(nome) {
    try {
        const [result] = await db.query(
            "INSERT INTO Editora (nome) VALUES (?)", 
            [nome]
        );
        return { id: result.insertId, nome };
    } catch (error) {
        throw new Error("Erro ao criar editora no banco de dados");
    }
}

// ❌ DELETAR
export async function deletarEditora(id) {
    try {
        // Certifique-se de que o nome da coluna no seu MySQL é 'id_editora'
        const [result] = await db.query(
            "DELETE FROM Editora WHERE id_editora = ?", 
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Editora não encontrada para deletar");
        }

        return { mensagem: "Editora deletada com sucesso" };
    } catch (error) {
        // Caso haja livros ligados a essa editora, o MySQL proibirá a exclusão
        // e este erro será capturado aqui.
        throw new Error("Não é possível deletar: " + error.message);
    }
}