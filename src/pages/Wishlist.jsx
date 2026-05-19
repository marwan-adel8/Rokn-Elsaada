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

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-12">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {wishlist.map((product) => (
              <div key={product._id} className="group bg-white rounded-2xl sm:rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between">
                <div className="aspect-square relative overflow-hidden bg-stone-50 rounded-xl sm:rounded-none">
                  <Link to={`/product/${product._id}`}>
                    <img 
                      src={product.images && product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-2 left-2 sm:top-4 sm:left-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm z-10"
                    title="إزالة من القائمة"
                  >
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
                <div className="p-3 sm:p-6 text-right flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors block">
                      <h3 className="font-cairo font-bold text-xs sm:text-lg leading-tight line-clamp-2 min-h-[32px] sm:min-h-[50px]">{product.name}</h3>
                    </Link>
                  </div>
                  <div className="pt-2 sm:pt-4 border-t border-stone-50">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-3">
                      <span className="text-sm sm:text-xl font-bold text-primary font-headline-md">{product.price} ج.م</span>
                    </div>
                    <button 
                      onClick={() => {
                        addToCart(product);
                        removeFromWishlist(product._id);
                      }}
                      disabled={product.stock <= 0}
                      className="w-full bg-primary text-white py-2 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs sm:text-sm disabled:bg-stone-200 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
                      <span>إضافة للسلة</span>
                    </button>
                  </div>
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
