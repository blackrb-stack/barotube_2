import { useEffect, useRef, useState } from "react";

// 화면 맨 위에서 아래로 당기면 onRefresh 실행 (모바일 터치 전용)
const THRESHOLD = 70; // 이만큼(px) 당기면 새로고침
const MAX_PULL = 110;

export function usePullToRefresh(onRefresh: () => Promise<void>, enabled: boolean) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const onStart = (e: TouchEvent) => {
      if (busy.current || window.scrollY > 0 || e.touches.length !== 1) {
        startY.current = null;
        return;
      }
      startY.current = e.touches[0].clientY;
    };

    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0 || window.scrollY > 0) {
        pullRef.current = 0;
        setPull(0);
        return;
      }
      // 당길수록 덜 따라오게(고무줄 느낌)
      const value = Math.min(MAX_PULL, dy * 0.5);
      pullRef.current = value;
      setPull(value);
    };

    const onEnd = async () => {
      if (startY.current === null) return;
      startY.current = null;
      const reached = pullRef.current >= THRESHOLD;
      pullRef.current = 0;
      if (!reached) {
        setPull(0);
        return;
      }
      busy.current = true;
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        busy.current = false;
        setRefreshing(false);
        setPull(0);
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [onRefresh, enabled]);

  return { pull, refreshing, threshold: THRESHOLD };
}
