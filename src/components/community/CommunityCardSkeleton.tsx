const CommunityCardSkeleton = () => {
  return (
    <div className="w-90 h-78.5 rounded-lg bg-surface-container-10 animate-pulse">
      {/* 타이틀 스켈레톤 */}
      <div className="flex w-full h-14.5 px-5 py-3 items-center">
        <div className="h-6 w-48 bg-gray-300 rounded" />
      </div>

      {/* 이미지 스켈레톤 */}
      <div className="w-full h-45 bg-gray-300" />

      {/* 카테고리 & 내용 스켈레톤 */}
      <div className="flex flex-col w-full h-19.5 px-5 py-3 gap-2">
        <div className="h-3 w-16 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default CommunityCardSkeleton;
