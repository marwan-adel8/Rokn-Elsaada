import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products?isNewArrival=true&limit=20");
        // الترتيب النقي والمباشر: الأحدث تاريخ إضافة يظهر أولاً على اليمين تماماً مثل الأكثر مبيعاً
        const sorted = (res.data.products || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sorted);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // حساب دقيق للـ scroll وتحديث الـ active dot
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || products.length === 0) return;

    const handleScroll = () => {
      const card = el.children[0];
      if (!card) return;
      
      const cardWidth = card.offsetWidth;
      const gap = parseFloat(window.getComputedStyle(el).gap) || 16;
      
      // Math.abs لضمان التوافق التام مع قيم الـ scrollLeft السالبة في اتجاه الـ RTL
      const scrolled = Math.abs(el.scrollLeft);
      const index = Math.round(scrolled / (cardWidth + gap));
      
      setActiveIndex(Math.min(Math.max(index, 0), products.length - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [products]);

  // السكرول لمنتج معين بشكل فردي ودقيق
  const scrollToProduct = (index) => {
    const el = scrollRef.current;
    if (!el || el.children.length === 0) return;
    const card = el.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = parseFloat(window.getComputedStyle(el).gap) || 16;
    
    // دعم التنقل لجميع المتصفحات بذكاء في وضع RTL
    const isNegativeRTL = el.scrollLeft <= 0;
    const target = isNegativeRTL ? -(index * (cardWidth + gap)) : (index * (cardWidth + gap));

    el.scrollTo({
      left: target,
      behavior: "smooth"
    });
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < products.length - 1) {
      scrollToProduct(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToProduct(activeIndex - 1);
    }
  };

  if (loading) return null;
  if (products.length === 0) return null;

  const isFirstProduct = activeIndex === 0;
  const isLastProduct = activeIndex === products.length - 1;

  return (
    <section className="bg-[#f9f6f0] py-16 relative">
      <div className="container-max mx-auto px-4 lg:px-12 relative">

        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* الهيدر */}
        <div className="text-right mb-8">
          <h2 className="text-stone-800 font-bold text-3xl font-headline-md">
            وصلنا حديثاً
          </h2>
          <p className="text-stone-500 text-sm mt-1 font-body-md">
            أحدث القطع التي انضمت إلى ركن السعادة
          </p>
        </div>

        {/* السلايدر */}
        <div className="relative group/slider">
          
          {/* سهم اليسار (التالي) - يطوف خارج القوالب ويختفي في الموبايل */}
          {products.length > 1 && !isLastProduct && (
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 z-10 bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md items-center justify-center text-stone-700 hover:bg-stone-50 transition-all border border-stone-100 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* سهم اليمين (السابق) - يطوف خارج القوالب ويختفي في الموبايل */}
          {products.length > 1 && !isFirstProduct && (
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 z-10 bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md items-center justify-center text-stone-700 hover:bg-stone-50 transition-all border border-stone-100 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* الكروت المعروضة بكامل حريتها وحجمها الفاخر */}
          <div
            ref={scrollRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4"
          >
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-none w-[calc(50%-8px)] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group snap-start overflow-hidden border border-stone-100"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="block aspect-square overflow-hidden bg-stone-50 relative"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={product.name}
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "https://placehold.co/400x500?text=No+Image"
                    }
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {product.discount}%
                    </div>
                  )}
                  {/* شارة "وصل حديثاً" */}
                  <div className="absolute top-3 right-3 bg-stone-800 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                    وصل حديثاً
                  </div>
                </Link>

                <div className="p-4 text-right flex flex-col justify-between">
                  <div>
                    {product.rating > 0 && (
                      <div className="flex items-center justify-start gap-1 mb-1">
                        <span className="text-xs text-stone-500">{product.rating}</span>
                        <span className="text-yellow-400 text-xs">★</span>
                      </div>
                    )}

                    <Link to={`/product/${product._id}`}>
                      <h4 className="font-cairo font-bold text-sm text-stone-800 hover:text-[#8a4853] transition-colors leading-snug mb-2 line-clamp-1">
                        {product.name}
                      </h4>
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-center justify-start gap-2 mb-3">
                      {product.discount > 0 ? (
                        <>
                          <p className="text-[#8a4853] font-bold text-sm">
                            {(product.price * (1 - product.discount / 100)).toFixed(0)} ج.م
                          </p>
                          <p className="text-stone-400 text-xs line-through">
                            {product.price} ج.م
                          </p>
                        </>
                      ) : (
                        <p className="text-[#8a4853] font-bold text-sm">
                          {product.price} ج.م
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (product.hasSizes && product.sizes?.length > 0) {
                          navigate(`/product/${product._id}`);
                        } else {
                          addToCart(product);
                        }
                      }}
                      className="w-full py-2 border border-stone-200 text-[#8a4853] rounded-xl text-sm hover:bg-[#8a4853] hover:text-white hover:border-[#8a4853] transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الـ Dots - تختفي في الموبايل ودوائر ناعمة في الشاشات الكبيرة */}
        {products.length > 1 && (
          <div className="hidden sm:flex justify-center gap-2 mt-6 items-center">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToProduct(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer border-none outline-none ${
                  i === activeIndex
                    ? "bg-[#8a4853]"
                    : "bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default NewArrivals;