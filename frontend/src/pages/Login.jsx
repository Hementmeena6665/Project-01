import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            alert('Authentication failed. Please verify your credentials.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full"
            >
                <div className="glass-card p-10 sm:p-12 relative overflow-hidden group">
                    {/* Inner highlight */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <header className="text-center space-y-4 mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
                            <Lock className="text-indigo-400" size={32} />
                        </div>
                        <h2 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Identity Verification</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username Hub</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-5 top-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-field pl-14 py-5 !rounded-2xl"
                                    placeholder="Enter identifier"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secret Key</label>
                                <Link to="/forgot-password" size="sm" className="text-indigo-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Reset?</Link>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-5 top-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-14 py-5 !rounded-2xl"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full btn-primary py-6 flex items-center justify-center gap-4 text-xl font-black italic tracking-widest shadow-3xl shadow-indigo-600/20 group">
                            SIGN IN
                            <LogIn size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <footer className="mt-12 pt-8 border-t border-white/5 space-y-6">
                        <p className="text-center text-slate-500 text-sm font-medium">
                            New to the collection? <Link to="/register" className="text-indigo-400 hover:text-white font-black transition-colors underline-offset-4 hover:underline">Register Now</Link>
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
                            <ShieldCheck size={12} />
                            Encrypted Gateway Protocol
                        </div>
                    </footer>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
