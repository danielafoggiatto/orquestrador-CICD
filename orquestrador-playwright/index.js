const express = require('express');
const bodyParser = require('body-parser');
const { runPlaywright } = require('./runPlaywright');

const app = express();
app.use(bodyParser.json());

// Webhook do GitHub
app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;

        if (!payload.pull_request) {
            console.log('[INFO] Evento não é pull request. Ignorando.');
            return res.json({ status: 'ignored', message: 'Não é PR' });
        }

        const baseBranch = payload.pull_request.base.ref;

        if (baseBranch !== 'main' && baseBranch !== 'staging') {
            console.log(`[INFO] PR detectado em ${baseBranch}. Ignorando.`);
            return res.json({ status: 'ignored', branch: baseBranch });
        }

        console.log(`[INFO] PR detectado em ${baseBranch}. Iniciando testes...`);

        try {
            const result = await runPlaywright(baseBranch, 'local');
            return res.json({ status: 'ok', result });
        } catch (err) {
            return res.status(500).json({ status: 'error', error: err.message });
        }

    } catch (err) {
        console.error('[ERROR] Webhook:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('[INFO] Orquestrador rodando na porta 3000'));
