import TicketSvg from "@/components/common/icons/TicketSvg";

export default function TicketCardSkeleton({
  side = "left",
}: {
  side?: "left" | "right";
}) {
  return (
    <div className="animate-pulse">
      {/* 이벤트명 스켈레톤 */}
      <div className="w-107.5 h-12.5 mb-2">
        <div className="h-7 w-40 bg-gray-300 rounded" />
      </div>

      {/* 티켓 배경 */}
      <div className="relative w-107.5 h-60 overflow-hidden rounded-lg">
        <TicketSvg
          width={430}
          height={240}
          className="absolute inset-0"
          mainColor="#CBD5DF"
          side={side}
        />

        <div
          className={`absolute inset-0 pt-5 pb-6.5 flex flex-col z-10 ${
            side === "left" ? "pl-33.5 pr-5" : "pl-5 pr-33.5"
          }`}
        >
          {/* 이미지 스켈레톤 */}
          <div className="w-full h-[145px] mb-2 bg-gray-300 rounded" />

          {/* 날짜/장소 스켈레톤 */}
          <div className="pl-1 min-h-10 space-y-1">
            <div className="h-4 w-48 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* 하단 정보 스켈레톤 */}
      <div className="mt-2 min-h-35 space-y-2">
        <div className="h-5 w-24 bg-gray-300 rounded" />
        <div className="h-4 w-36 bg-gray-300 rounded" />
        <div className="h-4 w-28 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-300 rounded" />
      </div>
    </div>
  );
}
