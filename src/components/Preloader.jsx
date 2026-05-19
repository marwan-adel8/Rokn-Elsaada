import React from 'react';

/**
 * مكون التحميل المخصص (Preloader)
 * يعرض كلمة "ركن السعادة" حرفاً بحرف مع خلفية بلون البراند
 * @param {boolean} fullScreen - ما إذا كان سيغطي الشاشة بالكامل أم لا
 */
const Preloader = ({ fullScreen = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 z-[10000] bg-[#FFF8F5]' : 'w-full py-20 bg-transparent'}`}>
      {/* حاوية النص الممركز مع أنيميشن كشف هادئ */}
      <div className="relative text-center">
        <h1 className="text-5xl md:text-8xl font-bold text-[#B76E79] py-4 animate-reveal-slow tracking-tight">
          ركن السعادة
        </h1>
      </div>
      
      {/* خط تحميل سفلي متناسق */}
      <div className="mt-8 w-64 h-1.5 bg-[#B76E79]/10 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[#B76E79] animate-loading-progress origin-right"></div>
      </div>

      <style>{`
        @keyframes revealSlow {
          0% { 
            clip-path: inset(0 100% 0 0); 
            opacity: 0;
            transform: translateY(10px);
          }
          20% {
            opacity: 1;
          }
          100% { 
            clip-path: inset(0 0 0 0); 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes loadingProgress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.6); }
          100% { transform: scaleX(1); }
        }

        .animate-reveal-slow {
          animation: revealSlow 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-loading-progress {
          animation: loadingProgress 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Preloader;
