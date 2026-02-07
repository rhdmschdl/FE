import BackNavigator from "@/components/common/BackNavigator";

const CommunityDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-10">
      <BackNavigator label="커뮤니티 보기" onClick={() => history.back()} />

      <div className="flex justify-center">
        <div className="max-w-310 flex flex-col animate-pulse">
          {/* 타이틀 스켈레톤 */}
          <div className="flex justify-center mb-10">
            <div className="h-10 w-200 bg-gray-300 rounded" />
          </div>

          {/* 미디어 캐러셀 스켈레톤 - cardWidth: 360px, height: 180px, gap: 20px */}
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-90 h-45 bg-gray-300 rounded-lg shrink-0"
              />
            ))}
          </div>

          {/* 본문 스켈레톤 */}
          <div className="mt-5 space-y-3">
            <div className="h-5 w-full bg-gray-300 rounded" />
            <div className="h-5 w-full bg-gray-300 rounded" />
            <div className="h-5 w-3/4 bg-gray-300 rounded" />
          </div>

          {/* 좋아요 & 댓글 토글 버튼 스켈레톤 */}
          <div className="flex items-center justify-between w-310 mt-10 mb-5">
            <div className="h-11 w-24 bg-gray-300 rounded-lg" />
            <div className="h-11 w-45 bg-gray-300 rounded-lg" />
          </div>

          {/* 댓글 목록 스켈레톤 */}
          <div className="mb-5 bg-surface-container-10 w-full flex justify-center items-center h-26 rounded-lg">
            <div className="h-6 w-48 bg-gray-300 rounded" />
          </div>

          {/* 댓글 입력란 스켈레톤 */}
          <div className="flex flex-col gap-2.5 bg-brand-blue-100 rounded-lg p-5 mb-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
            <div className="h-24 w-full bg-gray-300 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailSkeleton;
