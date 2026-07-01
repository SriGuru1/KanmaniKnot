import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { selectCartTotal, clearCart } from '../store/slices/cartSlice';
import { placeNewOrder } from '../store/slices/orderSlice';
import Layout from '../components/common/Layout';
import axios from 'axios';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const subtotal = useSelector(selectCartTotal);
  const { user } = useSelector((state) => state.auth);

  const [line1, setLine1] = useState('Flat 402, Lotus Greens');
  const [line2, setLine2] = useState('Jayanagar 4th Block');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560041');
  const [phone, setPhone] = useState('+91 99999 88888');

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  // Protect page - must be logged in as customer to checkout
  useEffect(() => {
    if (!user) {
      // Don't auto-redirect, we will show a clean login CTA card on this page
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
            <h2>No Items for Checkout</h2>
            <p style={{ color: 'var(--text-muted)', margin: '16px 0 32px 0' }}>Add sarees to your cart before proceeding to checkout.</p>
            <Link to="/products" className="btn btn-primary">Browse Catalog</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError(null);
    setCheckoutLoading(true);

    if (!line1 || !city || !state || !pincode || !phone) {
      setCheckoutError('Please fill in all required shipping address fields');
      setCheckoutLoading(false);
      return;
    }

    try {
      // 1. Create order on server (status PENDING)
      const orderPayload = {
        items: items.map(i => ({
          productId: i.productId,
          variantSku: i.variantSku,
          qty: i.qty,
          price: i.price,
          name: i.name
        })),
        shippingAddress: { line1, line2, city, state, pincode, phone }
      };

      // We make the API call using our Redux placeNewOrder thunk
      const orderResult = await dispatch(placeNewOrder(orderPayload)).unwrap();
      const orderId = orderResult._id;

      // 2. Initiate Payment Order (Simulated / Razorpay Fallback)
      const { data: pData } = await axios.post('/api/payments/create-order', {
        orderId,
        amount: total
      });

      // 3. Confirm Payment (Simulating callback verification)
      // Since this is a demo fallback mode, the backend create-order returns a mock ID if Razorpay is not configured
      // We pass the payment confirmation directly
      const verifyPayload = {
        orderId,
        razorpayOrderId: pData.razorpayOrderId,
        razorpayPaymentId: 'pay_demo_success_' + Date.now(),
        signature: 'demo_sig_verified_hmac_sha256'
      };

      await axios.post('/api/payments/verify', verifyPayload);

      // 4. Success checkout
      dispatch(clearCart());
      setCheckoutLoading(false);
      alert('Order Placed and Paid Successfully! Redirecting to orders...');
      navigate('/orders');

    } catch (err) {
      setCheckoutError(err.response?.data?.error || err.message || 'Checkout failed. Please try again.');
      setCheckoutLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="luxury-title" style={{ marginBottom: '32px' }}>
          <span style={{ textTransform: 'uppercase', color: 'var(--accent-dark)', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 700 }}>Fulfillment Details</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>Checkout</h1>
        </div>

        {!user ? (
          <div className="card text-center" style={{ maxWidth: '560px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', marginBottom: '20px' }}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
            <h2 style={{ color: 'var(--primary-dark)', marginBottom: '12px' }}>Sign In Required to Place Order</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>
              You need to be logged in to place orders and track delivery timelines. Please sign in as a Customer or Boutique Admin to continue.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px' }}>Sign In Here</Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '10px 24px' }}>Register Boutique</Link>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }} className="animate-fade-in">
            
            {/* Shipping Form Panel */}
            <div className="card" style={{ flex: '2 1 500px', padding: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                Shipping & Delivery Address
              </h3>
              
              {checkoutError && (
                <div style={{
                  backgroundColor: 'rgba(198, 40, 40, 0.08)',
                  border: '1px solid var(--error)',
                  color: 'var(--error)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  fontSize: '0.9rem'
                }}>
                  {checkoutError}
                </div>
              )}

              <form onSubmit={handlePlaceOrder}>
                <div className="form-group">
                  <label className="form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong>Demo Auto-Approval Gateway:</strong> Payments will be simulated and confirmed instantly with mock credentials. No real funds needed.
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Processing Simulated Payment...' : `Authorize Payment — ₹${total.toLocaleString('en-IN')}`}
                </button>
              </form>
            </div>

            {/* Checkout Items Summary */}
            <div className="card" style={{ flex: '1 1 320px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Items & Order</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
                {items.map(item => (
                  <div key={`${item.productId}-${item.variantSku}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)', flex: 1, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.qty}x {item.name}
                    </span>
                    <strong style={{ marginLeft: '12px' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                  <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                  <strong>₹{gst.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: '12px', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600 }}>Total Order Value</span>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    ₹{total.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
