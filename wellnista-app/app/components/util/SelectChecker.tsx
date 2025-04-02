import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';



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

const names  = [
  'เบาหวาน',
  'ไต',
  'หัวใจ',
  'ความดัน',
  'เก๊าต์',
  'ไขมัน',
  
];

export default function MultipleSelectCheckmarks() {
  const theme = createTheme({
      palette: {
        primary: {
          main: '#9F9260',
          contrastText: '#fff'
        },
        text: {
          primary: '#fff',
          secondary: '#000'
        },
        
      },
    
    });

  const [diseaseName, setDiseaseName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setDiseaseName(typeof value === 'string' ? value.split(',') : (value as string[]));
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
      <FormControl >
        <Select<string[]> sx={{ width: 400, border:2, borderColor:'#9F9260' ,color: 'text.secondary',fontSize : 22,borderRadius: 4}}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={diseaseName}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox  checked={diseaseName.includes(name)} />
              <ListItemText sx={{color: 'text.secondary',fontWeight: 500}} primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </ThemeProvider>
    </div>
  );
}