/***
 * DirectoryList -- List of items with faceted features
 * 
 * allItems = [ { name, facets[[], ...] }, ...] = items and their facet lists
 * facetNames = [ ["", "", ...], ... ] = strings for labels for each facet; first entry is name of facet group
 * displayFacets = [number, ...] = indices of facets to display
 */

import React, { Fragment, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Group } from '@vx/group';

const blueLight = '#ADD8E6';
const blueDark = '#1E90FF';
const facetLabelBGColor = '#FFD700';

function FacetBrowser(props) {
    const {
        feList,
        displayFacets,
        indexList,
    } = props;

    const barWidth = 250;
    const barHeight = 25;
    const barVGap = 5;
    const barHGap = 5;

    const totalWidth = (displayFacets.length * barWidth) + ((displayFacets.length-1) * barHGap);
    let maxFacetEntries = 0;
    for (let fIndex=0; fIndex <displayFacets.length; fIndex++) {
        const numLabels = feList.getNumFacetLabels(fIndex);
        if (numLabels > maxFacetEntries) {
            maxFacetEntries = numLabels;
        }
    }

    // Height is the size of the longest facet, inc facet title
    const totalHeight = ((maxFacetEntries + 1) * barHeight) + ((maxFacetEntries) * barVGap);

    function clickReset() {
    } // clickReset()

    return (
        <Box>
            <ButtonGroup size="small" sx={{ margin: '4px' }}>
                <Button variant="outlined" onClick={clickReset}>Reset</Button>
            </ButtonGroup>
            <Box><svg width={totalWidth} height={totalHeight}>
                { displayFacets.map((fIndex, fIIndex) => {
                    const leftPos = (fIIndex * (barWidth + barHGap));
                    const fValueCounts = feList.getFacetValueCounts(fIndex, indexList);
                    return (
                    <Group top={0} left={leftPos} key={`flabel-${fIndex}`}>
                        <rect height={barHeight} width={barWidth} y={0} x={0}
                              fill={facetLabelBGColor} />
                        <text x={6} y={barHeight-6} fontSize={14} fill={'black'} fillOpacity={1} textAnchor="left">
                            {feList.getFacetName(fIndex)}
                        </text>
                        { fValueCounts.map((fCount, fVIndex) => {
                            const top = (fVIndex + 1) * (barHeight + barVGap);
                            return (
                                <Fragment key={`fValue=${fVIndex}`}>
                                    <rect height={barHeight} width={barWidth} y={top} x={0}
                                        fill={blueLight} />
                                    <rect height={barHeight} width={(barWidth*fCount)/indexList.length} y={top} x={0}
                                        fill={blueDark} />
                                    <text x={6} y={top+barHeight-6} fontSize={14} fill={'black'} fillOpacity={1} textAnchor="left">
                                        {feList.getFacetLabel(fIndex, fVIndex + 1)}
                                    </text>
                                </Fragment>
                            )
                        })}
                    </Group>
                    )
                })}
            </svg></Box>
        </Box>
    )
} // FacetBrowser

export default FacetBrowser;