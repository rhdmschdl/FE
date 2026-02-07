const TAB_WIDTH = 130;
const TAB_HEIGHT = 70;
const OVERLAP_OFFSET = 16;

const RepostingPageSkeleton = () => {
  const tabCount = 3;

  return (
    <div className="flex flex-col items-center">
      <div className="w-310 mx-auto">
        {/* 제목 스켈레톤 */}
        <div className="my-15 animate-pulse">
          <div className="h-10 w-200 bg-gray-300 rounded" />
        </div>

        {/* 버튼 영역 스켈레톤 */}
        <div className="flex justify-end gap-5 animate-pulse">
          <div className="h-11 w-25 bg-gray-200 rounded-lg" />
          <div className="h-11 w-25 bg-gray-200 rounded-lg" />
        </div>

        {/* 탭 영역 스켈레톤 */}
        <div className="mt-15 animate-pulse">
          <div className="relative" style={{ height: TAB_HEIGHT }}>
            {Array.from({ length: tabCount }).map((_, index) => (
              <div
                key={index}
                className="absolute bg-gray-200 rounded-t-lg"
                style={{
                  width: TAB_WIDTH,
                  height: TAB_HEIGHT,
                  left: index * (TAB_WIDTH - OVERLAP_OFFSET),
                  zIndex: 1000 + index,
                }}
              />
            ))}
            {/* 탭 추가 버튼 스켈레톤 */}
            <div
              className="absolute bg-gray-200 rounded-t-lg"
              style={{
                width: TAB_WIDTH,
                height: TAB_HEIGHT,
                left: tabCount * (TAB_WIDTH - OVERLAP_OFFSET),
                zIndex: 1000 + tabCount,
              }}
            />
          </div>
        </div>

        {/* 카드 그리드 스켈레톤 */}
        <div className="bg-surface-container-10 px-10 py-15 min-h-285 mb-15">
          <div className="grid grid-cols-3 gap-x-10 gap-y-15 animate-pulse">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="w-90 h-[294px] flex flex-col pt-[5px] items-center rounded-[10px] bg-gray-200"
              >
                {/* 이미지 영역 스켈레톤 */}
                <div className="w-[350px] h-[193px] rounded-t-[10px] bg-gray-300" />
                {/* 제목 영역 스켈레톤 */}
                <div className="w-full h-24 rounded-b-[10px] bg-gray-300 mt-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* 페이지네이션 스켈레톤 */}
        <div className="flex justify-center mb-14 animate-pulse">
          <div className="h-10 w-80 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default RepostingPageSkeleton;
