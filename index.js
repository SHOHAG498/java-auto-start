const http = require('http');
const axios = require('axios');

const FALIX_API_KEY = process.env.FALIX_API_KEY;
const FALIX_SERVER_ID = process.env.FALIX_SERVER_ID || '3524466';

async function startFalixServer() {
  console.log('Wake-up trigger received! Sending start request to Falix Client API...');

  const headers = {
    'Authorization': `Bearer ${FALIX_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  // FalixNodes Client API Endpoint List
  const requests = [
    axios.post(`https://client.falixnodes.net/api/v1/server/${FALIX_SERVER_ID}/start`, {}, { headers }),
    axios.post(`https://client.falixnodes.net/api/v1/servers/${FALIX_SERVER_ID}/start`, {}, { headers }),
    axios.post(`https://client.falixnodes.net/api/server/${FALIX_SERVER_ID}/power`, { action: 'start' }, { headers }),
    axios.get(`https://client.falixnodes.net/api/v1/server/${FALIX_SERVER_ID}/start`, { headers })
  ];

  try {
    const results = await Promise.allSettled(requests);
    let anySuccess = false;

    results.forEach((res, index) => {
      if (res.status === 'fulfilled' && res.value.status >= 200 && res.value.status < 300) {
        console.log(`Endpoint ${index + 1} Succeeded! Server is starting.`);
        anySuccess = true;
      }
    });

    if (!anySuccess) {
      console.log('API requests sent to Falix. Checking server state...');
    }
  } catch (err) {
    console.error('Error triggering Falix API:', err.message);
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
