// This Context is used to handling the asynchronous loading of data, selecting filtering facets and
//  outputing results

import React, { useReducer, createContext } from "react";

export const FacetContext = createContext();

const noFilterDesc = '(All data, no filters applied)';

export const initialFacetedDBContext = {
  dbInterface: null,
  numFacets: 0,
  facetNames: [],
  filterValues: [],
  objects: [],
  fieldName: 'none',
  fieldValue: '',
  filterDesc: noFilterDesc,
}

const reducer = (state, action) => {
  const dbInterface = state.dbInterface;
  let newFilterValues;

  switch(action.type) {
  case 'SET_FACET':
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
    return { ...state, filterValues: newFilterValues };

  case 'SET_FIELD_NAME':
    const fieldName = action.payload.value;
    dbInterface.setFieldFilter(fieldName, state.fieldValue);
    return { ...state, fieldName };

  case 'SET_FIELD_VALUE':
    const fieldValue = action.payload.value;
    dbInterface.setFieldFilter(state.fieldName, fieldValue);
    return { ...state, fieldValue };
  
  case 'APPLY_FILTERS':
    const newObjects = dbInterface.applyFilters();
    // Create the string that describes the current filters
    let newDesc = '';
    state.filterValues.forEach(function(fV, fVIndex) {
      if (fV !== -1) {
        if (newDesc.length > 0) {
          newDesc += ', ';
        }
        newDesc += dbInterface.getFacetLabel(fVIndex) + ' = ' + dbInterface.getFacetValueAtIndex(fVIndex, fV);
      }
    });
    if (state.fieldName !== 'none' && state.fieldValue !== '') {
      if (newDesc.length > 0) {
        newDesc += ', ';
      }
      newDesc += dbInterface.getFieldLabelFromName(state.fieldName) + ' = ' + state.fieldValue;
    }
    if (newDesc === '') {
      newDesc = noFilterDesc;
    }
    return { ...state, objects: newObjects, filterDesc: newDesc };

  case 'RESET':
    newFilterValues = [];
    for (let i=0; i<state.numFacets; i++) { newFilterValues.push(-1); }
    const originalObjs = dbInterface.resetFilters();
    return { ...state, filterValues: newFilterValues, objects: originalObjs,
      fieldName: 'none', fieldValue: '', filterDesc: '(All data, no filters applied)',
    };

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
