import axios, { AxiosError } from "axios";

// API Base URL
const BASE_URL = import.meta.env.VITE_API_BASE;

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 자동으로 포함
});

// 응답 인터셉터 - 기본적인 에러 처리만
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401 에러 시 로그인 페이지로 리다이렉트 => 필요한 곳에서 개별 처리
    // if (error.response?.status === 401) {
    //   window.location.href = "/login";
    // }

    // 403 에러 처리 (권한 없음)
    if (error.response?.status === 403) {
      alert("접근 권한이 없습니다.");
    }

    // 500 에러 처리 (서버 에러)
    if (error.response?.status === 500) {
      console.error("서버 에러:", error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
