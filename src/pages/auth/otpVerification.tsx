import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api/userApi';
import { useAuth } from '../../contexts/AuthContext';

// === Types ===
interface LocationState {
  email: string;
}

export default function OtpVerification() {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [otpResent, setOtpResent] = useState<boolean>(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const passedEmail = state?.email;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!passedEmail) {
      setError('Email is missing.');
      setLoading(false);
      return;
    }

    try {
      const res = await verifyOtp(passedEmail, otp);

      if (res?.message === "OTP verified") {
        const verifiedUser = res.user; // Extract the user data from the response

        // Prepare the user object to store (you can include/exclude fields based on your requirements)
        const updatedUser = {
          id: verifiedUser.id,
          name: `${verifiedUser.firstname} ${verifiedUser.lastname}`, // Combine first and last name
          email: verifiedUser.email,
          role: verifiedUser.role,
          avatar: verifiedUser.avatar || "", // Optional, in case avatar exists
          isOtpRequired: false, // OTP is no longer required after successful verification
        };

        // Store the updated user data in the context and localStorage
        setUser(updatedUser); // Update the user in the context
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Store the user in localStorage

        navigate('/'); // Navigate to the home page or another page after success
      } else {
       alert(`OTP verification failed: ${res?.message}`);
        setError(res?.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      alert(`Error during OTP verification: ${err}`);
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');

    if (!passedEmail) {
      setError('Email is missing.');
      setLoading(false);
      return;
    }

    try {
      const res = await resendOtp(passedEmail);

      if (res?.message === "OTP resent successfully.") {
        setOtpResent(true);
        setError('');
      } else {
        setError(res?.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('Failed to resend OTP.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Enter OTP</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="otp">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Resend OTP Button */}
        <button
          type="button"
          onClick={handleResendOtp}
          className="w-full bg-gray-600 text-white py-2 rounded-lg mt-4 hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? 'Resending...' : 'Resend OTP'}
        </button>

        {otpResent && (
          <div className="text-green-600 mt-2">
            OTP resent successfully! Please check your email.
          </div>
        )}
      </form>
    </div>
  );
}
