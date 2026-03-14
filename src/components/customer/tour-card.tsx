"use client";

import Link from "next/link";
import { Tour } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TourCardProps {
  tour: Tour;
  remainingSeats: number;
}

export function TourCard({ tour, remainingSeats }: TourCardProps) {
  const isClosed = tour.status === "closed" || remainingSeats <= 0;

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{tour.title}</CardTitle>
          <Badge variant={isClosed ? "secondary" : "default"}>
            {isClosed ? "마감" : "예약 가능"}
          </Badge>
        </div>
        <CardDescription>{formatDate(tour.date)}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">출발:</span>
          <span>{formatTime(tour.departure_time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">경로:</span>
          <span className="line-clamp-1">{tour.route}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">요금:</span>
          <span>{tour.price_info}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">잔여석:</span>
          <span
            className={
              remainingSeats <= 5 ? "font-semibold text-red-500" : ""
            }
          >
            {remainingSeats > 0 ? `${remainingSeats}석` : "마감"}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        {isClosed ? (
          <Button className="w-full" disabled>
            예약 마감
          </Button>
        ) : (
          <Link href={`/tours/${tour.id}`}>
            <Button className="w-full">예약하기</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
