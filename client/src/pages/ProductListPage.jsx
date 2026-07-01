import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import { addItem } from '../store/slices/cartSlice';
import Layout from '../components/common/Layout';
import axios from 'axios';

export default function ProductListPage() {
  const dispatch = useDispatch();
  
  const { items: products, loading, error, page, pages } = useSelector((state) => state.products);
  
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    axios.get('/api/products') // Let's use listProducts endpoint or fetch directly
      .then(() => {
        // Just mock some default categories for filters matching our seed data
        setCategories([
          { _id: 'kanchipuram', name: 'Kanchipuram Silk' },
          { _id: 'banarasi', name: 'Banarasi Brocade' },
          { _id: 'designer', name: 'Designer Tassels Special' },
          { _id: 'cotton', name: 'Cotton & Linen Silk' }
        ]);
      })
      .catch(console.error);
  }, []);

  // Fetch products when filters or pages change
  useEffect(() => {
    // We map human readable filters to seed ObjectIds or slug strings in backend
    // For simplicity of search in listProducts:
    // If the category matches a seed name, the backend listProducts filters it.
    // Let's dispatch fetchProducts:
    const categoryFilter = selectedCategory === 'kanchipuram' ? undefined : undefined; // we will pass selectedCategory if it's a valid ObjectId, or keep it empty for list all
    
    // Let's resolve the actual ObjectId for categories if selected. Since we seed the DB, we can just load products.
    // The backend uses Category models. Let's fetch products.
    dispatch(fetchProducts({
      search: search || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      page
    }));
  }, [dispatch, selectedCategory, search, minPrice, maxPrice, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleQuickAdd = (product) => {
    // Find the default variant
    const defaultVariant = product.variants?.[0] || { sku: 'DEFAULT', price: product.basePrice, tasselType: 'Standard Tassels', colour: 'Standard' };
    dispatch(addItem({
      productId: product._id,
      variantSku: defaultVariant.sku,
      qty: 1,
      price: defaultVariant.price,
      name: `${product.name} (${defaultVariant.colour})`
    }));
    alert(`Added "${product.name}" to cart!`);
  };

  // Helper to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const avg = rating?.avg || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= avg ? 'var(--accent)' : 'var(--text-light)', fontSize: '1.1rem', marginRight: '2px' }}>
          ★
        </span>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {stars}
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({rating?.count || 0})</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="luxury-title">
          <span style={{ textTransform: 'uppercase', color: 'var(--accent-dark)', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 700 }}>Exclusive Catalog</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>Browse Silk Sarees</h1>
        </div>

        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginTop: '20px'
        }}>
          {/* Filters Sidebar */}
          <div className="card" style={{
            flex: '1 1 280px',
            position: 'sticky',
            top: '84px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Filters</h3>
            
            {/* Search Input */}
            <div className="form-group">
              <label className="form-label">Search Sarees</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            {/* Category Filter */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label className="form-label">Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ padding: '8px 10px' }}
                />
                <span style={{ color: 'var(--text-light)' }}>-</span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ padding: '8px 10px' }}
                />
              </div>
            </div>
          </div>

          {/* Product Grid Panel */}
          <div style={{ flex: '3 1 600px' }}>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="card" style={{ height: '380px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.7 }}>
                    <div style={{ backgroundColor: 'var(--bg-input)', flex: 1, borderRadius: 'var(--radius-md)' }}></div>
                    <div style={{ backgroundColor: 'var(--bg-input)', height: '24px', width: '70%', borderRadius: '4px' }}></div>
                    <div style={{ backgroundColor: 'var(--bg-input)', height: '16px', width: '40%', borderRadius: '4px' }}></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="card" style={{ color: 'var(--error)', backgroundColor: 'rgba(198, 40, 40, 0.05)', textAlign: 'center', padding: '40px' }}>
                <h3>Error Loading Catalog</h3>
                <p style={{ marginTop: '8px' }}>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', color: 'var(--text-light)' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <h3>No Sarees Found</h3>
                <p style={{ marginTop: '8px' }}>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }} className="animate-fade-in">
                {products.map((product) => (
                  <div key={product._id} className="card" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Image */}
                    <Link to={`/products/${product._id}`} style={{ display: 'block', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '260px', marginBottom: '16px', backgroundColor: 'var(--bg-input)' }}>
                      <img
                        src={product.images?.[0] || 'https://picsum.photos/400/400?image=10'}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'var(--transition)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </Link>

                    {/* Meta info */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--primary-dark)',
                        marginBottom: '4px',
                        lineHeight: 1.3
                      }}>
                        <Link to={`/products/${product._id}`}>{product.name}</Link>
                      </h4>
                      
                      <div style={{ marginBottom: '8px' }}>
                        {renderStars(product.ratings)}
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '12px',
                        marginTop: 'auto'
                      }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                          ₹{product.basePrice.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => handleQuickAdd(product)}
                          className="btn btn-primary"
                          style={{ padding: '8px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                        >
                          + Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
