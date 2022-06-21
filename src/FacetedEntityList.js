/***
 * FacetedEntityList
 * 
 * For managing arrays of items, each of which has array of facets
 * 
 * facetNames is array of arrays; [fIndex][0] = name of facet
 * itemArray is array of { item: String, facets: [[], [], …]}
 */

class FacetedEntityList {
    constructor(facetNames, itemArray) {
        this.facets = facetNames;
        this.items = itemArray;
    }

    getNumFacets() {
        return this.facets.length;
    }

    getFacetName(fIndex) {
        return this.facets[fIndex][0];
    }

    getNumFacetLabels(facetIndex) {
        return this.facets[facetIndex].length - 1;
    }

    // FacetIndex is 0-based, labelIndex is 1-based (because 0 is name of facet group)
    getFacetLabel(facetIndex, labelIndex) {
        return this.facets[facetIndex][labelIndex];
    }

    getItem(index) {
        return this.items[index];
    }

    // RETURNS An array as large as the facet;
    //          For each facet value, give the number of items (in indexList) with that facet value
    getFacetValueCounts(fIndex, indexList) {
        const items = this.items;
        const thisFacet = this.facets[fIndex];
        const facetCount = thisFacet.length - 1;
        let fCounts = new Array(facetCount).fill(0);

        indexList.forEach(function(iIndex) {
            const thisItem = items[iIndex];
            const itsFacets = thisItem.facets[fIndex];
            itsFacets.forEach(function(fValue) {
                fCounts[fValue - 1] += 1;
            });
        });
        return fCounts;
    } // getFacetValueCounts()
} // FacetedEntityList()

export default FacetedEntityList;