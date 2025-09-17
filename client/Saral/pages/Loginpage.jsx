import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Shield, Smartphone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    otp: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Password + Mobile, 2: OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [errors, setErrors] = useState({});

  const lang = localStorage.getItem("appLanguage") || "english";
  const [currentLanguage] = useState(lang);
  const nav = useNavigate();

  const translations = {
  english: {
    title: "Welcome Back",
    subtitle: "Login to your GramSeva Bank account",
    bankName: "GramSeva Bank",
    form: {
      password: "Password",
      passwordPlaceholder: "Enter your password",
      mobile: "Mobile Number",
      mobilePlaceholder: "Enter 10-digit mobile number",
      otp: "Enter OTP",
      otpPlaceholder: "Enter 6-digit OTP",
    },
    buttons: {
      sendOtp: "Send OTP",
      verifyLogin: "Verify & Login",
      resendOtp: "Resend OTP",
      backToHome: "Back to Home",
      showPassword: "Show Password",
      hidePassword: "Hide Password",
    },
    messages: {
      otpSent: "OTP sent to your mobile number",
      resendIn: "Resend OTP in",
      seconds: "seconds",
    },
    validation: {
      passwordRequired: "Password is required",
      mobileRequired: "Mobile number is required",
      mobileInvalid: "Mobile number must be 10 digits",
      otpRequired: "OTP is required",
      otpInvalid: "OTP must be 6 digits",
    },
  },

  hindi: {
    title: "वापसी पर स्वागत है",
    subtitle: "अपने ग्रामसेवा बैंक खाते में लॉगिन करें",
    bankName: "ग्रामसेवा बैंक",
    form: {
      password: "पासवर्ड",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      mobile: "मोबाइल नंबर",
      mobilePlaceholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
      otp: "ओटीपी दर्ज करें",
      otpPlaceholder: "6 अंकों का ओटीपी दर्ज करें",
    },
    buttons: {
      sendOtp: "ओटीपी भेजें",
      verifyLogin: "सत्यापित करें और लॉगिन करें",
      resendOtp: "ओटीपी फिर से भेजें",
      backToHome: "मुख्य पृष्ठ पर जाएँ",
      showPassword: "पासवर्ड दिखाएँ",
      hidePassword: "पासवर्ड छिपाएँ",
    },
    messages: {
      otpSent: "ओटीपी आपके मोबाइल नंबर पर भेजा गया है",
      resendIn: "ओटीपी फिर से भेजें",
      seconds: "सेकंड",
    },
    validation: {
      passwordRequired: "पासवर्ड आवश्यक है",
      mobileRequired: "मोबाइल नंबर आवश्यक है",
      mobileInvalid: "मोबाइल नंबर 10 अंकों का होना चाहिए",
      otpRequired: "ओटीपी आवश्यक है",
      otpInvalid: "ओटीपी 6 अंकों का होना चाहिए",
    },
  },

  kannada: {
    title: "ಮತ್ತೆ ಸುಸ್ವಾಗತ",
    subtitle: "ನಿಮ್ಮ ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
    bankName: "ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್",
    form: {
      password: "ಪಾಸ್ವರ್ಡ್",
      passwordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ",
      mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      mobilePlaceholder: "10 ಅಂಕೆಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
      otp: "ಒಟಿಪಿ ನಮೂದಿಸಿ",
      otpPlaceholder: "6 ಅಂಕೆಗಳ ಒಟಿಪಿ ನಮೂದಿಸಿ",
    },
    buttons: {
      sendOtp: "ಒಟಿಪಿ ಕಳುಹಿಸಿ",
      verifyLogin: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ",
      resendOtp: "ಒಟಿಪಿ ಮರುಕಳುಹಿಸಿ",
      backToHome: "ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
      showPassword: "ಪಾಸ್ವರ್ಡ್ ತೋರಿಸಿ",
      hidePassword: "ಪಾಸ್ವರ್ಡ್ ಮರೆಮಾಡಿ",
    },
    messages: {
      otpSent: "ಒಟಿಪಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ",
      resendIn: "ಒಟಿಪಿ ಮರುಕಳುಹಿಸಿ",
      seconds: "ಸೆಕೆಂಡುಗಳು",
    },
    validation: {
      passwordRequired: "ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯವಿದೆ",
      mobileRequired: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ",
      mobileInvalid: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 10 ಅಂಕೆಗಳಾಗಿರಬೇಕು",
      otpRequired: "ಒಟಿಪಿ ಅಗತ್ಯವಿದೆ",
      otpInvalid: "ಒಟಿಪಿ 6 ಅಂಕೆಗಳಾಗಿರಬೇಕು",
    },
  },
};


  const t = translations[currentLanguage];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mobile) {
      newErrors.mobile = t.validation.mobileRequired;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = t.validation.mobileInvalid;
    }

    if (step === 1 && !formData.password) {
      newErrors.password = t.validation.passwordRequired;
    }

    if (step === 2) {
      if (!formData.otp) {
        newErrors.otp = t.validation.otpRequired;
      } else if (!/^\d{6}$/.test(formData.otp)) {
        newErrors.otp = t.validation.otpInvalid;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.post("/auth/login", {
        mobile: formData.mobile,
        password: formData.password,
      });
      console.log(response.data.message);

      setOtpSent(true);
      setStep(2);
      setOtpTimer(30);

      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await api.post("/auth/verify-login-otp", {
        mobile: formData.mobile,
        code: formData.otp,
      });
      console.log(response.data.message);

      localStorage.setItem("token", response.data.token);
      nav("/userDashboard");

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOtp = () => {
    console.log("Resending OTP to:", formData.mobile);
    setOtpTimer(30);
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const navigateToHome = () => {
    nav('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
          <button onClick={navigateToHome} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{t.bankName}</h1>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">

          {/* Step 1: Password + Mobile */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.mobile} *
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder={t.form.mobilePlaceholder}
                    maxLength={10}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.mobile ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                </div>
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.password} *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.form.passwordPlaceholder}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300">
                {t.buttons.sendOtp}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyLogin} className="space-y-6 text-center">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">{t.messages.otpSent}</p>
                <p className="text-sm text-gray-500">+91 {formData.mobile}</p>
              </div>

              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder={t.form.otpPlaceholder}
                maxLength={6}
                className={`w-full px-4 py-4 text-center text-2xl font-mono border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.otp ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}

              {otpTimer > 0 ? (
                <p className="text-sm text-gray-500">{t.messages.resendIn} {otpTimer} {t.messages.seconds}</p>
              ) : (
                <button type="button" onClick={handleResendOtp} className="text-sm text-green-600 hover:text-green-700 font-medium">
                  {t.buttons.resendOtp}
                </button>
              )}

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300">
                {t.buttons.verifyLogin}
              </button>

              <button type="button" onClick={() => setStep(1)} className="w-full py-3 text-gray-600 hover:text-gray-800">
                ← Back to Details
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
