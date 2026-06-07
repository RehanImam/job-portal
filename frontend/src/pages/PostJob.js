

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Send, Folder } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '', salary: '', location: '', jobType: 'Full-Time', category: '', description: ''
    });
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch categories list on component mount for dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/category/all`);
                if (catRes.data.success) {
                    setCategoriesList(catRes.data.categories);
                }
            } catch (err) {
                console.error("Failed fetching structural categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) return toast.error("Please explicitly select a category mapping node!");
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/jobs/createjob`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success("Job Posted Successfully! 🚀");
                setTimeout(() => navigate('/admin'), 2000); // Admin page redirection
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 pt-28">
            <Toaster />
            <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Briefcase className="text-blue-400" /> Post a New Opportunity
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-gray-400 text-sm ml-1">Job Title</label>
                            <input required type="text" placeholder="e.g. Frontend Developer" value={formData.title}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none mt-1"
                                onChange={(e) => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm ml-1">Location</label>
                            <input required type="text" placeholder="e.g. Remote / Delhi" value={formData.location}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none mt-1"
                                onChange={(e) => setFormData({...formData, location: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-gray-400 text-sm ml-1">Salary Package</label>
                            <input required type="text" placeholder="e.g. 10 LPA" value={formData.salary}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none mt-1"
                                onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm ml-1">Job Type</label>
                            <select className="w-full bg-[#1e293b] border border-white/10 p-3 rounded-xl outline-none mt-1" value={formData.jobType}
                                onChange={(e) => setFormData({...formData, jobType: e.target.value})}>
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>

                    {/* ✨ Added Missing Category Dropdown Field */}
                    <div>
                        <label className="text-gray-400 text-sm ml-1 flex items-center gap-1.5">
                            <Folder size={16} className="text-blue-400" /> Target Job Category Dropdown
                        </label>
                        <select required className="w-full bg-[#1e293b] border border-white/10 p-3 rounded-xl mt-1 outline-none" value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            <option value="">Select Category Node</option>
                            {categoriesList.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm ml-1">Description</label>
                        <textarea required rows="4" placeholder="Describe the role and requirements..." value={formData.description}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none mt-1"
                            onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                        {loading ? "Posting..." : <><Send size={20}/> Publish Job</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;