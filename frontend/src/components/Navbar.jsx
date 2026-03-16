import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, PackageSearch, ChevronDown, Monitor, Smartphone, Watch, Laptop, Shirt, Footprints, Home as HomeIcon, Sofa, Lamp, Menu, X as CloseIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, token } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchCartCount = async () => {
            if (!token) {
                setCartCount(0);
                return;
            }
            try {
                const res = await axios.get('http://localhost:8000/api/cart/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.length > 0) {
                    const count = res.data[0].items.reduce((acc, item) => acc + item.quantity, 0);
                    setCartCount(count);
                } else {
                    setCartCount(0);
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    setCartCount(0);
                }
                console.error('Navbar cart fetch error');
            }
        };
        fetchCartCount();
    }, [token]);

    const categories = [
        {
            name: 'Electronics',
            slug: 'electronics',
            icon: <Monitor size={18} />,
            items: [
                { name: 'Televisions', slug: 'tv', icon: <Monitor size={16} /> },
                { name: 'Smartphones', slug: 'smartphones', icon: <Smartphone size={16} /> },
                { name: 'Laptops', slug: 'laptops', icon: <Laptop size={16} /> },
                { name: 'Watches', slug: 'watches', icon: <Watch size={16} /> },
            ]
        },
        {
            name: 'Fashion',
            slug: 'fashion',
            icon: <Shirt size={18} />,
            items: [
                { name: 'T-Shirts', slug: 't-shirts', icon: <Shirt size={16} /> },
                { name: 'Footwear', slug: 'footwear', icon: <Footprints size={16} /> },
            ]
        },
        {
            name: 'Home',
            slug: 'home',
            icon: <HomeIcon size={18} />,
            items: [
                { name: 'Furniture', slug: 'furniture', icon: <Sofa size={16} /> },
                { name: 'Lighting', slug: 'lighting', icon: <Lamp size={16} /> },
            ]
        }
    ];

    const handleCategoryClick = (slug) => {
        navigate(`/?category=${slug}`);
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`glass rounded-[2rem] relative transition-all duration-500 ${scrolled ? 'shadow-2xl shadow-indigo-500/10' : ''}`}>
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="flex items-center gap-12">
                            <Link to="/" onClick={() => setActiveMenu(null)} className="flex items-center gap-3 text-2xl font-black tracking-tight">
                                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
                                    <PackageSearch className="text-white" size={24} />
                                </div>
                                <span className="text-gradient-indigo">E-STORE</span>
                            </Link>

                            <div className="hidden lg:flex items-center gap-8">
                                <Link to="/" className={`text-sm font-bold transition-colors ${location.pathname === '/' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                                    Shop
                                </Link>

                                {categories.map((cat) => (
                                    <div
                                        key={cat.name}
                                        onMouseEnter={() => setActiveMenu(cat.name)}
                                        onMouseLeave={() => setActiveMenu(null)}
                                        className="relative py-2"
                                    >
                                        <button
                                            onClick={() => handleCategoryClick(cat.slug)}
                                            className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${activeMenu === cat.name ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <span>{cat.name}</span>
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === cat.name ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {activeMenu === cat.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full left-0 mt-4 w-72 bg-slate-900/90 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 shadow-3xl p-3 z-50"
                                                >
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {cat.items.map((item) => (
                                                            <button
                                                                key={item.name}
                                                                onClick={() => handleCategoryClick(item.slug)}
                                                                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl hover:bg-white/10 text-slate-300 hover:text-indigo-400 transition-all text-sm font-bold group"
                                                            >
                                                                <span className="p-2 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                                                    {item.icon}
                                                                </span>
                                                                {item.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative group p-3 rounded-2xl hover:bg-white/5 transition-all">
                                <ShoppingCart className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 bg-indigo-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-slate-900">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="hidden sm:flex items-center gap-3">
                                {token ? (
                                    <div className="flex items-center gap-2">
                                        <Link to="/profile" className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                                <User size={20} className="text-indigo-400" />
                                            </div>
                                            <span className="hidden md:inline font-bold text-sm">Account</span>
                                        </Link>
                                        <button onClick={logout} className="p-3 rounded-2xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/login" className="btn-primary py-2.5">
                                        Sign In
                                    </Link>
                                )}
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-3 rounded-2xl hover:bg-white/5 text-slate-400"
                            >
                                {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden px-8 pb-8 pt-2 space-y-6 border-t border-white/5"
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-slate-200">Home</Link>
                                    {categories.map((cat) => (
                                        <div key={cat.name} className="space-y-3">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">{cat.name}</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {cat.items.map((item) => (
                                                    <button
                                                        key={item.name}
                                                        onClick={() => handleCategoryClick(item.slug)}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {!token && (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full py-4 text-lg">
                                        Sign In
                                    </Link>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
