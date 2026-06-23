import { 
    listarUsuarios, 
    criarUsuario, 
    atualizarUsuario, 
    deletarUsuario 
} from "../repositor/usuarioRepository.js";

// 📄 LISTAR USUÁRIOS
export async function verUsuariosService() {
    try {
        const usuarios = await listarUsuarios();
        return usuarios;
    } catch (error) {
        throw new Error(error.message || "Erro no serviço ao listar usuários");
    }
}

// ➕ CRIAR USUÁRIO
export async function criarUsuarioService(nome, matricula, email) {
    try {
        if (!nome || !matricula || !email) {
            throw new Error("Nome, matrícula e email são obrigatórios");
        }

        // Remove espaços extras acidentais
        const nomeLimpo = nome.trim();
        const emailLimpo = email.trim();

        const usuario = await criarUsuario(nomeLimpo, matricula, emailLimpo);
        return usuario;
    } catch (error) {
        throw new Error(`Erro no serviço ao criar usuário: ${error.message}`);
    }
}

// ✏️ ATUALIZAR USUÁRIO
export async function atualizarUsuarioService(id, nome, matricula, email) {
    try {
        if (!id) throw new Error("ID obrigatório para atualização");
        
        if (!nome || !matricula || !email) {
            throw new Error("Campos nome, matrícula e email não podem ser vazios");
        }

        const resultado = await atualizarUsuario(id, nome.trim(), matricula, email.trim());
        return resultado;
    } catch (error) {
        throw new Error(`Erro no serviço ao atualizar usuário: ${error.message}`);
    }
}

// ❌ DELETAR USUÁRIO
export async function deletarUsuarioService(id) {
    try {
        if (!id) throw new Error("ID obrigatório para exclusão");

        const resultado = await deletarUsuario(id);
        return resultado; // O repository já costuma retornar { mensagem: "..." }
    } catch (error) {
        throw new Error(`Erro no serviço ao deletar usuário: ${error.message}`);
    }
}