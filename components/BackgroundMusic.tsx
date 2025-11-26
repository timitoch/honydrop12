import { useEffect, useRef } from 'react';
import { useGameStore } from '../store';

export const BackgroundMusic = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isMusicMuted = useGameStore((state) => state.isMusicMuted);

    useEffect(() => {
        // Create audio element
        const audio = new Audio('/backgroundsong.mp3');
        audio.loop = true;
        audio.volume = 0.3; // Set volume to 30% (gentle background music)
        audioRef.current = audio;

        // Try to play - might be blocked by browser autoplay policy
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented. Music will start on first user interaction.');

                // Add click handler to start music on first user interaction
                const startMusic = () => {
                    audio.play();
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic);
            });
        }

        // Cleanup
        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Handle mute/unmute
    useEffect(() => {
        if (audioRef.current) {
            if (isMusicMuted) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => {
                    // Ignore errors if user hasn't interacted yet
                });
            }
        }
    }, [isMusicMuted]);

    return null; // This component doesn't render anything
};
