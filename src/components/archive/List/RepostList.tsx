import { useNavigate } from "react-router-dom";
import { Link } from "lucide-react";
import RepostCard from "@/components/common/Card/RepostCard";
import ArchiveTitle from "@/components/archive/ArchiveTitle";
import EmptyList from "@/components/archive/Empty/EmptyList";
import EmptyFeedList from "@/components/feed/EmptyFeedList";
import { useGetRepost } from "@/apis/queries/repost/useGetRepost";

interface RepostListProps {
  archiveId?: string;
  limit?: number;
  isOwner?: boolean;
  emptyDescription?: string;
}

const RepostList = ({
  archiveId,
  limit = 3,
  isOwner = false,
  emptyDescription = "링크를 모아서 아카이브를 만들어보세요.",
}: RepostListProps) => {
  const navigate = useNavigate();

  const { data } = useGetRepost({
    archiveId: Number(archiveId),
    page: 0,
    size: limit,
  });

  const repostList = data?.content ?? [];
  const hasRepost = repostList.length > 0;

  const handleNavigateToRepost = () => {
    if (!archiveId) return;
    navigate(`/archive/${archiveId}/repost`);
  };

  return (
    <>
      <ArchiveTitle
        title="덕질 리포스트"
        onClick={handleNavigateToRepost}
        isMore={hasRepost}
      />
      {hasRepost ? (
        <div className="w-full flex flex-col items-start gap-[60px]">
          <div className="flex items-start justify-between gap-[80px]">
            {repostList.map((repost) => (
              <RepostCard
                key={repost.id}
                id={repost.id}
                archiveId={Number(archiveId)}
                tabId={repost.repostTabId}
                title={repost.title}
                image={repost.thumbnailUrl ?? undefined}
                onClick={handleNavigateToRepost}
              />
            ))}
          </div>
        </div>
      ) : isOwner ? (
        <EmptyList
          title="링크 첨부"
          description={emptyDescription}
          startIcon={<Link className="w-6 h-6 text-color-high" />}
          onClick={handleNavigateToRepost}
        />
      ) : (
        <EmptyFeedList description={emptyDescription} />
      )}
    </>
  );
};

export default RepostList;
