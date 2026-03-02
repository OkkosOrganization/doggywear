'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Analytics } from '@vercel/analytics/react';
import { debounce } from 'ts-debounce';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ww, setWw] = useState<number>(0);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const detectTouch = () => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  };

  useEffect(() => {
    //RESIZING
    const handleResize = (e?: Event) => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      const currentWw = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      setWw(currentWw);
      if (!isTouchDevice) {
        if (currentWw < 768 && detectTouch()) setIsTouchDevice(true);
      }
    };

    const debounced = debounce(handleResize, 250);

    window.addEventListener('resize', debounced);
    handleResize();

    return () => {
      window.removeEventListener('resize', debounced);
    };
  }, [isTouchDevice]);

  return (
    <>
      <Analytics />
      <Layout ww={ww}>{children}</Layout>
    </>
  );
}
