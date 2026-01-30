import { Plus } from "lucide-react";
import { BtnIcon } from "@/components/common/Button/Btn";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CreateArchive } from "@/apis/mutations/archive/archive";
import { Visibility } from "@/types/archive";

const EmptyArchive = () => {
  const navigate = useNavigate();
  const createArchiveMutation = useMutation({
    mutationFn: CreateArchive,
    onSuccess: () => {
      console.log("createArchive success");
    },
    onError: (error) => {
      console.log("createArchive error", error);
    },
  });

  const handleCreateArchive = () => {
    createArchiveMutation.mutate({
      title: "아카이브명",
      visibility: Visibility.PUBLIC,
      bannerImageId: null,
    }, {
      onSuccess: (data) => {
        console.log("createArchive success", data);
        navigate('/archive/' + data.id);
      },
    });
  };
  return (
    <div
      className="w-310 h-135 p-2.5 flex flex-col items-center justify-center gap-5 
  rounded-lg border-2 border-solid border-border-low"
    >
      <BtnIcon
        startIcon={<Plus className="w-6 h-6 text-color-high" />}
        onClick={() => {
          handleCreateArchive();
          console.log("덕카이브 추가 버튼 클릭");
        }}
      >
        덕카이브
      </BtnIcon>
      <p className="typo-h2 text-color-low text-center">
        아카이브가 비어 있어요.
        <br />
        '+' 버튼을 클릭해 덕카이브를 추가해보세요.
      </p>
    </div>
  );
};

export default EmptyArchive;
