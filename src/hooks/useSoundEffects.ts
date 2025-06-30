import { useCallback, useRef } from 'react';

export const useSoundEffects = (enabled: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!enabled) return;
    
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [enabled, getAudioContext]);

  const playMoveSound = useCallback(() => {
    playTone(800, 0.1, 'square');
  }, [playTone]);

  const playWinSound = useCallback(() => {
    // Victory fanfare
    playTone(523, 0.2); // C
    setTimeout(() => playTone(659, 0.2), 100); // E
    setTimeout(() => playTone(784, 0.4), 200); // G
  }, [playTone]);

  const playDrawSound = useCallback(() => {
    playTone(400, 0.3, 'sawtooth');
  }, [playTone]);

  const playButtonSound = useCallback(() => {
    playTone(600, 0.05, 'square');
  }, [playTone]);

  return {
    playMoveSound,
    playWinSound,
    playDrawSound,
    playButtonSound
  };
};