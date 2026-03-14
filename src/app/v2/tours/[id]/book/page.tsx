import { Tour } from "@/types";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS, getDemoRemainingSeats } from "@/lib/demo-data";
import { notFound } from "next/navigation";
import { V2BookingFlow } from "@/components/customer/v2-booking-flow";

export default async function V2BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ people?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const initialPeople = parseInt(sp.people || "1", 10);

  let tour: Tour | null = null;
  let remainingSeats = 0;

  if (isDemoMode()) {
    const found = DEMO_TOURS.find((t) => t.id === id);
    if (found) {
      tour = found;
      remainingSeats = getDemoRemainingSeats(found);
    }
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("tours").select("*").eq("id", id).single();
    if (data) {
      tour = data as Tour;
      const { data: reservations } = await supabase.from("reservations").select("adult_count, child_count, infant_count").eq("tour_id", id).eq("status", "confirmed");
      const totalBooked = (reservations ?? []).reduce((sum, r) => sum + r.adult_count + r.child_count + r.infant_count, 0);
      remainingSeats = tour.max_capacity - totalBooked;
    }
  }

  if (!tour) notFound();

  return <V2BookingFlow tour={tour} remainingSeats={remainingSeats} initialPeople={initialPeople} />;
}
