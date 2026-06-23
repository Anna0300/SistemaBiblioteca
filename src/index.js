import express from "express";
import routes from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.json());
app.use(routes);

// --- CAMINHO PARA O FRONTEND --- 
const frontendPath = path.join(__dirname, "../frontend/biblioteca");
app.use(express.static(frontendPath));
console.log(`Servindo frontend de: ${frontendPath}`);
// ----------------------------------------------

// Render define a porta via variável de ambiente PORT.
// Local: cai em 3000 automaticamente.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/sistema.html`);
});
