const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

// Criar conexão com o BD

const pool = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'V4olanbc97@',
    database: 'estoqueCafe',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



// Rota pra receber os dados do formulário

app.post('/api/entrega', (req, res) => {
    const dadosRecebidos = req.body;

    console.log('Dados Recebidos:', dadosRecebidos);

    const sql = 'INSERT INTO entregas (fornecedor, item, quantidade, observacao, dataHora) VALUES ?';
    
    const values = dadosRecebidos.itens.map(i => [
        dadosRecebidos.fornecedor,
        i.item,
        i.quantidade,
        dadosRecebidos.observacao,
        new Date(dadosRecebidos.dataHora)
    ]);

    pool.query(sql, [values], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).json({ error: 'Erro ao salvar no banco' });
        }

        res.status(200).json({ message: 'Dados recebidos com sucesso!'});

    });
});

// Inicia o servidor

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});