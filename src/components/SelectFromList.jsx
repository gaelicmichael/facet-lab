import React, { useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectFromList({ name, label, values, valueSetter, defIndex }) {
    const [value, setValue] = useState(defIndex);
    
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
  