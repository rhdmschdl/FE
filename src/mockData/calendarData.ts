import type { LabelData } from "@/types/calendar";

export type ColorData = {
  color: string;
};

const colors: ColorData[] = [
  { color: "#FFDFE7" }, //핑크
  { color: "#FFABAB" }, //빨강
  { color: "#FFDEBF" }, //오렌지
  { color: "#FFEEBB" }, //노랑
  { color: "#CEEBCC" }, //초록
  { color: "#82BEF5" }, //파랑
  { color: "#DFDFFF" }, //보라
  { color: "#DFDCDC" }, //회색
];

export type SportInfo = {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
};

const defaultLabelData: LabelData[] = [
  {
    id: 1,
    title: "야구경기 관람",
    date: "2026-01-03",
    time: "19:00",
    hasTime: false,
    color: "#FFDFE7",
    isSportType: true,
    sportInfo: {
      team1: "한화 이글스",
      team2: "두산 베어스",
      score1: 5,
      score2: 3,
    },
    hashtags: ["야구", "한화 이글스", "두산 베어스"],
  },
  {
    id: 2,
    title: "야구경기 관람",
    date: "2026-01-04",
    time: "19:00",
    hasTime: true,
    color: "#FFDEBF",
    isSportType: true,
    sportInfo: {
      team1: "한화 이글스",
      team2: "LG 트윈스",
      score1: 5,
      score2: 3,
    },
    hashtags: ["야구", "한화 이글스", "LG 트윈스"],
  },

  {
    id: 3,
    date: "2026-01-05",
    title: "콘서트 관람",
    time: "19:00",
    hasTime: false,
    color: "#FFABAB",
    hashtags: ["콘서트", "라이브", "블랙핑크"],
    isSportType: false,
  },
  { id: 4,
    date: "2026-01-06",
    title: "콘서트 관람",
    time: "19:00",
    hasTime: false,
    color: "#FFABAB",
    hashtags: ["콘서트", "라이브", "블랙핑크"],
    isSportType: false,
  },
  {
    id: 5,
    date: "2026-01-04",
    title: "콘서트 관람",
    time: "19:00",
    hasTime: false,
    color: "#FFABAB",
    hashtags: ["콘서트", "라이브", "블랙핑크"],
    isSportType: false,
  },
  {
    id: 6,
    date: "2026-01-05",
    title: "콘서트 관람",
    time: "18:00",
    hasTime: true,
    color: "#82BEF5",
    hashtags: ["콘서트", "라이브", "블랙핑크", "아이돌"],
    isSportType: false,
  },
  {
    id: 7,
    date: "2026-01-06",
    title: "데이트",
    time: "21:00",
    hasTime: true,
    color: "#FFDEBF",
    hashtags: ["데이트", "커플"],
    isSportType: true,
    sportInfo: {
      team1: "한화 이글스",
      team2: "두산 베어스",
      score1: 5,
      score2: 3,
    },
  },
];

const defaultStickerData: Record<string, string> = {
  "2026-01-01": "sticker",
  "2026-01-02": "sticker",
  "2026-01-03": "sticker",
  "2026-01-04": "sticker",
  "2026-01-05": "sticker",
  "2026-01-06": "sticker",
  "2026-01-07": "sticker",
  "2026-01-08": "sticker",
  "2026-01-09": "sticker",
};

export {
  defaultLabelData as labelDataMock,
  defaultStickerData as stickerDataMock,
  colors,
};
