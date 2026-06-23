import * as usuarioService from "../services/usuarioService.js";

// 📄 LISTAR
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.verUsuariosService();
        res.status(200).json(usuarios);
    } catch (error) {
        // Mostramos o erro real no console para o desenvolvedor, mas uma mensagem amigável para o cliente
        console.error(error);
        res.status(500).json({ erro: "Erro ao buscar usuários: " + error.message });
    }
};

// ➕ CRIAR
export const criarUsuario = async (req, res) => {
    try {
        const { nome, matricula, email } = req.body;

        if (!nome || !matricula || !email) {
            return res.status(400).json({
                erro: "Nome, matrícula e email são obrigatórios"
            });
        }

        const id = await usuarioService.criarUsuarioService(
            nome,
            matricula,
            email
        );

        res.status(201).json({
            mensagem: "Usuário criado com sucesso",
            id: id
        });

    } catch (error) {
        res.status(500).json({
            erro: "Erro ao criar usuário: " + error.message
        });
    }
};

// ✏️ ATUALIZAR
export const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, matricula, email } = req.body;

        if (!id) {
            return res.status(400).json({ erro: "ID é obrigatório" });
        }

        await usuarioService.atualizarUsuarioService(
            id,
            nome,
            matricula,
            email
        );

        res.status(200).json({
            mensagem: "Usuário atualizado com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            erro: "Erro ao atualizar usuário: " + error.message
        });
    }
};

// ❌ DELETAR
export const deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ erro: "ID é obrigatório" });
        }

        await usuarioService.deletarUsuarioService(id);

        res.status(200).json({
            mensagem: "Usuário deletado com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            erro: "Erro ao deletar usuário: " + error.message
        });
    }
};