import { boardRows, boardCols } from "const";
import { useRecoilState } from "recoil";
import { boardState, gameOverState, playerState } from "state";

const testWin = (arr: number[]): boolean => /1{4}|2{4}/.test(arr.join(""));

interface Position {
  row: number;
  column: number;
}
interface BoardSize {
  vertical: number;
  horizontal: number;
}

const isInvalidPosition = (elementPosition: Position, board: BoardSize) =>
  elementPosition.column < 0 ||
  elementPosition.row < 0 ||
  elementPosition.column > board.horizontal - 1 ||
  elementPosition.row > board.vertical - 1;

const usePlayPiece = () => {
  const [board, setBoard] = useRecoilState(boardState);
  const [player, setPlayerTurn] = useRecoilState(playerState);
  const [gameOver, setGameOver] = useRecoilState(gameOverState);

  return (col: number) => {
    // Prevent adding a piece when the game is over
    if (gameOver) {
      return;
    }

    // Prevent adding a piece when the column is full
    if (board[col].length === boardRows) {
      return;
    }

    // Play piece (non mutating)
    const newBoard = board.map((column, i) => {
      return i === col ? [...column, player] : column;
    });

    const row = newBoard[col].length - 1;

    const getAllPossibleDiagonals = (flip: boolean) => {
      const VICTORY_CONDITION = 4;
      const flipConst = flip ? -1 : 1;
      let initialCol = col - flipConst * (VICTORY_CONDITION - 1);
      let initialRow = row - (VICTORY_CONDITION - 1);
      const initialPosition: Position = {
        row: initialRow,
        column: initialCol,
      };
      while (
        isInvalidPosition(initialPosition, {
          vertical: boardRows,
          horizontal: boardCols,
        })
      ) {
        initialPosition.row++;
        initialPosition.column = initialPosition.column + flipConst;
      }
      let diagonalSegment: Position[] = [];
      let allPossibleDiagonals = [];

      for (let offSet = 0; offSet < VICTORY_CONDITION; offSet++) {
        let column = initialPosition.column + flipConst * offSet;
        let row = initialPosition.row + offSet;
        let currentPosition: Position = {
          column,
          row,
        };
        if (
          isInvalidPosition(currentPosition, {
            vertical: boardRows,
            horizontal: boardCols,
          })
        ) {
          return [];
        }
        diagonalSegment.push(currentPosition);
      }
      let [, , , lastValidPosition] = diagonalSegment;
      while (
        !isInvalidPosition(lastValidPosition, {
          vertical: boardRows,
          horizontal: boardCols,
        })
      ) {
        allPossibleDiagonals.push(
          diagonalSegment.map(
            (position) => newBoard[position.column][position.row]
          )
        );
        diagonalSegment = diagonalSegment.map((position) => ({
          column: position.column + flipConst,
          row: position.row + 1,
        }));
        [, , , lastValidPosition] = diagonalSegment;
      }
      return allPossibleDiagonals;
    };

    if (
      testWin(newBoard[col]) || // Did win vertically
      testWin(newBoard.map((col) => col[row] || 0)) || // Did win horizontally
      getAllPossibleDiagonals(true).some((diagonal) => testWin(diagonal)) || //  Did win diagonally from bottom right to top left
      getAllPossibleDiagonals(false).some((diagonal) => testWin(diagonal)) //  Did win diagonally  from bottom left to top right
    ) {
      setGameOver(true);
    } else {
      setPlayerTurn(player === 1 ? 2 : 1);
    }
    setBoard(newBoard);
  };
};

export default usePlayPiece;
