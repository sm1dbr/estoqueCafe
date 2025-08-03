const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// CONECTAR COM O SQLITE
const db = new sqlite3.Database('./db/estoqueCafe.bd', (err) => {
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

// Inicia o servidor

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});