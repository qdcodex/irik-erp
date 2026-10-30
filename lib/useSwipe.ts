import { useEffect, useRef, useCallback } from "react";

interface SwipeHandlers {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onLongPress?: (e: React.TouchEvent) => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
  longPressDelay?: number;
}

export function useSwipe(
  element: React.RefObject<HTMLElement>,
  handlers: SwipeHandlers
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchDistanceRef = useRef<number>(0);

  const threshold = handlers.threshold || 50;
  const longPressDelay = handlers.longPressDelay || 500;

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        // Start long press timer
        if (handlers.onLongPress) {
          longPressTimer.current = setTimeout(() => {
            // Create a synthetic React event-like object
            const syntheticEvent = {
              touches: e.touches,
              preventDefault: () => e.preventDefault(),
            } as unknown as React.TouchEvent;
            handlers.onLongPress?.(syntheticEvent);
          }, longPressDelay);
        }
      } else if (e.touches.length === 2 && handlers.onPinch) {
        // Handle pinch start
        const dx =
          e.touches[0].clientX - e.touches[1].clientX;
        const dy =
          e.touches[0].clientY - e.touches[1].clientY;
        touchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      }
    },
    [handlers, longPressDelay]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (e.changedTouches.length === 1) {
        touchEnd.current = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        };

        if (!touchStart.current || !touchEnd.current) return;

        const distanceX = touchStart.current.x - touchEnd.current.x;
        const distanceY = Math.abs(
          touchStart.current.y - touchEnd.current.y
        );

        // Only trigger swipe if horizontal movement is significant and vertical is minimal
        if (Math.abs(distanceX) > threshold && distanceY < 50) {
          if (distanceX > 0) {
            // Swiped left
            handlers.onSwipeLeft();
          } else {
            // Swiped right
            handlers.onSwipeRight();
          }
        }
      } else if (e.touches.length === 2 && handlers.onPinch) {
        // Handle pinch end
        const dx =
          e.touches[0].clientX - e.touches[1].clientX;
        const dy =
          e.touches[0].clientY - e.touches[1].clientY;
        const newDistance = Math.sqrt(dx * dx + dy * dy);
        const scale = newDistance / touchDistanceRef.current;
        handlers.onPinch(scale);
      }
    },
    [handlers, threshold]
  );

  useEffect(() => {
    const target = element.current;
    if (!target) return;

    target.addEventListener("touchstart", handleTouchStart, false);
    target.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      target.removeEventListener("touchstart", handleTouchStart);
      target.removeEventListener("touchend", handleTouchEnd);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [element, handleTouchStart, handleTouchEnd]);
}
