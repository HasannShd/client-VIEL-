import './Widgets.css';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    let isPastThreshold = window.scrollY > 520;

    setVisible(isPastThreshold);

    const updateVisibleState = () => {
      animationFrame = 0;
      const nextIsPastThreshold = window.scrollY > 520;

      if (nextIsPastThreshold !== isPastThreshold) {
        isPastThreshold = nextIsPastThreshold;
        setVisible(nextIsPastThreshold);
      }
    };

    const onScroll = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateVisibleState);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
    >
      <ArrowUp size={22} />
    </button>
  );
}
