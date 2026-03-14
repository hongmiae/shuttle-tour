import { NextRequest, NextResponse } from "next/server";
import { generateReservationNumber, getTotalPassengers } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo-mode";

export async function GET() {
  try {
    if (isDemoMode()) {
      const { getDemoReservations, DEMO_TOURS } = await import("@/lib/demo-data");
      const reservations = getDemoReservations().map((r) => ({
        ...r,
        tour: DEMO_TOURS.find((t) => t.id === r.tour_id) || null,
      }));
      return NextResponse.json(reservations);
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("reservations")
      .select("*, tour:tours(*)")
      .order("created_at", { ascending: false });

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("Reservations GET error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      tour_id,
      adult_count,
      child_count,
      infant_count,
      pickup_location,
      name,
      phone,
      email,
      memo,
    } = body;

    if (!tour_id) {
      return NextResponse.json(
        { error: "투어 정보가 누락되었습니다." },
        { status: 400 }
      );
    }
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "이름을 입력해주세요." },
        { status: 400 }
      );
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "연락처를 입력해주세요." },
        { status: 400 }
      );
    }
    if (!pickup_location) {
      return NextResponse.json(
        { error: "탑승 장소를 선택해주세요." },
        { status: 400 }
      );
    }

    const totalPassengers = getTotalPassengers(
      Number(adult_count) || 0,
      Number(child_count) || 0,
      Number(infant_count) || 0
    );

    if (totalPassengers <= 0) {
      return NextResponse.json(
        { error: "최소 1명 이상의 탑승객이 필요합니다." },
        { status: 400 }
      );
    }

    // Demo mode: save to in-memory store and return reservation number
    if (isDemoMode()) {
      const { addDemoReservation, DEMO_TOURS } = await import("@/lib/demo-data");
      const reservationNumber = generateReservationNumber();
      const tour = DEMO_TOURS.find((t) => t.id === tour_id);

      addDemoReservation({
        id: `demo-res-${Date.now()}`,
        tour_id,
        reservation_number: reservationNumber,
        name: name.trim(),
        phone: phone.trim(),
        email: email || null,
        adult_count: Number(adult_count) || 0,
        child_count: Number(child_count) || 0,
        infant_count: Number(infant_count) || 0,
        pickup_location,
        memo: memo || null,
        status: "confirmed",
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tour: tour || undefined,
      });

      return NextResponse.json(
        { reservation_number: reservationNumber },
        { status: 201 }
      );
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: tour, error: tourError } = await supabase
      .from("tours")
      .select("id, max_capacity, status")
      .eq("id", tour_id)
      .single();

    if (tourError || !tour) {
      return NextResponse.json(
        { error: "투어를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (tour.status !== "active") {
      return NextResponse.json(
        { error: "이 투어는 예약이 마감되었습니다." },
        { status: 400 }
      );
    }

    const { data: reservations } = await supabase
      .from("reservations")
      .select("adult_count, child_count, infant_count")
      .eq("tour_id", tour_id)
      .eq("status", "confirmed");

    const totalBooked = (reservations ?? []).reduce(
      (sum, r) => sum + r.adult_count + r.child_count + r.infant_count,
      0
    );
    const remainingSeats = tour.max_capacity - totalBooked;

    if (totalPassengers > remainingSeats) {
      return NextResponse.json(
        { error: `잔여석이 부족합니다. 현재 잔여석: ${remainingSeats}석` },
        { status: 400 }
      );
    }

    const reservationNumber = generateReservationNumber();

    const { error: insertError } = await supabase
      .from("reservations")
      .insert({
        tour_id,
        reservation_number: reservationNumber,
        name: name.trim(),
        phone: phone.trim(),
        email: email || null,
        adult_count: Number(adult_count) || 0,
        child_count: Number(child_count) || 0,
        infant_count: Number(infant_count) || 0,
        pickup_location,
        memo: memo || null,
        status: "confirmed",
      });

    if (insertError) {
      console.error("Reservation insert error:", insertError);
      return NextResponse.json(
        { error: "예약 처리 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { reservation_number: reservationNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
