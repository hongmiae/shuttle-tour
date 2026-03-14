"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Tour } from "@/types";
import { getTotalPassengers } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface ReservationFormProps {
  tour: Tour;
  remainingSeats: number;
}

export function ReservationForm({ tour, remainingSeats }: ReservationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [pickupLocation, setPickupLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");

  const totalPassengers = getTotalPassengers(adultCount, childCount, infantCount);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      setError("연락처를 입력해주세요.");
      return;
    }
    if (totalPassengers <= 0) {
      setError("최소 1명 이상의 탑승객이 필요합니다.");
      return;
    }
    if (totalPassengers > remainingSeats) {
      setError(`잔여석(${remainingSeats}석)을 초과할 수 없습니다.`);
      return;
    }
    if (!pickupLocation) {
      setError("탑승 장소를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: tour.id,
          adult_count: adultCount,
          child_count: childCount,
          infant_count: infantCount,
          pickup_location: pickupLocation,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          memo: memo.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "예약 중 오류가 발생했습니다.");
        return;
      }

      router.push(
        `/reservation/complete?number=${encodeURIComponent(data.reservation_number)}`
      );
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>예약 정보 입력</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passenger Counts */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              탑승 인원
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adult_count">성인</Label>
                <Input
                  id="adult_count"
                  type="number"
                  min={1}
                  max={remainingSeats}
                  value={adultCount}
                  onChange={(e) => setAdultCount(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="child_count">아동</Label>
                <Input
                  id="child_count"
                  type="number"
                  min={0}
                  max={remainingSeats}
                  value={childCount}
                  onChange={(e) => setChildCount(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="infant_count">유아</Label>
                <Input
                  id="infant_count"
                  type="number"
                  min={0}
                  max={remainingSeats}
                  value={infantCount}
                  onChange={(e) => setInfantCount(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              총 {totalPassengers}명 (잔여석: {remainingSeats}석)
            </p>
          </div>

          {/* Pickup Location */}
          <div>
            <Label htmlFor="pickup_location">탑승 장소</Label>
            <Select value={pickupLocation} onValueChange={(v) => setPickupLocation(v ?? "")}>
              <SelectTrigger id="pickup_location" className="mt-1">
                <SelectValue placeholder="탑승 장소를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {tour.pickup_locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">예약자 이름 *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">연락처 *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">이메일 (선택)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="mt-1"
            />
          </div>

          {/* Memo */}
          <div>
            <Label htmlFor="memo">메모 (선택)</Label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="요청사항이 있으시면 입력해주세요"
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "예약 처리 중..." : "예약하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
