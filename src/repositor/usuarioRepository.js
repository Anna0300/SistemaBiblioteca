import db from "../database/connection.js";

// 📄 LISTAR USUÁRIOS
export async function listarUsuarios() {
    try {
        const [rows] = await db.query("SELECT * FROM usuario");
        return rows;
    } catch (error) {
        throw new Error("Erro ao listar usuários no banco de dados");
    }
}

// ➕ CRIAR USUÁRIO
export async function criarUsuario(nome, matricula, email) {
    try {
        // A validação de campos obrigatórios geralmente fica no Controller, 
        // mas mantê-la aqui é uma camada extra de segurança.
        if (!nome || !matricula || !email) {
            throw new Error("Nome, matrícula e email são obrigatórios");
        }

        const [result] = await db.query(
            "INSERT INTO usuario (nome, matricula, email) VALUES (?, ?, ?)",
            [nome, matricula, email]
        );

        return {
            id: result.insertId,
            nome,
            matricula,
            email
        };
    } catch (error) {
        // Se a matrícula ou email forem únicos (UNIQUE) no banco, 
        // o erro será capturado aqui.
        throw new Error("Erro ao criar usuário: " + error.message);
    }
}

// ✏️ ATUALIZAR USUÁRIO
export async function atualizarUsuario(id, nome, matricula, email) {
    try {
        if (!id) throw new Error("ID é obrigatório para atualização");

        const [result] = await db.query(
            `UPDATE usuario 
             SET nome = ?, matricula = ?, email = ?
             WHERE id_usuario = ?`,
            [nome, matricula, email, id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Usuário não encontrado para atualizar");
        }

        return { mensagem: "Usuário atualizado com sucesso" };
    } catch (error) {
        throw new Error(error.message);
    }
}

// ❌ DELETAR USUÁRIO
export async function deletarUsuario(id) {
    try {
        if (!id) throw new Error("ID é obrigatório para exclusão");

        const [result] = await db.query(
            "DELETE FROM usuario WHERE id_usuario = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Usuário não encontrado para deletar");
        }

        return { mensagem: "Usuário deletado com sucesso" };
    } catch (error) {
        // Erro comum: tentar deletar um usuário que tem empréstimos ativos (Foreign Key)
        throw new Error("Erro ao deletar usuário: " + error.message);
    }
}