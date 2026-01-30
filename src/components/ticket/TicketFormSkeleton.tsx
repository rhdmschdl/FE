import RequiredLabel from "../common/Form/RequiredLabel";

export default function TicketFormSkeleton() {
  return (
    <div className="max-w-310 mx-auto flex flex-col gap-10">
      {/* 이미지 등록 */}
      <div>
        <RequiredLabel>이미지 등록</RequiredLabel>
        <div className="w-[276px] h-[145px] bg-gray-300 rounded animate-pulse" />
        <div className="text-caption text-color-high mt-3">
          사진은 1장만 등록 가능하며, 미등록 시 기본 이미지로 대체됩니다. (권장
          사이즈: 276*145)
        </div>
      </div>

      {/* 이벤트 이름 */}
      <div>
        <RequiredLabel required>이벤트 이름</RequiredLabel>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* 날짜 및 시간 */}
      <div>
        <RequiredLabel>날짜 및 시간</RequiredLabel>
        <div className="flex gap-5 items-center">
          <div className="h-10 w-27 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-26 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* 장소 이름 */}
      <div>
        <RequiredLabel>장소 이름</RequiredLabel>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* 좌석 위치 */}
      <div>
        <RequiredLabel>좌석 위치</RequiredLabel>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* 캐스팅 */}
      <div>
        <RequiredLabel>캐스팅</RequiredLabel>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* 평점 */}
      <div>
        <RequiredLabel>평점</RequiredLabel>
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* 관람 후기 */}
      <div>
        <RequiredLabel>관람 후기</RequiredLabel>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* 버튼 */}
      <div className="flex justify-center gap-4">
        <div className="h-[48px] w-[180px] bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-[48px] w-[180px] bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
