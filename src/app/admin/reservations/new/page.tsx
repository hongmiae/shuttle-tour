"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_TOURS } from "@/lib/demo-data";
import { generateReservationNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tour } from "@/types";

export default function NewReservationPage() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(false);
  const [toursLoading, setToursLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    adult_count: "1",
    child_count: "0",
    infant_count: "0",
    pickup_location: "",
    memo: "",
  });

  useEffect(() => {
    const fetchTours = async () => {
      if (isDemoMode()) {
        const activeTours = DEMO_TOURS.filter((t) => t.status === "active").sort(
          (a, b) => a.date.localeCompare(b.date)
        );
        setTours(activeTours);
        setToursLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("tours")
        .select("*")
        .eq("status", "active")
        .order("date", { ascending: true });
      setTours((data as Tour[]) ?? []);
      setToursLoading(false);
    };
    fetchTours();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleTourSelect = (tourId: string | null) => {
    if (!tourId) return;
    const tour = tours.find((t) => t.id === tourId) ?? null;
    setSelectedTour(tour);
    setForm((prev) => ({ ...prev, pickup_location: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedTour) newErrors.tour = "투어를 선택해주세요.";
    if (!form.name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!form.phone.trim()) newErrors.phone = "연락처를 입력해주세요.";
    if (Number(form.adult_count) < 1)
      newErrors.adult_count = "성인은 최소 1명이어야 합니다.";
    if (!form.pickup_location) newErrors.pickup_location = "탑승 장소를 선택해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedTour) return;

    setLoading(true);
    try {
      const body = {
        tour_id: selectedTour.id,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        adult_count: Number(form.adult_count),
        child_count: Number(form.child_count),
        infant_count: Number(form.infant_count),
        pickup_location: form.pickup_location,
        memo: form.memo.trim() || null,
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "예약 등록에 실패했습니다.");
      }

      router.push("/admin/reservations");
      router.refresh();
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">수기 예약</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tour selection */}
            <div className="space-y-2">
              <Label>투어 선택 *</Label>
              {toursLoading ? (
                <p className="text-sm text-slate-500">투어 목록 로딩 중...</p>
              ) : (
                <Select onValueChange={handleTourSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="투어를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {tours.map((tour) => (
                      <SelectItem key={tour.id} value={tour.id}>
                        {tour.title} ({tour.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.tour && <p className="text-sm text-red-600">{errors.tour}</p>}
            </div>

            {/* Reservation form - shown after tour selected */}
            {selectedTour && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">예약자명 *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처 *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="010-0000-0000"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adult_count">성인 *</Label>
                    <Input
                      id="adult_count"
                      type="number"
                      min="1"
                      value={form.adult_count}
                      onChange={(e) => updateField("adult_count", e.target.value)}
                    />
                    {errors.adult_count && (
                      <p className="text-sm text-red-600">{errors.adult_count}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="child_count">아동</Label>
                    <Input
                      id="child_count"
                      type="number"
                      min="0"
                      value={form.child_count}
                      onChange={(e) => updateField("child_count", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="infant_count">유아</Label>
                    <Input
                      id="infant_count"
                      type="number"
                      min="0"
                      value={form.infant_count}
                      onChange={(e) => updateField("infant_count", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>탑승 장소 *</Label>
                  <Select
                    value={form.pickup_location}
                    onValueChange={(v) => updateField("pickup_location", v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="탑승 장소를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTour.pickup_locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pickup_location && (
                    <p className="text-sm text-red-600">{errors.pickup_location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memo">메모</Label>
                  <Textarea
                    id="memo"
                    rows={3}
                    value={form.memo}
                    onChange={(e) => updateField("memo", e.target.value)}
                    placeholder="특이사항을 입력하세요"
                  />
                </div>
              </>
            )}

            {errors.form && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {errors.form}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading || !selectedTour}>
                {loading ? "등록 중..." : "예약 등록"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/reservations")}
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
