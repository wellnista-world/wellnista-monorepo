'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n } from '../../i18n';
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  AlertTitle,
} from '@mui/material';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Save, 
  BarChart3, 
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/api/supabaseClient';
import { useAuth } from '../lib/context/AuthContext';
import { isMentalHealthTrackingEnabled } from '../../config/featureFlags';
import MentalHealthChart from '../components/util/MentalHealthChart';

interface MentalHealthRecord {
  id: string;
  user_id: string;
  date: string;
  time: string;
  transcript: string;
  mental_score: number;
  mood_category: string;
  stress_level: number;
  anxiety_level: number;
  depression_level: number;
  notes?: string;
  created_at: string;
}

interface MentalHealthAnalysis {
  mental_score: number;
  mood_category: string;
  stress_level: number;
  anxiety_level: number;
  depression_level: number;
  summary: string;
  recommendations: string[];
}

export default function MentalHealthPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MentalHealthAnalysis | null>(null);
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState<MentalHealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mental_health_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError(t('mentalHealth.fetchError'));
    } finally {
      setIsLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user, fetchRecords]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'th-TH'; // Default to Thai, can be made dynamic

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript + ' ');
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setError(t('mentalHealth.recordingError'));
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [t]);

  // Check if feature is enabled
  if (!isMentalHealthTrackingEnabled()) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="text-gray-600 mb-2">
                {t('mentalHealth.featureDisabled')}
              </Typography>
              <Typography className="text-gray-500">
                {t('mentalHealth.featureDisabledDescription')}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const startRecording = () => {
    if (!recognitionRef.current) {
      setError(t('mentalHealth.speechNotSupported'));
      return;
    }

    setTranscript('');
    setError(null);
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsPaused(false);
    }
  };

  const analyzeTranscript = async () => {
    if (!transcript.trim()) {
      setError(t('mentalHealth.noTranscript'));
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-mental-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          language: 'th' // Can be made dynamic based on user preference
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysisResult(data);
      } else {
        throw new Error(data.error || t('mentalHealth.analysisError'));
      }
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      setError(t('mentalHealth.analysisError'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveRecord = async () => {
    if (!user || !analysisResult) {
      setError(t('mentalHealth.noAnalysisData'));
      return;
    }

    try {
      const { error } = await supabase
        .from('mental_health_records')
        .insert({
          user_id: user.id,
          date: selectedDate,
          time: selectedTime,
          transcript: transcript.trim(),
          mental_score: analysisResult.mental_score,
          mood_category: analysisResult.mood_category,
          stress_level: analysisResult.stress_level,
          anxiety_level: analysisResult.anxiety_level,
          depression_level: analysisResult.depression_level,
          notes: notes.trim() || null
        });

      if (error) throw error;

      setSuccess(t('mentalHealth.recordSaved'));
      setTranscript('');
      setAnalysisResult(null);
      setNotes('');
      fetchRecords();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving record:', error);
      setError(t('mentalHealth.saveError'));
    }
  };

  const getMoodColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const lastRecord = records[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <CircularProgress className="mb-4" />
              <Typography className="text-gray-600">{t('mentalHealth.loading')}</Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Typography variant="h3" className="font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            {t('mentalHealth.title')}
          </Typography>
          <Typography className="text-gray-600">{t('mentalHealth.description')}</Typography>
        </div>

        {/* Last Record Summary */}
        {lastRecord && (
          <Card>
            <CardContent>
              <Typography variant="h6" className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5" />
                {t('mentalHealth.lastRecord')}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(lastRecord.mental_score)}`}>
                    {lastRecord.mental_score}
                  </div>
                  <div className="text-sm text-gray-600">{t('mentalHealth.mentalScore')}</div>
                </div>
                <div className="text-center">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(lastRecord.mood_category)}`}>
                    {t(`mentalHealth.moodCategories.${lastRecord.mood_category}`)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{t('mentalHealth.mood')}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">
                    {new Date(lastRecord.date).toLocaleDateString()} {lastRecord.time}
                  </div>
                  <div className="text-sm text-gray-500">{t('mentalHealth.dateTime')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Recording Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" className="flex items-center gap-2 mb-4">
              <Mic className="h-5 w-5" />
              {t('mentalHealth.voiceRecording')}
            </Typography>
            <div className="space-y-4">
            {/* Recording Controls */}
            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  variant="contained"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={!recognitionRef.current}
                  startIcon={<Mic className="h-4 w-4" />}
                >
                  {t('mentalHealth.startRecording')}
                </Button>
              ) : (
                <div className="flex gap-2">
                  {!isPaused ? (
                    <Button
                      onClick={pauseRecording}
                      variant="outlined"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                      startIcon={<Pause className="h-4 w-4" />}
                    >
                      {t('mentalHealth.pause')}
                    </Button>
                  ) : (
                    <Button
                      onClick={resumeRecording}
                      variant="contained"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      startIcon={<Play className="h-4 w-4" />}
                    >
                      {t('mentalHealth.resume')}
                    </Button>
                  )}
                  <Button
                    onClick={stopRecording}
                    variant="outlined"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    startIcon={<MicOff className="h-4 w-4" />}
                  >
                    {t('mentalHealth.stopRecording')}
                  </Button>
                </div>
              )}
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  {t('mentalHealth.recording')}
                </div>
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="space-y-4">
                <div>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t('mentalHealth.transcript')}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder={t('mentalHealth.transcriptPlaceholder')}
                    className="bg-white"
                  />
                </div>

                <Button
                  onClick={analyzeTranscript}
                  disabled={isAnalyzing || !transcript.trim()}
                  variant="contained"
                  fullWidth
                  startIcon={isAnalyzing ? <CircularProgress size={20} /> : <Brain className="h-4 w-4" />}
                >
                  {isAnalyzing ? t('mentalHealth.analyzing') : t('mentalHealth.analyzeTranscript')}
                </Button>
              </div>
            )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <Card>
            <CardContent>
              <Typography variant="h6" className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5" />
                {t('mentalHealth.analysisResults')}
              </Typography>
              <div className="space-y-4">
              {/* Mental Score */}
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(analysisResult.mental_score)}`}>
                  {analysisResult.mental_score}
                </div>
                <div className="text-lg text-gray-600">{t('mentalHealth.mentalScore')}</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium mt-2 ${getMoodColor(analysisResult.mood_category)}`}>
                  {t(`mentalHealth.moodCategories.${analysisResult.mood_category}`)}
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysisResult.stress_level}
                  </div>
                  <div className="text-sm text-gray-600">{t('mentalHealth.stressLevel')}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisResult.anxiety_level}
                  </div>
                  <div className="text-sm text-gray-600">{t('mentalHealth.anxietyLevel')}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResult.depression_level}
                  </div>
                  <div className="text-sm text-gray-600">{t('mentalHealth.depressionLevel')}</div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <Typography className="text-sm font-medium mb-2">{t('mentalHealth.summary')}</Typography>
                <Typography className="text-gray-700">{analysisResult.summary}</Typography>
              </div>

              {/* Recommendations */}
              <div>
                <Typography className="text-sm font-medium mb-2">{t('mentalHealth.recommendations')}</Typography>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Additional Notes */}
              <div>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('mentalHealth.additionalNotes')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('mentalHealth.notesPlaceholder')}
                  className="bg-white"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  type="date"
                  label={t('mentalHealth.date')}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="time"
                  label={t('mentalHealth.time')}
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="bg-white"
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={saveRecord}
                variant="contained"
                fullWidth
                className="bg-blue-600 hover:bg-blue-700 text-white"
                startIcon={<Save className="h-4 w-4" />}
              >
                {t('mentalHealth.saveRecord')}
              </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        {records.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5" />
                {t('mentalHealth.mentalHealthTrends')}
              </Typography>
              <MentalHealthChart records={records} />
            </CardContent>
          </Card>
        )}

        {/* Error and Success Messages */}
        {error && (
          <Alert severity="error" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            {success}
          </Alert>
        )}
      </div>
    </div>
  );
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
