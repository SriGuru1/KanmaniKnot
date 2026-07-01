import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail, clearCurrentProduct } from '../store/slices/productSlice';
import { addItem } from '../store/slices/cartSlice';
import Layout from '../components/common/Layout';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProduct: product, detailLoading: loading, detailError: error } = useSelector((state) => state.products);
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColour, setSelectedColour] = useState('');
  const [selectedTassel, setSelectedTassel] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Load product details
  useEffect(() => {
    dispatch(fetchProductDetail({ id }));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  // Set default variant values when product loads
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const defaultVar = product.variants[0];
      setSelectedVariant(defaultVar);
      setSelectedColour(defaultVar.colour);
      setSelectedTassel(defaultVar.tasselType);
    }
  }, [product]);

  // Update selected variant when filters change
  useEffect(() => {
    if (product && product.variants) {
      const found = product.variants.find(
        (v) => v.colour === selectedColour && v.tasselType === selectedTassel
      );
      if (found) {
        setSelectedVariant(found);
      } else {
        // If exact combination not found, fall back to first matching color
        const colorMatch = product.variants.find((v) => v.colour === selectedColour);
        if (colorMatch) {
          setSelectedVariant(colorMatch);
          setSelectedTassel(colorMatch.tasselType);
        }
      }
    }
  }, [selectedColour, selectedTassel, product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    dispatch(addItem({
      productId: product._id,
      variantSku: selectedVariant.sku,
      qty: qty,
      price: selectedVariant.price,
      name: `${product.name} (${selectedVariant.colour})`
    }));

    alert(`Successfully added ${qty} item(s) to your cart!`);
    navigate('/cart');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h3>Loading Saree Details...</h3>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px', border: '1px solid var(--error)' }}>
            <h3 style={{ color: 'var(--error)', marginBottom: '16px' }}>Saree Not Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error || 'The requested product could not be loaded.'}</p>
            <Link to="/products" className="btn btn-primary">Back to Catalog</Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Gather unique options
  const uniqueColours = [...new Set(product.variants?.map((v) => v.colour))];
  const uniqueTassels = [...new Set(product.variants?.map((v) => v.tasselType))];

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Catalog
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '48px',
          alignItems: 'start'
        }} className="animate-fade-in">
          
          {/* Gallery Column */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '500px',
              backgroundColor: 'var(--bg-input)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '16px'
            }}>
              <img
                src={product.images?.[activeImageIndex] || 'https://picsum.photos/800/800'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: idx === activeImageIndex ? '2px solid var(--primary)' : '1px solid var(--border)',
                      padding: 0,
                      cursor: 'pointer',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specifications & Selection */}
          <div className="card" style={{ padding: '32px' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-dark)', fontWeight: 700, letterSpacing: '1px' }}>
              Handloom Product
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', margin: '8px 0 16px 0', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Price section */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              marginBottom: '24px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '20px'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{selectedVariant ? selectedVariant.price.toLocaleString('en-IN') : product.basePrice.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>incl. of all taxes</span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '32px' }}>
              {product.description}
            </p>

            {/* Variant options */}
            {uniqueColours.length > 0 && (
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Select Color / Body</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {uniqueColours.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColour(c)}
                      className={`btn ${selectedColour === c ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {uniqueTassels.length > 0 && (
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label">Choose Tassel Technique (Kanmani Kuchu)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {uniqueTassels.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTassel(t)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedTassel === t ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedTassel === t ? 'rgba(114, 47, 55, 0.04)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'var(--transition)'
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{t}</span>
                      {selectedTassel === t && (
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTA */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              borderTop: '1px solid var(--border)',
              paddingTop: '24px',
              marginTop: '32px'
            }}>
              {/* Qty Selector */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'var(--bg-input)', cursor: 'pointer', fontWeight: 'bold' }}
                >-</button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ width: '40px', height: '40px', border: 'none', background: 'var(--bg-input)', cursor: 'pointer', fontWeight: 'bold' }}
                >+</button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px 24px', fontSize: '1.05rem' }}
                disabled={selectedVariant && selectedVariant.stock === 0}
              >
                {selectedVariant && selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Shopping Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {selectedVariant && (
          <div className="card" style={{ marginTop: '48px', padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              Weaving Details & Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>SKU Reference</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{selectedVariant.sku}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>Weave Pattern</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{selectedVariant.weavePattern || 'Handloom Traditional'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>Zari Specification</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{selectedVariant.zariWeight || 'None'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>Total Length</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{selectedVariant.length ? `${selectedVariant.length} Metres (incl. blouse)` : 'N/A'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block' }}>Unit Stock Availability</span>
                <strong style={{ fontSize: '1rem', color: selectedVariant.stock < 3 ? 'var(--error)' : 'var(--success)' }}>
                  {selectedVariant.stock} units left
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
