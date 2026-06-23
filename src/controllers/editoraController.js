import {
    verEditorasService,
    adicionarEditoraService,
    deletarEditoraService
} from "../services/editoraService.js";

// 📄 LISTAR (Nome alterado de verEditoras para listarEditoras)
export async function listarEditoras(req, res) {
    try {
        const editoras = await verEditorasService();
        res.status(200).json(editoras);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}

// ➕ CRIAR (Nome alterado de adicionarEditora para criarEditora)
export async function criarEditora(req, res) {
    try {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ erro: "O nome da editora é obrigatório" });
        }
        const resultado = await adicionarEditoraService(nome);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}

// ❌ DELETAR
export async function deletarEditora(req, res) {
    try {
        const { id } = req.params;
        const resultado = await deletarEditoraService(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}