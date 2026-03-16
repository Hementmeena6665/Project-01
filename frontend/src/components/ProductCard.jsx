import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Star, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, addToCart }) => {
  const imageSrc = product.image 
    ? (product.image.startsWith('http') ? product.image : `http://localhost:8000${product.image}`) 
    : 'https://placehold.co/400x400/1e293b/6366f1?text=Product';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.target.src = 'https://placehold.co/400x400/1e293b/6366f1?text=Product'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-3 glass rounded-2xl bg-slate-900/40 hover:bg-amber-500/20 text-white hover:text-amber-400 transition-all duration-300 backdrop-blur-md border hover:border-amber-500/50 group/fav"
            >
              <Star size={18} className="transition-transform group-hover/fav:scale-110" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(e, product.id, true);
              }}
              className="w-full py-3 bg-white text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-2xl"
            >
              <ShoppingBag size={10} />
              BUY NOW
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <span className="shrink-0 font-black text-indigo-400">${product.price}</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              {product.category_name || 'Premium Collection'}
            </p>
          </div>

          <p className="text-slate-400 text-sm line-clamp-2 h-10 leading-relaxed font-medium">
            {product.description || 'No description available for this exquisite piece.'}
          </p>

          <button
            onClick={(e) => addToCart(e, product.id)}
            className="w-full py-3.5 px-4 bg-slate-800/50 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-sm font-black border border-white/5 hover:border-indigo-400/50"
          >
            <Plus size={18} />
            ADD TO BAG
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;