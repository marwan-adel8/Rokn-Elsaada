import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-bold text-on-background mb-4">سلة التسوق فارغة</h2>
          <p className="text-stone-500 mb-8 max-w-md">يبدو أنك لم تضف أي شيء بعد. استكشف مجموعاتنا الرائعة وابدأ في ملء سلتك بالسعادة!</p>
          <Link to="/products" className="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-lg hover:opacity-90 transition-all active:scale-95">ابدأ التسوق</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#fffcfb] min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-12">
        <header className="mb-8 sm:mb-12 text-right">
          <h1 className="font-headline-lg text-2xl sm:text-4xl text-primary mb-1 sm:mb-2">سلة التسوق</h1>
          <p className="text-stone-400 text-xs sm:text-base font-bold">لديك ({cartItems.length}) منتجات في سلتك</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {cartItems.map(item => {
              const hasDiscount = item.discount > 0;
              const originalPriceTotal = item.price * item.quantity;
              const discountedPriceTotal = hasDiscount 
                ? (item.price * (1 - item.discount / 100)) * item.quantity 
                : originalPriceTotal;

              return (
                <div key={item.cartItemId || item._id} className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-[32px] border border-stone-100 shadow-sm flex gap-3 sm:gap-6 items-start">
                  <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50 flex-shrink-0">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-right w-full min-w-0">
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <Link to={`/product/${item._id}`} className="hover:text-primary transition-colors flex-1 ml-2 min-w-0">
                        <h3 className="font-bold text-sm sm:text-xl leading-snug line-clamp-1 sm:line-clamp-none">{item.name}</h3>
                      </Link>
                      <button onClick={() => removeFromCart(item.cartItemId)} className="text-stone-300 hover:text-red-500 transition-colors p-0.5 sm:p-1 flex-shrink-0">
                        <Trash2 size={16} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-2">
                      <p className="text-stone-400 text-[10px] sm:text-sm font-cairo">{item.category?.name}</p>
                      {item.selectedSize && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] sm:text-xs font-bold rounded-full font-cairo">
                          الحجم: {item.selectedSize.size}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-50">
                      <div className="flex items-center gap-2 sm:gap-4 bg-stone-50 rounded-full px-2.5 py-1 sm:px-4 sm:py-2">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="hover:text-primary text-stone-500 p-0.5">
                          <Minus size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <span className="font-bold text-xs sm:text-base w-4 sm:w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="hover:text-primary text-stone-500 p-0.5">
                          <Plus size={14} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-sm sm:text-xl text-primary font-headline-md">{discountedPriceTotal.toFixed(0)} ج.م</span>
                        {hasDiscount && (
                          <span className="text-[10px] sm:text-xs text-stone-400 line-through font-bold">{originalPriceTotal.toFixed(0)} ج.م</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-2">
              <Link to="/products" className="inline-flex items-center gap-2 text-stone-400 hover:text-primary font-bold transition-colors text-sm sm:text-base">
                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                <span>متابعة التسوق</span>
              </Link>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[40px] border border-stone-100 shadow-xl sticky top-28">
              <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-8 text-on-background">ملخص الطلب</h3>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-sm sm:text-base">
                <div className="flex justify-between text-stone-500">
                  <span className="font-bold">المجموع الفرعي</span>
                  <span className="font-headline-md">{getCartTotal()} ج.م</span>
                </div>
                <div className="border-t border-stone-50 pt-3 sm:pt-4 flex justify-between text-xl sm:text-2xl font-bold text-primary">
                  <span>الإجمالي</span>
                  <span className="font-headline-md">{getCartTotal()} ج.م</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-3.5 sm:py-5 rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <CreditCard size={18} className="sm:w-5 sm:h-5" />
                <span>إتمام الشراء</span>
              </button>
              
              <p className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-stone-400 leading-relaxed font-bold">
                بالضغط على إتمام الشراء، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بركن السعادة
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
