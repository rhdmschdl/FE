import { useMemo, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import EditableTitle from "@/components/common/EditableTitle";
import Tabs from "@/components/repost/Tabs";
import type { TabItem } from "@/components/repost/Tabs";
import LinkAttachBox from "@/components/repost/LinkAttachBox";
import RepostCard from "@/components/common/Card/RepostCard";
import Pagination from "@/components/common/Pagination";
import { BtnIcon } from "@/components/common/Button/Btn";
import CheckboxIcon from "@/assets/icon/CheckboxIcon";
import { Link as LinkIcon, Pencil, X } from "lucide-react";
import TrashIcon from "@/assets/icon/TrashIcon";

import { useGetRepost } from "@/apis/queries/repost/useGetRepost";
import { useCreateRepost } from "@/apis/mutations/repost/useCreateRepost";
import { useCreateRepostTab } from "@/apis/mutations/repost/useCreateRepostTab";
import { useUpdateRepostBookTitle } from "@/apis/mutations/repost/useUpdateRepostBookTitle";
import { useUpdateRepostTabTitle } from "@/apis/mutations/repost/useUpdateRepostTabTItle";
import { useDeleteRepost } from "@/apis/mutations/repost/useDeleteRepost";
import { useDeleteRepostTab } from "@/apis/mutations/repost/useDeleteRepostTab";

type RepostItemLocal = {
  id: string;
  repostId?: number;
  url: string;
  title?: string;
  image?: string | null;
  status?: string;
  createdAt?: string;
};
const MAX_TABS = 10;
const PAGE_SIZE = 9;

export default function RepostingPage() {
  const { archiveId: archiveIdParam } = useParams<{ archiveId: string }>();
  const archiveId = archiveIdParam ?? "";
  const [title, setTitle] = useState<string>(
    "리포스팅 기록 이름 (사용자 지정)"
  );

  // UI 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAttachUnderButton, setShowAttachUnderButton] = useState(false);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [tabPageMap, setTabPageMap] = useState<Record<string, number>>({}); // 1-based

  // 서버 데이터: activeTabId, tabs list, and content
  // 기본 activeTabId는 undefined -> 서버에서 받은 첫 탭 사용
  const [activeTabId, setActiveTabId] = useState<string | number | null>(null);
  const [tabsLocal, setTabsLocal] = useState<
    Array<{ id: number | string; title: string }>
  >([]);

  const [thumbnailLoaded, setThumbnailLoaded] = useState<
    Record<string, boolean>
  >({});

  // React Query 훅들
  // content 조회는 activeTabId + page(0-based)
  const rawPage = tabPageMap[String(activeTabId ?? "")]; // undefined | number | string
  const currentPageNum = Number(rawPage ?? 1);
  const currentPage =
    Number.isFinite(currentPageNum) && currentPageNum > 0 ? currentPageNum : 1;

  // API 호출용 0-based page
  const page0 = Math.max(0, currentPage - 1);

  // activeTabId가 tabsLocal에 존재하는 유효한 값인지 확인
  // 삭제된 탭 ID로 요청하는 것을 방지
  const isActiveTabValid = tabsLocal.some(
    (t) => String(t.id) === String(activeTabId)
  );
  const validTabId =
    activeTabId && isActiveTabValid ? Number(activeTabId) : undefined;

  const {
    data: repostData,
    isLoading,
    isError,
    refetch: refetchRepost,
  } = useGetRepost({
    archiveId,
    page: page0,
    size: PAGE_SIZE,
    sort: "createdAt",
    direction: "DESC",
    tabId: validTabId,
  });

  const createRepost = useCreateRepost();
  const createRepostTab = useCreateRepostTab();
  const updateRepostTabTitle = useUpdateRepostTabTitle();
  const updateRepostBookTitle = useUpdateRepostBookTitle();
  const deleteRepost = useDeleteRepost();
  const deleteRepostTab = useDeleteRepostTab();

  // 서버에서 받은 탭/제목 초기화
  useEffect(() => {
    if (!repostData) return;

    // repostData.tab은 서버에서 내려온 탭 목록(각 tab.id, title, repostBookId 등)
    const tabs = (repostData.tab ?? []).map((t) => ({
      id: t.id,
      title: t.title ?? "무제",
    }));
    setTabsLocal(tabs);

    // 북 제목 동기화(초기)
    if (repostData.title) {
      setTitle(repostData.title);
    }

    // activeTabId 초기화: 유효한 탭인지 확인 후 설정
    const isActiveTabValid = tabs.some(
      (t) => String(t.id) === String(activeTabId)
    );
    if ((!activeTabId || !isActiveTabValid) && tabs.length > 0) {
      setActiveTabId(tabs[0].id);
      setTabPageMap((m) => ({ ...m, [String(tabs[0].id)]: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repostData]);

  // 서버 응답 기반 items 매핑
  const contentItems = useMemo(() => {
    const list = repostData?.content ?? [];
    return list.map((c: any) => {
      const serverId = c.id ?? c.postId;
      const id = String(serverId ?? uuidv4()); // client key
      return {
        id,
        repostId: typeof serverId === "number" ? serverId : undefined,
        url: c.url ?? (c.postId ? String(c.postId) : ""),
        title: c.title ?? undefined,
        image: c.thumbnailUrl ?? null,
        status:
          typeof c.status === "string" ? c.status.toUpperCase() : undefined,
        createdAt: c.createdAt,
      } as RepostItemLocal;
    });
  }, [repostData?.content]);

  // thumbnail preload / readiness 체크
  useEffect(() => {
    const content = repostData?.content;
    if (!content || content.length === 0) return;

    const tryLoadThumbnails = () => {
      content.forEach((item: any) => {
        const serverId = item.id ?? item.postId;
        const id = String(serverId ?? "");
        const thumbnailUrl: string | undefined = item.thumbnailUrl;
        if (!thumbnailUrl) return;
        if (thumbnailLoaded[id]) return;

        const img = new Image();
        img.onload = () => {
          setThumbnailLoaded((prev) => ({ ...prev, [id]: true }));
        };
        img.onerror = () => {};
        img.src = thumbnailUrl;
      });
    };

    tryLoadThumbnails();

    const hasPending = content.some((it: any) => {
      const sid = String(it.id ?? it.postId ?? "");
      return it.thumbnailUrl && !thumbnailLoaded[sid];
    });

    if (hasPending) {
      const timer = window.setInterval(tryLoadThumbnails, 3000);
      return () => clearInterval(timer);
    }
  }, [repostData?.content, thumbnailLoaded]);

  // 서버가 PENDING 상태인 항목이 있으면 리프레시 폴링
  // 폴링은 리소스 문제를 고려해 짧게(3초) 반복
  useEffect(() => {
    const content = repostData?.content;
    if (!content || content.length === 0) return;

    const hasPending = content.some((it: any) => {
      const s = (it.status ?? "").toString().toUpperCase();
      return s === "PENDING" || s === "PROCESSING";
    });

    if (!hasPending) return;

    const id = window.setInterval(() => {
      refetchRepost();
    }, 3000);

    return () => clearInterval(id);
  }, [repostData?.content, refetchRepost]);

  // 첨부(생성) 흐름: mutate 후 바로 refetch 하되, 서버가 PENDING으로 내려올 수 있으므로
  // 폴링 효과로 스켈레톤을 표시하고 갱신되면 썸네일/타이틀 자동 치환
  const handleAttachToTab = async (
    tabIdStr: string,
    payload: { url: string }
  ) => {
    const tabIdNum = Number(tabIdStr);
    try {
      // 서버에 create 요청
      await createRepost.mutateAsync({
        tabId: tabIdNum,
        payload: { url: payload.url },
      });
      // 우선 UI: attach 폴더 닫고 페이지 1로 이동
      setShowAttachUnderButton(false);
      setTabPageMap((m) => ({ ...m, [String(tabIdStr)]: 1 }));
      setCheckedMap({});
      // 바로 서버 재조회: 서버가 PENDING으로 응답하면 폴링이 동작해 완료 시 갱신됨
      await refetchRepost();
    } catch (err) {
      console.error("링크 첨부 실패:", err);
      alert("링크 첨부 중 오류가 발생했습니다.");
    }
  };

  // Helpers
  const tabItemsForTabsComponent: TabItem[] = useMemo(
    () => tabsLocal.map((t) => ({ id: String(t.id), title: t.title })),
    [tabsLocal]
  );

  // 탭 페이지 상태 setter
  const setPageForActiveTab = (p: number) => {
    if (!activeTabId) return;
    setTabPageMap((m) => ({ ...m, [String(activeTabId)]: p }));
  };

  // EditableTitle 저장
  const handleSaveName = async (nextName: string) => {
    setTitle(nextName);
    if (!archiveId) return;
    try {
      await updateRepostBookTitle.mutateAsync({
        repostBookId: archiveId,
        payload: { title: nextName },
      });

      refetchRepost();
    } catch (err) {
      console.error("리포스트북 제목 수정 실패:", err);
    }
  };

  // 탭 추가
  const handleAddTab = async () => {
    if (!archiveId) return;
    if (tabsLocal.length >= MAX_TABS) return;

    // 탭이 없는 경우(모든 탭 삭제 후) activeTabId가 이전 삭제된 탭 ID일 수 있으므로 초기화
    if (tabsLocal.length === 0) {
      setActiveTabId(null);
    }

    try {
      await createRepostTab.mutateAsync({
        archiveId,
        payload: { title: "" },
      });
      // invalidateQueries가 자동으로 호출되어 쿼리 무효화됨
      // useEffect에서 새 탭 목록 받아서 activeTabId 설정됨
    } catch (err) {
      console.error("탭 생성 실패:", err);
    }
  };

  // 탭 삭제 (서버 호출)
  const handleRemoveTab = async (tabIdStr: string) => {
    const tabIdNum = Number(tabIdStr);

    try {
      // 서버 삭제 호출이 필요하면 호출
      await deleteRepostTab.mutateAsync({ tabId: tabIdNum });

      // 로컬 탭 갱신: 삭제된 탭 제거
      setTabsLocal((prev) => {
        const next = prev.filter((t) => String(t.id) !== String(tabIdStr));
        if (next.length === 0) {
          setIsEditMode(false); // 탭 없으면 편집 모드 종료
        }
        return next;
      });

      // 체크박스 초기화
      setCheckedMap({});

      // activeTab 조정: 삭제 후 남은 탭이 있으면 첫 탭으로, 없으면 null로 두기
      setActiveTabId(() => {
        const remaining = tabsLocal.filter(
          (t) => String(t.id) !== String(tabIdStr)
        );
        return remaining.length > 0 ? String(remaining[0].id) : null;
      });

      // activeTabId 상태 변경 시 queryKey가 바뀌어 자동으로 refetch됨
      // refetchRepost()를 직접 호출하면 이전 tabId로 요청되어 404 발생
    } catch (err) {
      console.error("탭 삭제 실패:", err);
      alert("탭 삭제 중 오류가 발생했습니다.");
    }
  };

  // 탭 이름 변경 -> 서버 호출
  const handleRenameTab = async (idStr: string, nextTitle: string) => {
    const id = Number(idStr);
    const prevTitle =
      tabsLocal.find((t) => String(t.id) === String(id))?.title ?? "";

    // 1) 클라이언트 사전 검증: 빈문자열이면 서버 호출 없이 경고 후 롤백
    if (!nextTitle || nextTitle.trim() === "") {
      window.alert("탭 제목은 필수입니다.");
      // 로컬 UI가 이미 편집용으로 바뀌어 있다면 이전 제목으로 복원
      setTabsLocal((p) =>
        p.map((t) =>
          String(t.id) === String(id) ? { ...t, title: prevTitle } : t
        )
      );
      return;
    }

    setTabsLocal((p) =>
      p.map((t) =>
        String(t.id) === String(idStr) ? { ...t, title: nextTitle } : t
      )
    );
    try {
      await updateRepostTabTitle.mutateAsync({
        tabId: id,
        payload: { title: nextTitle },
      });
      await refetchRepost();
    } catch (err) {
      console.error("탭 제목 수정 실패:", err);
    }
  };

  // 카드 클릭: 편집모드면 체크, 아니면 새 창 열기
  const handleCardClick = (item: RepostItemLocal) => {
    if (isEditMode) return;
    window.open(item.url, "_blank");
  };

  // 게시물 체크 토글
  const toggleCheck = (id: string, checked: boolean) => {
    setCheckedMap((p) => ({ ...p, [id]: checked }));
  };

  // 선택된 게시물 삭제
  const handleDeleteSelectedPosts = async () => {
    const checkedIds = Object.keys(checkedMap).filter((k) => checkedMap[k]);
    if (checkedIds.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }
    if (!confirm(`${checkedIds.length}개의 게시물을 삭제하시겠어요?`)) return;

    try {
      // 1) 삭제 처리 (병렬 또는 순차)
      for (const id of checkedIds) {
        const rid = Number(id);
        await deleteRepost.mutateAsync({ repostId: rid });
      }

      // 2) 내부 상태 초기화
      setCheckedMap({});
      setIsEditMode(false);

      // 3) 페이지 유효성 검사 및 보정

      const serverTotal = Number(repostData?.page?.totalElements ?? 0);

      const predictedTotal =
        serverTotal > 0
          ? Math.max(0, serverTotal - checkedIds.length)
          : undefined;

      // 현재 페이지(1-based)
      const rawPage = tabPageMap[String(activeTabId ?? "")];
      const currentPageNum = Number(rawPage ?? 1);
      const currentPageSafe =
        Number.isFinite(currentPageNum) && currentPageNum > 0
          ? currentPageNum
          : 1;

      // pageSize
      const newTotal =
        typeof predictedTotal === "number" ? predictedTotal : undefined;
      if (typeof newTotal === "number") {
        const newTotalPages = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
        // 현재 페이지가 더 크면 1로 보정
        if (currentPageSafe > newTotalPages) {
          setTabPageMap((m) => ({ ...m, [String(activeTabId)]: 1 }));
        }
      } else {
        // serverTotal을 알 수 없으면 안전하게 현재 탭을 1로 내리고 refetch
        setTabPageMap((m) => ({ ...m, [String(activeTabId)]: 1 }));
      }

      // 4) 서버에서 재조회 (보정 후)
      await refetchRepost();
    } catch (err) {
      console.error("게시물 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const totalItems = Number(repostData?.page?.totalElements ?? 0);
  const pagedItems = contentItems;

  // UI 로딩/에러 처리
  if (isLoading) {
    return <div className="p-8">로딩 중...</div>;
  }
  if (isError) {
    return <div className="p-8">데이터 로드 중 오류가 발생했습니다.</div>;
  }

  // 렌더
  return (
    <div className="flex flex-col items-center">
      <div className="w-310 mx-auto">
        <div className="my-15">
          <EditableTitle
            value={title}
            onSave={handleSaveName}
            placeholder="리포스팅 기록명을 입력하세요."
            maxLength={50}
          />
        </div>

        {/* 탭 툴바 */}
        <div className="relative">
          <div className="flex justify-end gap-5">
            {tabsLocal.length > 0 && !isEditMode && (
              <>
                <BtnIcon
                  onClick={() => {
                    setShowAttachUnderButton((s) => !s);
                  }}
                  startIcon={<LinkIcon className="size-6 text-color-high" />}
                >
                  링크 첨부
                </BtnIcon>

                <BtnIcon
                  onClick={() => setIsEditMode((s) => !s)}
                  startIcon={
                    <Pencil className="w-[16.5px] h-[17.5px] text-color-high" />
                  }
                >
                  편집하기
                </BtnIcon>
              </>
            )}

            {isEditMode && (
              <>
                <BtnIcon
                  onClick={handleDeleteSelectedPosts}
                  startIcon={<TrashIcon className="w-6 h-6 text-color-high" />}
                >
                  삭제하기
                </BtnIcon>
                <BtnIcon
                  onClick={() => setIsEditMode(false)}
                  startIcon={<X className="w-6 h-6 text-color-high" />}
                >
                  취소하기
                </BtnIcon>
              </>
            )}
          </div>

          {/* 링크첨부 박스 */}
          {showAttachUnderButton &&
            !isEditMode &&
            activeTabId &&
            tabsLocal.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 24px)",
                  right: 0,
                  zIndex: 9999,
                }}
              >
                <LinkAttachBox
                  initial=""
                  onAttach={(payload) =>
                    handleAttachToTab(String(activeTabId), payload)
                  }
                  onCancel={() => setShowAttachUnderButton(false)}
                  autoFocus
                />
              </div>
            )}
        </div>

        {/* Tabs */}
        <div className="mt-15">
          <Tabs
            items={tabItemsForTabsComponent}
            value={activeTabId ? String(activeTabId) : ""}
            onChange={(id) => {
              setActiveTabId(id);
              setTabPageMap((m) => ({ ...m, [id]: m[id] ?? 1 }));
              setIsEditMode(false);
              setShowAttachUnderButton(false);
              setCheckedMap({});
            }}
            onAdd={handleAddTab}
            onRemove={(id) => handleRemoveTab(id)}
            onRename={(id, nextTitle) => handleRenameTab(id, nextTitle)}
            maxTabs={MAX_TABS}
            showRemoveButtons={isEditMode}
            tabWidth={130}
            tabHeight={70}
            overlapOffset={16}
          />
        </div>

        {/* 탭 콘텐츠 영역 */}
        <div>
          {tabsLocal.length === 0 ? (
            // 탭이 아예 없는 초기 상태
            <div className="bg-surface-container-10 px-10 py-15 h-175 mb-15 flex flex-col items-center justify-center">
              <p className="text-color-mid mb-20">
                탭을 추가하여 리포스팅 기록을 관리해보세요.
              </p>
            </div>
          ) : pagedItems.length === 0 ? (
            // 기존 빈 탭일 때 LinkAttachBox 노출
            <div className="bg-surface-container-10 px-10 py-15 h-175 mb-15">
              <LinkAttachBox
                onAttach={(payload) =>
                  activeTabId && handleAttachToTab(String(activeTabId), payload)
                }
                onCancel={() => {}}
                autoFocus
              />
            </div>
          ) : (
            <div className="bg-surface-container-10 px-10 py-15 min-h-285 mb-15">
              <div className="grid grid-cols-3 gap-x-10 gap-y-15">
                {pagedItems.map((it) => {
                  const checked = !!checkedMap[it.id];
                  const status = (it.status ?? "").toString().toUpperCase();
                  const isPending = status === "PENDING";
                  const imgForCard =
                    it.image && thumbnailLoaded[it.id] ? it.image : undefined;
                  return (
                    <div key={it.id} className="relative">
                      <RepostCard
                        id={it.repostId ? Number(it.repostId) : 0}
                        archiveId={Number(archiveId) || 0}
                        tabId={activeTabId ? Number(activeTabId) : undefined}
                        title={isPending ? undefined : it.title}
                        image={isPending ? undefined : imgForCard}
                        isLoading={isPending}
                        onClick={() => handleCardClick(it)}
                      />

                      {/* 편집모드일 때 카드 좌상단 체크박스 표시 */}
                      {isEditMode && (
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCheck(it.id, !checked);
                          }}
                          className="absolute left-6 top-6"
                        >
                          <CheckboxIcon checked={checked} size={24} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 페이지네이션: 탭별 페이지네이션 */}
        {totalItems > 0 && (
          <div className="flex justify-center mb-14">
            <Pagination
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              visiblePages={5}
              currentPage={currentPage}
              onChange={(p) => setPageForActiveTab(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
