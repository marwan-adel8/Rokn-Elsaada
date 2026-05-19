import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  ShoppingBag, 
  Search, 
  ChevronLeft,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Heart,
  Plus,
  Minus,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';

const priceOptions = [
  { label: "أقل من 200 ج.م", value: "under-200", min: "", max: "200" },
  { label: "من 200 إلى 400 ج.م", value: "200-400", min: "200", max: "400" },
  { label: "من 400 إلى 600 ج.م", value: "400-600", min: "400", max: "600" },
  { label: "من 600 إلى 1200 ج.م", value: "600-1200", min: "600", max: "1200" },
  { label: "أكثر من 1200 ج.م", value: "over-1200", min: "1200", max: "" }
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFromUrl = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceOption, setSelectedPriceOption] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms for better responsiveness

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories');
      // عرض الفئات الفرعية فقط (التي لها أب)
      const subCats = res.data.filter(cat => cat.parent !== null);
      setCategories(subCats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/products', {
        params: {
          category: selectedCategory,
          search: searchQuery,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort: sortBy
        }
      });
      setProducts(res.data.products || []);
      setVisibleCount(9);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedPriceOption('all');
    setSortBy('newest');
    navigate('/products');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="bg-[#fffcfb] min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-[#B76E79]/5 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-right">
            <h1 className="font-headline-lg text-4xl text-primary mb-2">متجر ركن السعادة</h1>
            <p className="text-stone-500 font-body-md">استكشف مجموعتنا الفاخرة من العطور والإكسسوارات</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Link to="/" className="hover:text-primary">الرئيسية</Link>
            <ChevronLeft size={16} />
            <span className="text-primary font-bold">المتجر</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 space-y-6">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden">
              {/* Search in Sidebar */}
              <div className="p-6 border-b border-stone-50">
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن المنتجات"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-2xl border border-stone-100 outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              {/* Categories Accordion */}
              <div className="border-b border-stone-50">
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="w-full flex justify-between items-center px-6 py-5 hover:bg-stone-50 transition-colors"
                >
                  <span className="font-bold text-stone-800">فئات المنتجات</span>
                  {isCategoriesOpen ? <Minus size={18} className="text-stone-400" /> : <Plus size={18} className="text-stone-400" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isCategoriesOpen ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                  <div className="px-6 space-y-1">
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-right px-4 py-2.5 rounded-xl transition-all text-sm ${selectedCategory === '' ? 'bg-primary/5 text-primary font-bold' : 'text-stone-600 hover:text-primary hover:bg-stone-50'}`}
                    >
                      جميع المنتجات
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat._id)}
                        className={`w-full text-right px-4 py-2.5 rounded-xl transition-all text-sm ${selectedCategory === cat._id ? 'bg-primary/5 text-primary font-bold' : 'text-stone-600 hover:text-primary hover:bg-stone-50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Accordion */}
              <div className="border-b border-stone-50">
                <button 
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="w-full flex justify-between items-center px-6 py-5 hover:bg-stone-50 transition-colors"
                >
                  <span className="font-bold text-stone-800">السعر</span>
                  {isPriceOpen ? <Minus size={18} className="text-stone-400" /> : <Plus size={18} className="text-stone-400" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isPriceOpen ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                  <div className="px-6 space-y-4">
                    {/* Radio options */}
                    <div className="space-y-3">
                      {priceOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group text-sm text-stone-600 hover:text-[#8a4853] transition-colors justify-start"
                        >
                          <input
                            type="radio"
                            name="priceOption"
                            checked={selectedPriceOption === option.value}
                            onChange={() => {
                              setSelectedPriceOption(option.value);
                              setMinPrice(option.min);
                              setMaxPrice(option.max);
                            }}
                            className="w-4 h-4 border border-stone-300 text-[#8a4853] focus:ring-[#8a4853]/20 accent-[#8a4853] cursor-pointer"
                          />
                          <span className={`${selectedPriceOption === option.value ? 'text-[#8a4853] font-bold' : ''}`}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                      
                      <label
                        className="flex items-center gap-3 cursor-pointer group text-sm text-stone-600 hover:text-[#8a4853] transition-colors justify-start"
                      >
                        <input
                          type="radio"
                          name="priceOption"
                          checked={selectedPriceOption === 'all'}
                          onChange={() => {
                            setSelectedPriceOption('all');
                            setMinPrice('');
                            setMaxPrice('');
                          }}
                          className="w-4 h-4 border border-stone-300 text-[#8a4853] focus:ring-[#8a4853]/20 accent-[#8a4853] cursor-pointer"
                        />
                        <span className={`${selectedPriceOption === 'all' ? 'text-[#8a4853] font-bold' : ''}`}>
                          الكل (عرض جميع الأسعار)
                        </span>
                      </label>
                    </div>

                    {/* Custom Range Inputs */}
                    <div className="pt-4 border-t border-stone-100">
                      <p className="text-xs text-stone-400 mb-3 font-bold text-right">تحديد سعر مخصص:</p>
                      <div className="flex items-center gap-3 justify-center" dir="rtl">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            placeholder="من"
                            value={selectedPriceOption === 'custom' ? minPrice : ''}
                            onChange={(e) => {
                              setSelectedPriceOption('custom');
                              setMinPrice(e.target.value);
                            }}
                            className="w-full px-3 py-2 text-right bg-stone-50 rounded-xl border border-stone-200 outline-none text-xs focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-cairo"
                          />
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 pointer-events-none">
                            ج.م
                          </span>
                        </div>

                        <span className="text-stone-300">-</span>

                        <div className="relative flex-1">
                          <input
                            type="number"
                            placeholder="إلى"
                            value={selectedPriceOption === 'custom' ? maxPrice : ''}
                            onChange={(e) => {
                              setSelectedPriceOption('custom');
                              setMaxPrice(e.target.value);
                            }}
                            className="w-full px-3 py-2 text-right bg-stone-50 rounded-xl border border-stone-200 outline-none text-xs focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-cairo"
                          />
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 pointer-events-none">
                            ج.م
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="p-6">
                <button 
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-stone-200 rounded-2xl text-stone-500 font-bold hover:bg-stone-50 hover:text-primary transition-all text-sm"
                >
                  <RotateCcw size={16} />
                  <span>مسح الفلاتر</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-xl text-primary lg:hidden" onClick={() => setShowMobileFilters(true)}>
                  <SlidersHorizontal size={20} />
                </div>
                <span className="text-sm text-stone-500 font-bold">تم العثور على {products.length} منتج</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 hidden sm:block">ترتيب حسب:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold text-stone-700 cursor-pointer"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p>جاري جلب المنتجات...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8">
                  {products.slice(0, visibleCount).map(product => (
                  <div key={product._id} className="group bg-white rounded-2xl sm:rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between">
                    <div className="aspect-square relative overflow-hidden bg-stone-50 rounded-xl sm:rounded-none">
                      <Link to={`/product/${product._id}`}>
                        <img 
                          src={product.images && product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#ff6b6b] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md z-10">
                          {product.discount}%
                        </div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-2 left-2 sm:top-4 sm:left-4 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm z-10 ${
                          isInWishlist(product._id) 
                            ? 'bg-primary text-white scale-110' 
                            : 'bg-white/90 text-stone-400 hover:text-primary'
                        }`}
                      >
                        <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => {
                          if (product.hasSizes && product.sizes?.length > 0) {
                            navigate(`/product/${product._id}`);
                          } else {
                            addToCart(product);
                          }
                        }}
                        className="hidden sm:flex absolute -bottom-12 left-1/2 -translate-x-1/2 group-hover:bottom-6 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-xl transition-all duration-500 items-center gap-2 whitespace-nowrap active:scale-95 z-20"
                      >
                        <ShoppingBag size={18} />
                        إضافة للسلة
                      </button>
                    </div>
                    <div className="p-3 sm:p-6 text-right flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                      <div className="space-y-1 sm:space-y-2">
                        <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors block">
                          <h3 className="font-cairo font-bold text-xs sm:text-lg leading-tight line-clamp-2 min-h-[32px] sm:min-h-[50px]">{product.name}</h3>
                        </Link>
                      </div>
                      
                      <div className="pt-2 sm:pt-4 border-t border-stone-50">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-sm sm:text-xl font-bold text-primary font-headline-md">
                                {(product.price * (1 - product.discount / 100)).toFixed(0)} ج.م
                              </span>
                              <span className="text-[10px] sm:text-sm text-stone-400 line-through font-body-sm">
                                {product.price} ج.م
                              </span>
                            </>
                          ) : (
                            <span className="text-sm sm:text-xl font-bold text-primary font-headline-md">
                              {product.price} ج.م
                            </span>
                          )}
                        </div>

                        {/* Mobile Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (product.hasSizes && product.sizes?.length > 0) {
                              navigate(`/product/${product._id}`);
                            } else {
                              addToCart(product);
                            }
                          }}
                          className="w-full py-2 sm:hidden border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs flex items-center justify-center active:scale-95 transition-all mt-2.5 cursor-pointer bg-white"
                        >
                          <ShoppingBag size={14} className="text-stone-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
                {products.length > visibleCount && (
                  <div className="flex justify-center mt-12 mb-4">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 9)}
                      className="bg-stone-900 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 text-sm flex items-center gap-2"
                    >
                      تحميل المزيد
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-[40px] py-20 flex flex-col items-center justify-center border-2 border-dashed border-stone-100">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">لا توجد منتجات</h3>
                <p className="text-stone-400">جرب البحث بكلمة أخرى أو تغيير القسم</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-8 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl">تصفية المنتجات</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-stone-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Mobile Search */}
              <div>
                <h4 className="font-bold mb-4 text-primary">بحث</h4>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن المنتجات"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-2xl border border-stone-100 outline-none transition-all text-sm"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              {/* Mobile Categories */}
              <div>
                <h4 className="font-bold mb-4 text-primary">الأقسام</h4>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedCategory === '' ? 'bg-primary text-white shadow-md' : 'bg-stone-50 text-stone-600'}`}
                  >
                    الكل
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedCategory === cat._id ? 'bg-primary text-white shadow-md' : 'bg-stone-50 text-stone-600'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Sort */}
              <div>
                <h4 className="font-bold mb-4 text-primary">ترتيب حسب</h4>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-4 bg-stone-50 rounded-2xl border border-stone-100 outline-none text-sm font-bold text-stone-700"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                </select>
              </div>

              {/* Mobile Price */}
              <div>
                <h4 className="font-bold mb-4 text-primary">تصفية السعر</h4>
                <div className="space-y-3 mb-4">
                  {priceOptions.map((option) => (
                    <label
                      key={option.value + "-mob"}
                      className="flex items-center gap-3 cursor-pointer text-sm text-stone-600 hover:text-[#8a4853] transition-colors justify-start"
                    >
                      <input
                        type="radio"
                        name="priceOptionMob"
                        checked={selectedPriceOption === option.value}
                        onChange={() => {
                          setSelectedPriceOption(option.value);
                          setMinPrice(option.min);
                          setMaxPrice(option.max);
                        }}
                        className="w-4 h-4 border border-stone-300 text-[#8a4853] accent-[#8a4853]"
                      />
                      <span className={`${selectedPriceOption === option.value ? 'text-[#8a4853] font-bold' : ''}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                  <label
                    className="flex items-center gap-3 cursor-pointer text-sm text-stone-600 hover:text-[#8a4853] transition-colors justify-start"
                  >
                    <input
                      type="radio"
                      name="priceOptionMob"
                      checked={selectedPriceOption === 'all'}
                      onChange={() => {
                        setSelectedPriceOption('all');
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="w-4 h-4 border border-stone-300 text-[#8a4853] accent-[#8a4853]"
                    />
                    <span className={`${selectedPriceOption === 'all' ? 'text-[#8a4853] font-bold' : ''}`}>
                      الكل (عرض جميع الأسعار)
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 justify-center" dir="rtl">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="من"
                      value={selectedPriceOption === 'custom' ? minPrice : ''}
                      onChange={(e) => {
                        setSelectedPriceOption('custom');
                        setMinPrice(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-right bg-stone-50 rounded-xl border border-stone-200 outline-none text-xs focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-cairo"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 pointer-events-none">
                      ج.م
                    </span>
                  </div>

                  <span className="text-stone-300">-</span>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="إلى"
                      value={selectedPriceOption === 'custom' ? maxPrice : ''}
                      onChange={(e) => {
                        setSelectedPriceOption('custom');
                        setMaxPrice(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-right bg-stone-50 rounded-xl border border-stone-200 outline-none text-xs focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all font-cairo"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 pointer-events-none">
                      ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* Clear Button */}
              <button 
                onClick={() => {clearFilters(); setShowMobileFilters(false)}}
                className="w-full flex items-center justify-center gap-2 py-4 border border-stone-200 rounded-2xl text-stone-500 font-bold hover:bg-stone-50 transition-all"
              >
                <RotateCcw size={18} />
                <span>مسح الكل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shop;
