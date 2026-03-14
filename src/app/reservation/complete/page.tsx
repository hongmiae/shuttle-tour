import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ number?: string }>;
}

export default async function ReservationCompletePage({
  searchParams,
}: PageProps) {
  const { number: reservationNumber } = await searchParams;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          예약이 완료되었습니다
        </h1>
        <p className="mb-6 text-gray-500">
          셔틀 투어 예약이 성공적으로 접수되었습니다.
        </p>

        {reservationNumber && (
          <div className="mb-8 rounded-lg border bg-gray-50 p-6">
            <p className="text-sm font-medium text-gray-500">예약 번호</p>
            <p className="mt-1 text-2xl font-bold tracking-wide text-blue-600">
              {reservationNumber}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              예약 번호를 메모해 주세요
            </p>
          </div>
        )}

        <Link href="/">
          <Button size="lg">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}
