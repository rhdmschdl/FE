import { useCallback, useState } from "react";
import type { Ticket } from "@/types/ticket";

/**
 * 간단한 로컬 상태 훅.
 * 서버 API 연결 시 optimistic/pessimistic 패턴으로 확장.
 */
export function useTickets(initial: Ticket[] = []) {
  const [tickets, setTickets] = useState<Ticket[]>(initial);

  const addTicket = useCallback((t: Partial<Ticket>) => {
    const nowIso = new Date().toISOString();
    const full: Ticket = {
      id: t.id ?? Date.now(),
      eventName: t.eventName ?? "제목 없음",
      imageUrl: t.imageUrl ?? null,
      isRepresentative: !!t.isRepresentative,
      dateTime: t.dateTime ?? null,
      place: t.place ?? null,
      seat: t.seat ?? null,
      casting: t.casting ?? null,
      rating: t.rating ?? null,
      review: t.review ?? null,
      createdAt: t.createdAt ?? nowIso,
    };
    setTickets((prev) => [full, ...prev]);
  }, []);

  const updateTicket = useCallback((id: number, patch: Partial<Ticket>) => {
    setTickets((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const deleteTickets = useCallback((ids: number[]) => {
    setTickets((p) => p.filter((x) => !ids.includes(x.id)));
  }, []);

  const replaceAll = useCallback((next: Ticket[]) => {
    setTickets(next);
  }, []);

  return { tickets, addTicket, updateTicket, deleteTickets, replaceAll };
}
