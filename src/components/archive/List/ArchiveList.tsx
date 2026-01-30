import { useNavigate } from "react-router-dom";
import ArchiveCard from "../ArchiveCard";
import type { ArchiveListItem } from "@/types/archive";

type ArchiveListProps = {
  archive: ArchiveListItem[];
  checkedMap?: Record<string, boolean>;
  onToggleCheck?: (archiveId: string, checked: boolean) => void;
  isEditMode?: boolean;
};
const ArchiveList = ({
  archive,
  isEditMode = false,
  checkedMap = {},
  onToggleCheck,
}: ArchiveListProps) => {
  const navigate = useNavigate();
  return (
    <div className="w-310 flex flex-wrap items-start justify-start gap-x-20 gap-y-15">
      {archive.map((archive) => (
        <ArchiveCard
          key={archive.archiveId}
          archiveId={archive.archiveId}
          title={archive.title}
          image={archive.thumbnailUrl}
          isEditMode={isEditMode}
          checked={!!checkedMap[String(archive.archiveId)]}
          onToggleCheck={onToggleCheck}
          onClick={() => {
            console.log(archive.archiveId + "번 아카이브 클릭");
            navigate(`/archive/${archive.archiveId}`);
          }}
        />
      ))}
    </div>
  );
};

export default ArchiveList;
