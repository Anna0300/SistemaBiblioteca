// 1. Endereço do seu servidor Back-end
const API_URL = "http://localhost:3000";

// --- FUNÇÕES PARA AUTORES ---
async function listarAutores() {
    try {
        const res = await fetch(`${API_URL}/autores`);
        const dados = await res.json();
        console.log("Autores:", dados);
    } catch (err) { console.error("Erro ao listar autores:", err); }
}

async function cadastrarAutor(nome, nacionalidade) {
    try {
        await fetch(`${API_URL}/autores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, nacionalidade })
        });
        alert("Autor cadastrado!");
        listarAutores();
    } catch (err) { console.error("Erro ao cadastrar autor:", err); }
}

// --- FUNÇÕES PARA LIVROS ---
async function listarLivros() {
    try {
        const res = await fetch(`${API_URL}/livros`);
        const dados = await res.json();
        console.log("Livros:", dados);
    } catch (err) { console.error("Erro ao listar livros:", err); }
}

async function cadastrarLivro(titulo, autorId) {
    try {
        await fetch(`${API_URL}/livros`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, autorId })
        });
        alert("Livro cadastrado!");
        listarLivros();
    } catch (err) { console.error("Erro ao cadastrar livro:", err); }
}

// --- FUNÇÕES PARA EDITORAS ---
async function listarEditoras() {
    try {
        const res = await fetch(`${API_URL}/editoras`);
        const dados = await res.json();
        console.log("Editoras:", dados);
    } catch (err) { console.error("Erro ao listar editoras:", err); }
}

// --- FUNÇÕES PARA USUÁRIOS ---
async function listarUsuarios() {
    try {
        const res = await fetch(`${API_URL}/usuarios`);
        const dados = await res.json();
        console.log("Usuários:", dados);
    } catch (err) { console.error("Erro ao listar usuários:", err); }
}

// --- INICIALIZAÇÃO AUTOMÁTICA ---
// Essa parte roda assim que você abre o site no navegador
window.onload = () => {
    console.log("Conectado ao Front-end. Buscando dados iniciais...");
    listarAutores();
    listarLivros();
    listarEditoras();
    listarUsuarios();
};