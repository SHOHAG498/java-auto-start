const http = require('http');
const mineflayer = require('mineflayer');

// 1. Keep Render Web Service Alive with HTTP Server
const PORT = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minecraft AFK Bot is Active and Running 24/7!');
});

server.listen(PORT, () => {
  console.log(`Keep-Alive Web Server running on port ${PORT}`);
});

// 2. Mineflayer AFK Bot Implementation
function createAFKBot() {
  console.log('Connecting Mineflayer AFK Bot to Falix Server...');

  const bot = mineflayer.createBot({
    host: 'srserver.falixsrv.me', // তোমার Falix Server Address
    port: 25565,                  // Default Java Port
    username: 'SR_Render_Bot',    // Bot Username
    version: false                // Auto-detect version
  });

  bot.on('spawn', () => {
    console.log('🤖 AFK Bot successfully joined the Minecraft Server!');
    
    // Anti-AFK Movement (প্রতি ৪ মিনিটে একবার লাফাবে)
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
      console.log('Bot performed anti-AFK jump.');
    }, 240000);
  });

  bot.on('error', (err) => {
    console.log('Mineflayer Error:', err.message);
  });

  bot.on('end', () => {
    console.log('Bot disconnected from server! Reconnecting in 30 seconds...');
    setTimeout(createAFKBot, 30000); // অটোমেটিক রি-কানেক্ট করবে
  });
}

// Start Bot
createAFKBot();
