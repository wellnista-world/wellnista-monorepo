"use client";

import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Register() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    return (
      
    
    <div className="grid grid-cols-6 gap-4 md:place-content-center bg-secondary text-neutral font-garet ">
      
      <div className="col-span-6 text-center text-3xl font-magnolia text-primary ">
        ลงทะเบียน
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">
        ชื่อ-นามสกุล
      </div>
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input name
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        ชื่อเล่น
      </div>
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input name
      </div>

      <div className=" col-span-6 text-2xl font-bold text-neutral">
        โรคประจำตัว (เลือกได้มากกว่า 1)
      </div>
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        เบาหวาน
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        ไต
      </div>
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        ความดัน
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        ไขมัน
      </div>
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        หัวใจ
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        เก๊าต์
      </div> 
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        อื่นๆ
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        ยาประจำตัว
      </div>
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input name
      </div>  

      <div className=" col-span-6 text-2xl font-bold text-neutral">
        เพศ
      </div>
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        ชาย
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        หญิง
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        อายุ
      </div>
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input name
      </div>
      
      <div className=" col-span-3 text-2xl font-bold text-neutral">
        น้ำหนัก
      </div>
      <div className=" col-span-3 text-2xl font-bold text-neutral">
        ส่วนสูง
      </div>
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input 
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        input
      </div>  

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        เลือกกิจกรรม
      </div>
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
      </div>  
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        กิจกรรมปานกลาง
      </div> 
      <div className="py-3 col-span-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        กิจกรรมเบา
      </div> 

      <div className=" col-span-3 text-2xl font-bold text-neutral">
        BMI
      </div>
      <div className=" col-span-3 text-2xl font-bold text-neutral">
        IBW
      </div>
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        var
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        var
      </div> 

      <div className=" col-span-3 text-2xl font-bold text-neutral">
        แคลอรี่
      </div>
      <div className=" col-span-3 text-2xl font-bold text-neutral">
        คาร์บ
      </div>
      <div className="py-3 col-start-1 col-end-4 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
         var
      </div>
      <div className="py-3 col-start-4 col-end-7 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        var
      </div> 

      <div className="mt-20 py-3 col-start-2 col-end-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        ลงทะเบียน
      </div>
    
    </div>
  );
}