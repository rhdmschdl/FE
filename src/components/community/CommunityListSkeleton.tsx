import CommunityCardSkeleton from "./CommunityCardSkeleton";

interface CommunityListSkeletonProps {
  count?: number;
}

const CommunityListSkeleton = ({ count = 9 }: CommunityListSkeletonProps) => {
  return (
    <div
      className="grid grid-cols-3 gap-x-20 gap-y-8"
      style={{
        gridTemplateColumns: "repeat(3, 360px)",
        rowGap: "32px",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CommunityCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CommunityListSkeleton;
