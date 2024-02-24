

const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const iconClasses = ["fa fa-flag","fa fa-caret-down","fa fa-flag fa-fw","fa fa-rub fa-fw","fa fa-camera-retro fa-fw","fa fa-check-square fa-fw","fa fa-won fa-fw",
"fa fa-play-circle fa-fw","fa fa-github fa-fw","fa fa-medkit fa-fw","fa fa-caret-down","fa fa-flag","fa fa-rub",
"fa fa-ruble","fa fa-rouble","fa fa-pagelines",
"fa fa-wheelchair","fa fa-vimeo-square","fa fa-try","fa fa-turkish-lira","fa fa-adjust","fa fa-anchor","fa fa-archive","fa fa-arrows"
,"fa fa-arrows-h","fa fa-arrows-v","fa fa-asterisk","fa fa-ban","fa fa-barcode","fa fa-bars","fa fa-beer","fa fa-bell","fa fa-bolt","fa fa-book",
"fa fa-bookmark","fa fa-briefcase","fa fa-bug","fa fa-bullhorn","fa fa-bullseye","fa fa-calendar","fa fa-camera",
"fa fa-camera-retro","fa fa-certificate","fa fa-check",
"fa fa-circle","fa fa-cloud","fa fa-cloud-download",
"fa fa-cloud-upload","fa fa-code","fa fa-code-fork","fa fa-coffee","fa fa-cog","fa fa-cogs","fa fa-comment","fa fa-comments",
"fa fa-compass","fa fa-credit-card","fa fa-crop","fa fa-crosshairs","fa fa-cutlery","fa fa-dashboard","fa fa-desktop","fa fa-download",
"fa fa-edit","fa fa-ellipsis-h","fa fa-ellipsis-v","fa fa-envelope","fa fa-eraser","fa fa-exchange","fa fa-exclamation","fa fa-exclamation-circle",
"fa fa-exclamation-triangle","fa fa-external-link","fa fa-external-link-square","fa fa-eye","fa fa-eye-slash","fa fa-female","fa fa-fighter-jet","fa fa-film",
"fa fa-filter","fa fa-fire","fa fa-fire-extinguisher","fa fa-flag","fa fa-flag-checkered","fa fa-flash","fa fa-flask","fa fa-folder",
"fa fa-folder-open","fa fa-gamepad","fa fa-gavel","fa fa-gear","fa fa-gears","fa fa-gift","fa fa-globe","fa fa-headphones",
"fa fa-heart","fa fa-home","fa fa-inbox","fa fa-info","fa fa-info-circle","fa fa-key","fa fa-laptop","fa fa-leaf","fa fa-legal",
"fa fa-level-down","fa fa-level-up","fa fa-location-arrow","fa fa-lock","fa fa-magic","fa fa-magnet","fa fa-mail-forward","fa fa-mail-reply","fa fa-mail-reply-all",
"fa fa-male","fa fa-map-marker","fa fa-microphone","fa fa-microphone-slash","fa fa-minus","fa fa-minus-circle","fa fa-minus-square","fa fa-mobile",
"fa fa-mobile-phone","fa fa-music","fa fa-pencil","fa fa-pencil-square","fa fa-phone","fa fa-phone-square","fa fa-plane",
"fa fa-plus","fa fa-plus-circle","fa fa-plus-square","fa fa-power-off","fa fa-print","fa fa-puzzle-piece","fa fa-qrcode","fa fa-question","fa fa-question-circle",
"fa fa-quote-left","fa fa-quote-right","fa fa-random","fa fa-refresh","fa fa-reply","fa fa-reply-all","fa fa-retweet","fa fa-road","fa fa-rocket","fa fa-rss","fa fa-rss-square","fa fa-search",
"fa fa-search-minus","fa fa-search-plus","fa fa-share","fa fa-share-square","fa fa-shield","fa fa-shopping-cart","fa fa-sign-in","fa fa-signal","fa fa-sitemap",
"fa fa-sort","fa fa-sort-alpha-asc","fa fa-sort-alpha-desc","fa fa-sort-amount-asc","fa fa-sort-amount-desc","fa fa-sort-asc","fa fa-sort-desc","fa fa-sort-down",
"fa fa-sort-numeric-asc","fa fa-sort-numeric-desc","fa fa-sort-up","fa fa-spinner","fa fa-square","fa fa-star","fa fa-star-half","fa fa-star-half-full",
"fa fa-subscript","fa fa-suitcase","fa fa-superscript","fa fa-tablet","fa fa-tachometer","fa fa-tag","fa fa-tags",
"fa fa-tasks","fa fa-terminal","fa fa-thumb-tack","fa fa-thumbs-down","fa fa-thumbs-up","fa fa-ticket","fa fa-times","fa fa-times-circle",
"fa fa-tint","fa fa-trophy","fa fa-truck","fa fa-umbrella",
"fa fa-unlock","fa fa-unlock-alt","fa fa-unsorted","fa fa-upload","fa fa-user","fa fa-users","fa fa-video-camera","fa fa-volume-down","fa fa-volume-off","fa fa-volume-up","fa fa-warning",
"fa fa-wheelchair","fa fa-wrench","fa fa-circle",
"fa fa-plus-square","fa fa-square","fa fa-bitcoin","fa fa-btc","fa fa-cny","fa fa-dollar","fa fa-eur","fa fa-euro","fa fa-gbp","fa fa-inr",
"fa fa-jpy","fa fa-krw","fa fa-money","fa fa-rmb","fa fa-rouble","fa fa-rub","fa fa-ruble","fa fa-rupee","fa fa-try","fa fa-turkish-lira","fa fa-usd","fa fa-won","fa fa-yen",
"fa fa-align-center","fa fa-align-justify","fa fa-align-left","fa fa-align-right","fa fa-bold","fa fa-chain","fa fa-chain-broken","fa fa-clipboard","fa fa-columns","fa fa-copy",
"fa fa-cut","fa fa-dedent","fa fa-eraser","fa fa-file","fa fa-font","fa fa-indent","fa fa-italic",
"fa fa-link","fa fa-list","fa fa-list-alt","fa fa-list-ol","fa fa-list-ul","fa fa-outdent","fa fa-paperclip","fa fa-paste","fa fa-repeat","fa fa-rotate-left","fa fa-rotate-right","fa fa-save",
"fa fa-scissors","fa fa-strikethrough","fa fa-table","fa fa-text-height","fa fa-text-width","fa fa-th","fa fa-th-large","fa fa-th-list","fa fa-underline","fa fa-undo","fa fa-unlink",
"fa fa-angle-double-down","fa fa-angle-double-left","fa fa-angle-double-right","fa fa-angle-double-up","fa fa-angle-down","fa fa-angle-left","fa fa-angle-right","fa fa-angle-up","fa fa-arrow-circle-down",
"fa fa-arrow-circle-left","fa fa-arrow-circle-right","fa fa-arrow-circle-up","fa fa-arrow-down",
"fa fa-arrow-left","fa fa-arrow-right","fa fa-arrow-up","fa fa-arrows","fa fa-arrows-alt","fa fa-arrows-h","fa fa-arrows-v","fa fa-caret-down","fa fa-caret-left","fa fa-caret-right",
,"fa fa-caret-up","fa fa-chevron-circle-down","fa fa-chevron-circle-left","fa fa-chevron-circle-right","fa fa-chevron-circle-up",
"fa fa-chevron-down","fa fa-chevron-left","fa fa-chevron-right","fa fa-chevron-up","fa fa-long-arrow-down","fa fa-long-arrow-left",
"fa fa-long-arrow-right","fa fa-long-arrow-up","fa fa-arrows-alt","fa fa-backward","fa fa-compress","fa fa-eject","fa fa-expand",
"fa fa-fast-backward","fa fa-fast-forward","fa fa-forward","fa fa-pause","fa fa-play","fa fa-play-circle","fa fa-step-backward","fa fa-step-forward","fa fa-stop","fa fa-medkit","fa fa-plus-square","fa fa-stethoscope",
"fa fa-user-md","fa fa-wheelchair","fa fa-flag","fa fa-maxcdn"];


const app = express();
const port = 3000;

const phplink = 'http://localhost:80/proxy.php?url=';
const about_timeout = 10000;
const max_graph_length = 30;



const latencyData = {};
const linksFilePath = path.join(__dirname, './links.txt');
let links = fs.readFileSync(linksFilePath, 'utf-8')
    .split('\r\n') // potential problem with line endings!
    .filter(line => line.trim() !== '') // Remove empty lines
    .map(line => {
        const [name, link] = line.split(' ');
        const color = getRandomColor() ;
        const icon = getRandomIconClass();
        return { name, link, color, icon };
    });

    function getRandomIconClass() {
      const randomIndex = Math.floor(Math.random() * iconClasses.length);
      return iconClasses[randomIndex];
  }
    
  function getRandomColor() {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 200);
    const green = Math.floor(Math.random() * 200);
    const blue = Math.floor(Math.random() * 200);
  
    // Combine the components to form a CSS color string
    const color = `rgb(${red},${green},${blue})`;
  
    return color;
  }

async function fetchLink(link) {
  /* This is the heartbeat per link function that is used every interval for each link!*/ 
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

            const currentTime = end.toLocaleTimeString();

            latencyData[link.link] = [
              ...(latencyData[link.link] || []),
              { latency: latencyValue, time: currentTime }
            ];

            // Remove oldest data if the maximum size is reached
            if (latencyData[link.link].length > max_graph_length) {
              latencyData[link.link].shift(); // Remove the first element
            }
          } else {
            // Handle non-OK response
            console.error(`Non-OK response for link: ${link.link}`);

            const end = new Date();
            const latencyValue = end - start;

            const currentTime = end.toLocaleTimeString();

            latencyData[link.link] = [
              ...(latencyData[link.link] || []),
              { latency: -1, time: currentTime }
            ];

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
  const color = getRandomColor();
  const icon = getRandomIconClass();

  // Check if a link with the same 'link' property already exists
  const existingLinkIndex = links.findIndex(existingLink => existingLink.link === link);

  if (existingLinkIndex !== -1) {
  } else {
    // Link doesn't exist, add a new entry
    links.push({ name, link, color, icon });
  }
 console.log(links);
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
