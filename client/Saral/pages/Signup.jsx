import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Shield, Smartphone, CreditCard, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js'

const SignupPage = () => {
 const [formData, setFormData] = useState({
  name: '',            // 👈 Full name
  gender: '',          // 👈 Gender (male / female / other)
  aadhaar: '',
  password: '',
  confirmPassword: '',
  mobile: '',
  otp: ''
});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Registration Details, 2: OTP Verification
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Language state (in real app, this would come from global state/context)
  const lang=localStorage.getItem("appLanguage");
  const [currentLanguage] = useState(lang);
  const nav=useNavigate();
  const translations = {
  english: {
    title: "Create Account",
    subtitle: "Join GramSeva Bank today",
    bankName: "GramSeva Bank",
    form: {
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      aadhaar: "Aadhaar Number",
      aadhaarPlaceholder: "Enter 12-digit Aadhaar number",
      password: "Create Password",
      passwordPlaceholder: "Create a strong password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      mobile: "Mobile Number",
      mobilePlaceholder: "Enter 10-digit mobile number",
      otp: "Enter OTP",
      otpPlaceholder: "Enter 6-digit OTP",
      terms: "I agree to the Terms & Conditions and Privacy Policy",
      gender: "Gender",
    },
    buttons: {
      sendOtp: "Send OTP & Create Account",
      verifySignup: "Verify & Complete Signup",
      resendOtp: "Resend OTP",
      backToHome: "Back to Home",
      showPassword: "Show Password",
      hidePassword: "Hide Password",
    },
    genders: {
      Male: "Male",
      Female: "Female",
      Other: "Other",
    },
    messages: {
      otpSent: "OTP sent to your mobile number",
      resendIn: "Resend OTP in",
      seconds: "seconds",
      verifyingOtp: "Verifying OTP...",
      creatingAccount: "Creating your account...",
      accountCreated: "Account created successfully!",
      redirecting: "Redirecting to login...",
    },
    validation: {
      aadhaarRequired: "Aadhaar number is required",
      aadhaarInvalid: "Aadhaar number must be 12 digits",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 8 characters",
      passwordPattern:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      confirmPasswordRequired: "Please confirm your password",
      passwordMismatch: "Passwords do not match",
      mobileRequired: "Mobile number is required",
      mobileInvalid: "Mobile number must be 10 digits",
      otpRequired: "OTP is required",
      otpInvalid: "OTP must be 6 digits",
      termsRequired: "You must accept the terms and conditions",
    },
    features: {
      title: "Why Choose GramSeva Bank?",
      security: {
        title: "Bank-Grade Security",
        description: "Your data is protected with advanced encryption",
      },
      simple: {
        title: "Simple & Easy",
        description: "Banking made simple for everyone",
      },
      support: {
        title: "24/7 Support",
        description: "Get help whenever you need it",
      },
    },
  },

  hindi: {
    title: "खाता बनाएं",
    subtitle: "आज ही ग्रामसेवा बैंक से जुड़ें",
    bankName: "ग्रामसेवा बैंक",
    form: {
      name: "पूरा नाम",
      namePlaceholder: "अपना पूरा नाम दर्ज करें",
      aadhaar: "आधार नंबर",
      aadhaarPlaceholder: "12 अंकों का आधार नंबर दर्ज करें",
      password: "पासवर्ड बनाएँ",
      passwordPlaceholder: "एक मजबूत पासवर्ड बनाएँ",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      confirmPasswordPlaceholder: "अपना पासवर्ड दोबारा दर्ज करें",
      mobile: "मोबाइल नंबर",
      mobilePlaceholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
      otp: "ओटीपी दर्ज करें",
      otpPlaceholder: "6 अंकों का ओटीपी दर्ज करें",
      terms: "मैं नियम और शर्तों तथा गोपनीयता नीति से सहमत हूँ",
      gender: "लिंग",
    },
    buttons: {
      sendOtp: "ओटीपी भेजें और खाता बनाएँ",
      verifySignup: "सत्यापित करें और पंजीकरण पूरा करें",
      resendOtp: "ओटीपी फिर से भेजें",
      backToHome: "मुख्य पृष्ठ पर जाएँ",
      showPassword: "पासवर्ड दिखाएँ",
      hidePassword: "पासवर्ड छिपाएँ",
    },
    genders: {
      Male: "पुरुष",
      Female: "महिला",
      Other: "अन्य",
    },
    messages: {
      otpSent: "ओटीपी आपके मोबाइल नंबर पर भेजा गया है",
      resendIn: "ओटीपी फिर से भेजें",
      seconds: "सेकंड में",
      verifyingOtp: "ओटीपी सत्यापित किया जा रहा है...",
      creatingAccount: "आपका खाता बनाया जा रहा है...",
      accountCreated: "खाता सफलतापूर्वक बनाया गया!",
      redirecting: "लॉगिन पृष्ठ पर भेजा जा रहा है...",
    },
    validation: {
      aadhaarRequired: "आधार नंबर आवश्यक है",
      aadhaarInvalid: "आधार नंबर 12 अंकों का होना चाहिए",
      passwordRequired: "पासवर्ड आवश्यक है",
      passwordMinLength: "पासवर्ड कम से कम 8 अंकों का होना चाहिए",
      passwordPattern:
        "पासवर्ड में कम से कम एक बड़ा अक्षर, एक छोटा अक्षर, एक अंक और एक विशेष चिन्ह होना चाहिए",
      confirmPasswordRequired: "कृपया अपना पासवर्ड दोबारा दर्ज करें",
      passwordMismatch: "पासवर्ड मेल नहीं खा रहे हैं",
      mobileRequired: "मोबाइल नंबर आवश्यक है",
      mobileInvalid: "मोबाइल नंबर 10 अंकों का होना चाहिए",
      otpRequired: "ओटीपी आवश्यक है",
      otpInvalid: "ओटीपी 6 अंकों का होना चाहिए",
      termsRequired: "आपको नियम और शर्तों को स्वीकार करना होगा",
    },
    features: {
      title: "ग्रामसेवा बैंक क्यों चुनें?",
      security: {
        title: "बैंक-स्तरीय सुरक्षा",
        description: "आपका डेटा उन्नत एन्क्रिप्शन से सुरक्षित है",
      },
      simple: {
        title: "सरल और आसान",
        description: "हर किसी के लिए आसान बैंकिंग",
      },
      support: {
        title: "24/7 सहायता",
        description: "जब भी ज़रूरत हो, मदद पाएं",
      },
    },
  },

  kannada: {
    title: "ಖಾತೆ ರಚಿಸಿ",
    subtitle: "ಇಂದು ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್‌ಗೆ ಸೇರಿ",
    bankName: "ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್",
    form: {
      name: "ಪೂರ್ಣ ಹೆಸರು",
      namePlaceholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
      aadhaar: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
      aadhaarPlaceholder: "12 ಅಂಕೆಗಳ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
      password: "ಪಾಸ್ವರ್ಡ್ ರಚಿಸಿ",
      passwordPlaceholder: "ಬಲವಾದ ಪಾಸ್ವರ್ಡ್ ರಚಿಸಿ",
      confirmPassword: "ಪಾಸ್ವರ್ಡ್ ದೃಢಪಡಿಸಿ",
      confirmPasswordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್ವರ್ಡ್ ಮರು ನಮೂದಿಸಿ",
      mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      mobilePlaceholder: "10 ಅಂಕೆಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
      otp: "ಒಟಿಪಿ ನಮೂದಿಸಿ",
      otpPlaceholder: "6 ಅಂಕೆಗಳ ಒಟಿಪಿ ನಮೂದಿಸಿ",
      terms: "ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ಒಪ್ಪುತ್ತೇನೆ",
      gender: "ಲಿಂಗ",
    },
    buttons: {
      sendOtp: "ಒಟಿಪಿ ಕಳುಹಿಸಿ ಮತ್ತು ಖಾತೆ ರಚಿಸಿ",
      verifySignup: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ",
      resendOtp: "ಒಟಿಪಿ ಮರು ಕಳುಹಿಸಿ",
      backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
      showPassword: "ಪಾಸ್ವರ್ಡ್ ತೋರಿಸಿ",
      hidePassword: "ಪಾಸ್ವರ್ಡ್ ಮರೆಮಾಡಿ",
    },
    genders: {
      Male: "ಗಂಡು",
      Female: "ಹೆಣ್ಣು",
      Other: "ಇತರೆ",
    },
    messages: {
      otpSent: "ಒಟಿಪಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ",
      resendIn: "ಒಟಿಪಿ ಮರು ಕಳುಹಿಸಿ",
      seconds: "ಸೆಕೆಂಡುಗಳಲ್ಲಿ",
      verifyingOtp: "ಒಟಿಪಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      creatingAccount: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...",
      accountCreated: "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!",
      redirecting: "ಲಾಗಿನ್‌ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ...",
    },
    validation: {
      aadhaarRequired: "ಆಧಾರ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ",
      aadhaarInvalid: "ಆಧಾರ್ ಸಂಖ್ಯೆ 12 ಅಂಕೆಗಳಾಗಿರಬೇಕು",
      passwordRequired: "ಪಾಸ್ವರ್ಡ್ ಅಗತ್ಯವಿದೆ",
      passwordMinLength: "ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಿರಬೇಕು",
      passwordPattern:
        "ಪಾಸ್ವರ್ಡ್‌ನಲ್ಲಿ ಕನಿಷ್ಠ ಒಂದು ದೊಡ್ಡ ಅಕ್ಷರ, ಒಂದು ಸಣ್ಣ ಅಕ್ಷರ, ಒಂದು ಸಂಖ್ಯೆ ಮತ್ತು ಒಂದು ವಿಶೇಷ ಚಿಹ್ನೆ ಇರಬೇಕು",
      confirmPasswordRequired: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಾಸ್ವರ್ಡ್ ಮರು ನಮೂದಿಸಿ",
      passwordMismatch: "ಪಾಸ್ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ",
      mobileRequired: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ",
      mobileInvalid: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 10 ಅಂಕೆಗಳಾಗಿರಬೇಕು",
      otpRequired: "ಒಟಿಪಿ ಅಗತ್ಯವಿದೆ",
      otpInvalid: "ಒಟಿಪಿ 6 ಅಂಕೆಗಳಾಗಿರಬೇಕು",
      termsRequired: "ನೀವು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಬೇಕು",
    },
    features: {
      title: "ಏಕೆ ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್ ಆಯ್ಕೆ ಮಾಡಬೇಕು?",
      security: {
        title: "ಬ್ಯಾಂಕ್-ಮಟ್ಟದ ಭದ್ರತೆ",
        description: "ನಿಮ್ಮ ಡೇಟಾ ಉನ್ನತ ಎನ್‌ಕ್ರಿಪ್ಷನ್ ಮೂಲಕ ರಕ್ಷಿಸಲಾಗಿದೆ",
      },
      simple: {
        title: "ಸರಳ ಮತ್ತು ಸುಲಭ",
        description: "ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಸರಳವಾದ ಬ್ಯಾಂಕಿಂಗ್",
      },
      support: {
        title: "24/7 ಬೆಂಬಲ",
        description: "ನಿಮಗೆ ಬೇಕಾದಾಗ ಸಹಾಯ ಪಡೆಯಿರಿ",
      },
    },
  },
  };

  const t = translations[currentLanguage];

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const validateForm = () => {
  const newErrors = {};

  // ✅ Name validation
  if (!formData.name) {
    newErrors.name = t.validation.nameRequired;
  } else if (formData.name.length < 3) {
    newErrors.name = t.validation.nameMinLength;
  }

  // ✅ Gender validation
  if (!formData.gender) {
    newErrors.gender = t.validation.genderRequired;
  }

  // Aadhaar validation
  if (!formData.aadhaar) {
    newErrors.aadhaar = t.validation.aadhaarRequired;
  } else if (formData.aadhaar.length !== 12 || !/^\d{12}$/.test(formData.aadhaar)) {
    newErrors.aadhaar = t.validation.aadhaarInvalid;
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = t.validation.passwordRequired;
  } else if (formData.password.length < 8) {
    newErrors.password = t.validation.passwordMinLength;
  } else if (!validatePassword(formData.password)) {
    newErrors.password = t.validation.passwordPattern;
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = t.validation.confirmPasswordRequired;
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = t.validation.passwordMismatch;
  }

  // Mobile validation
  if (!formData.mobile) {
    newErrors.mobile = t.validation.mobileRequired;
  } else if (formData.mobile.length !== 10 || !/^\d{10}$/.test(formData.mobile)) {
    newErrors.mobile = t.validation.mobileInvalid;
  }

  // Terms validation (step 1)
  if (step === 1 && !termsAccepted) {
    newErrors.terms = t.validation.termsRequired;
  }

  // OTP validation (step 2)
  if (step === 2 && !formData.otp) {
    newErrors.otp = t.validation.otpRequired;
  } else if (step === 2 && formData.otp && (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp))) {
    newErrors.otp = t.validation.otpInvalid;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Simulate API call to send OTP
      const response = await api.post("/auth/signup", {
        name: formData.name,
        mobile: formData.mobile,
        aadhar: formData.aadhaar,   
        gender: formData.gender,
        password: formData.password
      });
      console.log('Sending OTP to:', formData.mobile);
      console.log('Registration data:', formData);
      
      setOtpSent(true);
      setStep(2);
      setOtpTimer(30);
      
      // Start countdown timer
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
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifySignup = async (e) => {
  e.preventDefault();

  try {
    // API call to verify OTP
    const response = await api.post("/auth/verify-signup-otp", {
      mobile: formData.mobile,  // 10-digit mobile
      code: formData.otp        // OTP entered by user
    });

    if (response.data.message === "User verified successfully") {
      console.log("✅ Account created and verified successfully!");

      // Redirect to login page after successful signup
      setTimeout(() => {
        console.log("Redirecting to login page...");
        // e.g., navigate("/login");
      }, 2000);
    } else {
      console.error("⚠️ Verification failed:", response.data.message);
    }
  } catch (error) {
    console.error("❌ Signup OTP verification error:", error.response?.data || error.message);
  }
};


  const handleResendOtp = async () => {
    try {
      console.log('Resending OTP to:', formData.mobile);
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
      console.error('Error resending OTP:', error);
    }
  };

  const navigateToHome = () => {
    nav('/')
    console.log('Navigate to home page');
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={navigateToHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  <UserPlus size={16} />
                </div>
                <span className="text-sm font-medium">Register</span>
              </div>
              <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                  <Smartphone size={16} />
                </div>
                <span className="text-sm font-medium">Verify</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-white" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {t.title}
            </h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          {/* Step 1: Registration Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              {/* Name Field */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {t.form.name} *
  </label>
  <div className="relative">
    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      placeholder={t.form.namePlaceholder}
      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
      }`}
    />
  </div>
  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
</div>
  {/* Gender Field */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {t.form.gender} *
  </label>
  <div className="flex gap-6">
    {["Male", "Female", "Other"].map((g) => (
      <label key={g} className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="gender"
          value={g}
          checked={formData.gender === g}
          onChange={handleInputChange}
          className="text-green-600 focus:ring-green-500"
        />
        <span>{t.genders[g]}</span>
      </label>
    ))}
  </div>
  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
</div>

              {/* Aadhaar Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.aadhaar} *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleInputChange}
                    placeholder={t.form.aadhaarPlaceholder}
                    maxLength={12}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.aadhaar ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                </div>
                {errors.aadhaar && <p className="text-red-500 text-sm mt-1">{errors.aadhaar}</p>}
              </div>

              {/* Password Field */}
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
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title={showPassword ? t.buttons.hidePassword : t.buttons.showPassword}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Password strength: {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                    </p>
                  </div>
                )}
                
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.confirmPassword} *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder={t.form.confirmPasswordPlaceholder}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title={showConfirmPassword ? t.buttons.hidePassword : t.buttons.showPassword}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Mobile Field */}
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
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.mobile ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                </div>
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t.form.terms}
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                {t.buttons.sendOtp}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifySignup} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-green-600" size={32} />
                </div>
                <p className="text-gray-600 mb-2">{t.messages.otpSent}</p>
                <p className="text-sm text-gray-500">+91 {formData.mobile}</p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  {t.form.otp} *
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder={t.form.otpPlaceholder}
                  maxLength={6}
                  className={`w-full px-4 py-4 text-center text-2xl font-mono border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors tracking-widest ${
                    errors.otp ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1 text-center">{errors.otp}</p>}
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    {t.messages.resendIn} {otpTimer} {t.messages.seconds}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {t.buttons.resendOtp}
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                {t.buttons.verifySignup}
              </button>

              {/* Back to Registration */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Registration
              </button>
            </form>
          )}

          {/* Features Section - Only show on step 1 */}
          {step === 1 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                {t.features.title}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{t.features.security.title}</h4>
                    <p className="text-sm text-gray-600">{t.features.security.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{t.features.simple.title}</h4>
                    <p className="text-sm text-gray-600">{t.features.simple.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserPlus className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{t.features.support.title}</h4>
                    <p className="text-sm text-gray-600">{t.features.support.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2024 GramSeva Bank. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;