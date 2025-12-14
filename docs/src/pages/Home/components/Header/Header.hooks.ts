import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 1;

export function useScrollDetection() {
  const [isYScroll, setIsYScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsYScroll(window.scrollY >= SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isYScroll;
}
