import type { ColorData } from "@/types/calendar";

export const DIARY_COLORS: ColorData[] = [
  { color: "#FFD1DC" }, // 핑크
  { color: "#FF8787" }, // 빨강
  { color: "#FFD0A3" }, // 오렌지
  { color: "#FFE79E" }, // 노랑
  { color: "#B9E2B6" }, // 초록
  { color: "#82BEF5" }, // 파랑
  { color: "#D2D2FF" }, // 보라
  { color: "#D1CCCC" }, // 회색
];

export const DEFAULT_DIARY_COLOR = DIARY_COLORS[5].color;

export const DIARY_BG_COLORS: Record<string, string> = {
  "#FFD1DC": "#FFF5F7", // 연핑크
  "#FF8787": "#FFEDED", // 연빨강
  "#FFD0A3": "#FFF1E5", // 연오렌지
  "#FFE79E": "#FFF9E7", // 연노랑
  "#B9E2B6": "#F4FEF3", // 연초록
  "#82BEF5": "#EEF7FC", // 연파랑
  "#D2D2FF": "#F2F2FF", // 연보라
  "#D1CCCC": "#F1F1F1", // 연회색
};

export const DIARY_DARK_COLORS: Record<string, string> = {
  "#FFD1DC": "#FAA7BA", // 진핑크
  "#FF8787": "#FC5C5C", // 진빨강
  "#FFD0A3": "#F9B16D", // 진오렌지
  "#FFE79E": "#FCD86D", // 진노랑
  "#B9E2B6": "#75D16E", // 진초록
  "#82BEF5": "#5AA8F0", // 진파랑 디자인에 없음
  "#D2D2FF": "#B6B6FA", // 진보라
  "#D1CCCC": "#B0AFAF", // 진회색
};

export const DIARY_MEMO_COLORS: Record<string, string> = {
  "#82BEF5": "#D5E8F9", // 얘만 다름 blue 200
};

export const getDiaryBgColor = (color: string): string => {
  return DIARY_BG_COLORS[color.toUpperCase()] || "#EEF7FC";
};

export const getDiaryDarkColor = (color: string): string => {
  return DIARY_DARK_COLORS[color.toUpperCase()] || color;
};

export const getDiaryMemoColor = (color: string): string => {
  return DIARY_MEMO_COLORS[color.toUpperCase()] || color;
};
