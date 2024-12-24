export async function fetchProductByBarcode(barcode: string): Promise<any> {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }
  
      const data = await response.json();
      if (data.status !== 1) {
        throw new Error("Product not found");
      }
  
      return data.product;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  