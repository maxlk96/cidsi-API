const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

let cachedVatsimData = null; // To store the VATSIM data
let lastFetchTime = 0; // To track the last time data was fetched

// Helper function to load and parse the callsigns.txt file
const loadCallsigns = () => {
  const filePath = path.join(__dirname, 'callsigns.txt');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  
  const callsigns = fileData.split('\n').map(line => {
    const fields = line.split(':');
    return {
      fullCallsign: fields[0], // Full callsign
      si: fields[3],           // SI (4th field)
      frequency: fields[2],    // Frequency (to be matched with VATSIM frequency)
      shortCallsign: fields[5], // Short callsign (6th field)
      type: fields[6],         // Type (7th field, GND/TWR/CTR/etc.)
    };
  });

  return callsigns;
};

// Helper function to match VATSIM data with local callsigns data
const matchPositions = (vatsimData, callsignData) => {
  return vatsimData.controllers
    .map(controller => {
      // Find matching entry in callsigns.txt based on callsign and frequency
      const match = callsignData.find(callsignEntry => {
        return (
          controller.callsign.includes(callsignEntry.shortCallsign) &&
          controller.callsign.includes(callsignEntry.type) &&
          controller.frequency === callsignEntry.frequency
        );
      });

      // If a match is found, return the 'cid' and the SI (4th field from callsigns.txt)
      if (match) {
        return {
          cid: controller.cid,
          si: match.si, // Extract the correct SI field (4th field)
        };
      }
      return null;
    })
    .filter(position => position !== null); // Filter out null matches
};

// Function to fetch VATSIM data (called every 15 seconds)
const fetchVatsimData = async () => {
  try {
    const response = await axios.get('https://data.vatsim.net/v3/vatsim-data.json');
    cachedVatsimData = response.data; // Cache the data
    lastFetchTime = Date.now(); // Update the last fetch time
    console.log('VATSIM data updated');
  } catch (error) {
    console.error('Error fetching VATSIM data:', error);
  }
};

// Fetch VATSIM data every 15 seconds
setInterval(fetchVatsimData, 15000);

// Initially load the data
fetchVatsimData();

// Route for fetching the matching positions
app.get('/vatsim-matches', async (req, res) => {
  try {
    // Load callsigns from file
    const callsignData = loadCallsigns();

    // Ensure VATSIM data is available
    if (!cachedVatsimData) {
      return res.status(503).json({ error: 'VATSIM data not yet available, please try again in a few seconds' });
    }

    // Match positions
    const matchedPositions = matchPositions(cachedVatsimData, callsignData);

    // Send the matched positions as the API response
    res.json(matchedPositions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
