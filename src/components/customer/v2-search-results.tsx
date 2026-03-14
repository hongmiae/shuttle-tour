"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tour } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

interface TourWithSeats { tour: Tour; remainingSeats: number; }

export function V2SearchResults({ tours, people, dateFrom, dateTo, location }: {
  tours: TourWithSeats[]; people: number; dateFrom: string; dateTo: string; location: string;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes v2FadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .v2-tour-card { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
      .v2-tour-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(59,89,152,0.12); }
      .v2-select-btn { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
      .v2-select-btn:hover { background: linear-gradient(135deg,#2c4a8a,#1e3a6e) !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(59,89,152,0.35); }
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 50);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const font = "'League Spartan', sans-serif";

  // Build search summary
  const summaryParts: string[] = [];
  if (dateFrom) summaryParts.push(dateFrom);
  if (dateTo) summaryParts.push(`~ ${dateTo}`);
  if (location) summaryParts.push(location);
  summaryParts.push(`${people}명`);

  return (
    <div style={{ fontFamily: font, minHeight: "calc(100vh - 60px)", background: "#fafbfe" }}>
      {/* Top bar */}
      <div style={{ background: "linear-gradient(180deg, #f3f6fd 0%, #fafbfe 100%)", padding: "32px 20px 24px", borderBottom: "1px solid rgba(59,89,152,0.04)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <button
            onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#3b5998", fontSize: "13px", fontWeight: 600, fontFamily: font, cursor: "pointer", padding: 0, marginBottom: "16px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
            검색 조건 변경
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.3em", color: "#8993a4", textTransform: "uppercase", marginBottom: "6px" }}>검색 결과</p>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1a1f36", margin: 0, letterSpacing: "-0.02em" }}>
                {tours.length > 0 ? `${tours.length}개의 투어` : "투어 없음"}
              </h1>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {summaryParts.map((part, i) => (
                <span key={i} style={{ fontSize: "12px", fontWeight: 600, color: "#3b5998", background: "rgba(59,89,152,0.08)", padding: "6px 12px", borderRadius: "20px" }}>{part}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px 80px" }}>
        {tours.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: "64px", height: "64px", margin: "0 auto 20px", background: "#fef3f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e4a4a4" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" /><line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" /><line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" /></svg>
            </div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#6b7280", margin: "0 0 8px" }}>조건에 맞는 투어가 없습니다</p>
            <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px" }}>날짜나 장소를 변경해서 다시 검색해보세요</p>
            <Link href="/v2" style={{ textDecoration: "none" }}>
              <button style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 600, fontFamily: font, color: "#3b5998", background: "rgba(59,89,152,0.08)", border: "none", borderRadius: "12px", cursor: "pointer" }}>다시 검색하기</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {tours.map(({ tour, remainingSeats }, index) => (
              <div
                key={tour.id}
                className="v2-tour-card"
                style={{
                  background: "#ffffff", borderRadius: "20px", border: "1px solid rgba(59,89,152,0.06)",
                  padding: "28px 32px", boxShadow: "0 2px 12px rgba(59,89,152,0.04)",
                  display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", alignItems: "center",
                  animation: mounted ? `v2FadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s both` : "none",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1f36", margin: 0, letterSpacing: "-0.02em" }}>{tour.title}</h3>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: remainingSeats <= 5 ? "#dc2626" : "#3b5998", background: remainingSeats <= 5 ? "rgba(220,38,38,0.08)" : "rgba(59,89,152,0.08)", padding: "4px 10px", borderRadius: "20px" }}>
                      잔여 {remainingSeats}석
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8993a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>{formatDate(tour.date)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8993a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>{formatTime(tour.departure_time)} 출발</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8993a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>{tour.price_info}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 400, color: "#9ca3b4", margin: 0, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "500px" }}>{tour.route}</p>
                </div>
                <Link href={`/v2/tours/${tour.id}/book?people=${people}`} style={{ textDecoration: "none" }}>
                  <button className="v2-select-btn" style={{ padding: "14px 32px", fontSize: "14px", fontWeight: 700, fontFamily: font, letterSpacing: "0.04em", color: "#ffffff", background: "linear-gradient(135deg, #3b5998, #2c4a8a)", border: "none", borderRadius: "14px", cursor: "pointer", boxShadow: "0 4px 16px rgba(59,89,152,0.2)", whiteSpace: "nowrap" }}>
                    선택하기
                  </button>
                </Link>
                <style>{`@media (max-width: 640px) { .v2-tour-card { grid-template-columns: 1fr !important; } .v2-tour-card a { width: 100%; } .v2-tour-card a button { width: 100%; } }`}</style>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
