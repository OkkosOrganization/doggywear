import { useState, useEffect } from 'react';
import { debounce } from 'ts-debounce';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    function handleResize(e?: Event) {
      const width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      const height = window.innerHeight;

      setWindowSize({
        width,
        height,
      });

      const detectTouch = () => {
        // Basic touch detection
        return (
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0
        );
      };

      if (!isTouchDevice) {
        if (width < 640 && detectTouch()) setIsTouchDevice(true);
      }
    }

    const debouncedResize = debounce(handleResize, 250);

    window.addEventListener('resize', debouncedResize);
    handleResize();

    return () => window.removeEventListener('resize', debouncedResize);
  }, [isTouchDevice]);

  return { width: windowSize.width, height: windowSize.height, isTouchDevice };
}
