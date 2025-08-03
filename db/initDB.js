const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/estoqueCafe.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS entregas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fornecedor TEXT NOT NULL,
        item TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        observacao TEXT,
        dataHora TEXT NOT NULL
        )`);
});

db.close();