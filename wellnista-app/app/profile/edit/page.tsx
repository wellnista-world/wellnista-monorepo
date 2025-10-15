"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/context/AuthContext";
import { supabase } from "../../lib/api/supabaseClient";
import { UserData } from "../../lib/types/user";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowLeft, Save, User, Heart, Activity } from "lucide-react";
import { useI18n } from "../../../i18n";

const activityLevels = [
  "ไม่ออกกำลังกาย/นั่งทำงานอยู่กับที่",
  "ออกกำลังกายเล็กน้อย 1-3วัน/สัปดาห์",
  "ออกกำลังกายปานกลาง 4-5วัน/สัปดาห์",
  "ออกกำลังกายหนัก 6-7วัน/สัปดาห์",
  "ออกกำลังกายหนักมาก 2 ครั้ง/วัน เป็นนักกีฬา",
];

const diseaseOptions = [
  "เบาหวาน",
  "ไต",
  "หัวใจ",
  "ความดัน",
  "เก๊าต์",
  "ไขมัน",
  "อื่นๆ",
  "ไม่มี",
];

const genderOptions = ["ชาย", "หญิง"];

export default function EditProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    name: "",
    nickname: "",
    diseases: [],
    medicines: "",
    gender: "",
    age: null,
    weight: null,
    height: null,
    activitylevel: "",
    waist: null,
  });

  // Fetch user data on component mount
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        setUserData(data);
        setFormData({
          name: data.name || "",
          nickname: data.nickname || "",
          diseases: data.diseases || [],
          medicines: data.medicines || "",
          gender: data.gender || "",
          age: data.age || null,
          weight: data.weight || null,
          height: data.height || null,
          activitylevel: data.activitylevel || "",
          waist: data.waist || null,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (field: keyof UserData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiseaseToggle = (disease: string) => {
    setFormData(prev => {
      const currentDiseases = prev.diseases || [];
      const updatedDiseases = currentDiseases.includes(disease)
        ? currentDiseases.filter(d => d !== disease)
        : [...currentDiseases, disease];
      
      return {
        ...prev,
        diseases: updatedDiseases
      };
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          nickname: formData.nickname,
          diseases: formData.diseases,
          medicines: formData.medicines,
          gender: formData.gender,
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          activitylevel: formData.activitylevel,
          waist: formData.waist,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating user data:", error);
        alert("Failed to save profile. Please try again.");
        return;
      }

      alert("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-primary hover:text-accent transition"
        >
          <ArrowLeft size={20} />
          <Typography variant="h6">{t('profile.backToProfile')}</Typography>
        </button>
        <Typography variant="h5" className="font-bold text-primary">
          {t('profile.editProfile')}
        </Typography>
        <div className="w-24"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-primary" size={24} />
            <Typography variant="h6" className="font-semibold text-primary">
              {t('profile.basicInfo')}
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label={t('profile.name')}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              label={t('profile.nickname')}
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              variant="outlined"
            />
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-primary" size={24} />
            <Typography variant="h6" className="font-semibold text-primary">
              {t('profile.healthInfo')}
            </Typography>
          </div>

          {/* Diseases */}
          <div className="mb-4">
            <Typography variant="subtitle1" className="mb-2 font-medium">
              {t('profile.diseases')}
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {diseaseOptions.map((disease) => (
                <FormControlLabel
                  key={disease}
                  control={
                    <Checkbox
                      checked={formData.diseases?.includes(disease) || false}
                      onChange={() => handleDiseaseToggle(disease)}
                      color="primary"
                    />
                  }
                  label={disease}
                  className="text-sm"
                />
              ))}
            </div>
          </div>

          {/* Medicines */}
          <TextField
            fullWidth
            label={t('profile.medicines')}
            value={formData.medicines}
            onChange={(e) => handleInputChange('medicines', e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            placeholder={t('profile.medicinesPlaceholder')}
          />
        </div>

        {/* Physical Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-primary" size={24} />
            <Typography variant="h6" className="font-semibold text-primary">
              {t('profile.physicalInfo')}
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>{t('profile.gender')}</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                label={t('profile.gender')}
              >
                {genderOptions.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={t('profile.age')}
              type="number"
              value={formData.age || ""}
              onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
              variant="outlined"
              inputProps={{ min: 1, max: 120 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <TextField
              fullWidth
              label={t('profile.weight')}
              type="number"
              value={formData.weight || ""}
              onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : null)}
              variant="outlined"
              inputProps={{ min: 20, max: 300, step: 0.1 }}
              InputProps={{
                endAdornment: <Typography variant="caption">kg</Typography>
              }}
            />

            <TextField
              fullWidth
              label={t('profile.height')}
              type="number"
              value={formData.height || ""}
              onChange={(e) => handleInputChange('height', e.target.value ? parseFloat(e.target.value) : null)}
              variant="outlined"
              inputProps={{ min: 100, max: 250, step: 0.1 }}
              InputProps={{
                endAdornment: <Typography variant="caption">cm</Typography>
              }}
            />

            <TextField
              fullWidth
              label={t('profile.waist')}
              type="number"
              value={formData.waist || ""}
              onChange={(e) => handleInputChange('waist', e.target.value ? parseFloat(e.target.value) : null)}
              variant="outlined"
              inputProps={{ min: 50, max: 200, step: 0.1 }}
              InputProps={{
                endAdornment: <Typography variant="caption">cm</Typography>
              }}
            />
          </div>

          {/* Activity Level */}
          <div className="mt-4">
            <FormControl fullWidth>
              <InputLabel>{t('profile.activityLevel')}</InputLabel>
              <Select
                value={formData.activitylevel}
                onChange={(e) => handleInputChange('activitylevel', e.target.value)}
                label={t('profile.activityLevel')}
              >
                {activityLevels.map((level, index) => (
                  <MenuItem key={index} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="outlined"
            onClick={handleCancel}
            className="px-8"
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <Save size={20} />}
            className="px-8"
          >
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
