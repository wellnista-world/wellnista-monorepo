export interface NutritionalInfo {
    product_name: string;
    brands: string;
    nutriments: {
      energy?: number;
      fat?: number;
      carbohydrates?: number;
      proteins?: number;
    };
    [key: string]: unknown; // รองรับฟิลด์อื่น ๆ ที่ไม่ระบุ
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
  