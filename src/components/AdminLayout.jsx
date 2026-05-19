import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2"; // ✅ للتنبيهات الفاخرة
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  TicketPercent,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "الإحصائيات", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "المنتجات", icon: Package, path: "/admin/products" },
    { name: "الفئات", icon: Tags, path: "/admin/categories" },
    { name: "الطلبات", icon: ShoppingBag, path: "/admin/orders" },
    { name: "المستخدمين", icon: Users, path: "/admin/users" },
    { name: "الكوبونات", icon: TicketPercent, path: "/admin/coupons" },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "هل أنت متأكد من تسجيل الخروج؟",
      text: "سيتعين عليك تسجيل الدخول مجدداً للوصول إلى لوحة التحكم.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8a4853", // لون البراند المارون الفاخر
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، سجل الخروج",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: "font-cairo rounded-[24px]", // تناسق فخم مع هوية الموقع الدائرية
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // بتعمل reload وبتودي للـ Home مباشرة
      }
    });
  };

  return (
    <div className="bg-surface-bright font-body-md text-on-surface min-h-screen flex flex-col lg:flex-row rtl">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 right-0 left-0 bg-white border-b border-stone-200 h-16 px-4 sm:px-6 flex items-center justify-between z-[50] shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-stone-600 hover:text-primary transition-colors focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-[#B76E79] font-headline-lg">
            ركن السعادة
          </h1>
        </Link>
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          {user?.name?.charAt(0)}
        </div>
      </header>

      {/* Mobile Sidebar Overlay / Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/45 backdrop-blur-sm z-[60] transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-80 bg-white border-l border-stone-200 shadow-2xl flex flex-col py-8 z-[70] transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-8 mb-8 flex items-center justify-between">
          <div>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <h1 className="text-2xl font-bold text-[#B76E79] font-headline-lg">
                ركن السعادة
              </h1>
            </Link>
            <p className="text-xs text-stone-500 mt-1">لوحة تحكم الإدارة</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 transition-all rounded-xl ${
                location.pathname === item.path
                  ? "bg-primary text-white shadow-lg font-bold"
                  : "text-stone-600 hover:bg-stone-50 hover:pr-8"
              }`}
            >
              <item.icon size={20} />
              <span className="font-headline-md text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="px-8 mt-auto border-t border-stone-200 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">{user?.name}</p>
              <p className="text-xs text-stone-500">مدير النظام</p>
            </div>
            <div className="mr-auto flex gap-2 flex-shrink-0">
              <Link
                to="/"
                className="text-stone-400 hover:text-primary transition-colors"
                title="العودة للمتجر"
              >
                <Store size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-stone-400 hover:text-red-500 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-12 lg:mr-80 mt-16 lg:mt-0 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
