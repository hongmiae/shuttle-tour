"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tour } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

interface Props {
  tour: Tour;
  remainingSeats: number;
  initialPeople: number;
}

type Step = 1 | 2 | 3 | 4;

export function V2BookingFlow({ tour, remainingSeats, initialPeople }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [reservationNumber, setReservationNumber] = useState("");

  // Step 1: People & Price
  const [adults, setAdults] = useState(Math.max(1, initialPeople));
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pickup, setPickup] = useState("");

  // Step 2: Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");

  // Step 3: Payment
  const [payment, setPayment] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      .v2b-input:focus { border-color: #3b5998 !important; box-shadow: 0 0 0 3px rgba(59,89,152,0.1) !important; }
      .v2b-input::placeholder { color: #9ca3b4; }
      .v2b-cnt-btn { transition: all 0.2s ease; }
      .v2b-cnt-btn:hover { background: #eaeef5 !important; }
      .v2b-cnt-btn:active { transform: scale(0.95); }
      .v2b-next { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
      .v2b-next:hover { background: linear-gradient(135deg,#2c4a8a,#1e3a6e) !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(59,89,152,0.35); }
      .v2b-back { transition: all 0.3s ease; }
      .v2b-back:hover { background: rgba(59,89,152,0.08) !important; }
      .v2b-pay-opt { transition: all 0.3s ease; cursor: pointer; }
      .v2b-pay-opt:hover { border-color: #3b5998 !important; }
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 50);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const font = "'League Spartan', sans-serif";
  const totalPeople = adults + children + infants;

  const label: React.CSSProperties = { display: "block", fontSize: "10px", fontWeight: 900, letterSpacing: "0.3em", color: "#8993a4", textTransform: "uppercase", marginBottom: "8px" };
  const input: React.CSSProperties = { width: "100%", padding: "14px 16px", fontSize: "15px", fontWeight: 500, fontFamily: font, color: "#1a1f36", background: "#f8f9fc", border: "2px solid #eaeef5", borderRadius: "12px", outline: "none", transition: "all 0.3s ease", boxSizing: "border-box" };

  const stepLabels = ["인원 & 가격", "예약자 정보", "결제수단", "예약 확인"];

  const validateStep1 = () => {
    if (totalPeople === 0) { setError("최소 1명 이상 선택해주세요."); return false; }
    if (totalPeople > remainingSeats) { setError(`잔여석(${remainingSeats}석)을 초과했습니다.`); return false; }
    if (!pickup) { setError("탑승 장소를 선택해주세요."); return false; }
    return true;
  };
  const validateStep2 = () => {
    if (!name.trim()) { setError("이름을 입력해주세요."); return false; }
    if (!phone.trim()) { setError("연락처를 입력해주세요."); return false; }
    return true;
  };
  const validateStep3 = () => {
    if (!payment) { setError("결제수단을 선택해주세요."); return false; }
    return true;
  };

  const goNext = () => {
    setError("");
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step < 4) setStep((step + 1) as Step);
  };

  const goBack = () => {
    setError("");
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: tour.id,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          adult_count: adults,
          child_count: children,
          infant_count: infants,
          pickup_location: pickup,
          memo: memo.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "예약 중 오류가 발생했습니다."); return; }
      setReservationNumber(data.reservation_number);
      setStep(4);
    } catch {
      setError("예약 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const CountControl = ({ label: lbl, value, onChange, max }: { label: string; value: number; onChange: (v: number) => void; max: number }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #f0f2f7" }}>
      <span style={{ fontSize: "15px", fontWeight: 600, color: "#1a1f36" }}>{lbl}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "0", background: "#f8f9fc", borderRadius: "10px", border: "1px solid #eaeef5" }}>
        <button type="button" className="v2b-cnt-btn" onClick={() => onChange(Math.max(0, value - 1))} style={{ width: "36px", height: "36px", border: "none", background: "transparent", fontSize: "16px", fontWeight: 600, color: "#3b5998", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
        <span style={{ minWidth: "32px", textAlign: "center", fontSize: "15px", fontWeight: 700, color: "#1a1f36", fontFamily: font }}>{value}</span>
        <button type="button" className="v2b-cnt-btn" onClick={() => onChange(Math.min(max, value + 1))} style={{ width: "36px", height: "36px", border: "none", background: "transparent", fontSize: "16px", fontWeight: 600, color: "#3b5998", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      </div>
    </div>
  );

  const paymentOptions = [
    { id: "card", label: "신용카드", desc: "현장 카드 결제" },
    { id: "cash", label: "현금", desc: "현장 현금 결제" },
    { id: "transfer", label: "계좌이체", desc: "예약 후 안내" },
  ];

  return (
    <div style={{ fontFamily: font, minHeight: "calc(100vh - 60px)", background: "#fafbfe" }}>
      {/* Tour summary bar */}
      <div style={{ background: "linear-gradient(135deg, #3b5998, #2c4a8a)", padding: "20px", color: "white" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.3em", opacity: 0.7, textTransform: "uppercase", marginBottom: "6px" }}>선택한 투어</p>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{tour.title}</h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", opacity: 0.85 }}>
            <span>{formatDate(tour.date)}</span>
            <span>{formatTime(tour.departure_time)} 출발</span>
            <span>잔여 {remainingSeats}석</span>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 20px 0" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "32px" }}>
          {stepLabels.map((lbl, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum || (step === 4 && reservationNumber);
            return (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ height: "3px", borderRadius: "2px", background: isDone ? "#3b5998" : isActive ? "#3b5998" : "#eaeef5", transition: "background 0.3s ease", marginBottom: "8px" }} />
                <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.2em", color: isActive ? "#3b5998" : isDone ? "#3b5998" : "#b0b8c9", textTransform: "uppercase", margin: 0 }}>
                  {lbl}
                </p>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
          borderRadius: "20px", border: "1px solid rgba(59,89,152,0.06)",
          padding: "32px 28px", boxShadow: "0 2px 16px rgba(59,89,152,0.04)",
          opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease",
          marginBottom: "32px",
        }}>

          {/* Step 1: People & Price */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1f36", margin: "0 0 4px", letterSpacing: "-0.02em" }}>인원 선택</h3>
              <p style={{ fontSize: "13px", color: "#8993a4", margin: "0 0 24px" }}>{tour.price_info}</p>
              <CountControl label="성인" value={adults} onChange={setAdults} max={remainingSeats - children - infants} />
              <CountControl label="아동" value={children} onChange={setChildren} max={remainingSeats - adults - infants} />
              <CountControl label="유아" value={infants} onChange={setInfants} max={remainingSeats - adults - children} />
              <div style={{ marginTop: "24px" }}>
                <label style={label}>탑승 장소</label>
                <select className="v2b-input" value={pickup} onChange={(e) => setPickup(e.target.value)} style={{ ...input, color: pickup ? "#1a1f36" : "#9ca3b4", cursor: "pointer", appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238993a4' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px" }}>
                  <option value="">선택해주세요</option>
                  {tour.pickup_locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
                </select>
              </div>
              <div style={{ marginTop: "24px", padding: "16px", background: "#f3f6fd", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#6b7280" }}>총 인원</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: "#3b5998" }}>{totalPeople}명</span>
              </div>
            </div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1f36", margin: "0 0 24px", letterSpacing: "-0.02em" }}>예약자 정보</h3>
              <div style={{ marginBottom: "20px" }}>
                <label style={label}>이름 *</label>
                <input className="v2b-input" placeholder="예약자 이름" value={name} onChange={(e) => setName(e.target.value)} style={input} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={label}>연락처 *</label>
                <input className="v2b-input" placeholder="010-0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={label}>이메일 (선택)</label>
                <input className="v2b-input" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
              </div>
              <div>
                <label style={label}>메모 (선택)</label>
                <textarea className="v2b-input" placeholder="요청사항이 있으시면 입력해주세요" value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} style={{ ...input, resize: "vertical" }} />
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1f36", margin: "0 0 24px", letterSpacing: "-0.02em" }}>결제수단 선택</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {paymentOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="v2b-pay-opt"
                    onClick={() => setPayment(opt.id)}
                    style={{
                      padding: "20px", borderRadius: "14px",
                      border: payment === opt.id ? "2px solid #3b5998" : "2px solid #eaeef5",
                      background: payment === opt.id ? "rgba(59,89,152,0.04)" : "#ffffff",
                      display: "flex", alignItems: "center", gap: "16px",
                    }}
                  >
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: payment === opt.id ? "6px solid #3b5998" : "2px solid #ccc", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: "#1a1f36", margin: 0 }}>{opt.label}</p>
                      <p style={{ fontSize: "12px", color: "#8993a4", margin: "2px 0 0" }}>{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "#b0b8c9", marginTop: "16px", lineHeight: 1.6 }}>
                * 현재 온라인 결제는 지원되지 않습니다. 현장에서 결제해주세요.
              </p>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && reservationNumber && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", margin: "0 auto 20px", background: "rgba(59,89,152,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b5998" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#1a1f36", margin: "0 0 8px" }}>예약이 완료되었습니다</h3>
              <p style={{ fontSize: "14px", color: "#8993a4", margin: "0 0 24px" }}>예약 정보를 확인해주세요</p>

              <div style={{ background: "#f3f6fd", borderRadius: "16px", padding: "24px", textAlign: "left", marginBottom: "24px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.3em", color: "#8993a4", textTransform: "uppercase", marginBottom: "4px" }}>예약번호</p>
                  <p style={{ fontSize: "22px", fontWeight: 800, color: "#3b5998", margin: 0, letterSpacing: "0.02em" }}>{reservationNumber}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px" }}>
                  <div><p style={{ color: "#8993a4", margin: "0 0 2px", fontWeight: 600, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>투어</p><p style={{ color: "#1a1f36", margin: 0, fontWeight: 600 }}>{tour.title}</p></div>
                  <div><p style={{ color: "#8993a4", margin: "0 0 2px", fontWeight: 600, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>날짜</p><p style={{ color: "#1a1f36", margin: 0, fontWeight: 600 }}>{formatDate(tour.date)}</p></div>
                  <div><p style={{ color: "#8993a4", margin: "0 0 2px", fontWeight: 600, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>예약자</p><p style={{ color: "#1a1f36", margin: 0, fontWeight: 600 }}>{name}</p></div>
                  <div><p style={{ color: "#8993a4", margin: "0 0 2px", fontWeight: 600, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>인원</p><p style={{ color: "#1a1f36", margin: 0, fontWeight: 600 }}>성인 {adults} / 아동 {children} / 유아 {infants}</p></div>
                  <div><p style={{ color: "#8993a4", margin: "0 0 2px", fontWeight: 600, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>탑승장소</p><p style={{ color: "#1a1f36", margin: 0, fontWeight: 600 }}>{pickup}</p></div>
                  <div><p style={{ color: "#8993a4", margin: "0 0 2px", fontWeight: 600, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>결제</p><p style={{ color: "#1a1f36", margin: 0, fontWeight: 600 }}>{paymentOptions.find(o => o.id === payment)?.label}</p></div>
                </div>
              </div>
              <button onClick={() => router.push("/v2")} style={{ width: "100%", height: "48px", fontSize: "14px", fontWeight: 700, fontFamily: font, color: "#3b5998", background: "rgba(59,89,152,0.08)", border: "none", borderRadius: "12px", cursor: "pointer" }}>
                홈으로 돌아가기
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)", borderRadius: "12px", padding: "12px 16px", marginTop: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#dc2626", margin: 0 }}>{error}</p>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        {step < 4 && (
          <div style={{ display: "flex", gap: "12px", paddingBottom: "40px" }}>
            {step > 1 && (
              <button onClick={goBack} className="v2b-back" style={{ flex: "0 0 auto", height: "48px", padding: "0 24px", fontSize: "14px", fontWeight: 600, fontFamily: font, color: "#6b7280", background: "transparent", border: "1px solid #eaeef5", borderRadius: "12px", cursor: "pointer" }}>
                이전
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : goNext}
              disabled={submitting}
              className="v2b-next"
              style={{
                flex: 1, height: "48px", fontSize: "14px", fontWeight: 700, fontFamily: font,
                letterSpacing: "0.04em", color: "#ffffff",
                background: submitting ? "#8993a4" : "linear-gradient(135deg, #3b5998, #2c4a8a)",
                border: "none", borderRadius: "12px", cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(59,89,152,0.25)",
              }}
            >
              {submitting ? "예약 처리 중..." : step === 3 ? "예약 완료하기" : "다음 단계"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
