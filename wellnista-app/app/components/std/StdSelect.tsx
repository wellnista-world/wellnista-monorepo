import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface StdSelectProds {
  names: string[];
  label: string;
  onChangeValue?: (value: string) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
      bgColor: '#9F9260',
    },
  },
};

const StdSelect: React.FC<StdSelectProds> = ({ names,label, onChangeValue }) => {
  const theme = createTheme({
    palette: {
     
      text: {
        primary: '#000',
        
      },
    },
  });

  const [name, setName] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setName(value);
    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
      <FormControl fullWidth className="font-garet">
      <InputLabel id="demo-multiple-checkbox-label" sx={{color: "#707070" }}>{label}</InputLabel>
        <Select 
          variant='outlined'
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          //multiple
          value={name}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              
              <ListItemText sx={{color: 'text.primary',fontWeight: 500}} primary={name} />
            </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ThemeProvider>
    </div>
  );
};

export default StdSelect;
