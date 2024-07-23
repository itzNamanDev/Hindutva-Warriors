async function getWebhookUrl() {
  // Fetch the environment variable from the .env file
  const response = await fetch('/env.json');
  const data = await response.json();
  return data.WEBHOOK_URL;
}

function getIPAddress() {
  // Use a fetch request to get the IP address
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(async data => {
      // Extract the IP address
      const ipAddress = data.ip;
      // Send the IP address to your server
      const webhookUrl = await getWebhookUrl();
      if (webhookUrl) {
        sendToServer(ipAddress, webhookUrl);
      }
    })
    .catch(error => {
      console.error("Error getting IP address:", error);
    });
}

function sendToServer(ipAddress, webhookUrl) {
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: `New visitor: ${ipAddress}` })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  })
  .catch(error => {
    console.error("Error sending IP to server:", error);
  });
}

// Call the getIPAddress function when the page loads
window.onload = getIPAddress;
