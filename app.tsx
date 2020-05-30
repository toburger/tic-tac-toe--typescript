import React, { useReducer, memo } from "react";
import ReactDOM from "react-dom";
import * as GameLogic from "./gameLogic";
import "./app.css";
import {
  Board,
  Player,
  Cell,
  GameOver,
  GameState,
  empty,
  player,
} from "./types";

// import PlayerXImage from "./assets/PlayerX.svg";
// import PlayerOImage from "./assets/PlayerO.svg";
// import RestartImage from "./assets/restart.png";
const PlayerXImage = require("./assets/PlayerX.svg");
const PlayerOImage = require("./assets/PlayerO.svg");
const RestartImage = require("./assets/restart.png");

interface State {
  board: Board;
  currentPlayer: Player;
  winner: GameState;
}

type OnMove = (x: number, y: number) => void;

type Action = { type: "MOVE"; x: number; y: number } | { type: "RESTART" };

const initialState: State = {
  board: [
    [empty(), empty(), empty()],
    [empty(), empty(), empty()],
    [empty(), empty(), empty()],
  ],
  currentPlayer: "X",
  winner: { type: "CONTINUE" },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "MOVE":
      if (!GameLogic.canUpdateCell(state.board, action.x, action.y))
        return state;
      const newBoard = GameLogic.updateBoard(
        state.board,
        action.x,
        action.y,
        player(state.currentPlayer)
      );
      const winner = GameLogic.getWinner(newBoard);
      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === "X" ? "O" : "X",
        winner,
      };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
};

const prefetchImages = () =>
  [PlayerXImage, PlayerOImage, RestartImage].map((img) => (
    <link key={img} rel="prefetch" href={img} />
  ));

const PlayerX = ({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    {...props}
    alt="PlayerX"
    src={PlayerXImage}
    className={["PlayerX", className].join(" ")}
  />
);
const PlayerO = ({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    {...props}
    alt="PlayerO"
    src={PlayerOImage}
    className={["PlayerO", className].join(" ")}
  />
);
const NoPlayer = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <span {...props} className="NoPlayer" />
);

interface CellProps {
  value: Cell;
  x: number;
  y: number;
  onMove: OnMove;
}

const Cell = memo(({ value, x, y, onMove }: CellProps) => {
  const Child = () => {
    switch (value.type) {
      case "PLAYER":
        switch (value.player) {
          case "X":
            return <PlayerX />;
          case "O":
            return <PlayerO />;
        }
      case "EMPTY":
        return <NoPlayer />;
    }
  };
  return (
    <button
      className="Cell"
      disabled={value.type !== "EMPTY"}
      onClick={(e) => onMove(x, y)}
    >
      <Child />
    </button>
  );
});

const DispatchPlayer = ({ player }: { player: Player }) =>
  player === "X" ? (
    <PlayerX className="PlayerX--Small" />
  ) : (
    <PlayerO className="PlayerO--Small" />
  );

const CurrentPlayer = ({ currentPlayer }: { currentPlayer: Player }) => (
  <div className="CurrentPlayer">
    <span className="CurrentPlayer__Text">
      Player:
      <DispatchPlayer player={currentPlayer} />
    </span>
  </div>
);

const Board = ({ board, onMove }: { board: Board; onMove: OnMove }) => (
  <div>
    {board.map((ys, x) => (
      <div key={`${x}`} className="Board__Row">
        {ys.map((v, y) => (
          <Cell key={`${x}-${y}`} {...{ board, value: v, x, y, onMove }} />
        ))}
      </div>
    ))}
  </div>
);

const Game = ({
  board,
  onMove,
  currentPlayer,
}: {
  board: Board;
  onMove: OnMove;
  currentPlayer: Player;
}) => (
  <div>
    <Board board={board} onMove={onMove} />
    <CurrentPlayer currentPlayer={currentPlayer} />
  </div>
);

const GameOver = ({
  winner,
  onRestart,
}: {
  winner: GameOver;
  onRestart: () => void;
}) => (
  <div className="GameOver">
    <img
      className="GameOver__Image"
      onClick={(e) => onRestart()}
      src={RestartImage}
      alt="Restart"
    />
    <p className="GameOver__Text">
      {winner.type === "DRAW" ? (
        "It's a draw!"
      ) : (
        <span>
          Player
          <DispatchPlayer player={winner.player} />
          wins!
        </span>
      )}
    </p>
  </div>
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      {prefetchImages()}
      {state.winner.type === "GAME_OVER" ? (
        <GameOver
          winner={state.winner.gameOver}
          onRestart={() => dispatch({ type: "RESTART" })}
        />
      ) : (
        <Game
          board={state.board}
          currentPlayer={state.currentPlayer}
          onMove={(x, y) => dispatch({ type: "MOVE", x, y })}
        />
      )}
    </div>
  );
};

// export default App;

ReactDOM.render(<App />, document.getElementById("root"));
