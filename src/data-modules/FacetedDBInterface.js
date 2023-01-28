/***
 * FacetedEntityList
 * 
 * For managing arrays of items, each of which has array of facets
 * 
 */

// raw is pointer to original object array
// facetNames is array [String] of facetNames
// facetIndices is array of arrays, one per facet, each having an array for each value of object indices
// objectFacets is an array, one entry per object; each entry is an array, one per facet,
//      containing indices of values
// filterValues is an array, one per facet, of values to use to filter array output
// filteredIndices is an array of indices of objects that meet filter criteria (or null if no filter values)
// filtered is object array resulting from applying filters

import { intersection } from 'underscore';

class FacetedDBInterface {

  // facetInfo is an array of
  //     facetName: {
  //        label: String, 
  //        values: [String facetNames],
  //        multi: Boolean,
  //        none: String*
  //     }
  //
  // fieldInfo is an object of { fieldName: { label: String } }
  constructor(rawData, facetInfo, fieldInfo) {
    const self = this;
    this.raw = rawData;

    // Make deep copy
    this.facetInfo = JSON.parse(JSON.stringify(facetInfo));
    let facetNames = Object.keys(facetInfo);
    this.facetNames = facetNames;

    this.fieldInfo = fieldInfo;
    let fieldNames = Object.keys(fieldInfo);
    this.fieldNames = fieldNames;
    this.fieldFilter = null;    // { fieldName: String, fieldValue: String }

    // Create arrays to store indices of objects with each facet value
    let facetIndices = [];
    let filterValues = [];
    facetNames.forEach(function(fName) {
      filterValues.push(-1); // no initial filter values
      const thisFacet = self.facetInfo[fName];
      let facetValueCount = thisFacet.values.length;
      if (thisFacet.none) {
        facetValueCount++;
      }
      let facetValueArray = [];
      for (let i=0; i<facetValueCount; i++) {
        facetValueArray.push([]);
      }
      facetIndices.push(facetValueArray);
    });
    this.facetIndices = facetIndices;
    this.filterValues = filterValues;
    this.filteredIndices = null;

    // Create cache of lowercase versions of values accessed via facet name
    let lowerCaseCache = {};
    facetNames.forEach(function(facetName) {
      const thisFacet = self.facetInfo[facetName];
      const facetValueList = thisFacet.values.map(f => f.toLowerCase());
      lowerCaseCache[facetName] = facetValueList;
    });

    // Loop through each data object; compute indices for facet values in objects
    const objectFacets = rawData.map(function(thisObj, oIndex) {
      let objFacets = [];
      facetNames.forEach(function(facetName, fIndex) {
        const thisFacet = self.facetInfo[facetName];
        const facetValueList = lowerCaseCache[facetName];
        const fArray = facetIndices[fIndex];
        // Check if the object does not have entry for this facet
        if (thisObj[facetName]) {
          // Can the facet have multiple values?
          if (thisFacet.multi) {
              const strValues = thisObj[facetName].split(',').map(item => item.trim().toLowerCase());
              let indices = [];
              strValues.forEach(function(value) {
                const vIndex = facetValueList.indexOf(value);
                if (vIndex !== -1) {
                  const vArray = fArray[vIndex];
                  vArray.push(oIndex);
                  indices.push(vIndex);
                }
              }); // forEach strValue
              if (indices.length > 0) {
                indices.sort((a,b) => a - b);
              } else {
                // If no value and we’ll be creating a "none" value, push it
                if (thisFacet.none) {
                  const noneIndex = facetValueList.length;
                  const vArray = fArray[noneIndex];
                  vArray.push(oIndex);
                  indices.push(noneIndex);
                }
              }
              objFacets.push(indices);
          } else {
            const value = thisObj[facetName].trim().toLowerCase();
            const vIndex = facetValueList.indexOf(value);
            if (vIndex !== -1) {
              const vArray = fArray[vIndex];
              vArray.push(oIndex);
              objFacets.push([vIndex]);
            } else {
              // Do we push special "none" value?
              if (thisFacet.none) {
                const noneIndex = facetValueList.length;
                const vArray = fArray[noneIndex];
                vArray.push(oIndex);
                objFacets.push([noneIndex]);
              } else {
                objFacets.push([]);
              }
            }
          }
        } else {
          // Object does not have a value for this facet -- do we push special "none" value?
          if (thisFacet.none) {
            const noneIndex = facetValueList.length;
            const vArray = fArray[noneIndex];
            vArray.push(oIndex);
            objFacets.push([facetValueList.length]);
          } else {
            objFacets.push([]);
          }
        }
      }); // forEach facet
      return objFacets;
    }); // for objects
    this.objectFacets = objectFacets;
    this.filtered = null;

    // Go through facets and add "none" value to Facet values if it is defined
    facetNames.forEach(function(facetName) {
      const thisFacet = self.facetInfo[facetName];
      if (thisFacet.none) {
        thisFacet.values.push(thisFacet.none);
      }
    });
  } // constructor

  getNumFields() {
    return this.fieldNames.length;
  }

  getFieldNames() {
    return this.fieldNames;
  }

  getFieldName(fIndex) {
    return this.fieldNames[fIndex];
  }

  getFieldLabels() {
    return this.fieldNames.map(fName => this.fieldInfo[fName].label);
  }

  getFieldLabel(fIndex) {
    const thisFieldName = this.fieldNames[fIndex];
    return this.fieldInfo[thisFieldName].label;
  }

  getFieldLabelFromName(fieldName) {
    return this.fieldInfo[fieldName].label;
  }

  getNumFacets() {
    return this.facetNames.length;
  }

  getFacetNames() {
    return this.facetNames;
  }

  getFacetName(fIndex) {
    return this.facetNames[fIndex];
  }

  getFacetLabels() {
    return this.facetNames.map(fName => this.facetInfo[fName].label);
  }

  getFacetLabel(fIndex) {
    const thisFacetName = this.facetNames[fIndex];
    return this.facetInfo[thisFacetName].label;
  }

  getNumFacetValues(facetIndex) {
    const facetName = this.facetNames[facetIndex];
    return this.facetInfo[facetName].values.length;
  }

  getFacetValues(facetIndex) {
    const facetName = this.facetNames[facetIndex];
    return this.facetInfo[facetName].values;
  }

  // facetIndex and labelIndex are 0-based
  getFacetValueAtIndex(facetIndex, labelIndex) {
    const facetName = this.facetNames[facetIndex];
    return this.facetInfo[facetName].values[labelIndex];
  }

  // RETURNS: An array as large as the facet
  // INPUT:
  //  fIndex is the index to the facet
  //  if raw is true, get counts for unfiltered data; if false, return for current filter set
  getFacetValueCounts(fIndex, raw) {
    const theseIndices = this.facetIndices[fIndex];
    if (raw) {
      let fValLengths = theseIndices.map(valArray => valArray.length);
      return fValLengths;
    } else {
      let fValLengths = theseIndices.map(function(valArray) {
        const intersect = intersection(valArray, this.filteredIndices);
        return intersect.length;
      });
      return fValLengths;
    }
  } // getFacetValueCounts()

  // RETURNS: The indices of the objects which have value fvIndex for facet fIndex
  getFacetValueIndices(fIndex, fvIndex) {
    const theseFIndices = this.facetIndices[fIndex][fvIndex];
    return this.filteredIndices ? intersection(this.filteredIndices, theseFIndices) : theseFIndices;
  } // getFacetValueIndices()

  getRawData() {
    return this.raw;
  }

  getRawItem(oIndex) {
    return this.raw[oIndex];
  }

  getRawDataField(oIndex, fieldName) {
    return this.raw[oIndex][fieldName];
  }

  getRawDataSize() {
    return this.raw.length;
  }

  // PURPOSE: Store facet value to use for filtering, but don’t actually
  setFacetFilterValue(fIndex, fValue) {
    this.filterValues[fIndex] = fValue;
    this.filteredIndices = null; // de-caching resulting indices
    this.filtered = null; // de-cache resulting array
  }

  setFieldFilter(fieldName, fieldValue) {
    this.fieldFilter = { fieldName, fieldValue };
  } // setFieldFilter()

  // RETURN: The array of values (indices) for facet fIndex of object oIndex (post-filtered value)
  getObjectFacetValues(oIndex, fIndex) {
    let useIndex = this.filteredIndices ? this.filteredIndices[oIndex] : oIndex;
    return this.objectFacets[useIndex][fIndex];
  }

  // RETURN: Array of objects given the indices for them
  getObjectsFromIndices(indices) {
    return indices.map(i => this.raw[i]);
  }

  findObjectByField(fieldName, fieldValue) {
    if (this.filteredIndices) {
      for (let i=0; i<this.filteredIndices.length; i++) {
        const oIndex = this.filteredIndices[i];
        const thisObject = this.raw[oIndex];
        if (thisObject[fieldName] === fieldValue) {
          return thisObject;
        }
      } // for i
    } else {
      for (let i=0; i<this.raw.length; i++) {
        const thisObject = this.raw[i];
        if (thisObject[fieldName] === fieldValue) {
          return thisObject;
        }
      } // for i
    }
    return null;
  } // findObjectByField()

  resetFilters() {
    this.fieldFilter = null;

    let newFilters = [];
    for (let i=0; i<this.facetNames.length; i++) {
      newFilters.push(-1);
    }
    this.filterValues = newFilters;
    this.filteredIndices = null;
    this.filtered = null;
    return this.raw;
  } // resetFilters()

  // RETURNS: The array of objects that results from applying filter values
  applyFilters() {
    const filter = this.fieldFilter;
    let hasFilters = (filter !== null && filter.fieldName !== 'none' && filter.fieldValue !== '');
    for (let fIndex=0; fIndex<this.filterValues.length; fIndex++) {
      if (this.filterValues[fIndex] !== -1) {
        hasFilters = true;
        break;
      }
    } // for

    // If there are no filters, return original raw data
    if (!hasFilters) {
      this.filteredIndices = null;
      this.filtered = this.raw;
      return this.raw;
    }

    // Otherwise, take intersection of indices of facet values
    let indices = null;
    for (let fIndex=0; fIndex<this.filterValues.length; fIndex++) {
      // filter on this value?
      const fValue = this.filterValues[fIndex];
      if (fValue !== -1) {
        const theseIndices = this.facetIndices[fIndex][fValue];
        // if no indices yet, just point to this facet value index list
        if (indices === null) {
          indices = theseIndices;
        } else {
          // get intersection between last indices and this
          indices = intersection(indices, theseIndices);
        }
      }
    } // for

    // Apply any text field filter
    if (filter !== null && filter.fieldName !== 'none' && filter.fieldValue !== '') {
      const indices2 = [];
      const lcValue = filter.fieldValue.toLowerCase();
      if (indices) {
        const self = this;
        indices.forEach(function(i) {
          const thisObj = self.raw[i];
          const objText = thisObj[filter.fieldName].toLowerCase();
          if (objText.includes(lcValue)) {
            indices2.push(i);
          }
        });
      } else {
        this.raw.forEach(function(thisObj, thisIndex) {
          const objText = thisObj[filter.fieldName].toLowerCase();
          if (objText.includes(lcValue)) {
            indices2.push(thisIndex);
          }
        })
      }
      indices = indices2;
    }

    this.filteredIndices = indices;
    // Now return copy of filtered objects
    this.filtered = indices.map(i => this.raw[i]);
    return this.filtered;
  } // applyFilters()
} // FacetedDBInterface

export default FacetedDBInterface;