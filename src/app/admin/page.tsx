import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS, DEMO_RESERVATIONS } from "@/lib/demo-data";

export default async function AdminDashboardPage() {
  let todayTours = 0;
  let todayReservations = 0;
  let pendingReservations = 0;

  if (isDemoMode()) {
    const today = new Date().toISOString().slice(0, 10);
    todayTours = DEMO_TOURS.filter((t) => t.date === today).length;
    todayReservations = DEMO_RESERVATIONS.filter((r) => {
      const tour = DEMO_TOURS.find((t) => t.id === r.tour_id);
      return tour?.date === today;
    }).length;
    pendingReservations = DEMO_RESERVATIONS.filter(
      (r) => r.status === "pending"
    ).length;
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);

    const [toursResult, reservationsResult, pendingResult] = await Promise.all([
      supabase
        .from("tours")
        .select("id", { count: "exact", head: true })
        .eq("date", today),
      supabase
        .from("reservations")
        .select("id, tours!inner(date)", { count: "exact", head: true })
        .eq("tours.date", today),
      supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

    todayTours = toursResult.count ?? 0;
    todayReservations = reservationsResult.count ?? 0;
    pendingReservations = pendingResult.count ?? 0;
  }

  const cards = [
    { title: "오늘의 투어 수", value: todayTours, color: "text-blue-600" },
    { title: "오늘의 예약 수", value: todayReservations, color: "text-green-600" },
    { title: "대기중 예약 수", value: pendingReservations, color: "text-amber-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      {isDemoMode() && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          데모 모드로 실행 중입니다. Supabase를 연결하면 실제 데이터로 전환됩니다.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
