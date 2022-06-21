/***
 * Horizontal Timelines
 * 
 * NOTES
 *    Technique of using reducer with Context from https://www.sitepoint.com/replace-redux-react-hooks-context-api/
 *    See also https://medium.com/simply/state-management-with-react-hooks-and-context-api-at-10-lines-of-code-baf6be8302c
 ***/

import React, { Fragment } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

//====================================================
// Objects, Modules and Components defined by this App

import FacetedEntityList from './FacetedEntityList.js';
import DirectoryList from './components/DirectoryList.jsx';
import FacetBrowser from './components/FacetBrowser';

//====
// Render switch

const componentRender = {
    dList: "DirectoryList",
    fBrowser: "FacetBrowser",
}


//===============================
// Temp data

const facetNames = [
  ['Gender', 'Male', 'Female', 'Unknown', 'Non-Binary'],
  ['Age Group', '0-5', '5-18', '18-35', '35+'],
  ['Languages', 'English', 'Spanish', 'Gaelic', 'Chinese']
];
const itemList = [
  { name: 'Róisín', facets: [[2], [2], [1, 2, 3]] },
  { name: 'Mìcheal', facets: [[1], [4], [1, 3]]},
  { name: 'Xing', facets: [[3], [3], [1, 4]]},
  { name: 'Zander', facets: [[4], [1], [2, 4]]},
  { name: 'Fred', facets: [[4], [3], [1]]},
];
const facetsToDisplay = [0, 1, 2];
let indexList = Array(itemList.length).fill().map((_, i) => i);

const itemsObject = new FacetedEntityList(facetNames, itemList);


function App() {
  const [activeComp, setActiveComp] = React.useState('DirectoryList');

  function changeActiveComp(event) {
    setActiveComp(event.target.value);
  }

  return (
    <Fragment>
          <AppBar position="static">
            <Toolbar variant="dense">
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" component="div">
                Faceted Items
              </Typography>
              <FormControl sx={{ marginLeft: '20px' }}>
                <RadioGroup row defaultValue="DirectoryList" name="radio-buttons-group" value={activeComp} onChange={changeActiveComp}>
                  <FormControlLabel value="DirectoryList" control={<Radio />} label="DirectoryList" />
                  <FormControlLabel value="FacetBrowser" control={<Radio />} label="FacetBrowser" />
                </RadioGroup>
              </FormControl>
              {activeComp}
            </Toolbar>
          </AppBar>
          {{ 
              [componentRender.dList]: <DirectoryList feList={itemsObject} displayFacets={facetsToDisplay} indexList={indexList} />,
              [componentRender.fBrowser]: <FacetBrowser feList={itemsObject} displayFacets={facetsToDisplay} indexList={indexList} />,
          }[activeComp]}
    </Fragment>
  );
} // App

export default App;
