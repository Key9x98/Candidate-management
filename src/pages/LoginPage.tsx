// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for feedback messages {type: 'error' | 'success', content: string}
  const [message, setMessage] = useState<{ type: 'error' | 'success', content: string } | null>(null);

  // Effect to redirect the user if they are already authenticated
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Choose which auth function to call based on the form mode
      const result = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (!result.success) {
        // Use || to provide a fallback error message
        setMessage({ type: 'error', content: result.error || 'Authentication failed. Please try again.' });
      } else if (!isLogin) {
        // Specific success message for new sign-ups
        setMessage({ type: 'success', content: 'Success! Please check your email for the confirmation link.' });
        setEmail('');
        setPassword('');
      }
      // On successful login, the `user` state in AuthContext will change,
      // and the useEffect above will trigger the navigation to the dashboard.

    } catch (error) {
      console.error("Authentication error:", error);
      setMessage({ type: 'error', content: 'An unexpected error occurred. Please check the console.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setMessage(null); // Clear messages when switching modes
    setEmail('');
    setPassword('');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="mt-2 text-gray-500">
            {isLogin ? 'Sign in to access your dashboard' : 'Get started by creating a new account'}
          </p>
        </div>

        {/* Dynamic Message Display */}
        {message && (
          <div className={`flex items-start p-4 rounded-lg border ${
            message.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-green-50 text-green-800 border-green-200'
          }`}>
            {message.type === 'error' 
              ? <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" /> 
              : <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            }
            <span className="text-sm font-medium">{message.content}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email Address"
            />
          </div>
          
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password (min. 6 characters)"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={toggleFormMode}
            className="ml-2 font-medium text-blue-600 hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;