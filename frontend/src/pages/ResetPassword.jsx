import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/reset-password/', { token, password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            alert(err.response?.data?.error || 'Token expired or invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-10 rounded-3xl"
            >
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    New Password
                </h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Choose a strong password for your premium account.
                </p>

                {success ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4">
                        <CheckCircle className="text-emerald-400 mx-auto" size={48} />
                        <h3 className="text-xl font-bold text-white">Security Updated</h3>
                        <p className="text-slate-400 text-sm">Your password has been changed successfully. Navigating to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">New Password</label>
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                        >
                            Update Password
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
