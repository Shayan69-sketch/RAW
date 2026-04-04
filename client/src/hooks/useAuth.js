import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout as logoutAction } from '../features/auth/authSlice';
import { useLogoutMutation } from '../services/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoggedIn } = useSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const login = (data) => {
    dispatch(setCredentials(data));
  };

  const logout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      // continue logout even if API fails
    }
    dispatch(logoutAction());
  };

  const isAdmin = user?.role === 'admin';

  return { user, token, isLoggedIn, isAdmin, login, logout };
};
