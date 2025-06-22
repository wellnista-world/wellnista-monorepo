"use client";
import { useCart } from '../lib/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Typography from '@mui/material/Typography';

export default function CartPage() {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useCart();
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <Link href="/product">
          <div className="text-primary cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </Link>
        <Typography variant="h5" component="h1" className="font-bold text-primary">My Cart</Typography>
        <div className="w-6"></div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <Typography variant="h6">Your cart is empty.</Typography>
          <Link href="/product" className="text-primary underline mt-4 inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <Image src={item.product.image} alt={item.product.name} width={80} height={80} className="rounded-md object-cover" />
                <div className="flex-grow ml-4">
                  <Typography className="font-semibold">{item.product.name}</Typography>
                  <Typography className="text-gray-600">{item.product.currency}{item.product.price}</Typography>
                </div>
                <div className="flex items-center">
                  <button onClick={() => decrementQuantity(item.product.id)} className="px-2 py-1 bg-gray-200 rounded-md">-</button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.product.id)} className="px-2 py-1 bg-gray-200 rounded-md">+</button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="ml-4 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <Typography className="text-lg font-semibold">Total:</Typography>
              <Typography className="text-xl font-bold">{cart[0]?.product.currency || ''}{total.toFixed(2)}</Typography>
            </div>
            <Link href="/checkout" className="block">
              <button className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
} 