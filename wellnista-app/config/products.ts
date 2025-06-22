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
        name: "เซตน้ำจิ้มรักษ์ไต 5 รสชาติ สูตรโซเดียมต่ำ โดยอาจารย์เปิ้ล ส่งฟรีทั่วไทย!!!",
        description: "มีถึง 5 รสชาติ อร่อย โซเดียมต่ำ ผัดกะเพรา น้ำจิ้มไก่, น้ำจิ้มซีฟู้ด, น้ำจิ้มสุกี้, น้ำจิ้มแจ่ว",
        price: 580,
        currency: "฿",
        image: "/product1.png",
        link: "product/1",
        category: "sauce",
        translations: {
          th: {
            name: "เซตน้ำจิ้มรักษ์ไต 5 รสชาติ สูตรโซเดียมต่ำ โดยอาจารย์เปิ้ล ส่งฟรีทั่วไทย!!!",
            description: "มีถึง 5 รสชาติ อร่อย โซเดียมต่ำ ผัดกะเพรา น้ำจิ้มไก่, น้ำจิ้มซีฟู้ด, น้ำจิ้มสุกี้, น้ำจิ้มแจ่ว"
          },
          en: {
            name: "Kidney-friendly dipping sauce set, 5 flavors, low sodium recipe by Professor Ple, free delivery throughout Thailand!!!",
            description: "There are 5 flavors, delicious, low sodium, Pad Krapow, Chicken sauce, Seafood sauce, Suki sauce, Jaew sauce"
          },
          zh: {
            name: "肾脏友好型蘸酱套装，5 种口味，由 Ple 教授研发的低钠配方，泰国全境免费送货！！！",
            description: "有5种口味，美味，低钠，Pad Krapow，鸡肉酱，海鲜酱，Suki酱，Jaew酱"
          },
          ja: {
            name: "腎臓に優しいつけダレセット、5種類の味、プル教授の低ナトリウムレシピ、タイ全土に送料無料!!!",
            description: "5種類の味があり、おいしい、低ナトリウム、パックラポー、チキンソース、シーフードソース、スキソース、ジャオソース"
          },
          ko: {
            name: "신장에 좋은 디핑소스 세트, 5가지 맛, Ple 교수의 저염 레시피, 태국 전역 무료 배송!!!",
            description: "5가지 맛이 있습니다. 맛있고 저염, 패드 크라파우, 치킨 소스, 해산물 소스, 스키 소스, 재우 소스"
          },
          id: {
            name: "Set saus cocol ramah ginjal, 5 rasa, resep rendah sodium oleh Profesor Ple, pengiriman gratis ke seluruh Thailand!!!",
            description: "Ada 5 rasa, lezat, rendah sodium, Pad Krapow, Saus ayam, Saus seafood, Saus suki, Saus jaew"
          }
        }
      },
      {
        id: 2,
        name: "เซต หวานกาย สุขใจ ส่งฟรีทั่วไทย!!!",
        description: "เซตนี้ ได้ขนม 2 + น้ำจิ้ม 2 รสชาติ (แจ้งรสชาติได้หลังกดสั่ง) ขนม 2 อย่างจะได้คุกกี้ไข่ขาว หอม อร่อย หวานน้อย ฟอสฟอรัสต่ำ สูตร อาจารย์เปิ้ล, ขนมปั้นขลิบไส้สัปปะรด ทำจากไข่ขาว กรอบอร่อย",
        price: 550,
        currency: "฿",
        image: "/product2.png",
        link: "product/2",
        category: "give_set",
        translations: {
          th: {
            name: "เซต หวานกาย สุขใจ ส่งฟรีทั่วไทย!!!",
            description: "เซตนี้ ได้ขนม 2 + น้ำจิ้ม 2 รสชาติ (แจ้งรสชาติได้หลังกดสั่ง) ขนม 2 อย่างจะได้คุกกี้ไข่ขาว หอม อร่อย หวานน้อย ฟอสฟอรัสต่ำ สูตร อาจารย์เปิ้ล, ขนมปั้นขลิบไส้สัปปะรด ทำจากไข่ขาว กรอบอร่อย"
          },
          en: {
            name: "Sweet Body, Happy Heart Set, free shipping nationwide!!!",
            description: "This set includes 2 snacks + 2 dipping sauces (you can specify the flavors after ordering). The 2 snacks include egg white cookies, fragrant, delicious, slightly sweet, low phosphorus, Teacher Ple's recipe, and pineapple-filled crispy pancakes made from egg whites."
          },
          zh: {
            name: "甜蜜身体，快乐心灵套装，全国包邮！！！",
            description: "此套餐包含2款小吃+2款蘸酱（下单后可指定口味），2款小吃分别是Ple老师食谱的蛋清饼干，香浓可口，微甜，低磷，以及蛋清做的菠萝馅酥脆煎饼。"
          },
          ja: {
            name: "スウィートボディ、ハッピーハートセット、全国送料無料!!!",
            description: "このセットには、スナック2品とディップソース2種類が含まれています（ご注文後にフレーバーをご指定いただけます）。スナック2品は、プル先生のレシピによる、香ばしく、美味しく、ほんのり甘く、低リンの卵白クッキーと、卵白で作ったパイナップル入りのサクサクパンケーキです。"
          },
          ko: {
            name: "스위트바디, 해피하트 세트, 전국 무료배송!!!",
            description: "이 세트에는 스낵 2개와 디핑 소스 2개가 포함되어 있습니다(주문 후 맛을 선택하실 수 있습니다). 스낵 2개에는 향긋하고 맛있으며 약간 달콤하고 인 함량이 낮은 계란 흰자 쿠키(선생님 Ple 레시피)와 계란 흰자로 만든 파인애플이 들어간 바삭한 팬케이크가 포함됩니다."
          },
          id: {
            name: "Set Tubuh Manis, Hati Bahagia, gratis ongkos kirim ke seluruh negeri!!!",
            description: "Paket ini berisi 2 camilan + 2 saus cocol (Anda dapat menentukan rasa setelah memesan). 2 camilan tersebut meliputi kue putih telur, harum, lezat, sedikit manis, rendah fosfor, resep Guru Ple, dan panekuk renyah isi nanas yang terbuat dari putih telur."
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