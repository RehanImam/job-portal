

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Backend URL with correct v1 versioning
        const response = await fetch("http://localhost:5000/api/v1/jobs/alljobs");;
        const data = await response.json();
        
        if (data.success) {
          setJobs(data.jobs); // Setting jobs array from response
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-bold animate-pulse">Fetching latest opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-20 px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <motion.div 
              key={job._id} 
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -15, 
                scale: 1.02,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="group bg-[#0f172a]/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md hover:border-cyan-500/50 hover:shadow-[0_20px_50px_rgba(8,145,178,0.2)] transition-all duration-500"
            >
              {/* 3D Image Container */}
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={job.image || "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800"} 
                  alt={job.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-2" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />
                <div className="absolute top-5 left-5 bg-cyan-500/20 backdrop-blur-xl border border-cyan-500/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-300">
                  {job.jobType || "Full-Time"}
                </div>
              </div>

              <div className="p-8 relative">
                {/* Floating Icon */}
                <div className="absolute -top-6 right-8 w-12 h-12 bg-cyan-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg group-hover:rotate-45 transition-transform duration-500">
                  <Briefcase size={20} className="text-white -rotate-12 group-hover:-rotate-45 transition-transform" />
                </div>

                <div className="flex items-center gap-3 text-cyan-500/80 mb-4">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Verified Opportunity</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight min-h-[56px]">
                  {job.title}
                </h3>

                <div className="space-y-4 mb-5">
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-2 bg-white/5 rounded-lg"><MapPin size={16} className="text-cyan-500" /></div>
                    <span className="text-sm font-medium">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-2 bg-white/5 rounded-lg"><DollarSign size={16} className="text-emerald-500" /></div>
                    <span className="text-sm font-medium">{job.salary}</span>
                  </div>
                </div>

                <Link 
                  to={`/job/${job._id}`} 
                  className="relative overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold transition-all text-center block"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Apply Position <ArrowRight size={18} />
                  </span>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-400 text-lg">No active jobs found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;