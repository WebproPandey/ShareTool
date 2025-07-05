// src/utils/gesture.js
import Hammer from "hammerjs";

export const useHammer = (ref, handlers = {}) => {
  if (!ref?.current) return;

  const hammer = new Hammer(ref.current);
  hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

  for (const [event, handler] of Object.entries(handlers)) {
    hammer.on(event, handler);
  }

  return () => hammer.destroy();
};
