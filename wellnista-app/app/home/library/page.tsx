'use client';

import { Box, Typography, Button } from '@mui/material';

const knowledgeTopics = [
  {
    name: 'ความรู้เรื่องคาร์บ',
    url: 'https://www.pobpad.com/%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%9A%E0%B9%82%E0%B8%AE%E0%B8%B4%E0%B9%80%E0%B8%94%E0%B8%A3%E0%B8%95',
  },
  {
    name: 'โปรตีน',
    url: 'https://www.pobpad.com/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%95%E0%B8%B4%E0%B8%99',
  },
  {
    name: 'อาหารแลกเปลี่ยน',
    url: 'https://www.pobpad.com/%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%81%E0%B8%9B%E0%B8%A5%E0%B9%88%E0%B8%87%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B9%80%E0%B8%9A%E0%B8%B2%E0%B8%AB%E0%B8%A7%E0%B8%B2%E0%B8%99',
  },
  {
    name: 'โซเดียม',
    url: 'https://www.pobpad.com/%E0%B9%82%E0%B8%8B%E0%B9%80%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B8%A1',
  },
];

export default function LibraryPage() {
  const handleTopicClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-secondary text-neutral font-garet flex flex-col items-center px-4 py-6">
      <Typography variant="h4" className="text-primary font-magnolia text-3xl mb-8">
        ห้องสมุดความรู้
      </Typography>

      <Box className="w-full max-w-xs space-y-4 mt-10">
        {knowledgeTopics.map((topic) => (
          <Button
            key={topic.name}
            fullWidth
            className="!bg-primary !text-secondary !text-xl !font-bold !rounded-full !mt-6 !px-6 !py-3 !shadow-md hover:!bg-accent transition"
            onClick={() => handleTopicClick(topic.url)}
          >
            {topic.name}
          </Button>
        ))}
      </Box>
    </div>
  );
} 