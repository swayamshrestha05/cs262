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
  gameId: number;
  playerID: number;
  score: number;
}

export const defaultGame: Game = {
  id: 0,
  time: "game not found",
};
