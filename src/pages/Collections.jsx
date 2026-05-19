import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flower2, Heart, Trees } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import perfumess from "../assets/img/roken-5.png";
import bokor from "../assets/img/roken-6.png";
import dahb from "../assets/img/roken-7.png";
import prize from "../assets/img/roken-8.png";

const Collections = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories?tree=true");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryId = (name) => {
    if (!categories || categories.length === 0) return "";
    const searchName = name.trim().toLowerCase();
    
    // البحث في الأقسام الرئيسية والفرعية (نفس منطق الـ Navbar)
    for (const cat of categories) {
      if (cat.name.toLowerCase().includes(searchName)) return cat._id;
      if (cat.subcategories && cat.subcategories.length > 0) {
        const sub = cat.subcategories.find(s => s.name.toLowerCase().includes(searchName));
        if (sub) return sub._id;
      }
    }
    return "";
  };
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="pt-12 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <header className="text-right mb-16">
          <h1 className="font-headline-lg text-4xl md:text-5xl text-primary mb-4">
            اكتشف مجموعاتنا
          </h1>
          <p className="font-body-lg text-stone-500 max-w-2xl ml-auto leading-relaxed">
            رحلة فاخرة بين أروقة الجمال، حيث نجمع لك أرقى العطور، المجوهرات
            المختارة، والبخور الذي يحكي قصص الأصالة.
          </p>
        </header>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Category 1: Perfumes (Large Featured) */}
          <Link 
            to="/products"
            className="md:col-span-8 group relative overflow-hidden rounded-[32px] shadow-sm aspect-[4/5] sm:aspect-square md:aspect-[16/9] bg-stone-100 block"
          >
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              src={perfumess}
              alt="العطور"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:from-black/70 md:via-transparent"></div>
            <div className="absolute bottom-0 right-0 p-6 sm:p-8 md:p-12 text-right w-full">
              <span className="inline-block px-3 py-1 mb-3 sm:mb-4 bg-[#f0e0c8] text-[#8a4853] text-[10px] sm:text-xs font-bold rounded-full">
                الأكثر مبيعاً
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-5xl text-white mb-2">العطور المركزة</h2>
              <p className="font-body-md text-sm sm:text-base text-stone-200 mb-5 sm:mb-6 max-w-[280px] sm:max-w-md ml-auto">
                نفحات فريدة تلامس الروح وتدوم طويلاً، صُممت لتناسب ذوقك الرفيع.
              </p>
              <div className="inline-flex items-center gap-2 bg-white text-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl text-xs sm:text-base">
                <span>تسوق المجموعة</span>
                <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
            </div>
          </Link>

          {/* Category 2: Incense */}
          <Link 
            to={`/products?category=${getCategoryId("بخور")}`}
            className="md:col-span-4 group relative overflow-hidden rounded-[32px] shadow-sm aspect-square md:aspect-auto bg-stone-100 block"
          >
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              src={bokor}
              alt="البخور"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 p-8 text-right">
              <h2 className="font-headline-md text-2xl text-white mb-2">
                البخور{" "}
              </h2>
              <p className="font-body-md text-stone-200 mb-6">
                أصالة الماضي في لمسات عصرية
              </p>
              <span className="text-white border-b border-white pb-1 font-bold hover:text-primary-fixed transition-colors">
                عرض المجموعة
              </span>
            </div>
          </Link>

          {/* Category 3: Jewelry */}
          <Link 
            to={`/products?category=${getCategoryId("ذهب")}`}
            className="md:col-span-4 group relative overflow-hidden rounded-[32px] shadow-sm aspect-square md:aspect-auto bg-stone-100 block"
          >
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              src={dahb}
              alt="المجوهرات"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#8a4853]/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 p-8 text-right">
              <h2 className="font-headline-md text-2xl text-white mb-2">
                الذهب الصيني{" "}
              </h2>
              <p className="font-body-md text-stone-200 mb-6">
                أناقة الذهب في تفاصيل يومك
              </p>
              <span className="text-white border-b border-white pb-1 font-bold hover:text-primary-fixed transition-colors">
                اكتشف المزيد
              </span>
            </div>
          </Link>

{/* Promotional Banner Section */}
<div className="md:col-span-8 bg-white rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row-reverse items-center justify-between gap-10 border border-stone-100 shadow-sm overflow-hidden relative group">
  
  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

  <div className="text-right relative z-10 max-w-md">
    
    <h3 className="font-headline-md text-2xl md:text-3xl text-primary mb-3">
      هدايا ركن السعادة الفاخرة
    </h3>

    <p className="font-body-md text-stone-500 mb-6 leading-relaxed">
      اختر هديتك المثالية من عطورنا الفاخرة، والبخور المميز، والإكسسوارات الأنيقة.
      مجموعات جاهزة للتقديم تضيف لمسة من الفخامة والسعادة لمن تحب.
    </p>

    <button className="bg-primary text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
      اكتشف مجموعة الهدايا
    </button>

  </div>

  {/* Image Frame */}
  <div className="relative p-4 rounded-[28px] bg-gradient-to-br from-stone-50 to-stone-100 border border-primary/20 shadow-xl group-hover:shadow-2xl transition-all duration-500">
    
    <div className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-2xl">
      <img 
        className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500" 
                src={prize}
        alt="هدايا ركن السعادة"
      />
    </div>

  </div>

</div>
        </div>

        {/* Featured Fragrance Note Map */}
        <section className="mt-24 bg-white rounded-[40px] p-12 shadow-sm border border-stone-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#B76E79]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="text-center mb-16 relative z-10">
            <h3 className="font-headline-md text-3xl text-primary mb-2">
              خارطة النوتات العطرية
            </h3>
            <p className="font-body-md text-stone-500">
              مكونات عطر "سعادة" الأيقوني
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-16 relative z-10">
            <div className="text-center flex flex-col items-center gap-4 group">
              <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Flower2 size={32} />
              </div>
              <div>
                <h4 className="font-bold text-primary text-lg">
                  القمة العطرية
                </h4>
                <p className="text-sm text-stone-500">
                  البرغموت، الفلفل الوردي
                </p>
              </div>
            </div>

            <div className="hidden md:block h-[2px] w-24 bg-stone-100"></div>

            <div className="text-center flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 transform group-hover:scale-110 transition-all duration-500">
                <Heart size={40} fill="currentColor" />
              </div>
              <div>
                <h4 className="font-bold text-primary text-xl">قلب العطر</h4>
                <p className="text-sm text-stone-500 font-bold">
                  الياسمين، الورد البلغاري
                </p>
              </div>
            </div>

            <div className="hidden md:block h-[2px] w-24 bg-stone-100"></div>

            <div className="text-center flex flex-col items-center gap-4 group">
              <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Trees size={32} />
              </div>
              <div>
                <h4 className="font-bold text-primary text-lg">
                  القاعدة العطرية
                </h4>
                <p className="text-sm text-stone-500">
                  خشب الصندل، المسك الأبيض
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
