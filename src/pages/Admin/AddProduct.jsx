import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Package, Upload, X, Save, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [nextSlot, setNextSlot] = useState(null); // الـ slot الجاي المتاح
  
  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setSizes] = useState([{ size: '', price: '', discount: 0 }]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isBestSeller: false,
    isNewArrival: false,
    discount: 0,
  });

  const addSizeRow = () => {
    setSizes([...sizes, { size: '', price: '', discount: 0 }]);
  };

  const removeSizeRow = (index) => {
    if (sizes.length === 1) {
      Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'يجب إدخال مقاس واحد على الأقل عند تفعيل المقاسات', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
      return;
    }
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    const updated = sizes.map((s, i) => {
      if (i === index) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setSizes(updated);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, arrivalsRes] = await Promise.all([
          axios.get('/categories?tree=true'),
          axios.get('/products?isNewArrival=true&limit=4'),
        ]);
        setCategories(catRes.data);
        // احسب الـ slot الجاي
        const taken = (arrivalsRes.data.products || []).map(p => p.newArrivalOrder).filter(Boolean);
        for (let s = 1; s <= 4; s++) {
          if (!taken.includes(s)) { setNextSlot(s); break; }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleParentChange = (e) => {
    setParentCategory(e.target.value);
    setFormData({ ...formData, category: '' }); // ريست للفئة الفرعية
  };

  const subcategories = categories.find(c => c._id === parentCategory)?.subcategories || [];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    // لو في فئة فرعية نختارها، لو مفيش نختار الفئة الأساسية
    data.append('category', formData.category || parentCategory);
    data.append('stock', Number(formData.stock));
    data.append('isBestSeller', formData.isBestSeller);
    data.append('isNewArrival', formData.isNewArrival);
    
    if (hasSizes) {
      const invalid = sizes.some(s => !s.size || !s.price);
      if (invalid) {
        Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'الرجاء إدخال اسم المقاس وسعره لجميع المقاسات المضافة', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
        setLoading(false);
        return;
      }
      data.append('hasSizes', 'true');
      data.append('sizes', JSON.stringify(sizes.map(s => ({
        size: s.size,
        price: Number(s.price),
        discount: Number(s.discount) || 0
      }))));
      data.append('price', Number(sizes[0].price));
      data.append('discount', Number(sizes[0].discount) || 0);
    } else {
      data.append('hasSizes', 'false');
      data.append('price', Number(formData.price));
      data.append('discount', Number(formData.discount) || 0);
    }
    
    if (images.length === 0) {
      Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'الرجاء اختيار صورة واحدة على الأقل', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
      setLoading(false);
      return;
    }

    images.forEach(image => {
      data.append('images', image);
    });

    try {
      await axios.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await Swal.fire({ icon: 'success', title: 'نجاح', text: 'تم إضافة المنتج بنجاح!', timer: 1500, showConfirmButton: false });
      navigate('/admin/products');
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء إضافة المنتج. تأكد من إدخال جميع البيانات وصور صالحة.', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <header className="flex justify-between items-center mb-8 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-stone-100 rounded-full transition-all text-stone-400">
            <ArrowRight size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div className="text-right">
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-on-surface">إضافة منتج جديد</h2>
            <p className="font-body-md text-xs sm:text-sm text-stone-500">أدخل تفاصيل المنتج والصور للبدء في عرضه</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-sm border border-stone-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2 text-right">
              <Package size={18} className="text-primary" />
              المعلومات الأساسية
            </h3>
            
            <div className="space-y-4 text-right">
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">اسم المنتج</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="مثال: عطر مسك الختام"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">الوصف</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="اكتب وصفاً جذاباً للمنتج..."
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-sm border border-stone-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2 text-right">
              <Upload size={18} className="text-primary" />
              صور المنتج
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={src} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition-all text-stone-400">
                <Upload size={24} />
                <span className="text-[10px] mt-2">إضافة صور</span>
                <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[24px] shadow-sm border border-stone-100 space-y-6 h-fit text-right">
            <h3 className="text-xl font-bold text-on-surface">التسعير والمخزون</h3>
            
            <div className="space-y-4">
              {/* تفعيل الأحجام */}
              <div className="p-4 bg-[#B76E79]/5 rounded-2xl border border-[#B76E79]/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={hasSizes}
                    onChange={(e) => setHasSizes(e.target.checked)}
                    className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-bold text-stone-700">تفعيل خيار المقاسات/الأحجام للمنتج</span>
                </label>
              </div>

              {!hasSizes ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-2">السعر (ج.م)</label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-2">نسبة الخصم (%)</label>
                    <input 
                      type="number" 
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                      placeholder="مثال: 20"
                      min="0"
                      max="100"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-stone-600">جدول المقاسات والأحجام</label>
                    <button
                      type="button"
                      onClick={addSizeRow}
                      className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all"
                    >
                      + إضافة مقاس جديد
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {sizes.map((s, index) => (
                      <div key={index} className="flex gap-2 items-center bg-stone-50 p-3 rounded-xl border border-stone-100 relative">
                        <div className="grid grid-cols-3 gap-2 flex-1">
                          <div>
                            <label className="block text-[10px] text-stone-400 font-bold mb-1 mr-1">المقاس (مثال: 30 مل)</label>
                            <input
                              type="text"
                              value={s.size}
                              onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none bg-white text-right"
                              placeholder="30 مل"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-stone-400 font-bold mb-1 mr-1">السعر (ج.م)</label>
                            <input
                              type="number"
                              value={s.price}
                              onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none bg-white text-right"
                              placeholder="500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-stone-400 font-bold mb-1 mr-1">الخصم %</label>
                            <input
                              type="number"
                              value={s.discount}
                              onChange={(e) => handleSizeChange(index, 'discount', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none bg-white text-right"
                              placeholder="0"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSizeRow(index)}
                          className="p-1.5 text-stone-300 hover:text-red-500 rounded-lg hover:bg-stone-100 transition-colors self-end mb-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">الفئة الرئيسية</label>
                <select 
                  value={parentCategory}
                  onChange={handleParentChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none bg-white"
                  required
                >
                  <option value="">اختر الفئة الرئيسية</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">الفئة الفرعية</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none bg-white disabled:bg-stone-50 disabled:text-stone-400"
                  required={subcategories.length > 0}
                  disabled={subcategories.length === 0}
                >
                  <option value="">{subcategories.length > 0 ? 'اختر الفئة الفرعية' : 'لا توجد فئات فرعية لهذا القسم'}</option>
                  {subcategories.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">الكمية المتوفرة</label>
                <input 
                  type="number" 
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="مثال: 50"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-stone-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-bold text-stone-600">تعيين كـ "الأكثر مبيعاً" (للعرض بالرئيسية)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-bold text-stone-600 flex-1">تعيين كـ "وصلنا حديثاً"</span>
                {formData.isNewArrival && (
                  nextSlot
                    ? <span className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded-full whitespace-nowrap">موقع {nextSlot}/4</span>
                    : <span className="text-[10px] font-black px-2 py-0.5 bg-red-50 text-red-500 rounded-full whitespace-nowrap">الشبكة ممتلئة!</span>
                )}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 shadow-lg shadow-primary/20"
            >
              {loading ? 'جاري الحفظ...' : (
                <>
                  <Save size={20} />
                  <span>حفظ المنتج</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
