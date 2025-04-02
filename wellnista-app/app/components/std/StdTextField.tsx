import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';

interface InputBarProbs {
    type: string;
    onChange?: (value: string) => void;
  }

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
       // marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        type: 'number',
        borderRadius: 4,
        position: 'relative',
        
        border: '2px solid',
        borderColor: '#9F9260',
        fontSize: 22,
        //width: 'full',
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
    },
}));
const StdTextField: React.FC<InputBarProbs> = ({ type, onChange }) => {

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (onChange) {
          onChange(value);
        }
      };
    
  
    const getType = (inputIype: string) => {
      switch (inputIype) {
        case "number":
          return "number"   
        case "text":
          return "text"
      }
    };
  
    return (
        <Box
            component="form"
            noValidate
            //sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2 }}
        >
            <FormControl variant="standard">
                <BootstrapInput type={getType(type)} onChange={handleChange}  />
            </FormControl>

        </Box>
      
    );
  };

export default StdTextField ;
    