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
import Swal from 'sweetalert2';

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
      const res = await axios.post('/coupons/validate', {
        code: couponCode,
        orderTotal: getCartTotal()
      });
      setAppliedCoupon(res.data);
      Swal.fire({
        icon: 'success',
        title: 'تم تطبيق الكوبون!',
        text: `لقد حصلت على خصم بقيمة ${res.data.discount} جنيه.`,
        confirmButtonText: 'ممتاز',
        confirmButtonColor: '#B76E79'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'عذراً...',
        text: error.response?.data?.message || 'الكوبون غير صالح',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#B76E79'
      });
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
      Swal.fire({
        icon: 'warning',
        title: 'تسجيل الدخول مطلوب',
        text: 'الرجاء تسجيل الدخول أولاً لإتمام الطلب',
        confirmButtonText: 'تسجيل الدخول',
        confirmButtonColor: '#B76E79'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    if ((formData.paymentMethod === 'vodafone_cash' || formData.paymentMethod === 'instapay') && !paymentProof) {
      Swal.fire({
        icon: 'warning',
        title: 'إثبات الدفع مطلوب',
        text: 'الرجاء إرفاق صورة إثبات الدفع لتأكيد طلبك.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#B76E79'
      });
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
      Swal.fire({
        icon: 'error',
        title: 'فشل إرسال الطلب',
        text: error.response?.data?.message || 'حدث خطأ أثناء إتمام الطلب.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#B76E79'
      });
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
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-bounce">
          <CheckCircle2 size={48} className="sm:w-16 sm:h-16" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-on-background mb-4 font-headline-lg">تم استلام طلبك بنجاح!</h2>
        <p className="text-stone-500 text-sm sm:text-lg mb-8 max-w-md">شكراً لك على ثقتك بـ "ركن السعادة". سنقوم بتجهيز طلبك وشحنه في أقرب وقت ممكن.</p>
        <p className="text-stone-400 text-xs sm:text-sm italic">سيتم توجيهك للصفحة الرئيسية خلال 5 ثوانٍ...</p>
        <Link to="/" className="mt-8 text-primary font-bold border-b border-primary text-sm sm:text-base">العودة الآن</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fffcfb] min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-8 sm:py-16">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 text-right">
          
          <div className="lg:col-span-7 space-y-8 sm:space-y-12">
            <header>
              <h1 className="font-headline-lg text-2xl sm:text-4xl text-primary mb-1 sm:mb-2">إتمام عملية الشراء</h1>
              <p className="text-stone-400 text-xs sm:text-base font-bold">كل الأسعار بالجنيه المصري (EGP)</p>
            </header>

            <section className="bg-white p-4 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[40px] border border-stone-100 shadow-sm space-y-6 sm:space-y-10">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-4 sm:pb-6">
                <Truck className="text-primary sm:w-7 sm:h-7" size={24} />
                <h2 className="text-lg sm:text-2xl font-bold">بيانات الشحن</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-stone-600 px-1">الاسم الأول</label>
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 focus:ring-1 focus:ring-primary outline-none text-sm sm:text-base" placeholder="الاسم الأول" required />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-stone-600 px-1">اسم العائلة</label>
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 focus:ring-1 focus:ring-primary outline-none placeholder:text-right text-sm sm:text-base" placeholder="اسم العائلة" required />
                </div>
                <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-stone-600 px-1">العنوان بالتفصيل</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 sm:w-5 sm:h-5" size={18} />
                    <input name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 pl-12 focus:ring-1 focus:ring-primary outline-none text-sm sm:text-base" placeholder="اسم الشارع، رقم المبنى، الحي" required />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-stone-600 px-1">المحافظة</label>
                  <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 focus:ring-1 focus:ring-primary outline-none appearance-none font-bold text-sm sm:text-base">
                    {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-stone-600 px-1">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 sm:w-5 sm:h-5" size={18} />
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-stone-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 pl-12 focus:ring-1 focus:ring-primary outline-none font-mono text-sm sm:text-base" placeholder="01xxxxxxxxx" required />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-4 sm:p-8 lg:p-12 rounded-3xl sm:rounded-[40px] border border-stone-100 shadow-sm space-y-6 sm:space-y-10">
              <div className="flex items-center gap-3 border-b border-stone-50 pb-4 sm:pb-6">
                <CreditCard className="text-primary sm:w-7 sm:h-7" size={24} />
                <h2 className="text-lg sm:text-2xl font-bold">طريقة الدفع</h2>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
                {[
                  { id: 'cash_on_delivery', name: 'عند الاستلام', fullName: 'دفع عند الاستلام', icon: 'payments' },
                  { id: 'vodafone_cash', name: 'فودافون كاش', fullName: 'فودافون كاش', icon: 'phone_iphone' },
                  { id: 'instapay', name: 'انستا باي', fullName: 'انستا باي', icon: 'account_balance' }
                ].map(method => (
                  <label key={method.id} className={`relative flex flex-col items-center gap-2 p-3 sm:p-6 border-2 rounded-2xl sm:rounded-3xl cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-stone-50 hover:border-stone-200'}`}>
                    <input type="radio" name="paymentMethod" value={method.id} checked={formData.paymentMethod === method.id} onChange={handleInputChange} className="hidden" />
                    <span className={`material-symbols-outlined text-xl sm:text-3xl ${formData.paymentMethod === method.id ? 'text-primary' : 'text-stone-300'}`}>{method.icon}</span>
                    <span className={`text-[10px] sm:text-xs font-bold text-center ${formData.paymentMethod === method.id ? 'text-primary' : 'text-stone-500'}`}>
                      <span className="hidden sm:inline">{method.fullName}</span>
                      <span className="sm:hidden">{method.name}</span>
                    </span>
                  </label>
                ))}
              </div>

              {(formData.paymentMethod === 'vodafone_cash' || formData.paymentMethod === 'instapay') && (
                <div className="mt-6 animate-in slide-in-from-top duration-500 bg-primary/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-dashed border-primary/20 space-y-3 sm:space-y-4">
                  <h4 className="font-bold text-sm sm:text-base text-primary flex items-center gap-2">إرفاق إثبات الدفع</h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 leading-relaxed font-bold">
                    يرجى تحويل المبلغ الإجمالي إلى الرقم <span className="text-primary font-mono font-black">01064935277</span> أو حساب InstaPay: <span className="text-primary font-mono font-black">01279905676</span>، ثم ارفع لقطة الشاشة هنا لتأكيد طلبك.
                  </p>
                  <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-xs sm:text-sm text-stone-500 file:mr-4 file:py-1.5 file:px-3 sm:file:py-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary file:text-white cursor-pointer" />
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-5 text-right">
            <div className="sticky top-28 bg-white p-4 sm:p-8 md:p-10 rounded-3xl sm:rounded-[40px] border border-stone-100 shadow-xl lg:shadow-2xl">
              <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-8 text-right">ملخص الطلب</h3>
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-10 max-h-52 sm:max-h-60 overflow-y-auto pr-1 no-scrollbar">
                {cartItems.map(item => {
                  const hasDiscount = item.discount > 0;
                  const itemFinalPrice = hasDiscount 
                    ? item.price * (1 - item.discount / 100) 
                    : item.price;
                  
                  return (
                    <div key={item.cartItemId || item._id} className="flex gap-3 sm:gap-4 flex-row-reverse items-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0">
                        <img src={item.images?.[0]} className="w-full h-full object-cover" alt="item" />
                      </div>
                      <div className="flex-1 text-right min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm line-clamp-1">{item.name}</h4>
                        {item.selectedSize && (
                          <div className="mt-0.5">
                            <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] sm:text-[10px] font-bold rounded-full font-cairo">
                              الحجم: {item.selectedSize.size}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-1 flex-row-reverse text-[10px] sm:text-xs">
                          <span className="text-stone-400">الكمية: {item.quantity}</span>
                          <div className="flex flex-col items-start">
                            <span className="font-bold text-primary font-headline-md">{(itemFinalPrice * item.quantity).toFixed(0)} جنيه</span>
                            {hasDiscount && (
                              <span className="text-[8px] sm:text-[10px] text-stone-400 line-through font-bold">{(item.price * item.quantity).toFixed(0)} جنيه</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-stone-50 rounded-2xl sm:rounded-3xl border border-stone-100">
                <label className="block text-[10px] sm:text-xs font-bold text-stone-400 mb-1.5 sm:mb-2 mr-1 sm:mr-2">هل لديك كود خصم؟</label>
                <div className="flex gap-2 flex-row-reverse">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="أدخل الكود..." 
                    className="flex-1 bg-white border-none rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-primary text-right"
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-stone-800 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold hover:bg-stone-900 transition-all disabled:bg-stone-300"
                  >
                    {couponLoading ? '...' : 'تطبيق'}
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[9px] sm:text-[10px] text-emerald-600 font-bold mt-1.5 sm:mt-2 mr-1 sm:mr-2 flex items-center gap-1 justify-end">
                    تم تطبيق خصم بقيمة {appliedCoupon.discount} جنيه
                    <CheckCircle2 size={10} className="sm:w-3 sm:h-3" />
                  </p>
                )}
              </div>

              <div className="border-t border-stone-50 pt-4 sm:pt-6 space-y-2.5 sm:space-y-4 mb-6 sm:mb-10 text-xs sm:text-base">
                <div className="flex justify-between flex-row-reverse text-stone-500 font-bold">
                  <span>المجموع الفرعي</span>
                  <span className="font-headline-md">{getCartTotal()} جنيه</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between flex-row-reverse text-emerald-600 font-bold animate-in fade-in slide-in-from-right duration-300">
                    <span>خصم الكوبون ({appliedCoupon.coupon})</span>
                    <span className="font-headline-md">-{appliedCoupon.discount} جنيه</span>
                  </div>
                )}
                <div className="flex justify-between flex-row-reverse text-stone-500 font-bold">
                  <span>الشحن ({formData.city})</span>
                  <span className="font-headline-md">{shippingFee} جنيه</span>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-stone-50 flex justify-between flex-row-reverse text-lg sm:text-2xl font-bold text-primary">
                  <span>الإجمالي</span>
                  <span className="font-headline-md">{getCartTotal() - (appliedCoupon?.discount || 0) + shippingFee} جنيه</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3.5 sm:py-5 rounded-xl sm:rounded-full font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base disabled:bg-stone-300 cursor-pointer">
                {loading ? 'جاري تأكيد الطلب...' : (
                  <><span>تأكيد الطلب والدفع</span><ShieldCheck size={18} className="sm:w-5 sm:h-5" /></>
                )}
              </button>

              <p className="mt-4 sm:mt-6 text-center text-[8px] sm:text-[10px] text-stone-400 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
                <Lock size={10} /> تسوق آمن ومحمي
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
