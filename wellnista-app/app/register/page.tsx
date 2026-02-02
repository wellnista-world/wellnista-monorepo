'use client';

import { useState, } from 'react';
import { supabase } from '../lib/api/supabaseClient';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  ThemeProvider,
  FormControl,
} from '@mui/material';

import MultipleSelectCheckmarks from '../components/util/SelectChecker';
import StdSelect from '../components/std/StdSelect';
import theme from '..//components/theme/theme';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../i18n';

export interface UserData {
  name: string;
  nickname: string;
  diseases: string[];
  medicines: string;
  gender: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  activitylevel: string;
  waist?: number | null;
  national_id?: string;
  address?: string;
  family_medical_history?: string[];
  personal_carb_value?: number | null;
}

// Thai values that will be saved to database
const genderThaiValues = ['ชาย', 'หญิง'];
const activityLevelThaiValues = [
  'ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่',
  'ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์',
  'ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์',
  'ออกกำลังกายหนัก 6-7วัน/สัปดาห์',
  'ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา',
];
const diseaseThaiValues = ['เบาหวาน', 'ไต', 'หัวใจ', 'ความดัน', 'เก๊าต์', 'ไขมัน', 'อื่นๆ', 'ไม่มี'];
const familyMedicalHistoryThaiValues = ['โรคไขมันในเลือดสูง', 'โรคหัวใจและหลอดเลือด', 'โรคเบาหวาน', 'มารดาเป็นเบาหวานขณะตั้งครรภ์', 'ไม่มี'];

export default function Register() {
  const router = useRouter();
  const { t } = useI18n();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    nickname: '',
    diseases: [],
    medicines: '',
    gender: '',
    age: null,
    weight: null,
    height: null,
    activitylevel: '',
    waist: null,
    national_id: '',
    address: '',
    family_medical_history: [],
  });

  const [loading, setLoading] = useState(false);
  const [newDisease, setNewDisease] = useState("");
  const [popUp, setPopUp] = useState(false);

  // Create translated display labels
  const genderDisplayLabels = [
    t('gender.male'),
    t('gender.female')
  ];

  const activityLevelDisplayLabels = [
    t('activityLevels.sedentary'),
    t('activityLevels.lightlyActive'),
    t('activityLevels.moderatelyActive'),
    t('activityLevels.veryActive'),
    t('activityLevels.extremelyActive')
  ];

  const diseaseDisplayLabels = [
    t('diseases.diabetes'),
    t('diseases.kidney'),
    t('diseases.heart'),
    t('diseases.hypertension'),
    t('diseases.gout'),
    t('diseases.dyslipidemia'),
    t('diseases.other'),
    t('diseases.none')
  ];

  const familyMedicalHistoryDisplayLabels = [
    t('familyMedicalHistory.dyslipidemia'),
    t('familyMedicalHistory.cardiovascular'),
    t('familyMedicalHistory.diabetes'),
    t('familyMedicalHistory.gestationalDiabetes'),
    t('familyMedicalHistory.none')
  ];

  const handleInputChange = (field: keyof UserData, value: string | number | null) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDiseaseChangeValue = (values: string[]) => {
    // Convert display labels back to Thai values for database
    const thaiValues = values.map(displayLabel => {
      const index = diseaseDisplayLabels.indexOf(displayLabel);
      return index !== -1 ? diseaseThaiValues[index] : displayLabel;
    });
    
    setUserData((prev) => ({ ...prev, diseases: thaiValues }));

    if(thaiValues.includes('อื่นๆ')){
      setPopUp(true);
    }else {
      setPopUp(false);
    }
  };

  const handleGenderChange = (displayLabel: string) => {
    const index = genderDisplayLabels.indexOf(displayLabel);
    const thaiValue = index !== -1 ? genderThaiValues[index] : displayLabel;
    handleInputChange('gender', thaiValue);
  };

  const handleActivityLevelChange = (displayLabel: string) => {
    const index = activityLevelDisplayLabels.indexOf(displayLabel);
    const thaiValue = index !== -1 ? activityLevelThaiValues[index] : displayLabel;
    handleInputChange('activitylevel', thaiValue);
  };

  const handleFamilyMedicalHistoryChangeValue = (values: string[]) => {
    // Convert display labels back to Thai values for database
    const thaiValues = values.map(displayLabel => {
      const index = familyMedicalHistoryDisplayLabels.indexOf(displayLabel);
      return index !== -1 ? familyMedicalHistoryThaiValues[index] : displayLabel;
    });

    setUserData((prev) => ({ ...prev, family_medical_history: thaiValues }));
  };

  const handleAddDisease = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisease(event.target.value);
  };

  const handleBlur = () => {
    if (newDisease.trim() !== '') {
      const findIndex = userData.diseases.indexOf("อื่นๆ");
      setUserData(prevUserData => {
        const updatedDiseases = [...prevUserData.diseases];
        if (findIndex !== -1) {
          updatedDiseases[findIndex] = prevUserData.diseases[findIndex] + ' ' + newDisease.trim();
        } else {
          updatedDiseases.push(newDisease.trim());
        }
        return { ...prevUserData, diseases: updatedDiseases };
      });
    }
    console.log(userData.diseases);
  }

  const handleSubmit = async () => {
    setLoading(true);
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert(t('auth.notLoggedIn'));
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('users').update({
      ...userData,
    }).eq('user_id', user.id);

    if (error) {
      console.error('Error inserting data:', error);
      alert(t('auth.registrationError'));
    } else {
      alert(t('auth.registrationSuccess'));
      router.push('/home');
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <Typography className="text-2xl font-bold text-primary mb-1">
            {t('register.title')}
          </Typography>
          <Typography className="text-sm text-neutral/70">
            {t('register.subtitle')}
          </Typography>
        </div>

        {/* Registration Form */}
        <div className="max-w-md mx-auto space-y-4">
          <TextField
            id="outlined-basic"
            label={t('register.fullName')}
            fullWidth
            variant="outlined"
            value={userData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />

          <TextField
            label={t('register.nickname')}
            fullWidth
            variant="outlined"
            value={userData.nickname}
            onChange={(e) => handleInputChange('nickname', e.target.value)}
          />

          <TextField
            label={t('register.nationalId')}
            fullWidth
            variant="outlined"
            value={userData.national_id}
            onChange={(e) => handleInputChange('national_id', e.target.value)}
          />

          <TextField
            label={t('register.address')}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={userData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />

          <FormControl fullWidth>
            <MultipleSelectCheckmarks 
              labelInput={t('register.diseases')} 
              names={diseaseDisplayLabels} 
              onChangeValue={handleDiseaseChangeValue} 
            />
          </FormControl>

          { popUp &&(
              <TextField
              label={t('register.otherDiseases')}
              fullWidth
              variant='outlined'
              value={newDisease}
              onChange={handleAddDisease}
              onBlur={handleBlur}
            />
          ) }
          

          <TextField
            label={t('register.medicines')}
            fullWidth
            variant="outlined"
            value={userData.medicines}
            onChange={(e) => handleInputChange('medicines', e.target.value)}
          />
     
          <StdSelect 
            label={t('register.gender')} 
            names={genderDisplayLabels} 
            onChangeValue={handleGenderChange} 
          />

          <TextField
            label={t('register.age')}
            fullWidth
            type="number"
            value={userData.age ?? ''}
            onChange={(e) => handleInputChange('age', e.target.value === '' ? null : Number(e.target.value))}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={t('register.weight')}
              type="number"
              value={userData.weight ?? ''}
              onChange={(e) => handleInputChange('weight', e.target.value === '' ? null : Number(e.target.value))}
            />
            <TextField
              label={t('register.height')}
              type="number"
              value={userData.height ?? ''}
              onChange={(e) => handleInputChange('height', e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>

          <TextField
            label={t('register.waist')}
            fullWidth
            type="number"
            value={userData.waist ?? ''}
            onChange={(e) => handleInputChange('waist', e.target.value === '' ? null : Number(e.target.value))}
          />

          <StdSelect
            label={t('register.activityLevel')}
            names={activityLevelDisplayLabels}
            onChangeValue={handleActivityLevelChange}
          />

          <FormControl fullWidth>
            <MultipleSelectCheckmarks
              labelInput={t('register.familyMedicalHistory')}
              names={familyMedicalHistoryDisplayLabels}
              onChangeValue={handleFamilyMedicalHistoryChangeValue}
            />
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            className="!bg-primary hover:!bg-accent !text-white mt-4 rounded-full font-semibold"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : t('register.submit')}
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
