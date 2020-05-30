// This lib contains powerful functions for list transformations.
import * as R from "ramda";
import {
  Board,
  Cell,
  gameOver,
  winner,
  player,
  GameState,
  empty,
} from "./types";

/**
 * Helps debugging the board
 */
export const logBoard = (board: Board): Board => {
  console.table(board);
  return board;
};

/**
 * Updates a single board value by x and y coordinates and returns the modified board.
 * Leaves the original board unchanged.
 */
export const updateBoard = (
  board: Board,
  x: number,
  y: number,
  value: Cell
): Board => R.assocPath<Cell, Board>([x, y], value)(board);

/**
 * Gets a single board value by x and y coordinates
 */
export const getCell = (board: Board, x: number, y: number): Cell | null =>
  R.path<Cell>([x, y])(board) || null;

/**
 * Checks if a board value can be updated (simply checks if the board contains null)
 */
export const canUpdateCell = (board: Board, x: number, y: number): boolean =>
  R.equals(getCell(board, x, y), empty());

/**
 * Checks if all elements a row contain the same value 'v'.
 * Checks all three rows.
 */
const checkRowsForWinner = (board: Board, cell: Cell): boolean => {
  const check = R.all(R.equals(cell));
  return check(board[0]) || check(board[1]) || check(board[2]);
};

/**
 * Cheks if all elements of a column contain the same value 'v'.
 * Checks all three columns.
 *
 * Uses a simple trick by transposing the board so that the whole board
 * gets rotated and the columns become rows. Then the "rows" can be passed
 * to checkRowsForWinner
 */
const checkColsForWinner = (board: Board, cell: Cell): boolean => {
  const transposedBoard = R.transpose(board);
  return checkRowsForWinner(transposedBoard, cell);
};

/**
 * Checks if all elements of a diagnola contain the same value 'v'.
 * Checks the two diagonals.
 */
const checkDiagonalsForWinner = (board: Board, cell: Cell): boolean => {
  const diag1 = [board[0][0], board[1][1], board[2][2]];
  const diag2 = [board[2][0], board[1][1], board[0][2]];
  const check = R.all(R.equals(cell));
  return check(diag1) || check(diag2);
};

/**
 * Checks if any one of the
 * * rows
 * * columns
 * * diagonals
 * of the board contain the same value 'v'.
 */
const checkForWinner = (board: Board, cell: Cell): boolean =>
  checkRowsForWinner(board, cell) ||
  checkColsForWinner(board, cell) ||
  checkDiagonalsForWinner(board, cell);

/**
 * Checks if the game is a draw
 *
 * It does check if all of the boards aren't null.
 */
const checkForDraw = (board: Board): boolean => {
  const check = R.all<Cell>((x) => !R.equals(x, { type: "EMPTY" }));
  return check(R.flatten(board));
};

/**
 * Determines either the winner or a draw.
 * If null is returned the game continues.
 */
export const getWinner = (board: Board): GameState => {
  if (checkForWinner(board, player("X")))
    // player X wins!
    return gameOver(winner("X"));
  else if (checkForWinner(board, player("O")))
    // player O wins!
    return gameOver(winner("O"));
  else if (checkForDraw(board))
    // it'a a draw!
    return { type: "GAME_OVER", gameOver: { type: "DRAW" } };
  else return { type: "CONTINUE" };
};
