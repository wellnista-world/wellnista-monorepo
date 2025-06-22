export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  link: string;
  category: string;
  translations: {
    th: {
      name: string;
      description: string;
    };
    en: {
      name: string;
      description: string;
    };
    zh: {
      name: string;
      description: string;
    };
    ja: {
      name: string;
      description: string;
    };
    ko: {
      name: string;
      description: string;
    };
    id: {
      name: string;
      description: string;
    };
  };
}

export const products: Product[] = [
  {
    id: 1,
    name: "Specialized Health Food",
    description: "Professional nutrition for your loved ones",
    price: 299,
    currency: "฿",
    image: "/promote.webp",
    link: "https://lin.ee/AwaT0wg",
    category: "health-food",
    translations: {
      th: {
        name: "อาหารสุขภาพเฉพาะทาง",
        description: "โภชนาการมืออาชีพสำหรับคนที่คุณรัก"
      },
      en: {
        name: "Specialized Health Food",
        description: "Professional nutrition for your loved ones"
      },
      zh: {
        name: "专业健康食品",
        description: "为您的亲人提供专业营养"
      },
      ja: {
        name: "専門健康食品",
        description: "大切な人のための専門栄養"
      },
      ko: {
        name: "전문 건강식품",
        description: "사랑하는 사람을 위한 전문 영양"
      },
      id: {
        name: "Makanan Kesehatan Khusus",
        description: "Nutrisi profesional untuk orang yang Anda cintai"
      }
    }
  },
  {
    id: 2,
    name: "Diabetes Management Kit",
    description: "Complete solution for blood sugar control",
    price: 599,
    currency: "฿",
    image: "/promote.webp",
    link: "https://lin.ee/AwaT0wg",
    category: "diabetes-care",
    translations: {
      th: {
        name: "ชุดจัดการเบาหวาน",
        description: "โซลูชันครบครันสำหรับการควบคุมน้ำตาลในเลือด"
      },
      en: {
        name: "Diabetes Management Kit",
        description: "Complete solution for blood sugar control"
      },
      zh: {
        name: "糖尿病管理套装",
        description: "血糖控制的完整解决方案"
      },
      ja: {
        name: "糖尿病管理キット",
        description: "血糖コントロールの完全ソリューション"
      },
      ko: {
        name: "당뇨병 관리 키트",
        description: "혈당 조절을 위한 완전한 솔루션"
      },
      id: {
        name: "Kit Manajemen Diabetes",
        description: "Solusi lengkap untuk kontrol gula darah"
      }
    }
  },
  {
    id: 3,
    name: "Low Carb Meal Plan",
    description: "Personalized meal plans for better health",
    price: 399,
    currency: "฿",
    image: "/promote.webp",
    link: "https://lin.ee/AwaT0wg",
    category: "meal-plans",
    translations: {
      th: {
        name: "แผนมื้ออาหารคาร์บต่ำ",
        description: "แผนมื้ออาหารส่วนบุคคลเพื่อสุขภาพที่ดีกว่า"
      },
      en: {
        name: "Low Carb Meal Plan",
        description: "Personalized meal plans for better health"
      },
      zh: {
        name: "低碳水化合物膳食计划",
        description: "个性化膳食计划，促进健康"
      },
      ja: {
        name: "低炭水化物食事プラン",
        description: "より良い健康のためのパーソナライズされた食事プラン"
      },
      ko: {
        name: "저탄수화물 식단 계획",
        description: "더 나은 건강을 위한 맞춤형 식단 계획"
      },
      id: {
        name: "Rencana Makan Rendah Karbohidrat",
        description: "Rencana makan yang dipersonalisasi untuk kesehatan yang lebih baik"
      }
    }
  },
  {
    id: 4,
    name: "Nutrition Consultation",
    description: "Expert advice from certified nutritionists",
    price: 799,
    currency: "฿",
    image: "/promote.webp",
    link: "https://lin.ee/AwaT0wg",
    category: "consultation",
    translations: {
      th: {
        name: "ปรึกษาโภชนาการ",
        description: "คำแนะนำจากผู้เชี่ยวชาญด้านโภชนาการที่ได้รับการรับรอง"
      },
      en: {
        name: "Nutrition Consultation",
        description: "Expert advice from certified nutritionists"
      },
      zh: {
        name: "营养咨询",
        description: "来自认证营养师的专业建议"
      },
      ja: {
        name: "栄養相談",
        description: "認定栄養士からの専門的なアドバイス"
      },
      ko: {
        name: "영양 상담",
        description: "인증된 영양사로부터의 전문 조언"
      },
      id: {
        name: "Konsultasi Nutrisi",
        description: "Saran ahli dari ahli gizi bersertifikat"
      }
    }
  },
  {
    id: 5,
    name: "Health Monitoring Device",
    description: "Advanced technology for health tracking",
    price: 1299,
    currency: "฿",
    image: "/promote.webp",
    link: "https://lin.ee/AwaT0wg",
    category: "devices",
    translations: {
      th: {
        name: "อุปกรณ์ติดตามสุขภาพ",
        description: "เทคโนโลยีขั้นสูงสำหรับการติดตามสุขภาพ"
      },
      en: {
        name: "Health Monitoring Device",
        description: "Advanced technology for health tracking"
      },
      zh: {
        name: "健康监测设备",
        description: "健康追踪的先进技术"
      },
      ja: {
        name: "健康モニタリングデバイス",
        description: "健康追跡のための先進技術"
      },
      ko: {
        name: "건강 모니터링 기기",
        description: "건강 추적을 위한 첨단 기술"
      },
      id: {
        name: "Perangkat Pemantauan Kesehatan",
        description: "Teknologi canggih untuk pelacakan kesehatan"
      }
    }
  }
];

export const getRandomProduct = (): Product => {
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
};

export const getProductForLocale = (product: Product, locale: string): Product => {
  return {
    ...product,
    name: product.translations[locale as keyof typeof product.translations]?.name || product.name,
    description: product.translations[locale as keyof typeof product.translations]?.description || product.description
  };
};

export const getProductById = (id: number): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(products.map((p) => p.category))];
}; 