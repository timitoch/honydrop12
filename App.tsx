import React from 'react';
import { GameScene } from './components/GameScene';
import { useGameStore } from './store';
import { GameStatus } from './types';
import { Heart, Droplet, Volume2, VolumeX } from 'lucide-react';
import { BackgroundMusic } from './components/BackgroundMusic';

const UI = () => {
    const score = useGameStore(state => state.score);
    const lives = useGameStore(state => state.lives);
    const status = useGameStore(state => state.status);
    const restartGame = useGameStore(state => state.restartGame);
    const isDamaged = useGameStore(state => state.isDamaged);
    const isMusicMuted = useGameStore(state => state.isMusicMuted);
    const toggleMusic = useGameStore(state => state.toggleMusic);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Red Damage Overlay */}
            {isDamaged && (
                <div
                    className="absolute inset-0 pointer-events-none animate-pulse"
                    style={{
                        background: 'radial-gradient(circle at center, transparent 30%, rgba(255, 0, 0, 0.4) 100%)',
                        animation: 'pulse 0.3s ease-in-out infinite'
                    }}
                />
            )}

            {/* Top HUD */}
            <div className="flex justify-between items-start">
                {/* Score */}
                <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 border-yellow-200 flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 rounded-full text-white">
                        <Droplet size={20} fill="currentColor" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-yellow-800 font-bold uppercase">Honey</span>
                        <span className="text-2xl font-black text-yellow-600">{score}</span>
                    </div>
                </div>

                {/* Lives */}
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <Heart
                            key={i}
                            size={32}
                            fill={i < lives ? "#ff6b6b" : "transparent"}
                            color={i < lives ? "#ff6b6b" : "#adb5bd"}
                            className={`transition-all duration-300 ${i < lives ? 'scale-100' : 'scale-75 opacity-50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Controls Hint */}
            {status === GameStatus.PLAYING && (
                <div className="absolute bottom-6 left-6 bg-black/10 backdrop-blur-sm p-3 rounded-lg text-white/80 text-sm font-bold">
                    WASD / ARROWS to Fly
                </div>
            )}

            {/* Music Toggle Button */}
            <div className="absolute bottom-6 right-6 pointer-events-auto">
                <button
                    onClick={toggleMusic}
                    className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-xl border-2 border-yellow-200 hover:scale-110 transition-transform active:scale-95"
                    aria-label={isMusicMuted ? "Unmute music" : "Mute music"}
                >
                    {isMusicMuted ? (
                        <VolumeX size={24} className="text-gray-600" />
                    ) : (
                        <Volume2 size={24} className="text-yellow-600" />
                    )}
                </button>
            </div>

            {/* Game Over Modal */}
            {status === GameStatus.GAME_OVER && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full transform transition-all animate-bounce-in">
                        <div className="text-6xl mb-4">😭</div>
                        <h2 className="text-3xl font-black text-gray-800 mb-2">Oh no! The bees!</h2>
                        <p className="text-gray-500 mb-6">You collected <span className="font-bold text-yellow-600 text-xl">{score}</span> honey drops.</p>

                        <button
                            onClick={() => restartGame()}
                            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

import { MainMenu } from './components/MainMenu';

export default function App() {
    const status = useGameStore(state => state.status);

    return (
        <>
            <BackgroundMusic />
            {status === GameStatus.MENU ? (
                <MainMenu />
            ) : (
                <>
                    <GameScene />
                    <UI />
                </>
            )}
        </>
    );
}