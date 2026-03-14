import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      date,
      departure_time,
      route,
      max_capacity,
      price_info,
      pickup_locations,
      status,
    } = body;

    if (!title || !date || !departure_time || !max_capacity) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("tours")
      .insert({
        title,
        description: description || "",
        date,
        departure_time,
        route: route || "",
        max_capacity,
        price_info: price_info || "",
        pickup_locations: pickup_locations || [],
        status: status || "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
