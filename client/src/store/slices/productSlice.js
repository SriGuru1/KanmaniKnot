import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.tenantId) params.append('tenantId', filters.tenantId);

      const { data } = await api.get(`/products?${params.toString()}`);
      return data; // returns { products, total, page, pages }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchDetail',
  async ({ id, tenantId }, { rejectWithValue }) => {
    try {
      const url = tenantId ? `/products/${id}?tenantId=${tenantId}` : `/products/${id}`;
      const { data } = await api.get(url);
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch product details');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', productData);
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    pages: 1,
    currentProduct: null,
    loading: false,
    detailLoading: false,
    error: null,
    detailError: null
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.detailError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch detail
      .addCase(fetchProductDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
