/***
 * FacetBrowser -- Display bar graphs of faceted features
 *                  Also allow search on free text
 */

import React, { useContext } from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { Group } from '@visx/group';

import { FacetContext } from '../data-modules/FacetedDBContext';

const facetLabelBGColor = '#FFD700';
const blueLight = '#ADD8E6';
const blueDark = '#1E90FF';
const yellow = '#FFFF00';
const orange = '#FFA500';

function FacetBrowser(props) {
    const [state, dispatch] = useContext(FacetContext);

    const barWidth = 250;
    const barHeight = 25;
    const barVGap = 5;
    const barHGap = 5;

    const dbInterface = state.dbInterface;

    if (dbInterface === null) {
        return <></>;
    }

    const totalDBSize = dbInterface.getRawDataSize();
    const numFacets = state.numFacets;
    const fieldNames = dbInterface.getFieldNames();

    const totalWidth = (numFacets * barWidth) + ((numFacets-1) * barHGap) + 20;
    let maxFacetEntries = 0;
    for (let fIndex=0; fIndex < numFacets; fIndex++) {
        const numLabels = dbInterface.getNumFacetValues(fIndex);
        if (numLabels > maxFacetEntries) {
            maxFacetEntries = numLabels;
        }
    }

    // Height is the size of the longest facet, inc facet title
    const totalHeight = ((maxFacetEntries + 1) * barHeight) + ((maxFacetEntries) * barVGap);

    function selectFieldName(event) {
        dispatch({ type: 'SET_FIELD_NAME', payload: { value: event.target.value }});
    }

    function setFieldValue(event) {
        dispatch({ type: 'SET_FIELD_VALUE', payload: { value: event.target.value }});
    }

    // PURPOSE: Deselect all facet values
    function clickApply() {
        dispatch({ type: 'APPLY_FILTERS' });
    } // clickReset()

    // PURPOSE: Deselect all facet values
    function clickReset() {
        dispatch({ type: 'RESET' });
    } // clickReset()

    function clickFacetValue(fIndex, fVIndex) {
        dispatch({ type: 'SET_FACET', payload: { fIndex, fVIndex } });
    } // clickFacetValue()

    return (
        <Box>
            <Stack direction="row" justifyContent="left" alignItems="center" spacing={1} sx={{ marginBottom: '4px'}}>
                <FormControl size="small">
                    <InputLabel id="select-field">Field</InputLabel>
                    <Select labelId="select-field" id="select-field" value={state.fieldName} onChange={selectFieldName}>
                        <MenuItem value="none" key="none">-- None --</MenuItem>
                        { fieldNames.map((f, fIndex) =>
                            <MenuItem value={f} key={f}>
                                { dbInterface.getFieldLabel(fIndex) }
                            </MenuItem>) }
                    </Select>
                </FormControl>
                <span> must contain </span>
                <TextField id="field-value" label="Text" size="small"
                    value={state.fieldValue} onChange={setFieldValue} />
            </Stack>
            <Box>
            <svg width={totalWidth} height={totalHeight}>
                { state.facetNames.map((fName, fIndex) => {
                    const leftPos = (fIndex * (barWidth + barHGap));
                    const fValueCounts = dbInterface.getFacetValueCounts(fIndex, true);

                    return (
                    <Group top={0} left={leftPos} key={`flabel-${fIndex}`} className="group-selectable" >
                        <rect height={barHeight} width={barWidth} y={0} x={0} stroke="black" strokeWidth="0.5"
                              fill={facetLabelBGColor} onClick={() => { clickFacetValue(fIndex, -1) }} />
                        <text x={6} y={barHeight-6} fontSize={14} fill={'black'} fillOpacity={1} textAnchor="left">
                            { dbInterface.getFacetLabel(fIndex) }
                        </text>
                        { fValueCounts.map((fCount, fVIndex) => {
                            const top = (fVIndex + 1) * (barHeight + barVGap);
                            const selectedVal = state.filterValues[fIndex];
                            return (
                                <Group className="group-selectable" key={`fValue=${fVIndex}`}
                                    onClick={() => { clickFacetValue(fIndex, fVIndex) }}
                                >
                                    <rect height={barHeight} width={barWidth} y={top} x={0} stroke="black" strokeWidth="0.5"
                                        fill={(fVIndex === selectedVal) ? yellow : blueLight}>
                                            <title>{fCount} items</title>
                                    </rect>
                                    <rect height={barHeight} width={(barWidth*fCount)/totalDBSize} y={top} x={0}
                                        fill={(fVIndex === selectedVal) ? orange : blueDark}>
                                            <title>{fCount} items</title>
                                    </rect>
                                    <text x={6} y={top+barHeight-6} fontSize={14} fill={'black'} fillOpacity={1} textAnchor="left">
                                        <title>{fCount} items</title>
                                        {dbInterface.getFacetValueAtIndex(fIndex, fVIndex)}
                                    </text>
                                </Group>
                            )
                        })}
                    </Group>
                    )
                })}
            </svg><style jsx="true">{`.group-selectable { cursor: pointer }`}</style>
            </Box>
            <ButtonGroup size="small" sx={{ margin: '4px 0px' }}>
                <Button variant="contained" onClick={clickApply} sx={{ marginRight: '4px' }}>Apply Filters</Button>
                <Button variant="contained" onClick={clickReset}>Reset Filters</Button>
            </ButtonGroup>
            <Box>
                <Typography>{ state.objects.length } items after filter applied.</Typography>
            </Box>
        </Box>
    )
} // FacetBrowser

export default FacetBrowser;