import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import {
  loginWithEmail, loginWithGoogle,
  registerWithEmail, resetPassword,
} from '../firebase/authService';

// Google icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [resetSent, setResetSent] = useState(false);

  const friendlyError = (code) => {
    const map = {
      'auth/user-not-found':       'No account found with this email.',
      'auth/wrong-password':       'Incorrect password. Try again.',
      'auth/email-already-in-use': 'This email is already registered. Please login.',
      'auth/weak-password':        'Password must be at least 6 characters.',
      'auth/invalid-email':        'Please enter a valid email address.',
      'auth/invalid-credential':   'Incorrect email or password.',
      'auth/too-many-requests':    'Too many failed attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/network-request-failed': 'Network error. Check your internet connection.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'reset') {
        await resetPassword(email);
        setResetSent(true);
      } else if (mode === 'register') {
        await registerWithEmail(name, email, password);
        navigate('/');
      } else {
        await loginWithEmail(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center">
            <div className="text-3xl font-black text-[#0d2b1d]">
              PLOT<span className="text-[#d4a017]">O</span>RA
            </div>
            <span className="text-xs text-gray-400 tracking-widest uppercase">Modern Property Marketplace</span>
          </Link>
        </div>

        <div className="card p-8">
          {/* Tabs */}
          {mode !== 'reset' && (
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  mode === 'login' ? 'bg-white shadow text-primary-700' : 'text-gray-500'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  mode === 'register' ? 'bg-white shadow text-primary-700' : 'text-gray-500'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-black text-gray-900 mb-1">
            {mode === 'login'    ? 'Welcome Back! 👋'        : ''}
            {mode === 'register' ? 'Create Your Account 🏠'  : ''}
            {mode === 'reset'    ? 'Reset Password 🔑'       : ''}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {mode === 'login'    ? 'Sign in to manage your properties and saved listings.' : ''}
            {mode === 'register' ? 'Join Plotora to post and manage properties for free.'  : ''}
            {mode === 'reset'    ? 'Enter your email to receive a password reset link.'    : ''}
          </p>

          {/* Reset success */}
          {resetSent && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
              <div className="text-2xl mb-1">📧</div>
              <p className="text-green-800 font-semibold text-sm">Password reset email sent!</p>
              <p className="text-green-600 text-xs mt-1">Check your inbox and follow the link.</p>
              <button onClick={() => { setMode('login'); setResetSent(false); }}
                className="mt-3 text-primary-700 text-sm font-semibold hover:underline">
                Back to Login
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!resetSent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (register only) */}
              {mode === 'register' && (
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              {/* Password */}
              {mode !== 'reset' && (
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 text-sm outline-none focus:border-primary-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}

              {/* Forgot password link */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setError(''); }}
                    className="text-xs text-primary-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {mode === 'login'    && (loading ? 'Signing in...'    : 'Login')}
                {mode === 'register' && (loading ? 'Creating account...' : 'Create Account')}
                {mode === 'reset'    && (loading ? 'Sending...'       : 'Send Reset Link')}
              </button>
            </form>
          )}

          {/* Divider */}
          {mode !== 'reset' && !resetSent && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign-in */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-70"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </>
          )}

          {/* Footer links */}
          {mode === 'reset' && !resetSent && (
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="w-full mt-4 text-sm text-gray-500 hover:text-primary-700 transition-colors"
            >
              ← Back to Login
            </button>
          )}
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary-700 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-primary-700 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

