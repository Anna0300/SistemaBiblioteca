import {
    listarAutores,
    criarAutor,
    deletarAutor
} from "../repositor/autorRepository.js";

// 📄 LISTAR AUTORES
export async function verAutoresService() {
    try {
        const autores = await listarAutores();
        return autores;
    } catch (error) {
        // Repassamos a mensagem de erro vinda do repository ou criamos uma nova
        throw new Error(error.message || "Erro no serviço ao listar autores");
    }
}

// ➕ CRIAR AUTOR
export async function adicionarAutorService(nome) {
    try {
        // Regra de negócio: Nome não pode ser vazio ou apenas espaços
        if (!nome || nome.trim() === "") {
            throw new Error("O nome do autor é obrigatório");
        }

        const autor = await criarAutor(nome);
        return autor;
    } catch (error) {
        throw new Error(`Erro no serviço ao criar autor: ${error.message}`);
    }
}

// ❌ DELETAR AUTOR
export async function deletarAutorService(id) {
    try {
        if (!id) {
            throw new Error("ID do autor é obrigatório para a exclusão");
        }

        const resultado = await deletarAutor(id);
        return resultado;
    } catch (error) {
        throw new Error(`Erro no serviço ao deletar autor: ${error.message}`);
    }
}