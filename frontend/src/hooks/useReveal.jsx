import { useEffect, useRef } from 'react';

export function useReveal(options = { threshold: 0.1, rootMargin: '0px' }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.style.opacity = 0;
    element.style.transform = 'translateY(18px)';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.style.transition = 'opacity .6s ease, transform .6s ease';
          element.style.opacity = 1;
          element.style.transform = 'translateY(0)';
          observer.unobserve(element);
        }
      });
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}


