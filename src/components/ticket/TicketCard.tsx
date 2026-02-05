import ImgCard from "../common/Card/ImgCard";
import { twMerge } from "tailwind-merge";
import type { Ticket } from "@/types/ticket";
import TicketSvg from "@/components/common/icons/TicketSvg";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";
import ticketThumbnail from "@/assets/images/ticketThumbnail.png";
import Rating from "./Rating";
import { MediaType } from "@/enums/mediaType";

type Side = "left" | "right";

export default function TicketCard({
  ticket,
  side = "left",
  onClick,
  selectable = false,
  checked = false,
  // onDelete,
  onToggleCheck,
}: {
  ticket: Ticket;
  side?: Side;
  onClick: () => void;
  selectable?: boolean;
  checked?: boolean;
  onToggleCheck?: (id: number, checked: boolean) => void;
  onDelete?: (id: number) => void;
}) {
  const {
    id,
    imageUrl,
    isRepresentative,
    eventName,
    dateTime,
    place,
    seat,
    casting,
    rating,
    review,
  } = ticket;

  return (
    <div>
      {/* 이벤트명 (항상 표시) */}
      <div className="w-107.5 h-12.5 mb-2 font-hakgyoansim-b text-2xl text-color-highest">
        {eventName}
      </div>

      {/* 티켓 배경(좌/우 다르게)*/}
      <div
        role="group"
        onClick={() => onClick()}
        className="relative w-107.5 h-60 overflow-hidden rounded-lg"
      >
        {/* 티켓 SVG 배경 */}
        <TicketSvg
          width={430}
          height={240}
          className="absolute inset-0"
          mainColor={checked ? "#A2AAB2" : "#CBD5DF"}
          side={side}
        />
        {/* 편집 체크박스 */}
        {selectable && (
          <button
            type="button"
            role="checkbox"
            aria-checked={!!checked}
            aria-label={`티켓 선택 ${eventName}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCheck?.(id, !checked);
            }}
            className={twMerge(
              "absolute top-7 z-30 inline-flex items-center justify-center w-6 h-6 p-0 rounded focus:outline-none",

              side === "left" ? "right-7" : "left-7"
            )}
          >
            <CheckboxIcon checked={!!checked} size={20} />
          </button>
        )}

        <div
          className={twMerge(
            "absolute inset-0 pt-5 pb-6.5 flex flex-col z-10",
            side === "left" ? "pl-33.5 pr-5" : "pl-5 pr-33.5"
          )}
        >
          <div className="w-full h-[145px] mb-2">
            <ImgCard
              onClick={() => {}}
              img={imageUrl ?? ticketThumbnail}
              mediaType={MediaType.IMAGE}
              type={isRepresentative ? "representative" : "normal"}
              readOnly={true}
              className="w-full h-full"
            />
          </div>

          <div className="pl-1 font-hakgyoansim-l text-[16px] text-color-highest min-h-10">
            {dateTime ? (
              <div>날짜 및 시간 : {dateTime}</div>
            ) : (
              <div className="hidden"></div>
            )}
            {place ? <div>장소 : {place}</div> : <div className="hidden"></div>}
          </div>
        </div>
      </div>
      <div className="mt-2 font-hakgyoansim-l text-[16px] text-color-highest min-h-35">
        {rating != null ? (
          <Rating value={rating} readOnly size={20} className="mb-2" />
        ) : (
          <div className="hidden">평점</div>
        )}

        {seat ? (
          <div>좌석 위치 : {seat}</div>
        ) : (
          <div className="hidden">좌석 자리</div>
        )}

        {casting ? (
          <div>캐스팅 : {casting}</div>
        ) : (
          <div className="hidden">캐스팅 자리</div>
        )}
        {review ? (
          <div className="leading-5">관람 후기 : {review}</div>
        ) : (
          <div className="hidden">관람 후기</div>
        )}
      </div>
    </div>
  );
}
