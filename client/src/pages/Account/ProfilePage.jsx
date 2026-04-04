import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateProfileMutation, useUpdatePasswordMutation } from '../../services/userApi';
import { updateUser } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [updateProfileApi, { isLoading: updating }] = useUpdateProfileMutation();
  const [updatePasswordApi, { isLoading: changingPw }] = useUpdatePasswordMutation();

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProfileApi(profile).unwrap();
      dispatch(updateUser(data.user));
      toast.success('Profile updated!');
    } catch (err) { toast.error(err?.data?.message || 'Failed to update profile'); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    try {
      await updatePasswordApi({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }).unwrap();
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err?.data?.message || 'Failed to change password'); }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Profile Details</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase tracking-widest mb-2">First Name</label><input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="input-field" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-widest mb-2">Last Name</label><input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="block text-xs font-bold uppercase tracking-widest mb-2">Email</label><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input-field" /></div>
          <button type="submit" disabled={updating} className="btn btn-primary">{updating ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div><label className="block text-xs font-bold uppercase tracking-widest mb-2">Current Password</label><input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="input-field" required /></div>
          <div><label className="block text-xs font-bold uppercase tracking-widest mb-2">New Password</label><input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="input-field" required minLength={6} /></div>
          <div><label className="block text-xs font-bold uppercase tracking-widest mb-2">Confirm New Password</label><input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="input-field" required /></div>
          <button type="submit" disabled={changingPw} className="btn btn-primary">{changingPw ? 'Changing...' : 'Change Password'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
