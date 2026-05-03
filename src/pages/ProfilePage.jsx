import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../store/slices/authSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '' });
  const [addingAddr, setAddingAddr] = useState(false);
  const [addr, setAddr] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      dispatch(getProfile());
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/address', addr);
      dispatch(getProfile());
      setAddingAddr(false);
      toast.success('Address added');
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/auth/address/${id}`);
      dispatch(getProfile());
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Profile</h1>

      {/* Profile form */}
      <form onSubmit={handleProfileSave} className="border p-6 mb-8 space-y-4">
        <h2 className="font-semibold text-lg">Personal Info</h2>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full Name" className="input-field" />
        <input value={user?.email} disabled className="input-field bg-zinc-50 text-zinc-400 cursor-not-allowed" />
        <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone Number" className="input-field" />
        <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="New Password (leave blank to keep current)" className="input-field" />
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>

      {/* Addresses */}
      <div className="border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Saved Addresses</h2>
          <button onClick={() => setAddingAddr(!addingAddr)} className="text-sm underline hover:text-accent">
            {addingAddr ? 'Cancel' : '+ Add Address'}
          </button>
        </div>

        {addingAddr && (
          <form onSubmit={handleAddAddress} className="space-y-3 mb-6 p-4 bg-zinc-50">
            <input value={addr.fullName} onChange={(e) => setAddr((a) => ({ ...a, fullName: e.target.value }))} placeholder="Full Name" required className="input-field" />
            <input value={addr.phone} onChange={(e) => setAddr((a) => ({ ...a, phone: e.target.value }))} placeholder="Phone" required className="input-field" />
            <input value={addr.street} onChange={(e) => setAddr((a) => ({ ...a, street: e.target.value }))} placeholder="Street" required className="input-field" />
            <div className="grid grid-cols-2 gap-3">
              <input value={addr.city} onChange={(e) => setAddr((a) => ({ ...a, city: e.target.value }))} placeholder="City" required className="input-field" />
              <input value={addr.state} onChange={(e) => setAddr((a) => ({ ...a, state: e.target.value }))} placeholder="State" required className="input-field" />
            </div>
            <input value={addr.pincode} onChange={(e) => setAddr((a) => ({ ...a, pincode: e.target.value }))} placeholder="Pincode" required className="input-field" />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={addr.isDefault} onChange={(e) => setAddr((a) => ({ ...a, isDefault: e.target.checked }))} className="accent-zinc-900" />
              Set as default
            </label>
            <button type="submit" className="btn-primary">Save Address</button>
          </form>
        )}

        {user?.addresses?.length === 0 ? (
          <p className="text-zinc-500 text-sm">No saved addresses</p>
        ) : (
          <div className="space-y-3">
            {user?.addresses?.map((a) => (
              <div key={a._id} className="flex items-start justify-between p-3 border">
                <div className="text-sm">
                  <p className="font-medium">{a.fullName} {a.isDefault && <span className="text-xs bg-zinc-900 text-white px-1.5 py-0.5 ml-1">Default</span>}</p>
                  <p className="text-zinc-500">{a.phone}</p>
                  <p className="text-zinc-500">{a.street}, {a.city}, {a.state} - {a.pincode}</p>
                </div>
                <button onClick={() => handleDeleteAddress(a._id)} className="text-xs text-red-500 hover:underline ml-4">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
