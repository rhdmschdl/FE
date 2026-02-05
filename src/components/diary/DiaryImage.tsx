import DiaryImageCard from "@/assets/icon/DiaryImageCard";
import image from "@/assets/images/diaryBackground.png";
import ImageCard from "./ImageCard";
import { useRef } from "react";

type ImageItem = {
  id: string;
  previewUrl: string;
};

type DiaryImageProps = {
  images?: ImageItem[];
  onImageAdd?: (files: File[]) => void;
  onImageDelete?: (id: string) => void;
  isEditMode?: boolean;
  color?: string;
};

const DiaryImage = ({
  images = [],
  onImageAdd,
  onImageDelete,
  isEditMode = false,
  color,
}: DiaryImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러 (여러 파일 지원)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageAdd?.(Array.from(files));
    }
    e.target.value = "";
  };

  // 파일 선택 열기
  const handleImageCardClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 삭제
  const handleImageDelete = (id: string) => {
    onImageDelete?.(id);
  };

  return (
    <div className="w-full mb-6">
      <div
        className="relative w-full h-[433px] flex justify-center overflow-hidden"
        style={{
          width: "max(100vw, 1240px)",
          marginLeft: "calc(-1 * max(50vw, 620px) + 50%)",
        }}
      >
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-fill pointer-events-none"
        />
        <div className="absolute top-0 w-310 h-full">
          <div
            className="flex gap-15 overflow-x-auto overflow-y-hidden h-full pb-4 scroll-smooth scrollbar-hide"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE, Edge (구버전)
            }}
          >
            {!isEditMode && images.length < 3 && (
              <div
                className="cursor-pointer flex-shrink-0"
                onClick={handleImageCardClick}
              >
                <DiaryImageCard color={color} />
              </div>
            )}

            {images.map((imageItem) => (
              <div key={imageItem.id} className="flex-shrink-0">
                <ImageCard
                  imageUrl={imageItem.previewUrl}
                  onClick={() => handleImageDelete(imageItem.id)}
                  showDeleteButton={!isEditMode} // TODO : 기획 의도랑 다를 수 있음 확인 필요
                />
              </div>
            ))}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryImage;
