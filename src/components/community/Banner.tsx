// src/components/community/Banner.tsx (간단 버전)
import { useRef } from "react";
import { BtnBasic } from "../common/Button/Btn";

interface BannerProps {
  image?: string;
  isEdit?: boolean;
  onBannerSave?: (file: File) => void;
}

const Banner = ({ image, isEdit = false, onBannerSave }: BannerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onBannerSave) {
      onBannerSave(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBannerEditClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="flex justify-center items-center w-full relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ✅ 로딩 처리 없이 바로 표시 */}
      {image ? (
        <img
          key={image} // ✅ key로 URL 변경 감지
          src={image}
          alt="banner"
          role="img"
          className="w-full h-50 object-cover"
        />
      ) : (
        <div className="w-full h-50 bg-brand-blue-200" />
      )}

      {isEdit && (
        <BtnBasic
          onClick={handleBannerEditClick}
          className="p-2.5 absolute top-8 right-16 typo-body2-semibold 
        bg-brand-blue-100 text-color-high w-27.5 h-11 rounded-[8px] shadow-[0_0_4px_0_#CBD5DF]">
          배너 편집
        </BtnBasic>
      )}
    </div>
  );
};

export default Banner;