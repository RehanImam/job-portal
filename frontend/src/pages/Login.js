

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { loginAction } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Auth context update
        loginAction(data.user, data.token);

        // Success Toast
        toast.success(`Welcome back, ${data.user.fullName}!`);

        // Admin/User redirect logic
        if (data.user.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Backend se aane wala message dikhao (e.g., "User not found. Please signup first")
        toast.error(data.message || "Invalid Credentials");

        // SMART UPGRADE: Agar user registered nahi hai, toh automatic signup pe bhej do
        if (data.message && data.message.toLowerCase().includes("signup")) {
          setTimeout(() => {
            navigate('/signup');
          }, 2000); // 2 second ka wait taaki user toast padh sake
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Server is not responding. Please try later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 p-8 md:p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white tracking-tight">Welcome <span className="text-blue-400">Back</span></h2>
          <p className="text-gray-400 mt-2 text-sm">Log in to manage your account and applications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2 ml-1">
              <Mail size={16} className="text-blue-400" /> Email Address
            </label>
            <input 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-white"
              type="email" 
              placeholder="rehan@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2 ml-1">
              <Lock size={16} className="text-blue-400" /> Password
            </label>
            <div className="relative">
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-white"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">Checking...</span>
            ) : (
              <>
                <LogIn size={20} /> Login
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm">
          Don't have an account? 
          <Link to="/signup" className="text-blue-400 font-bold hover:underline ml-1">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;