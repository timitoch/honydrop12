import { create } from 'zustand';
import { IEnemy, IHoneyDrop, GameStatus } from './types';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface GameState {
  // Game Status
  status: GameStatus;
  setStatus: (status: GameStatus) => void;

  // Player
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  lives: number;
  takeDamage: () => void;
  isDamaged: boolean;
  setIsDamaged: (damaged: boolean) => void;

  // Enemies
  enemies: IEnemy[];
  damageEnemy: (id: string, damage: number) => void;
  updateEnemyPosition: (id: string, position: [number, number, number]) => void;

  // Items
  honeyDrops: IHoneyDrop[];
  collectHoney: (id: string) => void;

  score: number;
  restartGame: () => void;

  // Music
  isMusicMuted: boolean;
  toggleMusic: () => void;
}

const INITIAL_LIVES = 3;

export const useGameStore = create<GameState>((set, get) => ({
  status: GameStatus.MENU,
  setStatus: (status) => set({ status }),

  playerPos: [0, 2, 0],
  setPlayerPos: (pos) => set({ playerPos: pos }),

  lives: INITIAL_LIVES,
  score: 0,
  isDamaged: false,
  setIsDamaged: (damaged) => set({ isDamaged: damaged }),

  isMusicMuted: false,
  toggleMusic: () => set((state) => ({ isMusicMuted: !state.isMusicMuted })),

  takeDamage: () => {
    const { lives, status } = get();
    if (status !== GameStatus.PLAYING) return;

    const newLives = Math.max(0, lives - 1);
    set({ lives: newLives });

    if (newLives === 0) {
      set({ status: GameStatus.GAME_OVER });
    }
  },

  enemies: [],
  damageEnemy: (id, damage) => set((state) => {
    const updatedEnemies = state.enemies.map(e => {
      if (e.id === id) {
        const hp = (e.hp ?? 100) - damage;
        return { ...e, hp, isDead: hp <= 0 };
      }
      return e;
    });
    return { enemies: updatedEnemies };
  }),
  updateEnemyPosition: (id, position) => set((state) => {
    const updatedEnemies = state.enemies.map(e => {
      if (e.id === id) {
        return { ...e, position };
      }
      return e;
    });
    return { enemies: updatedEnemies };
  }),


  honeyDrops: [],

  collectHoney: (id) => set((state) => {
    if (state.status !== GameStatus.PLAYING) return {};

    // Remove collected, add new one at random pos to keep game going
    const remaining = state.honeyDrops.filter(h => h.id !== id);
    const newDrop: IHoneyDrop = {
      id: generateId(),
      position: [(Math.random() - 0.5) * 30, 1, (Math.random() - 0.5) * 30]
    };

    return {
      honeyDrops: [...remaining, newDrop],
      score: state.score + 10
    };
  }),

  restartGame: () => {
    // Generate initial state
    const enemies: IEnemy[] = [];
    for (let i = 0; i < 5; i++) {
      enemies.push({
        id: generateId(),
        position: [(Math.random() - 0.5) * 25, 0.5, (Math.random() - 0.5) * 25],
        speed: 2 + Math.random() * 2,
        hp: 100,
        isDead: false
      });
    }

    const honeyDrops: IHoneyDrop[] = [];
    for (let i = 0; i < 10; i++) {
      honeyDrops.push({
        id: generateId(),
        position: [(Math.random() - 0.5) * 30, 1, (Math.random() - 0.5) * 30]
      });
    }

    set({
      status: GameStatus.PLAYING,
      lives: INITIAL_LIVES,
      score: 0,
      playerPos: [0, 2, 0],
      enemies,
      honeyDrops
    });
  }
}));