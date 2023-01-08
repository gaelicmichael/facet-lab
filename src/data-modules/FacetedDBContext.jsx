// This Context is used to handling the asynchronous loading of data, selecting filtering facets and
//  outputing results

import React, { useReducer, createContext } from "react";

export const FacetContext = createContext();

export const initialFacetedDBContext = {
  dbInterface: null,
  numFacets: 0,
  facetNames: [],
  filterValues: [],
  objects: [],
}

const reducer = (state, action) => {
  const dbInterface = state.dbInterface;
  let newFilterValues;

  switch(action.type) {
  case 'SET_FILTER':
    const { fIndex, fVIndex } = action.payload;
    newFilterValues = state.filterValues.slice();
    // To toggle value
    if (newFilterValues[fIndex] === fVIndex) {
      newFilterValues[fIndex] = -1;
      dbInterface.setFacetFilterValue(fIndex, -1);
    } else {
      newFilterValues[fIndex] = fVIndex;
      dbInterface.setFacetFilterValue(fIndex, fVIndex);
    }
    const newObjects = dbInterface.applyFilters();
    return { ...state, filterValues: newFilterValues, objects: newObjects };

  case 'RESET':
    newFilterValues = [];
    for (let i=0; i<state.numFacets; i++) { newFilterValues.push(-1); }
    const originalObjs = dbInterface.resetFilters();
    return { ...state, filterValues: newFilterValues, objects: originalObjs };

  default:
    throw new Error();
  }
} // reducer

export function FacetedDBProvider(props) {
  const [state, dispatch] = useReducer(reducer, props.initialState);

  return (
    <FacetContext.Provider value={[state, dispatch]}>
      {props.children}
    </FacetContext.Provider>
  );
};
