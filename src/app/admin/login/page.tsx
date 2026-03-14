"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isDemoMode } from "@/lib/demo-mode";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load League Spartan font
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add global styles for placeholder
    const style = document.createElement("style");
    style.textContent = `
      .login-input::placeholder {
        color: #b8c1d1;
        font-weight: 400;
      }
      @keyframes slideUp {
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-20px, 20px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => setMounted(true), 50);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isDemoMode()) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'League Spartan', sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(59, 89, 152, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(164, 188, 228, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(59, 89, 152, 0.05) 0%, transparent 50%),
          #f3f6fd
        `,
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-80px",
          width: "400px",
          height: "400px",
          border: "1px solid rgba(59, 89, 152, 0.06)",
          borderRadius: "50%",
          animation: "float 20s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-40px",
          width: "250px",
          height: "250px",
          border: "1px solid rgba(59, 89, 152, 0.04)",
          borderRadius: "50%",
          animation: "float 15s cubic-bezier(0.16, 1, 0.3, 1) infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "6px",
          height: "6px",
          background: "rgba(59, 89, 152, 0.15)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: "4px",
          height: "4px",
          background: "rgba(164, 188, 228, 0.3)",
          borderRadius: "50%",
        }}
      />

      {/* Main content */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Brand mark */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "48px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              margin: "0 auto 20px",
              background: "linear-gradient(135deg, #3b5998, #2c4a8a)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(59, 89, 152, 0.25)",
              transform: "rotate(-3deg)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.4em",
              color: "#3b5998",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            SHUTTLE TOUR
          </p>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "#1a1f36",
              letterSpacing: "-0.03em",
              lineHeight: 0.8,
              margin: 0,
            }}
          >
            관리자
          </h1>
        </div>

        {/* Login card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(59, 89, 152, 0.08)",
            borderRadius: "24px",
            padding: "40px 36px",
            boxShadow: `
              0 1px 2px rgba(26, 31, 54, 0.04),
              0 4px 16px rgba(59, 89, 152, 0.06),
              0 12px 48px rgba(59, 89, 152, 0.04)
            `,
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          {isDemoMode() && (
            <div
              style={{
                background: "rgba(164, 188, 228, 0.15)",
                border: "1px solid rgba(59, 89, 152, 0.1)",
                borderRadius: "12px",
                padding: "12px 16px",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#3b5998",
                  flexShrink: 0,
                  animation: "pulse 2s ease infinite",
                }}
              />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#3b5998",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                데모 모드 — 아무 값이나 입력하고 로그인하세요
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.4em",
                  color: focused === "email" ? "#3b5998" : "#8993a4",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  transition: "color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                EMAIL
              </label>
              <input
                className="login-input"
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                required
                style={{
                  width: "100%",
                  padding: "14px 0",
                  fontSize: "16px",
                  fontWeight: 500,
                  fontFamily: "'League Spartan', sans-serif",
                  color: "#1a1f36",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    focused === "email"
                      ? "2px solid #3b5998"
                      : "2px solid #eaeef5",
                  outline: "none",
                  transition: "border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "32px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.4em",
                  color: focused === "password" ? "#3b5998" : "#8993a4",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  transition: "color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                PASSWORD
              </label>
              <input
                className="login-input"
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                required
                style={{
                  width: "100%",
                  padding: "14px 0",
                  fontSize: "16px",
                  fontWeight: 500,
                  fontFamily: "'League Spartan', sans-serif",
                  color: "#1a1f36",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    focused === "password"
                      ? "2px solid #3b5998"
                      : "2px solid #eaeef5",
                  outline: "none",
                  transition: "border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(220, 38, 38, 0.06)",
                  border: "1px solid rgba(220, 38, 38, 0.12)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#dc2626",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'League Spartan', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#ffffff",
                background: loading
                  ? "#8993a4"
                  : "linear-gradient(135deg, #3b5998, #2c4a8a)",
                border: "none",
                borderRadius: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: loading
                  ? "none"
                  : "0 4px 20px rgba(59, 89, 152, 0.3)",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(59, 89, 152, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = loading
                  ? "none"
                  : "0 4px 20px rgba(59, 89, 152, 0.3)";
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="white"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            fontWeight: 500,
            color: "#8993a4",
            marginTop: "32px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}
        >
          제주 셔틀 투어 관리 시스템
        </p>
      </div>
    </div>
  );
}
