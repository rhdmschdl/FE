import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Banner from "@/components/community/Banner";
import ArchiveList from "@/components/archive/List/ArchiveList";
import Pagination from "@/components/common/Pagination";
import { GetUserArchive } from "@/apis/queries/archive/getArchive";
import { Sort } from "@/enums/sort";

export default function VisitArchivePage() {
  const { userId } = useParams<{ userId: string }>();
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // ✅ 유저별 아카이브 목록 조회
  const {
    data: archivesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userArchives", userId, page, pageSize],
    queryFn: () =>
      GetUserArchive(Number(userId), {
        page: page - 1, // 0-based
        size: pageSize,
        sort: Sort.CREATED_AT,
        direction: "DESC",
      }),
    enabled: !!userId, // userId 있을 때만 호출
  });

  const archives = archivesData?.content ?? [];
  // ✅ 첫 번째 아카이브의 ownerNickname을 사용자 닉네임으로 사용
  const ownerNickname =
    archives.length > 0 ? archives[0].ownerNickname : "사용자";

  return (
    <div className="flex flex-col items-center">
      <Banner />
      <div className="w-310 mx-auto">
        <div className="typo-h1 text-color-highest my-15">
          {ownerNickname} 님의 아카이브
        </div>

        {/* ✅ 로딩 / 에러 / 데이터 없는 경우 처리 */}
        {isLoading ? (
          <div className="w-full h-135 flex items-center justify-center border-2 rounded-lg border-border-low typo-h2 text-color-low">
            아카이브 불러오는 중...
          </div>
        ) : isError ? (
          <div className="w-full h-135 flex items-center justify-center border-2 rounded-lg border-border-low typo-h2 text-color-accent">
            아카이브를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
          </div>
        ) : archives.length === 0 ? (
          <div className="w-full h-135 flex items-center justify-center border-2 rounded-lg border-border-low typo-h2 text-color-low">
            {ownerNickname} 님의 활동 내역이 아직 없습니다.
          </div>
        ) : (
          <>
            {/* 아카이브 리스트 영역 */}
            <div
              role="region"
              aria-label={`${ownerNickname}의 아카이브 리스트`}
              className="overflow-auto mb-25"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <ArchiveList archive={archives} />
            </div>

            {/* ✅ 페이지네이션 */}
            {archivesData?.page.totalElements &&
              archivesData.page.totalElements > pageSize && (
                <div className="flex justify-center mb-25">
                  <Pagination
                    totalItems={archivesData.page.totalElements}
                    pageSize={archivesData.page.size ?? pageSize}
                    currentPage={page}
                    visiblePages={5}
                    onChange={(nextPage) => setPage(nextPage)}
                  />
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}