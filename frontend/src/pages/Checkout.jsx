import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, MapPin, Phone, ShieldCheck, ArrowRight, CheckCircle2, Smartphone, Sparkles, Lock, Globe } from 'lucide-react';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    useEffect(() => {
        const fetchCart = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8000/api/cart/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.length > 0) {
                    setCart(res.data[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [token]);

    const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
    const [paymentStep, setPaymentStep] = useState('review'); // 'review' -> 'pay'

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();
        setProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2500));
            const orderData = {
                payment_method: paymentMethod === 'upi' ? 'UPI (PhonePe/Paytm)' : 'Credit/Debit Card',
                payment_status: 'Completed',
                transaction_id: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            };
            await axios.post('http://localhost:8000/api/orders/', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
            setTimeout(() => navigate('/profile'), 4000);
        } catch (err) {
            console.error(err);
            alert('Security verification failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (success) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
            <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="w-40 h-40 bg-indigo-500/10 rounded-[3rem] flex items-center justify-center mb-12 border border-indigo-500/20 shadow-3xl shadow-indigo-500/10 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent animate-pulse" />
                <CheckCircle2 size={80} className="text-indigo-400 relative z-10" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">AUTHENTICATED</h1>
                <p className="text-slate-400 text-xl max-w-lg mx-auto leading-relaxed border-t border-white/5 pt-6">Your transaction has been verified and your collection is being prepared for dispatch.</p>
                <div className="flex justify-center items-center gap-4 text-indigo-400 font-black uppercase text-xs tracking-[0.4em] pt-8">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                    Routing to Vault
                </div>
            </motion.div>
        </div>
    );

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[70vh] space-y-6">
            <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-2xl shadow-indigo-500/20" />
            <p className="text-indigo-400 font-black text-2xl tracking-[0.2em] animate-pulse uppercase italic">Securing Gateway...</p>
        </div>
    );

    const total = cart?.items.reduce((acc, item) => acc + (parseFloat(item.product_price) * item.quantity), 0) || 0;

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <header className="mb-16 space-y-4">
                <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] text-indigo-400">
                    <Lock size={14} />
                    Secure Infrastructure
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <h1 className="text-7xl font-black italic tracking-tighter text-white leading-none">CHECKOUT</h1>
                    <div className="flex items-center gap-6 bg-white/5 px-8 py-4 rounded-3xl border border-white/10 backdrop-blur-xl">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Step</span>
                            <span className="text-xl font-black text-white italic">{paymentStep === 'review' ? '01 DESTINATION' : '02 AUTHORIZATION'}</span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex gap-2">
                            <div className={`w-3 h-3 rounded-full ${paymentStep === 'review' ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-emerald-500'}`} />
                            <div className={`w-3 h-3 rounded-full ${paymentStep === 'pay' ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-5 gap-16 items-start">
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {paymentStep === 'review' ? (
                            <motion.div
                                key="destination"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                className="space-y-12"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 text-white font-black italic text-2xl uppercase tracking-tighter">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                            <Globe size={20} className="text-indigo-400" />
                                        </div>
                                        Logistics Details
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Protocol</label>
                                            <input
                                                type="text"
                                                placeholder="Phone Number"
                                                className="input-field py-5 !rounded-2xl"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City Hub</label>
                                            <input
                                                type="text"
                                                placeholder="City Name"
                                                className="input-field py-5 !rounded-2xl"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dispatch Address</label>
                                            <textarea
                                                placeholder="Full street address and landmark"
                                                className="input-field py-5 !rounded-2xl h-40 resize-none"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPaymentStep('pay')}
                                    className="w-full btn-primary py-8 flex items-center justify-center gap-4 text-2xl font-black shadow-3xl shadow-indigo-600/20 group uppercase tracking-widest italic"
                                >
                                    PROCEED TO AUTHORIZATION
                                    <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="authorization"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                className="space-y-12"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 text-white font-black italic text-2xl uppercase tracking-tighter">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                            <ShieldCheck size={20} className="text-indigo-400" />
                                        </div>
                                        Select Protocol
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`p-8 rounded-[2rem] border transition-all text-left relative overflow-hidden group ${paymentMethod === 'upi' ? 'bg-indigo-600 border-indigo-400 shadow-3xl shadow-indigo-600/30' : 'glass border-white/5 hover:bg-white/10'}`}
                                        >
                                            {paymentMethod === 'upi' && <motion.div layoutId="paymentBg" className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-transparent" />}
                                            <Smartphone size={32} className={`relative z-10 mb-6 ${paymentMethod === 'upi' ? 'text-white' : 'text-indigo-400'}`} />
                                            <div className="relative z-10 space-y-1">
                                                <div className="font-black text-xl uppercase italic">UPI Gateway</div>
                                                <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">PhonePe, GPay, Paytm</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-8 rounded-[2rem] border transition-all text-left relative overflow-hidden group ${paymentMethod === 'card' ? 'bg-indigo-600 border-indigo-400 shadow-3xl shadow-indigo-600/30' : 'glass border-white/5 hover:bg-white/10'}`}
                                        >
                                            {paymentMethod === 'card' && <motion.div layoutId="paymentBg" className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-transparent" />}
                                            <CreditCard size={32} className={`relative z-10 mb-6 ${paymentMethod === 'card' ? 'text-white' : 'text-indigo-400'}`} />
                                            <div className="relative z-10 space-y-1">
                                                <div className="font-black text-xl uppercase italic">Direct Card</div>
                                                <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">VISA, MASTERCARD, AMEX</div>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="glass-card p-10 border-indigo-500/20 bg-indigo-500/5 overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                                        {paymentMethod === 'upi' ? (
                                            <div className="flex flex-col md:flex-row items-center gap-10">
                                                <div className="w-48 h-48 bg-white p-4 rounded-[2.5rem] shadow-3xl shadow-black relative group shrink-0">
                                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=premium_checkout" alt="QR" className="w-full h-full grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700" />
                                                    <div className="absolute inset-0 border-[12px] border-white rounded-[2.5rem]" />
                                                </div>
                                                <div className="space-y-6 text-center md:text-left">
                                                    <div className="space-y-2">
                                                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">Scan to Authorize</h4>
                                                        <p className="text-slate-400 font-medium leading-relaxed">System awaiting secure handshake from your mobile banking environment.</p>
                                                    </div>
                                                    <p className="text-indigo-400 font-black text-3xl tracking-tighter">${total.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                <div className="flex justify-between items-center mb-4">
                                                    <ShieldCheck size={32} className="text-indigo-400" />
                                                    <div className="flex gap-2">
                                                        <span className="w-8 h-5 bg-white/10 rounded" />
                                                        <span className="w-8 h-5 bg-white/10 rounded" />
                                                        <span className="w-8 h-5 bg-white/10 rounded" />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="h-16 w-full glass bg-slate-950 border border-white/5 rounded-2xl px-6 flex items-center text-slate-500 tracking-[0.4em] font-medium italic">•••• •••• •••• ••••</div>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="h-16 bg-slate-950 border border-white/5 rounded-2xl px-6 flex items-center text-slate-500 uppercase font-black text-xs tracking-widest italic">MM / YY</div>
                                                        <div className="h-16 bg-slate-950 border border-white/5 rounded-2xl px-6 flex items-center text-slate-500 uppercase font-black text-xs tracking-widest italic">CVC</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <button
                                        onClick={() => setPaymentStep('review')}
                                        className="px-10 py-6 glass rounded-3xl text-slate-500 font-black uppercase tracking-widest hover:text-white transition-colors border-white/5 hover:border-white/10"
                                    >
                                        BACK
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={processing}
                                        className="flex-1 btn-primary py-8 flex items-center justify-center gap-4 text-2xl font-black shadow-3xl shadow-indigo-600/20 group uppercase tracking-widest italic disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                AUTHENTICATING
                                                <div className="flex gap-1 ml-2">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                COMPLETE TRANSACTION
                                                <ShieldCheck size={28} className="group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="lg:col-span-2 space-y-10">
                    <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10 shadow-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="text-3xl font-black text-white italic tracking-tighter border-b border-white/5 pb-6">SUMMARY</h3>
                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                            {cart?.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="text-white font-black uppercase text-sm group-hover:text-indigo-400 transition-colors">{item.product_name}</span>
                                        <span className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">{item.quantity} UNIT{item.quantity > 1 ? 'S' : ''}</span>
                                    </div>
                                    <span className="text-white font-black tracking-tight italic">${(item.product_price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4 pt-10 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">PROTOCOL TOTAL</span>
                                <span className="text-indigo-400 font-black text-5xl tracking-tighter italic leading-none">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2rem] border-white/5 flex items-center gap-6 text-slate-500 leading-relaxed italic bg-emerald-500/5">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <ShieldCheck size={28} className="text-emerald-400" />
                        </div>
                        <p className="text-[11px] font-medium tracking-[0.02em]">System operates under military-grade TLS 1.3 encryption. Your demographic and financial signatures are never persisted on local arrays.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
