import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import toast from "react-hot-toast"; // 1. Toast import kiya

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Redux ki jagah useLocation se data nikalna
  const signupData = location.state?.signupData;

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signupData, // Saara purana data (fullName, email, password, etc.)
          otp: otp,      // Naya OTP
          role: "Student"
        })
      });

      const data = await response.json();

      if (data.success) {
        // 2. Success Toast
        toast.success("Account Created Successfully!"); 
        navigate("/login");
      } else {
        // 3. Error Toast
        toast.error(data.message || "Signup Failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Error while signing up");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/sendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupData.email })
      });
      
      const data = await response.json();
      if(data.success) {
        toast.success("OTP Resent!");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Could not resend OTP");
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center bg-[#0f172a] text-white">
      {loading ? (
        <div className="spinner text-white text-xl">Creating Account...</div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
          <h1 className="text-white font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-gray-400">
            A verification code has been sent to <b className="text-blue-400">{signupData?.email}</b>. Enter the code below.
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{ width: "100%" }}
                  className="w-[48px] lg:w-[60px] border border-white/10 bg-white/5 rounded-[0.5rem] text-white aspect-square text-center focus:outline-2 focus:outline-blue-500 text-lg"
                />
              )}
              containerStyle={{ justifyContent: "space-between", gap: "0 6px" }}
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 py-[12px] px-[12px] rounded-[8px] mt-6 font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              Verify & Register
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className="text-gray-300 hover:text-white flex items-center gap-x-2 transition-all">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button className="flex items-center text-blue-400 hover:text-blue-300 gap-x-2 transition-all font-medium" onClick={handleResendOtp}>
              <RxCountdownTimer /> Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;