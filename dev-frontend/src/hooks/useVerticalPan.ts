import { useRef, useCallback, useEffect, RefObject, useState } from 'react';

interface UseVerticalPanReturn {
  containerProps: {
    ref: RefObject<HTMLDivElement>;
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    className: string;
  };
  imageProps: {
    ref: RefObject<HTMLImageElement>;
    className: string;
    draggable: false;
  };
}

export const useVerticalPan = (): UseVerticalPanReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use refs for values that don't need re-renders
  const offsetY = useRef(0);
  const velocityY = useRef(0);
  const lastPointerY = useRef(0);
  const lastTimestamp = useRef(0);
  const animationFrame = useRef<number>();
  const isDraggingRef = useRef(false);

  const getImageDimensions = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return null;
    
    const container = containerRef.current;
    const img = imgRef.current;
    
    if (!img.naturalWidth || !img.naturalHeight) return null;
    
    const containerHeight = container.clientHeight;
    const containerWidth = container.clientWidth;
    
    // Calculate scaled height based on natural dimensions
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    const scaledHeight = containerWidth * aspectRatio;
    
    return {
      containerHeight,
      scaledHeight,
      canPan: scaledHeight > containerHeight
    };
  }, []);

  const clampOffset = useCallback((newOffsetY: number) => {
    const dimensions = getImageDimensions();
    if (!dimensions || !dimensions.canPan) return 0;
    
    const { containerHeight, scaledHeight } = dimensions;
    const minY = containerHeight - scaledHeight;
    const maxY = 0;
    
    return Math.max(minY, Math.min(maxY, newOffsetY));
  }, [getImageDimensions]);

  const updateImageTransform = useCallback((y: number) => {
    if (imgRef.current) {
      imgRef.current.style.transform = `translateY(${y}px)`;
    }
  }, []);

  const startInertia = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    
    const animate = () => {
      const dimensions = getImageDimensions();
      if (!dimensions || !dimensions.canPan) return;
      
      const currentOffset = offsetY.current;
      const newOffsetY = clampOffset(currentOffset + velocityY.current);
      
      // Check if we hit boundaries and stop momentum
      if (newOffsetY === currentOffset) {
        velocityY.current = 0;
        return;
      }
      
      offsetY.current = newOffsetY;
      velocityY.current *= 0.92; // Smoother decay
      
      updateImageTransform(newOffsetY);
      
      // Continue animation if velocity is significant
      if (Math.abs(velocityY.current) > 0.3) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrame.current = requestAnimationFrame(animate);
  }, [clampOffset, getImageDimensions, updateImageTransform]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const dimensions = getImageDimensions();
    if (!dimensions || !dimensions.canPan) return;
    
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    
    isDraggingRef.current = true;
    setIsDragging(true);
    lastPointerY.current = e.clientY;
    lastTimestamp.current = Date.now();
    velocityY.current = 0;
    
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  }, [getImageDimensions]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    e.preventDefault();
    
    const deltaY = e.clientY - lastPointerY.current;
    const deltaTime = Date.now() - lastTimestamp.current;
    
    // Update velocity for momentum (smoother calculation)
    if (deltaTime > 0) {
      velocityY.current = (deltaY / deltaTime) * 16; // Normalize to ~60fps
    }
    
    const newOffsetY = clampOffset(offsetY.current + deltaY);
    offsetY.current = newOffsetY;
    
    // Directly update transform without React re-render
    updateImageTransform(newOffsetY);
    
    lastPointerY.current = e.clientY;
    lastTimestamp.current = Date.now();
  }, [clampOffset, updateImageTransform]);

  const handlePointerEnd = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
    setIsDragging(false);
    
    // Start momentum animation
    startInertia();
  }, [startInertia]);

  // Reset on image load
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    
    const handleLoad = () => {
      offsetY.current = 0;
      updateImageTransform(0);
    };
    
    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, [updateImageTransform]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    containerProps: {
      ref: containerRef,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
      className: `overflow-hidden relative select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`
    },
    imageProps: {
      ref: imgRef,
      className: "w-full h-auto select-none pointer-events-none",
      draggable: false
    }
  };
};