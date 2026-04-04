import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import { useLoginMutation } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginApi, { isLoading }] = useLoginMutation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginApi({ email, password }).unwrap();
      login(data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <SEO title="Login" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center uppercase tracking-wider mb-2">Sign In</h1>
          <p className="text-center text-text-muted text-sm mb-8">Welcome back to RAWTHREAD</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs underline text-text-muted hover:text-primary">Forgot Password?</Link>
            </div>
            <button type="submit" disabled={isLoading} className="w-full btn btn-primary py-4">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary underline">Create Account</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
