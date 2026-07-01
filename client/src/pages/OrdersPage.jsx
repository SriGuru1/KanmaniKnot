import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders, fetchTenantOrders, updateOrderStatus, cancelOrder } from '../store/slices/orderSlice';
import Layout from '../components/common/Layout';

export default function OrdersPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { myOrders, tenantOrders, loading, actionLoading } = useSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatusVal, setUpdateStatusVal] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [cancelReasonVal, setCancelReasonVal] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isAdmin = user && (user.role === 'tenant_admin' || user.role === 'platform_admin');
  const ordersList = isAdmin ? tenantOrders : myOrders;

  // Load orders on mount or when user changes
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        dispatch(fetchTenantOrders());
      } else {
        dispatch(fetchMyOrders());
      }
    }
  }, [dispatch, user, isAdmin]);

  // Set default selected order when orders list changes
  useEffect(() => {
    if (ordersList && ordersList.length > 0) {
      // Keep selected order updated if it was already selected
      if (selectedOrder) {
        const updated = ordersList.find(o => o._id === selectedOrder._id);
        if (updated) setSelectedOrder(updated);
      } else {
        setSelectedOrder(ordersList[0]);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [ordersList, selectedOrder]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !updateStatusVal) return;

    try {
      await dispatch(updateOrderStatus({
        orderId: selectedOrder._id,
        newStatus: updateStatusVal,
        note: updateNote || `Order transitioned to ${updateStatusVal}`
      })).unwrap();
      
      setUpdateStatusVal('');
      setUpdateNote('');
      alert('Order status updated successfully!');
    } catch (err) {
      alert(err || 'Failed to update status. Check transition state permissions.');
    }
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !cancelReasonVal) return;

    try {
      await dispatch(cancelOrder({
        orderId: selectedOrder._id,
        reason: cancelReasonVal
      })).unwrap();

      setCancelReasonVal('');
      setShowCancelModal(false);
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err || 'Failed to cancel order.');
    }
  };

  const getStatusBadgeClass = (status) => {
    return `badge badge-${status.toLowerCase()}`;
  };

  if (!user) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
            <h2>Sign In to View Orders</h2>
            <p style={{ color: 'var(--text-muted)', margin: '16px 0 32px 0' }}>Please log in to check your order queue or customer delivery statuses.</p>
            <Link to="/login" className="btn btn-primary">Sign In Portal</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="luxury-title" style={{ marginBottom: '32px' }}>
          <span style={{ textTransform: 'uppercase', color: 'var(--accent-dark)', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 700 }}>
            {isAdmin ? 'Store Fulfilment Queue' : 'My Purchase History'}
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>
            {isAdmin ? 'Boutique Orders Dashboard' : 'Your Orders'}
          </h1>
        </div>

        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }} className="animate-fade-in">
          
          {/* Orders Listing Left Column */}
          <div style={{ flex: '1.2 1 450px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <h3>Loading Orders...</h3>
            ) : !ordersList || ordersList.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <h4>No Orders Registered</h4>
                <p style={{ marginTop: '8px' }}>There are no orders to display at the moment.</p>
              </div>
            ) : (
              ordersList.map(order => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="card"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    border: selectedOrder && selectedOrder._id === order._id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: selectedOrder && selectedOrder._id === order._id ? 'rgba(114, 47, 55, 0.02)' : 'var(--bg-card)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>
                      #{order._id.substring(18).toUpperCase()}
                    </span>
                    <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  {/* Customer display for admin */}
                  {isAdmin && order.customerId && (
                    <div style={{ marginTop: '10px', fontSize: '0.85rem', borderTop: '1px dashed var(--border)', paddingTop: '10px', color: 'var(--text-muted)' }}>
                      Customer: <strong>{order.customerId.name || 'Anonymous'}</strong> ({order.customerId.email})
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Selected Order Detail Right Column */}
          {selectedOrder && (
            <div className="card" style={{ flex: '1.8 1 500px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 600 }}>Order ID</span>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>#{selectedOrder._id.toUpperCase()}</h3>
                </div>
                <span className={getStatusBadgeClass(selectedOrder.status)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>{selectedOrder.status}</span>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>Items Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', backgroundColor: 'var(--bg-input)', padding: '10px 16px', borderRadius: 'var(--radius-sm)' }}>
                      <span>{item.qty}x {item.name}</span>
                      <strong>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order total amount */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px' }}>
                <span style={{ fontWeight: 600 }}>Total Value Paid:</span>
                <strong style={{ fontSize: '1.35rem', color: 'var(--primary)' }}>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</strong>
              </div>

              {/* Order Timeline Tracking */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '16px' }}>Fulfillment Timeline</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px' }}>
                  {/* Timeline Bar Line */}
                  <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', backgroundColor: 'var(--border)' }}></div>

                  {selectedOrder.timeline?.map((step, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      {/* Bullet Dot */}
                      <div style={{
                        position: 'absolute',
                        left: '-22px',
                        top: '5px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        border: '2px solid var(--bg-card)'
                      }}></div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--primary-dark)' }}>{step.status}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          {new Date(step.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{step.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address info */}
              <div style={{ backgroundColor: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '32px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>Delivery Address</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {selectedOrder.shippingAddress?.line1}, {selectedOrder.shippingAddress?.line2 && `${selectedOrder.shippingAddress.line2}, `}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  <br />
                  Phone: {selectedOrder.shippingAddress?.phone}
                </p>
              </div>

              {/* Actions Control Panel */}
              {isAdmin ? (
                /* Admin status transitions form */
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '16px' }}>Transition Order Status</h4>
                  <form onSubmit={handleStatusUpdate} style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <select
                        className="form-input"
                        value={updateStatusVal}
                        onChange={(e) => setUpdateStatusVal(e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="">Select Next Status...</option>
                        {selectedOrder.status === 'PENDING' && <option value="CONFIRMED">CONFIRMED (Awaiting Processing)</option>}
                        {selectedOrder.status === 'PENDING' && <option value="CANCELLED">CANCELLED (Reject Order)</option>}
                        {selectedOrder.status === 'CONFIRMED' && <option value="PROCESSING">PROCESSING (Knotting Tassels)</option>}
                        {selectedOrder.status === 'CONFIRMED' && <option value="CANCELLED">CANCELLED (Reject Order)</option>}
                        {selectedOrder.status === 'PROCESSING' && <option value="SHIPPED">SHIPPED (Handover to Courier)</option>}
                        {selectedOrder.status === 'SHIPPED' && <option value="DELIVERED">DELIVERED (Saree Handed Over)</option>}
                        {selectedOrder.status === 'DELIVERED' && <option value="RETURNED">RETURNED (Customer Returned)</option>}
                      </select>
                      
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={actionLoading || !updateStatusVal}
                        style={{ padding: '0 24px' }}
                      >
                        Update
                      </button>
                    </div>

                    <input
                      type="text"
                      className="form-input"
                      placeholder="Timeline annotation note (e.g. AWB courier tracking number...)"
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                    />
                  </form>
                </div>
              ) : (
                /* Customer cancel trigger */
                selectedOrder.status === 'PENDING' && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    {!showCancelModal ? (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="btn btn-secondary"
                        style={{ borderColor: 'var(--error)', color: 'var(--error)', width: '100%' }}
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <form onSubmit={handleCancelOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label className="form-label" style={{ color: 'var(--error)' }}>Reason for cancellation</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Why do you wish to cancel this order?"
                          value={cancelReasonVal}
                          onChange={(e) => setCancelReasonVal(e.target.value)}
                          required
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--error)' }}>
                            Confirm Cancellation
                          </button>
                          <button type="button" onClick={() => setShowCancelModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                            Back
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
