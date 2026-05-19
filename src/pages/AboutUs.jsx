import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Sparkles, Gem, ShieldCheck } from "lucide-react";
import { Globe, FlaskConical, Leaf, Target, Heart } from "lucide-react";

const AboutUs = () => {
  return (
    <div
      className="min-h-screen bg-[#f9f6f0] flex flex-col font-cairo"
      dir="rtl"
    >
      <Navbar />

      <main className="flex-grow">
        {/* 1. Header Section (عنوان بسيط وأنيق بدون صورة هيرو) */}
        <section className="bg-white border-b border-stone-100 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#8a4853]/5 opacity-30 pointer-events-none" />
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <h1 className="text-stone-800 font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
              من نحن
            </h1>
            <div className="w-16 h-[3px] bg-[#8a4853] mx-auto mb-6 rounded-full" />
            <p className="text-stone-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              ركن السعادة: حكايتنا وشغفنا لنشر الجمال، العطور الفاخرة،
              والإكسسوارات الراقية التي تليق بهويتك الفريدة.
            </p>
          </div>
        </section>

        {/* 2. Our Story Section (قصة ركن السعادة) */}
        <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* الصورة الجانبية بتأثير فخم ومقاس محكم */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden rounded-[24px] sm:rounded-[32px] shadow-lg border border-stone-100 group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="من نحن - ركن السعادة"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQmGVJanYjRcjJd9pxQI5afo5vIMEfiEeEH_OHC3Zn3sE43rgKuTqurHIHKzsLNR4gvm4uSkm8S_qUUynvBL4vks_WXO-zxxSuejuAK83o5WbkSd0OcBDt6uOt2o20L_M8mmc-Sw_ba7IgLHHqzcMp1JHNUblmUkvxFrG55r1qw_nA8DfW_RfRreD5VFzLyF-b1hg_q192umtsivxoa9opTqUzDjOQFqUUsXpiUsjo7MTue9DVcAl6vcsGxSGg37RvD07e_zi9tn2Y"
                />
                <div className="absolute inset-0 bg-[#8a4853]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* نص القصة */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#8a4853] font-bold text-sm tracking-widest block uppercase">
                البداية والشغف
              </span>
              <h2 className="text-stone-800 font-bold text-2xl sm:text-3xl leading-snug">
                قصة ركن السعادة
              </h2>
              <div className="space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed">
                <p>
                  من قلب المحلة الكبرى بدأت حكاية **ركن السعادة**، براند مصري
                  متخصص في العطور والإكسسوارات الراقية منذ أكثر من 6 سنوات، هدفه
                  تقديم تجربة تجمع بين الفخامة، الجودة، والتفاصيل التي تترك
                  أثرًا مميزًا.
                </p>

                <p>
                  نقدم زيوت عطرية أصلية بثبات وجودة عالية، مع تشكيلة مختارة من
                  الإكسسوارات العصرية التي تضيف لمسة من الأناقة والتميز لكل من
                  يبحث عن الذوق الراقي.
                </p>

                <p>
                  على مدار السنوات بنينا ثقة عملائنا من خلال الاهتمام بأدق
                  التفاصيل وتقديم منتجات تعبر عن الشخصية والأناقة بأسلوب عصري
                  يناسب مختلف الأذواق.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Vision & Mission Section (الأهداف والرسالة في كروت متجاورة فخمة) */}
        <section className="bg-white py-16 border-y border-stone-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* كارت الأهداف */}
              <div className="bg-[#f9f6f0] p-8 sm:p-10 rounded-[24px] border border-stone-100 flex flex-col group hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-[#8a4853]/10 rounded-2xl flex items-center justify-center mb-6 text-[#8a4853] group-hover:bg-[#8a4853] group-hover:text-white transition-colors duration-300">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-stone-800 font-bold text-xl sm:text-2xl mb-4">
                  أهدافنا
                </h3>
                <ul className="space-y-3 text-stone-600 text-sm sm:text-base leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8a4853] mt-2 flex-shrink-0" />
                    <span>
                      تقديم زيوت عطرية أصلية بجودة عالية وثبات يدوم طويلًا.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8a4853] mt-2 flex-shrink-0" />
                    <span>
                      توفير إكسسوارات عصرية وأنيقة تناسب مختلف الأذواق.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8a4853] mt-2 flex-shrink-0" />
                    <span>
                      الحفاظ على ثقة عملائنا من خلال الجودة والاهتمام بالتفاصيل.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8a4853] mt-2 flex-shrink-0" />
                    <span>
                      تطوير منتجاتنا باستمرار لمواكبة أحدث الاتجاهات في عالم
                      العطور والإكسسوارات.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8a4853] mt-2 flex-shrink-0" />
                    <span>
                      توسيع انتشار براند ركن السعادة ليصبح من الأسماء الرائدة في
                      السوق المصري والعربي.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8a4853] mt-2 flex-shrink-0" />
                    <span>
                      تقديم تجربة تسوق مريحة ومميزة تجمع بين الفخامة والبساطة.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8a4853] mt-2 flex-shrink-0" />
                    <span>
                      بناء مجتمع من العملاء الذين يبحثون عن الذوق الراقي
                      والتفاصيل المختلفة.
                    </span>
                  </li>
                </ul>
              </div>

              {/* كارت الرسالة */}
              <div className="bg-[#f9f6f0] p-8 sm:p-10 rounded-[24px] border border-stone-100 flex flex-col group hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-[#8a4853]/10 rounded-2xl flex items-center justify-center mb-6 text-[#8a4853] group-hover:bg-[#8a4853] group-hover:text-white transition-colors duration-300">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-stone-800 font-bold text-xl sm:text-2xl mb-4">
                  الرسالة
                </h3>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  في ركن السعادة نسعى إلى تقديم تجربة تجمع بين الأناقة، الجودة،
                  والإحساس المميز في كل تفصيلة. نؤمن أن العطر والإكسسوار يعبران
                  عن شخصية الإنسان، لذلك نحرص على توفير زيوت عطرية أصلية
                  وإكسسوارات مختارة بعناية تمنح عملاءنا إحساسًا بالثقة والتميز
                  في كل وقت. هدفنا ليس فقط بيع المنتجات، بل بناء علاقة قائمة على
                  الثقة والرضا، من خلال تقديم جودة عالية، أسعار مناسبة، وخدمة
                  تليق بكل عميل يختار ركن السعادة.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Why Us Section (لماذا ركن السعادة؟) */}
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#8a4853] font-bold text-sm tracking-widest block uppercase mb-2">
              الثقة • الجودة • التميز
            </span>

            <h2 className="text-stone-800 font-bold text-2xl sm:text-3xl leading-snug">
              لماذا تختار ركن السعادة؟
            </h2>

            <p className="text-stone-500 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              منذ أكثر من 6 سنوات ونحن نقدم تجربة مميزة في عالم العطور
              والإكسسوارات، بجودة عالية وتفاصيل صنعت خصيصًا لتناسب الذوق الراقي
              وتمنحك إحساسًا مختلفًا في كل مرة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 sm:p-10 rounded-[24px] border border-stone-100 flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-[#8a4853]/10 rounded-full flex items-center justify-center mb-6 text-[#8a4853] group-hover:bg-[#8a4853] group-hover:text-white transition-all duration-300">
                <Sparkles className="w-8 h-8" />
              </div>

              <h3 className="text-stone-800 font-bold text-lg sm:text-xl mb-3">
                زيوت عطرية أصلية
              </h3>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                نوفر زيوت عطرية بجودة عالية وثبات يدوم طويلًا، بعناية في اختيار
                الروائح التي تمنحك حضورًا مميزًا وأناقة لا تُنسى.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 sm:p-10 rounded-[24px] border border-stone-100 flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-[#8a4853]/10 rounded-full flex items-center justify-center mb-6 text-[#8a4853] group-hover:bg-[#8a4853] group-hover:text-white transition-all duration-300">
                <Gem className="w-8 h-8" />
              </div>

              <h3 className="text-stone-800 font-bold text-lg sm:text-xl mb-3">
                إكسسوارات بتفاصيل راقية
              </h3>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                نختار الإكسسوارات بعناية لتناسب مختلف الأذواق وتضيف لمسة فخامة
                وأناقة تكمل شخصيتك بأسلوب عصري ومميز.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 sm:p-10 rounded-[24px] border border-stone-100 flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-[#8a4853]/10 rounded-full flex items-center justify-center mb-6 text-[#8a4853] group-hover:bg-[#8a4853] group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <h3 className="text-stone-800 font-bold text-lg sm:text-xl mb-3">
                ثقة وخبرة لسنوات
              </h3>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                خبرتنا الممتدة منذ تأسيس ركن السعادة في المحلة الكبرى جعلتنا
                نحرص دائمًا على تقديم أفضل جودة وخدمة تمنح عملاءنا الثقة والرضا.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
