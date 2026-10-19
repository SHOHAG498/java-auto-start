const http = require('http');
const axios = require('axios');

const FALIX_API_KEY = process.env.FALIX_API_KEY;
const FALIX_SERVER_ID = process.env.FALIX_SERVER_ID;

// Start Falix Server via Multiple API Endpoints
async function startFalixServer() {
  console.log('Wake-up trigger received! Starting Falix Server...');

  // Endpoints list to attempt
  const endpoints = [
    {
      url: `https://panel.falixnodes.net/api/client/servers/${FALIX_SERVER_ID}/power`,
      data: { signal: 'start' }
    },
    {
      url: `https://client.falixnodes.net/api/v1/servers/${FALIX_SERVER_ID}/power`,
      data: { state: 'start' }
    },
    {
      url: `https://client.falixnodes.net/api/v1/servers/${FALIX_SERVER_ID}/start`,
      data: {}
    }
  ];

  let success = false;

  for (const ep of endpoints) {
    try {
      await axios.post(ep.url, ep.data, {
        headers: {
          'Authorization': `Bearer ${FALIX_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log(`Falix Server Start Signal Sent Successfully via: ${ep.url}`);
      success = true;
      break;
    } catch (err) {
      // Continue to next endpoint if failed
    }
  }

  if (!success) {
    console.error('Failed to trigger server start across all endpoints. Check Server Identifier/ID.');
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
