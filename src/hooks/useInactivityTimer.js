import { useState, useEffect, useCallback, useRef } from 'react';

const useInactivityTimer = (timeout = 10000) => { // 10 секунд по умолчанию
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isInactiveRef = useRef(false);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsInactive(false);
    isInactiveRef.current = false;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setIsInactive(true);
      isInactiveRef.current = true;
    }, timeout);
  }, [timeout]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsInactive(false);
    isInactiveRef.current = false;
  }, []);

  const startTimer = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const events = [
      'mousedown',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const handleActivity = (event) => {
      // Не сбрасываем таймер, если модальное окно открыто и клик происходит внутри него
      if (isInactiveRef.current) {
        const modalElement = document.querySelector('.inactivity-dialog');
        if (modalElement && modalElement.contains(event.target)) {
          return; // Игнорируем клики внутри модального окна
        }
      }
      resetTimer();
    };

    // Добавляем слушатели событий
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Запускаем таймер
    startTimer();

    // Очистка при размонтировании
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer, startTimer]);

  return {
    isInactive,
    resetTimer,
    stopTimer,
    startTimer
  };
};

export default useInactivityTimer;