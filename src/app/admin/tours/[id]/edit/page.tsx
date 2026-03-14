"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    departure_time: "",
    route: "",
    max_capacity: "",
    price_info: "",
    pickup_locations: "",
    status: "active" as "active" | "closed",
  });

  useEffect(() => {
    const fetchTour = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("id", tourId)
        .single();

      if (error || !data) {
        router.push("/admin/tours");
        return;
      }

      setForm({
        title: data.title,
        description: data.description || "",
        date: data.date,
        departure_time: data.departure_time,
        route: data.route || "",
        max_capacity: String(data.max_capacity),
        price_info: data.price_info || "",
        pickup_locations: (data.pickup_locations || []).join(", "),
        status: data.status,
      });
      setLoading(false);
    };

    fetchTour();
  }, [tourId, router]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "상품명을 입력해주세요.";
    if (!form.date) newErrors.date = "날짜를 선택해주세요.";
    if (!form.departure_time) newErrors.departure_time = "출발시간을 선택해주세요.";
    if (!form.max_capacity || Number(form.max_capacity) <= 0)
      newErrors.max_capacity = "정원을 올바르게 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        departure_time: form.departure_time,
        route: form.route.trim(),
        max_capacity: Number(form.max_capacity),
        price_info: form.price_info.trim(),
        pickup_locations: form.pickup_locations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        status: form.status,
      };

      const res = await fetch(`/api/tours/${tourId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "투어 수정에 실패했습니다.");
      }

      router.push("/admin/tours");
      router.refresh();
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/tours/${tourId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "삭제에 실패했습니다.");
      }
      router.push("/admin/tours");
      router.refresh();
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다." });
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">투어 수정</CardTitle>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
              삭제
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>투어를 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  이 작업은 되돌릴 수 없습니다. 관련된 예약 데이터에 영향을 줄 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "삭제 중..." : "삭제"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">상품명 *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">날짜 *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
                {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure_time">출발시간 *</Label>
                <Input
                  id="departure_time"
                  type="time"
                  value={form.departure_time}
                  onChange={(e) => updateField("departure_time", e.target.value)}
                />
                {errors.departure_time && (
                  <p className="text-sm text-red-600">{errors.departure_time}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">경로</Label>
              <Input
                id="route"
                value={form.route}
                onChange={(e) => updateField("route", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_capacity">정원 *</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  min="1"
                  value={form.max_capacity}
                  onChange={(e) => updateField("max_capacity", e.target.value)}
                />
                {errors.max_capacity && (
                  <p className="text-sm text-red-600">{errors.max_capacity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => updateField("status", v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">운영중</SelectItem>
                    <SelectItem value="closed">마감</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_info">가격 정보</Label>
              <Input
                id="price_info"
                value={form.price_info}
                onChange={(e) => updateField("price_info", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_locations">탑승 장소 (쉼표로 구분)</Label>
              <Input
                id="pickup_locations"
                value={form.pickup_locations}
                onChange={(e) => updateField("pickup_locations", e.target.value)}
              />
            </div>

            {errors.form && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {errors.form}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "저장 중..." : "수정 저장"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/tours")}
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
