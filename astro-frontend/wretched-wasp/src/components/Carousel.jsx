// ... existing code ...
import React, { useState, useEffect, useRef } from "react";

export default function Carousel({ items }) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTime, setPauseTime] = useState(null);

  const DURATION = 10000; // 10 segundos

  useEffect(() => {
    if (!isPaused) {
      startAutoRotation();
    } else {
      clearInterval(intervalRef.current);
      clearInterval(progressIntervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressIntervalRef.current);
    };
  }, [current, isPaused]);

  const startAutoRotation = () => {
    let start = Date.now();
    let initialProgress = pauseTime || 0;
    setProgress(initialProgress);

    clearInterval(intervalRef.current);
    clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const newProgress = Math.min(initialProgress + (elapsed / DURATION) * 100, 100);
      setProgress(newProgress);
    }, 50);

    intervalRef.current = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setFade(false);
        setPauseTime(null);
      }, 800);
    }, ((1 - initialProgress / 100) * DURATION));
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    setPauseTime(progress);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No hay movidas raras aún.
      </div>
    );
  }

  const getImageUrl = (item) =>
    item.imagen?.startsWith("http")
      ? item.imagen
      : `http://127.0.0.1:8000${item.imagen}`;

  return (
    <div
      className="relative w-full max-w-5xl aspect-video flex items-center justify-center my-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <img
          src={getImageUrl(items[current])}
          alt={items[current].titulo}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-800 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
          style={{ aspectRatio: "16/9" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full px-0">
        <div
          className="h-3 bg-indigo-400 transition-all duration-100 linear rounded-b-2xl"
          style={{
            width: `${progress}%`,
            maxWidth: "100%",
            borderBottomLeftRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-2xl pointer-events-none">
        <h2 className="text-2xl font-bold text-white drop-shadow">
          {items[current].titulo}
        </h2>
        <p className="text-gray-200 mt-2">{items[current].descripcion}</p>
      </div>
    </div>
  );
}