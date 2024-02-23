// script.js

document.addEventListener('DOMContentLoaded', function () {
  const port = '8085';
  const phplink = `http://localhost:${port}/proxy.php?url=`;
  const max_graph_length  = 30;
  const about_timeout = 10000; 
  const timer_interval = 10000;
  let countdown = 10; // Initial countdown value
  const maxDataSize = max_graph_length; // Adjust as needed


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


    const iconElement = document.createElement('i');
    var splitted = link.icon.split(" ")
    iconElement.classList.add(splitted[0], splitted[1] );
    iconElement.style.color  =  link.color;
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