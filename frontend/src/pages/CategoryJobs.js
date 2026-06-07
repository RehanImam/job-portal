

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, Clock } from 'lucide-react';
import axios from 'axios';

const CategoryJobs = () => {
  const { categoryName } = useParams(); // URL parameter (Category ID ya Name)
  const [currentJobs, setCurrentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/jobs/alljobs`);
        
        if (response.data.success) {
          console.log("URL Parameter (categoryName):", categoryName);
          console.log("All Jobs from Backend:", response.data.jobs);

          // ✨ Updated Ultra-Safe Filtering Logic
          const filtered = response.data.jobs.filter(job => {
            // Agar job me category field hi missing hai to skip karo
            if (!job.category) return false;

            // 1. Agar category ek object hai (Populated)
            if (typeof job.category === 'object') {
              const matchId = job.category._id?.toString().toLowerCase() === categoryName?.toString().toLowerCase();
              const matchName = job.category.name?.toString().toLowerCase() === categoryName?.toString().toLowerCase();
              return matchId || matchName;
            }

            // 2. Agar category sirf ek direct String hai (ID ya Name)
            return job.category.toString().toLowerCase() === categoryName.toString().toLowerCase();
          });

          console.log("Filtered Jobs Result:", filtered);
          setCurrentJobs(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch category jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryName) fetchCategoryJobs();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-bold animate-pulse text-xl">
        Syncing Job Node streams...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-32 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-cyan-400 mb-8 hover:text-cyan-300 transition-colors group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Categories
        </Link>

        <div className="mb-12 border-b border-white/5 pb-6">
          <h1 className="text-4xl font-extrabold text-white capitalize">
            Available Opportunities
          </h1>
          <p className="text-gray-400 text-sm mt-2">Explore all verified high-paying premium openings listed inside database tracker.</p>
        </div>

        {currentJobs.length > 0 ? (
          <div className="space-y-4">
            {currentJobs.map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 6, borderColor: "rgba(34,211,238,0.3)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-cyan-500/10 text-cyan-400 px-3 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                      {job.jobType || "Full-Time"}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <Clock size={12} /> Verified Listing
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-cyan-500" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-emerald-500" /> {job.salary} / Month
                    </div>
                  </div>
                </div>

                <Link
                  to={`/jobfind/${job._id}`}
                  className="w-full md:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold text-center hover:bg-cyan-600 hover:border-cyan-600 transition-all duration-300 active:scale-95 whitespace-nowrap"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-gray-400">No live openings posted inside this category block yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryJobs;