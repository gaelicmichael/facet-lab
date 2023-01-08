/***
 * DirectoryList -- List of items with faceted features
 *
 */

import React, { useContext, useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import { FacetContext } from '../data-modules/FacetedDBContext';
import DialogOpenRecord from './DialogOpenRecord';

const dataTableTheme = {
    flexGrow: 1,
    '& .data-table-theme': {
        backgroundColor: '#1E90FF',
        color: 'black',
        fontSize: '18px',
        border: '1px darkGrey solid',
    },
    '& .data-table-theme__row': {
        backgroundColor: '#ADD8E6',
    },
}

function DirectoryList(props) {
  const {
    colDefs,
  } = props;

  const [state] = useContext(FacetContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIDs, setSelectedIDs] = useState(null);

  function clickRows(ids) {
    setSelectedIDs(ids);
  } // clickRows()

  function clickOpen() {
    setDialogOpen(true);
  } // clickOpen()

  function closeDialog() {
    setDialogOpen(false);
  }

  return (
    <>
        <Stack direction="row" spacing={2}>
            <Button sx={{ margin: '6px' }} variant="contained" onClick={clickOpen} disabled={selectedIDs === null}>
                Examine Selected Title
            </Button>
        </Stack>
        <div style={{ display: 'flex', height: '550px' }}>
            <Box sx={ dataTableTheme }>
                <DataGrid getRowId={(row) => row.ai} columns={colDefs} rows={state.objects}
                    rowsPerPageOptions={[10]} pageSize={10}
                    getRowClassName={(params) => "data-table-theme__row"}
                    onSelectionModelChange={clickRows}
                />
            </Box>
        </div>
        <DialogOpenRecord open={dialogOpen} handleClose={closeDialog} ids={selectedIDs} />
    </>
  )
} // DirectoryList()

export default DirectoryList;
