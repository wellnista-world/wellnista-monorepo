'use client';

import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, SelectChangeEvent, ThemeProvider, createTheme, OutlinedInput } from '@mui/material';
import { useI18n } from '../../../i18n';

interface StdSelectProds {
  names: string[];
  labelInput: string;
  onChangeValue: (value: string[]) => void;
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

const theme = createTheme({
  palette: {
    text: {
      primary: '#000',
      
    },

  },

});

const MultipleSelectCheckmarks: React.FC<StdSelectProds> = ({ names, labelInput, onChangeValue }) => {
  const { t } = useI18n();
  const [diseaseName, setDiseaseName] = useState<string[]>([]);
  

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setDiseaseName(typeof value === 'string' ? value.split(',') : (value as string[]));

    if (onChangeValue) {
      onChangeValue(typeof value === 'string' ? value.split(',') : (value as string[]));
    }
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormControl fullWidth className="font-garet ">
          <InputLabel id="demo-multiple-checkbox-label" sx={{color: "#707070"}}>{t('profile.diseases')}</InputLabel>
          <Select<string[]>
            className="hover:outline-neutral-950"
            variant='outlined'
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={diseaseName}
            onChange={handleChange}
            input={<OutlinedInput label={labelInput} />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}

            sx={{
              color: 'text.primary', // ✅ เปลี่ยนเป็นดำ
            }}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={diseaseName.includes(name)} />
                <ListItemText sx={{ color: 'text.primary', fontWeight: 500 }} primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ThemeProvider>
    </div>
  );
}

export default MultipleSelectCheckmarks;