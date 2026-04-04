import { useState } from 'react';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import { useForgotPasswordMutation } from '../../services/authApi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send reset email');
    }
  };

  return (
    <>
      <SEO title="Forgot Password" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {sent ? (
            <>
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">Check Your Email</h1>
              <p className="text-text-muted">We've sent a password reset link to <strong>{email}</strong></p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Forgot Password</h1>
              <p className="text-text-muted text-sm mb-8">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-field" required />
                <button type="submit" disabled={isLoading} className="w-full btn btn-primary py-4">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
