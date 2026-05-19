import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Phone,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: 'القاهرة',
    phone: '',
    paymentMethod: 'cash_on_delivery',
    notes: ''
  });

  const lowerEgyptGovs = [
    "القاهرة", "الجيزة", "القليوبية", "الإسكندرية", "البحيرة", "كفر الشيخ", 
    "الغربية", "المنوفية", "الدقهلية", "دمياط", "الشرقية", "بورسعيد", 
    "الإسماعيلية", "السويس", "شمال سيناء", "جنوب سيناء", "مطروح"
  ];
  
  const getShippingFee = (city) => {
    if (!city) return 100;
    const normalize = (str) => {
      return str
        .replace(/[أإآا]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .trim();
    };
    const lowerEgyptNormalized = lowerEgyptGovs.map(normalize);
    return lowerEgyptNormalized.includes(normalize(city)) ? 100 : 150;
  };

  const shippingFee = getShippingFee(formData.city);

  const [paymentProof, setPaymentProof] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      // نستخدم المسار الكامل للتأكد
      const res = await axios.post('/coupons/validate', {
        code: couponCode,
        orderTotal: getCartTotal()
      });
      setAppliedCoupon(res.data);
      alert('تم تطبيق الكوبون بنجاح!');
    } catch (error) {
      alert(error.response?.data?.message || 'الكوبون غير صالح');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('الرجاء تسجيل الدخول أولاً لإتمام الطلب');
      navigate('/login');
      return;
    }

    if ((formData.paymentMethod === 'vodafone_cash' || formData.paymentMethod === 'instapay') && !paymentProof) {
      alert('الرجاء إرفاق صورة إثبات الدفع');
      return;
    }

    setLoading(true);
    
    const data = new FormData();
    data.append('items', JSON.stringify(cartItems.map(item => ({
      product: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.discount > 0 ? Number((item.price * (1 - item.discount / 100)).toFixed(2)) : item.price,
      image: item.images?.[0],
      size: item.selectedSize?.size || null
    }))));
    
    data.append('totalPrice', getCartTotal());
    data.append('discount', appliedCoupon?.discount || 0);
    data.append('finalPrice', getCartTotal() - (appliedCoupon?.discount || 0) + shippingFee);
    data.append('couponCode', appliedCoupon?.coupon || '');
    data.append('shippingAddress', `${formData.city} - ${formData.address}`);
    data.append('fullName', `${formData.firstName} ${formData.lastName}`);
    data.append('phone', formData.phone);
    data.append('paymentMethod', formData.paymentMethod);
    data.append('notes', formData.notes);
    
    if (paymentProof) {
      data.append('paymentProof', paymentProof);
    }

    try {
      await axios.post('/orders', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 5000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || 'حدث خطأ أثناء إتمام الطلب.');
    } finally {
      setLoading(false);
    }
  };

  const governorates = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "اسوان", "اسيوط", "بني سويف", "بورسعيد", "دمياط", "الشرقية", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج"
  ];

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 size={64} />
        </div>
        <h2 className="text-4xl font-bold text-on-background mb-4 font-headline-lg">تم استلام طلبك بنجاح!</h2>
        <p className="text-stone-500 text-lg mb-8 max-w-md">شكراً لك على ثقتك بـ "ركن السعادة". سنقوم بتجهيز طلبك وشحنه في أقرب وقت ممكن.</p>
        <p className="text-stone-400 text-sm italic">سيتم توجيهك للصفحة الرئيسية خلال 5 ثوانٍ...</p>
        <Link to="/" className="mt-8 text-primary font-bold border-b border-primary">العودة الآن</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fffcfb] min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 text-right">
          
          <div className="lg:col-span-7 space-y-12">
            <header>
              <h1 className="font-headline-lg text-4xl text-primary mb-2">إتمام عملية الشراء</h1>
              <p className="text-stone-400 font-bold">كل الأسعار بالجنيه المصري (EGP)</p>
            </header>

            <section className="bg-white p-8 md:p-12 rounded-[40px] border border-stone-100 shadow-sm space-y-10">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                <Truck className="text-primary" size={28} />
                <h2 className="text-2xl font-bold">بيانات الشحن</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-600 px-2">الاسم الأول</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-1 focus:ring-primary outline-none" placeholder="الاسم الأول" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-600 px-2">اسم العائلة</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-1 focus:ring-primary outline-none placeholder:text-right" placeholder="اسم العائلة" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-stone-600 px-2">العنوان بالتفصيل</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-stone-300" size={20} />
                    <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 pl-12 focus:ring-1 focus:ring-primary outline-none" placeholder="اسم الشارع، رقم المبنى، الحي" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-600 px-2">المحافظة</label>
                  <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 focus:ring-1 focus:ring-primary outline-none appearance-none font-bold">
                    {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-600 px-2">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-stone-300" size={20} />
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-2xl p-4 pl-12 focus:ring-1 focus:ring-primary outline-none font-mono" placeholder="01xxxxxxxxx" required />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 md:p-12 rounded-[40px] border border-stone-100 shadow-sm space-y-10">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
                <CreditCard className="text-primary" size={28} />
                <h2 className="text-2xl font-bold">طريقة الدفع</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'cash_on_delivery', name: 'دفع عند الاستلام', icon: 'payments' },
                  { id: 'vodafone_cash', name: 'فودافون كاش', icon: 'phone_iphone' },
                  { id: 'instapay', name: 'انستا باي', icon: 'account_balance' }
                ].map(method => (
                  <label key={method.id} className={`relative flex flex-col items-center gap-4 p-6 border-2 rounded-3xl cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-stone-50 hover:border-stone-200'}`}>
                    <input type="radio" name="paymentMethod" value={method.id} checked={formData.paymentMethod === method.id} onChange={handleInputChange} className="hidden" />
                    <span className={`material-symbols-outlined text-3xl ${formData.paymentMethod === method.id ? 'text-primary' : 'text-stone-300'}`}>{method.icon}</span>
                    <span className={`text-xs font-bold ${formData.paymentMethod === method.id ? 'text-primary' : 'text-stone-500'}`}>{method.name}</span>
                  </label>
                ))}
              </div>

              {(formData.paymentMethod === 'vodafone_cash' || formData.paymentMethod === 'instapay') && (
                <div className="mt-8 animate-in slide-in-from-top duration-500 bg-primary/5 p-6 rounded-3xl border border-dashed border-primary/20 space-y-4">
                  <h4 className="font-bold text-primary flex items-center gap-2">إرفاق إثبات الدفع</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-bold">يرجى تحويل المبلغ الإجمالي إلى الرقم 010xxxxxxxx أو حساب InstaPay: rokn@instapay، ثم ارفع لقطة الشاشة هنا.</p>
                  <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white cursor-pointer" />
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-5 text-right">
            <div className="sticky top-28 bg-white p-8 md:p-10 rounded-[40px] border border-stone-100 shadow-2xl">
              <h3 className="text-2xl font-bold mb-8 text-right">ملخص الطلب</h3>
              <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {cartItems.map(item => {
                  const hasDiscount = item.discount > 0;
                  const itemFinalPrice = hasDiscount 
                    ? item.price * (1 - item.discount / 100) 
                    : item.price;
                  
                  return (
                    <div key={item.cartItemId || item._id} className="flex gap-4 flex-row-reverse">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0">
                        <img src={item.images?.[0]} className="w-full h-full object-cover" alt="item" />
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                        {item.selectedSize && (
                          <div className="mt-0.5">
                            <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                              الحجم: {item.selectedSize.size}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-1 flex-row-reverse">
                          <span className="text-xs text-stone-400">الكمية: {item.quantity}</span>
                          <div className="flex flex-col items-start">
                            <span className="font-bold text-primary">{(itemFinalPrice * item.quantity).toFixed(0)} جنيه</span>
                            {hasDiscount && (
                              <span className="text-[10px] text-stone-400 line-through font-bold">{(item.price * item.quantity).toFixed(0)} جنيه</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mb-8 p-4 bg-stone-50 rounded-3xl border border-stone-100">
                <label className="block text-xs font-bold text-stone-400 mb-2 mr-2">هل لديك كود خصم؟</label>
                <div className="flex gap-2 flex-row-reverse">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="أدخل الكود..." 
                    className="flex-1 bg-white border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary text-right"
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-stone-800 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-stone-900 transition-all disabled:bg-stone-300"
                  >
                    {couponLoading ? '...' : 'تطبيق'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-2 mr-2 flex items-center gap-1 justify-end">
                    تم تطبيق خصم بقيمة {appliedCoupon.discount} جنيه
                    <CheckCircle2 size={12} />
                  </p>
                )}
              </div>

              <div className="border-t border-stone-50 pt-6 space-y-4 mb-10">
                <div className="flex justify-between flex-row-reverse text-stone-500 font-bold">
                  <span>المجموع الفرعي</span>
                  <span>{getCartTotal()} جنيه</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between flex-row-reverse text-emerald-600 font-bold animate-in fade-in slide-in-from-right duration-300">
                    <span>خصم الكوبون ({appliedCoupon.coupon})</span>
                    <span>-{appliedCoupon.discount} جنيه</span>
                  </div>
                )}
                <div className="flex justify-between flex-row-reverse text-stone-500 font-bold">
                  <span>الشحن ({formData.city})</span>
                  <span>{shippingFee} جنيه</span>
                </div>
                <div className="pt-4 border-t border-stone-50 flex justify-between flex-row-reverse text-2xl font-bold text-primary">
                  <span>الإجمالي</span>
                  <span>{getCartTotal() - (appliedCoupon?.discount || 0) + shippingFee} جنيه</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-full font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-stone-300">
                {loading ? 'جاري تأكيد الطلب...' : (
                  <><span>تأكيد الطلب والدفع</span><ShieldCheck size={20} /></>
                )}
              </button>

              <p className="mt-6 text-center text-[10px] text-stone-400 flex items-center justify-center gap-2 font-bold uppercase tracking-wider">
                <Lock size={12} /> تسوق آمن ومحمي
              </p>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
