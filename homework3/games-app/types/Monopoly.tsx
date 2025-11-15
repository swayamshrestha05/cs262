export interface Player {
  id: number;
  email: string;
  name: string;
}

export interface PlayerInput {
  email: string;
  name: string;
}

export interface Game {
  id: number;
  time: string;
}

export interface PlayerGame {
  gameID: number;
  playerID: number;
  score: number;
}

export interface GamePlayer {
  id?: number;
  name: string;
  score: number;
  email?: string;
}
