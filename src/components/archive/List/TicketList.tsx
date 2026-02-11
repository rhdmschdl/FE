import { useNavigate } from "react-router-dom";
import TicketCard from "@/components/common/Card/TicketCard";
import ArchiveTitle from "@/components/archive/ArchiveTitle";
import EmptyList from "@/components/archive/Empty/EmptyList";
import EmptyFeedList from "@/components/feed/EmptyFeedList";
import { useGetTicketBook } from "@/apis/queries/ticket/useGetTicket";

interface TicketListProps {
  archiveId?: string;
  limit?: number;
  isOwner?: boolean;
  emptyDescription?: string;
}

const TicketList = ({
  archiveId,
  limit = 3,
  isOwner = false,
  emptyDescription = "새로운 티켓을 추가해보세요.",
}: TicketListProps) => {
  const navigate = useNavigate();

  const { data } = useGetTicketBook({
    archiveId: Number(archiveId),
    page: 0,
    size: limit,
  });

  const ticketList = data?.content ?? [];
  const hasTickets = ticketList.length > 0;

  const handleNavigateToTicketBook = () => {
    if (!archiveId) return;
    navigate(`/archive/${archiveId}/ticket-book`);
  };

  return (
    <>
      <ArchiveTitle
        title="티켓북"
        onClick={handleNavigateToTicketBook}
        isMore={hasTickets}
      />
      {hasTickets ? (
        <div className="w-full flex flex-col items-start gap-[60px]">
          <div className="flex items-start justify-between gap-[80px]">
            {ticketList.map((ticket) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                title={ticket.title}
                date={ticket.date}
                thumbnail={ticket.thumbnail ?? undefined}
                onClick={handleNavigateToTicketBook}
              />
            ))}
          </div>
        </div>
      ) : isOwner ? (
        <EmptyList
          title="티켓 추가"
          description={emptyDescription}
          onClick={handleNavigateToTicketBook}
        />
      ) : (
        <EmptyFeedList description={emptyDescription} />
      )}
    </>
  );
};

export default TicketList;
