"use client";

import { useState } from 'react';
import { useCart } from '../lib/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { TextField, Button, Paper, Divider } from '@mui/material';

const stripePromise = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.error('Stripe publishable key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file');
    return null;
  }
  return loadStripe(publishableKey);
})();

interface AddressForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleInputChange = (field: keyof AddressForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate form
    const requiredFields: (keyof AddressForm)[] = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    const missingFields = requiredFields.filter(field => !addressForm[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          address: addressForm,
        }),
      });

      const { sessionId, error } = await response.json();

      console.log(sessionId);

      if (error) {
        throw new Error(error);
      }

      if (!stripePromise) {
        throw new Error('Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      console.log(stripe);

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      console.log(stripeError);


      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to proceed to checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/cart">
            <div className="text-primary cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>
          <Typography variant="h5" component="h1" className="font-bold text-primary">Checkout</Typography>
          <div className="w-6"></div>
        </div>
        <div className="text-center text-gray-500 mt-20">
          <Typography variant="h6">Your cart is empty.</Typography>
          <Link href="/product" className="text-primary underline mt-4 inline-block">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <Link href="/cart">
          <div className="text-primary cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </Link>
        <Typography variant="h5" component="h1" className="font-bold text-primary">Checkout</Typography>
        <div className="w-6"></div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Order Summary */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-bold mb-4">Order Summary</Typography>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div>
                  <Typography className="font-medium">{item.product.name}</Typography>
                  <Typography className="text-sm text-gray-600">Qty: {item.quantity}</Typography>
                </div>
                <Typography className="font-medium">
                  {item.product.currency}{(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </div>
            ))}
          </div>
          <Divider className="my-4" />
          <div className="flex justify-between items-center">
            <Typography variant="h6" className="font-bold">Total:</Typography>
            <Typography variant="h6" className="font-bold text-primary">
              {cart[0]?.product.currency || ''}{total.toFixed(2)}
            </Typography>
          </div>
        </Paper>

        {/* Shipping Address Form */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-bold mb-4">Shipping Address</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="First Name"
              value={addressForm.firstName}
              onChange={handleInputChange('firstName')}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              value={addressForm.lastName}
              onChange={handleInputChange('lastName')}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={addressForm.email}
              onChange={handleInputChange('email')}
              required
              fullWidth
            />
            <TextField
              label="Phone"
              value={addressForm.phone}
              onChange={handleInputChange('phone')}
              required
              fullWidth
            />
            <TextField
              label="Address"
              value={addressForm.address}
              onChange={handleInputChange('address')}
              required
              fullWidth
              multiline
              rows={3}
              className="md:col-span-2"
            />
            <TextField
              label="City"
              value={addressForm.city}
              onChange={handleInputChange('city')}
              required
              fullWidth
            />
            <TextField
              label="Postal Code"
              value={addressForm.postalCode}
              onChange={handleInputChange('postalCode')}
              required
              fullWidth
            />
          </div>
        </Paper>

        {/* Payment Method */}
        <Paper className="p-6">
          <Typography variant="h6" className="font-bold mb-4">Payment Method</Typography>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <Typography className="font-medium">PromptPay</Typography>
              <Typography className="text-sm text-gray-600">Secure payment via PromptPay</Typography>
            </div>
          </div>
        </Paper>

        {/* Checkout Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleCheckout}
          disabled={isLoading}
          className="bg-primary hover:bg-accent"
          sx={{ py: 2, fontSize: '1.1rem' }}
        >
          {isLoading ? 'Processing...' : `Pay ${cart[0]?.product.currency || ''}${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
} 