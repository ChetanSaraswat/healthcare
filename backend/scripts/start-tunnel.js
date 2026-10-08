'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
const port = process.env.APP_PORT || process.env.APP_FORWARD_PORT || 8080;
const targetUrl = `http://localhost:${port}`;

console.log(`[Cloudflare Tunnel] Starting tunnel for ${targetUrl}...`);

const cloudflared = spawn('cloudflared', ['tunnel', '--url', targetUrl]);

let urlDetected = false;

function updateEnv(tunnelUrl) {
  if (!fs.existsSync(envPath)) return;
  try {
    let content = fs.readFileSync(envPath, 'utf8');
    const webhookUrl = `${tunnelUrl}/api/v1/payments/razorpay/webhook`;

    if (content.includes('CLOUDFLARE_TUNNEL_URL=')) {
      content = content.replace(/CLOUDFLARE_TUNNEL_URL=.*/g, `CLOUDFLARE_TUNNEL_URL=${tunnelUrl}`);
    } else {
      content += `\nCLOUDFLARE_TUNNEL_URL=${tunnelUrl}`;
    }

    if (content.includes('RAZORPAY_WEBHOOK_URL=')) {
      content = content.replace(/RAZORPAY_WEBHOOK_URL=.*/g, `RAZORPAY_WEBHOOK_URL=${webhookUrl}`);
    } else {
      content += `\nRAZORPAY_WEBHOOK_URL=${webhookUrl}`;
    }

    fs.writeFileSync(envPath, content, 'utf8');
    console.log(`[Cloudflare Tunnel] Updated ${envPath} with new tunnel URLs.`);
  } catch (err) {
    console.warn(`[Cloudflare Tunnel] Failed to update .env:`, err.message);
  }
}

function handleData(data) {
  const text = data.toString();
  process.stdout.write(text);

  if (!urlDetected) {
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (match) {
      urlDetected = true;
      const tunnelUrl = match[0];
      const webhookUrl = `${tunnelUrl}/api/v1/payments/razorpay/webhook`;
      
      updateEnv(tunnelUrl);

      console.log('\n======================================================');
      console.log('🚀 CLOUDFLARE TUNNEL ONLINE FOR LOCAL TESTING');
      console.log('======================================================');
      console.log(`• Public Base URL:   ${tunnelUrl}`);
      console.log(`• Health Check:      ${tunnelUrl}/health`);
      console.log(`• Webhook Endpoint:  ${webhookUrl}`);
      console.log('======================================================');
      console.log('📌 Instructions for Razorpay Dashboard:');
      console.log('1. Go to: Razorpay Dashboard -> Settings -> Webhooks');
      console.log(`2. Webhook URL: ${webhookUrl}`);
      console.log('3. Secret: Value in your RAZORPAY_WEBHOOK_SECRET');
      console.log('4. Active Events: payment.captured, payment.failed, order.paid');
      console.log('======================================================\n');
    }
  }
}

cloudflared.stdout.on('data', handleData);
cloudflared.stderr.on('data', handleData);

cloudflared.on('close', (code) => {
  console.log(`[Cloudflare Tunnel] Process exited with code ${code}`);
});

process.on('SIGINT', () => {
  cloudflared.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  cloudflared.kill('SIGTERM');
  process.exit();
});
