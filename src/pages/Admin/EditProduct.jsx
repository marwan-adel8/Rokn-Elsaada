import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { Package, Upload, X, Save, ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  
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
    newArrivalOrder: null,
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
        // 1. جلب الفئات
        const catRes = await axios.get('/categories?tree=true');
        setCategories(catRes.data);

        // 2. جلب بيانات المنتج
        const prodRes = await axios.get(`/products/${id}`);
        const product = prodRes.data;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category?._id || product.category,
          stock: product.stock,
          isBestSeller: product.isBestSeller || false,
          isNewArrival: product.isNewArrival || false,
          newArrivalOrder: product.newArrivalOrder || null,
          discount: product.discount || 0,
        });

        setHasSizes(product.hasSizes || false);
        if (product.hasSizes && product.sizes && product.sizes.length > 0) {
          setSizes(product.sizes);
        } else {
          setSizes([{ size: '', price: '', discount: 0 }]);
        }

        // تحديد الفئة الأب للمنتج
        const productCatId = product.category?._id || product.category;
        catRes.data.forEach(main => {
          if (main._id === productCatId) setParentCategory(main._id);
          if (main.subcategories?.some(sub => sub._id === productCatId)) {
            setParentCategory(main._id);
          }
        });

        if (product.images) {
          setPreviews(product.images);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء تحميل بيانات المنتج', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleParentChange = (e) => {
    setParentCategory(e.target.value);
    setFormData({ ...formData, category: '' });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    // إذا كانت صورة جديدة تم اختيارها للتو
    if (index >= (previews.length - images.length)) {
      const newImages = images.filter((_, i) => i !== (index - (previews.length - images.length)));
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category || parentCategory);
    data.append('stock', Number(formData.stock));
    data.append('isBestSeller', formData.isBestSeller);
    data.append('isNewArrival', formData.isNewArrival);
    
    if (hasSizes) {
      const invalid = sizes.some(s => !s.size || !s.price);
      if (invalid) {
        Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'الرجاء إدخال اسم المقاس وسعره لجميع المقاسات المضافة', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
        setSaving(false);
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
    
    // إضافة الصور الجديدة فقط
    images.forEach(image => {
      data.append('images', image);
    });

    // ملاحظة: في العادة يتم إرسال الصور القديمة التي نريد الاحتفاظ بها أيضاً
    // لكن حسب الـ API الحالي، سنقوم بإرسال الصور الجديدة
    // إذا كنت تريد تحديث الصور بالكامل أو الحفاظ على القديمة، يفضل تعديل الـ API لاحقاً

    try {
      await axios.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await Swal.fire({ icon: 'success', title: 'نجاح', text: 'تم تحديث المنتج بنجاح!', timer: 1500, showConfirmButton: false });
      navigate('/admin/products');
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء التحديث', confirmButtonText: 'حسناً', confirmButtonColor: '#B76E79' });
    } finally {
      setSaving(false);
    }
  };

  const subcategories = categories.find(c => c._id === parentCategory)?.subcategories || [];

  if (loading) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold">جاري تحميل بيانات المنتج...</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <header className="flex justify-between items-center mb-8 sm:mb-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-stone-100 rounded-full transition-all text-stone-400">
            <ArrowRight size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div className="text-right">
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-stone-800">تعديل المنتج</h2>
            <p className="font-body-md text-xs sm:text-sm text-stone-500">تحديث بيانات وصور {formData.name}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 text-right">
        {/* Info Side */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
              <Package size={18} className="text-primary" />
              المعلومات الأساسية
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">اسم المنتج</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
              <Upload size={18} className="text-primary" />
              صور المنتج (إضافة صور جديدة)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border border-stone-100">
                  <img src={src} className="w-full h-full object-cover" alt="product" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition-all text-stone-400 group">
                <Upload size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] mt-2 font-bold text-stone-400">إضافة صور</span>
                <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            </div>
            <p className="text-[10px] text-stone-400 italic font-bold">* يمكنك إضافة صور جديدة، سيتم الاحتفاظ بالصور القديمة إذا لم تقم بحذفها.</p>
          </div>
        </div>

        {/* Pricing & Category Side */}
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] shadow-sm border border-stone-100 space-y-6">
            <h3 className="text-xl font-bold text-stone-800">التسعير والتصنيف</h3>
            
            <div className="space-y-5">
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
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-primary"
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
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
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
                              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none bg-white text-right font-bold text-stone-700"
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
                              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none bg-white text-right font-bold text-stone-700"
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
                              className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-xs outline-none bg-white text-right font-bold text-stone-700"
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
                <label className="block text-sm font-bold text-stone-600 mb-2">القسم الرئيسي</label>
                <select 
                  value={parentCategory || ''}
                  onChange={handleParentChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="">اختر القسم الرئيسي</option>
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
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none bg-white appearance-none cursor-pointer disabled:bg-stone-50"
                  required={subcategories.length > 0}
                  disabled={subcategories.length === 0}
                >
                  <option value="">{subcategories.length > 0 ? 'اختر الفئة الفرعية' : 'لا توجد فروع لهذا القسم'}</option>
                  {subcategories.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">المخزون (الكمية)</label>
                <input 
                  type="number" 
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
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
                {formData.isNewArrival && formData.newArrivalOrder && (
                  <span className="text-[10px] font-black px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    موقع {formData.newArrivalOrder}/4
                  </span>
                )}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold hover:bg-stone-900 transition-all flex items-center justify-center gap-2 disabled:bg-stone-300 shadow-xl"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <Save size={20} />
                  <span>تحديث المنتج</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;
