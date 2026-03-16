import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Registration failed. Please try again.';
            alert(errorMsg);
            console.log(errorMsg)
        }
    };

    return (
        <div className="max-w-md mx-auto pt-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-10 rounded-3xl"
            >
                <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Create Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field pl-12"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg">
                        <UserPlus size={20} />
                        Join Now
                    </button>
                </form>
                <p className="mt-8 text-center text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-indigo-400 hover:underline cursor-pointer">Login here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
