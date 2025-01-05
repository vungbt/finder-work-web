import { useState, useEffect } from 'react';

type ScrollYProps = {
  height?: number;
};

const useScrollToHeight = (props?: ScrollYProps) => {
  const height = props?.height ?? 92;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > height) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [height]);

  return isScrolled;
};

export default useScrollToHeight;
