/**
 * Plays a premium arpeggiated success chime using the Web Audio API.
 * This is self-contained and does not require downloading external audio files.
 */
export const playSuccessChime = () => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Sound envelope: soft attack, quick decay, long smooth release
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Deluxe Major Arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1047Hz)
    playNote(523.25, now, 0.8);
    playNote(659.25, now + 0.08, 0.8);
    playNote(783.99, now + 0.16, 0.8);
    playNote(1046.50, now + 0.24, 1.2);
  } catch (error) {
    console.error("Audio chime playback failed:", error);
  }
};
