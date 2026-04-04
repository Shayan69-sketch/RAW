import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useAddAddressMutation, useDeleteAddressMutation } from '../../services/userApi';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const AddressesPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', street: '', city: '', state: '', zip: '', country: 'US', isDefault: false });
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await addAddress(form).unwrap(); toast.success('Address added!'); setShowForm(false); setForm({ label: 'Home', street: '', city: '', state: '', zip: '', country: 'US', isDefault: false }); } catch (err) { toast.error('Failed to add address'); }
  };

  const handleDelete = async (id) => {
    try { await deleteAddress(id).unwrap(); toast.success('Address removed'); } catch { toast.error('Failed to remove'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-outline text-sm py-2"><FiPlus className="mr-1" /> Add</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-border p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Label (Home, Work...)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-field" />
            <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" />
          </div>
          <input placeholder="Street Address" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input-field" required />
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" required />
            <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" required />
            <input placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="input-field" required />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Default address</label>
          <button type="submit" disabled={adding} className="btn btn-primary">{adding ? 'Adding...' : 'Save Address'}</button>
        </form>
      )}

      <div className="space-y-3">
        {user?.addresses?.length === 0 ? (
          <p className="text-text-muted text-center py-8">No saved addresses</p>
        ) : (
          user?.addresses?.map((addr) => (
            <div key={addr._id} className="flex items-start justify-between border border-border p-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{addr.label}</span>
                  {addr.isDefault && <span className="text-[10px] bg-primary text-white px-2 py-0.5 uppercase">Default</span>}
                </div>
                <p className="text-sm text-text-light">{addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</p>
              </div>
              <button onClick={() => handleDelete(addr._id)} className="p-2 text-text-muted hover:text-red-600"><FiTrash2 size={16} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressesPage;
