# Cart Persistence Features

## Overview

The cart system now supports persistent storage with user-specific data management. Cart data is automatically saved and restored when users navigate or close/reopen the app.

## Features

### ✅ **Persistent Storage**
- Cart data is automatically saved to localStorage
- Data persists across browser sessions and app restarts
- User-specific cart storage (separate carts for different users)

### ✅ **Anonymous vs User Carts**
- **Anonymous users**: Cart stored as `cart_anonymous`
- **Logged-in users**: Cart stored as `cart_{user_id}`
- Automatic merging when anonymous user logs in

### ✅ **Logout Cart Clearing**
- Cart data is automatically cleared when user logs out
- Both user-specific and anonymous cart data are removed
- Ensures clean state for next login

### ✅ **Cart Merging**
- When an anonymous user logs in, their cart items are merged with their existing user cart
- Duplicate items have quantities combined
- Anonymous cart is cleared after successful merge

## How It Works

### 1. **Cart Storage**
```typescript
// Anonymous user
localStorage.setItem('cart_anonymous', JSON.stringify(cartItems));

// Logged-in user
localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
```

### 2. **Cart Loading**
- Cart data is loaded when the app starts
- User-specific cart is loaded when user logs in
- Anonymous cart is loaded for non-authenticated users

### 3. **Cart Merging**
- Triggered when anonymous user logs in
- Combines quantities for duplicate items
- Preserves all unique items from both carts

### 4. **Cart Clearing**
- Manual clearing via `clearCart()` function
- Automatic clearing on logout
- Removes data from localStorage

## Usage Examples

### Basic Cart Operations
```typescript
const { cart, addToCart, removeFromCart, clearCart } = useCart();

// Add item to cart (automatically saved)
addToCart(product);

// Remove item from cart (automatically saved)
removeFromCart(productId);

// Clear entire cart (automatically saved)
clearCart();
```

### Cart Data Access
```typescript
// Get cart items
const items = cart;

// Get cart total
const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

// Get item count
const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
```

## File Structure

```
app/lib/
├── context/
│   ├── CartContext.tsx      # Main cart context with persistence
│   └── AuthContext.tsx      # Auth context with cart clearing on logout
└── utils/
    └── cartUtils.ts         # Utility functions for cart operations
```

## Benefits

1. **User Experience**: Cart items persist across sessions
2. **Data Integrity**: Automatic merging prevents data loss
3. **Security**: Cart data cleared on logout
4. **Performance**: Efficient localStorage operations
5. **Maintainability**: Clean separation of concerns

## Technical Details

- Uses localStorage for persistence
- Automatic error handling for corrupted data
- TypeScript support with proper typing
- Integration with existing auth system
- No external dependencies for storage 