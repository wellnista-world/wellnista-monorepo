'use client';

import { useI18n } from '../../../i18n';
import Typography from '@mui/material/Typography';
import { BookOpen, ExternalLink } from 'lucide-react';

interface KnowledgeTopic {
  key: string;
  url: string;
  icon: React.ReactNode;
}

export default function LibraryPage() {
  const { t } = useI18n();

  const knowledgeTopics: KnowledgeTopic[] = [
    {
      key: 'carbs',
      url: 'https://www.pobpad.com/%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%9A%E0%B9%82%E0%B8%AE%E0%B8%B4%E0%B9%80%E0%B8%94%E0%B8%A3%E0%B8%95',
      icon: <BookOpen size={24} />
    },
    {
      key: 'protein',
      url: 'https://www.pobpad.com/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%99',
      icon: <BookOpen size={24} />
    },
    {
      key: 'foodExchange',
      url: 'https://www.pobpad.com/%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%81%E0%B8%9B%E0%B8%A5%E0%B9%88%E0%B8%87%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B9%80%E0%B8%9A%E0%B8%B2%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99',
      icon: <BookOpen size={24} />
    },
    {
      key: 'sodium',
      url: 'https://www.pobpad.com/%E0%B9%82%E0%B8%8B%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A1',
      icon: <BookOpen size={24} />
    },
  ];

  const handleTopicClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <Typography className="text-2xl font-bold text-primary mb-1">
          {t('knowledge.title')}
        </Typography>
        <Typography className="text-sm text-neutral/70">
          {t('knowledge.subtitle')}
        </Typography>
      </div>

      {/* Knowledge Topics Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {knowledgeTopics.map((topic) => (
          <div
            key={topic.key}
            onClick={() => handleTopicClick(topic.url)}
            className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm hover:bg-primary/5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {topic.icon}
              </div>
              <div>
                <Typography className="font-semibold text-primary">
                  {t(`knowledge.topics.${topic.key}.title`)}
                </Typography>
                <Typography className="text-sm text-neutral/70">
                  {t(`knowledge.topics.${topic.key}.description`)}
                </Typography>
              </div>
            </div>
            <ExternalLink size={20} className="text-primary" />
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <Typography variant="h6" className="font-semibold text-primary mb-3">
          {t('knowledge.library')}
        </Typography>
        <Typography className="text-sm text-neutral/70 mb-4">
          {t('knowledge.subtitle')}
        </Typography>
        <div className="flex items-center gap-2 text-primary">
          <BookOpen size={16} />
          <Typography className="text-sm font-medium">
            {t('knowledge.library')}
          </Typography>
        </div>
      </div>
    </div>
  );
} 