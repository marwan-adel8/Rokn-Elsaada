import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

// تهيئة EmailJS برمجياً بالأوبشنز العالمية للإصدار الرابع بالملفات الأصلية الشغالة
emailjs.init({
  publicKey: "-tkbiRd2fFk88CcQ4",
});

const Contact = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        title: "خطأ",
        text: "يرجى ملء جميع الحقول المطلوبة.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#B76E79",
      });
      return;
    }

    setSending(true);

    try {
      // إرسال النموذج باستخدام sendForm والـ Ref الخاص به والبيانات الأصلية المؤكدة
      await emailjs.sendForm(
        "service_64p11xy", // SERVICE_ID الأصلي الشغال
        "template_likwbmc", // TEMPLATE_ID الأصلي الشغال
        formRef.current,
      );

      Swal.fire({
        title: "تم الإرسال بنجاح!",
        text: "تم إرسال رسالتك بنجاح، سنقوم بالرد عليك في أقرب وقت.",
        icon: "success",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#B76E79",
      });

      // إعادة تعيين النموذج والـ Ref
      formRef.current.reset();
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      Swal.fire({
        title: "فشل الإرسال",
        text: "حدث خطأ أثناء محاولة إرسال الرسالة، يرجى المحاولة مرة أخرى لاحقاً.",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#B76E79",
      });
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="min-h-screen bg-surface flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow">
        {/* Contact Hero */}
        <section className="bg-primary text-white py-20 text-center">
          <h1 className="font-display-lg text-4xl md:text-6xl mb-4">
            اتصل بنا
          </h1>
          <p className="font-body-lg text-lg opacity-90">
            نحن هنا للإجابة على استفساراتكم
          </p>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="font-headline-lg text-3xl text-primary mb-8">
              معلومات التواصل
            </h2>

            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
              <div className="w-12 h-12 bg-secondary-container/30 rounded-full flex items-center justify-center text-primary">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800">رقم الهاتف</h4>
                <a
                  href="https://wa.me/201064935277"
                  target="_blank"
                  rel="noreferrer"
                  dir="ltr"
                  className="text-stone-600 font-body-md hover:text-[#B76E79] transition-colors"
                >
                  +20 1064935277
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
              <div className="w-12 h-12 bg-secondary-container/30 rounded-full flex items-center justify-center text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800">البريد الإلكتروني</h4>
                <p className="text-stone-600 font-body-md">
                  info@roknelsaada.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
              <div className="w-12 h-12 bg-secondary-container/30 rounded-full flex items-center justify-center text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800">العنوان</h4>
                <p className="text-stone-600 font-body-md">
                  الغربيه، المحله الكبري ، مصر
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
            <h3 className="font-headline-md text-2xl text-primary mb-6">
              أرسل لنا رسالة
            </h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  الاسم بالكامل
                </label>
                <input
                  type="text"
                  name="user_name" // الاسم بالكامل ليتوافق تماماً مع قالب EmailJS الشغال
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-primary outline-none transition-all"
                  placeholder="ادخل اسمك"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="user_email" // البريد الإلكتروني ليتوافق تماماً مع قالب EmailJS الشغال
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-primary outline-none transition-all"
                  placeholder="example@mail.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="user_phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  dir="rtl"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-primary outline-none transition-all"
                  placeholder="مثال: 01xxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  الرسالة
                </label>
                <textarea
                  name="message" // الرسالة لتتوافق تماماً مع قالب EmailJS الشغال
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-primary outline-none transition-all h-32"
                  placeholder="كيف يمكننا مساعدتك؟"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "جاري الإرسال..." : "إرسال الرسالة"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
