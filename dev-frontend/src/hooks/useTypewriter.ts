import { useEffect, useRef, RefObject } from 'react';

interface UseTypewriterOptions {
  ref: RefObject<HTMLElement>;
  speed?: number;
  startDelay?: number;
  observe?: boolean;
  showCaret?: boolean;
}

export const useTypewriter = ({
  ref,
  speed = 80,
  startDelay = 200,
  observe = false,
  showCaret = true
}: UseTypewriterOptions) => {
  const originalTextRef = useRef<string>('');
  const isTypingRef = useRef(false);
  const animationIdRef = useRef<number>();
  const timeoutIdRef = useRef<number>();
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Store original text for SSR
    originalTextRef.current = element.innerText;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const startTyping = () => {
      if (isTypingRef.current) return;
      isTypingRef.current = true;

      const text = originalTextRef.current;
      let currentIndex = 0;

      // Add caret class if enabled
      if (showCaret) {
        element.classList.add('tw-caret');
      }

      // Clear initial text
      element.innerText = '';

      const typeNextChar = () => {
        if (currentIndex < text.length) {
          element.innerText = text.slice(0, currentIndex + 1);
          currentIndex++;
          timeoutIdRef.current = window.setTimeout(typeNextChar, speed);
        } else {
          // Typing complete
          isTypingRef.current = false;
          if (!showCaret) {
            element.classList.remove('tw-caret');
          }
        }
      };

      // Start typing after delay
      timeoutIdRef.current = window.setTimeout(typeNextChar, startDelay);
    };

    if (observe) {
      // Use IntersectionObserver
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !isTypingRef.current) {
            startTyping();
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(element);
    } else {
      // Start immediately
      startTyping();
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      isTypingRef.current = false;
      if (element) {
        element.classList.remove('tw-caret');
        element.innerText = originalTextRef.current;
      }
    };
  }, [ref, speed, startDelay, observe, showCaret]);
};