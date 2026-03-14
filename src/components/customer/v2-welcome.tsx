"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function V2Welcome({ locations }: { locations: string[] }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState(1);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      .v2-input:focus { border-color: #3b5998 !important; box-shadow: 0 0 0 3px rgba(59,89,152,0.1) !important; }
      .v2-input::placeholder { color: #9ca3b4; }
      .v2-search-btn { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
      .v2-search-btn:hover { background: linear-gradient(135deg,#2c4a8a,#1e3a6e) !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(59,89,152,0.4); }
      .v2-ppl-btn { transition: all 0.2s ease; }
      .v2-ppl-btn:hover { background: #eaeef5 !important; }
      .v2-ppl-btn:active { transform: scale(0.95); }
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 50);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (location) params.set("location", location);
    params.set("people", String(people));
    router.push(`/v2/tours/search?${params.toString()}`);
  };

  const font = "'League Spartan', sans-serif";
  const label: React.CSSProperties = { display: "block", fontSize: "10px", fontWeight: 900, letterSpacing: "0.3em", color: "#8993a4", textTransform: "uppercase", marginBottom: "8px" };
  const input: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: "14px", fontWeight: 500, fontFamily: font, color: "#1a1f36", background: "#f8f9fc", border: "2px solid #eaeef5", borderRadius: "12px", outline: "none", transition: "all 0.3s ease", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: font, minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "40px 20px", background: "radial-gradient(ellipse at 30% 20%, rgba(59,89,152,0.07) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(164,188,228,0.1) 0%, transparent 50%), linear-gradient(180deg, #f3f6fd 0%, #eef2fa 100%)", overflow: "hidden" }}>
      {/* Decorative */}
      <div style={{ position: "absolute", top: "-100px", right: "-60px", width: "350px", height: "350px", border: "1px solid rgba(59,89,152,0.05)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-40px", left: "-30px", width: "200px", height: "200px", border: "1px solid rgba(59,89,152,0.04)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "25%", left: "8%", width: "6px", height: "6px", background: "rgba(59,89,152,0.12)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "30%", right: "12%", width: "4px", height: "4px", background: "rgba(164,188,228,0.25)", borderRadius: "50%" }} />

      <div style={{ maxWidth: "560px", width: "100%", position: "relative", zIndex: 1, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ width: "56px", height: "56px", margin: "0 auto 20px", background: "linear-gradient(135deg, #3b5998, #2c4a8a)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(59,89,152,0.25)", transform: "rotate(-3deg)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.4em", color: "#3b5998", textTransform: "uppercase", marginBottom: "12px" }}>JEJU SHUTTLE TOUR</p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, color: "#1a1f36", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 12px" }}>어디로 떠나볼까요?</h1>
          <p style={{ fontSize: "15px", fontWeight: 400, color: "#8993a4", margin: 0 }}>날짜와 장소를 선택하면 딱 맞는 셔틀 투어를 찾아드려요</p>
        </div>

        {/* Search Card */}
        <form onSubmit={handleSearch}>
          <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: "24px", border: "1px solid rgba(59,89,152,0.08)", padding: "32px 28px", boxShadow: "0 1px 2px rgba(26,31,54,0.04), 0 4px 16px rgba(59,89,152,0.06), 0 16px 56px rgba(59,89,152,0.04)", opacity: mounted ? 1 : 0, transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
            {/* Dates */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={label}>출발일</label>
                <input className="v2-input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={input} />
              </div>
              <div>
                <label style={label}>도착일</label>
                <input className="v2-input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={input} />
              </div>
            </div>
            {/* Location */}
            <div style={{ marginBottom: "20px" }}>
              <label style={label}>탑승 장소</label>
              <select className="v2-input" value={location} onChange={(e) => setLocation(e.target.value)} style={{ ...input, color: location ? "#1a1f36" : "#9ca3b4", cursor: "pointer", appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238993a4' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px" }}>
                <option value="">전체 장소</option>
                {locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
              </select>
            </div>
            {/* People */}
            <div style={{ marginBottom: "28px" }}>
              <label style={label}>인원</label>
              <div style={{ display: "flex", alignItems: "center", background: "#f8f9fc", border: "2px solid #eaeef5", borderRadius: "12px", overflow: "hidden", width: "fit-content" }}>
                <button type="button" className="v2-ppl-btn" onClick={() => setPeople(Math.max(1, people - 1))} style={{ width: "44px", height: "44px", border: "none", background: "transparent", fontSize: "18px", fontWeight: 600, color: "#3b5998", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ minWidth: "40px", textAlign: "center", fontSize: "15px", fontWeight: 700, color: "#1a1f36", fontFamily: font }}>{people}명</span>
                <button type="button" className="v2-ppl-btn" onClick={() => setPeople(Math.min(30, people + 1))} style={{ width: "44px", height: "44px", border: "none", background: "transparent", fontSize: "18px", fontWeight: 600, color: "#3b5998", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>
            {/* Submit */}
            <button type="submit" className="v2-search-btn" style={{ width: "100%", height: "52px", fontSize: "15px", fontWeight: 700, fontFamily: font, letterSpacing: "0.06em", color: "#ffffff", background: "linear-gradient(135deg, #3b5998, #2c4a8a)", border: "none", borderRadius: "14px", cursor: "pointer", boxShadow: "0 4px 20px rgba(59,89,152,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              투어 조회하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
