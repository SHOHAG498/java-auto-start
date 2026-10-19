const http = require('http');
const axios = require('axios');

const FALIX_API_KEY = process.env.FALIX_API_KEY;
const FALIX_SERVER_ID = process.env.FALIX_SERVER_ID;

// Start Falix Server via API
async function startFalixServer() {
  try {
    console.log('Wake-up trigger received! Starting Falix Server...');
    await axios.post(
      `https://panel.falixnodes.net/api/client/servers/${FALIX_SERVER_ID}/power`,
      { signal: 'start' },
      {
        headers: {
          'Authorization': `Bearer ${FALIX_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    console.log('Falix Server Start Signal Sent Successfully!');
  } catch (error) {
    console.error('Error starting Falix Server:', error.message);
  }
}

// Lightweight HTTP Web Server for Render
const server = http.createServer((req, res) => {
  startFalixServer();
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Minecraft Server Wake Signal Sent! Please wait 30 seconds for the server to turn on.');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Auto-Start Web Proxy listening on port ${PORT}...`);
});
