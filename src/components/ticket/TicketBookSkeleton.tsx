import ticketbook from "@/assets/images/ticketbook.png";
import TicketCardSkeleton from "./TicketCardSkeleton";

export default function TicketBookSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* 툴바 스켈레톤 */}
      <div className="w-full max-w-[1240px] flex justify-end gap-5">
        <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* 티켓북 배경 래퍼 */}
      <div className="relative w-full px-[55px] py-[49px] max-w-310 h-252.5">
        <img
          src={ticketbook}
          alt="티켓북 배경"
          className="absolute inset-0 w-full h-252.5 object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        />
        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-x-[235px] gap-y-6.5 place-items-center">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="w-[430px]">
                <TicketCardSkeleton side={idx % 2 === 0 ? "left" : "right"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
