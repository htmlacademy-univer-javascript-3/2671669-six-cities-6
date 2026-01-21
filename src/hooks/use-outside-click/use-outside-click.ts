import {RefObject, useEffect} from 'react';

export const useOutsideClick = (ref: RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        ref.current
        && event.target instanceof Element && event.target.isConnected
        && !ref.current.contains(event.target)
      ) {
        handler();
      }
    };
    document.body.addEventListener('click', handleClick);
    return () => document.body.removeEventListener('click', handleClick);
  }, [ref, handler]);
};
