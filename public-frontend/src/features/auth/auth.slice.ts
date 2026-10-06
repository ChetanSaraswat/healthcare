import { createAppSlice } from '@/store/create-app-slice';
import { UserProfile } from './login/login.interface';
import { loginUser } from './login/login.action';
import { registerUser } from './register/register.action';
import { getCurrentUser } from './get-me/get-me.action';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
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
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aarogyamed_auth_token');
      }
    }),
    clearAuthError: create.reducer((state) => {
      state.error = null;
    }),
    setDemoCustomer: create.reducer((state) => {
      state.user = {
        id: 'usr-demo-01',
        name: 'Sunita Sharma',
        email: 'sunita.sharma@example.com',
        phone: '+91 98765 43210',
        role: 'customer',
      };
      state.token = 'demo-jwt-sunita-sharma';
      state.isAuthenticated = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('aarogyamed_auth_token', state.token);
      }
    }),
    setDemoAdmin: create.reducer((state) => {
      state.user = {
        id: 'usr-admin-01',
        name: 'Dr. Rajesh Verma',
        email: 'rajesh.verma@aarogyamed.in',
        phone: '+91 98111 22334',
        role: 'super_admin',
      };
      state.token = 'demo-jwt-admin-rajesh';
      state.isAuthenticated = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('aarogyamed_auth_token', state.token);
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
        if (typeof window !== 'undefined' && action.payload?.data?.token) {
          localStorage.setItem('aarogyamed_auth_token', action.payload.data.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
        if (typeof window !== 'undefined' && action.payload?.data?.token) {
          localStorage.setItem('aarogyamed_auth_token', action.payload.data.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // getCurrentUser
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        const msg = String(action.payload || '');
        if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
          if (state.token && !state.token.startsWith('demo-')) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
              localStorage.removeItem('aarogyamed_auth_token');
            }
          }
        }
      });
  },
});

export const { logout, clearAuthError, setDemoCustomer, setDemoAdmin } = authSlice.actions;
export default authSlice.reducer;
