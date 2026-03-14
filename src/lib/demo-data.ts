import type { Tour, Reservation } from "@/types";

export const DEMO_TOURS: Tour[] = [
  {
    id: "demo-tour-1",
    title: "제주 동부 해안 투어",
    description:
      "성산일출봉, 섭지코지, 만장굴 등 제주 동부의 아름다운 해안을 따라 달리는 프리미엄 셔틀 투어입니다. 전문 가이드의 설명과 함께 제주의 자연을 만끽하세요.",
    date: "2026-03-20",
    departure_time: "09:00:00",
    route: "제주시 출발 → 함덕해수욕장 → 만장굴 → 성산일출봉 → 섭지코지 → 제주시 복귀",
    max_capacity: 20,
    price_info: "성인 35,000원 / 아동 25,000원 / 유아 무료",
    pickup_locations: ["제주시청 앞", "제주국제공항", "신제주 로터리", "함덕해수욕장"],
    status: "active",
    created_at: "2026-03-10T00:00:00Z",
    updated_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "demo-tour-2",
    title: "제주 서부 올레길 셔틀",
    description:
      "한림공원, 협재해수욕장, 오설록 티뮤지엄 등 제주 서부의 명소를 편리하게 둘러보는 셔틀 투어입니다.",
    date: "2026-03-21",
    departure_time: "08:30:00",
    route: "제주시 출발 → 한림공원 → 협재해수욕장 → 오설록 → 중문관광단지 → 제주시 복귀",
    max_capacity: 15,
    price_info: "성인 40,000원 / 아동 30,000원 / 유아 무료",
    pickup_locations: ["제주시청 앞", "제주국제공항", "서귀포시청 앞"],
    status: "active",
    created_at: "2026-03-10T00:00:00Z",
    updated_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "demo-tour-3",
    title: "한라산 영실코스 트래킹 셔틀",
    description:
      "한라산 영실코스 입구까지 편리하게 이동하는 셔틀 서비스입니다. 트래킹 후 하산 시 픽업도 포함되어 있습니다.",
    date: "2026-03-22",
    departure_time: "07:00:00",
    route: "제주시 출발 → 영실 탐방로 입구 (하산 후 픽업 포함)",
    max_capacity: 25,
    price_info: "성인 20,000원 / 아동 15,000원",
    pickup_locations: ["제주시청 앞", "제주국제공항", "서귀포시청 앞", "중문관광단지"],
    status: "active",
    created_at: "2026-03-10T00:00:00Z",
    updated_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "demo-tour-4",
    title: "우도 왕복 셔틀",
    description: "성산항에서 우도까지 왕복 셔틀 서비스. 우도에서 자유롭게 관광 후 돌아오세요.",
    date: "2026-03-19",
    departure_time: "10:00:00",
    route: "제주시 출발 → 성산항 → 우도 (자유관광 4시간) → 성산항 → 제주시 복귀",
    max_capacity: 30,
    price_info: "성인 25,000원 / 아동 18,000원 / 유아 무료 (배 탑승료 별도)",
    pickup_locations: ["제주시청 앞", "제주국제공항"],
    status: "closed",
    created_at: "2026-03-05T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
];

export const DEMO_RESERVATIONS: Reservation[] = [
  {
    id: "demo-res-1",
    tour_id: "demo-tour-1",
    reservation_number: "SH260314-A1B2",
    name: "김민수",
    phone: "010-1234-5678",
    email: "minsu@example.com",
    adult_count: 2,
    child_count: 1,
    infant_count: 0,
    pickup_location: "제주국제공항",
    memo: "카시트 필요합니다",
    status: "confirmed",
    created_by: null,
    created_at: "2026-03-12T10:00:00Z",
    updated_at: "2026-03-12T11:00:00Z",
  },
  {
    id: "demo-res-2",
    tour_id: "demo-tour-1",
    reservation_number: "SH260314-C3D4",
    name: "이지영",
    phone: "010-9876-5432",
    email: null,
    adult_count: 1,
    child_count: 0,
    infant_count: 0,
    pickup_location: "제주시청 앞",
    memo: null,
    status: "pending",
    created_by: null,
    created_at: "2026-03-13T14:00:00Z",
    updated_at: "2026-03-13T14:00:00Z",
  },
  {
    id: "demo-res-3",
    tour_id: "demo-tour-2",
    reservation_number: "SH260314-E5F6",
    name: "박성준",
    phone: "010-5555-1234",
    email: "sjpark@example.com",
    adult_count: 4,
    child_count: 2,
    infant_count: 1,
    pickup_location: "제주국제공항",
    memo: "가족 여행입니다. 앞쪽 좌석 부탁드립니다.",
    status: "confirmed",
    created_by: null,
    created_at: "2026-03-11T09:00:00Z",
    updated_at: "2026-03-11T10:00:00Z",
  },
  {
    id: "demo-res-4",
    tour_id: "demo-tour-3",
    reservation_number: "SH260314-G7H8",
    name: "최은비",
    phone: "010-3333-7777",
    email: "eunbi@example.com",
    adult_count: 2,
    child_count: 0,
    infant_count: 0,
    pickup_location: "서귀포시청 앞",
    memo: null,
    status: "cancelled",
    created_by: null,
    created_at: "2026-03-10T16:00:00Z",
    updated_at: "2026-03-13T08:00:00Z",
  },
  {
    id: "demo-res-5",
    tour_id: "demo-tour-1",
    reservation_number: "SH260314-I9J0",
    name: "정하늘",
    phone: "010-7777-8888",
    email: null,
    adult_count: 3,
    child_count: 0,
    infant_count: 0,
    pickup_location: "신제주 로터리",
    memo: "관리자 전화 접수",
    status: "confirmed",
    created_by: "admin",
    created_at: "2026-03-14T08:00:00Z",
    updated_at: "2026-03-14T08:30:00Z",
  },
];

export function getDemoReservationsForTour(tourId: string): Reservation[] {
  return DEMO_RESERVATIONS.filter((r) => r.tour_id === tourId);
}

export function getDemoRemainingSeats(tour: Tour): number {
  const confirmed = DEMO_RESERVATIONS.filter(
    (r) => r.tour_id === tour.id && r.status === "confirmed"
  );
  const totalPassengers = confirmed.reduce(
    (sum, r) => sum + r.adult_count + r.child_count + r.infant_count,
    0
  );
  return tour.max_capacity - totalPassengers;
}
