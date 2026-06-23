import express from "express";

//  USUÁRIOS
import {
    listarUsuarios,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
} from "./controllers/usuarioController.js";

//  LIVROS
import {
    listarLivros,  
    criarLivro,   
    atualizarLivro,
    deletarLivro
} from "./controllers/livroController.js";

//  AUTORES
import {
    listarAutores,
    criarAutor,
    deletarAutor
} from "./controllers/autorController.js";

//  EDITORAS
import {
    listarEditoras,
    criarEditora,
    deletarEditora
} from "./controllers/editoraController.js";

const router = express.Router();

// ===== ROTAS DE USUÁRIOS =====
router.get("/usuarios", listarUsuarios);
router.post("/usuarios", criarUsuario);
router.put("/usuarios/:id", atualizarUsuario);
router.delete("/usuarios/:id", deletarUsuario);

// ===== ROTAS DE LIVROS =====
router.get("/livros", listarLivros);
router.post("/livros", criarLivro);
router.put("/livros/:id", atualizarLivro);
router.delete("/livros/:id", deletarLivro);

// ===== ROTAS DE AUTORES =====
router.get("/autores", listarAutores);
router.post("/autores", criarAutor);
router.delete("/autores/:id", deletarAutor);

// ===== ROTAS DE EDITORAS =====
router.get("/editoras", listarEditoras);
router.post("/editoras", criarEditora);
router.delete("/editoras/:id", deletarEditora);

export default router;