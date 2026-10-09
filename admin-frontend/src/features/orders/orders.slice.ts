import { createAppSlice } from '@/store/create-app-slice';
import { Order } from '@/domain/entities/order.entity';
import { listOrders } from './list-orders/list-orders.action';
import { createOrder } from './create-order/create-order.action';

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  latestPlacedOrder: Order | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  latestPlacedOrder: null,
  loading: false,
  submitting: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export const ordersSlice = createAppSlice({
  name: 'orders',
  initialState,
  reducers: (create) => ({
    setSelectedOrder: create.reducer<Order | null>((state, action) => {
      state.selectedOrder = action.payload;
    }),
    clearLatestPlacedOrder: create.reducer((state) => {
      state.latestPlacedOrder = null;
    }),
    updateOrderStatus: create.reducer<{ id: string; status: Order['status'] }>((state, action) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
      if (state.selectedOrder && state.selectedOrder.id === action.payload.id) {
        state.selectedOrder.status = action.payload.status;
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      // listOrders
      .addCase(listOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data.orders;
        state.total = action.payload.data.total;
        state.page = action.payload.data.page;
        state.limit = action.payload.data.limit;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load orders';
      })
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.submitting = false;
        state.latestPlacedOrder = action.payload.data;
        state.orders.unshift(action.payload.data);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Failed to place order';
      });
  },
});

export const { setSelectedOrder, clearLatestPlacedOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
