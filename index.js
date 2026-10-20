const http = require('http');
const mineflayer = require('mineflayer');

// 1. Keep Render Alive (UptimeRobot Ping Receiver)
const PORT = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Minecraft AFK Bot is Alive & Active 24/7!');
});

server.listen(PORT, () => {
  console.log(`[HTTP] Keep-Alive Web Server running on port ${PORT}`);
});

// 2. Mineflayer AFK Bot with Auto-Reconnect Logic
let bot = null;
let reconnectTimer = null;

function connectBot() {
  console.log('[BOT] Attempting to connect AFK Bot to Minecraft Server...');

  bot = mineflayer.createBot({
    host: 'srserver.falixsrv.me', // Falix Server Address
    port: 25565,                  // Default Java Port
    username: 'SR_Render_Bot',    // Bot Username
    version: false                // Auto-detect server version
  });

  // When bot successfully spawns into the world
  bot.on('spawn', () => {
    console.log('🤖 [BOT] Successfully joined the server!');

    // Anti-AFK Movement (প্রতি ৩ মিনিট পর পর লাফাবে)
    if (bot.afkInterval) clearInterval(bot.afkInterval);
    bot.afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
        console.log('[BOT] Anti-AFK jump performed.');
      }
    }, 180000);
  });

  // Handle bot errors
  bot.on('error', (err) => {
    console.log('[BOT] Connection Error:', err.message);
  });

  // AUTO-RECONNECT LOGIC: Triggered on disconnect or kick
  bot.on('end', (reason) => {
    console.log(`[BOT] Disconnected (Reason: ${reason}). Retrying in 15 seconds...`);

    // Clean up existing interval
    if (bot.afkInterval) clearInterval(bot.afkInterval);

    // Clear previous timer if exists to prevent multiple loops
    if (reconnectTimer) clearTimeout(reconnectTimer);

    // Reconnect after 15 seconds
    reconnectTimer = setTimeout(() => {
      connectBot();
    }, 15000);
  });
}

// Start Bot Connection
connectBot();
