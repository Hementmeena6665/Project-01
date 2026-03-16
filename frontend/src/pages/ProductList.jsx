import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = categoryQuery
          ? `http://localhost:8000/api/products/?category=${categoryQuery}`
          : 'http://localhost:8000/api/products/';
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 500); // Smooth transition
      }
    };
    fetchProducts();
  }, [categoryQuery]);

  const addToCart = async (e, productId, redirect = false) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert(`Please login to ${redirect ? 'buy' : 'add items to cart'}`);
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/cartitems/',
        { product: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (redirect) {
        navigate('/cart');
      } else {
        alert('Product added to your bag!');
      }
    } catch (err) {
      console.error(err);
      alert('Operation failed. Please check your connection.');
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-indigo-400 font-black text-xl tracking-tighter animate-pulse">CURATING COLLECTIONS...</p>
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      <header className="relative py-12 px-8 overflow-hidden rounded-[3rem] bg-slate-900 border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20">
                New Arrivals
              </span>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              {categoryQuery ? (
                <span className="text-gradient-indigo capitalize">{categoryQuery}</span>
              ) : (
                <>THE <span className="text-gradient-indigo">MODERN</span> STYLE</>
              )}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              {categoryQuery
                ? `Exquisite selection from our ${categoryQuery} department.`
                : 'Elevate your lifestyle with our curated premium products.'}
            </p>

            {categoryQuery && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-sm font-black"
              >
                <span>CLEAR FILTER: {categoryQuery}</span>
                <X size={16} />
              </motion.button>
            )}
          </div>
          
          <div className="hidden md:block">
             <Filter className="text-slate-700 w-32 h-32 rotate-12" strokeWidth={0.5} />
          </div>
        </div>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 glass rounded-[3rem] space-y-6 text-center">
          <div className="p-6 bg-slate-800/50 rounded-full">
            <Filter size={48} className="text-slate-500" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-black text-white px-6">Empty Collection</p>
            <p className="text-slate-400">We couldn't find any items matching this category yet.</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-primary">EXPLORE ALL PRODUCTS</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};


export default ProductList;
