import type { Archive } from "@/types/archive";
import ArchiveCard from "../archive/ArchiveCard";
import { useNavigate } from "react-router-dom";


const HomeArchiveList = ({ archive }: { archive: Archive[] }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex gap-20 ">

      <ArchiveCard
        title="덕카이브 만들기"
        image={undefined}
        isCreateMode={true}
        onClick={() => {
          // console.log("덕카이브 만들기 클릭");
        }}
      />
      {archive.map((archive) => (
        <ArchiveCard
          key={archive.archiveId}
          archiveId={archive.archiveId}
          title={archive.title}
          image={archive.image}
          onClick={() => {
            navigate(`/archive/${archive.archiveId}`);
          }}
        />
      ))}
    </div>
  );
};

export default HomeArchiveList;