/***
 * NOTES
 *    Details about using context https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
 ***/

import React, { useEffect, useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

//===========================
// Custom components and code

import { FacetedDBProvider, initialFacetedDBContext } from './data-modules/FacetedDBContext';
import FacetedDBInterface from './data-modules/FacetedDBInterface';
import TabbedPanels from './components/TabbedPanels';

//===============================
// App Visualization Data
const verseMetres = [
"One line verse",
"One line verse / Three line chorus",
"One line verse / Split chorus",
"Two line verse",
"Two line verse / Two line chorus",
"Two line verse / Three line chorus",
"Two line verse / Four line chorus",
"Two line verse / Woven",
"Three line verse",
"Three line verse / Two line chorus",
"Three line verse / Three line chorus",
"Three line verse / Four line chorus",
"Three line verse / Woven",
"Four line verse",
"Four line verse / Two line chorus",
"Four line verse / Three line chorus",
"Four line verse / Four line chorus",
"Four line verse / Five line chorus",
"Five line verse",
"Six line verse",
"Six line verse / Two line chorus",
"Six line verse / Three line chorus",
"Six line verse / Four line chorus",
"Seven line verse",
"Eight line verse",
"Eight line verse / Four line chorus",
"Eight line verse / Eight line chorus",
"Nine line verse",
"Ten line verse",
"Twelve line verse",
"Sixteen line verse",
"Woven",
"Split chorus",
"Woven / Split chorus",
];

const facetDescriptors = {
  'place_of_origin': { label: 'Origin', multi: false, values: ["Nova Scotia", "Scotland"] },
  'composer_gender': { label: 'Composer Gender', multi: false, values: ["Male", "Female"] },
  'original_format': { label: 'Media', multi: false, values:
    ["Manuscript", "Newspaper Clipping", "Publication", "Sound Recording"] },
  'structure': { label: 'Metre', multi: false, values: verseMetres },
  classifications: { label: 'Classifications', multi: true, values: 
  ["Ballad", "Bawdy", "Clapping", "Complaint", "Dialogue", "Drinking", "Elegy", "Exile",
  "Flyting", "Historical", "Homeland", "Humorous", "Instructive", "Lament", "Local events and characters",
  "Love", "Lullaby", "Macaronic", "Milling", "Nature", "Pibroch", "Political", "Port-a-beul", "Praise",
  "Rann / Duan", "Religious", "Sailing", "Satire", "Spiritual", "Supernatural", "Work"
  ] },
};

const fieldDescriptors = {
  title: { label: "Title" },
  'first_line_chorus': { label: "Chorus 1st line" },
  'first_line_verse': { label: "Verse 1st line" },
  subjects: { label: "Subjects" },
  'composer_first_name': { label: "Composer 1st Name" },
  'composer_last_name':  { label: "Composer Last Name" },
  community: { label: "Community" },
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

const theme = createTheme({
});

const apiCall = "https://dasg.ac.uk/LIL/ajax.php?action=browseRecords&search=&sort=&order=&offset=0&limit=7000&searchStrings=&searchFields=&booleans=&params=&getText=n&format=json";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialState, setInitialState] = useState(initialFacetedDBContext);

  function getDataFromAPI() {
console.log("Calling fetch");
    fetch(apiCall)
      .then((response) => response.json())
      .then(function(data) {
        let newState = Object.assign({}, initialState);
        const dbInterface = new FacetedDBInterface(data.rows, facetDescriptors, fieldDescriptors);
        newState.dbInterface = dbInterface;
        newState.facetNames = dbInterface.getFacetNames();
        const numFacets = dbInterface.getNumFacets();
        newState.numFacets = numFacets;
        let filterValues = [];
        for (let i=0; i<numFacets; i++) { filterValues.push(-1); }
        newState.filterValues = filterValues;
        newState.objects = dbInterface.getRawData();
        setInitialState(newState);
        setIsLoading(false);
      })
      .catch(function(error) { console.log('Data fetch request failed: ', error) });
  } // getDataFromAPI()

  useEffect(getDataFromAPI, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={topTitleStyle}>
        Language In Lyrics Explorer
      </Box>
      { isLoading &&
        <Box sx={centerLoadingStyle}>
          <Typography sx={messageStyle}>Loading and Processing Song Meta-Data</Typography>
          <Typography>(This could take a while)</Typography>
          <CircularProgress />
        </Box>
      }
      { !isLoading &&
        <FacetedDBProvider initialState={initialState}>
          <TabbedPanels />
        </FacetedDBProvider>
      }
    </ThemeProvider>
  );
} // App

export default App;
