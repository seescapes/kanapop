/**
 * Audio Engine: Web Audio API Procedural Synthesizer + SpeechSynthesis (TTS)
 * Zero external audio files required! Works 100% offline with zero latency.
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.sfxEnabled = true;
    this.voiceEnabled = true;
    this.japaneseVoice = null;

    this.initAudioContext();
    this.initVoices();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initVoices() {
    if (!('speechSynthesis' in window)) return;

    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      this.japaneseVoice = voices.find(v => v.lang.startsWith('ja')) || null;
    };

    findVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = findVoice;
    }
  }

  /**
   * Speak Japanese Kana character
   */
  speak(kana) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(kana);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.5; // A single kana is very short at normal speed
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      if (this.japaneseVoice) {
        utterance.voice = this.japaneseVoice;
      }
      // Speaking immediately after cancel() can clip the start in Chrome/Safari
      clearTimeout(this.speakTimer);
      this.speakTimer = setTimeout(() => window.speechSynthesis.speak(utterance), 60);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }

  /**
   * Procedural Bubble Pop sound
   */
  playPop() {
    if (!this.sfxEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Fast pitch sweep (bubble pop effect)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency drops rapidly like a bubble burst
    osc.frequency.setValueAtTime(450 + Math.random() * 100, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * Play Correct Chime (Pitch scales with combo)
   */
  playCorrect(combo = 1) {
    if (!this.sfxEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Pitch rises based on combo (up to a ceiling)
    const baseFreq = 523.25; // C5
    const semitones = Math.min(combo - 1, 12);
    const fundamental = baseFreq * Math.pow(2, semitones / 12);

    // Two-tone bell chime
    [fundamental, fundamental * 1.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.05 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.35);
    });
  }

  /**
   * Play Wrong Buzzer
   */
  playWrong() {
    if (!this.sfxEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Dissonant low frequencies
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(150, now);
    osc2.frequency.setValueAtTime(142, now); // slightly detuned for buzzer feel

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }

  /**
   * Combo Level-up fanfare
   */
  playComboStreak() {
    if (!this.sfxEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.2, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  /**
   * Game Over sound
   */
  playGameOver() {
    if (!this.sfxEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.25, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.35);
    });
  }
}

export const soundCtrl = new SoundController();
