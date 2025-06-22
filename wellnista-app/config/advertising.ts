export interface AdvertisingItem {
  id: number;
  image: string;
  link: string;
  translations: {
    th: { title: string; description: string };
    en: { title: string; description: string };
    zh: { title: string; description: string };
    ja: { title: string; description: string };
    ko: { title: string; description: string };
  };
}

export const advertisingConfig: AdvertisingItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "https://lin.ee/AwaT0wg",
    translations: {
      th: {
        title: "โปรโมชั่นพิเศษ",
        description: "ลดราคาสูงสุด 50% สำหรับผลิตภัณฑ์สุขภาพ"
      },
      en: {
        title: "Special Promotion",
        description: "Up to 50% off on health products"
      },
      zh: {
        title: "特别促销",
        description: "健康产品最高50%折扣"
      },
      ja: {
        title: "特別プロモーション",
        description: "健康製品最大50%オフ"
      },
      ko: {
        title: "특별 프로모션",
        description: "건강 제품 최대 50% 할인"
      }
    }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "/home/library",
    translations: {
      th: {
        title: "บริการใหม่",
        description: "ปรึกษานักโภชนาการออนไลน์ ฟรี!"
      },
      en: {
        title: "New Service",
        description: "Free online nutrition consultation!"
      },
      zh: {
        title: "新服务",
        description: "免费在线营养咨询！"
      },
      ja: {
        title: "新サービス",
        description: "無料オンライン栄養相談！"
      },
      ko: {
        title: "새로운 서비스",
        description: "무료 온라인 영양 상담!"
      }
    }
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "/settings",
    translations: {
      th: {
        title: "แอปพลิเคชันใหม่",
        description: "ดาวน์โหลดแอปใหม่เพื่อสุขภาพที่ดีกว่า"
      },
      en: {
        title: "New App",
        description: "Download new app for better health"
      },
      zh: {
        title: "新应用",
        description: "下载新应用获得更好的健康"
      },
      ja: {
        title: "新アプリ",
        description: "より良い健康のための新しいアプリをダウンロード"
      },
      ko: {
        title: "새로운 앱",
        description: "더 나은 건강을 위한 새로운 앱 다운로드"
      }
    }
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "/profile",
    translations: {
      th: {
        title: "ติดตามสุขภาพ",
        description: "ตรวจสอบและติดตามสุขภาพของคุณอย่างต่อเนื่อง"
      },
      en: {
        title: "Health Tracking",
        description: "Monitor and track your health continuously"
      },
      zh: {
        title: "健康追踪",
        description: "持续监测和追踪您的健康状况"
      },
      ja: {
        title: "健康トラッキング",
        description: "健康状態を継続的に監視・追跡"
      },
      ko: {
        title: "건강 추적",
        description: "건강 상태를 지속적으로 모니터링하고 추적"
      }
    }
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "/select",
    translations: {
      th: {
        title: "สแกนอาหาร",
        description: "สแกนอาหารเพื่อดูข้อมูลโภชนาการที่แม่นยำ"
      },
      en: {
        title: "Food Scanning",
        description: "Scan food to see accurate nutritional information"
      },
      zh: {
        title: "食品扫描",
        description: "扫描食品查看准确的营养信息"
      },
      ja: {
        title: "食品スキャン",
        description: "食品をスキャンして正確な栄養情報を確認"
      },
      ko: {
        title: "식품 스캔",
        description: "식품을 스캔하여 정확한 영양 정보 확인"
      }
    }
  }
];

// Helper function to get advertising items for a specific locale
export const getAdvertisingItems = (locale: string) => {
  return advertisingConfig.map(item => ({
    id: item.id,
    image: item.image,
    title: item.translations[locale as keyof typeof item.translations]?.title || item.translations.en.title,
    description: item.translations[locale as keyof typeof item.translations]?.description || item.translations.en.description,
    link: item.link
  }));
};

// Carousel configuration
export const carouselConfig = {
  autoSlideInterval: 4000, // 4 seconds
  transitionDuration: 500, // 500ms
  height: "h-48", // Tailwind class for height
  showNavigation: true,
  showDots: true,
  showProgressBar: true,
  showClickIndicator: true
}; 