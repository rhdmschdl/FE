import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TicketBook from "@/components/ticket/TicketBook";
import type { Ticket } from "@/types/ticket";
import Pagination from "@/components/common/Pagination";
import EditableTitle from "@/components/common/EditableTitle";
import { useGetTicketBook } from "@/apis/queries/ticket/useGetTicket";
import { useUpdateTicketBook } from "@/apis/mutations/ticket/usePatchTicket";
import { useDeleteTicket } from "@/apis/mutations/ticket/useDeleteTicket";
import { formatDateTime } from "@/utils/date";
import TicketBookSkeleton from "@/components/ticket/TicketBookSkeleton";
import { useGetArchive } from "@/apis/queries/archive/useGetArchive";

export default function TicketBookPage() {
  const { archiveId: archiveIdParam } = useParams<{ archiveId: string }>();
  const archiveId = Number(archiveIdParam);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination state
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 4;

  // 편집 모드 상태
  const [editMode, setEditMode] = useState(false);
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});

  // 티켓북 제목 상태 (첫 로드 시에만 API에서 가져옴)
  const [ticketbookName, setTicketbookName] = useState<string | null>(null);

  // 아카이브 상세 조회 (소유자 여부 확인용)
  const { data: archive } = useGetArchive({ archiveId });

  // 티켓북 데이터 조회
  const { data, isLoading, isError } = useGetTicketBook({
    archiveId,
    page: page - 1,
    size: pageSize,
  });

  // 티켓북 이름 수정
  const { mutate: updateTicketBookName } = useUpdateTicketBook();

  // 티켓 삭제
  const { mutateAsync: deleteTicketAsync } = useDeleteTicket();

  // 첫 로드 시에만 티켓북 제목 설정
  useEffect(() => {
    if (data?.title && ticketbookName === null) {
      setTicketbookName(data.title);
    }
  }, [data?.title, ticketbookName]);

  // 티켓북 이름 저장
  const handleSaveName = (nextName: string) => {
    setTicketbookName(nextName);
    updateTicketBookName({
      archiveId,
      title: nextName,
    });
  };

  // 티켓 삭제 처리
  const handleDeleteMany = async (ids: number[]) => {
    if (!ids || ids.length === 0) return;

    try {
      await Promise.all(ids.map((ticketId) => deleteTicketAsync({ ticketId })));

      // 삭제 후 현재 페이지가 유효한지 체크
      const currentTotal = data?.page?.totalElements ?? 0;
      const newTotal = currentTotal - ids.length;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
      if (page > newTotalPages) {
        setSearchParams({ page: "1" });
      }
    } catch (error) {
      console.error("티켓 삭제 실패:", error);
    }
  };

  // 페이지 변경 처리
  const handleOnChangePage = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-310">
          <div className="my-15">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mt-5 mb-15">
            <TicketBookSkeleton />
          </div>
          <div className="flex justify-center mb-12">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  if (isError) return <div>에러가 발생했습니다.</div>;

  // 데이터 변환: API 응답 → Ticket 타입
  const tickets: Ticket[] =
    data?.content?.map((item) => ({
      id: item.id,
      archiveId: archiveId,
      eventName: item.title,
      imageUrl: item.thumbnail,
      dateTime: formatDateTime(item.date),
      seat: item.seat,
      place: item.location,
      casting: item.casting,
      rating: item.score,
      review: item.review,
      createdAt: item.createdAt,
    })) ?? [];

  const totalItems = data?.page?.totalElements ?? 0;

  return (
    <div className="flex flex-col items-center">
      <div className="w-310">
        <div className="my-15">
          <EditableTitle
            value={ticketbookName ?? "티켓북"}
            onSave={handleSaveName}
            placeholder="티켓북명을 입력하세요."
            maxLength={50}
            editable={archive?.isOwner ?? false}
          />
        </div>

        <div className="mt-5 mb-15">
          <TicketBook
            key={page}
            archiveId={archiveId}
            tickets={tickets}
            editMode={editMode}
            setEditMode={setEditMode}
            checkedMap={checkedMap}
            setCheckedMap={setCheckedMap}
            onDeleteMany={handleDeleteMany}
            isOwner={archive?.isOwner ?? false}
          />
        </div>
        <div className="flex justify-center mb-12">
          <Pagination
            totalItems={totalItems}
            pageSize={pageSize}
            visiblePages={5}
            currentPage={page}
            onChange={handleOnChangePage}
          />
        </div>
      </div>
    </div>
  );
}
