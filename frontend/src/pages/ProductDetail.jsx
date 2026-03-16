import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/products/${id}/`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 404) {
                    alert('Product not found. Returning to shop...');
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!token) {
            alert('Please login to add items to cart');
            navigate('/login');
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/cartitems/',
                { product: product.id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Selection added to your premium collection!');
        } catch (err) {
            console.error(err);
            alert('Failed to update your bag.');
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-indigo-400 font-black text-2xl tracking-tighter animate-pulse">REFINING DETAILS...</p>
        </div>
    );
    
    if (!product) return <div className="text-center py-20 text-slate-400">Product not found.</div>;

    const imageSrc = product.image 
        ? (product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`) 
        : 'https://placehold.co/800x800/1e293b/6366f1?text=Product';

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-white mb-12 transition-all group font-black uppercase tracking-widest text-xs"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                Back to collection
            </button>

            <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="glass-card aspect-[4/5] overflow-hidden bg-slate-900 shadow-3xl">
                        <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://placehold.co/800x800/1e293b/6366f1?text=Product'; }}
                        />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl" />
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col justify-center space-y-10"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                                <CheckCircle2 size={12} />
                                In Stock
                            </span>
                            <span className="text-slate-600 font-bold text-xs uppercase tracking-[0.2em]">SKU: EST-{product.id}024</span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{product.name}</h1>
                            <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">Premium Grade Material</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <span className="text-4xl font-black text-white">${product.price}</span>
                            <div className="flex items-center gap-2 text-amber-400 bg-amber-400/5 px-4 py-2 rounded-2xl border border-amber-400/10 text-sm font-black">
                                <Star size={16} fill="currentColor" />
                                4.9 / 5.0
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Description</h3>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            {product.description || "Designed for those who appreciate the finer things. This piece combines timeless aesthetics with modern functionality, ensuring it remains a staple in your collection for years to come."}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="glass p-5 rounded-[2rem] border-white/5 flex items-center gap-4 transition-colors hover:bg-white/5">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                <Truck size={24} className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-black text-white text-sm">Fast Shipping</p>
                                <p className="text-xs font-bold text-slate-500">Global Delivery</p>
                            </div>
                        </div>
                        <div className="glass p-5 rounded-[2rem] border-white/5 flex items-center gap-4 transition-colors hover:bg-white/5">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <ShieldCheck size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-black text-white text-sm">Authenticity</p>
                                <p className="text-xs font-bold text-slate-500">Guaranteed</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={addToCart}
                        className="btn-primary py-6 flex items-center justify-center gap-4 text-xl font-black tracking-tight group"
                    >
                        <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                        ADD TO BAG
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-600 text-xs font-black uppercase tracking-widest pt-4">
                        <Sparkles size={14} />
                        Handpicked Premium Quality
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
