import { useState } from "react";
import { verifyOtp } from "../../api/otpApi";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      const res = await verifyOtp({ email, otp });
      localStorage.setItem("token", res.data.access_token);
      navigate("/home");
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>

        <input
          className="w-full p-2 mb-4 border rounded-lg text-center tracking-widest"
          placeholder="123456"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Verify
        </button>
      </div>
    </div>
  );
}