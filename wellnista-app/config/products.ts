export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  link: string;
  category: string;
  priceId: string;
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
    description:
      "มีถึง 5 รสชาติ อร่อย โซเดียมต่ำ ผัดกะเพรา น้ำจิ้มไก่, น้ำจิ้มซีฟู้ด, น้ำจิ้มสุกี้, น้ำจิ้มแจ่ว",
    price: 580,
    currency: "฿",
    image: "/product1.png",
    link: "product/1",
    category: "sauce",
    priceId: "price_1RcqFvAom1IgIvKKP8hNFzfQ",
    translations: {
      th: {
        name: "เซตน้ำจิ้มรักษ์ไต 5 รสชาติ สูตรโซเดียมต่ำ โดยอาจารย์เปิ้ล ส่งฟรีทั่วไทย!!!",
        description:
          "มีถึง 5 รสชาติ อร่อย โซเดียมต่ำ ผัดกะเพรา น้ำจิ้มไก่, น้ำจิ้มซีฟู้ด, น้ำจิ้มสุกี้, น้ำจิ้มแจ่ว",
      },
      en: {
        name: "Kidney-friendly dipping sauce set, 5 flavors, low sodium recipe by Professor Ple, free delivery throughout Thailand!!!",
        description:
          "There are 5 flavors, delicious, low sodium, Pad Krapow, Chicken sauce, Seafood sauce, Suki sauce, Jaew sauce",
      },
      zh: {
        name: "肾脏友好型蘸酱套装，5 种口味，由 Ple 教授研发的低钠配方，泰国全境免费送货！！！",
        description:
          "有5种口味，美味，低钠，Pad Krapow，鸡肉酱，海鲜酱，Suki酱，Jaew酱",
      },
      ja: {
        name: "腎臓に優しいつけダレセット、5種類の味、プル教授の低ナトリウムレシピ、タイ全土に送料無料!!!",
        description:
          "5種類の味があり、おいしい、低ナトリウム、パックラポー、チキンソース、シーフードソース、スキソース、ジャオソース",
      },
      ko: {
        name: "신장에 좋은 디핑소스 세트, 5가지 맛, Ple 교수의 저염 레시피, 태국 전역 무료 배송!!!",
        description:
          "5가지 맛이 있습니다. 맛있고 저염, 패드 크라파우, 치킨 소스, 해산물 소스, 스키 소스, 재우 소스",
      },
      id: {
        name: "Set saus cocol ramah ginjal, 5 rasa, resep rendah sodium oleh Profesor Ple, pengiriman gratis ke seluruh Thailand!!!",
        description:
          "Ada 5 rasa, lezat, rendah sodium, Pad Krapow, Saus ayam, Saus seafood, Saus suki, Saus jaew",
      },
    },
  },
  {
    id: 2,
    name: "เซต หวานกาย สุขใจ ส่งฟรีทั่วไทย!!!",
    description:
      "เซตนี้ ได้ขนม 2 + น้ำจิ้ม 2 รสชาติ (แจ้งรสชาติได้หลังกดสั่ง) ขนม 2 อย่างจะได้คุกกี้ไข่ขาว หอม อร่อย หวานน้อย ฟอสฟอรัสต่ำ สูตร อาจารย์เปิ้ล, ขนมปั้นขลิบไส้สัปปะรด ทำจากไข่ขาว กรอบอร่อย",
    price: 550,
    currency: "฿",
    image: "/product2.png",
    link: "product/2",
    category: "give_set",
    priceId: "price_1RcqH9Aom1IgIvKKdT2gHOYc",
    translations: {
      th: {
        name: "เซต หวานกาย สุขใจ ส่งฟรีทั่วไทย!!!",
        description:
          "เซตนี้ ได้ขนม 2 + น้ำจิ้ม 2 รสชาติ (แจ้งรสชาติได้หลังกดสั่ง) ขนม 2 อย่างจะได้คุกกี้ไข่ขาว หอม อร่อย หวานน้อย ฟอสฟอรัสต่ำ สูตร อาจารย์เปิ้ล, ขนมปั้นขลิบไส้สัปปะรด ทำจากไข่ขาว กรอบอร่อย",
      },
      en: {
        name: "Sweet Body, Happy Heart Set, free shipping nationwide!!!",
        description:
          "This set includes 2 snacks + 2 dipping sauces (you can specify the flavors after ordering). The 2 snacks include egg white cookies, fragrant, delicious, slightly sweet, low phosphorus, Teacher Ple's recipe, and pineapple-filled crispy pancakes made from egg whites.",
      },
      zh: {
        name: "甜蜜身体，快乐心灵套装，全国包邮！！！",
        description:
          "此套餐包含2款小吃+2款蘸酱（下单后可指定口味），2款小吃分别是Ple老师食谱的蛋清饼干，香浓可口，微甜，低磷，以及蛋清做的菠萝馅酥脆煎饼。",
      },
      ja: {
        name: "スウィートボディ、ハッピーハートセット、全国送料無料!!!",
        description:
          "このセットには、スナック2品とディップソース2種類が含まれています（ご注文後にフレーバーをご指定いただけます）。スナック2品は、プル先生のレシピによる、香ばしく、美味しく、ほんのり甘く、低リンの卵白クッキーと、卵白で作ったパイナップル入りのサクサクパンケーキです。",
      },
      ko: {
        name: "스위트바디, 해피하트 세트, 전국 무료배송!!!",
        description:
          "이 세트에는 스낵 2개와 디핑 소스 2개가 포함되어 있습니다(주문 후 맛을 선택하실 수 있습니다). 스낵 2개에는 향긋하고 맛있으며 약간 달콤하고 인 함량이 낮은 계란 흰자 쿠키(선생님 Ple 레시피)와 계란 흰자로 만든 파인애플이 들어간 바삭한 팬케이크가 포함됩니다.",
      },
      id: {
        name: "Set Tubuh Manis, Hati Bahagia, gratis ongkos kirim ke seluruh negeri!!!",
        description:
          "Paket ini berisi 2 camilan + 2 saus cocol (Anda dapat menentukan rasa setelah memesan). 2 camilan tersebut meliputi kue putih telur, harum, lezat, sedikit manis, rendah fosfor, resep Guru Ple, dan panekuk renyah isi nanas yang terbuat dari putih telur.",
      },
    },
  },
  {
    id: 3,
    name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ 6 ซอง เพียง 300 บาท (ปกติ 330) คละรส สตอร์เบอรรี่, สับปะรดภูเเล, ขิง จัดส่งฟรี!!!!!",
    description:
      "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
    price: 300,
    currency: "฿",
    image: "/product3.png",
    link: "product/3",
    category: "cookies",
    priceId: "price_1RlZLoAom1IgIvKK6dWNSKmN",
    translations: {
      th: {
        name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ 6 ซอง เพียง 300 บาท (ปกติ 330) คละรส สตอร์เบอรรี่, สับปะรดภูเเล, ขิง จัดส่งฟรี!!!!!",
        description:
          "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
      },
      en: {
        name: "Fruit Cookie Set, Kidney, Diabetes, Blood Pressure, 6 bags for only 300 baht (usually 330), mixed flavors: strawberry, Phu Lae pineapple, ginger, free delivery!!!!!",
        description:
          "✅Light cookies, real fruit pulp, selected organic jasmine rice flour Ayo researched and developed by nutritionists, funded by the National Innovation Agency NIA🌍 Researched and developed in collaboration with the Faculty of Medicine Siriraj Hospital, Mahidol University ❌No wheat flour ❌No gluten ❌No added salt ❌No added artificial colors ❌No added preservatives ⬇️Low sugar, low sodium, low potassium, low phosphorus, low protein ✅Suitable for health care professionals, children, working adults, the elderly and health enthusiasts Use USDA/EU organic jasmine rice flour instead of wheat flour Contains real fruit pulp from the agricultural community, Chiang Rai Province",
      },
      zh: {
        name: "水果饼干套装，肾脏，糖尿病，血压，6袋仅售300泰铢（通常330），混合口味：草莓，Phu Lae 菠萝，生姜，免费送货！！！！！",
        description:
          "✅轻盈饼干，真果肉，精选有机茉莉香米粉 Ayo 由营养学家研发，由国家创新机构 NIA 资助🌍 与泰国玛希隆大学诗里拉吉医院医学院合作研发 ❌不含小麦粉 ❌不含麸质 ❌不添加盐 ❌不添加人工色素 ❌不添加防腐剂 ⬇️低糖、低钠、低钾、低磷、低蛋白 ✅适合医护人员、儿童、在职人士、老年人和健康爱好者 使用美国农业部/欧盟有机茉莉香米粉代替小麦粉 含有来自清莱府农业社区的真果肉",
      },
      ja: {
        name: "フルーツ クッキー セット、腎臓、糖尿病、血圧、6 袋でたったの 300 バーツ (通常 330)、ミックス フレーバー: イチゴ、プー ラエ パイナップル、ジンジャー、送料無料!!!!!",
        description:
          "✅軽いクッキー、本物のフルーツパルプ、厳選されたオーガニックジャスミン米粉 栄養士が研究開発し、国立イノベーション機構（NIA）の資金提供を受けています🌍 マヒドン大学シリラート病院医学部との共同研究開発 ❌小麦粉不使用 ❌グルテンフリー ❌食塩不使用 ❌着色料不使用 ❌保存料不使用 ⬇️低糖、低ナトリウム、低カリウム、低リン、低タンパク質 ✅医療従事者、お子様、働く大人、高齢者、健康志向の方に最適です 小麦粉の代わりにUSDA/EU認定のオーガニックジャスミン米粉を使用 チェンライ県の農家が収穫した本物のフルーツパルプを使用",
      },
      ko: {
        name: "과일 쿠키 세트, 신장, 당뇨, 혈압, 6개 봉지 300바트(보통 330바트), 혼합 맛: 딸기, 푸래 파인애플, 생강, 무료 배송!!!!!",
        description:
          "✅ 가벼운 쿠키, 진짜 과일 과육, 엄선된 유기농 자스민 쌀가루 Ayo는 영양학자들이 연구 개발하고, 국가 혁신 기관 NIA의 지원을 받았습니다.🌍 마히돌 대학교 시리랏 병원 의과대학과 협력하여 연구 개발되었습니다. ❌밀가루 무첨가 ❌글루텐 무첨가 ❌소금 무첨가 ❌인공 색소 무첨가 ❌방부제 무첨가 ⬇️저당, 저나트륨, 저칼륨, 저인, 저단백질 ✅의료 전문가, 어린이, 직장인, 노인 및 건강 애호가에게 적합 밀가루 대신 USDA/EU 유기농 자스민 쌀가루 사용 치앙라이 주 농업 공동체의 진짜 과일 과육 함유",
      },
      id: {
        name: "Set Kue Buah, Ginjal, Diabetes, Tekanan Darah, 6 kantong hanya seharga 300 baht (biasanya 330), rasa campur: stroberi, nanas Phu Lae, jahe, gratis ongkir!!!!!",
        description:
          "✅Kue kering ringan, bubur buah asli, tepung beras melati organik pilihan Ayo diteliti dan dikembangkan oleh ahli gizi, didanai oleh Badan Inovasi Nasional NIA🌍 Diteliti dan dikembangkan bekerja sama dengan Fakultas Kedokteran Rumah Sakit Siriraj, Universitas Mahidol ❌Tanpa tepung terigu ❌Tanpa gluten ❌Tanpa tambahan garam ❌Tanpa pewarna buatan ❌Tanpa pengawet tambahan ⬇️Rendah gula, rendah natrium, rendah kalium, rendah fosfor, rendah protein ✅Cocok untuk tenaga kesehatan, anak-anak, pekerja dewasa, lansia, dan penggemar kesehatan Gunakan tepung beras melati organik USDA/EU sebagai pengganti tepung terigu Mengandung bubur buah asli dari komunitas pertanian, Provinsi Chiang Rai",
      },
    },
  },
  {
    id: 4,
    name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ เซตละ 6 ซอง เพียง 300 บาท (ปกติ 330) สตอร์เบอรรี่ จัดส่งฟรี!!!!!",
    description:
      "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
    price: 300,
    currency: "฿",
    image: "/product4.png",
    link: "product/4",
    category: "cookies",
    priceId: "price_1RlZKqAom1IgIvKKR6cZSj2j",
    translations: {
      th: {
        name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ เซตละ 6 ซอง เพียง 300 บาท (ปกติ 330) สตอร์เบอรรี่ จัดส่งฟรี!!!!!",
        description:
          "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
      },
      en: {
        name: "Fruit Cookie Set, Kidney, Diabetes, Blood Pressure, Can Eat, Set of 6 Bags, Only 300 Baht (Normal Price 330) Strawberry, Free Shipping!!!!!",
        description:
          "✅Light cookies, real fruit pulp, selected organic jasmine rice flour Ayo researched and developed by nutritionists, funded by the National Innovation Agency NIA🌍 Researched and developed in collaboration with the Faculty of Medicine Siriraj Hospital, Mahidol University ❌No wheat flour ❌No gluten ❌No added salt ❌No added artificial colors ❌No added preservatives ⬇️Low sugar, low sodium, low potassium, low phosphorus, low protein ✅Suitable for health care professionals, children, working adults, the elderly and health enthusiasts Use USDA/EU organic jasmine rice flour instead of wheat flour Contains real fruit pulp from the agricultural community, Chiang Rai Province",
      },
      zh: {
        name: "水果饼干套装，肾病，糖尿病，血压，都可以吃，一套6袋，只要300泰铢（原价330）草莓，包邮！！！！！",
        description:
          "✅轻盈饼干，真果肉，精选有机茉莉香米粉 Ayo 由营养学家研发，由国家创新机构 NIA 资助🌍 与泰国玛希隆大学诗里拉吉医院医学院合作研发 ❌不含小麦粉 ❌不含麸质 ❌不添加盐 ❌不添加人工色素 ❌不添加防腐剂 ⬇️低糖、低钠、低钾、低磷、低蛋白 ✅适合医护人员、儿童、在职人士、老年人和健康爱好者 使用美国农业部/欧盟有机茉莉香米粉代替小麦粉 含有来自清莱府农业社区的真果肉",
      },
      ja: {
        name: "フルーツクッキーセット、腎臓、糖尿病、血圧、食べられます、6袋セット、たったの300バーツ（通常価格330）イチゴ、送料無料!!!!!",
        description:
          "✅軽いクッキー、本物のフルーツパルプ、厳選されたオーガニックジャスミン米粉 栄養士が研究開発し、国立イノベーション機構（NIA）の資金提供を受けています🌍 マヒドン大学シリラート病院医学部との共同研究開発 ❌小麦粉不使用 ❌グルテンフリー ❌食塩不使用 ❌着色料不使用 ❌保存料不使用 ⬇️低糖、低ナトリウム、低カリウム、低リン、低タンパク質 ✅医療従事者、お子様、働く大人、高齢者、健康志向の方に最適です 小麦粉の代わりにUSDA/EU認定のオーガニックジャスミン米粉を使用 チェンライ県の農家が収穫した本物のフルーツパルプを使用",
      },
      ko: {
        name: "과일 쿠키 세트, 신장, 당뇨, 혈압, 먹을 수 있음, 6개 봉지 세트, 단 300바트(정상가 330) 딸기, 무료 배송!!!!!",
        description:
          "✅ 가벼운 쿠키, 진짜 과일 과육, 엄선된 유기농 자스민 쌀가루 Ayo는 영양학자들이 연구 개발하고, 국가 혁신 기관 NIA의 지원을 받았습니다.🌍 마히돌 대학교 시리랏 병원 의과대학과 협력하여 연구 개발되었습니다. ❌밀가루 무첨가 ❌글루텐 무첨가 ❌소금 무첨가 ❌인공 색소 무첨가 ❌방부제 무첨가 ⬇️저당, 저나트륨, 저칼륨, 저인, 저단백질 ✅의료 전문가, 어린이, 직장인, 노인 및 건강 애호가에게 적합 밀가루 대신 USDA/EU 유기농 자스민 쌀가루 사용 치앙라이 주 농업 공동체의 진짜 과일 과육 함유",
      },
      id: {
        name: "Set Kue Buah, Ginjal, Diabetes, Tekanan Darah, Bisa Dimakan, Set Isi 6 Kantong, Hanya 300 Baht (Harga Normal 330) Stroberi, Gratis Ongkir!!!!!",
        description:
          "✅Kue kering ringan, bubur buah asli, tepung beras melati organik pilihan Ayo diteliti dan dikembangkan oleh ahli gizi, didanai oleh Badan Inovasi Nasional NIA🌍 Diteliti dan dikembangkan bekerja sama dengan Fakultas Kedokteran Rumah Sakit Siriraj, Universitas Mahidol ❌Tanpa tepung terigu ❌Tanpa gluten ❌Tanpa tambahan garam ❌Tanpa pewarna buatan ❌Tanpa pengawet tambahan ⬇️Rendah gula, rendah natrium, rendah kalium, rendah fosfor, rendah protein ✅Cocok untuk tenaga kesehatan, anak-anak, pekerja dewasa, lansia, dan penggemar kesehatan Gunakan tepung beras melati organik USDA/EU sebagai pengganti tepung terigu Mengandung bubur buah asli dari komunitas pertanian, Provinsi Chiang Rai",
      },
    },
  },
  {
    id: 5,
    name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ 6 ซอง เพียง 300 บาท (ปกติ 330) สับปะรดภูเเล จัดส่งฟรี!!!!!",
    description:
      "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
    price: 300,
    currency: "฿",
    image: "/product5.png",
    link: "product/5",
    category: "cookies",
    priceId: "price_1RlZL7Aom1IgIvKK6eUIrXaJ",
    translations: {
      th: {
        name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ 6 ซอง เพียง 300 บาท (ปกติ 330) สับปะรดภูเเล จัดส่งฟรี!!!!!",
        description:
          "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
      },
      en: {
        name: "Fruit Cookie Set, Kidney, Diabetes, Blood Pressure, 6 packs, only 300 baht (usually 330), Phu Lae Pineapple, free delivery!!!!!",
        description:
          "✅Light cookies, real fruit pulp, selected organic jasmine rice flour Ayo researched and developed by nutritionists, funded by the National Innovation Agency NIA🌍 Researched and developed in collaboration with the Faculty of Medicine Siriraj Hospital, Mahidol University ❌No wheat flour ❌No gluten ❌No added salt ❌No added artificial colors ❌No added preservatives ⬇️Low sugar, low sodium, low potassium, low phosphorus, low protein ✅Suitable for health care professionals, children, working adults, the elderly and health enthusiasts Use USDA/EU organic jasmine rice flour instead of wheat flour Contains real fruit pulp from the agricultural community, Chiang Rai Province",
      },
      zh: {
        name: "水果饼干套装，肾脏，糖尿病，血压，6包，仅需300泰铢（通常330），Phu Lae菠萝，免费送货！！！！！",
        description:
          "✅轻盈饼干，真果肉，精选有机茉莉香米粉 Ayo 由营养学家研发，由国家创新机构 NIA 资助🌍 与泰国玛希隆大学诗里拉吉医院医学院合作研发 ❌不含小麦粉 ❌不含麸质 ❌不添加盐 ❌不添加人工色素 ❌不添加防腐剂 ⬇️低糖、低钠、低钾、低磷、低蛋白 ✅适合医护人员、儿童、在职人士、老年人和健康爱好者 使用美国农业部/欧盟有机茉莉香米粉代替小麦粉 含有来自清莱府农业社区的真果肉",
      },
      ja: {
        name: "フルーツ クッキー セット、腎臓、糖尿病、血圧、6 パック、たった 300 バーツ (通常 330)、プー ラエ パイナップル、送料無料!!!!!",
        description:
          "✅軽いクッキー、本物のフルーツパルプ、厳選されたオーガニックジャスミン米粉 栄養士が研究開発し、国立イノベーション機構（NIA）の資金提供を受けています🌍 マヒドン大学シリラート病院医学部との共同研究開発 ❌小麦粉不使用 ❌グルテンフリー ❌食塩不使用 ❌着色料不使用 ❌保存料不使用 ⬇️低糖、低ナトリウム、低カリウム、低リン、低タンパク質 ✅医療従事者、お子様、働く大人、高齢者、健康志向の方に最適です 小麦粉の代わりにUSDA/EU認定のオーガニックジャスミン米粉を使用 チェンライ県の農家が収穫した本物のフルーツパルプを使用",
      },
      ko: {
        name: "과일 쿠키 세트, 신장, 당뇨, 혈압, 6팩, 단 300바트(보통 330바트), 푸레 파인애플, 무료 배송!!!!!",
        description:
          "✅ 가벼운 쿠키, 진짜 과일 과육, 엄선된 유기농 자스민 쌀가루 Ayo는 영양학자들이 연구 개발하고, 국가 혁신 기관 NIA의 지원을 받았습니다.🌍 마히돌 대학교 시리랏 병원 의과대학과 협력하여 연구 개발되었습니다. ❌밀가루 무첨가 ❌글루텐 무첨가 ❌소금 무첨가 ❌인공 색소 무첨가 ❌방부제 무첨가 ⬇️저당, 저나트륨, 저칼륨, 저인, 저단백질 ✅의료 전문가, 어린이, 직장인, 노인 및 건강 애호가에게 적합 밀가루 대신 USDA/EU 유기농 자스민 쌀가루 사용 치앙라이 주 농업 공동체의 진짜 과일 과육 함유",
      },
      id: {
        name: "Set Kue Buah, Ginjal, Diabetes, Tekanan Darah, 6 bungkus, hanya 300 baht (biasanya 330), Nanas Phu Lae, pengiriman gratis!!!!!",
        description:
          "✅Kue kering ringan, bubur buah asli, tepung beras melati organik pilihan Ayo diteliti dan dikembangkan oleh ahli gizi, didanai oleh Badan Inovasi Nasional NIA🌍 Diteliti dan dikembangkan bekerja sama dengan Fakultas Kedokteran Rumah Sakit Siriraj, Universitas Mahidol ❌Tanpa tepung terigu ❌Tanpa gluten ❌Tanpa tambahan garam ❌Tanpa pewarna buatan ❌Tanpa pengawet tambahan ⬇️Rendah gula, rendah natrium, rendah kalium, rendah fosfor, rendah protein ✅Cocok untuk tenaga kesehatan, anak-anak, pekerja dewasa, lansia, dan penggemar kesehatan Gunakan tepung beras melati organik USDA/EU sebagai pengganti tepung terigu Mengandung bubur buah asli dari komunitas pertanian, Provinsi Chiang Rai",
      },
    },
  },
  {
    id: 6,
    name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ 6 ซอง เพียง 300 บาท (ปกติ 330) ขิง จัดส่งฟรี!!!!!",
    description:
      "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
    price: 300,
    currency: "฿",
    image: "/product6.png",
    link: "product/6",
    category: "cookies",
    priceId: "price_1RlZPmAom1IgIvKK0bL1rnAs",
    translations: {
      th: {
        name: "เซตคุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ 6 ซอง เพียง 300 บาท (ปกติ 330) ขิง จัดส่งฟรี!!!!!",
        description:
          "✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍 วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล ❌ไม่มีแป้งสาลี ❌ไม่มีกลูเตน ❌ไม่เติมเกลือ ❌ไม่เติมสีสังเคราะห์ ❌ไม่เติมสารกันเสีย ⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ ✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย",
      },
      en: {
        name: "Fruit Cookie Set, Kidney, Diabetes, Blood Pressure, 6 packs available, only 300 baht (usually 330) Ginger, free delivery!!!!!",
        description:
          "✅Light cookies, real fruit pulp, selected organic jasmine rice flour Ayo researched and developed by nutritionists, funded by the National Innovation Agency NIA🌍 Researched and developed in collaboration with the Faculty of Medicine Siriraj Hospital, Mahidol University ❌No wheat flour ❌No gluten ❌No added salt ❌No added artificial colors ❌No added preservatives ⬇️Low sugar, low sodium, low potassium, low phosphorus, low protein ✅Suitable for health care professionals, children, working adults, the elderly and health enthusiasts Use USDA/EU organic jasmine rice flour instead of wheat flour Contains real fruit pulp from the agricultural community, Chiang Rai Province",
      },
      zh: {
        name: "水果饼干套装，肾脏，糖尿病，血压，6包可用，仅需300泰铢（通常330）生姜，免费送货！！！！！",
        description:
          "✅轻盈饼干，真果肉，精选有机茉莉香米粉 Ayo 由营养学家研发，由国家创新机构 NIA 资助🌍 与泰国玛希隆大学诗里拉吉医院医学院合作研发 ❌不含小麦粉 ❌不含麸质 ❌不添加盐 ❌不添加人工色素 ❌不添加防腐剂 ⬇️低糖、低钠、低钾、低磷、低蛋白 ✅适合医护人员、儿童、在职人士、老年人和健康爱好者 使用美国农业部/欧盟有机茉莉香米粉代替小麦粉 含有来自清莱府农业社区的真果肉",
      },
      ja: {
        name: "フルーツ クッキー セット、腎臓、糖尿病、血圧、6 パックあり、わずか 300 バーツ (通常 330) ジンジャー、送料無料!!!!!",
        description:
          "✅軽いクッキー、本物のフルーツパルプ、厳選されたオーガニックジャスミン米粉 栄養士が研究開発し、国立イノベーション機構（NIA）の資金提供を受けています🌍 マヒドン大学シリラート病院医学部との共同研究開発 ❌小麦粉不使用 ❌グルテンフリー ❌食塩不使用 ❌人工着色料不使用 ❌保存料不使用 ⬇️低糖、低ナトリウム、低カリウム、低リン、低タンパク質 ✅医療従事者、お子様、働く大人、高齢者、健康志向の方に最適です 小麦粉の代わりにUSDA/EU認定のオーガニックジャスミン米粉を使用 チェンライ県の農業コミュニティで採れた本物のフルーツパルプを使用",
      },
      ko: {
        name: "과일 쿠키 세트, 신장, 당뇨, 혈압, 6팩 판매, 단 300바트(보통 330바트) 생강, 무료 배송!!!!!",
        description:
          "✅ 가벼운 쿠키, 진짜 과일 과육, 엄선된 유기농 자스민 쌀가루 Ayo는 국가 혁신 기관 NIA의 지원을 받아 영양학자들이 연구 개발했습니다.🌍 마히돌 대학교 시리랏 병원 의대와 협력하여 연구 개발되었습니다. ❌밀가루 무첨가 ❌글루텐 무첨가 ❌소금 무첨가 ❌인공 색소 무첨가 ❌방부제 무첨가 ⬇️저당, 저나트륨, 저칼륨, 저인, 저단백질 ✅의료 전문가, 어린이, 직장인, 노인 및 건강 애호가에게 적합 밀가루 대신 USDA/EU 유기농 자스민 쌀가루 사용 치앙라이 주 농업 공동체의 진짜 과일 과육 함유",
      },
      id: {
        name: "Set Kue Buah, Ginjal, Diabetes, Tekanan Darah, 6 bungkus tersedia, hanya 300 baht (biasanya 330) Jahe, pengiriman gratis!!!!!",
        description:
          "✅Kue kering ringan, bubur buah asli, tepung beras melati organik pilihan Diriset dan dikembangkan oleh ahli gizi, didanai oleh Badan Inovasi Nasional NIA🌍 Diriset dan dikembangkan bekerja sama dengan Fakultas Kedokteran Rumah Sakit Siriraj, Universitas Mahidol ❌Tanpa tepung terigu ❌Tanpa gluten ❌Tanpa tambahan garam ❌Tanpa pewarna buatan ❌Tanpa pengawet tambahan ⬇️Rendah gula, rendah natrium, rendah kalium, rendah fosfor, rendah protein ✅Cocok untuk tenaga kesehatan, anak-anak, pekerja dewasa, lansia, dan penggemar kesehatan Gunakan tepung beras melati organik USDA/EU sebagai pengganti tepung terigu Mengandung bubur buah asli dari komunitas pertanian, Provinsi Chiang Rai",
      },
    },
  },
  {
    id: 7,
    name: "เซตรสยอดฮิต!!! คุกกี้ผลไม้ ไต เบาหวาน ความดัน ทานได้ 6 ซอง เพียง 300 บาท (ปกติ 330)สตอร์เบอรรี่+สับปะรด จัดส่งฟรี!!!!! ",
    description: `✅ไลท์คุกกี้ เนื้อผลไม้เเท้ คัดสรรแป้งข้าวหอมมะลิ ออร์เเกนิค
เอโยะ วิจัยและพัฒนาโดยนักโภชนาการ ได้ทุนวิจัยจากสำนักงานนวัตกรรมแห่งชาติ NIA🌍
วิจัยและพัฒนาร่วมกับคณะแพทยศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล
❌ไม่มีแป้งสาลี
❌ไม่มีกลูเตน
❌ไม่เติมเกลือ
❌ไม่เติมสีสังเคราะห์
❌ไม่เติมสารกันเสีย

⬇️น้ำตาลต่ำ โชเดียมต่ำ โพแทสเซียมต่ำ ฟอสฟอรัสต่ำ โปรตีนต่ำ
✅เหมาะสำหรับผู้ดูแลสุขภาพ เด็ก วัยทำงาน ผู้สูงอายุและผู้รักสุขภาพ

ใช้แป้งข้าวหอมมะลิออร์แกนิคมาตรฐาน USDA/EU แทนแป้งสาลี
มีเนื้อผลไม้แท้ จากชุมชนเกษตรกร จังหวัดเชียงราย`,
    price: 300,
    currency: "฿",
    image: "/product7.png",
    link: "product/7",
    category: "cookies",
    priceId: "price_1RlZQeAom1IgIvKKxx6YvIGy",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 8,
    name: "✨เอโยะ (Eiyo) ซุปข้าวออร์แกนิคผสมเนื้อสัตว์ ผักรวมและผลไม้ คละ 2 สูตร คิดค้นโดยนักกำหนดอาหาร ",
    description: `✨เอโยะ (Eiyo) ซุปข้าวออร์แกนิคผสมเนื้อสัตว์ ผักรวมและผลไม้ มี 2 สูตร คิดค้นโดยนักกำหนดอาหาร เพื่อให้มีพลังงาน สารอาหาร วิตามินและแร่ ธาตุที่จำเป็น 10 ชนิด

📌เหมาะสำหรับ
เด็ก 6 เดือนขึ้นไป วัยทำงาน วัยสูงอายุ
และผู้ดูแลสุขภาพ (โรคไต เบาหวาน ความดัน) รวมถึงผู้ใช้อาหารทาง
สาย

🏆มาตรฐาน รางวัล ที่ได้รับ🏆
GMP / Halal / USDA organic / EU organic
🏆รางวัลชนะเลิศอันดับ 2 โครงการ SME D Scaleup Curry&Herb Innovation จาก มหาวิทยาลัยสงขลนครินทร์ และ SME bank
🏆รางวัลชนะเลิศ DTN business plan award 2019

🌍วิธีการเตรียม✨
1 ซอง ขนาดบรรจุ 25 กรัม/ชอง สามารถแบ่งได้ 2 มื้อ หรือ 2 ถ้วย เพียง
ใช้ช้อนตัก 1 ช้อนโต๊ะ
หรือ เทครึ่งซอง แล้วผสมกับนมแม่ หรือ น้ำเปล่า หรือ น้ำอุ่น หรือ น้ำซุป
2-3 ออนซ์ ก็จะได้ 1 ถ้วย
หรือ 1 มื้อ ที่เหลือ สามารถมัดปากซองเก็บในตู้เย็นไว้ มื้อต่อไป ได้อีก
3-5 วัน

สูตรไก่ : ข้าวกล้องอินทรีย์ เนื้อไก่ล้วน ผักโขม มะเขือเทศ หัวหอม
(อย. 50-2-04460-6-0029)

สูตรไข่ : ข้าวกล้องอินทรีย์ ไข่ ผักกาดขาว แครอท ฟักทอง และกล้วย
(อย. 50-2-04460-6-0028)

ส่วนประกอบ สูตรไก่ : ข้าวกล้องออร์แกนิค 25%, ข้าวหอมมะลิออร์แกนิ
ค 21%, ไก่ 12%, แอปเปิ้ล 10%, ผักโขม 8%, มะเขือเทศ 8%, หัวหอม
ใหญ่ 8%, ข้าวไรซ์เบอร์รี่ออร์แกนิค 5.5%, วิตามินและแร่ธาตุ 2.5%

ส่วนประกอบ สูตรไข่ :
ข้าวกล้องออร์แกนิค 25%, ข้าวหอมมะลิออร์แกนิค 21%, ไข่ไก่ 12%,
กล้วย 10%, ผักกาดขาว 8%, ฟักทอง 8%, แครอท 8%, ข้าวไรซ์เบอร์รี
ออร์แกนิค 5.5%, วิตามินและแร่ธาตุ 2.5%`,
    price: 250,
    currency: "฿",
    image: "/product8.png",
    link: "product/8",
    category: "cookies",
    priceId: "price_1RlZRJAom1IgIvKKKRGRLARs",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 9,
    name: "✨เอโยะ (Eiyo) ซุปข้าวออร์แกนิคผสมเนื้อสัตว์ ผักรวมและผลไม้ สูตรไก่ คิดค้นโดยนักกำหนดอาหาร ",
    description: `✨เอโยะ (Eiyo) ซุปข้าวออร์แกนิคผสมเนื้อสัตว์ ผักรวมและผลไม้ มี 2 สูตร คิดค้นโดยนักกำหนดอาหาร เพื่อให้มีพลังงาน สารอาหาร วิตามินและแร่ ธาตุที่จำเป็น 10 ชนิด

📌เหมาะสำหรับ
เด็ก 6 เดือนขึ้นไป วัยทำงาน วัยสูงอายุ
และผู้ดูแลสุขภาพ (โรคไต เบาหวาน ความดัน) รวมถึงผู้ใช้อาหารทาง
สาย

🏆มาตรฐาน รางวัล ที่ได้รับ🏆
GMP / Halal / USDA organic / EU organic
🏆รางวัลชนะเลิศอันดับ 2 โครงการ SME D Scaleup Curry&Herb Innovation จาก มหาวิทยาลัยสงขลนครินทร์ และ SME bank
🏆รางวัลชนะเลิศ DTN business plan award 2019

🌍วิธีการเตรียม✨
1 ซอง ขนาดบรรจุ 25 กรัม/ชอง สามารถแบ่งได้ 2 มื้อ หรือ 2 ถ้วย เพียง
ใช้ช้อนตัก 1 ช้อนโต๊ะ
หรือ เทครึ่งซอง แล้วผสมกับนมแม่ หรือ น้ำเปล่า หรือ น้ำอุ่น หรือ น้ำซุป
2-3 ออนซ์ ก็จะได้ 1 ถ้วย
หรือ 1 มื้อ ที่เหลือ สามารถมัดปากซองเก็บในตู้เย็นไว้ มื้อต่อไป ได้อีก
3-5 วัน

สูตรไก่ : ข้าวกล้องอินทรีย์ เนื้อไก่ล้วน ผักโขม มะเขือเทศ หัวหอม
(อย. 50-2-04460-6-0029)

ส่วนประกอบ สูตรไก่ : ข้าวกล้องออร์แกนิค 25%, ข้าวหอมมะลิออร์แกนิ
ค 21%, ไก่ 12%, แอปเปิ้ล 10%, ผักโขม 8%, มะเขือเทศ 8%, หัวหอม
ใหญ่ 8%, ข้าวไรซ์เบอร์รี่ออร์แกนิค 5.5%, วิตามินและแร่ธาตุ 2.5%`,
    price: 250,
    currency: "฿",
    image: "/product9.png",
    link: "product/9",
    category: "cookies",
    priceId: "price_1RlZRjAom1IgIvKKKrcaJrJN",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 10,
    name: "✨เอโยะ (Eiyo) ซุปข้าวออร์แกนิคผสมเนื้อสัตว์ ผักรวมและผลไม้ สูตรไข่ คิดค้นโดยนักกำหนดอาหาร ",
    description: `✨เอโยะ (Eiyo) ซุปข้าวออร์แกนิคผสมเนื้อสัตว์ ผักรวมและผลไม้ มี 2 สูตร คิดค้นโดยนักกำหนดอาหาร เพื่อให้มีพลังงาน สารอาหาร วิตามินและแร่ ธาตุที่จำเป็น 10 ชนิด

📌เหมาะสำหรับ
เด็ก 6 เดือนขึ้นไป วัยทำงาน วัยสูงอายุ
และผู้ดูแลสุขภาพ (โรคไต เบาหวาน ความดัน) รวมถึงผู้ใช้อาหารทาง
สาย

🏆มาตรฐาน รางวัล ที่ได้รับ🏆
GMP / Halal / USDA organic / EU organic
🏆รางวัลชนะเลิศอันดับ 2 โครงการ SME D Scaleup Curry&Herb Innovation จาก มหาวิทยาลัยสงขลนครินทร์ และ SME bank
🏆รางวัลชนะเลิศ DTN business plan award 2019

🌍วิธีการเตรียม✨
1 ซอง ขนาดบรรจุ 25 กรัม/ชอง สามารถแบ่งได้ 2 มื้อ หรือ 2 ถ้วย เพียง
ใช้ช้อนตัก 1 ช้อนโต๊ะ
หรือ เทครึ่งซอง แล้วผสมกับนมแม่ หรือ น้ำเปล่า หรือ น้ำอุ่น หรือ น้ำซุป
2-3 ออนซ์ ก็จะได้ 1 ถ้วย
หรือ 1 มื้อ ที่เหลือ สามารถมัดปากซองเก็บในตู้เย็นไว้ มื้อต่อไป ได้อีก
3-5 วัน

สูตรไก่ : ข้าวกล้องอินทรีย์ เนื้อไก่ล้วน ผักโขม มะเขือเทศ หัวหอม
(อย. 50-2-04460-6-0029)

ส่วนประกอบ สูตรไข่ :
ข้าวกล้องออร์แกนิค 25%, ข้าวหอมมะลิออร์แกนิค 21%, ไข่ไก่ 12%,
กล้วย 10%, ผักกาดขาว 8%, ฟักทอง 8%, แครอท 8%, ข้าวไรซ์เบอร์รี
ออร์แกนิค 5.5%, วิตามินและแร่ธาตุ 2.5%`,
    price: 250,
    currency: "฿",
    image: "/product10.png",
    link: "product/10",
    category: "cookies",
    priceId: "price_1RlZRjAom1IgIvKKKrcaJrJN",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 11,
    name: "ชาสมุนไพรเอ็มบี (MB) เซต เพื่อผู้หญิง | สวยจากภายในสู่ภายนอก  ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ",
    description: `ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ
สั่งตอนนี้ แล้วจะติดใจ! เพราะ ชาเอ็มบี คือชาที่ "ไม่มีชา" พร้อมดูแลสุขภาพให้คุณเอง! ทุกสูตรของเราผลิตจากสมุนไพรออร์แกนิกคัดสรรอย่างพิถีพิถัน โดยผู้เชี่ยวชาญด้านสมุนไพรที่มีประสบการณ์ยาวนานกว่า 70 ปี! มั่นใจได้ในคุณภาพ ปลอดภัย และที่สำคัญ "ไม่มีใบชาผสม" เพื่อให้คุณได้รับประโยชน์จากสมุนไพรอย่างเต็มที่ในทุกแก้วดูแลสุขภาพสุภาพสตรีให้สมบูรณ์แบบด้วยชาสมุนไพร 3 ชนิด:

ชาว่าน: บำรุงภายในสตรี ปรับสมดุลฮอร์โมน ลดอาการปวดประจำเดือน ช่วยให้ผิวพรรณสดใส

ชาคำฝอย: บำรุงโลหิต ช่วยให้ประจำเดือนมาปกติ ลดไขมันในเส้นเลือด และเสริมการไหลเวียนโลหิตที่ดี

ชาอัญชัน: อุดมด้วยสารต้านอนุมูลอิสระ บำรุงสายตา บำรุงผม และช่วยให้ผ่อนคลาย

คำอธิบาย: ให้คุณผู้หญิงดูแลตัวเองได้ง่ายๆ ในทุกวัน ด้วยชาสมุนไพรที่ออกแบบมาเพื่อฟื้นฟูและบำรุงจากภายในสู่ภายนอก มอบความสดใส สุขภาพดี และคืนความมั่นใจให้คุณเปล่งประกาย`,
    price: 360,
    currency: "฿",
    image: "/product11.JPG",
    link: "product/11",
    category: "cookies",
    priceId: "price_1RlZScAom1IgIvKKmScbVCzr",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 12,
    name: "ชาสมุนไพรเอ็มบี (MB) เซต ชาเพื่อผู้ชาย | เสริมพลังกายใจ ให้ฟิตพร้อมทุกวัน  ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ",
    description: `ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ
สั่งตอนนี้ แล้วจะติดใจ! เพราะ ชาเอ็มบี คือชาที่ "ไม่มีชา" พร้อมดูแลสุขภาพให้คุณเอง! ทุกสูตรของเราผลิตจากสมุนไพรออร์แกนิกคัดสรรอย่างพิถีพิถัน โดยผู้เชี่ยวชาญด้านสมุนไพรที่มีประสบการณ์ยาวนานกว่า 70 ปี! มั่นใจได้ในคุณภาพ ปลอดภัย และที่สำคัญ "ไม่มีใบชาผสม" เพื่อให้คุณได้รับประโยชน์จากสมุนไพรอย่างเต็มที่ในทุกแก้ว ชาเพื่อผู้ชาย | เสริมพลังกายใจ ให้ฟิตพร้อมทุกวัน เติมเต็มพลังและดูแลสุขภาพบุรุษให้แข็งแรง พร้อมลุยทุกกิจกรรม:

ชาเถาวัลย์เปรียง: คลายเส้น คลายปวดเมื่อย บำรุงกำลัง บำรุงข้อเข่า ลดการอักเสบของกล้ามเนื้อ

ชาม้ากระทืบโรง: เสริมสมรรถภาพ บำรุงกำลัง เพิ่มความกระปรี้กระเปร่า ให้คุณพร้อมทุกสถานการณ์

ชาขิง: ช่วยย่อยอาหาร ลดแก๊สในกระเพาะ บรรเทาอาการคลื่นไส้ เพิ่มความอบอุ่นให้ร่างกาย

ชาสำหรับคุณผู้ชายยุคใหม่ ที่ต้องการดูแลสุขภาพให้แข็งแรง กระปรี้กระเปร่า พร้อมรับมือกับทุกความท้าทาย เสริมสร้างพลังจากธรรมชาติ เพื่อชีวิตที่สมบูรณ์แบบ`,
    price: 360,
    currency: "฿",
    image: "/product12.JPG",
    link: "product/12",
    category: "cookies",
    priceId: "price_1RlZSvAom1IgIvKKU8vFm1oG",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 13,
    name: "ชาสมุนไพรเอ็มบี (MB) เซต ชา DETOX | ล้างพิษ ปรับสมดุล คืนความสดใส  ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ",
    description: `ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ
สั่งตอนนี้ แล้วจะติดใจ! เพราะ ชาเอ็มบี คือชาที่ "ไม่มีชา" พร้อมดูแลสุขภาพให้คุณเอง! ทุกสูตรของเราผลิตจากสมุนไพรออร์แกนิกคัดสรรอย่างพิถีพิถัน โดยผู้เชี่ยวชาญด้านสมุนไพรที่มีประสบการณ์ยาวนานกว่า 70 ปี! มั่นใจได้ในคุณภาพ ปลอดภัย และที่สำคัญ "ไม่มีใบชาผสม" เพื่อให้คุณได้รับประโยชน์จากสมุนไพรอย่างเต็มที่ในทุกแก้ว ชำระล้างสารพิษในร่างกาย คืนความสดชื่น เบาสบาย:

ชามะขามแขก: ช่วยระบาย ขับของเสียที่คั่งค้างในลำไส้ได้อย่างอ่อนโยน ไม่ทำให้ปวดบิด

ชามะตูม: บำรุงธาตุ บรรเทาอาการท้องอืดท้องเฟ้อ ช่วยย่อยอาหาร และขับลม

ชากระเจี๊ยบ: ช่วยขับปัสสาวะ ลดไขมันในเส้นเลือด มีวิตามินซีสูง และช่วยลดความดัน

ชาสูตรดีท็อกซ์ที่ช่วยล้างพิษ ขับของเสียสะสมออกจากร่างกายอย่างอ่อนโยน คืนความสมดุลให้ระบบขับถ่าย ทำให้คุณรู้สึกเบาสบาย สดชื่น และมีพลังในทุกวัน`,
    price: 360,
    currency: "฿",
    image: "/product13.png",
    link: "product/13",
    category: "cookies",
    priceId: "price_1RlZWHAom1IgIvKK149ovz3L",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 14,
    name: "ชาสมุนไพรเอ็มบี (MB) เซตชาสารต้านอนุมูลอิสระ เกราะป้องกันธรรมชาติเพื่อสุขภาพที่ยั่งยืน  ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ ",
    description: `ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ
สั่งตอนนี้ แล้วจะติดใจ! เพราะ ชาเอ็มบี คือชาที่ "ไม่มีชา" พร้อมดูแลสุขภาพให้คุณเอง! ทุกสูตรของเราผลิตจากสมุนไพรออร์แกนิกคัดสรรอย่างพิถีพิถัน โดยผู้เชี่ยวชาญด้านสมุนไพรที่มีประสบการณ์ยาวนานกว่า 70 ปี! มั่นใจได้ในคุณภาพ ปลอดภัย และที่สำคัญ "ไม่มีใบชาผสม" เพื่อให้คุณได้รับประโยชน์จากสมุนไพรอย่างเต็มที่ในทุกแก้ว ปกป้องร่างกายจากภายใน เสริมสร้างภูมิคุ้มกันให้แข็งแรง:

ชาจิงจูฉ่าย: มีสารต้านอนุมูลอิสระสูง ช่วยเสริมสร้างภูมิคุ้มกัน และมีคุณสมบัติในการต่อต้านเซลล์ไม่พึงประสงค์

ชาใบหม่อน: ลดระดับน้ำตาลในเลือด ลดคอเลสเตอรอล มีสารต้านอนุมูลอิสระ และช่วยบำรุงหัวใจ

ชากระเจี๊ยบ: ลดความดันโลหิตสูง ลดไขมันในเส้นเลือด มีวิตามินซีสูง ช่วยขับปัสสาวะ

ชาสมุนไพรที่รวบรวมสุดยอดสมุนไพรต้านอนุมูลอิสระ เพื่อช่วยเสริมสร้างภูมิคุ้มกันของร่างกายให้แข็งแรง ปกป้องเซลล์ และดูแลสุขภาพในระยะยาว ให้คุณและคนที่คุณรักห่างไกลโรค`,
    price: 360,
    currency: "฿",
    image: "/product14.png",
    link: "product/14",
    category: "cookies",
    priceId: "price_1RlZWzAom1IgIvKK6T9CBFzR",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
  {
    id: 15,
    name: "ชาสมุนไพรเอ็มบี (MB) เซต ชาสำหรับคุณแม่ | บำรุงน้ำนม ฟื้นฟูกำลังหลังคลอด ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ ",
    description: `ชาสมุนไพรสูตรลับเฉพาะ: ดูแลสุขภาพตามศาสตร์ไทยโบราณ
สั่งตอนนี้ แล้วจะติดใจ! เพราะ ชาเอ็มบี คือชาที่ "ไม่มีชา" พร้อมดูแลสุขภาพให้คุณเอง! ทุกสูตรของเราผลิตจากสมุนไพรออร์แกนิกคัดสรรอย่างพิถีพิถัน โดยผู้เชี่ยวชาญด้านสมุนไพรที่มีประสบการณ์ยาวนานกว่า 70 ปี! มั่นใจได้ในคุณภาพ ปลอดภัย และที่สำคัญ "ไม่มีใบชาผสม" เพื่อให้คุณได้รับประโยชน์จากสมุนไพรอย่างเต็มที่ในทุกแก้ว ดูแลคุณแม่หลังคลอด ให้กลับมาแข็งแรงและมีน้ำนมให้ลูกน้อย:

ชาขิง: ช่วยขับน้ำคาวปลา ลดอาการหนาวในหลังคลอด เพิ่มการไหลเวียนโลหิต และกระตุ้นน้ำนม

ชาว่าน (ว่านชักมดลูก): ช่วยให้มดลูกเข้าอู่เร็วขึ้น บำรุงเลือดลม และปรับสมดุลร่างกายคุณแม่หลังคลอด

ชาประสะน้ำนม: สมุนไพรพิเศษที่ช่วยกระตุ้นการสร้างน้ำนมของคุณแม่ ให้มีน้ำนมเพียงพอสำหรับลูกน้อย

ชาสูตรพิเศษสำหรับคุณแม่คนเก่ง! ช่วยบำรุงฟื้นฟูร่างกายหลังคลอด ให้มดลูกเข้าอู่เร็วขึ้น พร้อมกระตุ้นและเพิ่มปริมาณน้ำนมให้ลูกน้อยของคุณเติบโตแข็งแรง อิ่มท้องในทุกวัน`,
    price: 360,
    currency: "฿",
    image: "/product15.png",
    link: "product/15",
    category: "cookies",
    priceId: "price_1RlZXGAom1IgIvKKYZ0uXug1",
    translations: {
      th: {
        name: "",
        description: "",
      },
      en: {
        name: "",
        description: "",
      },
      zh: {
        name: "",
        description: "",
      },
      ja: {
        name: "",
        description: "",
      },
      ko: {
        name: "",
        description: "",
      },
      id: {
        name: "",
        description: "",
      },
    },
  },
];

export const getRandomProduct = (): Product => {
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
};

export const getProductForLocale = (
  product: Product,
  locale: string
): Product => {
  return {
    ...product,
    name:
      product.translations[locale as keyof typeof product.translations]?.name ||
      product.name,
    description:
      product.translations[locale as keyof typeof product.translations]
        ?.description || product.description,
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
