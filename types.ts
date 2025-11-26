export interface IEnemy {
  id: string;
  position: [number, number, number];
  speed: number;
  hp?: number;
  isDead?: boolean;
}

export interface IHoneyDrop {
  id: string;
  position: [number, number, number];
}

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}
