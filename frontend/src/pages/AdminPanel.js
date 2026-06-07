

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Users, Briefcase, FileText, ExternalLink, MapPin, FolderPlus, Send, Folder, DollarSign } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, apps: 0 });
  const [applications, setApplications] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [jobsList, setJobsList] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 🛠️ Modified Tabs: 'category', 'post-job', ya 'manage-jobs'
  const [activeTab, setActiveTab] = useState('category'); 

  const [categoryData, setCategoryData] = useState({ name: "", icon: "Zap", vacancies: "" });
  const [jobFormData, setJobFormData] = useState({ title: '', salary: '', location: '', jobType: 'Full-Time', category: '', description: '' });
  const [jobLoading, setJobLoading] = useState(false);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data.stats);
        setApplications(res.data.applications);

      }

      const catRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/category/all`);
      if (catRes.data.success) {
        setCategoriesList(catRes.data.categories);
      }

      const jobRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/jobs/alljobs`);
      if (jobRes.data.success) {
        setJobsList(jobRes.data.jobs);
      }
    } catch (err) {
      console.error("Dashboard Sync Delay:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/category/create`, categoryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Category created smoothly! ✨");
      setCategoryData({ name: "", icon: "Zap", vacancies: "" });
      fetchDashboardMetrics(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed execution loop");
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`⚠️ WARNING: Kya aap sach me "${catName.toUpperCase()}" category aur iske andar ke SAARE JOBS aur APPLICATIONS ko permanent delete karna chahte hain?`)) return;

    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/category/delete/${catId}`);
      if (res.data.success) {
        toast.success(`${catName} aur uske saare jobs saaf! 🗑️`);
        fetchDashboardMetrics(); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete karne me koi dikkat aayi");
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!jobFormData.category) return toast.error("Please explicitly select a category mapping node!");

    setJobLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/jobs/createjob`, jobFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Job posted dynamically inside system! 🚀");
        setJobFormData({ title: '', salary: '', location: '', jobType: 'Full-Time', category: '', description: '' });
        fetchDashboardMetrics();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Job posting caught an issue");
    } finally {
      setJobLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`⚠️ ALERT: Kya aap sach me "${jobTitle.toUpperCase()}" job ko system se delete karna chahte hain?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/jobs/delete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Job permanently delete ho gayi! 🗑️");
        setJobsList((prev) => prev.filter((job) => job._id !== jobId));
        setStats((prev) => ({ ...prev, jobs: prev.jobs - 1 }));
      }
    } catch (error) {
      console.error("Job Delete Error:", error);
      toast.error(error.response?.data?.message || "Job delete karne me dikkat aayi!");
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/application/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Application deleted");
        setApplications((prev) => prev.filter((item) => item._id !== id));
        setStats((prev) => ({ ...prev, apps: prev.apps - 1 }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-cyan-400 font-bold animate-bounce text-xl">
        Accessing Secure Core Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 pt-18 max-w-7xl mx-auto">
      <Toaster />
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Admin Data</h1>
        <p className="text-gray-400 mt-2">Manage jobs, create structured structural categories, and trace data loops.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Registrations" value={stats.users} icon={Users} color="blue" />
        <StatCard label="Live Postings" value={stats.jobs} icon={Briefcase} color="emerald" />
        <StatCard label="Applications Tracking" value={stats.apps} icon={FileText} color="amber" />
      </div>

      {/* Modern 3-Tab Action Navigation Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white/5 p-2 rounded-2xl w-fit border border-white/10">
        <button
          onClick={() => setActiveTab('category')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'category'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FolderPlus size={18} />
          Create Category
        </button>
        <button
          onClick={() => setActiveTab('post-job')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'post-job'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus size={18} />
          New Job Post
        </button>
        <button
          onClick={() => setActiveTab('manage-jobs')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'manage-jobs'
              ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Trash2 size={18} />
          Delete & Manage Jobs
        </button>
      </div>

      {/* 📁 TAB 1: CATEGORY SECTOR */}
      {activeTab === 'category' && (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-10 backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
            <FolderPlus className="text-cyan-400" size={22} />
            <h2 className="text-xl font-bold">Manage Category Clusters</h2>
          </div>
          
          <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold">Category Name</label>
              <input type="text" value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-500" placeholder="e.g. Electrician" required />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold">Icon Class Name</label>
              <select value={categoryData.icon} onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 outline-none">
                <option value="Zap">Zap (Electrician)</option>
                <option value="Wrench">Wrench (Plumber)</option>
                <option value="Wind">Wind (AC Tech)</option>
                <option value="HardHat">HardHat</option>
                <option value="Hammer">Hammer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase font-bold">Initial Vacancies</label>
              <input type="number" value={categoryData.vacancies} onChange={(e) => setCategoryData({ ...categoryData, vacancies: e.target.value })} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 outline-none" placeholder="e.g. 0" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"><Plus size={18}/> Create Category</button>
          </form>

          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Live System Categories ({categoriesList.length})</p>
            {categoriesList.length === 0 ? (
              <p className="text-gray-500 text-sm">No active categories available.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {categoriesList.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between bg-slate-900/40 border border-white/5 rounded-xl px-3 py-2 text-sm group hover:border-white/20 transition-all">
                    <div className="overflow-hidden">
                      <p className="capitalize font-medium text-white truncate">{cat.name}</p>
                      <p className="text-[10px] text-gray-500">{cat.vacancies || 0} Vacancies</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCategory(cat._id, cat.name)}
                      className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
                      title={`Delete ${cat.name} Category`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🚀 TAB 2: POST A NEW JOB */}
      {activeTab === 'post-job' && (
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md mb-10 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Briefcase className="text-blue-400" /> Post a New Opportunity</h2>
          <form onSubmit={handleJobSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-400 text-sm ml-1">Job Title</label>
                <input required type="text" placeholder="e.g. Industrial Electrician" value={jobFormData.title} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:border-blue-500" onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})} />
              </div>
              <div>
                <label className="text-gray-400 text-sm ml-1">Location Node</label>
                <input required type="text" placeholder="e.g. Mumbai, IN" value={jobFormData.location} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:border-blue-500" onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-400 text-sm ml-1">Salary Package Structure</label>
                <input required type="text" placeholder="e.g. ₹35,000" value={jobFormData.salary} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:border-blue-500" onChange={(e) => setJobFormData({...jobFormData, salary: e.target.value})} />
              </div>
              <div>
                <label className="text-gray-400 text-sm ml-1">Job Shift Type</label>
                <select className="w-full bg-[#1e293b] border border-white/10 p-3 rounded-xl mt-1 outline-none" value={jobFormData.jobType} onChange={(e) => setJobFormData({...jobFormData, jobType: e.target.value})}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm ml-1 flex items-center gap-1.5"><Folder size={16} className="text-blue-400" /> Target Job Category Dropdown</label>
              <select required className="w-full bg-[#1e293b] border border-white/10 p-3 rounded-xl mt-1 outline-none" value={jobFormData.category} onChange={(e) => setJobFormData({...jobFormData, category: e.target.value})}>
                <option value="">Select Category Node</option>
                {categoriesList.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm ml-1">Role Specifications Description</label>
              <textarea required rows="4" placeholder="Describe tracking processes..." value={jobFormData.description} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl mt-1 outline-none focus:border-blue-500" onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})} />
            </div>
            <button type="submit" disabled={jobLoading} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">{jobLoading ? "Processing Node Posting..." : <><Send size={20}/> Publish Opening</>}</button>
          </form>
        </div>
      )}

      {/* 🗑️ TAB 3: LIVE JOB TRACKING & DELETE MANAGEMENT CONTAINER */}
      {activeTab === 'manage-jobs' && (
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md mb-10 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
            <Briefcase className="text-red-400" size={22} />
            <h2 className="text-xl font-bold">Manage Active Postings ({jobsList.length})</h2>
          </div>
          
          {jobsList.length === 0 ? (
            <p className="text-gray-500 text-sm">No live jobs posted inside the system tracker block yet.</p>
          ) : (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
              {jobsList.map((job) => (
                <div key={job._id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/40 border border-white/5 rounded-2xl p-4 gap-4 hover:border-white/10 transition-all">
                  <div>
                    <h4 className="font-bold text-white text-base">{job.title}</h4>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                      <span className="text-cyan-400 font-medium uppercase tracking-wider">{job.jobType}</span>
                      <span className="flex items-center gap-0.5"><MapPin size={12}/> {job.location}</span>
                      <span className="flex items-center gap-0.5 text-emerald-400"><DollarSign size={12}/> {job.salary}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteJob(job._id, job.title)}
                    className="w-fit self-end sm:self-center p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300"
                    title="Delete This Job Listing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Applications Data Table Block */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md mb-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Recent User Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 uppercase text-xs tracking-widest">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Applied For</th>
                <th className="px-6 py-4">Exp. (Yrs)</th>
                <th className="px-6 py-4">Resume</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{app.fullName}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-cyan-400">
                        {app.jobId?.title || "Unknown Job Role"}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={12} /> {app.jobId?.location || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-white/5 px-3 py-1 rounded-full text-xs border border-white/10">
                        {app.experience} Years
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm underline underline-offset-4"
                      >
                        View CV <ExternalLink size={14} />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteApplication(app._id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No applications found in the database system loop.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorMap = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/20"
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl transition-transform hover:scale-[1.02] duration-300">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorMap[color]} border`}>
        <Icon size={24} />
      </div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-4xl font-bold mt-1 tracking-tight">{value}</p>
    </div>
  );
};

export default AdminPanel;