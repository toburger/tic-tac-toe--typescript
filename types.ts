export type Player = "X" | "O";

export type GameOver = { type: "WINNER"; player: Player } | { type: "DRAW" };

export type GameState =
  | { type: "GAME_OVER"; gameOver: GameOver }
  | { type: "CONTINUE" };

export type Cell = { type: "PLAYER"; player: Player } | { type: "EMPTY" };

export type Board = Cell[][];

export const empty = (): Cell => ({ type: "EMPTY" });

export const gameOver = (gameOver: GameOver): GameState => ({
  type: "GAME_OVER",
  gameOver,
});

export const winner = (player: Player): GameOver => ({
  type: "WINNER",
  player,
});

export const player = (player: Player): Cell => ({ type: "PLAYER", player });
