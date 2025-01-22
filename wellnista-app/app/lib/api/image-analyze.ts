export interface NutritionalInfo {
  product_name_en: string;
  brands: string;
  nutriments: {
    "energy-kcal_serving"?: number; // แคลอรี่
    fat?: number; // ไขมัน
    cholesterol?: number; // คอเลสเตอรอล
    carbohydrates?: number; // คาร์โบไฮเดรท
    proteins?: number; // โปรตีน
    sodium?: number; // โซเดียม
    "vitamin-a"?: number; // วิตามิน A
    "vitamin-b1"?: number; // วิตามิน B1
    "vitamin-b2"?: number; // วิตามิน B2
    calcium?: number; // แคลเซียม
    iron?: number; // ธาตุเหล็ก
  };
  [key: string]: unknown; // รองรับฟิลด์เพิ่มเติมที่ไม่ระบุ
}
  
  export async function fetchProductByBarcode(barcode: string): Promise<NutritionalInfo | null> {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch product data: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data || data.status !== 1 || !data.product) {
        throw new Error("Product not found or incomplete data");
      }
  
      return data.product as NutritionalInfo;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  }
  