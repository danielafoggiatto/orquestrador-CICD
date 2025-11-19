const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function execPromise(cmd, options = {}) {
    return new Promise((resolve, reject) => {
        const child = exec(cmd, options, (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve({ stdout, stderr });
        });
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    });
}

async function runPlaywright(branch, env = 'local') {
    // Diretório temporário único por execução
    const repoDir = `/tmp/playwright-repo-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const resultsDir = path.join(repoDir, 'playwright-results');

    try {
        // ⚡ Remove diretório se existir (precaução)
        if (fs.existsSync(repoDir)) {
            fs.rmSync(repoDir, { recursive: true, force: true });
        }

        // 1️⃣ Clona o repositório
        console.log(`[INFO] Clonando repositório no branch ${branch}...`);
        await execPromise(`git clone -b ${branch} https://github.com/danielafoggiattonpu/testes-interface-Meu-Portfolio.git ${repoDir}`);


        // 2️⃣ Cria diretório de resultados
        fs.mkdirSync(resultsDir, { recursive: true });

        // 3️⃣ Instala dependências
        console.log('[INFO] Instalando dependências...');
        await execPromise('npm install', { cwd: repoDir });

        //4 
        console.log('[INFO] Executando testes Playwright...');
        // Executa testes com relatório HTML
        await execPromise(
            `npx playwright test --reporter=html`,
            { cwd: repoDir }
        );

        // Abre o relatório no navegador
        console.log('[INFO] Abrindo relatório HTML...');
        await execPromise(`npx playwright show-report`, { cwd: repoDir });




        // 5️⃣ Coleta artefatos
        const artifacts = fs.existsSync(resultsDir)
            ? fs.readdirSync(resultsDir).map(f => path.join(resultsDir, f))
            : [];

        // 6️⃣ Lê JSON de resultados
        const resultsFile = path.join(resultsDir, 'report.json');
        const results = fs.existsSync(resultsFile) ? JSON.parse(fs.readFileSync(resultsFile)) : {};

        console.log('[INFO] Testes concluídos com sucesso!');
        return { results, artifacts };
    } catch (err) {
        console.error('[ERROR] Falha na execução do Playwright:', err.message);
        throw err;
    }
}

module.exports = { runPlaywright };
