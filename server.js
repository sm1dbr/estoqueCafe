const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const { google } = require('googleapis');
const fs = require('fs');


const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const spreadsheetId = '1mAa_ThFgGmjjYuH-QDfxHecZYMEG2DS-LvYPezXTWX4';


// Voltando ao cors pq nem manual deu certo

app.use(cors());
app.use(express.json());


// Rota pra receber os dados do formulário

app.post('/api/entrega', async (req, res) => {
    const dadosRecebidos = req.body;

    console.log('Dados Recebidos:', dadosRecebidos);

    const values = dadosRecebidos.itens.map(i => [
        new Date(dadosRecebidos.dataHora).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        dadosRecebidos.fornecedor,
        i.item,
        i.quantidade,
        dadosRecebidos.observacao || ''
    ]);

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Entregas!A:E',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values
            },
        });
        res.status(200).json({ message: 'Dados enviados ao Google Sheets com sucesso!' });
    } catch (err) {
        console.error('Err ao enviar dados ao Google Sheets:', err);
        res.status(500).json({ error: 'Erro ao salvar no Google Sheets' });
    }

});


// Inicia o servidor

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});