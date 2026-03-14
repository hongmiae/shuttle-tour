import { notFound } from "next/navigation";
import { Tour } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ReservationForm } from "@/components/customer/reservation-form";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS, getDemoRemainingSeats } from "@/lib/demo-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params;

  let typedTour: Tour;
  let remainingSeats: number;

  if (isDemoMode()) {
    const tour = DEMO_TOURS.find((t) => t.id === id);
    if (!tour || tour.status === "closed") {
      notFound();
    }
    typedTour = tour;
    remainingSeats = getDemoRemainingSeats(tour);
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: tour } = await supabase
      .from("tours")
      .select("*")
      .eq("id", id)
      .single();

    if (!tour || tour.status === "closed") {
      notFound();
    }

    typedTour = tour as Tour;

    const { data: reservations } = await supabase
      .from("reservations")
      .select("adult_count, child_count, infant_count")
      .eq("tour_id", id)
      .eq("status", "confirmed");

    const totalBooked = (reservations ?? []).reduce(
      (sum, r) => sum + r.adult_count + r.child_count + r.infant_count,
      0
    );
    remainingSeats = typedTour.max_capacity - totalBooked;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {typedTour.title}
          </h1>
          <Badge variant={remainingSeats <= 0 ? "secondary" : "default"}>
            {remainingSeats <= 0 ? "마감" : "예약 가능"}
          </Badge>
        </div>

        <div className="space-y-4 rounded-lg border bg-gray-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">날짜</p>
              <p className="mt-1 text-gray-900">{formatDate(typedTour.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">출발 시간</p>
              <p className="mt-1 text-gray-900">
                {formatTime(typedTour.departure_time)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">경로</p>
              <p className="mt-1 text-gray-900">{typedTour.route}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">요금 안내</p>
              <p className="mt-1 text-gray-900">{typedTour.price_info}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">잔여석</p>
              <p
                className={`mt-1 font-semibold ${
                  remainingSeats <= 5 ? "text-red-500" : "text-gray-900"
                }`}
              >
                {remainingSeats > 0
                  ? `${remainingSeats} / ${typedTour.max_capacity}석`
                  : "마감"}
              </p>
            </div>
          </div>

          {typedTour.description && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-500">상세 설명</p>
              <p className="mt-1 whitespace-pre-wrap text-gray-700">
                {typedTour.description}
              </p>
            </div>
          )}

          {typedTour.pickup_locations && typedTour.pickup_locations.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-500">탑승 장소</p>
              <ul className="mt-1 list-inside list-disc text-gray-700">
                {typedTour.pickup_locations.map((loc) => (
                  <li key={loc}>{loc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {remainingSeats > 0 ? (
        <ReservationForm tour={typedTour} remainingSeats={remainingSeats} />
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
          <p className="text-lg font-medium text-gray-500">
            이 투어는 예약이 마감되었습니다
          </p>
        </div>
      )}
    </div>
  );
}
