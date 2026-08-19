import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login({ ...data, remember });
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Invalid email or password';
      setError('root', { message: typeof msg === 'string' ? msg : 'Login failed. Please try again.' });
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" aria-hidden="true" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-200/20 dark:bg-violet-900/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="card shadow-premium-lg p-8 border border-slate-100 dark:border-slate-700/50">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-premium-md mb-4 overflow-hidden"
              >
                <img src="https://img.favpng.com/22/0/8/task-management-project-management-performance-management-png-favpng-UN17R4QfF2ZpQyjcjHyHvm04m.jpg" alt="Logo" className="w-full h-full object-cover" />
              </motion.div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome back</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your TaskFlow account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@company.com"
              error={errors.email?.message}
              autoComplete="email"
              id="login-email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
              })}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Your password"
              error={errors.password?.message}
              autoComplete="current-password"
              id="login-password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  id="remember-me"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Root error */}
            {errors.root && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
              >
                {errors.root.message}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              iconRight={ArrowRight}
              id="login-submit"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500"
        >
          Demo: any registered account from your Spring Boot backend
        </motion.div>
      </motion.div>
    </div>
  );
}
