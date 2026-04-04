import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';
import { useRegisterMutation } from '../../services/authApi';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [registerApi, { isLoading }] = useRegisterMutation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      const data = await registerApi({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password }).unwrap();
      login(data);
      toast.success('Account created! Welcome to RAWTHREAD');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <SEO title="Create Account" />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center uppercase tracking-wider mb-2">Create Account</h1>
          <p className="text-center text-text-muted text-sm mb-8">Join the RAWTHREAD movement</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" required minLength={6} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full btn btn-primary py-4">
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-text-muted">
            Already have an account? <Link to="/login" className="font-semibold text-primary underline">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
