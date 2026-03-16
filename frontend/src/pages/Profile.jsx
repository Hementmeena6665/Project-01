import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Package, MapPin, Phone, Settings, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8000/api/orders/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, [token]);

    if (!token) return <div className="text-center py-20 bg-slate-900/50 rounded-3xl glass border-none max-w-2xl mx-auto"><h2 className="text-2xl font-bold mb-4">Access Denied</h2><p className="text-slate-400">Please login to view your profile.</p></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <header className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border-white/5 shadow-2xl shadow-indigo-500/5">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-indigo-500/20">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-center md:text-left flex-grow">
                    <h1 className="text-3xl font-bold text-slate-100">{user?.username}</h1>
                    <p className="text-slate-400 mt-1">{user?.email || 'No email provided'}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1.5 rounded-full"><Phone size={12} /> Verified</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full"><Package size={12} /> Premium Member</span>
                    </div>
                </div>
                <button onClick={logout} className="p-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"><LogOut size={24} /></button>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold px-2">Account Settings</h2>
                    <div className="glass rounded-3xl overflow-hidden border-white/5">
                        {[
                            { icon: User, label: 'Edit Profile' },
                            { icon: MapPin, label: 'Shipping Addresses' },
                            { icon: Settings, label: 'Security' }
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => item.label === 'Edit Profile' ? navigate('/edit-profile') : null}
                                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-none group text-left"
                            >
                                <div className="flex items-center gap-4 text-slate-300">
                                    <item.icon size={20} className="text-slate-500 group-hover:text-indigo-400" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-400" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold px-2">Order History</h2>
                    <div className="space-y-4">
                        {orders.length > 0 ? orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between group"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-500">ORDER #{order.id}</p>
                                    <p className="font-bold text-slate-200">Total: ${order.total_amount}</p>
                                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div
                                    onClick={() => navigate(`/order/${order.id}`)}
                                    className="flex items-center gap-4 text-indigo-400 group-hover:translate-x-1 transition-transform cursor-pointer"
                                >
                                    <span className="text-sm font-bold">Details</span>
                                    <ChevronRight size={18} />
                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-12 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                                <p className="text-slate-500">No orders placed yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
