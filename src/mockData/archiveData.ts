import { diaryDataMock } from "./diaryData";
import { galleryDataMock } from "./galleryData";
import { ticketDataMock } from "./ticketData";
import { repostDataMock } from "./repostData";
import { Badge } from "@/types/archive";


export const archiveDataMock = [
  {
    archiveId: 90000000,
    userId: 90000000,
    title: "샘플 아카이브1",
    bannerUrl: "https://picsum.photos/1920/201",
    image: "https://picsum.photos/201/300",
    badge: Badge.NEWBIE,
    viewCount: 150,
    likeCount: 42,
    visibility: "PUBLIC",
    createdAt: "2025-01-01T00:00:00.000Z",
    lastModifiedAt: "KST Datetime",
    ownerNickname: "유저1",
    liked: false,
    Diary: diaryDataMock.filter((diary) => diary.archiveId === 90000000) ?? [],
    Gallery: galleryDataMock.filter((gallery) => gallery.archiveId === 90000000) ?? [],
    Ticket: ticketDataMock.filter((ticket) => ticket.archiveId === 90000000) ?? [],
    Repost: repostDataMock.filter((repost) => repost.archiveId === 90000000) ?? [],
  },
  {
    archiveId: 90000001,
    userId: 90000001,
    title: "샘플 아카이브2",
    bannerUrl: "https://picsum.photos/1920/202",
    image: "https://picsum.photos/202/300",
    viewCount: 150,
    likeCount: 41,
    visibility: "PUBLIC",
    createdAt: "2025-01-01T00:00:00.000Z",
    lastModifiedAt: "KST Datetime",
    ownerNickname: "유저2",
    badge: Badge.FANS,
    liked: false,
    Diary: diaryDataMock.filter((diary) => diary.archiveId === 90000001) ?? [],
    Gallery: galleryDataMock.filter((gallery) => gallery.archiveId === 90000001) ?? [],
    Ticket: ticketDataMock.filter((ticket) => ticket.archiveId === 90000001) ?? [],
    Repost: repostDataMock.filter((repost) => repost.archiveId === 90000001) ?? [],
  },

];
