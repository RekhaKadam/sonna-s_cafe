import React, { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, User, CheckCircle } from 'lucide-react';

interface LoginSignupProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; phone: string }) => void;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  // Handle back button behavior for login modal
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isOpen) {
        event.preventDefault();
        onClose();
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Add a history entry when modal opens
    if (isOpen) {
      window.history.pushState(null, '', window.location.href);
    }

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPhoneNumber('');
      setOtp('');
      setIsOtpSent(false);
      setError('');
      setShowOtpPopup(false);
    }
  }, [isOpen]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    
    // MOCK: Generate a random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    
    console.log(`Sending OTP ${generatedOtp} to ${phoneNumber}`);
    
    // Show the OTP in a popup instead of an alert
    setShowOtpPopup(true);
    setTimeout(() => setShowOtpPopup(false), 5000); // Hide popup after 5 seconds

    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === mockOtp) {
      onLoginSuccess({ name, phone: phoneNumber });
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setOtp('');
    // Re-trigger the OTP sending logic
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    
    console.log(`Resending OTP ${generatedOtp} to ${phoneNumber}`);
    
    setShowOtpPopup(true);
    setTimeout(() => setShowOtpPopup(false), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
        {/* OTP Popup */}
        {showOtpPopup && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>OTP: {mockOtp}</span>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Login with Phone
            </h2>
            <p className="text-gray-600">
              {isOtpSent ? 'Enter the OTP sent to your phone' : 'We will send you a one-time password'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
            {!isOtpSent ? (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your 10-digit phone number"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  One-Time Password (OTP)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter the 6-digit OTP"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    Change phone number
                  </button>
                  {error && (
                     <button
                       type="button"
                       onClick={handleResendOtp}
                       className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                     >
                       Resend OTP
                     </button>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 mt-4"
            >
              {isOtpSent ? 'Verify OTP & Login' : 'Send OTP'}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
