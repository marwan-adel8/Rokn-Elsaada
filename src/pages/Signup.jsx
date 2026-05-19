import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Register user
      await axios.post("/auth/register", formData);

      // 2. Auto-login after successful registration
      const loginRes = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, ...user } = loginRes.data;

      // 3. Login with reload - always go to Home after signup
      login(user, token, "/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل إنشاء الحساب. تأكد من البيانات.";
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
        {/* Signup Card */}
        <div className="bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(138,72,83,0.15)] p-10 md:p-12">
          {/* Branding */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-5xl">
                person_add
              </span>
            </div>
            <h1 className="font-headline-lg text-3xl text-primary tracking-tight">
              إنشاء حساب جديد
            </h1>
            <p className="font-body-md text-secondary mt-2">
              انضم إلينا لتجربة تسوق فريدة
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                className="block font-label-md text-sm text-on-surface"
                htmlFor="name"
              >
                الاسم بالكامل
              </label>
              <div className="relative">
                <input
                  className="w-full px-5 py-3.5 bg-surface-container-low border border-outline-variant rounded-[20px] font-body-md outline-none transition-all focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 text-right"
                  id="name"
                  name="name"
                  placeholder="محمد أحمد"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  className="w-full px-5 py-3.5 bg-surface-container-low border border-outline-variant rounded-[20px] font-body-md outline-none transition-all focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 text-right"
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

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                className="block font-label-md text-sm text-on-surface"
                htmlFor="phone"
              >
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  className="w-full px-5 py-3.5 bg-surface-container-low border border-outline-variant rounded-[20px] font-body-md outline-none transition-all focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 text-right text-left"
                  id="phone"
                  name="phone"
                  placeholder="01xxxxxxxxx"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
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
                  className="w-full px-5 py-3.5 bg-surface-container-low border border-outline-variant rounded-[20px] font-body-md outline-none transition-all focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/10 text-right"
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

            {/* Terms */}
            <p className="text-xs text-stone-500 leading-relaxed">
              بالضغط على إنشاء حساب، أنت توافق على{" "}
              <a href="#" className="text-primary hover:underline">
                الشروط والأحكام
              </a>{" "}
              و{" "}
              <a href="#" className="text-primary hover:underline">
                سياسة الخصوصية
              </a>{" "}
              الخاصة بنا.
            </p>

            {/* Primary CTA */}
            <button
              className={`w-full py-4 bg-[#B76E79] hover:bg-primary text-white font-headline-md text-xl rounded-[20px] shadow-lg active:scale-[0.98] transition-all duration-300 mt-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "جاري التحميل..." : "إنشاء الحساب"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center mt-8 font-body-md text-stone-600">
            لديك حساب بالفعل؟
            <Link
              className="text-primary font-bold hover:underline mr-1"
              to="/login"
            >
              تسجيل الدخول
            </Link>
          </p>
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

export default Signup;
