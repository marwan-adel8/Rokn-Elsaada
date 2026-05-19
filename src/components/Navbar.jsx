import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  X,
  Search,
  User as UserIcon,
  LogOut,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronLeft,
  Menu,
  LayoutDashboard,
  Home,
  Store,
} from "lucide-react";
import logo from "../assets/img/logo-elsaada.png";
import Swal from "sweetalert2";

const Navbar = () => {
  const [showTopBar, setShowTopBar] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const [mobileSearch, setMobileSearch] = useState("");
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const searchRef = useRef(null);

  // states للبحث
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "تسجيل الخروج",
      text: "هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B76E79",
      cancelButtonColor: "#919193ff",
      confirmButtonText: "نعم، سجل الخروج",
      cancelButtonText: "إلغاء",
      reverseButtons: true,
      customClass: {
        popup: "rounded-[24px] font-body-md",
        confirmButton: "rounded-full px-8 py-3 font-bold",
        cancelButton: "rounded-full px-8 py-3 font-bold text-stone-600",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "تم تسجيل الخروج بنجاح",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          background: "#fff",
          color: "#B76E79",
          customClass: {
            popup: "rounded-[24px] font-body-md",
          },
        });
      }
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories?tree=true");
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories for navbar:", error);
      }
    };
    fetchCategories();
  }, []);

  // إغلاق الـ drawer والبحث لو ضغط برا
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        setDrawerOpen(false);
      }
      if (
        showDropdown &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen, showDropdown]);

  // البحث الفوري (Live Search)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await axios.get(`/products?search=${searchTerm}`);
          setSearchResults(res.data.products.slice(0, 6) || []); // عرض أول 6 نتائج فقط
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // منع scroll لما الـ drawer مفتوح
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleDesktopSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(mobileSearch.trim())}`);
      setDrawerOpen(false);
      setMobileSearch("");
    }
  };

  return (
    <>
      {/* ── Top announcement bar (shared mobile + desktop) ── */}
      {showTopBar && (
        <div className="bg-black text-white py-1.5 px-4 flex justify-between items-center text-sm w-full">
          <div className="w-6" />
          <div className="flex-1 text-center font-label-md">
            أَهْلًا بِكَ فِي رُكْنِ السَّعَادَة ✨
          </div>
          <button
            onClick={() => setShowTopBar(false)}
            className="w-6 flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════
          DESKTOP NAV  (md و أكبر)
      ════════════════════════════════════════ */}
      <nav className="hidden md:block sticky top-0 z-50 w-full shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        {/* Middle bar */}
        <div className="bg-[#FFFEFD] flex justify-between items-center px-6 md:px-12 h-24 w-full border-b border-stone-50">
          {/* يمين: بحث */}
          <div className="flex-1 flex justify-start">
            <div ref={searchRef} className="relative w-full max-w-md">
              <form 
                onSubmit={handleDesktopSearchSubmit}
                className="flex items-stretch w-full bg-white border-2 border-[#B76E79] rounded-full overflow-hidden shadow-sm focus-within:shadow-md transition-shadow h-11"
              >
                <input
                  className="flex-1 px-5 text-sm outline-none bg-transparent placeholder-stone-400 text-right"
                  placeholder="ابحث عن المنتجات..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.trim().length >= 2 && setShowDropdown(true)}
                />
                <button 
                  type="submit"
                  className="bg-[#B76E79] w-14 text-white flex items-center justify-center hover:bg-[#a6606b] transition-colors flex-shrink-0"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Search size={22} strokeWidth={2.5} />
                  )}
                </button>
              </form>

              {/* نتائج البحث المنسدلة */}
              {showDropdown && (
                <div className="absolute top-full right-0 left-0 mt-3 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider text-right">نتائج البحث</div>
                      {searchResults.map(product => (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchTerm("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors flex-row-reverse text-right"
                        >
                          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                            <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-stone-800 truncate">{product.name}</h4>
                            <p className="text-xs text-[#B76E79] font-bold mt-0.5">{product.price} ج.م</p>
                          </div>
                        </Link>
                      ))}
                      <Link 
                        to={`/products?search=${searchTerm}`}
                        onClick={() => setShowDropdown(false)}
                        className="block py-3 text-center text-xs font-bold text-stone-500 hover:text-primary bg-stone-50/50 transition-colors"
                      >
                        عرض كل النتائج لـ "{searchTerm}"
                      </Link>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="bg-stone-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-stone-300">
                        <Search size={24} />
                      </div>
                      <p className="text-sm text-stone-500 font-bold">عذراً، لم نجد نتائج لـ "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* وسط: لوجو */}
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <img
                src={logo}
                alt="ركن السعادة"
                className="h-20 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* يسار: أيقونات */}
          <div className="flex-1 flex justify-end items-center gap-3 md:gap-5">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-full hover:bg-[#B76E79] hover:text-white transition-all text-xs font-bold border border-stone-200"
                    title="لوحة التحكم"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">لوحة التحكم</span>
                  </Link>
                )}
                <div className="flex flex-col items-end border-r pr-4 border-stone-100">
                  <span className="text-stone-400 text-[10px]">مرحباً بك</span>
                  <span className="text-stone-800 font-bold text-sm">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-stone-100 text-stone-600 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all border border-stone-200"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-[#B76E79] text-white px-4 py-2 rounded-full font-label-md hover:bg-[#a6606b] transition-colors"
              >
                <span>تسجيل الدخول / إنشاء حساب</span>
                <div className="bg-white text-stone-900 rounded-full p-1">
                  <UserIcon size={16} />
                </div>
              </Link>
            )}

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/wishlist"
                className="relative bg-[#B76E79] text-white p-2 md:p-2.5 rounded-full flex items-center justify-center hover:bg-[#a6606b] transition-colors"
              >
                <span className="absolute -top-1 -right-1 bg-[#B76E79] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlist.length}
                </span>
                <Heart size={20} />
              </Link>
              <Link
                to="/cart"
                className="relative bg-[#B76E79] text-white p-2 md:p-2.5 rounded-full flex items-center justify-center hover:bg-[#a6606b] transition-colors"
              >
                <span className="absolute -top-1 -right-1 bg-[#B76E79] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {getCartCount()}
                </span>
                <ShoppingBag size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom nav links */}
        <div className="bg-[#B76E79] text-white px-6 md:px-12 py-3 flex justify-center items-center gap-6 md:gap-8 font-label-md text-[14px] md:text-[15px] border-t border-[#c67d89]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `pb-1 transition-all duration-300 border-b-2 ${isActive ? "border-white font-bold" : "border-transparent hover:border-white/60 hover:text-[#CDC5C0]"}`
            }
          >
            الرئيسية
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `pb-1 transition-all duration-300 border-b-2 ${isActive ? "border-white font-bold" : "border-transparent hover:border-white/60 hover:text-[#CDC5C0]"}`
            }
          >
            من نحن
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              `pb-1 transition-all duration-300 border-b-2 ${isActive ? "border-white font-bold" : "border-transparent hover:border-white/60 hover:text-[#CDC5C0]"}`
            }
          >
            المجموعات
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `pb-1 transition-all duration-300 border-b-2 ${isActive ? "border-white font-bold" : "border-transparent hover:border-white/60 hover:text-[#CDC5C0]"}`
            }
          >
            المتجر
          </NavLink>

          {categories.map((mainCat) => (
            <div
              key={mainCat._id}
              className="relative group pb-1 cursor-pointer transition-all duration-300 border-b-2 border-transparent hover:border-white/60"
            >
              {mainCat.subcategories?.length > 0 ? (
                <>
                  <div className="flex items-center gap-1 hover:text-[#CDC5C0] transition-colors">
                    <span>{mainCat.name}</span>
                    <ChevronDown size={18} />
                  </div>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white text-stone-800 shadow-xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-stone-100 translate-y-2 group-hover:translate-y-0">
                    {mainCat.subcategories.map((subCat) => (
                      <Link
                        key={subCat._id}
                        to={`/products?category=${subCat._id}`}
                        className="block px-4 py-3 hover:bg-stone-50 hover:text-[#B76E79] border-b border-stone-50 last:border-0 transition-colors"
                      >
                        {subCat.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={`/products?category=${mainCat._id}`}
                  className="hover:text-[#CDC5C0] transition-colors"
                >
                  {mainCat.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ════════════════════════════════════════
          MOBILE TOP BAR  (أصغر من md)
      ════════════════════════════════════════ */}
      <nav className="md:hidden sticky top-0 z-50 w-full bg-[#FFFEFD] border-b border-stone-100 shadow-sm">
        <div className="relative flex items-center justify-between px-4 h-16">
          {/* يسار: أيقونة المستخدم */}

          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-stone-700 flex-shrink-0"
            aria-label="القائمة"
          >
            <Menu size={26} />
          </button>

          {/* وسط: لوجو (مطلق في منتصف الشريط) */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src={logo}
              alt="ركن السعادة"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* يمين: Hamburger */}
          <Link
            to={
              user
                ? user.role === "admin"
                  ? "/admin/dashboard"
                  : "/profile"
                : "/login"
            }
            className="w-10 h-10 rounded-full bg-[#B76E79] flex items-center justify-center text-white flex-shrink-0 shadow-md"
          >
            <UserIcon size={20} />
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          MOBILE BOTTOM TAB BAR
      ════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16 px-2">
          {/* الرئيسية */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 transition-colors ${isActive ? "text-[#B76E79]" : "text-stone-400"}`
            }
          >
            <Home size={22} />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </NavLink>

          {/* المتجر */}
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 transition-colors ${isActive ? "text-[#B76E79]" : "text-stone-400"}`
            }
          >
            <Store size={22} />
            <span className="text-[10px] font-bold">المتجر</span>
          </NavLink>

          {/* المفضلة */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 px-3 transition-colors ${isActive ? "text-[#B76E79]" : "text-stone-400"}`
            }
          >
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 right-2 bg-[#B76E79] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none">
                {wishlist.length}
              </span>
            )}
            <Heart size={22} />
            <span className="text-[10px] font-bold">المفضلة</span>
          </NavLink>

          {/* السلة */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 px-3 transition-colors ${isActive ? "text-[#B76E79]" : "text-stone-400"}`
            }
          >
            {getCartCount() > 0 && (
              <span className="absolute -top-0.5 right-2 bg-[#B76E79] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none">
                {getCartCount()}
              </span>
            )}
            <ShoppingBag size={22} />
            <span className="text-[10px] font-bold">السلة</span>
          </NavLink>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SIDE DRAWER
      ════════════════════════════════════════ */}

      {/* Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`md:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        dir="rtl"
        className={`md:hidden fixed top-0 right-0 h-full w-[82vw] max-w-sm z-[70] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <img
            src={logo}
            alt="ركن السعادة"
            className="h-10 w-auto object-contain"
          />
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-5 py-3 border-b border-stone-100">
          <form
            onSubmit={handleMobileSearch}
            className="flex items-center gap-2 bg-stone-50 rounded-full px-4 py-2.5 border border-stone-200"
          >
            <Search size={18} className="text-stone-400 flex-shrink-0" />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="ابحث عن المنتجات"
              className="flex-1 bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400 min-w-0"
            />
          </form>
        </div>

        {/* Scrollable nav links */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Static links */}
          {[
            { to: "/", label: "الرئيسية", end: true },
            { to: "/about", label: "من نحن" },
            { to: "/products", label: "المتجر" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-start px-5 py-4 border-b border-stone-50 text-[15px] font-bold transition-colors ${
                  isActive
                    ? "text-[#B76E79]"
                    : "text-stone-700 hover:text-[#B76E79]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Dynamic categories */}
          {categories.map((mainCat) => (
            <div key={mainCat._id} className="border-b border-stone-50">
              {mainCat.subcategories?.length > 0 ? (
                <>
                   <button
                    onClick={() =>
                      setExpandedCat(
                        expandedCat === mainCat._id ? null : mainCat._id,
                      )
                    }
                    className="w-full flex items-center justify-between px-5 py-4 text-[15px] font-bold text-stone-700 hover:text-[#B76E79] transition-colors"
                  >
                    <span>{mainCat.name}</span>
                    <ChevronLeft
                      size={18}
                      className={`text-stone-300 transition-transform duration-200 ${
                        expandedCat === mainCat._id ? "-rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Subcategories accordion */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedCat === mainCat._id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {mainCat.subcategories.map((subCat) => (
                      <Link
                        key={subCat._id}
                        to={`/products?category=${subCat._id}`}
                        onClick={() => setDrawerOpen(false)}
                        className="flex justify-start px-8 py-3 text-sm text-stone-500 hover:text-[#B76E79] bg-stone-50/60 border-t border-stone-100 transition-colors"
                      >
                        {subCat.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={`/products?category=${mainCat._id}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex justify-start px-5 py-4 text-[15px] font-bold text-stone-700 hover:text-[#B76E79] transition-colors"
                >
                  {mainCat.name}
                </Link>
              )}
            </div>
          ))}

          <NavLink
            to="/contact"
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex justify-start px-5 py-4 border-b border-stone-50 text-[15px] font-bold transition-colors ${
                isActive
                  ? "text-[#B76E79]"
                  : "text-stone-700 hover:text-[#B76E79]"
              }`
            }
          >
            اتصل بنا
          </NavLink>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-stone-100 px-5 py-4">
          {user ? (
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}
                className="flex items-center gap-2 text-red-400 text-sm font-bold hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
              <div className="text-right">
                <p className="text-stone-400 text-[11px]">مرحباً بك</p>
                <p className="text-stone-800 font-bold text-sm">{user.name}</p>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-[#B76E79] text-white py-3 rounded-full font-bold hover:bg-[#a6606b] transition-colors"
            >
              <UserIcon size={18} />
              تسجيل الدخول / إنشاء حساب
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
