'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function CollapsibleDescription({ text, limit = 80, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);

  // Set isMounted and responsive check after mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Collapse back on scroll-out (IntersectionObserver)
  useEffect(() => {
    if (!isMobile || !isMounted) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsExpanded(false);
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMobile, isMounted]);

  // If not mounted yet, render standard server-rendered paragraph to match hydration exactly
  if (!isMounted) {
    return <p className={className}>{text}</p>;
  }

  // If text is short or not mobile, render standard paragraph
  if (!text || text.length <= limit || !isMobile) {
    return <p className={className}>{text}</p>;
  }

  const displayText = isExpanded ? text : `${text.slice(0, limit)}...`;

  return (
    <p ref={containerRef} className={className}>
      {displayText}{' '}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[#047857] hover:text-emerald-500 font-extrabold text-[11px] underline ml-1 inline-block cursor-pointer transition focus:outline-none"
      >
        {isExpanded ? '[Less]' : '[More]'}
      </button>
    </p>
  );
}
