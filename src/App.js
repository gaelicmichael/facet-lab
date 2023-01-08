/***
 * NOTES
 *    Details about using context https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
 ***/

import React, { Fragment, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

//===========================
// Custom components and code

import { FacetedDBProvider } from './data-modules/FacetedDBContext';
import FacetedDBInterface from './data-modules/FacetedDBInterface';
import TabbedPanels from './components/TabbedPanels';

//===============================
// App Visualization Data
<option value="Work">Work</option>

const facetDescriptors = {
  classifications: { label: 'Classifications', multi: true, values: 
    ["Ballad", "Bawdy", "Clapping", "Complaint", "Dialogue", "Drinking", "Elegy", "Exile",
    "Flyting", "Historical", "Homeland", "Humorous", "Instructive", "Lament", "Local events and characters",
    "Love", "Lullaby", "Macaronic", "Milling", "Nature", "Pibroch", "Political", "Port-a-beul", "Praise",
    "Rann / Duan", "Religious", "Sailing", "Satire", "Spiritual", "Supernatural", "Work"
    ] },
  'place_of_origin': { label: 'Origin', multi: false, values: ["Nova Scotia", "Scotland"] },
  'original_format': { label: 'Media', multi: false, values:
    ["Manuscript", "Newspaper Clipping", "Publication", "Sound Recording"] }
};

const topTitleStyle = {
  width: "100%",
  padding: "8px",
  bgcolor: "#ADD8E6",
  fontWeight: 600,
  fontSize: "24px",
}

const centerLoadingStyle = {
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}

const messageStyle = {
  marginBottom: "10px",
}

const apiCall = "https://dasg.ac.uk/LIL/ajax.php?action=browseRecords&search=&sort=&order=&offset=0&limit=7000&searchStrings=&searchFields=&booleans=&params=&getText=n&format=json";

function App() {
  const [facetedDB, setFacetedDB] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(getDataFromAPI, []);

  function getDataFromAPI() {
console.log("Calling fetch");
    fetch(apiCall)
      .then((response) => response.json())
      .then(function(data) {
        const dbInterface = new FacetedDBInterface(data.rows, facetDescriptors);
        const numFacets = dbInterface.getNumFacets();
        const facetNames = dbInterface.getFacetNames();
        let filterValues = [];
        for (let i=0; i<numFacets; i++) { filterValues.push(-1); }
        const objects = dbInterface.getRawData();
        setFacetedDB({ dbInterface, numFacets, facetNames, filterValues, objects });
        setIsLoading(false);
      })
      .catch(function(error) { console.log('Data fetch request failed: ', error) });
  } // getDataFromAPI()

  return (
    <Fragment>
      <Box sx={topTitleStyle}>
        Language In Lyrics Explorer
      </Box>
      { isLoading &&
        <Box sx={centerLoadingStyle}>
          <Typography sx={messageStyle}>Loading and Processing Song Meta-Data</Typography>
          <CircularProgress />
        </Box>
      }
      { !isLoading &&
        <FacetedDBProvider initialState={facetedDB}>
          <TabbedPanels />
        </FacetedDBProvider>
      }
    </Fragment>
  );
} // App

export default App;
