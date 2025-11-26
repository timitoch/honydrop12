import React from 'react';
import { useGameStore } from '../store';
import { GameStatus } from '../types';
import { Play, Trophy, Info } from 'lucide-react';

export const MainMenu: React.FC = () => {
    const setStatus = useGameStore(state => state.setStatus);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-orange-300 to-yellow-500 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center gap-12 p-12">

                {/* Title Section */}
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-8xl font-black text-white tracking-wider drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                        style={{ textShadow: '4px 4px 0px #e67700' }}>
                        HONEY
                    </h1>
                    <h1 className="text-8xl font-black text-white tracking-wider drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                        style={{ textShadow: '4px 4px 0px #e67700' }}>
                        DROP
                    </h1>
                    <div className="mt-4 px-6 py-2 bg-white/30 backdrop-blur-sm rounded-full border border-white/50">
                        <span className="text-white font-bold tracking-widest text-sm uppercase">Bee Adventure Game</span>
                    </div>
                </div>

                {/* Menu Buttons */}
                <div className="flex flex-col gap-4 w-64">
                    <button
                        onClick={() => setStatus(GameStatus.PLAYING)}
                        className="group relative flex items-center justify-center gap-3 bg-white hover:bg-yellow-50 text-orange-500 font-black text-xl py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        PLAY
                    </button>

                    <div className="flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 text-white font-bold py-3 px-4 rounded-xl backdrop-blur-sm transition-all duration-300">
                            <Trophy className="w-5 h-5" />
                            <span className="text-sm">Score</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 text-white font-bold py-3 px-4 rounded-xl backdrop-blur-sm transition-all duration-300">
                            <Info className="w-5 h-5" />
                            <span className="text-sm">About</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-white/60 text-sm font-medium">
                Press Start to Collect Honey 🍯
            </div>
        </div>
    );
};
