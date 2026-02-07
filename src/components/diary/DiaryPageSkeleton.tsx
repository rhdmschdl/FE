const DiaryPageSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-[1920px] mx-auto flex flex-col items-start mt-15 gap-15">
        <div className="w-310 flex flex-col gap-15 animate-pulse">
          {/* 제목 스켈레톤 */}
          <div className="h-10 w-200 bg-gray-300 rounded" />

          <div className="w-full flex flex-col gap-10">
            {/* 버튼 영역 스켈레톤 */}
            <div className="w-full flex justify-end gap-4">
              <div className="h-11 w-28 bg-gray-200 rounded-lg" />
              <div className="h-11 w-28 bg-gray-200 rounded-lg" />
            </div>

            {/* DiaryCard 목록 스켈레톤 - w-[360px] h-[300px] */}
            <div className="w-full">
              <div className="grid grid-cols-3 gap-20">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[360px] h-[300px] bg-gray-200 rounded-[10px]"
                  />
                ))}
              </div>
            </div>

            {/* 페이지네이션 스켈레톤 */}
            <div className="flex justify-center pt-5 pb-15">
              <div className="h-10 w-80 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryPageSkeleton;
