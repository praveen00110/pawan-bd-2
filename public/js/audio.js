// Romantic Audio Engine using Web Audio API
// Generates a soothing, warm acoustic piano/music box "Happy Birthday" melody + ambient chords
// and realistic cinematic sound effects (motorcycle rumble, letter rustle, candle blow, knife slice, celebratory chimes).

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.55;
    this.masterGain = null;
    this.currentMelodyTimer = null;
    this.currentNoteIndex = 0;
    this.audioInitialized = false;

    // F frequencies in Hz
    this.notes = {
      'C3': 130.81, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'Bb3': 233.08,
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00
    };

    // Melody: Note, Duration in beats, Chord in background
    this.score = [
      // "Happy Birthday to You"
      { note: 'C4', dur: 0.75, chord: ['F3', 'A3', 'C4'] },
      { note: 'C4', dur: 0.25 },
      { note: 'D4', dur: 1.0 },
      { note: 'C4', dur: 1.0 },
      { note: 'F4', dur: 1.0, chord: ['F3', 'C4', 'E4'] },
      { note: 'E4', dur: 2.0 },

      // "Happy Birthday to You"
      { note: 'C4', dur: 0.75, chord: ['C3', 'G3', 'Bb3'] },
      { note: 'C4', dur: 0.25 },
      { note: 'D4', dur: 1.0 },
      { note: 'C4', dur: 1.0 },
      { note: 'G4', dur: 1.0, chord: ['C3', 'E3', 'G3'] },
      { note: 'F4', dur: 2.0 },

      // "Happy Birthday Dear Tharushi..."
      { note: 'C4', dur: 0.75, chord: ['F3', 'A3', 'C4'] },
      { note: 'C4', dur: 0.25 },
      { note: 'C5', dur: 1.0, chord: ['D3', 'F3', 'A3'] },
      { note: 'A4', dur: 1.0 },
      { note: 'F4', dur: 1.0, chord: ['Bb3', 'D4', 'F4'] },
      { note: 'E4', dur: 1.0 },
      { note: 'D4', dur: 2.0 },

      // "Happy Birthday to You!"
      { note: 'Bb4', dur: 0.75, chord: ['Bb3', 'F4'] },
      { note: 'Bb4', dur: 0.25 },
      { note: 'A4', dur: 1.0, chord: ['F3', 'A3', 'C4'] },
      { note: 'F4', dur: 1.0 },
      { note: 'G4', dur: 1.0, chord: ['C3', 'G3', 'C4'] },
      { note: 'F4', dur: 2.5, chord: ['F3', 'A3', 'C4', 'F4'] },
      
      // Romantic Interlude / gentle arpeggio rest
      { note: null, dur: 1.5 }
    ];
  }

  init() {
    if (this.audioInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.audioInitialized = true;
    } catch (e) {
      console.warn('Web Audio could not initialize yet:', e);
    }
  }

  playPianoNote(freq, time, duration, gainLevel = 0.35, isBass = false) {
    if (!this.ctx || this.isMuted) return;

    // Harmonic richness (primary + subtle warm overtone)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = isBass ? 'triangle' : 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

    // Warm envelope
    noteGain.gain.setValueAtTime(0.001, time);
    noteGain.gain.exponentialRampToValueAtTime(gainLevel, time + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration + (isBass ? 1.5 : 0.8));

    // Subtle lowpass filter for silky soft acoustic tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBass ? 400 : 1800, time);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 1.8);
    osc2.stop(time + duration + 1.8);
  }

  startRomanticMelody() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;

    const tempo = 80; // Beats per minute (gentle romantic ballad)
    const beatDuration = 60 / tempo; // ~0.75 seconds per beat

    const playNext = () => {
      if (!this.isPlaying) return;

      const item = this.score[this.currentNoteIndex];
      const now = this.ctx.currentTime;
      const noteDuration = item.dur * beatDuration;

      // Play melody note
      if (item.note && this.notes[item.note]) {
        this.playPianoNote(this.notes[item.note], now, noteDuration, 0.4, false);
      }

      // Play soft background chord arpeggios
      if (item.chord) {
        item.chord.forEach((chNote, idx) => {
          if (this.notes[chNote]) {
            const chTime = now + (idx * 0.09);
            this.playPianoNote(this.notes[chNote], chTime, noteDuration * 1.5, 0.18, true);
          }
        });
      }

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.score.length;
      this.currentMelodyTimer = setTimeout(playNext, noteDuration * 1000);
    };

    playNext();
  }

  toggleMusic() {
    if (this.isMuted) {
      this.unmute();
      return true;
    } else {
      this.mute();
      return false;
    }
  }

  mute() {
    this.isMuted = true;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  unmute() {
    this.isMuted = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (!this.isPlaying) {
      this.startRomanticMelody();
    }
  }

  // CINEMATIC SFX

  // 1. Motorcycle Arrival Engine Hum
  playBikeSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Throaty twin engine rumble simulation
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc2.type = 'triangle';

    // Pitch rises as approaching, slows down when stopping
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 1.8);
    osc.frequency.exponentialRampToValueAtTime(32, now + 3.5);

    osc2.frequency.setValueAtTime(90, now);
    osc2.frequency.exponentialRampToValueAtTime(150, now + 1.8);
    osc2.frequency.exponentialRampToValueAtTime(64, now + 3.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 4.2);
    osc2.stop(now + 4.2);
  }

  // 2. Letter Unfolding / Rustle sound
  playLetterSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Soft white noise burst for paper sound
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
  }

  // 3. Candle Blow Sound (Gentle wind whoosh)
  playCandleBlowSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  // 4. Cake Slicing Chime
  playSliceSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // 5. Confetti & Celebration Chimes
  playCelebrationSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (idx * 0.08);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.9);
    });
  }
}

window.romanticAudio = new RomanticAudioEngine();
