import { createAppSlice } from '@/store/create-app-slice';
import { UserProfile } from './login/login.interface';
import { loginUser } from './login/login.action';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id: 'usr-demo-01',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'customer',
  },
  token: 'mock-jwt-token-aarogyamed',
  isAuthenticated: true,
  loading: false,
  error: null,
};

export const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    logout: create.reducer((state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aarogyamed_auth_token');
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
