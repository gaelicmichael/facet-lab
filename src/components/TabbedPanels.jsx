/***
 * The Tabbed Panels for main displays of Explorer
 */

import React from 'react';

import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

//====================================================
// Objects, Modules and Components defined by this App

import DirectoryList from '../components/DirectoryList.jsx';
import FacetBrowser from '../components/FacetBrowser';
import VisualizerPanel from '../components/VisualizerPanel';

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
  { field: 'composer_first_name', headerName: 'Author', width: 150, headerClassName: 'data-table-theme' },
  { field: 'composer_last_name', headerName: 'Surname', width: 150, headerClassName: 'data-table-theme' },
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
          <Typography>This is an experimental dashboard for the <a href="https://languageinlyrics.com"><i>Language In Lyrics</i></a> database that provides flexible filtering and
          visualization capabilities. It allowa you to explore the information in complex and creative ways.</Typography>
          <Typography>I (Michael Newton) designed and implemented this dashboard,
          inspired by my previous work on the <i>Prospect</i> Digital Humanities Collaboratory, which I created during my tenure as Technical Lead at the UNC Digital Innovation Lab.</Typography>
          <ul>
            <li>First, click on the <b>Filter</b> tab and click the combination of features of the data in which you are interested.
            If you click a facet title (at the top of the column), it will deselect any selection you have made in that column. You can also filter by
            a text field. Click the <b>Apply Filters</b> button at the bottom of the page to apply all filter conditions.</li>
            <li>If you click on the <b>Results</b> tab, you can scroll through all of the records that have passed the conditions of
            the facet and text filters you have selected.</li>
            <li>Click the <b>Visualize</b> tab to explore patterns in the resulting data using a Treemap visualization. If you hover over
            a tile, a tooltip will appear to indicate what facet value combination it represents.</li>
          </ul>
          <Typography>This web application is implemented in the React framework, making use of the Material UI component library and the Visx data visualization library. The source code is
          available on <a href="https://github.com/gaelicmichael/facet-lab">this GitHub repository</a>.</Typography>
          <Typography>Thanks to Stephen Barrett for adding needed functionality to the <i>LIL</i> API.</Typography>
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <FacetBrowser />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <DirectoryList colDefs={tableColumns} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <VisualizerPanel />
      </TabPanel>
    </Box>
  )
} // TabbedPanels()

export default TabbedPanels;