import {
    verAutoresService,
    adicionarAutorService,
    deletarAutorService
} from "../services/autorService.js";

// 📄 LISTAR (Nome alterado para bater com o padrão de rotas comum)
export async function listarAutores(req, res) {
    try {
        const autores = await verAutoresService();
        res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}

// ➕ CRIAR (Nome alterado de adicionarAutor para criarAutor)
export async function criarAutor(req, res) {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ erro: "Nome é obrigatório" });
        }
        const resultado = await adicionarAutorService(nome);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}

// ❌ DELETAR
export async function deletarAutor(req, res) {
    try {
        const { id } = req.params;
        const resultado = await deletarAutorService(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}