import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
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

type RepostItem = {
  id: string;
  url: string;
  title?: string;
  image?: string | null;
  createdAt?: string;
};

type TabWithItems = {
  id: string;
  title: string;
  items: RepostItem[];
};

const MAX_TABS = 10;
const PAGE_SIZE = 9;

export default function RepostingPage() {
  const [title, setTitle] = useState<string>(
    "리포스팅 기록 이름 (사용자 지정)"
  );

  // 샘플 탭 + 샘플 게시물 (UI 테스트용)
  const initialTabs: TabWithItems[] = [
    {
      id: uuidv4(),
      title: "기본탭",
      items: [], // 비어있음(초기 빈 상태 확인)
    },
    {
      id: uuidv4(),
      title: "샘플탭",
      items: Array.from({ length: 11 }).map((_, i) => ({
        id: uuidv4(),
        url: `https://example.com/post/${i + 1}`,
        title: `샘플 제목 ${i + 1}`,
        image: null,
        createdAt: dayjs().subtract(i, "day").toISOString(),
      })),
    },
  ];

  const [tabs, setTabs] = useState<TabWithItems[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(initialTabs[0].id);

  // UI 상태
  const [isEditMode, setIsEditMode] = useState(false); // 편집모드 토글 (편집하기/취소)
  const [showAttachUnderButton, setShowAttachUnderButton] = useState(false); // 링크첨부 버튼 밑 박스 표시
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({}); // 게시물 체크
  const [tabPageMap, setTabPageMap] = useState<Record<string, number>>({}); // 탭별 페이지 상태 (1-based)

  const handleSaveName = (nextName: string) => {
    setTitle(nextName);
    // TODO: API 연동 시 서버에 리포스팅 기록명 저장
  };

  // Helpers
  const tabItemsForTabsComponent: TabItem[] = useMemo(
    () => tabs.map((t) => ({ id: t.id, title: t.title })),
    [tabs]
  );

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

  // 탭 추가 (항상 오른쪽 끝)
  const handleAddTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const id = uuidv4();
    const newTab: TabWithItems = { id, title: "", items: [] };
    setTabs((p) => [...p, newTab]);
    setActiveTabId(id);
  };

  // 탭 삭제: 탭 컨텐츠(아이템)도 같이 삭제됨
  const handleRemoveTab = (tabId: string) => {
    // 최소 1개 보장: 삭제 시 남은 탭이 없으면 기본 탭 생성
    const next = tabs.filter((t) => t.id !== tabId);
    if (next.length === 0) {
      const id = uuidv4();
      setTabs([{ id, title: "기본탭", items: [] }]);
      setActiveTabId(id);
    } else {
      setTabs(next);
      if (activeTabId === tabId) {
        setActiveTabId(next[0].id);
      }
    }
    // 선택 초기화
    setCheckedMap({});
  };

  // 탭 이름 변경
  const handleRenameTab = (id: string, nextTitle: string) => {
    setTabs((p) =>
      p.map((t) => (t.id === id ? { ...t, title: nextTitle } : t))
    );
  };

  // 링크 첨부: 현재는 로컬에 item 추가 (서버 연동 시 API 호출)
  // LinkAttachBox의 onAttach이 호출되면 이 함수로 처리
  const handleAttachToTab = (tabId: string, payload: { url: string }) => {
    const newItem: RepostItem = {
      id: uuidv4(),
      url: payload.url,
      title: undefined,
      image: null,
      createdAt: dayjs().toISOString(),
    };
    setTabs((prev) =>
      prev.map((t) =>
        t.id === tabId ? { ...t, items: [newItem, ...t.items] } : t
      )
    );
    // 첨부 후 박스 숨김
    setShowAttachUnderButton(false);
    // 탭 페이지를 1로 이동시키면 추가한 게시물이 보임
    setTabPageMap((m) => ({ ...m, [tabId]: 1 }));
  };

  // 편집모드 토글
  const toggleEditMode = () => {
    setIsEditMode((s) => {
      if (s) {
        setCheckedMap({});
      }
      return !s;
    });
    setShowAttachUnderButton(false);
  };

  // 게시물 체크 토글
  const toggleCheck = (id: string, checked: boolean) => {
    setCheckedMap((p) => ({ ...p, [id]: checked }));
  };

  // 선택된 게시물 삭제 (현재 탭에서만 삭제)
  const handleDeleteSelectedPosts = () => {
    const checkedIds = Object.keys(checkedMap).filter((k) => checkedMap[k]);
    if (checkedIds.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }
    if (!confirm(`${checkedIds.length}개의 게시물을 삭제하시겠어요?`)) return;
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, items: t.items.filter((it) => !checkedIds.includes(it.id)) }
          : t
      )
    );
    setCheckedMap({});
    setIsEditMode(false);
  };

  // 개별 카드 클릭(편집모드면 체크만, 아니면 링크 오픈)
  const handleCardClick = (item: RepostItem) => {
    if (isEditMode) return;
    window.open(item.url, "_blank");
  };

  // 페이지네이션 처리 (각 탭 별도 페이지)
  const currentPage = tabPageMap[activeTabId] ?? 1;
  const setPageForActiveTab = (p: number) => {
    setTabPageMap((m) => ({ ...m, [activeTabId]: p }));
  };

  const pagedItems = useMemo(() => {
    const items = activeTab?.items ?? [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [activeTab, currentPage]);

  // 탭 삭제 버튼을 표시할지 (편집모드일 때만 표시)
  const showRemoveButtons = isEditMode && tabs.length > 1;

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
            {!isEditMode && (
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
                  onClick={() => toggleEditMode()}
                  startIcon={
                    <Pencil className="w-[16.5px] h-[17.5px] text-color-high" />
                  }
                >
                  편집하기
                </BtnIcon>
              </>
            )}

            {/* 편집 모드 버튼들 */}
            {isEditMode && (
              <>
                <BtnIcon
                  onClick={handleDeleteSelectedPosts}
                  startIcon={<TrashIcon className="w-6 h-6 text-color-high" />}
                >
                  삭제하기
                </BtnIcon>
                <BtnIcon
                  onClick={() => toggleEditMode()}
                  startIcon={<X className="w-6 h-6 text-color-high" />}
                >
                  취소하기
                </BtnIcon>
              </>
            )}
          </div>

          {/* 링크첨부 박스 */}
          {showAttachUnderButton && !isEditMode && (
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
                onAttach={(payload) => handleAttachToTab(activeTabId, payload)}
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
            value={activeTabId}
            onChange={(id) => {
              setActiveTabId(id);
              // 탭 전환 시 페이지 초기화
              setTabPageMap((m) => ({ ...m, [id]: m[id] ?? 1 }));
              // 탭 전환시 편집모드/박스 닫기
              setIsEditMode(false);
              setShowAttachUnderButton(false);
              setCheckedMap({});
            }}
            onAdd={handleAddTab}
            onRemove={handleRemoveTab}
            onRename={handleRenameTab}
            maxTabs={MAX_TABS}
            showRemoveButtons={showRemoveButtons}
            tabWidth={130}
            tabHeight={70}
            overlapOffset={16}
          />
        </div>

        {/* 탭 콘텐츠 영역 */}
        <div>
          {activeTab.items.length === 0 ? (
            <div className="bg-surface-container-10 px-10 py-15 h-175 mb-15">
              <LinkAttachBox
                onAttach={(payload) => handleAttachToTab(activeTabId, payload)}
                onCancel={() => {}}
                autoFocus
              />
            </div>
          ) : (
            /* 등록된 게시물이 있을 때 */
            <div className="bg-surface-container-10 px-10 py-15 min-h-285 mb-15">
              <div className="grid grid-cols-3 gap-x-10 gap-y-15">
                {pagedItems.map((it) => {
                  const checked = !!checkedMap[it.id];
                  return (
                    <div key={it.id} className="relative">
                      <RepostCard
                        id={0}
                        archiveId={0}
                        tabId={activeTabId ? undefined : undefined}
                        title={it.title}
                        image={it.image ?? undefined}
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
        {activeTab.items.length !== 0 && (
          <div className="flex justify-center mb-14">
            <Pagination
              totalItems={activeTab.items.length}
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
