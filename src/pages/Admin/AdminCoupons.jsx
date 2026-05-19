import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import Swal from 'sweetalert2';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({ code: '', discountValue: '', expiresAt: '' });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/coupons');
      setCoupons(res.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const addCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/coupons', {
        ...formData,
        discountType: 'percentage', // النوع الافتراضي
        minOrderAmount: 0,
        maxUses: 100
      });
      setCoupons([...coupons, res.data]);
      setFormData({ code: '', discountValue: '', expiresAt: '' });
      Swal.fire({ icon: 'success', title: 'نجاح', text: 'تم إنشاء الكوبون بنجاح', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Error adding coupon:", error);
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء الإضافة. تأكد من أن الكود غير مكرر.', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
    }
  };

  const deleteCoupon = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن تتمكن من التراجع عن هذا الإجراء!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/coupons/${id}`);
        setCoupons(coupons.filter(c => c._id !== id));
        Swal.fire({ icon: 'success', title: 'تم الحذف', text: 'تم حذف الكوبون بنجاح.', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء الحذف', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
      }
    }
  };

  return (
    <AdminLayout>
      <header className="mb-8 sm:mb-12 text-right">
        <h2 className="font-headline-lg text-2xl sm:text-3xl text-on-surface">إدارة الكوبونات</h2>
        <p className="font-body-md text-xs sm:text-sm text-stone-500">إنشاء وإدارة أكواد الخصم للعملاء</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Form */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-stone-100 h-fit text-right">
          <h3 className="text-lg sm:text-xl font-bold mb-6 font-headline-md">إنشاء كوبون جديد</h3>
          <form onSubmit={addCoupon} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-600 mb-2">كود الخصم</label>
              <input 
                type="text" 
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                placeholder="مثال: HAPPY20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-600 mb-2">نسبة الخصم (%)</label>
              <input 
                type="number" 
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                placeholder="مثال: 20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-600 mb-2">تاريخ الانتهاء</label>
              <input 
                type="date" 
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 sm:py-3.5 rounded-xl font-bold hover:opacity-90 transition-all text-sm sm:text-base shadow-lg shadow-primary/10">إنشاء الكوبون</button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-4">
          {/* Mobile View: Coupon Cards */}
          <div className="block sm:hidden space-y-3">
            {coupons.length > 0 ? coupons.map(coupon => {
              const isActive = new Date(coupon.expiresAt) > new Date();
              return (
                <div key={coupon._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center text-right">
                  <div>
                    <p className="font-bold text-stone-800 text-sm">{coupon.code}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs font-bold text-primary">{coupon.discountValue}% خصم</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {isActive ? 'نشط' : 'منتهي'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteCoupon(coupon._id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              );
            }) : (
              <div className="bg-white py-12 rounded-2xl text-center text-stone-400 border border-stone-100 text-xs italic">
                لا توجد كوبونات حالياً
              </div>
            )}
          </div>

          {/* Desktop View: Full Table */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden h-fit">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wider border-b border-stone-100">
                  <th className="px-6 sm:px-8 py-4 font-bold">الكود</th>
                  <th className="px-6 sm:px-8 py-4 font-bold">الخصم</th>
                  <th className="px-6 sm:px-8 py-4 font-bold">الحالة</th>
                  <th className="px-6 sm:px-8 py-4 font-bold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {coupons.map(coupon => (
                  <tr key={coupon._id} className="hover:bg-stone-50/50 transition-all">
                    <td className="px-6 sm:px-8 py-4 font-bold text-on-surface text-sm sm:text-base">{coupon.code}</td>
                    <td className="px-6 sm:px-8 py-4 font-bold text-primary text-sm sm:text-base">{coupon.discountValue}%</td>
                    <td className="px-6 sm:px-8 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${new Date(coupon.expiresAt) > new Date() ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {new Date(coupon.expiresAt) > new Date() ? 'نشط' : 'منتهي'}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 text-left">
                      <button onClick={() => deleteCoupon(coupon._id)} className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-lg sm:text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
