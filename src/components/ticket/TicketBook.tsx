import { Fragment, useMemo, type Dispatch, type SetStateAction } from "react";
import type { Ticket } from "@/types/ticket";
import TicketCard from "./TicketCard";
import TicketEmptyCard from "./TicketEmptyCard";
import { useNavigate } from "react-router-dom";
import ticketbook from "@/assets/images/ticketbook.png";
import { Pencil, PlusIcon, X } from "lucide-react";
import { BtnIcon } from "@/components/common/Button/Btn";
import TrashIcon from "@/assets/icon/TrashIcon";

type TicketBookProps = {
  archiveId: number;
  tickets: Ticket[];
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  checkedMap: Record<number, boolean>;
  setCheckedMap: Dispatch<SetStateAction<Record<number, boolean>>>;
  onDeleteMany?: (ids: number[]) => void;
  isOwner?: boolean;
};

export default function TicketBook({
  archiveId,
  tickets,
  editMode,
  setEditMode,
  checkedMap,
  setCheckedMap,
  onDeleteMany,
  isOwner = false,
}: TicketBookProps) {
  const navigate = useNavigate();

  const hasTickets = tickets.length > 0;

  const toggleCheck = (id: number, checked: boolean) => {
    setCheckedMap((p) => ({ ...p, [id]: checked }));
  };

  const checkedIds = useMemo(
    () =>
      Object.keys(checkedMap)
        .map(Number)
        .filter((k) => checkedMap[k]),
    [checkedMap]
  );

  const handleDeleteSelected = () => {
    if (checkedIds.length === 0) {
      alert("삭제할 티켓을 선택하세요.");
      return;
    }
    if (!confirm(`${checkedIds.length}개의 티켓을 삭제하시겠어요?`)) return;
    onDeleteMany?.(checkedIds);
    setCheckedMap({});
    setEditMode(false);
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      setCheckedMap({});
    }
  };

  const handleCreateTicket = () => {
    navigate(`/archive/${archiveId}/ticket/create`);
  };

  const handleTicketCardClick = (ticket: Ticket) => {
    if (!isOwner) return;
    if (editMode) {
      toggleCheck(ticket.id, !checkedMap[ticket.id]);
    } else {
      navigate(`/archive/${archiveId}/ticket/${ticket.id}/edit/`);
    }
  };

  const placementIndices = [0, 1, 2, 3];

  // 서버에서 이미 createdAt 기준이지만 안정성을 위해 한 번 더 정렬로 생각하고 납두겠습니다
  const orderedTickets: Ticket[] = (() => {
    if (!tickets || tickets.length === 0) return [];

    const allHaveCreatedAt = tickets.every(
      (t) => (t as any).createdAt !== undefined && (t as any).createdAt !== null
    );

    if (allHaveCreatedAt) {
      return [...tickets].sort((a, b) => {
        const aTime = new Date((a as any).createdAt).getTime();
        const bTime = new Date((b as any).createdAt).getTime();
        return bTime - aTime; // 최신순
      });
    }

    // createdAt이 없으면 배열 자체를 등록순(오래된->최신)라고 가정
    return [...tickets];
  })();

  // orderedTickets를 placementIndices 순서대로 4칸에 배치
  const placed: (Ticket | null)[] = [null, null, null, null];
  for (let i = 0; i < orderedTickets.length && i < 4; i++) {
    const slot = placementIndices[i];
    placed[slot] = orderedTickets[i];
  }

  // helper: 모든 슬롯 비어있는지
  const allEmpty = placed.every((p) => p === null);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* 툴바 - 소유자만 편집 기능 표시 */}
      <div className="w-full max-w-[1240px] flex justify-end gap-5">
        {hasTickets && isOwner && (
          <>
            {!editMode && (
              <BtnIcon
                onClick={handleCreateTicket}
                startIcon={<PlusIcon className="size-6 text-color-high" />}
              >
                티켓 추가
              </BtnIcon>
            )}
            {editMode && (
              <BtnIcon
                onClick={handleDeleteSelected}
                startIcon={<TrashIcon className="w-6 h-6 text-color-high" />}
              >
                삭제하기
              </BtnIcon>
            )}
            <BtnIcon
              onClick={handleToggleEditMode}
              startIcon={
                editMode ? (
                  <X className="w-6 h-6 text-color-high" />
                ) : (
                  <Pencil className="w-[16.5px] h-[17.5px] text-color-high" />
                )
              }
            >
              {editMode ? "취소하기" : "편집하기"}
            </BtnIcon>
          </>
        )}
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
            {placed.map((slotTicket, idx) => {
              const side = idx % 2 === 0 ? "left" : "right";
              if (allEmpty) {
                if (idx === 0 && isOwner) {
                  return (
                    <div key={idx} className="w-[430px]">
                      <TicketEmptyCard onCreate={handleCreateTicket} />
                    </div>
                  );
                }
                return <Fragment key={idx} />;
              }

              if (slotTicket) {
                return (
                  <div key={slotTicket.id} className="w-[430px]">
                    <TicketCard
                      ticket={slotTicket}
                      side={side}
                      onClick={() => handleTicketCardClick(slotTicket)}
                      selectable={editMode}
                      checked={!!checkedMap[slotTicket.id]}
                      onToggleCheck={toggleCheck}
                    />
                  </div>
                );
              }
              return <Fragment key={idx} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
