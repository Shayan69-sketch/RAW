import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import { useResetPasswordMutation } from '../../services/authApi';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || 'Reset failed');
    }
  };

  return (
    <>
      <SEO title="Reset Password" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center uppercase tracking-wider mb-8">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required minLength={6} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Confirm New Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full btn btn-primary py-4">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
