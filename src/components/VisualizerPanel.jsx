
import React, { useContext, useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Group } from '@visx/group';
import { Treemap, hierarchy, stratify, treemapSquarify } from '@visx/hierarchy';

import { intersection } from 'underscore';

import { FacetContext } from '../data-modules/FacetedDBContext';

const background = '#114b5f';

const colorPalette16 = [
    "#f44336", "#2196f3", "#8bc34a", "#e81e63", "#9c27b0",
    "#673ab7", "#3f51b5", "#03a9f4","#009688", "#4caf50",
    "#cddc39", "#ffeb3b", "#ffc107", "#ff9800",
    "#ff5722", "#00bcd4",
];

const width = 800;
const height = 600;

function SelectFromList({ name, label, values, valueSetter, defIndex }) {
  const [value, setValue] = React.useState(defIndex);
  
  function selectValue(event) {
    setValue(event.target.value);
    valueSetter(event.target.value);
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id={"select-facet-"+name}>{label}</InputLabel>
      <Select labelId={"select-facet-"+name} id={"select-facet-"+name}
        value={value} label={label} onChange={selectValue}
      >
        { values.map((v, vIndex) => <MenuItem value={vIndex} key={`${name}-${vIndex}`}>{v}</MenuItem>) }
      </Select>
    </FormControl>
  )
} // SelectFromList()

function VisualizerPanel() {
    const [state] = useContext(FacetContext);
    const dbInterface = state.dbInterface;
    const facetLabels = dbInterface.getFacetLabels();

    const [facet1, setFacet1] = useState(0);
    const [facet2, setFacet2] = useState(1);
    const [root, setRoot] = useState(null);
    // const [colorScale, setColorScale] = useState(null);

    function createViz() {
        console.log(`starting createViz with ${facet1}, ${facet2}`);
        let newData = [{ id: "-1", label: '', parent: null, size: 0, a2: -1 }];
        const f1Values = dbInterface.getFacetValues(facet1);
        const f2Values = dbInterface.getFacetValues(facet2);
        // Create entries for all of facet 1 values
        f1Values.forEach(function(f1Val, f1ValIndex) {
            newData.push({ id: `${f1ValIndex}`, label: f1Val, parent: -1, size: 0, a2: -1 });
        });
        let cntr = f1Values.length;
        // Create intersections 
        f1Values.forEach(function(f1Val, f1ValIndex) {
            const f1Indices = dbInterface.getFacetValueIndices(facet1, f1ValIndex);
            f2Values.forEach(function(f2Val, f2ValIndex) {
                const f2Indices = dbInterface.getFacetValueIndices(facet2, f2ValIndex);
                const inCommon = intersection(f1Indices, f2Indices);
                newData.push({ id: `${cntr++}`, label: `${f1Val} + ${f2Val}: ${inCommon.length}`, parent: f1ValIndex,
                    size: inCommon.length, a2: f2ValIndex });
            });
        });
        const stratData = stratify()
            .id((d) => d.id)
            .parentId((d) => d.parent)(newData)
            .sum((d) => d.size);
        const newRoot = hierarchy(stratData)
            .sort((a, b) => b.value - a.value);
        setRoot(newRoot);
    } // createViz()

    return (
      <>
        <Stack direction="row" justifyContent="left" alignItems="center">
            <SelectFromList name="att1" label="Attribute 1" values={facetLabels} valueSetter={setFacet1} defIndex={0} />
            <SelectFromList name="att2" label="Attribute 2" values={facetLabels} valueSetter={setFacet2} defIndex={1} />
            <Button size="small" variant="contained" onClick={createViz} sx={{ padding: '6px' }}>
                  Create Visualization
            </Button>
        </Stack>
        { (root !== null) &&
          <svg width={width} height={height}>
            <rect width={width} height={height} rx={8} fill={background} />
            <Treemap top={0} root={root} size={[width, height]} tile={treemapSquarify} round>
              {(treemap) => (
                <Group>
                  { treemap.descendants().map((node, i) => {
                    const nodeWidth = node.x1 - node.x0;
                    const nodeHeight = node.y1 - node.y0;
                    return (
                    <Group key={`node-${i}`} top={node.y0} left={node.x0}>
                      { node.depth === 1 && (
                        <rect width={nodeWidth} height={nodeHeight} stroke={background}
                          strokeWidth={1} fill="transparent" />
                      )}
                      { node.depth > 1 && (
                        <rect width={nodeWidth} height={nodeHeight} stroke={background}
                          fill={colorPalette16[node.data.data.a2 & 15]}>
                            <title>{node.data.data.label}</title>
                        </rect>
                      )}
                    </Group>
                  )})}
                </Group>
            )}
          </Treemap>
        </svg>}
      </>
    )
} // VisualizerPanel()
  
export default VisualizerPanel;
