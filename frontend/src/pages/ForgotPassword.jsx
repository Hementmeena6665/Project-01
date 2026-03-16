import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/forgot-password/', { email });
            // In this demo, we'll just redirect to the reset page with the token returned in the response
            // Ideally, this token would be sent to the user's email.
            alert('A password reset link (simulated) has been generated.');
            setSent(true);
            setTimeout(() => {
                navigate(`/reset-password/${res.data.token}`);
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to process request.');
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
                <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
                    <ArrowLeft size={16} /> Back to Login
                </Link>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Reset Password
                </h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Enter your email address and we'll help you get back into your account.
                </p>

                {sent ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center">
                        <p className="text-emerald-400 font-bold mb-2">Request Successful</p>
                        <p className="text-slate-400 text-xs">Redirecting to reset page...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                        >
                            <Send size={20} />
                            {loading ? 'Processing...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
