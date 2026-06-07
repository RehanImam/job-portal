

// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { ArrowLeft, MapPin, DollarSign, Briefcase,  FileText, Send, X, Clock, } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast, { Toaster } from 'react-hot-toast';

// const JobFind = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [job, setJob] = useState(null); 
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [fileError, setFileError] = useState('');
//   const [hasApplied, setHasApplied] = useState(false); 
  
//   const [formData, setFormData] = useState({
//     fullName: '', email: '', phone: '', age: '', experience: ''
//   });
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/jobs/getjob/${id}`, {
//           method: "GET",
//           headers: { "Authorization": token ? `Bearer ${token}` : "" }
//         });
        
//         const data = await response.json();
//         if (data.success) {
//           setJob(data.job);
//           setHasApplied(data.hasApplied || false); 
//         }
//       } catch (error) {
//         console.error("Fetch metrics broken down:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchJobDetails();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//     if (selectedFile) {
//       if (!allowedTypes.includes(selectedFile.type)) {
//         setFileError('Upload valid PDF, DOC or DOCX layout');
//         setFile(null);
//       } else if (selectedFile.size > 8 * 1024 * 1024) {
//         setFileError('Max file capacity allowed is 8MB');
//         setFile(null);
//       } else {
//         setFileError('');
//         setFile(selectedFile);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error('Please login to execute operations.');

//     const loadingToast = toast.loading('Uploading assets and processing tracking logs...');
//     const data = new FormData();
//     data.append("fullName", formData.fullName);
//     data.append("email", formData.email);
//     data.append("phone", formData.phone);
//     data.append("age", formData.age);
//     data.append("experience", formData.experience);
//     data.append("resume", file);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/jobs/apply/${id}`, {
//         method: "POST",
//         headers: { "Authorization": `Bearer ${token}` },
//         body: data,
//       });
//       const result = await response.json();

//       if (result.success) {
//         toast.success("Application Logged and Admin Notified! 🚀", { id: loadingToast });
//         setIsModalOpen(false);
//         setHasApplied(true); 
//         setTimeout(() => navigate('/'), 2000);
//       } else {
//         toast.error(result.message || "Execution failure.", { id: loadingToast });
//       }
//     } catch (error) {
//       toast.error("Network synchronization interface issue.", { id: loadingToast });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-cyan-400 font-bold animate-pulse text-xl">
//         Mapping Application Clusters...
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-center">
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Job tracking entry not found.</h2>
//           <Link to="/" className="text-cyan-400 underline">Back to Main Dashboard</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0f172a] pt-32 px-6 pb-20 font-inter text-white">
//       <Toaster position="top-center" reverseOrder={false} />
//       <div className="max-w-4xl mx-auto">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-400 mb-8 hover:text-cyan-300 transition-colors group bg-transparent border-none outline-none cursor-pointer">
//           <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
//         </button>

//         <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
//           <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
//             <div>
//               <span className="bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Verified Listing Nodes</span>
//               <h1 className="text-4xl font-bold mt-4">{job.title}</h1>
//               <p className="text-gray-400 mt-2 flex items-center gap-2"><MapPin size={18} className="text-cyan-500" /> {job.location}</p>
//             </div>
//             {hasApplied ? (
//               <button className="bg-amber-500/20 text-amber-500 border border-amber-500/30 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 cursor-default">
//                 <Clock size={20} /> Application Logged
//               </button>
//             ) : (
//               <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95">Apply Framework</button>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 py-8 border-y border-white/5">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-white/5 rounded-2xl text-cyan-400"><DollarSign size={24} /></div>
//               <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase font-bold">Salary Metric</span><span className="font-semibold">{job.salary}</span></div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-white/5 rounded-2xl text-cyan-400"><Briefcase size={24} /></div>
//               <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase font-bold">Shift</span><span className="font-semibold">{job.jobType}</span></div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-white/5 rounded-2xl text-cyan-400"><MapPin size={24} /></div>
//               <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase font-bold">Location</span><span className="font-semibold">{job.location}</span></div>
//             </div>
//           </div>

//           <div className="mt-10">
//             <h3 className="text-xl font-bold mb-4 text-cyan-400">About the Role</h3>
//             <p className="text-gray-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">{job.description}</p>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {isModalOpen && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
//             <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-[#1e293b] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden">
//               <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
//               <h2 className="text-2xl font-bold mb-2 text-white">Execute Data Pipeline</h2>
//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Identity Name</label>
//                     <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mail Address</label>
//                     <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Age Metric</label>
//                     <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Experience (Years)</label>
//                     <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
//                   <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">CV File Node</label>
//                   <div className="relative border-2 border-dashed border-white/10 p-6 rounded-2xl bg-white/5">
//                     <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
//                     <div className="flex flex-col items-center">
//                       <FileText className={`${file ? 'text-cyan-400' : 'text-gray-500'} mb-2`} size={32} />
//                       <p className="text-sm">{file ? file.name : "Inject CV Document"}</p>
//                     </div>
//                   </div>
//                   {fileError && <p className="text-red-400 text-xs mt-1">{fileError}</p>}
//                 </div>

//                 <button type="submit" className="w-full bg-cyan-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform">
//                   <Send size={18} /> Deploy Application Package
//                 </button>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default JobFind;


import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Briefcase, FileText, Send, X, Clock, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const JobFind = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileError, setFileError] = useState('');
  const [hasApplied, setHasApplied] = useState(false); 
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', age: '', experience: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/jobs/getjob/${id}`, {
          method: "GET",
          headers: { "Authorization": token ? `Bearer ${token}` : "" }
        });
        
        const data = await response.json();
        if (data.success) {
          setJob(data.job);
          setHasApplied(data.hasApplied || false); 
        }
      } catch (error) {
        console.error("Fetch metrics broken down:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (selectedFile) {
      if (!allowedTypes.includes(selectedFile.type)) {
        setFileError('Upload valid PDF, DOC or DOCX layout');
        setFile(null);
      } else if (selectedFile.size > 8 * 1024 * 1024) {
        setFileError('Max file capacity allowed is 8MB');
        setFile(null);
      } else {
        setFileError('');
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return toast.error('Please login to execute operations.');

    const loadingToast = toast.loading('Uploading assets and processing tracking logs...');
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("age", formData.age);
    data.append("experience", formData.experience);
    data.append("resume", file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/jobs/apply/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Application Logged and Admin Notified! 🚀", { id: loadingToast });
        setIsModalOpen(false);
        setHasApplied(true); 
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(result.message || "Execution failure.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network synchronization interface issue.", { id: loadingToast });
    }
  };

  // ✨ Same Premium Home.js Loader Integrated Here
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer Glowing Ring (Fast Clockwise) */}
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-cyan-500/30 border-b-transparent border-l-transparent animate-spin duration-700"></div>
          
          {/* Inner Ring (Slow Counter-Clockwise) */}
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-transparent border-b-blue-500 border-l-blue-500/30 animate-spin [animation-direction:reverse] duration-1000"></div>
          
          {/* Center Glowing Core */}
          <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Job tracking entry not found.</h2>
          <Link to="/" className="text-cyan-400 underline">Back to Main Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 px-6 pb-20 font-inter text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-400 mb-8 hover:text-cyan-300 transition-colors group bg-transparent border-none outline-none cursor-pointer">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div>
              <span className="bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Verified Listing Nodes</span>
              <h1 className="text-4xl font-bold mt-4">{job.title}</h1>
              <p className="text-gray-400 mt-2 flex items-center gap-2"><MapPin size={18} className="text-cyan-500" /> {job.location}</p>
            </div>
            {hasApplied ? (
              <button className="bg-amber-500/20 text-amber-500 border border-amber-500/30 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 cursor-default">
                <Clock size={20} /> Application Logged
              </button>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95">Apply Now</button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 py-8 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-cyan-400"><DollarSign size={24} /></div>
              <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase font-bold">Salary Metric</span><span className="font-semibold">{job.salary}</span></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-cyan-400"><Briefcase size={24} /></div>
              <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase font-bold">Shift</span><span className="font-semibold">{job.jobType}</span></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-cyan-400"><MapPin size={24} /></div>
              <div className="flex flex-col"><span className="text-gray-500 text-xs uppercase font-bold">Location</span><span className="font-semibold">{job.location}</span></div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">About the Role</h3>
            <p className="text-gray-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-[#1e293b] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-2 text-white">Execute Data Pipeline</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Identity Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mail Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Age Metric</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none" required />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">CV File Node</label>
                  <div className="relative border-2 border-dashed border-white/10 p-6 rounded-2xl bg-white/5">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                    <div className="flex flex-col items-center">
                      <FileText className={`${file ? 'text-cyan-400' : 'text-gray-500'} mb-2`} size={32} />
                      <p className="text-sm">{file ? file.name : "Inject CV Document"}</p>
                    </div>
                  </div>
                  {fileError && <p className="text-red-400 text-xs mt-1">{fileError}</p>}
                </div>

                <button type="submit" className="w-full bg-cyan-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform">
                  <Send size={18} /> Deploy Application Package
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobFind;