export type Player = "X" | "O";

export type GameOver =
  | { type: "WINNER"; readonly player: Player }
  | { type: "DRAW" };

export type GameState =
  | { type: "GAME_OVER"; readonly gameOver: GameOver }
  | { type: "CONTINUE" };

export type Cell =
  | { type: "PLAYER"; readonly player: Player }
  | { type: "EMPTY" };

export type Board = ReadonlyArray<ReadonlyArray<Cell>>;

export const empty = (): Cell => ({ type: "EMPTY" } as const);

export const gameOver = (gameOver: GameOver): GameState =>
  ({
    type: "GAME_OVER",
    gameOver,
  } as const);

export const winner = (player: Player): GameOver =>
  ({
    type: "WINNER",
    player,
  } as const);

export const player = (player: Player): Cell =>
  ({ type: "PLAYER", player } as const);
