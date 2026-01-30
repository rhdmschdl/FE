import { create } from "zustand";
import { DEFAULT_DIARY_COLOR } from "@/constants/diaryColors";

type DiaryColorStore = {
  color: string;
  setColor: (color: string) => void;
  resetColor: () => void;
};

export const useDiaryColorStore = create<DiaryColorStore>((set) => ({
  color: DEFAULT_DIARY_COLOR,
  setColor: (color) => set({ color }),
  resetColor: () => set({ color: DEFAULT_DIARY_COLOR }),
}));
