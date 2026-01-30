// ... 기존 import
import { useMemo } from "react";
import TrashIcon from "@/assets/icon/TrashIcon";
import ArchiveList from "@/components/archive/List/ArchiveList";
import EmptyArchive from "@/components/archive/Empty/EmptyArchive";
import { BtnIcon } from "@/components/common/Button/Btn";
import Banner from "@/components/community/Banner";
import { Pencil, Plus, SquareX } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetUserArchive } from "@/apis/queries/archive/getArchive";
import Pagination from "@/components/common/Pagination";
import { CreateArchive, DeleteArchive } from "@/apis/mutations/archive/archive";
import { Visibility } from "@/types/archive";
import { useNavigate } from "react-router-dom";
import { Sort } from "@/enums/sort";
import ConfirmModal from "@/components/common/ConfirmModal";


const Archive = () => {
  // 현재 로그인한 사용자 정보
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  // 삭제 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);  // ✅ 추가

  // ✅ 페이지 상태 (1부터 시작)
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const navigate = useNavigate();

  // 실제 API로 아카이브 목록 조회
  const {
    data: archivesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["archives", user?.id, page, pageSize],
    queryFn: () =>
      GetUserArchive(Number(user?.id), {
        page: page - 1,
        size: pageSize,
        sort: Sort.CREATED_AT,
        direction: "DESC",
      }),

  });

  const createArchiveMutation = useMutation({
    mutationFn: CreateArchive,
    onSuccess: () => {
      console.log("createArchive success");
    },
    onError: (error) => {
      console.log("createArchive error", error);
    },
  });

  // ✅ 여러 개 아카이브 삭제 mutation
  const deleteArchivesMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => DeleteArchive(Number(id))));
    },
    onSuccess: () => {
      // 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["archives"], exact: false });
      // 선택/편집 상태 초기화
      setCheckedMap({});
      setIsEditMode(false);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error("아카이브 삭제 실패:", error);
      alert("아카이브 삭제에 실패했습니다. 다시 시도해주세요.");
      setIsDeleteModalOpen(false);
    },
  });

  // ✅ 서버에서 받아온 실제 아카이브 리스트
  const archives = archivesData?.content ?? [];

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const handleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next) setCheckedMap({});
      return next;
    });
  };

  const toggleCheck = (id: string, checked: boolean) => {
    setCheckedMap((prev) => {
      const next = { ...prev };
      if (checked) next[id] = true;
      else delete next[id];
      return next;
    });
  };

  const checkedIds = useMemo(
    () => Object.keys(checkedMap).filter((k) => checkedMap[k]),
    [checkedMap]
  );

  // ✅ 삭제 버튼 클릭 시: 모달만 오픈
  const handleDeleteSelected = () => {
    if (checkedIds.length === 0) {
      alert("삭제할 아카이브를 선택하세요.");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  // ✅ 모달에서 확인 눌렀을 때 실제 삭제 실행
  const handleConfirmDelete = () => {
    deleteArchivesMutation.mutate(checkedIds);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Banner />
      <div className="w-310 h-10 my-15">
        <p className="typo-h1 text-color-highest">마이 아카이브</p>
      </div>
      <div className="max-w-[1920px] mx-auto mb-40">
        {/* ✅ 로딩 / 에러 / 데이터 없는 경우 처리 */}
        {isLoading ? (
          <p className="typo-h2 text-color-mid">아카이브 불러오는 중...</p>
        ) : isError ? (
          <p className="typo-h2 text-color-accent">
            아카이브를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
          </p>
        ) : archives.length > 0 ? (
          <div className="flex flex-col gap-10">
            {isEditMode ? (
              <div className="flex items-center justify-end gap-5">
                <BtnIcon
                  startIcon={<TrashIcon className="w-6 h-6 text-color-high" />}
                  onClick={handleDeleteSelected}
                >
                  삭제하기
                </BtnIcon>
                <BtnIcon
                  startIcon={<SquareX className="w-6 h-6 text-color-high" />}
                  onClick={() => {
                    setIsEditMode(false);
                    setCheckedMap({});
                  }}
                >
                  취소하기
                </BtnIcon>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-5">
                <BtnIcon
                  startIcon={<Plus className="w-6 h-6 text-color-high" />}
                  onClick={() => {
                    createArchiveMutation.mutate({
                      title: "아카이브명",
                      visibility: Visibility.PUBLIC,
                      bannerImageId: null,
                    }, {
                      onSuccess: (data) => {
                        console.log("createArchive success", data);
                        navigate('/archive/' + data.id);
                      },
                    });
                  }}
                >
                  덕카이브
                </BtnIcon>
                <BtnIcon
                  startIcon={<Pencil className="w-6 h-6 text-color-high" />}
                  onClick={handleEditMode}
                >
                  편집하기
                </BtnIcon>
              </div>
            )}

            {/* ✅ 실제 API 응답으로 리스트 렌더링 */}
            <ArchiveList
              archive={archives}
              isEditMode={isEditMode}
              checkedMap={checkedMap}
              onToggleCheck={toggleCheck}
            />

            <div className="flex justify-center mt-12">
              {/* ✅ 페이지네이션 */}
              <Pagination
                totalItems={archivesData?.page.totalElements ?? 0}
                pageSize={archivesData?.page.size ?? pageSize}
                currentPage={page}                 // ✅ 1-based
                visiblePages={5}
                onChange={(nextPage) => {
                  setPage(nextPage);              // ✅ 클릭 시 페이지 변경 → useQuery 재요청
                }}
              />
            </div>
          </div>
        ) : (
          <EmptyArchive />
        )}
      </div>
      {/* ✅ 여러 개 삭제용 ConfirmModal */}
      <ConfirmModal
        trigger={<></>}                         // 외부 버튼에서 열기 때문에 비워둠
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={`${checkedIds.length}개의 아카이브를 삭제하시겠어요?`}
        description="아카이브와 내부에 포함된 모든 데이터가 영구 삭제됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmVariant="blue"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Archive;