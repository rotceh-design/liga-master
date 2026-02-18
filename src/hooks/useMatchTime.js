import { useState, useEffect, useCallback } from 'react';

// Por defecto, iniciamos en 15 minutos (900 segundos)
export function useMatchTime(initialSeconds = 900) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      clearInterval(interval);
    }

    // Limpieza del intervalo para evitar fugas de memoria
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  // Controles del reloj
  const startTimer = useCallback(() => setIsRunning(true), []);
  const pauseTimer = useCallback(() => setIsRunning(false), []);
  const resetTimer = useCallback((newTime = initialSeconds) => {
    setIsRunning(false);
    setSecondsLeft(newTime);
  }, [initialSeconds]);
  
  // Función para que el comisionado edite el reloj manualmente si hay un error
  const setExactTime = useCallback((minutes, seconds) => {
    setSecondsLeft(minutes * 60 + seconds);
  }, []);

  // Formatear el tiempo a MM:SS para mostrarlo en pantalla
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return {
    secondsLeft,
    formattedTime,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setExactTime
  };
}