import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Camera } from 'lucide-react';

const EditProfile = () => {
    const { token, user: authUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8000/api/profile/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('http://localhost:8000/api/profile/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully!');
            navigate('/profile');
        } catch (err) {
            console.error(err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-indigo-400 font-bold text-2xl animate-pulse">Retrieving your profile...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-6">
            <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Profile
            </button>

            <div className="glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl shadow-indigo-500/10">
                <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                            {formData.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold italic tracking-tight">Edit Identity</h1>
                        <p className="text-slate-400 mt-1">Refine your premium presence across the platform.</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-400 px-1 flex items-center gap-2">
                                <User size={14} /> Username
                            </label>
                            <input
                                type="text"
                                className="glass bg-slate-900/50 p-4 rounded-2xl border-white/5 focus:border-indigo-500/50 outline-none w-full font-medium"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-400 px-1 flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                className="glass bg-slate-900/50 p-4 rounded-2xl border-white/5 focus:border-indigo-500/50 outline-none w-full font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-400 px-1 flex items-center gap-2">
                                <Phone size={14} /> Phone Number
                            </label>
                            <input
                                type="text"
                                className="glass bg-slate-900/50 p-4 rounded-2xl border-white/5 focus:border-indigo-500/50 outline-none w-full font-medium"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-400 px-1 flex items-center gap-2">
                                <MapPin size={14} /> Primary City
                            </label>
                            <input
                                type="text"
                                className="glass bg-slate-900/50 p-4 rounded-2xl border-white/5 focus:border-indigo-500/50 outline-none w-full font-medium"
                                value={formData.city || ''}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="e.g. New York"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-indigo-400 px-1 flex items-center gap-2">
                            <MapPin size={14} /> Detailed Shipping Address
                        </label>
                        <textarea
                            className="glass bg-slate-900/50 p-4 rounded-2xl border-white/5 focus:border-indigo-500/50 outline-none w-full h-32 font-medium"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter your street address, apartment, etc."
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex-grow py-5 flex items-center justify-center gap-3 text-lg font-black italic shadow-2xl shadow-indigo-500/20 group"
                        >
                            <Save size={20} className="group-hover:scale-110 transition-transform" />
                            {saving ? 'Syncing...' : 'Persist Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="glass px-10 rounded-2xl border-white/5 hover:bg-white/5 transition-colors font-bold text-slate-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
