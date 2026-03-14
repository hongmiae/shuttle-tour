"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { formatDate, getTotalPassengers } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_RESERVATIONS, DEMO_TOURS } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Reservation } from "@/types";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "대기", variant: "secondary" },
  confirmed: { label: "확정", variant: "default" },
  cancelled: { label: "취소", variant: "destructive" },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchReservations = async () => {
    if (isDemoMode()) {
      const withTours = DEMO_RESERVATIONS.map((r) => ({
        ...r,
        tour: DEMO_TOURS.find((t) => t.id === r.tour_id),
      }));
      setReservations(withTours as Reservation[]);
      setLoading(false);
      return;
    }

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase
      .from("reservations")
      .select("*, tour:tours(*)")
      .order("created_at", { ascending: false });

    setReservations((data as Reservation[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newStatus as Reservation["status"] } : r
        )
      );
    }
  };

  const filtered = useMemo(() => {
    let list = reservations;
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.reservation_number.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reservations, statusFilter, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">예약 관리</h1>
        <Link href="/admin/reservations/new">
          <Button>수기 예약</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="pending">대기</TabsTrigger>
            <TabsTrigger value="confirmed">확정</TabsTrigger>
            <TabsTrigger value="cancelled">취소</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="예약번호 또는 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>예약번호</TableHead>
              <TableHead>예약자</TableHead>
              <TableHead>투어명</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead className="text-center">인원</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                  예약이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => {
                const total = getTotalPassengers(r.adult_count, r.child_count, r.infant_count);
                const statusInfo = statusMap[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm">
                      {r.reservation_number}
                    </TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.tour?.title ?? "-"}</TableCell>
                    <TableCell>{r.tour ? formatDate(r.tour.date) : "-"}</TableCell>
                    <TableCell className="text-center">{total}명</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="sm">
                            상태 변경
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {r.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(r.id, "confirmed")}
                              >
                                확정으로 변경
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(r.id, "cancelled")}
                                className="text-red-600"
                              >
                                취소로 변경
                              </DropdownMenuItem>
                            </>
                          )}
                          {r.status === "confirmed" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(r.id, "cancelled")}
                              className="text-red-600"
                            >
                              취소로 변경
                            </DropdownMenuItem>
                          )}
                          {r.status === "cancelled" && (
                            <DropdownMenuItem disabled>
                              변경 불가
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
