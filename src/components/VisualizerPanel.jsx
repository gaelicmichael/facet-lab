
import React, { useContext, useState } from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Group } from '@visx/group';
import Pie from '@visx/shape/lib/shapes/Pie';
import { Treemap, hierarchy, stratify, treemapSquarify } from '@visx/hierarchy';

import { intersection } from 'underscore';

import { FacetContext } from '../data-modules/FacetedDBContext';
import SelectFromList from './SelectFromList';

const background = '#114b5f';

const colorPalette16 = [
    "#f44336", "#2196f3", "#8bc34a", "#e81e63",
    "#673ab7", "#03a9f4", "#4caf50", "#9c27b0",
    "#ffeb3b", "#ffc107", "#ff9800", "#009688",
    "#ff5722", "#00bcd4", "#3f51b5", "#cddc39",
];

const vizTypes = ["Pie Chart", "Treemap"];

const width = 900;
const height = 600;
const pieRadius = (height / 2) - 20;
const centerX = width / 2;
const centerY = height / 2;

function VisualizerPanel() {
    const [state] = useContext(FacetContext);
    const dbInterface = state.dbInterface;
    const facetLabels = dbInterface.getFacetLabels();

    const [vizType, setVizType] = useState(vizTypes[0]);
    const [treeRoot, setTreeRoot] = useState(null);
    const [facet1, setFacet1] = useState(0);
    const [facet2, setFacet2] = useState(1);
    const [pieData, setPieData] = useState(null);
    const [pFacet, setPFacet] = useState(0);

    function createViz() {
      switch(vizType) {
      case "Pie Chart":
        let newPieData = [];
        let maxSize = 0;
        const fValues = dbInterface.getFacetValues(pFacet);
        fValues.forEach(function(fVal, fValIndex) {
          const fIndices = dbInterface.getFacetValueIndices(pFacet, fValIndex);
          const fSize = fIndices.length;
          maxSize = (fSize > maxSize) ? fSize : maxSize;
          newPieData.push({ label: fVal, size: fSize });
        });
        setTreeRoot(null);
        setPieData(newPieData);
        break;
      case "Treemap":
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
        setPieData(null);
        setTreeRoot(newRoot);
        break;
      } // switch
    } // createViz()

    function _setVizType(vIndex) {
      setVizType(vizTypes[vIndex]);
    }

    return (
      <>
        <Typography>Visualising items filtered by {state.filterDesc}</Typography>
        <Stack direction="row" justifyContent="left" alignItems="center">
          <SelectFromList name="vizType" label="Visualisation" values={vizTypes} valueSetter={_setVizType} defIndex={0} />
          { (vizType === "Pie Chart") && (
            <>
              <SelectFromList name="pFacet" label="Facet" values={facetLabels} valueSetter={setPFacet} defIndex={pFacet} />
            </>
          )}
          { (vizType === "Treemap") && (
            <>
              <SelectFromList name="facet1" label="Facet 1" values={facetLabels} valueSetter={setFacet1} defIndex={facet1} />
              <SelectFromList name="facet2" label="Facet 2" values={facetLabels} valueSetter={setFacet2} defIndex={facet2} />
            </>
          )}
          <Button size="small" variant="contained" onClick={createViz} sx={{ padding: '6px' }}>
            Create {vizType}
          </Button>
        </Stack>
        <svg width={width} height={height}>
          <rect width={width} height={height} rx={8} fill={background} />
          { (treeRoot !== null) &&
            <Treemap top={0} root={treeRoot} size={[width, height]} tile={treemapSquarify} round>
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
          }
          { (pieData !== null) &&
            <Group top={centerY} left={centerX}>
              <Pie data={pieData} pieValue={(p) => p.size} pieSortValues={() => -1} outerRadius={pieRadius}>
                {(pie) =>
                pie.arcs.map((arc, index) => {
                  const { label } = arc.data;
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
                  const arcPath = pie.path(arc);
                  const arcFill = colorPalette16[index & 15];
                  return (
                    <g key={`arc-${label}`}>
                      <path d={arcPath} fill={arcFill}>
                        <title>{ arc.data.label + ': ' + arc.data.size }</title>
                      </path>
                        { hasSpaceForLabel && (
                          <text x={centroidX} y={centroidY} dy=".33em" fill="black"
                            fontSize={14} textAnchor="middle" pointerEvents="none">
                            { arc.data.label }
                          </text>
                        )}
                    </g>
                  )
                })
              }
            </Pie>
          </Group>
          }
        </svg>
      </>
    )
} // VisualizerPanel()
  
export default VisualizerPanel;
