import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      setSuccess(true);
      toast.success('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || 'Registration failed';
      setError('root', { message: typeof msg === 'string' ? msg : 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-mesh pointer-events-none" aria-hidden="true" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-violet-200/20 dark:bg-violet-900/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="card shadow-premium-lg p-8 border border-slate-100 dark:border-slate-700/50">
          <AnimatePresence mode="wait">
            {success ? (
              /* Success animation */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">You're in!</h2>
                <p className="text-slate-500 dark:text-slate-400">Account created successfully. Redirecting…</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-premium-md mb-4 overflow-hidden">
                    <img src="https://img.favpng.com/22/0/8/task-management-project-management-performance-management-png-favpng-UN17R4QfF2ZpQyjcjHyHvm04m.jpg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create account</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join TaskFlow and boost your productivity</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <Input
                    label="Full name"
                    type="text"
                    icon={User}
                    placeholder="John Doe"
                    error={errors.name?.message}
                    id="reg-name"
                    autoComplete="name"
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                  />

                  <Input
                    label="Email address"
                    type="email"
                    icon={Mail}
                    placeholder="you@company.com"
                    error={errors.email?.message}
                    id="reg-email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                    })}
                  />

                  <Input
                    label="Password"
                    type="password"
                    icon={Lock}
                    placeholder="At least 6 characters"
                    error={errors.password?.message}
                    id="reg-password"
                    autoComplete="new-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />

                  <Input
                    label="Confirm password"
                    type="password"
                    icon={Lock}
                    placeholder="Repeat your password"
                    error={errors.confirmPassword?.message}
                    id="reg-confirm-password"
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (v) => v === password || 'Passwords do not match',
                    })}
                  />

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
                    className="w-full mt-2"
                    iconRight={ArrowRight}
                    id="reg-submit"
                  >
                    {loading ? 'Creating account…' : 'Create Account'}
                  </Button>
                </form>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
