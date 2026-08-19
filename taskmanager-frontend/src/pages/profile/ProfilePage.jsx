import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, Key, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [role] = useState(user?.role || 'USER');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences state
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Name cannot be empty');
      return;
    }
    // Update local state mock/persistance if wanted
    toast.success('Profile details updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated successfully');
  };

  const handleNotificationsSave = () => {
    toast.success('Notification preferences updated');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal details, credentials, and notification settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="card p-6 flex flex-col items-center text-center h-fit border border-slate-100 dark:border-slate-800/80">
          <Avatar name={name || email} size="xl" className="mb-4" />
          <h3 className="font-semibold text-slate-805 dark:text-slate-100 text-lg">{name || 'User'}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{email}</p>
          <div className="mt-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-350">
            {role === 'ADMIN' ? 'Administrator' : 'Standard Member'}
          </div>
        </div>

        {/* Edit Info Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile details */}
          <div className="card p-6 border border-slate-100 dark:border-slate-800/80">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              General Information
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
              />
              <Input
                label="Email Address"
                value={email}
                disabled
                icon={Mail}
                hint="Your email address is managed by organization admin"
              />
              <div className="flex justify-end">
                <Button type="submit" icon={Save}>
                  Save Profile
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="card p-6 border border-slate-100 dark:border-slate-800/80">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary-500" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" icon={Save}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="card p-6 border border-slate-100 dark:border-slate-800/80">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" />
              Notifications Configuration
            </h2>
            <div className="space-y-4">
              {[
                {
                  id: 'emailNotif',
                  label: 'Email Notifications',
                  desc: 'Receive instant task assignment & status update emails',
                  checked: emailNotif,
                  onChange: setEmailNotif,
                },
                {
                  id: 'pushNotif',
                  label: 'Push Notifications',
                  desc: 'Receive in-app alerts and desktop alerts when active',
                  checked: pushNotif,
                  onChange: setPushNotif,
                },
                {
                  id: 'weeklyDigest',
                  label: 'Weekly Digest',
                  desc: 'Get a clean summary report of completion rates every Monday',
                  checked: weeklyDigest,
                  onChange: setWeeklyDigest,
                },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer" htmlFor={item.id}>
                      {item.label}
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <input
                    id={item.id}
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.onChange(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={handleNotificationsSave} icon={Save}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
