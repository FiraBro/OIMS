import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ResetPasswordModal from "./ResetPasswordModal";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login: ctxLogin } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] : value,
      }));
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  const nextStep = () => activeStep < 2 && setActiveStep(activeStep + 1);
  const prevStep = () => activeStep > 0 && setActiveStep(activeStep - 1);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      profilePicture: null,
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    });
    setActiveStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden md:flex transform transition-all duration-500 hover:shadow-3xl">
        {/* Left Side - Branding */}
        <div className="md:w-2/5 bg-gradient-to-br from-pink-500 to-purple-600 text-white p-8 flex flex-col justify-center">
          <div className="text-center md:text-left">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
              <span className="text-2xl font-bold">✨</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {isRegistering ? "Join Our Community" : "Welcome Back"}
            </h1>
            <p className="text-pink-100 text-lg opacity-90">
              {isRegistering
                ? "Create your account and start your journey with us today."
                : "Sign in to access your personalized dashboard and continue where you left off."}
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-3/5 p-8 md:p-12">
          {isRegistering ? (
            <RegisterForm
              formData={formData}
              handleChange={handleChange}
              toggleMode={toggleMode}
              activeStep={activeStep}
              nextStep={nextStep}
              prevStep={prevStep}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <LoginForm
              formData={formData}
              handleChange={handleChange}
              toggleMode={toggleMode}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onForgotPassword={() => setShowForgotModal(true)}
            />
          )}
        </div>
      </div>

      <ForgotPasswordModal
        show={showForgotModal}
        email={forgotEmail}
        onEmailChange={setForgotEmail}
        onClose={() => setShowForgotModal(false)}
      />

      <ResetPasswordModal
        show={showResetModal}
        token={resetToken}
        newPassword={newPassword}
        newPasswordConfirm={newPasswordConfirm}
        onTokenChange={setResetToken}
        onPasswordChange={setNewPassword}
        onPasswordConfirmChange={setNewPasswordConfirm}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
}
