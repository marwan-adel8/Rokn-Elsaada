import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/auth/login", formData);

      // الباك اند بيبعت التوكن مع بيانات المستخدم في نفس الـ Object
      const { token, ...user } = res.data;

      // تحديد الصفحة المطلوبة حسب نوع المستخدم وعمل reload
      const redirectPath = user.role === "admin" ? "/admin/dashboard" : "/";
      login(user, token, redirectPath);
    } catch (err) {
      // إظهار الرسالة القادمة من الباك اند أو رسالة افتراضية
      const errorMessage =
        err.response?.data?.message ||
        "تعذر الاتصال بالسيرفر. تأكد من تشغيل الباك اند.";
      Swal.fire({
        icon: 'error',
        title: 'عذراً...',
        text: errorMessage,
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#B76E79'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-body-md rtl">
      <main className="w-full max-w-[480px]">
        {/* Login Card */}
        <div className="bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(138,72,83,0.15)] p-10 md:p-12">
          {/* Branding */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-5xl">
                auto_awesome
              </span>
            </div>
            <h1 className="font-headline-lg text-3xl text-primary tracking-tight">
              ركن السعادة
            </h1>
            <p className="font-body-md text-secondary mt-2">
              مرحباً بك في عالم الفخامة والجمال
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="block font-label-md text-sm text-on-surface"
                htmlFor="email"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-[20px] font-body-md outline-none transition-all focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 text-right"
                  id="email"
                  name="email"
                  placeholder="example@luxury.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="block font-label-md text-sm text-on-surface"
                htmlFor="password"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant rounded-[20px] font-body-md outline-none transition-all focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 text-right"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary-container transition-all"
                  type="checkbox"
                />
                <span className="font-body-md text-sm text-stone-600 group-hover:text-primary transition-colors">
                  تذكرني
                </span>
              </label>
              <a
                className="font-label-md text-sm text-primary hover:underline transition-all"
                href="#"
              >
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Primary CTA */}
            <button
              className={`w-full py-4 bg-[#B76E79] hover:bg-primary text-white font-headline-md text-xl rounded-[20px] shadow-lg active:scale-[0.98] transition-all duration-300 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-stone-400 font-body-md">
                أو عبر
              </span>
            </div>
          </div>

          {/* Footer Link */}
          <p className="text-center mt-10 font-body-md text-stone-600">
            ليس لديك حساب؟
            <Link
              className="text-primary font-bold hover:underline mr-1"
              to="/signup"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-8 opacity-40">
          <div className="flex items-center gap-1 font-label-md text-xs text-stone-600">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>متجر موثق</span>
          </div>
          <div className="flex items-center gap-1 font-label-md text-xs text-stone-600">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>دفع آمن</span>
          </div>
        </div>
      </main>

      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-primary/10"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-primary-container/10"></div>
      </div>
    </div>
  );
};

export default Login;
