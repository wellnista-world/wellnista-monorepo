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
    id: { title: string; description: string };
  };
}

export const advertisingItems = [
  {
    id: 1,
    image: "/promote.webp",
    link: "/settings",
    translations: {
      th: {
        title: "ขอโปรโมชั่น",
        description: "ติดต่อเราเพื่อขอโปรโมชั่นพิเศษ"
      },
      en: {
        title: "Request Promotion",
        description: "Contact us to request special promotions"
      },
      zh: {
        title: "申请促销",
        description: "联系我们申请特别促销活动"
      },
      ja: {
        title: "プロモーション申請",
        description: "特別なプロモーションについてお問い合わせください"
      },
      ko: {
        title: "프로모션 요청",
        description: "특별한 프로모션을 요청하려면 문의하세요"
      },
      id: {
        title: "Minta Promosi",
        description: "Hubungi kami untuk meminta promosi khusus"
      }
    }
  },
  {
    id: 2,
    image: "/promote.webp",
    link: "/settings",
    translations: {
      th: {
        title: "ขอโปรโมชั่น",
        description: "ติดต่อเราเพื่อขอโปรโมชั่นพิเศษ"
      },
      en: {
        title: "Request Promotion",
        description: "Contact us to request special promotions"
      },
      zh: {
        title: "申请促销",
        description: "联系我们申请特别促销活动"
      },
      ja: {
        title: "プロモーション申請",
        description: "特別なプロモーションについてお問い合わせください"
      },
      ko: {
        title: "프로모션 요청",
        description: "특별한 프로모션을 요청하려면 문의하세요"
      },
      id: {
        title: "Minta Promosi",
        description: "Hubungi kami untuk meminta promosi khusus"
      }
    }
  },
  {
    id: 3,
    image: "/promote.webp",
    link: "https://line.me/ti/p/v4PViJexdz",
    translations: {
      th: {
        title: "ขอโปรโมชั่น",
        description: "ติดต่อเราเพื่อขอโปรโมชั่นพิเศษ"
      },
      en: {
        title: "Request Promotion",
        description: "Contact us to request special promotions"
      },
      zh: {
        title: "申请促销",
        description: "联系我们申请特别促销活动"
      },
      ja: {
        title: "プロモーション申請",
        description: "特別なプロモーションについてお問い合わせください"
      },
      ko: {
        title: "프로모션 요청",
        description: "특별한 프로모션을 요청하려면 문의하세요"
      },
      id: {
        title: "Minta Promosi",
        description: "Hubungi kami untuk meminta promosi khusus"
      }
    }
  },
  {
    id: 4,
    image: "/promote.webp",
    link: "/settings",
    translations: {
      th: {
        title: "ขอโปรโมชั่น",
        description: "ติดต่อเราเพื่อขอโปรโมชั่นพิเศษ"
      },
      en: {
        title: "Request Promotion",
        description: "Contact us to request special promotions"
      },
      zh: {
        title: "申请促销",
        description: "联系我们申请特别促销活动"
      },
      ja: {
        title: "プロモーション申請",
        description: "特別なプロモーションについてお問い合わせください"
      },
      ko: {
        title: "프로모션 요청",
        description: "특별한 프로모션을 요청하려면 문의하세요"
      },
      id: {
        title: "Minta Promosi",
        description: "Hubungi kami untuk meminta promosi khusus"
      }
    }
  },
  {
    id: 5,
    image: "/promote.webp",
    link: "/settings",
    translations: {
      th: {
        title: "ขอโปรโมชั่น",
        description: "ติดต่อเราเพื่อขอโปรโมชั่นพิเศษ"
      },
      en: {
        title: "Request Promotion",
        description: "Contact us to request special promotions"
      },
      zh: {
        title: "申请促销",
        description: "联系我们申请特别促销活动"
      },
      ja: {
        title: "プロモーション申請",
        description: "特別なプロモーションについてお問い合わせください"
      },
      ko: {
        title: "프로모션 요청",
        description: "특별한 프로모션을 요청하려면 문의하세요"
      },
      id: {
        title: "Minta Promosi",
        description: "Hubungi kami untuk meminta promosi khusus"
      }
    }
  }
];

// Helper function to get advertising items for a specific locale
export const getAdvertisingItems = (locale: string) => {
  return advertisingItems.map(item => ({
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