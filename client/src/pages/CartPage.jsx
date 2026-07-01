import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateQty, removeItem, clearCart, selectCartTotal } from '../store/slices/cartSlice';
import Layout from '../components/common/Layout';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items } = useSelector((state) => state.cart);
  const subtotal = useSelector(selectCartTotal);
  
  const gst = subtotal * 0.05; // 5% GST on handloom textiles
  const total = subtotal + gst;

  const handleQtyChange = (productId, variantSku, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty <= 0) {
      dispatch(removeItem({ productId, variantSku }));
    } else {
      dispatch(updateQty({ productId, variantSku, qty: newQty }));
    }
  };

  const handleRemove = (productId, variantSku) => {
    dispatch(removeItem({ productId, variantSku }));
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px', color: 'var(--text-light)' }}>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '12px' }}>Your Shopping Cart is Empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Browse our premium collections to select handcrafted weaves and custom tassel configurations.</p>
            <Link to="/products" className="btn btn-primary">Browse Catalog</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="luxury-title" style={{ marginBottom: '32px' }}>
          <span style={{ textTransform: 'uppercase', color: 'var(--accent-dark)', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 700 }}>Your Selections</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>Shopping Cart</h1>
        </div>

        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }} className="animate-fade-in">
          
          {/* Cart Items List */}
          <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantSku}`} className="card" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '16px',
                flexWrap: 'wrap'
              }}>
                {/* Visual placeholder */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  overflow: 'hidden'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>

                {/* Details */}
                <div style={{ flex: '1 1 200px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', marginBottom: '4px' }}>{item.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>SKU: {item.variantSku}</span>
                </div>

                {/* Price */}
                <div style={{ minWidth: '100px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>₹{item.price.toLocaleString('en-IN')}</strong>
                </div>

                {/* Quantity controller */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <button
                    onClick={() => handleQtyChange(item.productId, item.variantSku, item.qty, -1)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'var(--bg-input)', cursor: 'pointer', fontWeight: 'bold' }}
                  >-</button>
                  <span style={{ width: '32px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.qty}</span>
                  <button
                    onClick={() => handleQtyChange(item.productId, item.variantSku, item.qty, 1)}
                    style={{ width: '32px', height: '32px', border: 'none', background: 'var(--bg-input)', cursor: 'pointer', fontWeight: 'bold' }}
                  >+</button>
                </div>

                {/* Total */}
                <div style={{ minWidth: '100px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Subtotal</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.productId, item.variantSku)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--error)',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove item"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button
                onClick={() => dispatch(clearCart())}
                className="btn btn-secondary"
                style={{ borderColor: 'var(--error)', color: 'var(--error)', padding: '8px 16px' }}
              >
                Clear Cart
              </button>
              <Link to="/products" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary Block */}
          <div className="card" style={{ flex: '1 1 300px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Handloom GST (5%)</span>
              <strong>₹{gst.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Estimated Total</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{total.toLocaleString('en-IN')}
              </strong>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1.05rem' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
