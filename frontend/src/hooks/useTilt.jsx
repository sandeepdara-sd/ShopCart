import { useEffect, useRef } from 'react';

export function useTilt(maxTilt = 10) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * maxTilt;
      const rotateX = -((y - midY) / midY) * maxTilt;
      element.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const reset = () => {
      element.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', reset);
    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', reset);
    };
  }, [maxTilt]);

  return ref;
}


