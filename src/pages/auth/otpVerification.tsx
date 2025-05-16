import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api/userApi';
import { useAuth } from '../../contexts/AuthContext';

interface LocationState {
  email: string;
}

export default function OtpVerification() {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [otpResent, setOtpResent] = useState<boolean>(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const passedEmail = state?.email;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerifying(true);
    setError('');

    if (!passedEmail) {
      setError('Email is missing.');
      setVerifying(false);
      return;
    }

    try {
      const res = await verifyOtp(passedEmail, otp);

      if (res?.message === "OTP verified") {
        const verifiedUser = res.user;

        const updatedUser = {
          id: verifiedUser.id,
          name: `${verifiedUser.firstname} ${verifiedUser.lastname}`,
          email: verifiedUser.email,
          role: verifiedUser.role,
          avatar: verifiedUser.avatar || "",
          isOtpRequired: false,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate('/');
      } else {
        alert(`OTP verification failed: ${res?.message}`);
        setError(res?.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      alert(`Error during OTP verification: ${err}`);
      setError('Something went wrong. Please try again.');
    }

    setVerifying(false);
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError('');

    if (!passedEmail) {
      setError('Email is missing.');
      setResending(false);
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

    setResending(false);
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
          <label className="block text-gray-700 mb-2" htmlFor="otp">OTP</label>
          <div className="flex justify-between gap-2">
            {[...Array(6)].map((_, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                inputMode="numeric"
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otp[idx] || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (!val) return;

                  const newOtp = otp.split('');
                  newOtp[idx] = val;
                  setOtp(newOtp.join(''));

                  const next = document.getElementById(`otp-${idx + 1}`);
                  if (next) (next as HTMLInputElement).focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otp[idx]) {
                    const prev = document.getElementById(`otp-${idx - 1}`);
                    if (prev) (prev as HTMLInputElement).focus();
                  }
                }}
                id={`otp-${idx}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={verifying}
        >
          {verifying ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          className="w-full bg-gray-600 text-white py-2 rounded-lg mt-4 hover:bg-gray-700"
          disabled={resending}
        >
          {resending ? 'Resending...' : 'Resend OTP'}
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
