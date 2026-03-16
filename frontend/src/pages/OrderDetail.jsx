import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Calendar, DollarSign, Hash, User, MapPin } from 'lucide-react';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`http://localhost:8000/api/orders/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(res.data);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch order details.');
                navigate('/profile');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id, token, navigate]);

    if (loading) return <div className="flex justify-center items-center h-screen text-indigo-400 font-bold text-2xl animate-pulse">Loading order details...</div>;
    if (!order) return <div className="text-center py-20 text-slate-400">Order not found.</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Profile
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 glass p-8 rounded-3xl border-white/5 shadow-2xl space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                                    <span className="text-indigo-400">Order</span> Details
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                                        <Hash size={14} className="text-indigo-400" /> #{order.id}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                                        <Calendar size={14} className="text-indigo-400" /> {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-2xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Total Amount</p>
                                <p className="text-2xl font-bold text-slate-100">${order.total_amount}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                                <Package size={20} className="text-indigo-400" />
                                Items Ordered
                            </h2>
                            <div className="divide-y divide-white/5">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="py-6 flex gap-6 items-center group">
                                        <div className="w-20 h-20 glass rounded-2xl overflow-hidden flex-shrink-0 border-white/5">
                                            <img
                                                src={item.product_image ? (item.product_image.startsWith('http') ? item.product_image : `http://localhost:8000${item.product_image}`) : 'https://placehold.co/100x100/1e293b/6366f1?text=Product'}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => { e.target.src = 'https://placehold.co/100x100/1e293b/6366f1?text=Product'; }}
                                            />
                                        </div>
                                        <div className="flex-grow flex justify-between items-center">
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors uppercase tracking-wide">
                                                    {item.product_name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Quantity: <span className="text-slate-300 font-medium">{item.quantity}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-200">${item.price}</p>
                                                <p className="text-xs text-slate-500">per item</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <div className="glass p-8 rounded-3xl border-white/5 shadow-2xl space-y-6">
                            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                                <User size={20} className="text-indigo-400" />
                                Customer Info
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Name</p>
                                    <p className="text-slate-200 font-medium">{order.user_details?.username}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Email</p>
                                    <p className="text-slate-200 font-medium">{order.user_details?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Phone</p>
                                    <p className="text-slate-200 font-medium">{order.user_details?.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Shipping Address</p>
                                    <div className="text-slate-400 text-sm space-y-1">
                                        <p className="text-slate-200 font-medium flex items-center gap-1.5"><MapPin size={14} className="text-indigo-400 shrink-0" /> {order.user_details?.city || 'No city'}</p>
                                        <p className="leading-relaxed">{order.user_details?.address || 'No address provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border-white/5 text-center">
                            <p className="text-slate-500 text-xs">
                                Need help? Contact our premium support at support@estore.com
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetail;
