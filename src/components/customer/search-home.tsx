"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Tour } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

interface TourWithSeats {
  tour: Tour;
  remainingSeats: number;
}

export function SearchHome({ tours }: { tours: TourWithSeats[] }) {
  const [mounted, setMounted] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState(1);
  const [searched, setSearched] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .search-input:focus {
        border-color: #3b5998 !important;
        box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.1) !important;
      }
      .search-input::placeholder {
        color: #9ca3b4;
      }
      .tour-result-card {
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .tour-result-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(59, 89, 152, 0.12);
      }
      .book-btn {
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .book-btn:hover {
        background: linear-gradient(135deg, #2c4a8a, #1e3a6e) !important;
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(59, 89, 152, 0.35);
      }
      .people-btn {
        transition: all 0.2s ease;
      }
      .people-btn:hover {
        background: #eaeef5 !important;
      }
      .people-btn:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => setMounted(true), 50);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  // Collect all unique pickup locations
  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    tours.forEach(({ tour }) =>
      tour.pickup_locations.forEach((l) => locs.add(l))
    );
    return Array.from(locs).sort();
  }, [tours]);

  // Filter tours based on search criteria
  const filteredTours = useMemo(() => {
    if (!searched) return [];
    return tours.filter(({ tour, remainingSeats }) => {
      // Date range filter
      if (dateFrom && tour.date < dateFrom) return false;
      if (dateTo && tour.date > dateTo) return false;
      // Location filter
      if (location && !tour.pickup_locations.includes(location)) return false;
      // People filter
      if (remainingSeats < people) return false;
      return true;
    });
  }, [searched, tours, dateFrom, dateTo, location, people]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const font = "'League Spartan', sans-serif";

  return (
    <div style={{ fontFamily: font }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "80px 20px 100px",
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(59, 89, 152, 0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(164, 188, 228, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #f3f6fd 0%, #eef2fa 100%)
          `,
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-60px",
            width: "350px",
            height: "350px",
            border: "1px solid rgba(59, 89, 152, 0.05)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "-30px",
            width: "200px",
            height: "200px",
            border: "1px solid rgba(59, 89, 152, 0.04)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.4em",
              color: "#3b5998",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            JEJU SHUTTLE TOUR
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 800,
              color: "#1a1f36",
              textAlign: "center",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 12px",
            }}
          >
            제주의 모든 투어를
            <br />
            한눈에
          </h1>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#6b7280",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            날짜와 장소를 선택하고 나에게 맞는 셔틀 투어를 찾아보세요
          </p>

          {/* Search Bar */}
          <form id="search" onSubmit={handleSearch}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "20px",
                border: "1px solid rgba(59, 89, 152, 0.08)",
                padding: "24px",
                boxShadow: `
                  0 1px 2px rgba(26, 31, 54, 0.04),
                  0 4px 16px rgba(59, 89, 152, 0.06),
                  0 16px 56px rgba(59, 89, 152, 0.04)
                `,
                opacity: mounted ? 1 : 0,
                transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto auto",
                  gap: "16px",
                  alignItems: "end",
                }}
              >
                {/* Date From */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.3em",
                      color: "#8993a4",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    출발일
                  </label>
                  <input
                    className="search-input"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                      fontFamily: font,
                      color: "#1a1f36",
                      background: "#f8f9fc",
                      border: "2px solid #eaeef5",
                      borderRadius: "12px",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Date To */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.3em",
                      color: "#8993a4",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    도착일
                  </label>
                  <input
                    className="search-input"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                      fontFamily: font,
                      color: "#1a1f36",
                      background: "#f8f9fc",
                      border: "2px solid #eaeef5",
                      borderRadius: "12px",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.3em",
                      color: "#8993a4",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    탑승 장소
                  </label>
                  <select
                    className="search-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                      fontFamily: font,
                      color: location ? "#1a1f36" : "#9ca3b4",
                      background: "#f8f9fc",
                      border: "2px solid #eaeef5",
                      borderRadius: "12px",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238993a4' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "36px",
                    }}
                  >
                    <option value="">전체</option>
                    {allLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* People Count */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.3em",
                      color: "#8993a4",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    인원
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0",
                      background: "#f8f9fc",
                      border: "2px solid #eaeef5",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      className="people-btn"
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      style={{
                        width: "40px",
                        height: "44px",
                        border: "none",
                        background: "transparent",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#3b5998",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        minWidth: "32px",
                        textAlign: "center",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#1a1f36",
                        fontFamily: font,
                      }}
                    >
                      {people}
                    </span>
                    <button
                      type="button"
                      className="people-btn"
                      onClick={() => setPeople(Math.min(30, people + 1))}
                      style={{
                        width: "40px",
                        height: "44px",
                        border: "none",
                        background: "transparent",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#3b5998",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button
                    type="submit"
                    className="book-btn"
                    style={{
                      height: "48px",
                      padding: "0 28px",
                      fontSize: "14px",
                      fontWeight: 700,
                      fontFamily: font,
                      letterSpacing: "0.06em",
                      color: "#ffffff",
                      background: "linear-gradient(135deg, #3b5998, #2c4a8a)",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(59, 89, 152, 0.25)",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                    조회
                  </button>
                </div>
              </div>

              {/* Mobile layout */}
              <style>{`
                @media (max-width: 768px) {
                  form > div > div {
                    grid-template-columns: 1fr 1fr !important;
                  }
                  form > div > div > div:nth-child(3) {
                    grid-column: 1 / -1;
                  }
                  form > div > div > div:last-child {
                    grid-column: 1 / -1;
                  }
                  form > div > div > div:last-child > button {
                    width: 100% !important;
                  }
                }
              `}</style>
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "48px 20px 80px",
        }}
      >
        {!searched ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              opacity: mounted ? 1 : 0,
              transition: "opacity 1s ease 0.4s",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 20px",
                background: "#f3f6fd",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a4bce4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#8993a4",
                margin: "0 0 6px",
              }}
            >
              원하는 조건을 선택하고 조회해보세요
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "#b0b8c9",
              }}
            >
              제주도 전역의 셔틀 투어를 검색할 수 있습니다
            </p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              animation: "fadeIn 0.6s ease forwards",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 20px",
                background: "#fef3f2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e4a4a4"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" />
              </svg>
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#6b7280",
                margin: "0 0 6px",
              }}
            >
              조건에 맞는 투어가 없습니다
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "#9ca3af",
              }}
            >
              날짜나 장소를 변경해서 다시 검색해보세요
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "28px",
                animation: "fadeIn 0.4s ease forwards",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: "0.3em",
                  color: "#8993a4",
                  textTransform: "uppercase",
                }}
              >
                검색 결과
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#3b5998",
                }}
              >
                {filteredTours.length}개 투어
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {filteredTours.map(({ tour, remainingSeats }, index) => (
                <div
                  key={tour.id}
                  className="tour-result-card"
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid rgba(59, 89, 152, 0.06)",
                    padding: "28px 32px",
                    boxShadow: "0 2px 12px rgba(59, 89, 152, 0.04)",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "24px",
                    alignItems: "center",
                    animation: `fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`,
                    opacity: 0,
                  }}
                >
                  <div>
                    {/* Title row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#1a1f36",
                          margin: 0,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {tour.title}
                      </h3>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color:
                            remainingSeats <= 5 ? "#dc2626" : "#3b5998",
                          background:
                            remainingSeats <= 5
                              ? "rgba(220, 38, 38, 0.08)"
                              : "rgba(59, 89, 152, 0.08)",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          letterSpacing: "0.02em",
                        }}
                      >
                        잔여 {remainingSeats}석
                      </span>
                    </div>

                    {/* Info row */}
                    <div
                      style={{
                        display: "flex",
                        gap: "24px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8993a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>
                          {formatDate(tour.date)}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8993a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>
                          {formatTime(tour.departure_time)} 출발
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8993a4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "#6b7280" }}>
                          {tour.price_info}
                        </span>
                      </div>
                    </div>

                    {/* Route */}
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#9ca3b4",
                        margin: 0,
                        lineHeight: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "500px",
                      }}
                    >
                      {tour.route}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link href={`/tours/${tour.id}`} style={{ textDecoration: "none" }}>
                    <button
                      className="book-btn"
                      style={{
                        padding: "14px 32px",
                        fontSize: "14px",
                        fontWeight: 700,
                        fontFamily: font,
                        letterSpacing: "0.04em",
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #3b5998, #2c4a8a)",
                        border: "none",
                        borderRadius: "14px",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(59, 89, 152, 0.2)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      예약하기
                    </button>
                  </Link>

                  {/* Mobile responsive */}
                  <style>{`
                    @media (max-width: 640px) {
                      .tour-result-card {
                        grid-template-columns: 1fr !important;
                      }
                      .tour-result-card a {
                        width: 100%;
                      }
                      .tour-result-card a button {
                        width: 100%;
                      }
                    }
                  `}</style>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
