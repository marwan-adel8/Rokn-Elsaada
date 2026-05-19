import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import CategoriesSection from '../components/CategoriesSection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // عرض البريلودر لمدة 0.8 ثانية عند تحميل الصفحة الرئيسية
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NewArrivals />
        <BestSellers />
        <CategoriesSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Home;
