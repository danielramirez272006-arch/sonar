import { useEffect, useRef } from 'react';

export function usePageScroll(path) {
  const page = path.toLowerCase().replace(/^[#/]/, '').split('?')[0];
  const previous = useRef(page);
  useEffect(() => {
    if (previous.current === page) return;
    previous.current = page;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);
}
