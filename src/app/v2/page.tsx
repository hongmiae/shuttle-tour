import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS } from "@/lib/demo-data";
import { V2Welcome } from "@/components/customer/v2-welcome";

export default async function V2HomePage() {
  let locations: string[] = [];

  if (isDemoMode()) {
    const locs = new Set<string>();
    DEMO_TOURS.filter((t) => t.status === "active").forEach((t) =>
      t.pickup_locations.forEach((l) => locs.add(l))
    );
    locations = Array.from(locs).sort();
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: tours } = await supabase.from("tours").select("pickup_locations").eq("status", "active");
    if (tours) {
      const locs = new Set<string>();
      tours.forEach((t: { pickup_locations: string[] }) => t.pickup_locations.forEach((l: string) => locs.add(l)));
      locations = Array.from(locs).sort();
    }
  }

  return <V2Welcome locations={locations} />;
}
