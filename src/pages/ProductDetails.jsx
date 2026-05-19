import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Heart,
  Share2,
  Maximize2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const handleNextImage = () => {
    if (!product?.images) return;
    const currentIndex = product.images.indexOf(mainImage);
    const nextIndex = (currentIndex + 1) % product.images.length;
    setMainImage(product.images[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!product?.images) return;
    const currentIndex = product.images.indexOf(mainImage);
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setMainImage(product.images[prevIndex]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data);
      setMainImage(res.data.images?.[0] || "");
      if (res.data.hasSizes && res.data.sizes?.length > 0) {
        setSelectedSize(res.data.sizes[0]);
      } else {
        setSelectedSize(null);
      }

      // جلب منتجات ذات صلة
      if (res.data.category) {
        const relatedRes = await axios.get(
          `/products?category=${res.data.category._id}&limit=4`,
        );
        setRelatedProducts(
          relatedRes.data.products.filter((p) => p._id !== id),
        );
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const activePrice = selectedSize ? selectedSize.price : product?.price;
  const activeDiscount = selectedSize ? selectedSize.discount : product?.discount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">عذراً، المنتج غير موجود</h2>
        <Link
          to="/products"
          className="text-primary font-bold border-b border-primary"
        >
          العودة للمتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="pt-12 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-y-2 gap-x-2 text-stone-400 text-xs sm:text-sm mb-8 sm:mb-12 font-body-md leading-relaxed text-right">
          <Link to="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft size={14} />
          <Link to="/products" className="hover:text-primary transition-colors">
            المتجر
          </Link>
          <ChevronLeft size={14} />

          {/* القسم الأساسي (إذا وجد) */}
          {product.category?.parent && (
            <>
              <Link
                to={`/products?category=${product.category.parent._id}`}
                className="hover:text-primary transition-colors"
              >
                {product.category.parent.name}
              </Link>
              <ChevronLeft size={14} />
            </>
          )}

          {/* القسم الحالي */}
          {product.category && (
            <>
              <Link
                to={`/products?category=${product.category._id}`}
                className="hover:text-primary transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronLeft size={14} />
            </>
          )}

          <span className="text-on-background font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Gallery Section */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[600px] no-scrollbar">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? "border-primary shadow-lg scale-105" : "border-stone-100 opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt={`view-${index}`}
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative group flex justify-center">
              <div className="w-full max-w-[600px] aspect-square rounded-[32px] overflow-hidden bg-white shadow-2xl shadow-stone-200/50 border border-stone-100 relative">
                <img
                  src={mainImage}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  alt={product.name}
                />
                
                {/* Navigation Arrows */}
                {product.images?.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 hover:bg-white transition-all shadow-md z-20"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-700 hover:bg-white transition-all shadow-md z-20"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-md z-20 ${
                  isInWishlist(product._id)
                    ? "bg-primary text-white"
                    : "bg-white/90 text-stone-400 hover:text-red-500"
                }`}
              >
                <Heart
                  size={20}
                  fill={isInWishlist(product._id) ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-block px-4 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full mb-4">
                {product.category?.name || "مجموعة حصرية"}
              </span>
              <h1 className="font-headline-lg text-4xl text-on-background mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-col gap-1">
                {activeDiscount > 0 ? (
                  <>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-bold text-primary font-headline-md">
                        {(activePrice * (1 - activeDiscount / 100)).toFixed(0)} ج.م
                      </p>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        وفر {activeDiscount}%
                      </span>
                    </div>
                    <p className="text-lg text-stone-400 line-through font-bold">
                      {activePrice} ج.م
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-primary font-headline-md">
                    {activePrice} ج.م
                  </p>
                )}
              </div>
            </div>

            {/* Note Map Placeholder if it's a perfume */}
            {product.category?.name?.includes("عطر") && (
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 space-y-4">
                <div className="flex justify-between text-center">
                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                      القمة
                    </p>
                    <p className="text-sm font-bold text-primary">زعفران</p>
                  </div>
                  <div className="w-px h-8 bg-stone-200 my-auto"></div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                      القلب
                    </p>
                    <p className="text-sm font-bold text-primary">ورد</p>
                  </div>
                  <div className="w-px h-8 bg-stone-200 my-auto"></div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                      القاعدة
                    </p>
                    <p className="text-sm font-bold text-primary">عود</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {product.hasSizes && product.sizes?.length > 0 && (
              <div className="space-y-3 pt-2 text-right">
                <h3 className="text-sm font-bold text-stone-500 mr-1">المقاس / الحجم المتاح:</h3>
                <div className="flex flex-wrap gap-2 justify-start">
                  {product.sizes.map((s, idx) => {
                    const isSelected = selectedSize?.size === s.size;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(s)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary shadow-sm scale-[1.03]"
                            : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-stone-200 rounded-full px-4 py-2 bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className="flex-1 bg-primary text-white h-14 rounded-full font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all"
                >
                  <ShoppingBag size={22} />
                  <span>أضف إلى السلة</span>
                </button>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-stone-100 text-stone-500 hover:bg-stone-50 transition-all">
                  <Share2 size={18} />
                  <span className="text-sm font-bold">مشاركة</span>
                </button>
                <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Truck size={18} />
                  <span className="text-sm font-bold">شحن مجاني</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center gap-6 text-sm text-stone-400 font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                أصلي 100%
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-primary" />
                ضمان الجودة
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-32">
          <div className="flex items-center gap-12 border-b border-stone-100 mb-12 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 text-lg font-bold transition-all whitespace-nowrap ${activeTab === "reviews" ? "border-b-2 border-primary text-primary" : "text-stone-400 hover:text-stone-600 border-b-2 border-transparent"}`}
            >
              آراء العملاء (124)
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-4 text-lg font-bold transition-all whitespace-nowrap ${activeTab === "details" ? "border-b-2 border-primary text-primary" : "text-stone-400 hover:text-stone-600 border-b-2 border-transparent"}`}
            >
              وصف المنتج
            </button>
          </div>

          <div className="animate-in fade-in duration-500">
            {activeTab === "reviews" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "سارة العتيبي",
                    text: "عطر مذهل بكل معنى الكلمة، الثبات رائع والفوحان قوي جداً.",
                    date: "منذ يومين",
                  },
                  {
                    name: "فيصل محمد",
                    text: "تجربة رائعة من ركن السعادة. العود في هذا العطر نقي جداً ورائحته ملكية فعلاً.",
                    date: "منذ أسبوع",
                  },
                  {
                    name: "مريم خالد",
                    text: "الرائحة جميلة جداً ولكن تمنيت لو كان هناك حجم أصغر لتجربته أولاً.",
                    date: "منذ أسبوعين",
                  },
                ].map((review, i) => (
                  <div
                    key={i}
                    className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold border border-primary/10">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">
                            {review.name}
                          </p>
                          <p className="text-xs text-stone-400 font-bold">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-500 leading-relaxed font-body-md">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[40px] border border-stone-100 prose max-w-none">
                <p className="text-stone-500 leading-loose text-lg">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-headline-lg text-4xl text-on-background">
                  قد يعجبك أيضاً
                </h2>
                <p className="text-stone-400 font-bold mt-2">
                  مختاراتنا المميزة من نفس القسم
                </p>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-2 text-primary font-bold group"
              >
                <span>مشاهدة الكل</span>
                <ChevronLeft
                  size={20}
                  className="transition-transform group-hover:-translate-x-2"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <div key={item._id} className="group">
                  <div className="relative aspect-square rounded-[32px] overflow-hidden mb-6 bg-white border border-stone-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={item.images?.[0]}
                      alt={item.name}
                    />
                    <Link
                      to={`/product/${item._id}`}
                      className="absolute inset-0 z-10"
                    ></Link>
                    <button
                      onClick={() => toggleWishlist(item)}
                      className={`absolute top-4 left-4 z-20 p-2 rounded-full transition-all backdrop-blur-md shadow-lg ${
                        isInWishlist(item._id)
                          ? "bg-primary text-white scale-110 opacity-100"
                          : "bg-white/90 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={isInWishlist(item._id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-400 text-xs font-bold mb-1">
                      {item.category?.name}
                    </p>
                    <h3 className="font-bold text-on-background mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold text-lg">
                      {item.price} ج.م
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
