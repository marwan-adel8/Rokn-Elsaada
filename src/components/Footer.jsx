import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // ✅ لاستدعاء الفئات ديناميكياً
import logo from "../assets/img/logo-elsaada.png";
import { ChevronDown, ChevronUp } from "lucide-react";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [categories, setCategories] = useState([]);

  // جلب شجرة الفئات ديناميكياً لتحديد المعرفات (IDs)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories?tree=true");
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories in Footer:", error);
      }
    };
    fetchCategories();
  }, []);

  // دالة ذكية للبحث عن معرف الفئة بالاسم
  const getCategoryId = (nameQueries) => {
    if (!categories || categories.length === 0) return "";
    for (const cat of categories) {
      if (nameQueries.some((q) => cat.name.toLowerCase().includes(q.toLowerCase()))) {
        return cat._id;
      }
      if (cat.subcategories && cat.subcategories.length > 0) {
        const foundSub = cat.subcategories.find((sub) =>
          nameQueries.some((q) => sub.name.toLowerCase().includes(q.toLowerCase()))
        );
        if (foundSub) return foundSub._id;
      }
    }
    return "";
  };

  const toggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="w-full mt-20 bg-[#FFFEFD] border-t border-stone-200 pt-16 pb-4 overflow-hidden">
      {/* ===== DESKTOP LAYOUT (md+): 4-column grid, unchanged ===== */}
      <div className="hidden md:grid max-w-[95%] mx-auto px-4 grid-cols-4 gap-12 text-right items-start">
        {/* Column 1: Logo */}
        <div className="flex flex-col items-start -mt-16">
          <img
            src={logo}
            alt="ركن السعادة"
            className="h-[350px] w-auto object-contain"
          />
        </div>

        {/* Column 2: الأقسام */}
        <div>
          <h4 className="text-lg font-bold text-stone-800 mb-6 font-headline-md">
            الأقسام
          </h4>
          <ul className="space-y-4 text-stone-600 font-body-md">
            <li>
              <Link
                to={`/products?category=${getCategoryId(["رجال", "رجالي", "men"])}`}
                className="hover:text-[#B76E79] transition-colors"
              >
                العطور الرجالية
              </Link>
            </li>
            <li>
              <Link
                to={`/products?category=${getCategoryId(["نساء", "نسائي", "حريمي", "women"])}`}
                className="hover:text-[#B76E79] transition-colors"
              >
                العطور النسائية
              </Link>
            </li>
            <li>
              <Link
                to={`/products?category=${getCategoryId(["ذهب", "الذهب", "gold"])}`}
                className="hover:text-[#B76E79] transition-colors"
              >
                الذهب الصيني 
              </Link>
            </li>
            <li>
              <Link
                to={`/products?category=${getCategoryId(["هدايا", "بوكسات", "بوكس", "gifts", "gift"])}`}
                className="hover:text-[#B76E79] transition-colors"
              >
                بوكسات الهدايا
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: روابط مفيدة */}
        <div>
          <h4 className="text-lg font-bold text-stone-800 mb-6 font-headline-md">
            روابط مفيدة
          </h4>
          <ul className="space-y-4 text-stone-600 font-body-md">
            <li>
              <Link to="/" className="hover:text-[#B76E79] transition-colors">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-[#B76E79] transition-colors"
              >
                من نحن
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-[#B76E79] transition-colors"
              >
                المتجر
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-[#B76E79] transition-colors"
              >
                اتصل بنا
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: التواصل الاجتماعي */}
        <div>
          <h4 className="text-lg font-bold text-stone-800 mb-6 font-headline-md">
            تواصل معنا
          </h4>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            تابعنا على منصات التواصل الاجتماعي ليصلك كل جديد عن منتجاتنا وعروضنا
            الحصرية
          </p>
          <div className="flex flex-row gap-3">
            <a
              href="https://www.facebook.com/amraaaaaan?mibextid=ZbWKwL"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm overflow-hidden"
            >
              <img
                src="https://img.icons8.com/fluency/48/facebook-new.png"
                alt="facebook"
                className="w-7 h-7 object-contain"
              />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm overflow-hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#212121"
                  fillRule="evenodd"
                  d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191 C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#ec407a"
                  fillRule="evenodd"
                  d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#81d4fa"
                  fillRule="evenodd"
                  d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm"
            >
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM17.43 8.35L15.55 17.2C15.41 17.81 15.05 17.96 14.54 17.67L11.75 15.61L10.4 16.91C10.25 17.06 10.13 17.18 9.85 17.18L10.05 14.33L15.24 9.64C15.46 9.44 15.19 9.33 14.9 9.53L8.49 13.56L5.73 12.7C5.13 12.51 5.12 12.1 5.86 11.81L16.63 7.66C17.13 7.48 17.57 7.78 17.43 8.35Z"
                  fill="#2CA5E0"
                />
              </svg>
            </a>
            <a
              href="https://wa.me/201288560515"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm overflow-hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#40c351"
                  d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                ></path>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ===== MOBILE LAYOUT (< md): Accordion, logo top, RTL ===== */}
      <div className="md:hidden px-5 dir-rtl">
        {/* Logo - top, centered, compact */}
        <div className="flex justify-center mb-6 -mt-8">
          <img
            src={logo}
            alt="ركن السعادة"
            className="h-[100px] w-auto object-contain"
          />
        </div>

        {/* Accordion: الأقسام */}
        <div className="border-b border-stone-100">
          <button
            className="w-full flex flex-row items-center justify-between py-4 text-right"
            onClick={() => toggle("sections")}
          >
            <span className="text-base font-bold text-stone-800">الأقسام</span>
            <span className="text-stone-400">
              {openSection === "sections" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </span>
          </button>
          {openSection === "sections" && (
            <ul className="text-right space-y-3 text-stone-600 pb-4">
              <li>
                <Link
                  to={`/products?category=${getCategoryId(["رجال", "رجالي", "men"])}`}
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  العطور الرجالية
                </Link>
              </li>
              <li>
                <Link
                  to={`/products?category=${getCategoryId(["نساء", "نسائي", "حريمي", "women"])}`}
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  العطور النسائية
                </Link>
              </li>
              <li>
                <Link
                  to={`/products?category=${getCategoryId(["ذهب", "الذهب", "gold"])}`}
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  الذهب الصيني 
                </Link>
              </li>
              <li>
                <Link
                  to={`/products?category=${getCategoryId(["هدايا", "بوكسات", "بوكس", "gifts", "gift"])}`}
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  بوكسات الهدايا
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Accordion: روابط مفيدة */}
        <div className="border-b border-stone-100">
          <button
            className="w-full flex flex-row items-center justify-between py-4 text-right"
            onClick={() => toggle("links")}
          >
            <span className="text-base font-bold text-stone-800">
              روابط مفيدة
            </span>
            <span className="text-stone-400">
              {openSection === "links" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </span>
          </button>
          {openSection === "links" && (
            <ul className="text-right space-y-3 text-stone-600 pb-4">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  المتجر
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#B76E79] transition-colors block py-1"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Social Media: title + icons, right-aligned */}
        <div className="py-6 text-right">
          <h4 className="text-base font-bold text-stone-800 mb-1">
            مواقع التواصل والشبكات الاجتماعية
          </h4>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            يمكنك متابعتنا جديداً على الشبكة الاجتماعية المناسبة لك عبر الروابط
            التالية
          </p>
          <div className="flex flex-row gap-3 justify-start">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm overflow-hidden"
            >
              <img
                src="https://img.icons8.com/fluency/48/facebook-new.png"
                alt="facebook"
                className="w-6 h-6 object-contain"
              />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm overflow-hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#212121"
                  fillRule="evenodd"
                  d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191 C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#ec407a"
                  fillRule="evenodd"
                  d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM17.43 8.35L15.55 17.2C15.41 17.81 15.05 17.96 14.54 17.67L11.75 15.61L10.4 16.91C10.25 17.06 10.13 17.18 9.85 17.18L10.05 14.33L15.24 9.64C15.46 9.44 15.19 9.33 14.9 9.53L8.49 13.56L5.73 12.7C5.13 12.51 5.12 12.1 5.86 11.81L16.63 7.66C17.13 7.48 17.57 7.78 17.43 8.35Z"
                  fill="#2CA5E0"
                />
              </svg>
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:border-[#B76E79] transition-all bg-white shadow-sm overflow-hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#40c351"
                  d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                ></path>
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-stone-100 mt-4 pt-6 text-center text-stone-400 text-sm">
        <p>
          © 2026 جميع الحقوق محفوظة{" "}
          <a
            href="https://wa.me/201064935277"
            target="_blank"
            rel="noreferrer"
            className="text-[#B76E79] font-bold hover:underline"
          >
            لمروان
          </a>
        </p>
      </div>

      {/* مسافة سفلية على الموبايل لتفادي تغطية الـ Tab Bar للمحتوى */}
      <div className="md:hidden h-20" />
    </footer>
  );
};

export default Footer;
