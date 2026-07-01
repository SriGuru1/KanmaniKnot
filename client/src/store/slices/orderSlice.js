import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const placeNewOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data.order; // returns { order }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMy',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      const { data } = await api.get(`/orders/my?${params.toString()}`);
      return data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch your orders');
    }
  }
);

export const fetchTenantOrders = createAsyncThunk(
  'orders/fetchTenant',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      const { data } = await api.get(`/orders?${params.toString()}`);
      return data; // returns { orders, total, page, pages }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch tenant orders');
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch order details');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, newStatus, note }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { newStatus, note });
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update order status');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/${orderId}/cancel`, { reason });
      return data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to cancel order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    tenantOrders: [],
    totalTenant: 0,
    pageTenant: 1,
    pagesTenant: 1,
    currentOrder: null,
    loading: false,
    detailLoading: false,
    actionLoading: false,
    error: null,
    detailError: null
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.detailError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.myOrders.unshift(action.payload);
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Tenant Orders
      .addCase(fetchTenantOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.tenantOrders = action.payload.orders;
        state.totalTenant = action.payload.total;
        state.pageTenant = action.payload.page;
        state.pagesTenant = action.payload.pages;
      })
      .addCase(fetchTenantOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Detail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      // Update Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentOrder = action.payload;
        // Update in lists
        state.myOrders = state.myOrders.map(o => o._id === action.payload._id ? action.payload : o);
        state.tenantOrders = state.tenantOrders.map(o => o._id === action.payload._id ? action.payload : o);
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Cancel
      .addCase(cancelOrder.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentOrder = action.payload;
        state.myOrders = state.myOrders.map(o => o._id === action.payload._id ? action.payload : o);
        state.tenantOrders = state.tenantOrders.map(o => o._id === action.payload._id ? action.payload : o);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
