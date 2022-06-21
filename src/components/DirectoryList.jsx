/***
 * DirectoryList -- List of items with faceted features
 * 
 * feList = FacetedEntityList
 * indexList = [ index of item in allItems ]
 * displayFacets = [number, ...] = indices of facets to display
 */

import React, { useState, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function DirectoryList(props) {
    const {
        feList,
        displayFacets,
        indexList,
    } = props;

    const emphasis = { fontWeight: 'bold', fontSize: '18px' };

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="facet table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={emphasis}>Name</TableCell>
                        {displayFacets.map((fIndex) => (
                            <TableCell align="left" sx={emphasis} key={`header-${fIndex}`}>{feList.getFacetName(fIndex)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {indexList.map((index, iIndex) => {
                        const item = feList.getItem(index);
                        return (
                            <TableRow key={`item-${item.name}-${index}`}>
                                <TableCell component="th" scope="row">{item.name}</TableCell>
                                {displayFacets.map((fIndex, fIIndex) => {
                                    const allFacetLabels = item.facets[fIndex].map(i => feList.getFacetLabel(fIndex,i));
                                    return (
                                        <TableCell align="left" key={`${iIndex}-${fIIndex}`}>
                                            {allFacetLabels.join(', ')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
} // DirectoryList()

export default DirectoryList;