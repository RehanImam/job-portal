
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {  Wrench, Zap, Wind, HardHat, Hammer, Shield, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CountrySlider from './CountrySlider';
import Hero from './Hero';
import Footer from './Footer';

const Home = () => {
  const [categories, setCategories] = useState([]);

  const iconMap = { Zap, Wrench, Wind, HardHat, Hammer, Shield, Layers };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/category/all`);
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.log('Category Fetch Error:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500 overflow-x-hidden">
      
      {/* Hero Section: pt-24 laptops ke liye fixed navbar se content bachane ke liye aur pt-20 mobile ke liye */}
      <section className="relative pt-20 md:pt-28 pb-8 md:pb-12 px-6 overflow-hidden flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            
            {/* Tagline Badge: Margin mb-4 ya mb-5 taaki header se chipka na rahe par gap kam ho */}
            <span className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 md:mb-5 inline-block">
              The Future of Construction Hiring
            </span>
            
            {/* Title */}
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
              Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Legendary</span> Career
            </h1>
            
            {/* Description: Margin mt-3 (Mobile) aur md:mt-4 (Laptop) se gap ekdum perfect ho gaya hai */}
            <p className="mt-3 md:mt-4 text-gray-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
              Skip the noise. Get connected with premium industrial opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Country Slider Wrapper Element: Padding zero/low border constraints */}
      <div className="py-2 md:py-4 bg-[#020617]">
        <CountrySlider />
      </div>

      {/* Browse Category Section: pt-6 (Mobile) aur md:pt-10 (Laptop) kiya hai taaki upar ka extra gap khatam ho sake */}
      <section className="max-w-7xl mx-auto pt-6 md:pt-10 pb-8 md:pb-12 px-6">
        <div className="mb-5 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Browse by Category</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">Select a category to view all specialized job opportunities</p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-400 text-sm md:text-base">No Active Categories Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Zap;
              return (
                <Link to={`/jobs/${cat._id}`} key={cat._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(34,211,238,0.4)' }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 backdrop-blur-sm group h-full"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 md:mb-4 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                      <IconComponent size={18} />
                    </div>
                    <h3 className="font-bold text-xs md:text-sm text-white tracking-wide group-hover:text-cyan-400 transition-colors capitalize">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] md:text-[11px] text-gray-500 mt-1 font-medium group-hover:text-gray-400">
                      {cat.vacancies || 0} Vacancies
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Hero & Footer Section: Mt-8 (Mobile) aur md:mt-12 (Laptop) tight positioning */}
      <section className="max-w-7xl mx-auto pb-16 md:pb-24 px-6">
        <div className="mt-8 md:mt-12">
          <Hero />
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default Home;