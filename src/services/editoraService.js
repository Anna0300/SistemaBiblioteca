import {
    listarEditoras,
    criarEditora,
    deletarEditora
} from "../repositor/editoraRepository.js";

// 📄 LISTAR EDITORAS
export async function verEditorasService() {
    try {
        const editoras = await listarEditoras();
        return editoras;
    } catch (error) {
        throw new Error("Erro no serviço ao listar editoras: " + error.message);
    }
}

// ➕ CRIAR EDITORA
export async function adicionarEditoraService(nome) {
    try {
        // Validação: evita criar editoras sem nome ou apenas com espaços
        if (!nome || nome.trim() === "") {
            throw new Error("O nome da editora é obrigatório");
        }

        const novaEditora = await criarEditora(nome);
        return novaEditora;
    } catch (error) {
        throw new Error("Erro no serviço ao adicionar editora: " + error.message);
    }
}

// ❌ DELETAR EDITORA
export async function deletarEditoraService(id) {
    try {
        if (!id) {
            throw new Error("O ID da editora é obrigatório");
        }

        const resultado = await deletarEditora(id);
        return resultado;
    } catch (error) {
        throw new Error("Erro no serviço ao deletar editora: " + error.message);
    }
}