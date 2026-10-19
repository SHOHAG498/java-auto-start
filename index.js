const http = require('http');
const axios = require('axios');

const FALIX_API_KEY = process.env.FALIX_API_KEY;
const FALIX_SERVER_ID = process.env.FALIX_SERVER_ID || '3524466';

async function startFalixServer() {
  console.log('Wake-up trigger received! Sending start request to Falix...');

  const config = {
    headers: {
      'Authorization': `Bearer ${FALIX_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  };

  // Multiple client endpoints attempt
  try {
    await axios.post(`https://client.falixnodes.net/api/v1/server/${FALIX_SERVER_ID}/start`, {}, config);
    console.log('Successfully triggered server start!');
  } catch (err1) {
    try {
      await axios.post(`https://client.falixnodes.net/api/server/${FALIX_SERVER_ID}/power`, { action: 'start' }, config);
      console.log('Successfully triggered server power action!');
    } catch (err2) {
      console.log('Sent start attempt to Falix Client Panel.');
    }
  }
}

// Lightweight HTTP Web Server for Render
const server = http.createServer((req, res) => {
  startFalixServer();
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Minecraft Server Wake Signal Sent! Please wait 30 seconds for the server to turn on.');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Auto-Start Web Proxy listening on port ${PORT}...`);
});
