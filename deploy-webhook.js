const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');

const PORT = 9000;
const SECRET = 'eprai-deploy-2026';
const APP_DIR = '/var/www/quinceanera-app';
const LOG_FILE = '/var/log/deploy-webhook.log';

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(LOG_FILE, line);
    console.log(line.trim());
}

function verifySignature(payload, signature) {
    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/deploy') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            // Verify GitHub signature
            const sig = req.headers['x-hub-signature-256'];
            if (sig && !verifySignature(body, sig)) {
                log('ERROR: Invalid signature');
                res.writeHead(403);
                return res.end('Forbidden');
            }

            // Check if it's a push to main branch
            try {
                const payload = JSON.parse(body);
                if (payload.ref && payload.ref !== 'refs/heads/main') {
                    log(`Ignoring push to ${payload.ref}`);
                    res.writeHead(200);
                    return res.end('Ignored (not main branch)');
                }
            } catch (e) { /* continue anyway */ }

            log('Deploy triggered! Pulling and building...');
            res.writeHead(200);
            res.end('Deploy started');

            // Run deploy in background
            try {
                execSync(`cd ${APP_DIR} && git pull origin main 2>&1`, { timeout: 30000 });
                log('Git pull OK');
                execSync(`cd ${APP_DIR} && npm install --production 2>&1`, { timeout: 120000 });
                log('npm install OK');
                execSync(`cd ${APP_DIR} && npm run build 2>&1`, { timeout: 300000 });
                log('Build OK');
                execSync('pm2 restart quinceanera 2>&1', { timeout: 10000 });
                log('PM2 restart OK — Deploy complete!');
            } catch (err) {
                log(`ERROR during deploy: ${err.message}`);
            }
        });
    } else if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200);
        res.end('Webhook server OK');
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    log(`Deploy webhook listening on port ${PORT}`);
});
