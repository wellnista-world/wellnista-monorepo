interface NutritionalInfo {
    product_name: string;
    brands: string;
    nutriments: {
      energy?: number;
      fat?: number;
      carbohydrates?: number;
      proteins?: number;
    };
    [key: string]: unknown; // Use `unknown` for additional unspecified fields
  }
  
  export async function fetchProductByBarcode(barcode: string): Promise<NutritionalInfo | null> {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }
  
      const data: { status: number; product: NutritionalInfo } = await response.json();
  
      if (data.status !== 1) {
        throw new Error("Product not found");
      }
  
      return data.product;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  }
  