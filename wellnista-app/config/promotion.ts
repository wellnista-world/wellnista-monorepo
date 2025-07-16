export interface Promotion {
  id: number;
  name: string;
  description: string;
  code: string;
  stripeId: string;
  discount: number;
  discountType: 'percentage' | 'fixed'; // 'percentage' for %, 'fixed' for fixed amount
}

export const promotions: Promotion[] = [
    {
        id: 1,
        name: "D_CODE",
        description: "",
        code: "POINT10",
        stripeId: "promo_1RlXJzAom1IgIvKKQZdDBSql",
        discount: 50,
        discountType: 'fixed' // Fixed amount discount (50 THB)
    }
]