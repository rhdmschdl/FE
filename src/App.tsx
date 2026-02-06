import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import router from "./router/router";
import SseProvider from "./providers/SseProvider";
import { useSessionCheck } from "./hooks/useSeesionCheck";

const queryClient = new QueryClient();
// ✅ SessionChecker 컴포넌트 형태로 변경
function SessionChecker() {
  useSessionCheck(); // ✅ hook 사용
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SseProvider>
        <SessionChecker /> {/* ✅ 세션 체크 컴포넌트 */}
        <RouterProvider router={router} />
      </SseProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
