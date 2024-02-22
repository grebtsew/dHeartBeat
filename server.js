const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { AbortController } = require('abort-controller');

const app = express();
const port = 3000;

const phplink = 'http://localhost:80/proxy.php?url=';
const about_timeout = 10000;
const max_graph_length = 30;

const latencyData = {};
const linksFilePath = path.join(__dirname, './links.txt');
let links = fs.readFileSync(linksFilePath, 'utf-8')
    .split('\n')
    .filter(line => line.trim() !== '') // Remove empty lines
    .map(line => {
        const [name, link] = line.split(' ');
        return { name, link };
    });

async function fetchLink(link) {
  let aborted = false;

  // Set a timeout for the fetch request
  const timeoutId = setTimeout(() => {
    aborted = true;
    console.log('Request aborted due to timeout');
  }, about_timeout);

  const handleLatencyData = async () => {
    const start = new Date();

    try {
      if (!aborted) {
        // HEAD request
        const headResponse = await fetch(phplink + link.link, { method: 'HEAD' });

        // Check if the timeout occurred during the HEAD request
        if (!aborted) {
          // If not aborted, continue with the GET request
          const response = await fetch(phplink + link.link);

          if (response.ok) {
            const end = new Date();
            const latencyValue = end - start;

            latencyData[link.link] = [...(latencyData[link.link] || []), latencyValue];

            // Remove oldest data if the maximum size is reached
            if (latencyData[link.link].length > max_graph_length) {
              latencyData[link.link].shift(); // Remove the first element
            }
          } else {
            // Handle non-OK response
            console.error(`Non-OK response for link: ${link.link}`);

            latencyData[link.link] = [...(latencyData[link.link] || []), -1];

            // Remove oldest data if the maximum size is reached
            if (latencyData[link.link].length > max_graph_length) {
              latencyData[link.link].shift(); // Remove the first element
            }

          }
        }
      }
    } catch (error) {
      // Handle errors
      if (!aborted) {
        console.error(`Error fetching data for link: ${link.link}`, error);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  handleLatencyData();
}



function fetchAllLinksData() {
  links.forEach(link => {
    fetchLink(link);
  });
}

// Perform the fetch every 10 seconds
setInterval(fetchAllLinksData, 10000);

app.use(express.json()); // Parse JSON requests

// Endpoint to retrieve stored latency data
app.get('/latencyData', (req, res) => {
  res.json(latencyData);
});



// Endpoint to add a new link to the list
app.post('/addLink', (req, res) => {
  const { name, link } = req.body;
  links.push({ name, link });
  res.json(links);
});

// Endpoint to remove a link from the list
app.post('/removeLink', (req, res) => {

  console.error("Received remove link");

  const { name } = req.body;
  console.error(name)

  const index = links.findIndex(l => l.link === name);
  if (index !== -1) {
    links.splice(index, 1);
    // Clear latency data for the removed link
    
    delete latencyData[name];
  }

  res.json(links);
});

// Endpoint to get the current list of links
app.get('/getLinks', (req, res) => {
  res.json(links);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
