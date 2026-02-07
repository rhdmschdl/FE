import { getDiaryBgColor, DEFAULT_DIARY_COLOR } from "@/constants/diaryColors";
import { DiaryFooter } from "./DiaryFooter";
import DiaryMemo from "@/assets/icon/DiaryMemo";
import diaryBackground from "@/assets/images/diaryBackground.png";

const DiaryDetailSkeleton = () => {
  const bgColor = getDiaryBgColor(DEFAULT_DIARY_COLOR);

  return (
    <div className="w-full min-w-310 h-full" style={{ backgroundColor: bgColor }}>
      <div className="flex flex-col items-center justify-center max-w-[1920px] mx-auto py-15 gap-15">
        {/* 색상 선택 영역 - 보기 모드에서는 비어있음 */}
        <div className="w-310 flex justify-start" />

        {/* 이미지 영역 - DiaryImage와 동일한 구조 (mb-6 포함) */}
        <div className="w-full mb-6">
          <div
            className="relative w-full h-[433px] flex justify-center overflow-hidden"
            style={{
              width: "max(100vw, 1240px)",
              marginLeft: "calc(-1 * max(50vw, 620px) + 50%)",
            }}
          >
            <img
              src={diaryBackground}
              alt=""
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
            {/* 스켈레톤 이미지 카드 - ImageCard 크기: 380x350 */}
            <div className="absolute top-0 w-310 h-full">
              <div className="flex gap-15 h-full pb-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[380px] h-[350px] bg-gray-300/70 rounded shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 날짜 및 일기 내용 영역 */}
        <div className="w-310 flex flex-col gap-15">
          {/* 날짜 스켈레톤 - typo-h1(36px) + text-[40px]에 맞춤 */}
          <div className="flex gap-5 items-center w-full animate-pulse">
            <div className="h-[40px] w-28 bg-gray-300/70 rounded" />
            <div className="h-[48px] w-64 bg-gray-300/70 rounded" />
          </div>

          {/* 일기 텍스트 영역 - DiaryText와 동일한 구조 */}
          <div className="relative">
            <DiaryMemo color={DEFAULT_DIARY_COLOR} className="absolute top-0 left-0" />
            <div
              className="relative ml-[100px] mt-[65px] w-[1133px] h-[1133px] px-27.5 py-17
              bg-[#F9FAFB] shadow-[0_4px_15px_0_rgba(0,0,0,0.15)]"
            >
              <div className="flex flex-col gap-10 items-center justify-center">
                {/* 제목 스켈레톤 - text-[40px]에 맞춤 */}
                <div className="w-full animate-pulse">
                  <div className="h-[48px] w-80 bg-gray-300/70 rounded" />
                </div>
                {/* 본문 스켈레톤 - textarea와 동일한 구조 */}
                <div
                  className="w-full max-h-225"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      to bottom,
                      transparent 0,
                      transparent 46px,
                      #CBD5DF 46px,
                      #CBD5DF 47px
                    )`,
                    backgroundSize: "100% 50px",
                    lineHeight: "50px",
                    minHeight: "900px",
                  }}
                >
                  {/* 각 줄을 50px 높이로 배치하여 줄과 정렬 */}
                  {Array.from({ length: 18 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[50px] flex items-center animate-pulse"
                    >
                      <div
                        className={`h-[30px] bg-gray-300/70 rounded ${
                          index % 4 === 0 ? "w-full" : index % 4 === 1 ? "w-11/12" : index % 4 === 2 ? "w-4/5" : "w-3/4"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DiaryFooter noBtn color={DEFAULT_DIARY_COLOR} />
    </div>
  );
};

export default DiaryDetailSkeleton;
