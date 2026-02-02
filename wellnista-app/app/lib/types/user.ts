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