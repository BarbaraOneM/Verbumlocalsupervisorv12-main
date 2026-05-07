import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import logoImage from "../../assets/619bbd22cfce479fb2faca904fc9762f8f470fb6.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("morgan.vance@nexbridge.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "#F3F4F6",
      }}
    >
      {/* Login Card */}
      <div
        className="w-full max-w-[400px] p-10 rounded-xl"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-[10px] mb-1">
          <img
            src={logoImage}
            alt="VerbumLocal"
            className="w-9 h-9 rounded-[8px] flex-shrink-0"
          />
          <div className="flex flex-col gap-[1px]">
            <span
              className="leading-[1.2]"
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1F2937",
              }}
            >
              VerbumLocal
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "#9CA3AF",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              Admin Panel
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-[1px] my-6"
          style={{ background: "#E5E7EB" }}
        />

        {/* Title */}
        <p
          className="m-0 mb-1"
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1F2937",
          }}
        >
          Sign in
        </p>
        <p
          className="m-0 mb-7"
          style={{
            fontSize: "13px",
            color: "#6B7280",
            fontWeight: 400,
          }}
        >
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block mb-[6px]"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              Email address
            </label>
            <div className="relative flex items-center">
              <span
                className="absolute left-3 flex items-center"
                style={{ color: "#9CA3AF" }}
              >
                <Mail size={14} />
              </span>
              <input
                type="email"
                className="w-full h-10 rounded-[8px] px-9 transition-all outline-none"
                style={{
                  border: "1px solid #D1D5DB",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  color: "#1F2937",
                  background: "#F9FAFB",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4023FF";
                  e.target.style.background = "#fff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(64, 35, 255, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#D1D5DB";
                  e.target.style.background = "#F9FAFB";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="your.email@nexbridge.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              className="block mb-[6px]"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              Password
            </label>
            <div className="relative flex items-center">
              <span
                className="absolute left-3 flex items-center"
                style={{ color: "#9CA3AF" }}
              >
                <Lock size={14} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-10 rounded-[8px] px-9 transition-all outline-none"
                style={{
                  border: "1px solid #D1D5DB",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  color: "#1F2937",
                  background: "#F9FAFB",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4023FF";
                  e.target.style.background = "#fff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(64, 35, 255, 0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#D1D5DB";
                  e.target.style.background = "#F9FAFB";
                  e.target.style.boxShadow = "none";
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 flex items-center cursor-pointer bg-transparent border-none p-0"
                style={{ color: "#9CA3AF" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6 mt-1">
            <label
              className="flex items-center gap-[6px] cursor-pointer"
              style={{
                fontSize: "12px",
                color: "#6B7280",
              }}
            >
              <input
                type="checkbox"
                className="w-[14px] h-[14px] rounded-[4px] cursor-pointer"
                style={{
                  border: "1.5px solid #D1D5DB",
                  accentColor: "#4023FF",
                }}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a
              href="#"
              className="no-underline hover:underline"
              style={{
                fontSize: "12px",
                color: "#4023FF",
                fontWeight: 500,
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-10 rounded-[8px] border-none transition-all"
            style={{
              background: !isFormValid
                ? "#00000066"
                : isLoading
                ? "#0E0E47"
                : "#0E0E47",
              color: !isFormValid ? "#9CA3AF" : "#fff",
              cursor: !isFormValid || isLoading ? "not-allowed" : "pointer",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              opacity: isLoading ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (isFormValid && !isLoading) {
                e.currentTarget.style.background = "#0a0a35";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(14, 14, 71, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid && !isLoading) {
                e.currentTarget.style.background = "#0E0E47";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
            onMouseDown={(e) => {
              if (isFormValid && !isLoading) {
                e.currentTarget.style.transform = "scale(0.98)";
              }
            }}
            onMouseUp={(e) => {
              if (isFormValid && !isLoading) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </span>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Helper Text */}
          
        </form>
      </div>

      <button
        type="button"
        onClick={() => window.open("https://BarbaraOneM.github.io/Verbumlocalagentv35/", "_blank")}
        className="w-full max-w-[400px] h-10 rounded-[8px] border border-[#E5E7EB] bg-white text-[#1F2937] mt-4 transition-all"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "13px",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#F3F4F6";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
        }}
      >
        Go to Agent App
      </button>

      {/* Footer */}
      <div
        className="mt-6 flex items-center gap-[6px]"
        style={{
          fontSize: "12px",
          color: "#9CA3AF",
        }}
      >
        <span>A product by</span>
        <span
          className="flex items-center gap-1"
          style={{
            color: "#6B7280",
            fontWeight: 500,
            fontSize: "12px",
          }}
        >
          <span
            className="inline-block w-[6px] h-[6px] rounded-full"
            style={{ background: "#4023FF" }}
          />
          OneMeta
        </span>
      </div>
    </div>
  );
}