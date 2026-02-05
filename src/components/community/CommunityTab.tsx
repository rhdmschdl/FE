import Chip from "../common/Button/Chip";

type Option = { label: string; value: string };

type CommunityTabProps = {
  value: string;
  onChange: (value: string) => void;
  options?: Option[];
  hideAll?: boolean;
};

const DEFAULT_OPTIONS: Option[] = [
  { label: "전체", value: "ALL" },
  { label: "아이돌", value: "IDOL" },
  { label: "배우", value: "ACTOR" },
  { label: "연주자", value: "MUSICIAN" },
  { label: "스포츠", value: "SPORT" },
  { label: "아티스트", value: "ARTIST" },
  { label: "애니메이션", value: "ANIMATION" },
  { label: "기타", value: "ETC" },
];

export default function CommunityTab({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  hideAll = false,
}: CommunityTabProps) {
  const effectiveOptions = hideAll
    ? options.filter((o) => o.label !== "전체")
    : options;

  return (
    <div role="tablist" className="flex gap-[23px]">
      {effectiveOptions.map((opt) => (
        <Chip
          key={opt.value}
          selected={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Chip>
      ))}
    </div>
  );
}
