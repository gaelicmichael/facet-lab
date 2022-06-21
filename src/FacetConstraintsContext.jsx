import React, { useReducer, createContext } from "react";

export const FacetContext = createContext();

const reducer = (state, action) => {
  switch(action.type) {
  case 'SET_ACTIVE':
    return { ...state, active: action.payload };
  case 'SET_CURRENT':
    return { ...state, current: action.payload };
  default:
    throw new Error();
  }
}

export function FacetContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, props.initialState);

  return (
    <FacetContext.Provider value={[state, dispatch]}>
      {props.children}
    </FacetContext.Provider>
  );
};
