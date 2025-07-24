import React, { useState, useEffect, useRef } from 'react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mobileNumber: string;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onSuccess, mobileNumber }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setOtp(new Array(6).fill(''));
      setError('');
      setResendTimer(30);
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: number | undefined;
    if (resendTimer > 0 && isOpen) {
      timer = window.setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [resendTimer, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Focus next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    // Dummy verification logic
    if (enteredOtp === '123456') {
      onSuccess();
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    // Logic to resend OTP
    console.log('Resending OTP...');
    setResendTimer(30);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Verify to Complete Order</h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the OTP sent to +91 ******{mobileNumber.slice(-4)}
        </p>
        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="text-center mb-6">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
          >
            Resend OTP {resendTimer > 0 && `in 0:${resendTimer.toString().padStart(2, '0')}`}
          </button>
        </div>
        <button
          onClick={handleVerify}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Verify & Proceed
        </button>
        <p className="mt-4 text-sm text-gray-500 text-center">
          For demo purposes, use OTP: <span className="font-semibold">123456</span>
        </p>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">&times;</button>
      </div>
    </div>
  );
};

export default OTPModal;
