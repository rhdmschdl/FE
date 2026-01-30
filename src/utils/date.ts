// 티켓 북에서 사용하는 날짜 포맷터 추후 확장성을 고려해 별도 유틸로 분리
export const formatDateTime = (isoDate: string | null): string | null => {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours < 12 ? "am" : "pm";
  const hour12 = hours % 12 || 12;
  return `${year}.${month}.${day} ${ampm} ${hour12}:${minutes}`;
};
