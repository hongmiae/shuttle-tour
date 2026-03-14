import { Tour } from "@/types";
import { SearchHome } from "@/components/customer/search-home";
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

  return <SearchHome tours={toursWithSeats} />;
}
