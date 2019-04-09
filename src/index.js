import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderFirstSquare(i) {
    return (
      <Square
        value={this.props.history[0].squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderPrevSquare(i) {
    return (
      <Square
        value={this.props.history[this.props.history.length - 2].squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    console.log("xIsNext is", this.props.xIsNext);
    console.log("xLocation is", this.props.xLocation);
    console.log("history is", this.props.history);
    console.log(
      "finalWinner",
      finalWinner(this.props.xLocation, this.props.history)
    );

    //if (this.props.xIsNext !== true) {
    if (finalWinner(this.props.xLocation, this.props.history) === null) {
      return (
        <div>
          <div className="board-row">
            {this.renderFirstSquare(0)}
            {this.renderFirstSquare(1)}
            {this.renderFirstSquare(2)}
          </div>
          <div className="board-row">
            {this.renderFirstSquare(3)}
            {this.renderFirstSquare(4)}
            {this.renderFirstSquare(5)}
          </div>
          <div className="board-row">
            {this.renderFirstSquare(6)}
            {this.renderFirstSquare(7)}
            {this.renderFirstSquare(8)}
          </div>
        </div>
      );
    } else if (finalWinner(this.props.xLocation, this.props.history) !== null) {
      if (finalWinner(this.props.xLocation, this.props.history) === "X") {
        return (
          <div>
            <div className="board-row">
              {this.renderPrevSquare(0)}
              {this.renderPrevSquare(1)}
              {this.renderPrevSquare(2)}
            </div>
            <div className="board-row">
              {this.renderPrevSquare(3)}
              {this.renderPrevSquare(4)}
              {this.renderPrevSquare(5)}
            </div>
            <div className="board-row">
              {this.renderPrevSquare(6)}
              {this.renderPrevSquare(7)}
              {this.renderPrevSquare(8)}
            </div>
          </div>
        );
      } else if (
        finalWinner(this.props.xLocation, this.props.history) === "O"
      ) {
        return (
          <div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
      }
    }
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          scores: Array(2).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      xLocation: [],
      score: [0, 0],
      penalty: [{ squares: Array(9).fill(null) }]
    };
  }

  handleClick(i) {
    var history = this.state.history.slice(0, this.state.stepNumber + 1);
    var xLocation = this.state.xLocation.slice();
    const score = this.state.score.slice();
    var penalty = this.state.penalty.slice();
    if (gameWinner(score)) {
      return;
    }
    const winner = finalWinner(xLocation, penalty);

    if (!winner) {
      const current = penalty[penalty.length - 1];
      const squares = current.squares.slice();
      squares[i] = this.state.xIsNext ? "X" : "O";

      this.setState(
        {
          xIsNext: !this.state.xIsNext,
          xLocation: xLocation.concat([i]),
          penalty: penalty.concat([{ squares: squares }])
        },
        () => {
          var winner = finalWinner(this.state.xLocation, this.state.penalty);
          console.log("handleclick winner", winner);
          console.log("xlocation", this.state.xLocation);
          console.log("penalty", this.state.penalty);
          if (winner) {
            if (winner === "X") {
              this.setState(
                {
                  score: [score[0] + 1, score[1]]
                },
                () => {
                  this.setState({
                    history: history.concat([
                      {
                        scores: this.state.score
                      }
                    ]),
                    stepNumber: history.length
                  });
                }
              );
            } else if (winner === "O") {
              this.setState(
                {
                  score: [score[0], score[1] + 1]
                },
                () => {
                  this.setState({
                    history: history.concat([
                      {
                        scores: this.state.score
                      }
                    ]),
                    stepNumber: history.length
                  });
                }
              );
            }
          }
        }
      );
    } else if (winner) {
      const penalty = [{ squares: Array(9).fill(null) }];
      const current = penalty[penalty.length - 1];
      const squares = current.squares.slice();
      squares[i] = this.state.xIsNext ? "X" : "O";
      const xLUpgrade = [];
      this.setState({
        xIsNext: !this.state.xIsNext,
        xLocation: xLUpgrade.concat([i]),
        penalty: penalty.concat([{ squares: squares }])
      });
    }
  }

  jumpTo(step, history) {
    this.setState({
      stepNumber: step,
      xIsNext: true,
      xLocation: [],
      penalty: [{ squares: Array(9).fill(null) }],
      score: history[step].scores
    });
    console.log("xIsNext in jumpTo", this.state.xIsNext);
  }

  render() {
    const history = this.state.history;
    console.log("history Game render", history);
    console.log("stepNumber Game render", this.state.stepNumber);
    const penalty = this.state.penalty;
    console.log("penalty Game render", penalty);
    const current = penalty[penalty.length - 1];
    console.log("current Game render", current);
    const xLocation = this.state.xLocation;
    console.log("xLocation Game render", xLocation);
    var winner = finalWinner(xLocation, penalty);
    const score = this.state.score;
    console.log("score", score);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move, history)}>{desc}</button>
        </li>
      );
    });
    const gameVictor = gameWinner(score);
    console.log("gameWinner is ", gameVictor);
    let status;
    if (!gameVictor) {
      if (winner) {
        status = "Score: " + score;
      } else {
        status = "Next player" + (this.state.xIsNext ? "X" : "O");
      }
    } else if (gameVictor) {
      status = "The winner is: " + gameVictor;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            history={penalty}
            xIsNext={this.state.xIsNext}
            xLocation={xLocation}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function penaltyWinner(xLocation, history) {
  const xLocationCurrent = xLocation[xLocation.length - 1];
  const xLocationPrevious = xLocation[xLocation.length - 2];

  const current = history[history.length - 1];
  const squares = current.squares;
  const previous = history[history.length - 2];
  const prevSquares = previous.squares;
  if (xLocationCurrent === xLocationPrevious) {
    return squares[xLocationCurrent];
  } else if (xLocationCurrent !== xLocationPrevious) {
    return prevSquares[xLocationPrevious];
  }
}

function finalWinner(xLocation, history) {
  if (history.length > 2) {
    return penaltyWinner(xLocation, history);
  } else {
    return null;
  }
}

function gameWinner(score) {
  if (score[0] >= 3 || score[1] >= 3) {
    return score[0] >= 3 ? "X" : "O";
  } else {
    return null;
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
