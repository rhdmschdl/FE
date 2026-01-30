import TicketForm from "@/components/ticket/TicketForm";
import { useNavigate, useParams } from "react-router-dom";
import type { Ticket } from "@/types/ticket";
import { useAddTicket } from "@/apis/mutations/ticket/usePostTicket";
import { useGetArchive } from "@/apis/queries/archive/useGetArchive";

export default function CreateTicketPage() {
  const { archiveId } = useParams<{ archiveId: string }>();
  const navigate = useNavigate();
  const { mutate: addTicket } = useAddTicket();

  // 아카이브 상세 조회 (소유자 여부 확인용)
  const { data: archive, isLoading } = useGetArchive({
    archiveId: Number(archiveId),
  });

  // 소유자가 아니면 접근 차단
  if (isLoading) {
    return <div className="p-10">로딩 중...</div>;
  }

  if (!archive?.isOwner) {
    return (
      <div className="p-10 text-center">
        <p className="typo-body1 text-color-high">권한이 없습니다.</p>
      </div>
    );
  }

  const handleSave = (payload: Ticket) => {
    addTicket(
      {
        archiveId: Number(archiveId),
        title: payload.eventName,
        date: payload.dateTime || null,
        location: payload.place || null,
        seat: payload.seat || null,
        casting: payload.casting || null,
        score: payload.rating,
        review: payload.review || null,
        fileId: payload.fileId,
      },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  return (
    <div className="p-10">
      <TicketForm
        onSave={handleSave}
        onCancel={() => navigate(-1)}
        submitLabel="등록"
      />
    </div>
  );
}
