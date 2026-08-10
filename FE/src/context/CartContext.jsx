import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Fallback migration: map any legacy 'qty' property to 'quantity'
      return parsed.map(item => ({
        ...item,
        quantity: item.quantity ?? item.qty ?? 1
      }));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast && toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (product, variant, qty = 1) => {
    if (!product || !variant) return;

    setToast({
      visible: true,
      productName: product.productName || product.name,
      image: variant.imageUrl || product.imageUrl || product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
      variantName: `Màu ${variant.color} / Size ${variant.size}`
    });

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === variant.variantId);
      const maxStock = variant.variantStock ?? product.stockQuantity ?? 99;

      if (existingItemIndex > -1) {
        return prevCart.map((item, idx) => {
          if (idx === existingItemIndex) {
            const currentQty = item.quantity ?? item.qty ?? 0;
            const newQty = Math.min(currentQty + qty, maxStock);
            return { ...item, quantity: newQty };
          }
          return item;
        });
      } else {
        const newItem = {
          id: variant.variantId,
          productId: product.productId || product.id,
          name: product.productName || product.name,
          brand: product.brandName || product.brand || 'Football Store',
          sku: variant.skuVariant || product.sku || '',
          size: variant.size,
          color: variant.color,
          variant: `${variant.color} / ${variant.size}`,
          price: variant.variantPrice || product.salePrice || product.price || 0,
          originalPrice: product.basePrice || product.originalPrice || 0,
          image: variant.imageUrl || product.imageUrl || product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
          quantity: Math.min(qty, maxStock),
          maxStock: maxStock
        };
        return [...prevCart, newItem];
      }
    });
  };

  const updateQty = (id, delta) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const currentQty = item.quantity ?? item.qty ?? 1;
          const newQty = Math.max(1, Math.min(currentQty + delta, item.maxStock || 99));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const removeItems = (ids) => {
    setCart(prevCart => prevCart.filter(item => !ids.includes(item.id)));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, removeItems, clearCart }}>
      {children}
      {toast && toast.visible && (
        <div className="cart-toast-container">
          <div className="cart-toast-header">
            <div className="cart-toast-title">
              <span className="cart-toast-check-icon">✓</span>
              <span>Đã thêm sản phẩm</span>
            </div>
            <button className="cart-toast-close" onClick={() => setToast(null)}>&times;</button>
          </div>
          <div className="cart-toast-body">
            <img src={toast.image} alt={toast.productName} className="cart-toast-img" />
            <div className="cart-toast-info">
              <p className="cart-toast-name">{toast.productName}</p>
              <p className="cart-toast-variant">{toast.variantName}</p>
            </div>
          </div>
          <a href="/gio-hang" className="cart-toast-btn">Xem giỏ hàng</a>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
