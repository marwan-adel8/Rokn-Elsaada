import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { 
  LayoutGrid, 
  Plus, 
  Trash2, 
  FolderTree, 
  Search, 
  Filter as FilterIcon,
  ChevronDown
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParent, setFilterParent] = useState('all');
  
  const [formData, setFormData] = useState({
    mainCategory: '', 
    subCategory: ''   
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = formData.subCategory || formData.mainCategory;
      const parentName = formData.subCategory ? formData.mainCategory : '';

      await axios.post('/categories', {
        name: name,
        parentName: parentName
      });
      
      setFormData({ mainCategory: '', subCategory: '' });
      fetchCategories();
      Swal.fire({ icon: 'success', title: 'نجاح', text: 'تمت الإضافة بنجاح!', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: error.response?.data?.message || 'حدث خطأ أثناء الإضافة', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'حذف هذه الفئة قد يؤثر على المنتجات المرتبطة بها.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/categories/${id}`);
        fetchCategories();
        Swal.fire({ icon: 'success', title: 'تم الحذف', text: 'تم حذف الفئة بنجاح.', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء الحذف', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
      }
    }
  };

  // تصفية الفئات بناءً على البحث والفلتر المختار
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterParent === 'all') return matchesSearch;
    if (filterParent === 'main') return matchesSearch && !cat.parent;
    
    // فلترة الفئات الفرعية التابعة لقسم معين
    const parentId = typeof cat.parent === 'string' ? cat.parent : cat.parent?._id;
    return matchesSearch && parentId === filterParent;
  });

  const mainCategories = categories.filter(c => !c.parent);

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <header className="text-right">
          <h2 className="font-headline-lg text-2xl sm:text-3xl text-stone-800 mb-2">إدارة الأقسام والفئات</h2>
          <p className="font-body-md text-xs sm:text-sm text-stone-500">نظم متجرك من خلال إضافة الأقسام الأساسية والفروع التابعة لها.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Form Side */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-bold mb-6 text-stone-800 flex items-center gap-2">
                <Plus className="text-primary" size={18} />
                إضافة سريعة
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-right">
                  <label className="block text-sm font-bold text-stone-600 mb-2">الفئة الأساسية (مثل: العطور)</label>
                  <input 
                    type="text" 
                    name="mainCategory"
                    list="main-categories-list"
                    value={formData.mainCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                    placeholder="اكتب أو اختر..."
                    required
                  />
                  <datalist id="main-categories-list">
                    {mainCategories.map(cat => (
                      <option key={cat._id} value={cat.name} />
                    ))}
                  </datalist>
                </div>

                <div className="text-right">
                  <label className="block text-sm font-bold text-stone-600 mb-2">الفئة الفرعية (اختياري)</label>
                  <input 
                    type="text" 
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                    placeholder="مثال: عطور رجالي"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:bg-stone-300"
                >
                  إضافة الآن
                </button>
              </form>
            </div>
          </div>

          {/* List Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[24px] shadow-sm border border-stone-100">
              <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                  type="text"
                  placeholder="بحث عن فئة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-stone-50 border-none rounded-lg outline-none text-sm focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <FilterIcon size={16} className="text-stone-400 hidden md:block" />
                <select 
                  value={filterParent}
                  onChange={(e) => setFilterParent(e.target.value)}
                  className="flex-1 md:w-48 px-3 py-2 bg-stone-50 border-none rounded-lg outline-none text-xs font-bold text-stone-600 appearance-none cursor-pointer"
                >
                  <option value="all">كل الأقسام</option>
                  <option value="main">الأقسام الأساسية فقط</option>
                  <optgroup label="فروع تابعة لـ:">
                    {mainCategories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* List Container */}
            <div className="space-y-4">
              {/* Mobile View: Category Cards */}
              <div className="block sm:hidden space-y-3">
                {filteredCategories.length > 0 ? filteredCategories.map(cat => {
                  const isParent = !cat.parent;
                  const parentName = cat.parent ? (mainCategories.find(c => c._id === (typeof cat.parent === 'string' ? cat.parent : cat.parent?._id))?.name) : null;
                  
                  return (
                    <div key={cat._id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex justify-between items-center text-right">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isParent ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-400'}`}>
                          {isParent ? <LayoutGrid size={18} /> : <FolderTree size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 text-sm">{cat.name}</p>
                          <span className={`inline-block px-2.5 py-0.5 mt-1 text-[9px] font-bold rounded-md ${isParent ? 'bg-primary/15 text-primary' : 'bg-stone-100 text-stone-500'}`}>
                            {isParent ? 'أساسي' : `فرعي من: ${parentName || '...'}`}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteCategory(cat._id)} 
                        className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                }) : (
                  <div className="bg-white py-12 rounded-2xl text-center text-stone-400 border border-stone-100 text-xs italic">
                    لا توجد فئات مطابقة للبحث أو الفلتر
                  </div>
                )}
              </div>

              {/* Desktop View: Full Table */}
              <div className="hidden sm:block bg-white rounded-[32px] shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-stone-50/50 border-b border-stone-100">
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase tracking-wider">القسم / الفئة</th>
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase tracking-wider">النوع</th>
                      <th className="px-8 py-5 font-bold text-stone-400 text-xs uppercase tracking-wider text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredCategories.length > 0 ? filteredCategories.map(cat => {
                      const isParent = !cat.parent;
                      const parentName = cat.parent ? (mainCategories.find(c => c._id === (typeof cat.parent === 'string' ? cat.parent : cat.parent?._id))?.name) : null;
                      
                      return (
                        <tr key={cat._id} className="hover:bg-stone-50/50 transition-all group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isParent ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-400'}`}>
                                {isParent ? <LayoutGrid size={18} /> : <FolderTree size={16} />}
                              </div>
                              <p className="font-bold text-stone-800">{cat.name}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            {isParent ? (
                              <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full">أساسي</span>
                            ) : (
                              <span className="text-xs text-stone-400 font-bold">فرعي من: <span className="text-primary">{parentName || '...'}</span></span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-left">
                            <button 
                              onClick={() => deleteCategory(cat._id)} 
                              className="p-2.5 text-stone-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="3" className="py-20 text-center text-stone-400 text-sm italic">
                          لا توجد فئات مطابقة للبحث أو الفلتر
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
