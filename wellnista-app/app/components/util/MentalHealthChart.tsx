'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';

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

interface MentalHealthChartProps {
  records: MentalHealthRecord[];
  onEdit?: (record: MentalHealthRecord) => void;
  onDelete?: (recordId: string) => void;
}

export default function MentalHealthChart({ 
  records, 
  onEdit, 
  onDelete 
}: MentalHealthChartProps) {
  if (!records || records.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Typography variant="h6" className="text-gray-600 mb-2">
            No Mental Health Data
          </Typography>
          <Typography className="text-gray-500">
            Start recording your thoughts to see your mental health trends.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getMoodNumericValue = (category: string): number => {
    switch (category) {
      case 'excellent': return 5;
      case 'good': return 4;
      case 'fair': return 3;
      case 'poor': return 2;
      case 'critical': return 1;
      default: return 3;
    }
  };

  // Prepare data for the chart
  const chartData = records
    .slice()
    .reverse()
    .map((record, index) => ({
      ...record,
      date: new Date(record.date).toLocaleDateString(),
      day: index + 1,
      mood_numeric: getMoodNumericValue(record.mood_category)
    }));

  // Calculate averages
  const avgMentalScore = Math.round(
    records.reduce((sum, record) => sum + record.mental_score, 0) / records.length
  );
  const avgStress = Math.round(
    records.reduce((sum, record) => sum + record.stress_level, 0) / records.length
  );
  const avgAnxiety = Math.round(
    records.reduce((sum, record) => sum + record.anxiety_level, 0) / records.length
  );
  // const avgDepression = Math.round(
  //   records.reduce((sum, record) => sum + record.depression_level, 0) / records.length
  // );

  // Get trend direction
  const recentScores = records.slice(0, 3).map(r => r.mental_score);
  const olderScores = records.slice(-3).map(r => r.mental_score);
  const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
  const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';

  const getMoodColor = (category: string) => {
    switch (category) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  };

  interface TooltipPayload {
    payload: {
      mental_score: number;
      mood_category: string;
      stress_level: number;
      anxiety_level: number;
      depression_level: number;
    };
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Date: ${label}`}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="font-medium">Mental Score:</span>{' '}
              <span style={{ color: getScoreColor(data.mental_score) }}>
                {data.mental_score}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Mood:</span>{' '}
              <span style={{ color: getMoodColor(data.mood_category) }}>
                {data.mood_category}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Stress:</span> {data.stress_level}
            </p>
            <p className="text-sm">
              <span className="font-medium">Anxiety:</span> {data.anxiety_level}
            </p>
            <p className="text-sm">
              <span className="font-medium">Depression:</span> {data.depression_level}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Mental Score</p>
                <p className="text-2xl font-bold" style={{ color: getScoreColor(avgMentalScore) }}>
                  {avgMentalScore}
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Stress</p>
                <p className="text-2xl font-bold text-orange-600">{avgStress}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Anxiety</p>
                <p className="text-2xl font-bold text-purple-600">{avgAnxiety}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trend</p>
                <p className={`text-sm font-semibold ${
                  trend === 'improving' ? 'text-green-600' : 
                  trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend.charAt(0).toUpperCase() + trend.slice(1)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mental Health Score Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            Mental Health Score Trend
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={80} stroke="#10b981" strokeDasharray="5 5" label="Good" />
              <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="5 5" label="Fair" />
              <ReferenceLine y={40} stroke="#f97316" strokeDasharray="5 5" label="Poor" />
              <Line
                type="monotone"
                dataKey="mental_score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Mental Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5" />
            Detailed Mental Health Metrics
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="stress_level"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                name="Stress Level"
              />
              <Line
                type="monotone"
                dataKey="anxiety_level"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 3 }}
                name="Anxiety Level"
              />
              <Line
                type="monotone"
                dataKey="depression_level"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                name="Depression Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="mb-4">Recent Records</Typography>
          <div className="space-y-3">
            {records.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getScoreColor(record.mental_score) }}
                    />
                    <div>
                      <p className="font-medium">
                        {new Date(record.date).toLocaleDateString()} {record.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {record.mental_score} | Mood: {record.mood_category}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onEdit(record)}
                      startIcon={<Edit className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onDelete(record.id)}
                      className="text-red-600 hover:text-red-700"
                      startIcon={<Trash2 className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
