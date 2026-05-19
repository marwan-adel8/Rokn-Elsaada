import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import perfume from "../assets/img/roken-1.png";
import Bukhoor from "../assets/img/roken-2.png";
import accessories from "../assets/img/roken-3.png";
import daheb from "../assets/img/roken-4.png";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Hero = () => {
  const slides = [
    { id: 1, image: perfume, alt: "Perfume Collection" },
    { id: 2, image: Bukhoor, alt: "Bukhoor Collection" },
    { id: 3, image: accessories, alt: "Accessories" },
    { id: 4, image: daheb, alt: "daheb" }
  ];

  return (
    <section className="relative w-full bg-white pt-1 pb-4 md:py-4">
      <div className="container-max mx-auto px-4">
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[550px] overflow-hidden rounded-2xl group shadow-sm">
          <Swiper
            modules={[Navigation, Autoplay, EffectFade, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ clickable: true }}
            effect="fade"
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="w-full h-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full">
                  <img 
                    src={slide.image} 
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              </SwiperSlide>
            ))}

            <button className="swiper-button-prev-custom hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 text-[#B76E79] hover:scale-125 transition-all duration-300 cursor-pointer p-2">
              <span className="material-symbols-outlined text-4xl font-bold">chevron_left</span>
            </button>
            <button className="swiper-button-next-custom hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 text-[#B76E79] hover:scale-125 transition-all duration-300 cursor-pointer p-2">
              <span className="material-symbols-outlined text-4xl font-bold">chevron_right</span>
            </button>
          </Swiper>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .swiper-pagination-bullets {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          margin: 0 5px !important;
          width: 8px !important;
          height: 8px !important;
          background: white !important;
          opacity: 0.6 !important;
        }
        .swiper-pagination-bullet-active {
          background: #B76E79 !important;
          opacity: 1 !important;
          width: 20px !important;
          border-radius: 4px !important;
        }
        @media (max-width: 640px) {
          .swiper-pagination-bullets {
            bottom: 10px !important;
          }
          .swiper-pagination-bullet {
            width: 6px !important;
            height: 6px !important;
            margin: 0 3px !important;
          }
          .swiper-pagination-bullet-active {
            width: 14px !important;
          }
        }
      `}} />
    </section>
  );
};

export default Hero;