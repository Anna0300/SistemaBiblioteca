const API_URL = "http://localhost:3000";

let livros = [];
let historico = [];
const PRAZO_DEVOLUCAO = 7;

async function carregarLivros() {
    try {
        const res = await fetch(`${API_URL}/livros`);
        if (!res.ok) throw new Error("Resposta inválida");
        livros = await res.json();
        console.log("📚 Livros carregados da API:", livros.length);
    } catch (err) {
        console.error("❌ Erro:", err.message);
        livros = [];
    }
}

function salvarLivros() {}

function carregarHistorico() {
    const salvo = localStorage.getItem('historico');
    historico = salvo ? JSON.parse(salvo) : [];
    console.log("📜 Histórico carregado:", historico.length);
}

function salvarHistorico() {
    localStorage.setItem('historico', JSON.stringify(historico));
}

function calcularDiasRestantes(dataDevolucaoStr) {
    if (!dataDevolucaoStr) return null;
    const [d, m, a] = dataDevolucaoStr.split('/');
    const dataDev = new Date(a, m - 1, d);
    return Math.ceil((dataDev - new Date()) / (1000 * 60 * 60 * 24));
}

async function inicializarDados() {
    carregarHistorico();
    await carregarLivros();
    document.dispatchEvent(new Event('dadosCarregados'));
}

inicializarDados();