import { useState } from 'react';
import { Settings, Shield, Globe, Clock, Trash2, AlertTriangle } from 'lucide-react';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { dark, toggle } = useTheme();
  const { logout } = useAuth();
  
  const [lang, setLang] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [themeMode, setThemeMode] = useState(dark ? 'dark' : 'light');

  const handleGeneralSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm(
      'WARNING: Are you absolutely sure you want to delete your account? This action is irreversible.'
    );
    if (confirmation) {
      toast.success('Account deleted successfully');
      logout();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure application configuration, language locales, and account settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Localization & Preferences */}
        <div className="card p-6 border border-slate-100 dark:border-slate-800/80">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-500" />
            App Localization
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Default Language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              options={[
                { value: 'en', label: 'English (US)' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' },
              ]}
            />
            <Select
              label="Primary Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
                { value: 'EST', label: 'Eastern Standard Time (EST)' },
                { value: 'PST', label: 'Pacific Standard Time (PST)' },
                { value: 'IST', label: 'Indian Standard Time (IST)' },
              ]}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleGeneralSave}>
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="card p-6 border border-slate-100 dark:border-slate-800/80">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-500" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Dark Mode Style Theme
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Toggle dark UI styling settings for high efficiency nighttime viewing
              </p>
            </div>
            <button
              onClick={() => {
                toggle();
                setThemeMode(dark ? 'light' : 'dark');
              }}
              className="btn btn-outline btn-sm"
            >
              Set {dark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Account Settings / Danger Zone */}
        <div className="card p-6 border border-red-100 dark:border-red-950/20 bg-red-50/10">
          <h2 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Actions performed here cannot be undone. Please be careful.
          </p>
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-red-750 dark:text-red-300">
                Delete User Account
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This will delete your user records permanently from the system database.
              </p>
            </div>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
