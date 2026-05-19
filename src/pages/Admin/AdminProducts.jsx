import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle,
  TrendingUp,
  Boxes,
  ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParent, setFilterParent] = useState('');
  const [filterSub, setFilterSub] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/products');
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories?tree=true');
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: '🚨 هل أنت متأكد؟',
      text: 'هل أنت متأكد من حذف هذا المنتج نهائياً؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        Swal.fire({ icon: 'success', title: 'تم الحذف', text: 'تم حذف المنتج بنجاح.', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء الحذف', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
      }
    }
  };

  // تصفية المنتجات
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // الفئة الحالية للمنتج
    const productCatId = product.category?._id || product.category;
    
    // إيجاد الفئة الأب للمنتج من شجرة الفئات
    let parentId = null;
    categories.forEach(main => {
      if (main._id === productCatId) parentId = main._id;
      if (main.subcategories?.some(sub => sub._id === productCatId)) parentId = main._id;
    });

    const matchesParent = filterParent ? parentId === filterParent : true;
    const matchesSub = filterSub ? productCatId === filterSub : true;

    return matchesSearch && matchesParent && matchesSub;
  });

  const subCategories = categories.find(c => c._id === filterParent)?.subcategories || [];

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length
  };

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-10 text-right">
        {/* Header & Quick Stats */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-stone-800 flex items-center gap-2 sm:gap-3">
              <Package className="text-primary" size={28} />
              مستودع المنتجات
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-stone-500 mt-1">إدارة المخزون، تعديل الأسعار، وتحديث بيانات المنتجات</p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 w-full xl:w-auto justify-start xl:justify-end">
            <div className="flex-1 sm:flex-initial bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-[140px]">
              <div className="bg-primary/10 p-2.5 sm:p-3 rounded-xl text-primary"><Boxes size={20} /></div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase">الإجمالي</p>
                <p className="text-lg sm:text-xl font-black text-stone-800">{stats.total}</p>
              </div>
            </div>
            <div className="flex-1 sm:flex-initial bg-amber-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-[140px]">
              <div className="bg-amber-500 p-2.5 sm:p-3 rounded-xl text-white"><AlertTriangle size={20} /></div>
              <div>
                <p className="text-[10px] text-amber-600 font-bold uppercase">مخزون منخفض</p>
                <p className="text-lg sm:text-xl font-black text-amber-700">{stats.lowStock}</p>
              </div>
            </div>
            <Link to="/admin/products/add" className="w-full sm:w-auto justify-center bg-stone-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-stone-900 transition-all flex items-center gap-2 sm:gap-3 shadow-xl">
              <Plus size={20} />
              إضافة منتج
            </Link>
          </div>
        </header>

        {/* Search & Advanced Filters */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input 
                type="text"
                placeholder="ابحث عن منتج بالاسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 bg-stone-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:w-2/3">
              <div className="flex-1 relative group">
                <select 
                  value={filterParent}
                  onChange={(e) => {setFilterParent(e.target.value); setFilterSub('');}}
                  className="w-full px-6 py-3.5 bg-stone-50 border-none rounded-2xl outline-none appearance-none font-bold text-stone-600 cursor-pointer focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">كل الأقسام الرئيسية</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" size={16} />
              </div>

              <div className="flex-1 relative">
                <select 
                  value={filterSub}
                  onChange={(e) => setFilterSub(e.target.value)}
                  disabled={!filterParent}
                  className="w-full px-6 py-3.5 bg-stone-50 border-none rounded-2xl outline-none appearance-none font-bold text-stone-600 cursor-pointer focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                >
                  <option value="">الفئة الفرعية (الكل)</option>
                  {subCategories.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl sm:rounded-[40px] shadow-sm border border-stone-100 overflow-hidden">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-stone-400">
              <div className="w-12 h-12 border-4 border-stone-50 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="font-bold">جاري تحميل المنتجات...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-0">
              {/* Mobile View: Product Cards */}
              <div className="block sm:hidden space-y-3 p-4 bg-stone-50/30">
                {filteredProducts.map(product => (
                  <div key={product._id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm space-y-3 text-right">
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden border border-stone-100 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300"><Package size={20} /></div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-bold text-stone-800 text-xs sm:text-sm">{product.name}</p>
                        <p className="text-[9px] text-stone-400">REF: {product._id.slice(-6).toUpperCase()}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[9px] font-bold">
                            {product.category?.name || 'غير مصنف'}
                          </span>
                          {product.isNewArrival && product.newArrivalOrder && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-black">
                              وصل حديثاً {product.newArrivalOrder}/4
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-stone-50">
                      <div>
                        <span className="text-xs text-stone-400 font-bold ml-1">السعر:</span>
                        <span className="text-sm font-black text-primary">{product.price} ج.م</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${product.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {product.stock} قِطعة
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-stone-50">
                      <Link 
                        to={`/admin/products/edit/${product._id}`}
                        className="p-2 bg-stone-50 text-stone-600 rounded-lg hover:bg-stone-800 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1"
                      >
                        <Edit size={12} />
                        <span>تعديل</span>
                      </Link>
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Grid Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 border-b border-stone-100">
                      <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">المنتج</th>
                      <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest text-center">التصنيف</th>
                      <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest text-center">السعر</th>
                      <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest text-center">المخزون</th>
                      <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredProducts.map(product => (
                      <tr key={product._id} className="hover:bg-stone-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[20px] bg-stone-100 overflow-hidden shadow-sm border border-stone-100">
                              {product.images && product.images[0] ? (
                                <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300"><Package size={24} /></div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-stone-800 text-lg mb-1">{product.name}</p>
                              <p className="text-[10px] text-stone-400 font-bold bg-stone-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">REF: {product._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold">
                              {product.category?.name || 'غير مصنف'}
                            </span>
                            {product.isNewArrival && product.newArrivalOrder && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-black tracking-wide">
                                ✦ وصل حديثاً • موقع {product.newArrivalOrder}/4
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-xl font-black text-primary font-headline-md">{product.price} <span className="text-[10px] font-bold">ج.م</span></span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${product.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {product.stock} قِطعة
                          </span>
                        </td>
                        <td className="px-8 py-6 text-left">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              to={`/admin/products/edit/${product._id}`}
                              className="p-3 bg-white text-stone-400 rounded-2xl hover:bg-stone-800 hover:text-white transition-all shadow-sm border border-stone-100"
                            >
                              <Edit size={18} />
                            </Link>
                            <button 
                              onClick={() => deleteProduct(product._id)}
                              className="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-40 flex flex-col items-center justify-center text-stone-300">
              <div className="bg-stone-50 p-8 rounded-full mb-6">
                <Package size={64} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">لا توجد منتجات مطابقة</h3>
              <p className="text-stone-400">جرب تغيير الفلاتر أو البحث بكلمة أخرى</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
