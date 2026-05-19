import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import coverman from "../assets/img/cover-1.png";
import coverwoman from "../assets/img/cover-2.png";
import Boxes from "../assets/img/cover-3.png";
import Bookor from "../assets/img/cover-4.png";

const CategoriesSection = () => {
  const [menCategoryId, setMenCategoryId] = useState("");
  const [womenCategoryId, setWomenCategoryId] = useState("");
  const [giftsCategoryId, setGiftsCategoryId] = useState("");
  const [incenseCategoryId, setIncenseCategoryId] = useState("");

  // جلب الفئات ديناميكياً والربط التلقائي والذكي
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories?tree=true");
        const tree = res.data || [];

        // 1. فحص فئة العطور الفرعية للرجال والنساء
        const perfumeMainCat = tree.find(
          (cat) =>
            cat.name.includes("عطور") ||
            cat.name.includes("العطور")
        );

        if (perfumeMainCat && perfumeMainCat.subcategories?.length > 0) {
          const subs = perfumeMainCat.subcategories;

          const menCat = subs.find(
            (sub) =>
              sub.name.includes("رجال") ||
              sub.name.includes("رجالي") ||
              sub.name.includes("الرجال")
          );
          if (menCat) setMenCategoryId(menCat._id);

          const womenCat = subs.find(
            (sub) =>
              sub.name.includes("نساء") ||
              sub.name.includes("حريمي") ||
              sub.name.includes("نسائي") ||
              sub.name.includes("النساء")
          );
          if (womenCat) setWomenCategoryId(womenCat._id);
        }

        // دالة بحث ذكية وعامة للفئات الأخرى (تبحث في الرئيسية والفرعية)
        const findCatByName = (nameQueries) => {
          for (const cat of tree) {
            if (nameQueries.some((q) => cat.name.includes(q))) {
              return cat;
            }
            if (cat.subcategories && cat.subcategories.length > 0) {
              const foundSub = cat.subcategories.find((sub) =>
                nameQueries.some((q) => sub.name.includes(q))
              );
              if (foundSub) return foundSub;
            }
          }
          return null;
        };

        // 2. البحث عن فئة بوكس الهدايا
        const giftsCat = findCatByName(["هدايا", "هدية", "بوكس", "Gifts", "Gift"]);
        if (giftsCat) setGiftsCategoryId(giftsCat._id);

        // 3. البحث عن فئة البخور
        const incenseCat = findCatByName(["بخور", "البخور", "Incense", "Bukhoor"]);
        if (incenseCat) setIncenseCategoryId(incenseCat._id);

      } catch (error) {
        console.error("Error fetching categories for home section:", error);
      }
    };
    fetchCategories();
  }, []);

  // روابط التوجيه للمتجر
  const menLink = menCategoryId ? `/products?category=${menCategoryId}` : "/products";
  const womenLink = womenCategoryId ? `/products?category=${womenCategoryId}` : "/products";
  const giftsLink = giftsCategoryId ? `/products?category=${giftsCategoryId}` : "/products";
  const incenseLink = incenseCategoryId ? `/products?category=${incenseCategoryId}` : "/products";

  return (
    <section className="bg-[#f9f6f0] pb-16 pt-8 relative font-cairo">
      <div className="container-max mx-auto px-4 lg:px-12">
        
        {/* العنوان الرئيسي للقسم */}
        <div className="text-center mb-8">
          <h2 className="text-stone-800 font-bold text-2xl sm:text-3xl leading-snug">
            خيارات تلبي احتياجك
          </h2>
        </div>

        {/* شبكة الصور الكبيرة الفاخرة (دائماً عمودين 2x2 حتى في الموبايل والتابلت) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          
          {/* 1. كارت عطور الرجال (يظهر يمين أول صف في RTL) */}
          <div className="flex flex-col items-center">
            <Link 
              to={menLink} 
              className="w-full aspect-square md:aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[32px] block shadow-sm border border-stone-100 relative group"
            >
              <img
                src={coverman}
                alt="عطور للرجال"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link 
              to={menLink}
              className="text-stone-800 font-bold text-sm sm:text-base md:text-lg mt-3 hover:text-[#8a4853] transition-colors block text-center"
            >
              عطور للرجال
            </Link>
          </div>

          {/* 2. كارت عطور للنساء (يظهر يسار أول صف في RTL) */}
          <div className="flex flex-col items-center">
            <Link 
              to={womenLink} 
              className="w-full aspect-square md:aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[32px] block shadow-sm border border-stone-100 relative group"
            >
              <img
                src={coverwoman}
                alt="عطور للنساء"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link 
              to={womenLink}
              className="text-stone-800 font-bold text-sm sm:text-base md:text-lg mt-3 hover:text-[#8a4853] transition-colors block text-center"
            >
              عطور للنساء
            </Link>
          </div>

          {/* 3. كارت بوكسات الهدايا (يظهر يمين ثاني صف في RTL) */}
          <div className="flex flex-col items-center">
            <Link 
              to={giftsLink} 
              className="w-full aspect-square md:aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[32px] block shadow-sm border border-stone-100 relative group"
            >
              <img
                src={Boxes}
                alt="بوكسات الهدايا"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link 
              to={giftsLink}
              className="text-stone-800 font-bold text-sm sm:text-base md:text-lg mt-3 hover:text-[#8a4853] transition-colors block text-center"
            >
              بوكسات الهدايا
            </Link>
          </div>

          {/* 4. كارت الأعواد/البخور (يظهر يسار ثاني صف في RTL) */}
          <div className="flex flex-col items-center">
            <Link 
              to={incenseLink} 
              className="w-full aspect-square md:aspect-[16/10] overflow-hidden rounded-[20px] sm:rounded-[32px] block shadow-sm border border-stone-100 relative group"
            >
              <img
                src={Bookor}
                alt="الأعواد"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link 
              to={incenseLink}
              className="text-stone-800 font-bold text-sm sm:text-base md:text-lg mt-3 hover:text-[#8a4853] transition-colors block text-center"
            >
              الأعواد
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
