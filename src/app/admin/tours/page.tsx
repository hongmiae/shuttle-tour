import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS } from "@/lib/demo-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tour } from "@/types";

export default async function AdminToursPage() {
  let tourList: Tour[];

  if (isDemoMode()) {
    tourList = [...DEMO_TOURS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: tours } = await supabase
      .from("tours")
      .select("*")
      .order("date", { ascending: false });
    tourList = (tours ?? []) as Tour[];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">투어 관리</h1>
        <Link href="/admin/tours/new">
          <Button>새 투어 등록</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품명</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>출발시간</TableHead>
              <TableHead className="text-center">정원</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tourList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  등록된 투어가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              tourList.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.title}</TableCell>
                  <TableCell>{formatDate(tour.date)}</TableCell>
                  <TableCell>{formatTime(tour.departure_time)}</TableCell>
                  <TableCell className="text-center">{tour.max_capacity}명</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={tour.status === "active" ? "default" : "destructive"}
                      className={
                        tour.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : ""
                      }
                    >
                      {tour.status === "active" ? "운영중" : "마감"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/tours/${tour.id}/edit`}>
                      <Button variant="ghost" size="sm">수정</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
