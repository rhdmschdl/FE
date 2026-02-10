import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home/Home";
import NotFound from "@/pages/NotFound.tsx";
import HomeLayout from "@/layouts/HomeLayout.tsx";
import Archive from "@/pages/Archive/Archive.tsx";
import Community from "@/pages/Community/Community";
import Feed from "@/pages/Feed/Feed";
import MyPage from "@/pages/MyPage/MyPage";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import SignupPage from "@/pages/Auth/SignupPage";
import FeedDetail from "@/pages/Feed/FeedDetail";
import CommunityWrite from "@/pages/Community/CommunityWrite";
import CommunityDetail from "@/pages/Community/CommunityDetail";
import ArchiveDetail from "@/pages/Archive/ArchiveDetail";
import TicketBookPage from "@/pages/Archive/Ticket/TicketBookPage";
import CreateTicketPage from "@/pages/Archive/Ticket/CreateTicketPage";
import EditTicketPage from "@/pages/Archive/Ticket/EditTicketPage";
import Gallery from "@/pages/Archive/Gallery/Gallery";
import RepostingPage from "@/pages/Archive/Repost/RepostingPage";
import MyInfoPage from "@/pages/MyPage/MyInfoPage";
import FriendsPage from "@/pages/MyPage/FriendsPage";
import VisitProfilePage from "@/pages/MyPage/VisitProfilePage";
import VisitArchivePage from "@/pages/MyPage/VisitArchivePage";
import MyArchivePage from "@/pages/MyPage/MyArchivePage";
import PasswordFind from "@/pages/Auth/PasswordFind";
import AuthLayout from "@/layouts/AuthLayout";
import SocialCallback from "@/pages/Auth/socialCallback";
import DiaryWritePage from "@/pages/Archive/Diary/DiaryWritePage";
import DiaryDetailPage from "@/pages/Archive/Diary/DiaryDetailPage";
import DiaryPage from "@/pages/Archive/Diary/DiaryPage";

const router = createBrowserRouter([
  // 🔓 Public Routes (누구나 접근 가능)
  // 로그인 하지 않은 사용자만 접근 가능한 라우트 (메인 홈, 커뮤니티 열람, 피드 열람)
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "feed", element: <Feed /> },
      { path: "feed/:id", element: <FeedDetail /> },
      { path: "community", element: <Community /> },
      { path: "community/:postId", element: <CommunityDetail /> },
      { path: "archive/:archiveId/diary", element: <DiaryPage /> }, // 아카이브 내 다이어리 목록 보기
      { path: "archive/:archiveId/ticket-book", element: <TicketBookPage /> },
      { path: "archive/:archiveId/gallery", element: <Gallery /> },
      { path: "archive/:archiveId/repost", element: <RepostingPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // 🚪 Auth Routes (로그인 안 된 사용자만)
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "password-find", element: <PasswordFind /> },
      { path: "/oauth/callback", element: <SocialCallback /> },
      { path: "/logged-out", element: <SocialCallback /> } // ✅ 카카오 로그아웃 콜백: SocialCallback에서 경로로 구분하여 처리
    ],
  },

  // 🔒 Protected Routes (로그인 필요)
  // 로그인 한 사용자만 접근 가능한 라우트 (메인 홈, 커뮤니티 열람, 피드 열람, 아카이브 열람, 마이페이지)
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { path: "archive", element: <Archive /> },
      { path: "archive/:archiveId", element: <ArchiveDetail /> },
      {
        path: "archive/:archiveId/ticket/create",
        element: <CreateTicketPage />,
      },
      {
        path: "archive/:archiveId/ticket/:ticketId/edit",
        element: <EditTicketPage />,
      },
      { path: "community/new", element: <CommunityWrite /> },
      { path: "mypage", element: <MyPage /> },
      { path: "mypage/info", element: <MyInfoPage /> },
      { path: "mypage/archive", element: <MyArchivePage /> },
      { path: "mypage/friends", element: <FriendsPage /> },

      {
        path: "/archive/:archiveId/diary/:diaryId", // 다른 사용자의 다이어리 상세 보기 또는 수정(작성자만)
        element: <DiaryDetailPage />,
      },
      {
        path: "/archive/:archiveId/diary/new", // 다이어리 작성
        element: <DiaryWritePage />,
      },
      { path: "profile/:userId", element: <VisitProfilePage /> },
      { path: "profile/:userId/archives", element: <VisitArchivePage /> },
    ],
  },
]);

export default router;
