# Stripe Checkout Setup Guide

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Stripe Setup Steps

1. **Create a Stripe Account**: Sign up at https://stripe.com

2. **Get API Keys**: 
   - Go to Stripe Dashboard > Developers > API keys
   - Copy your publishable key and secret key

3. **Enable PromptPay**:
   - Go to Stripe Dashboard > Settings > Payment methods
   - Enable PromptPay for Thailand

4. **Create Products in Stripe**:
   - Go to Stripe Dashboard > Products
   - Create products with the same `priceId` as in your `products.ts` file
   - Make sure to set the currency to THB (Thai Baht)

5. **Set up Webhooks** (Optional but recommended):
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook secret

## Features Implemented

✅ **Stripe Checkout Integration**
- PromptPay payment method only
- Address collection (billing and shipping)
- Order metadata storage

✅ **Checkout Flow**
- Cart page with "Proceed to Checkout" button
- Checkout page with address form
- Order summary display
- Payment processing via Stripe

✅ **Success Page**
- Payment confirmation
- Order reference display
- Cart clearing after successful payment

✅ **Webhook Handler**
- Payment event processing
- Extensible for order management

## File Structure

```
app/
├── api/
│   ├── create-checkout-session/
│   │   └── route.ts          # Creates Stripe checkout sessions
│   └── webhooks/
│       └── stripe/
│           └── route.ts      # Handles Stripe webhook events
├── checkout/
│   ├── page.tsx              # Checkout page with address form
│   └── success/
│       └── page.tsx          # Success page after payment
└── cart/
    └── page.tsx              # Updated to link to checkout
```

## Usage

1. Users add products to cart
2. Click "Proceed to Checkout" on cart page
3. Fill in shipping address on checkout page
4. Click "Pay" to redirect to Stripe Checkout
5. Complete payment via PromptPay
6. Redirected to success page
7. Cart is automatically cleared

## Customization

- Modify the address form fields in `checkout/page.tsx`
- Update success page content in `checkout/success/page.tsx`
- Add order management logic in webhook handler
- Customize styling using Tailwind CSS classes 