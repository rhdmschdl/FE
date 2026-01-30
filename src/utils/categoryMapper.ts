export const DEFAULT_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "아이돌", value: "idol" },
  { label: "배우", value: "actor" },
  { label: "연주자", value: "musician" },
  { label: "스포츠", value: "sport" },
  { label: "아티스트", value: "artist" },
  { label: "애니메이션", value: "animation" },
  { label: "기타", value: "etc" },
] as const;

type Option = { label: string; value: string };

/**
 * 서버 카테고리 키를 받아 프론트 라벨(value->label)로 변환
 * - serverCategory: 서버에서 내려주는 값 (예: "IDOL", "idol", "Idol")
 * - 반환: "아이돌" 또는 undefined(매핑 불가 시)
 */
export function mapCategoryToLabel(
  serverCategory?: string | null
): string | undefined {
  if (!serverCategory) return undefined;

  const normalized = String(serverCategory).toLowerCase();

  // options에서 value와 비교
  const found = DEFAULT_OPTIONS.find(
    (o: Option) => o.value.toLowerCase() === normalized
  );
  if (found) return found.label;

  // 서버가 대문자 키("IDOL")로 내려줄 경우도 처리
  const upper = String(serverCategory).toUpperCase();
  const found2 = DEFAULT_OPTIONS.find((o) => o.value.toUpperCase() === upper);
  if (found2) return found2.label;

  // 미등록 카테고리는 '기타'로 처리하거나 undefined 반환
  return DEFAULT_OPTIONS.find((o) => o.value === "etc")?.label ?? undefined;
}
