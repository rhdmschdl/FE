import TicketForm from "@/components/ticket/TicketForm";
import TicketFormSkeleton from "@/components/ticket/TicketFormSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import type { Ticket, UpdateTicketRequest } from "@/types/ticket";
import { useGetTicket } from "@/apis/queries/ticket/useGetTicket";
import { useUpdateTicket } from "@/apis/mutations/ticket/usePatchTicket";
import { useGetArchive } from "@/apis/queries/archive/useGetArchive";

export default function EditTicketPage() {
  const { archiveId, ticketId } = useParams<{ archiveId: string; ticketId: string }>();
  const navigate = useNavigate();

  // 아카이브 상세 조회 (소유자 여부 확인용)
  const { data: archive, isLoading: isArchiveLoading } = useGetArchive({
    archiveId: Number(archiveId),
  });

  const {
    data: ticketData,
    isLoading,
    isError,
  } = useGetTicket({
    ticketId: Number(ticketId),
  });

  const { mutate: updateTicket } = useUpdateTicket();

  const initial: Ticket | undefined = ticketData
    ? {
        id: ticketData.id,
        eventName: ticketData.title,
        dateTime: ticketData.date,
        place: ticketData.location,
        seat: ticketData.seat,
        casting: ticketData.casting,
        rating: ticketData.score,
        review: ticketData.review,
        imageUrl: ticketData.file?.cdnUrl,
        fileId: ticketData.file?.fileId,
      }
    : undefined;

  if (isLoading || isArchiveLoading) {
    return (
      <div className="p-8">
        <TicketFormSkeleton />
      </div>
    );
  }

  // 소유자가 아니면 접근 차단
  if (!archive?.isOwner) {
    return (
      <div className="p-8 text-center">
        <p className="typo-body1 text-color-high">권한이 없습니다.</p>
      </div>
    );
  }

  if (isError || !initial) {
    return <div>해당 티켓을 찾을 수 없거나 오류가 발생했습니다.</div>;
  }

  const handleSave = (payload: Ticket) => {
    const requestData: UpdateTicketRequest = {
      ticketId: payload.id,
      title: payload.eventName,
      date: payload.dateTime || null,
      location: payload.place || null,
      seat: payload.seat || null,
      casting: payload.casting || null,
      score: payload.rating,
      review: payload.review || null,
      fileId: payload.fileId,
      deleteFile: payload.fileId === null ? true : false,
    };
    updateTicket(requestData, {
      onSuccess: () => {
        navigate(-1);
      },
      onError: () => {
        alert("티켓 수정에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  return (
    <div className="p-8">
      <TicketForm
        initial={initial}
        onSave={handleSave}
        onCancel={() => navigate(-1)}
        submitLabel="수정"
      />
    </div>
  );
}
