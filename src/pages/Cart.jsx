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
      
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <header className="mb-12 text-right">
          <h1 className="font-headline-lg text-4xl text-primary mb-2">سلة التسوق</h1>
          <p className="text-stone-400 font-bold">لديك ({cartItems.length}) منتجات في سلتك</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map(item => {
              const hasDiscount = item.discount > 0;
              const originalPriceTotal = item.price * item.quantity;
              const discountedPriceTotal = hasDiscount 
                ? (item.price * (1 - item.discount / 100)) * item.quantity 
                : originalPriceTotal;

              return (
                <div key={item.cartItemId || item._id} className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-stone-50 flex-shrink-0">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-right w-full">
                    <div className="flex justify-between items-start mb-2">
                      <button onClick={() => removeFromCart(item.cartItemId)} className="text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                      <Link to={`/product/${item._id}`} className="hover:text-primary transition-colors">
                        <h3 className="font-bold text-xl">{item.name}</h3>
                      </Link>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <p className="text-stone-400 text-sm">{item.category?.name}</p>
                      {item.selectedSize && (
                        <span className="px-3 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                          الحجم: {item.selectedSize.size}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 bg-stone-50 rounded-full px-4 py-2">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="hover:text-primary">
                          <Minus size={18} />
                        </button>
                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="hover:text-primary">
                          <Plus size={18} />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-xl text-primary">{discountedPriceTotal.toFixed(0)} ج.م</span>
                        {hasDiscount && (
                          <span className="text-xs text-stone-400 line-through font-bold">{originalPriceTotal.toFixed(0)} ج.م</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Link to="/products" className="inline-flex items-center gap-2 text-stone-400 hover:text-primary font-bold transition-colors">
              <ArrowRight size={20} />
              <span>متابعة التسوق</span>
            </Link>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-xl sticky top-28">
              <h3 className="text-2xl font-bold mb-8 text-on-background">ملخص الطلب</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-500">
                  <span className="font-bold">المجموع الفرعي</span>
                  <span>{getCartTotal()} ج.م</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  {/* <span className="font-bold">الشحن</span>
                  <span className="text-emerald-500 font-bold">مجاني</span> */}
                </div>
                <div className="border-t border-stone-50 pt-4 flex justify-between text-2xl font-bold text-primary">
                  <span>الإجمالي</span>
                  <span>{getCartTotal()} ج.م</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-5 rounded-full font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <CreditCard size={22} />
                <span>إتمام الشراء</span>
              </button>
              
              <p className="mt-6 text-center text-xs text-stone-400 leading-relaxed font-bold">
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
