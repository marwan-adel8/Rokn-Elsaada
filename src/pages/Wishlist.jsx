import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Trash2, ChevronLeft, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-[#fffcfb] min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-[#B76E79]/5 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-right">
          <div>
            <h1 className="font-headline-lg text-4xl text-primary mb-2">قائمة الأمنيات</h1>
            <p className="text-stone-500 font-body-md">المنتجات التي نالت إعجابك وتخطط لشرائها</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Link to="/" className="hover:text-primary">الرئيسية</Link>
            <ChevronLeft size={16} />
            <span className="text-primary font-bold">قائمة الأمنيات</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <div key={product._id} className="group bg-white rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="aspect-square relative overflow-hidden bg-stone-50">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={product.images && product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm z-10"
                    title="إزالة من القائمة"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-6 text-right">
                  <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors block">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center pt-4 border-t border-stone-50 mb-6">
                    <span className="text-xl font-bold text-primary font-headline-md">{product.price} ج.م</span>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(product);
                      removeFromWishlist(product._id);
                    }}
                    disabled={product.stock <= 0}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-stone-200 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={20} />
                    إضافة للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] py-32 flex flex-col items-center justify-center border-2 border-dashed border-stone-100 text-center px-6">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-8 animate-pulse">
              <Heart size={48} />
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-3 font-headline-md">قائمة أمنياتك فارغة</h3>
            <p className="text-stone-400 mb-10 max-w-md mx-auto">
              يبدو أنك لم تضف أي منتجات بعد. استكشف متجرنا وأضف ما يعجبك هنا!
            </p>
            <Link 
              to="/products" 
              className="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              <ArrowRight size={20} className="rotate-180" />
              الذهاب للمتجر
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
