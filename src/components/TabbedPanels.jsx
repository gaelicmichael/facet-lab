/***
 * The Tabbed Panels for main displays of Explorer
 */

import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

//====================================================
// Objects, Modules and Components defined by this App

import DirectoryList from '../components/DirectoryList.jsx';
import FacetBrowser from '../components/FacetBrowser';

//=============================
// Tab components

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
// }

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

//=================================
// Params to pass to Tables

const tableColumns = [
  { field: 'title', headerName: 'Title', width: 350, headerClassName: 'data-table-theme' },
  { field: 'first_line_verse', headerName: 'First Line', width: 450, headerClassName: 'data-table-theme' },
  { field: 'composer_first_name', headerName: 'Author', width: 120, headerClassName: 'data-table-theme' },
  { field: 'composer_last_name', headerName: 'Surname', width: 120, headerClassName: 'data-table-theme' },
];

function TabbedPanels(props) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="About" {...a11yProps(0)} />
          <Tab label="Filter" {...a11yProps(1)} />
          <Tab label="Results" {...a11yProps(2)} />
          <Tab label="Visualize" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Box>
          This is an experimental front-end for the <a href="https://languageinlyrics.com"><i>Language In Lyrics</i></a> database that provides flexible filtering and
          visualization capabilities to allow you to explore the information in complex and creative ways. This dashboard was designed and implemented by Michael Newton.
          Thanks to Stephen Barrett for adding needed functionality to the <i>LIL</i> API.
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <FacetBrowser />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <DirectoryList colDefs={tableColumns} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <Box>
          Visualization will go here.          
        </Box>
      </TabPanel>
    </Box>
  )
} // TabbedPanels()

export default TabbedPanels;