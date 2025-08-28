'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/context/AuthContext';
import { supabase } from '../lib/api/supabaseClient';
import { UserData } from '../lib/types/user';
import { MenuRecommendation } from '../lib/api/menu-recommendation';
import { useI18n } from '../../i18n';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { 
  Utensils, 
  Clock, 
  ChefHat, 
  Users, 
  Heart, 
  AlertTriangle,
  ArrowLeft,
  ShoppingBag,
  Info,
  ChevronRight
} from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const proteinOptions = [
  { id: 'pork', color: 'bg-[#FF6B6B]' },
  { id: 'chicken', color: 'bg-[#4ECDC4]' },
  { id: 'fish', color: 'bg-[#45B7D1]' },
];

export default function MenuScreen() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<MenuRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'result'>('select');

  // Fetch user data on component mount
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchUserData = async () => {
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProteinSelect = async (protein: string) => {
    if (!userData?.diseases || userData.diseases.length === 0) {
      alert(t('menu.noDiseasesData'));
      return;
    }

    setSelectedProtein(protein);
    setLoading(true);

    try {
      const response = await fetch('/api/menu-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protein: t(`menu.${protein}`),
          diseases: userData.diseases,
          language: t('common.locale') || 'th'
        }),
      });

      const result = await response.json();

      if (response.ok && result) {
        setRecommendation(result);
        setStep('result');
      } else {
        alert(t('menu.recommendationError'));
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      alert(t('menu.recommendationError'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => {
    setStep('select');
    setSelectedProtein(null);
    setRecommendation(null);
  };

  const handleGoToMarket = () => {
    router.push('/market');
  };

  if (step === 'result' && recommendation) {
    return (
      <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToSelection}
            className="flex items-center gap-2 text-primary hover:text-accent transition"
          >
            <ArrowLeft size={20} />
            <Typography variant="h6">{t('menu.backToSelection')}</Typography>
          </button>
          <Typography variant="h5" className="font-bold text-primary">
            {t('menu.recommendedMenu')}
          </Typography>
          <div className="w-24"></div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* User Conditions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Typography variant="h6" className="font-semibold text-primary mb-4">
              {t('menu.suitableFor')}
            </Typography>
            <div className="flex flex-wrap gap-2">
              {userData?.diseases?.map((disease, index) => (
                <Chip
                  key={index}
                  label={disease}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </div>
          </div>

          {/* Recommended Dish */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <Typography variant="h4" className="font-bold text-primary mb-2">
                {recommendation.dish_name}
              </Typography>
              <Typography variant="subtitle1" className="text-neutral/70">
                {recommendation.dish_name_en}
              </Typography>
            </div>

            <Typography variant="body1" className="mb-6 text-center">
              {recommendation.description}
            </Typography>

            {/* Nutritional Information */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-secondary/5 rounded-xl">
                <Typography variant="h5" className="font-bold text-primary">
                  {recommendation.nutritional_info.calories}
                </Typography>
                <Typography variant="caption" className="text-neutral/70">
                  {t('menu.calories')}
                </Typography>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-xl">
                <Typography variant="h5" className="font-bold text-primary">
                  {recommendation.nutritional_info.protein}g
                </Typography>
                <Typography variant="caption" className="text-neutral/70">
                  {t('menu.protein')}
                </Typography>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-xl">
                <Typography variant="h5" className="font-bold text-primary">
                  {recommendation.nutritional_info.carbs}g
                </Typography>
                <Typography variant="caption" className="text-neutral/70">
                  {t('menu.carbs')}
                </Typography>
              </div>
            </div>

            {/* Cooking Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-xl">
                <Clock size={20} className="text-primary" />
                <div>
                  <Typography variant="caption" className="text-neutral/70">
                    {t('menu.cookingTime')}
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {recommendation.cooking_time}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-xl">
                <ChefHat size={20} className="text-primary" />
                <div>
                  <Typography variant="caption" className="text-neutral/70">
                    {t('menu.difficulty')}
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {recommendation.difficulty}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-xl">
                <Users size={20} className="text-primary" />
                <div>
                  <Typography variant="caption" className="text-neutral/70">
                    {t('menu.servingSize')}
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {recommendation.serving_size}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <Typography variant="h6" className="font-semibold text-primary mb-4">
                {t('menu.ingredients')}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendation.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/5 rounded-xl">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <Typography variant="body2">{ingredient}</Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking Method */}
            <div className="mb-6">
              <Typography variant="h6" className="font-semibold text-primary mb-4">
                {t('menu.cookingMethod')}
              </Typography>
              <div className="p-4 bg-secondary/5 rounded-xl">
                <Typography variant="body2" className="text-neutral/80">
                  {recommendation.cooking_method}
                </Typography>
              </div>
            </div>

            {/* Health Benefits */}
            <div className="mb-6">
              <Typography variant="h6" className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Heart size={20} />
                {t('menu.healthBenefits')}
              </Typography>
              <div className="space-y-3">
                {recommendation.health_benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <Typography variant="body2">{benefit}</Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Considerations */}
            {recommendation.dietary_considerations.length > 0 && (
              <div className="mb-6">
                <Typography variant="h6" className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  {t('menu.dietaryConsiderations')}
                </Typography>
                <div className="space-y-3">
                  {recommendation.dietary_considerations.map((consideration, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <Typography variant="body2">{consideration}</Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Market Link */}
          <div 
            onClick={handleGoToMarket}
            className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-lg hover:bg-primary/5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <ShoppingBag size={28} className="text-primary" />
              <div>
                <Typography className="text-xl font-bold text-primary">
                  {t('menu.diseaseSpecificFood')}
                </Typography>
                <Typography className="text-sm text-neutral/70">
                  {t('menu.wellnistaMarket')}
                </Typography>
              </div>
            </div>
            <ChevronRight size={24} className="text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Typography variant="h4" className="font-bold text-primary mb-2">
          {t('menu.whatToEat')}
        </Typography>
        <Typography variant="h6" className="text-accent">
          Wellnista
        </Typography>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Protein Selection */}
        <div className="mb-8">
          <Typography variant="h6" className="font-bold text-primary mb-4 pb-4">
            {t('menu.selectProtein')}
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proteinOptions.map((protein) => (
              <div
                key={protein.id}
                onClick={() => handleProteinSelect(protein.id)}
                className={`bg-white rounded-2xl p-8 h-40 flex items-center justify-center shadow-lg hover:opacity-90 transition-all cursor-pointer`}
              >
                <div className="text-3xl text-primary text-center">
                  {t(`menu.${protein.id}`)}
                </div>
              </div>
            ))}
          </div>

          {/* Loading Modal */}
          <Dialog 
            open={loading} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              style: {
                borderRadius: '16px',
                backgroundColor: 'white',
              }
            }}
          >
            <DialogContent className="p-8 text-center">
              <CircularProgress size={60} className="mb-4" />
              <Typography variant="h6" className="text-primary">
                {t('menu.generatingRecommendation')}
              </Typography>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Health Info */}
        {userData && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Typography variant="h6" className="font-semibold text-primary mb-4 flex items-center gap-2">
              <Info size={20} />
              {t('menu.yourHealthInfo')}
            </Typography>
            
            {userData.diseases && userData.diseases.length > 0 ? (
              <div>
                <Typography variant="body2" className="text-neutral/70 mb-3">
                  {t('menu.weWillConsider')}:
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {userData.diseases.map((disease, index) => (
                    <Chip
                      key={index}
                      label={disease}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Typography variant="body2" className="text-neutral/70">
                {t('menu.noHealthData')}
              </Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
