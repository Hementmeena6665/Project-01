import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchCart = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get('http://localhost:8000/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.length > 0) {
                setCart(res.data[0]);
            } else {
                setCart(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const handleQuantity = async (itemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        try {
            await axios.patch(`http://localhost:8000/api/cartitems/${itemId}/`,
                { quantity: newQty },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8000/api/cartitems/${itemId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    if (!token) return (
        <div className="flex justify-center items-center h-[60vh] px-6">
            <div className="text-center py-20 glass rounded-[3rem] border-white/5 max-w-2xl w-full px-8 space-y-8">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Your Selections Await</h2>
                    <p className="text-slate-400 max-w-sm mx-auto font-medium">Please sign in to access your premium collection and continue your shopping journey.</p>
                </div>
                <Link to="/login" className="btn-primary inline-flex items-center gap-3 px-12 py-5 text-xl font-black tracking-tight">
                    AUTHENTICATE
                    <ArrowRight size={22} />
                </Link>
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-indigo-400 font-black text-xl tracking-tighter animate-pulse">SYNCHRONIZING BAG...</p>
        </div>
    );

    if (!cart || !cart.items || cart.items.length === 0) return (
        <div className="flex justify-center items-center h-[70vh] px-6">
            <div className="text-center py-24 glass rounded-[3rem] border-white/5 max-w-3xl w-full px-8 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 scale-110">
                    <ShoppingBag size={40} className="text-indigo-400" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-5xl font-black text-white italic tracking-tighter">EMPTY BAG</h2>
                    <p className="text-slate-400 max-w-sm mx-auto text-lg leading-relaxed font-medium">It seems you haven't discovered anything to add to your collection yet. Our finest pieces are waiting.</p>
                </div>
                <Link to="/" className="btn-primary inline-flex items-center gap-3 px-12 py-5 text-xl font-black tracking-tight">
                    EXPLORE COLLECTION
                    <Plus size={22} />
                </Link>
            </div>
        </div>
    );

    const total = cart.items.reduce((acc, item) => acc + (parseFloat(item.product_price) * item.quantity), 0);

    return (
        <div className="grid lg:grid-cols-3 gap-16 max-w-7xl mx-auto py-12 px-6">
            <div className="lg:col-span-2 space-y-12">
                <header className="space-y-4 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] text-indigo-400">
                        <Sparkles size={14} />
                        Premium Selection
                    </div>
                    <div className="flex items-end justify-between items-center">
                        <h1 className="text-6xl font-black text-white tracking-tighter leading-none italic">YOUR BAG</h1>
                        <span className="text-slate-500 font-black uppercase text-xs tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            {cart.items.length} {cart.items.length === 1 ? 'PIECE' : 'PIECES'}
                        </span>
                    </div>
                </header>

                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {cart.items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                                className="glass-card p-6 flex flex-col sm:flex-row items-center gap-8 group"
                            >
                                <div className="w-full sm:w-32 h-40 sm:h-32 bg-slate-900 rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
                                    <img
                                        src={item.product_image ? (item.product_image.startsWith('http') ? item.product_image : `http://localhost:8000${item.product_image}`) : 'https://placehold.co/200x200/1e293b/6366f1?text=Product'}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://placehold.co/200x200/1e293b/6366f1?text=Product'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                                </div>
                                <div className="flex-grow space-y-2 text-center sm:text-left w-full">
                                    <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.product_name}</h3>
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Premium Edition</p>
                                        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                        <p className="text-indigo-400 font-black text-lg">${item.product_price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 bg-slate-950/50 px-4 py-2 rounded-2xl border border-white/5">
                                    <button
                                        onClick={() => handleQuantity(item.id, item.quantity, -1)}
                                        className="p-1 hover:bg-slate-800 rounded-lg transition-all text-slate-500 hover:text-white"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="font-black w-6 text-center text-xl text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantity(item.id, item.quantity, 1)}
                                        className="p-1 hover:bg-slate-800 rounded-lg transition-all text-slate-500 hover:text-white"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-4 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group/trash"
                                >
                                    <Trash2 size={24} className="group-hover/trash:rotate-12 transition-transform" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="glass p-10 rounded-[3rem] sticky top-32 border-white/5 space-y-12 shadow-3xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <h2 className="text-3xl font-black text-white italic tracking-tighter border-b border-white/5 pb-6 leading-none">CHECKOUT</h2>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-slate-400">
                            <span className="font-bold text-xs uppercase tracking-[0.2em]">Bag Subtotal</span>
                            <span className="text-white font-black text-lg">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                            <span className="font-bold text-xs uppercase tracking-[0.2em]">Shipping</span>
                            <span className="text-emerald-400 font-black text-[10px] tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-400/20 uppercase">Complimentary</span>
                        </div>
                        <div className="pt-8 border-t border-white/5">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-black text-slate-500 text-xs uppercase tracking-[0.3em]">Total Value</span>
                                <span className="text-indigo-400 font-black text-4xl tracking-tighter leading-none">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full btn-primary py-6 flex items-center justify-center gap-4 text-xl font-black shadow-3xl shadow-indigo-600/20 group uppercase tracking-widest"
                    >
                        PROCEED
                        <CreditCard size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-8 grayscale opacity-20">
                            <span className="font-black text-xs">VISA</span>
                            <span className="font-black text-xs">STRIPE</span>
                            <span className="font-black text-xs">PAYPAL</span>
                        </div>
                        <p className="text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.25em]">Handcrafted Security Environment</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
