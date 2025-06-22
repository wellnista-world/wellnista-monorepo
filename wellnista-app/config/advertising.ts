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
        title: "ขอลงโฆษณา",
        description: "ติดต่อเราเพื่อขอลงโฆษณา"
      },
      en: {
        title: "Request Advertising",
        description: "Contact us to request advertising"
      },
      zh: {
        title: "申请广告",
        description: "联系我们申请广告投放"
      },
      ja: {
        title: "広告掲載申請",
        description: "広告掲載についてお問い合わせください"
      },
      ko: {
        title: "광고 신청",
        description: "광고를 원하시면 문의하세요"
      },
      id: {
        title: "Minta Iklan",
        description: "Hubungi kami untuk meminta iklan"
      }
    }
  },
  {
    id: 2,
    image: "/promote.webp",
    link: "/settings",
    translations: {
      th: {
        title: "ขอลงโฆษณา",
        description: "ติดต่อเราเพื่อขอลงโฆษณา"
      },
      en: {
        title: "Request Advertising",
        description: "Contact us to request advertising"
      },
      zh: {
        title: "申请广告",
        description: "联系我们申请广告投放"
      },
      ja: {
        title: "広告掲載申請",
        description: "広告掲載についてお問い合わせください"
      },
      ko: {
        title: "광고 신청",
        description: "광고를 원하시면 문의하세요"
      },
      id: {
        title: "Minta Iklan",
        description: "Hubungi kami untuk meminta iklan"
      }
    }
  },
  {
    id: 3,
    image: "/promote.webp",
    link: "https://line.me/ti/p/v4PViJexdz",
    translations: {
      th: {
        title: "ขอลงโฆษณา",
        description: "ติดต่อเราเพื่อขอลงโฆษณา"
      },
      en: {
        title: "Request Advertising",
        description: "Contact us to request advertising"
      },
      zh: {
        title: "申请广告",
        description: "联系我们申请广告投放"
      },
      ja: {
        title: "広告掲載申請",
        description: "広告掲載についてお問い合わせください"
      },
      ko: {
        title: "광고 신청",
        description: "광고를 원하시면 문의하세요"
      },
      id: {
        title: "Minta Iklan",
        description: "Hubungi kami untuk meminta iklan"
      }
    }
  },
  {
    id: 4,
    image: "/promote.webp",
    link: "/settings",
    translations: {
      th: {
        title: "ขอลงโฆษณา",
        description: "ติดต่อเราเพื่อขอลงโฆษณา"
      },
      en: {
        title: "Request Advertising",
        description: "Contact us to request advertising"
      },
      zh: {
        title: "申请广告",
        description: "联系我们申请广告投放"
      },
      ja: {
        title: "広告掲載申請",
        description: "広告掲載についてお問い合わせください"
      },
      ko: {
        title: "광고 신청",
        description: "광고를 원하시면 문의하세요"
      },
      id: {
        title: "Minta Iklan",
        description: "Hubungi kami untuk meminta iklan"
      }
    }
  },
  {
    id: 5,
    image: "/promote.webp",
    link: "/settings",
    translations: {
      th: {
        title: "ขอลงโฆษณา",
        description: "ติดต่อเราเพื่อขอลงโฆษณา"
      },
      en: {
        title: "Request Advertising",
        description: "Contact us to request advertising"
      },
      zh: {
        title: "申请广告",
        description: "联系我们申请广告投放"
      },
      ja: {
        title: "広告掲載申請",
        description: "広告掲載についてお問い合わせください"
      },
      ko: {
        title: "광고 신청",
        description: "광고를 원하시면 문의하세요"
      },
      id: {
        title: "Minta Iklan",
        description: "Hubungi kami untuk meminta iklan"
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