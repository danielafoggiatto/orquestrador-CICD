
# Orquestrador Playwright

Este repositório contém um **orquestrador para rodar testes automatizados com Playwright**, podendo ser executado **automaticamente a cada Pull Request** ou **via push local em uma branch específica**, sem precisar do GitHub Actions.

---

## Funcionalidades

- Clona o repositório e instala dependências automaticamente.
- Executa testes Playwright e gera **relatório HTML interativo**.
- Coleta artefatos (logs, screenshots, vídeos) para análise.
- Permite rodar localmente ou receber triggers de PR via webhook.

---

## Pré-requisitos

- Node.js >= 18
- npm >= 9
- Git
- Navegador (Chrome/Chromium, Firefox ou WebKit, recomendado Chromium)
- Para testes via webhook: [ngrok](https://ngrok.com/) (opcional, para expor localhost)

---

## Instalação

1. Clone este repositório (ou apenas a pasta `orquestrador-playwright`):
   ```bash
   git clone https://github.com/SEU-USUARIO/orquestrador-playwright.git
   cd orquestrador-playwright


2. Instale dependências:

   ```bash
   npm install
   ```

---

## Uso Local (via push em branch)

1. Abra um terminal e rode o servidor:

   ```bash
   node index.js
   ```

2. Em outro terminal, execute a trigger do orquestrador:

   ```bash
   curl -X POST http://localhost:3000/webhook \
       -H "Content-Type: application/json" \
       -d '{"pull_request":{"base":{"ref":"main"}}}'
   ```

3. O relatório HTML será aberto automaticamente no navegador padrão.

---

## Uso com Pull Request (via GitHub Webhook)

1. Crie um webhook no seu repositório GitHub:

   * URL: `https://<SEU-NGROK-LINK>/webhook`
   * Conteúdo JSON
   * Eventos: Pull requests (aberto, sincronizado, fechado)

2. Inicie o servidor localmente:

   ```bash
   node index.js
   ```

3. Certifique-se que o ngrok esteja rodando:

   ```bash
   ngrok http 3000
   ```

4. Sempre que um PR for criado ou atualizado, o orquestrador será disparado automaticamente.

⚠️ Lembre-se: **ngrok free expira a cada 8 horas**, sendo necessário atualizar o link no GitHub. Para link fixo, considere plano pago.

---

## Observações

* Relatórios HTML e artefatos ficam em `/tmp/playwright-repo-<timestamp>/playwright-results`.
* Para executar novamente, basta rodar o curl local ou abrir um novo PR.

---

## Contato

Criado por: [Daniela Foggiatto](https://github.com/danielafoggiatto)

---

## Tecnologias

* [Node.js](https://nodejs.org/)
* [Playwright](https://playwright.dev/)
* [Express](https://expressjs.com/)
* [ngrok](https://ngrok.com/) (opcional, para Webhooks)

```

```
