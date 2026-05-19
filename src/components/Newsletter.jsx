import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-8 md:py-24 container-max mx-auto px-4 md:px-margin-desktop">
      <div className="relative bg-[#8a4853] rounded-2xl overflow-hidden py-10 px-6 md:p-12 text-center text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img 
            className="w-full h-full object-cover" 
            alt="Newsletter Background" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDudaLA2VgnCPvjL5aOIXuLo9yuPUJXoGZJSeplOKLxanibFygufexnX-8DUf1kfFIydB_ndTXoQXH96aZc0bdtyiD3fslefipnBf9Rb7RYO_zk_v5NZbRTVIA39-6cynIzybTPhx9-K6O1yGMMzGufArttOmzA23rxmT7_Q806P95JGg3sYtsn7EaAgFuM7f1ZEH-LUkxQhqmHR-j67Z76HPBed0Wh9PhFBbKQXcYsRpgsGvlSOTvLato8sfO18m4TX0bE98UY9ILa" 
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-display-lg mb-4 font-bold text-2xl md:text-4xl">انضموا إلى عالمنا على تليجرام</h2>
          <p className="text-sm md:text-base opacity-80 mb-6 md:mb-8">اشترك في قناتنا على تليجرام لتصلك أحدث العروض والقطع الحصرية قبل الجميع.</p>
          <div className="flex justify-center max-w-lg mx-auto">
            <a 
              href="https://t.me/rokn_elsaada" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-[#8a4853] px-6 py-3 md:px-10 md:py-4 rounded-xl hover:bg-stone-100 hover:scale-105 transition-all whitespace-nowrap font-bold flex items-center gap-3 shadow-lg text-sm md:text-base"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM17.43 8.35L15.55 17.2C15.41 17.81 15.05 17.96 14.54 17.67L11.75 15.61L10.4 16.91C10.25 17.06 10.13 17.18 9.85 17.18L10.05 14.33L15.24 9.64C15.46 9.44 15.19 9.33 14.9 9.53L8.49 13.56L5.73 12.7C5.13 12.51 5.12 12.1 5.86 11.81L16.63 7.66C17.13 7.48 17.57 7.78 17.43 8.35Z" fill="#2CA5E0"/>
              </svg>
              انضم للقناة الآن
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
