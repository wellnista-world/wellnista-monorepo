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
} 