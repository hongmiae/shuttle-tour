import Link from "next/link";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fafbfe",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(250, 251, 254, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(59, 89, 152, 0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "60px",
            padding: "0 20px",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "'League Spartan', sans-serif",
              fontSize: "18px",
              fontWeight: 800,
              color: "#1a1f36",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg, #3b5998, #2c4a8a)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            셔틀투어
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link
              href="/"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#6b7280",
                textDecoration: "none",
              }}
            >
              투어 검색
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(59, 89, 152, 0.06)",
          background: "#f3f6fd",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px 20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'League Spartan', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "#1a1f36",
                margin: "0 0 4px",
              }}
            >
              셔틀투어
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#8993a4",
                margin: 0,
              }}
            >
              편리하고 안전한 제주 셔틀 투어 서비스
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "13px", color: "#8993a4", margin: "0 0 2px" }}>
              문의: 000-0000-0000
            </p>
            <p style={{ fontSize: "13px", color: "#8993a4", margin: 0 }}>
              info@shuttletour.example.com
            </p>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(59, 89, 152, 0.06)",
            textAlign: "center",
            padding: "16px 20px",
          }}
        >
          <p style={{ fontSize: "11px", color: "#b0b8c9", margin: 0 }}>
            &copy; {new Date().getFullYear()} 셔틀투어. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
