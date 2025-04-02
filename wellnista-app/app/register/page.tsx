"use client";


import TextFields from '../components/util/InputBarFill';
import Select from '../components/util/SelectChecker';
import StdSelect from '../components/std/StdSelect'



const genderName: string[] = ["ชาย", "หญิง"]
const activitiveLevel: string[] = 
["ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่", 
  "ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์", 
  "ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์", 
  "ออกกำลังกายหนัก 6-7วัน/สัปดาห์", 
  "ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา"]

export default function Register() {

  return (


    <div className="grid grid-cols-6 gap-4 md:place-content-center bg-secondary text-neutral font-garet ">

      <div className="col-span-6 text-center text-3xl font-magnolia text-primary ">
        ลงทะเบียน
      </div>

      <div className="col-span-4 text-2xl font-bold text-neutral">
        ชื่อ-นามสกุล
      </div>
      <div className="col-span-6 content-center text-center text-xl text-secondary font-bold rounded-md transition">
        <TextFields type="text"/>
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        ชื่อเล่น
      </div>
      <div className="col-span-6 content-center text-center text-xl text-secondary font-bold rounded-md transition">
        <TextFields type="text"/>

      </div>

      <div className=" col-span-6 text-2xl font-bold text-neutral">
        โรคประจำตัว (เลือกได้มากกว่า 1)
      </div>
      <div className=" col-span-6 content-left text-left text-xl text-secondary font-bold rounded-md transition">
        <Select>

        </Select>
      </div>


      <div className=" col-span-4 text-2xl font-bold text-neutral">
        ยาประจำตัว
      </div>
      <div className="col-span-6 content-center text-center text-xl text-secondary font-bold rounded-md transition">
        <TextFields type="text"/>
      </div>

      <div className=" col-span-6 text-2xl font-bold text-neutral">
        เพศ
      </div>
      <div className="col-span-6 col-start-0 text-left text-xl text-secondary font-bold rounded-md transition">
        <StdSelect names={genderName} />
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        อายุ
      </div>
      <div className="col-span-6 content-center text-center text-xl text-secondary font-bold rounded-md transition">
        <TextFields type="number"/>
      </div>

      <div className=" col-span-3 text-2xl font-bold text-neutral">
        น้ำหนัก
      </div>
      <div className=" col-span-3 text-2xl font-bold text-neutral">
        ส่วนสูง
      </div>
      <div className="col-start-1 col-end-4 content-left text-center text-xl text-secondary font-bold rounded-md transition">
        <TextFields type="number"/>
      </div>
      <div className="col-start-4 col-end-7 content-left text-center text-xl text-secondary font-bold rounded-md transition">
        <TextFields type="number"/>
      </div>

      <div className=" col-span-4 text-2xl font-bold text-neutral">
        เลือกกิจกรรม
      </div>
      <div className="col-span-6 text-left text-xl text-secondary font-bold rounded-md ">
        <StdSelect names={activitiveLevel} >
        </StdSelect>  
      </div>

      <div className="mt-20 py-3 col-start-2 col-end-6 bg-primary content-center text-center text-xl text-secondary font-bold rounded-md transition">
        ลงทะเบียน
      </div>

    </div>
  );
}