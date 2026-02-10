

const ArchiveDetailSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center animate-pulse">
      {/* 배너 스켈레톤 */}
      <div className="w-full h-[200px] bg-gray-200" />

      <div className="max-w-[1920px] mx-auto flex flex-col items-start mt-[60px] gap-[60px]">
        <div className="w-310">
          {/* 아카이브 헤더 스켈레톤 */}
          <div className="flex flex-col gap-[20px] mb-[60px]">
            <div className="flex justify-between items-center">
              {/* 제목 */}
              <div className="h-[40px] w-[300px] bg-gray-300 rounded" />
              {/* 메뉴 아이콘 */}
              <div className="h-[32px] w-[32px] bg-gray-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              {/* 프로필 및 닉네임 */}
              <div className="flex items-center gap-[10px]">
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full" />
                <div className="h-[24px] w-[100px] bg-gray-300 rounded" />
              </div>
              {/* 배지 영역 */}
              <div className="flex gap-[10px]">
                <div className="w-[60px] h-[30px] bg-gray-200 rounded-[10px]" />
                <div className="w-[80px] h-[30px] bg-gray-200 rounded-[10px]" />
              </div>
            </div>
          </div>

          {/* 캘린더 스켈레톤 */}
          <div className="w-full h-[600px] bg-gray-200 rounded-[20px] mb-[60px]" />

          {/* 리스트 영역 스켈레톤 (일기, 티켓 등) */}
          <div className="flex flex-col gap-[60px] mb-[100px]">
            {[1, 2].map((section) => (
              <div key={section} className="flex flex-col gap-[20px]">
                {/* 섹션 제목 */}
                <div className="flex justify-between items-center">
                  <div className="h-[32px] w-[150px] bg-gray-300 rounded" />
                  <div className="h-[20px] w-[50px] bg-gray-200 rounded" />
                </div>
                {/* 카드 리스트 (3개) */}
                <div className="flex gap-[40px]">
                  {[1, 2, 3].map((card) => (
                    <div
                      key={card}
                      className="w-[360px] h-[300px] bg-gray-200 rounded-[10px]"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveDetailSkeleton;