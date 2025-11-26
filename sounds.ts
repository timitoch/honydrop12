// Simple sound effects using Web Audio API
// No external files needed - sounds are synthesized programmatically

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

/**
 * Play a gentle, soft bell sound for collecting honey
 */
export const playCollectSound = () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create a soft, bell-like chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Soft ascending notes (E -> G -> B) - gentle and sweet
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.04); // G5
    osc.frequency.setValueAtTime(987.77, now + 0.08); // B5

    osc.type = 'triangle'; // Softer than sine

    // Very gentle envelope - reduced volume
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.01); // Much quieter
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
};

/**
 * Play a gentle buzzing sound for taking damage (bee getting startled)
 */
export const playDamageSound = () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create gentle bee buzz (startled bee sound)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    // Gentle, higher frequency buzzing (like a small bee)
    osc1.frequency.setValueAtTime(380, now); // Higher, gentler
    osc1.frequency.linearRampToValueAtTime(320, now + 0.15);
    osc1.type = 'triangle'; // Much softer than sawtooth

    osc2.frequency.setValueAtTime(385, now); // Slight detune for natural buzz
    osc2.frequency.linearRampToValueAtTime(325, now + 0.15);
    osc2.type = 'triangle';

    // Gentle envelope - very reduced volume
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.01); // Much quieter
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2); // Shorter, gentler

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.2);
    osc2.stop(now + 0.2);
};
