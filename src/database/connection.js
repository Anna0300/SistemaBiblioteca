import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Lê as variáveis do .env (local) ou do painel da hospedagem (produção).
// Os nomes batem com o .env do projeto: MYSQL_HOST, MYSQL_USER, etc.
const db = await mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "biblioteca",
    port: process.env.MYSQL_PORT || 3306,
    ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

export default db;
