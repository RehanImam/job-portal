
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { Toaster } from 'react-hot-toast'; // 1. Toaster import kiya

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import UserProfile from './pages/UserProfile';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import JobDetails from './pages/JobDetails';
import VerifyEmail from './pages/VerifyEmail';
import PostJob from './pages/PostJob';
import CategoryJobs from './pages/CategoryJobs';
import JobFind from "./pages/JobFind";


function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 2. Toaster yahan add karein */}
        <Toaster position="top-center" reverseOrder={false} />
        
        <div className="min-h-screen bg-[#0f172a] text-white">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/UserProfile" element={<UserProfile />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/jobpost" element={<PostJob />} />
              <Route path="/jobs/:categoryName" element={<CategoryJobs />} />
              <Route path="/jobfind/:id" element={<JobFind />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;