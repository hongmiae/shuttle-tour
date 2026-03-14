import { Tour } from "@/types";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS, getDemoRemainingSeats } from "@/lib/demo-data";
import { V2SearchResults } from "@/components/customer/v2-search-results";

export default async function V2SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ dateFrom?: string; dateTo?: string; location?: string; people?: string }>;
}) {
  const params = await searchParams;
  const dateFrom = params.dateFrom || "";
  const dateTo = params.dateTo || "";
  const location = params.location || "";
  const people = parseInt(params.people || "1", 10);

  let toursWithSeats: { tour: Tour; remainingSeats: number }[] = [];

  if (isDemoMode()) {
    toursWithSeats = DEMO_TOURS.filter((t) => t.status === "active").map((tour) => ({
      tour,
      remainingSeats: getDemoRemainingSeats(tour),
    }));
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: tours } = await supabase.from("tours").select("*").eq("status", "active").order("date", { ascending: true });
    if (tours && tours.length > 0) {
      for (const tour of tours as Tour[]) {
        const { data: reservations } = await supabase.from("reservations").select("adult_count, child_count, infant_count").eq("tour_id", tour.id).eq("status", "confirmed");
        const totalBooked = (reservations ?? []).reduce((sum, r) => sum + r.adult_count + r.child_count + r.infant_count, 0);
        toursWithSeats.push({ tour, remainingSeats: tour.max_capacity - totalBooked });
      }
    }
  }

  // Apply filters
  const filtered = toursWithSeats.filter(({ tour, remainingSeats }) => {
    if (dateFrom && tour.date < dateFrom) return false;
    if (dateTo && tour.date > dateTo) return false;
    if (location && !tour.pickup_locations.includes(location)) return false;
    if (remainingSeats < people) return false;
    return true;
  });

  return <V2SearchResults tours={filtered} people={people} dateFrom={dateFrom} dateTo={dateTo} location={location} />;
}
