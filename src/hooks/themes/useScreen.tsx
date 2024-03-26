'use client';
import { useEffect, useState } from 'react';

export const ScreenConfig = {
  xs: 0,
  sm: 560,
  md: 740,
  lg: 1024,
  xl: 1300,
  '2xl': 1536,
  '3xl': 1728
};

export type ScreenConfigKey = keyof typeof ScreenConfig;

export type Screen = {
  sizes: Record<ScreenConfigKey, boolean>;
  width: number;
  height: number;
  isMobile: boolean;
};

const initSizes = {
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  '2xl': false,
  '3xl': false
};

const initState = {
  width: 0,
  height: 0,
  isMobile: true,
  sizes: initSizes
};

export default function useScreen() {
  const [screen, setScreen] = useState(initState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const { innerWidth: width, innerHeight: height } = window;
        const newSizes = { ...initSizes };
        Object.keys(ScreenConfig).forEach((key) => {
          const newKey = key as ScreenConfigKey;
          if (ScreenConfig[newKey] <= innerWidth) {
            newSizes[newKey] = true;
          } else {
            newSizes[newKey] = false;
          }
        });
        setScreen({ sizes: newSizes, width, height, isMobile: !newSizes.md });
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return screen;
}
