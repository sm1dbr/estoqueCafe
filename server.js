const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// poderia ser cors, mas não tá deixando sei lá pq, então vai manual

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }


    next();
});
app.use(express.json());

// CONECTAR COM O SQLITE
const db = new sqlite3.Database('./db/estoqueCafe.db', (err) => {
    if (err) {
        console.error('Erro ao conectar com o SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite!')
    }
});

// Rota pra receber os dados do formulário

app.post('/api/entrega', (req, res) => {
    const dadosRecebidos = req.body;

    console.log('Dados Recebidos:', dadosRecebidos);

    const sql = 'INSERT INTO entregas (fornecedor, item, quantidade, observacao, dataHora) VALUES (?, ?, ?, ?, ?)';
    
    const stmt = db.prepare(sql);

    dadosRecebidos.itens.forEach(i => {
        stmt.run(
            dadosRecebidos.fornecedor,
            i.item,
            i.quantidade,
            dadosRecebidos.observacao,
            dadosRecebidos.dataHora
        );
    });

    stmt.finalize(err => {
        if (err) {
            console.error('Erro ao inserir dados:', err.message);
            return res.status(500).json({ error: 'Erro ao salvar no banco' });
        } 
        res.status(200).json({ message: 'Dados recebidos com sucesso!' });
    });

});

// Baixar o banco de dados
app.get('/download-db', (req, res) => {
    const file = path.join(__dirname, 'db', 'estoqueCafe.db');
    res.download(file, 'estoqueCafe.db', (err) => {
        if (err) {
            console.error('Erro ao enviar o arquivo:', err);
            res.status(500).send('Erro ao baixar o banco de dados');
        }
    });
});


// Inicia o servidor

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});