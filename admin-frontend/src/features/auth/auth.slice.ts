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
        localStorage.removeItem('aarogyamed_admin_auth_token');
      }
    }),
    clearAuthError: create.reducer((state) => {
      state.error = null;
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
          localStorage.setItem('aarogyamed_admin_auth_token', action.payload.data.token);
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

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
