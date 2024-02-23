// script.js

document.addEventListener('DOMContentLoaded', function () {
  const port = '8085';
  const phplink = `http://localhost:${port}/proxy.php?url=`;
  const max_graph_length  = 30;
  const about_timeout = 10000; 
  const timer_interval = 10000;
  let countdown = 10; // Initial countdown value
  const maxDataSize = max_graph_length; // Adjust as needed

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
    "fa fa-folder-open","fa fa-gamepad","fa fa-gavel","fa fa-gear","fa fa-gears","fa fa-gift","fa fa-glass","fa fa-globe","fa fa-group","fa fa-headphones",
    "fa fa-heart","fa fa-home","fa fa-inbox","fa fa-info","fa fa-info-circle","fa fa-key","fa fa-laptop","fa fa-leaf","fa fa-legal",
    "fa fa-level-down","fa fa-level-up","fa fa-location-arrow","fa fa-lock","fa fa-magic","fa fa-magnet","fa fa-mail-forward","fa fa-mail-reply","fa fa-mail-reply-all",
    "fa fa-male","fa fa-map-marker","fa fa-microphone","fa fa-microphone-slash","fa fa-minus","fa fa-minus-circle","fa fa-minus-square","fa fa-mobile",
    "fa fa-mobile-phone","fa fa-money","fa fa-music","fa fa-pencil","fa fa-pencil-square","fa fa-phone","fa fa-phone-square","fa fa-plane",
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

  let intervalIDs = {};
  let links = [];
  let oldlinks = [];
  let latencyData = {};

  document.getElementById('submitButton').addEventListener('click', submitForm);

  function submitForm() {

      var objectName = document.getElementById('name').value;
      var objectURL = document.getElementById('url').value;
      var fileInput = document.getElementById('file').files[0];


      if (fileInput) {
       
        var reader = new FileReader();

        reader.onload = function(event) {
          // The result attribute contains the file contents
          var fileContents = event.target.result;

          // Split the contents into lines
          var lines = fileContents.split(/\r?\n/);

          // Print each line
          lines.forEach(function(line) {
            var words = line.split(" ");
            
            if (words.length == 2){
              addLink(words[0], words[1])
            }
           
          });
      };

        // Read the file as text
        reader.readAsText(fileInput);

      } else{
        if (objectName && objectURL){
          addLink(objectName,objectURL)
        }
      }

    closePopup();
  }

  function _removeLink(link){
    // send remove request to backend
    removeLink(link.link);
    // remove card
    const elementToRemove = document.getElementById(link.link);

    // Check if the element exists before attempting to remove it
    if (elementToRemove) {
      // Remove the element
      clearInterval(intervalIDs[link.link]);
        delete intervalIDs[link.link];

      elementToRemove.remove();
      showToast("Website Removed!", "red");
    } else {
      console.error('Element with id "link.link" not found');
    }
    // remove from links, oldlinks
    delete latencyData[link.link];


    const valueToRemove = link.link;
    links = links.filter(obj => obj.link !== valueToRemove);
    oldlinks = oldlinks.filter(obj => obj.link !== valueToRemove);


    updateStatusList();
  }

 
  function updateClock() {
    const clockElement = document.getElementById('countdown');
    if (clockElement) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;
      clockElement.textContent = timeString;
    }

    // Use requestAnimationFrame for the next frame
    requestAnimationFrame(updateClock);
  }

  // Start the clock by calling updateClock once
  updateClock();


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

  // Create PiP Container
  const statusListContainer = document.createElement('div');
  statusListContainer.className = 'status-list-container';
  document.body.appendChild(statusListContainer);
  var containerDiv = document.querySelector('.StatusList');
  containerDiv.appendChild(statusListContainer);

  function createCard(link) {
    /* This function creates each new card, and for each card we attach a listener for backend updates! */
    const card = document.createElement('div');
    card.className = 'card';
    card.id = link.link;

    const iconContainer = document.createElement('div');
    iconContainer.className = 'iconContainer';

    const iconClass = getRandomIconClass();

    const iconElement = document.createElement('i');
    var splitted = iconClass.split(" ")
    iconElement.classList.add(splitted[0], splitted[1] );
    iconElement.style.color  =  getRandomColor();
    iconContainer.appendChild(iconElement);


    const infoContainer = document.createElement('div');
    infoContainer.className = 'infoContainer';

    const name = document.createElement('h3');
    name.textContent = link.name;
    infoContainer.appendChild(name);

    const statusContainer = document.createElement('div');
    statusContainer.className = 'statusContainer';

    const statusDot = document.createElement('div');
    statusDot.className = 'status-dot';
    statusContainer.appendChild(statusDot);

    const statusText = document.createElement('div');
    statusContainer.appendChild(statusText);
    infoContainer.appendChild(statusContainer)

    const Link = document.createElement('div');
    Link.className = 'linkilink';
    Link.textContent = link.link;
    infoContainer.appendChild(Link);

    // Add a nice-looking remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = '- remove';
 
    
    // Add a click event listener to the remove button
    removeButton.addEventListener('click', () => {
        // Handle the remove button click (you can call a function to handle the removal)
        _removeLink(link);
    });

    card.appendChild(removeButton);

    const latency = document.createElement('div');
    latency.className = 'latency';
    infoContainer.appendChild(latency);

    const mainContainer = document.createElement('div');
    mainContainer.className = 'mainContainer';

    mainContainer.appendChild(iconContainer);
    mainContainer.appendChild(infoContainer);

    card.appendChild(mainContainer)

    // Add a canvas for the chart inside each card
    const chartCanvas = document.createElement('canvas');
    chartCanvas.width = 200; // Set the width as needed
    chartCanvas.height = 100; // Set the height as needed
    card.appendChild(chartCanvas);
    const ctx = chartCanvas.getContext('2d');
    const chart = createChart(ctx);

    var containerDiv = document.querySelector('.Listview');

    // Append the new element to the container div
    containerDiv.appendChild(card);

    function updateStatus(isOnline) {
      // Clear existing classes
      statusDot.classList.remove('online', 'offline');
  
      if (isOnline) {
        statusDot.classList.add('online');
        statusText.textContent = 'Online';
      } else {
        statusDot.classList.add('offline');
        statusText.textContent = 'Offline';
      }
    }
        
    function updateLatency(latencyData) {

      if (!latencyData[link.link]) {
        latencyData[link.link] = [];
      }

      let latencyValue = latencyData[link.link][latencyData[link.link].length - 1];
      if (latencyValue == undefined){
        latencyValue = -1;
      }

      if (statusText.textContent == 'Online' && latencyValue == -1 ){
        showToast(`${link.link} Went Offline!`, "red")
      }
      if (statusText.textContent == 'Offline' && latencyValue != -1 ){
        showToast(`${link.link} Went Online!`, "green")
      }

      latency.textContent = `Latency: ${latencyValue} ms`;
      updateStatus(latencyValue != -1);

      const data = latencyData[link.link];
    
      // Add new data
      data.push(latencyValue);
    
      // Remove oldest data if the maximum size is reached
      if (data.length > maxDataSize) {
        data.shift(); // Remove the first element
      }
    
      // Update the chart for the specific link
      updateChart(chart, data);
    }

    async function getUpdatedData () {
      // Fetch and log latency data
      latencyData = await getLatencyData();
      latencyData = latencyData.content;
      
      try {
        latencyData = JSON.parse(latencyData);
      } catch (error) {
        console.error('Error parsing latencyData as JSON:', error);
      }
      updateLatency(latencyData);

      updateStatusList();
    };
    
  
    getUpdatedData();
     let iid = setInterval(getUpdatedData, timer_interval);

     intervalIDs[link.link] = iid;

  }

  function createChart(ctx) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Latency',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

       
  function getStatusText(linkName) {
    const latencyArray = latencyData[linkName];
    const lastLatencyValue = latencyArray ? latencyArray[latencyArray.length - 1] : null;
    return lastLatencyValue !== -1 && lastLatencyValue !== null ? `Online (${lastLatencyValue} ms)` : 'Offline';
  }
  
  function getStatusClass(linkName) {
    const latencyArray = latencyData[linkName];
    const lastLatencyValue = latencyArray ? latencyArray[latencyArray.length - 1] : null;
    const isOnline = lastLatencyValue !== -1 && lastLatencyValue !== null ;
    return isOnline ? 'online' : 'offline';
  }

  function updateStatusList() {
    // Clear previous status list
    statusListContainer.innerHTML = '';
  
    // Iterate through links and update the status list
    links.forEach(link => {
      const statusItem = document.createElement('div');
      statusItem.textContent = `${link.name} ${link.link}: ${getStatusText(link.link)}`;
      statusItem.classList.add(getStatusClass(link.link));
      statusListContainer.appendChild(statusItem);
    });
  }
  

  function updateChart(chart, data) {
    chart.data.labels = Array.from({ length: data.length }, (_, i) => i + 1);
    chart.data.datasets[0].data = data;
    chart.update();
  }


  async function getLinks() {
    try {
      const response = await fetch(phplink+'http://localhost:3000/getLinks');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching links:', error);
      return [];
    }
  }
  
  async function addLink(name, link) {
    try {
      const response = await fetch(phplink+'http://localhost:3000/addLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, link }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding link:', error);
      return [];
    }
  }
  
  async function removeLink(name) {
    try {
      const response = await fetch(phplink+'http://localhost:3000/removeLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing link:', error);
      return [];
    }
  }
  

  async function getLatencyData() {
    try {
      const response = await fetch(phplink+'http://localhost:3000/latencyData');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching latency data:', error);
      return {};
    }
  }

  async function getUpdateLinks () {
    // Collect and update on new links added!

    oldlinks = links;
    // Fetch and log links
    links = await getLinks();
    links = links.content;

    try {
      links = JSON.parse(links);
    } catch (error) {
      console.error('Error parsing links as JSON:', error);
    }

    //console.log('Links:', links);
  
    links.forEach(link => {

      if  (oldlinks.length > 0){
        

        const element = document.getElementById(link.link);
        if (element !== null) {
          // link card already exists
        } else {
          createCard(link);
          showToast("Website Added!");
        }


      } else {
        createCard(link);
        showToast("Website Added!");
      }

    });

    // remove old cards
    const elements = document.querySelectorAll('.card');

    // Loop over the elements and get their IDs
    elements.forEach(element => {
      const elementId = element.id;
      const idExists = links.some(dict => dict.link === elementId);
      if (idExists) {
       
      } else {
        const elementToRemove = document.getElementById(elementId);
        clearInterval(intervalIDs[elementId]);
        delete intervalIDs[elementId];
        elementToRemove.remove();
              
      
      showToast("Website Removed!", "red");
      }
    });

  };

  getUpdateLinks();
  setInterval(getUpdateLinks, timer_interval);
});


function showToast(message, color = "blue") {
  // Check if the browser supports the Notification API
  Toastify({
    text: message,
    duration: 3000,  // 3 seconds
    gravity: "bottom",  // or "bottom"
    position: "right",  // or "left", "right"
    backgroundColor: color
}).showToast();
}

function openPopup() {
  document.getElementById("popupContainer").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("popup").style.display = "none";
}