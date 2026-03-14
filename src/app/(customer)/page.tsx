import { Tour } from "@/types";
import { TourCard } from "@/components/customer/tour-card";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS, getDemoRemainingSeats } from "@/lib/demo-data";

export default async function HomePage() {
  let toursWithSeats: { tour: Tour; remainingSeats: number }[] = [];

  if (isDemoMode()) {
    toursWithSeats = DEMO_TOURS.filter((t) => t.status === "active").map(
      (tour) => ({
        tour,
        remainingSeats: getDemoRemainingSeats(tour),
      })
    );
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: tours } = await supabase
      .from("tours")
      .select("*")
      .eq("status", "active")
      .order("date", { ascending: true });

    if (tours && tours.length > 0) {
      for (const tour of tours as Tour[]) {
        const { data: reservations } = await supabase
          .from("reservations")
          .select("adult_count, child_count, infant_count")
          .eq("tour_id", tour.id)
          .eq("status", "confirmed");

        const totalBooked = (reservations ?? []).reduce(
          (sum, r) => sum + r.adult_count + r.child_count + r.infant_count,
          0
        );

        toursWithSeats.push({
          tour,
          remainingSeats: tour.max_capacity - totalBooked,
        });
      }
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
        셔틀 투어 예약
      </h1>

      {toursWithSeats.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">예약 가능한 투어가 없습니다</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {toursWithSeats.map(({ tour, remainingSeats }) => (
            <TourCard
              key={tour.id}
              tour={tour}
              remainingSeats={remainingSeats}
            />
          ))}
        </div>
      )}
    </div>
  );
}
