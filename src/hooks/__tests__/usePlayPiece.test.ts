import { act, renderHook } from "@testing-library/react";
import { usePlayPiece } from "hooks";
import { RecoilRoot, useRecoilValue } from "recoil";
import { boardState, gameOverState, playerState } from "state";
import { Board, Player } from "types";

const render = () => {
  const { result } = renderHook(
    () => ({
      play: usePlayPiece(),
      board: useRecoilValue(boardState),
      player: useRecoilValue(playerState),
      gameOver: useRecoilValue(gameOverState),
    }),
    {
      wrapper: RecoilRoot,
    }
  );

  return {
    result,
    play: (col: number) => {
      act(() => result.current.play(col));
    },
    assertGame: (player: Player, gameOver: boolean, board: Board) => {
      expect(result.current.board).toEqual(board);
      expect(result.current.player).toEqual(player);
      expect(result.current.gameOver).toEqual(gameOver);
    },
  };
};

test("should win with 4 in a row vertically", () => {
  const { play, assertGame } = render();

  [0, 1, 0, 1, 0, 1, 0].forEach(play);

  // Player 1 won the game!
  assertGame(1, true, [[1, 1, 1, 1], [2, 2, 2], [], [], [], [], []]);

  play(1);
  // Can't play any more pieces after the game is over
  assertGame(1, true, [[1, 1, 1, 1], [2, 2, 2], [], [], [], [], []]);
});

test("should win with 4 in a row horizontally", () => {
  const { play, assertGame } = render();

  [0, 6, 1, 6, 3, 6, 4, 5, 2].forEach(play);

  // Player 1 won the game!
  assertGame(1, true, [[1], [1], [1], [1], [1], [2], [2, 2, 2]]);
});

test("should win with 4 in a row diagonally starting on bottom left to top right", () => {
  const { play, assertGame } = render();

  [0, 1, 1, 2, 1, 2, 2, 3, 3, 3, 3].forEach(play);

  // Player 1 won the game!
  assertGame(1, true, [[1], [2, 1, 1], [2, 2, 1], [2, 1, 2, 1], [], [], []]);
});

test("should win with 4 in a row diagonally starting on bottom right to top left", () => {
  const { play, assertGame } = render();
  [6, 5, 5, 4, 3, 4, 4, 3, 3, 2, 3].forEach(play);

  // Player 1 won the game!
  assertGame(1, true, [[], [], [2], [1, 2, 1, 1], [2, 2, 1], [2, 1], [1]]);
});

test("should win with 4 in a row diagonally from bottom left, starting from fourth column and third row", () => {
  const { play, assertGame } = render();
  [3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 5, 6, 6, 6, 6, 1, 6].forEach(play);
  assertGame(1, true, [
    [],
    [2],
    [],
    [1, 2, 1],
    [2, 1, 2, 1],
    [2, 1, 2, 1, 1],
    [2, 2, 1, 2, 1, 1],
  ]);
});

test("should win with 4 in a row diagonally from bottom right, starting from fourth column and third row", () => {
  const { play, assertGame } = render();

  [3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 4, 0, 0, 0, 0, 1, 0, 0].forEach(play);

  // Player 1 won the game!
  assertGame(1, true, [
    [1, 2, 1, 2, 2, 1],
    [2, 1, 2, 1, 1],
    [2, 1, 2, 1],
    [1, 2, 1],
    [2],
    [],
    [],
  ]);
});

test("should not play a piece when the column is full", () => {
  const { play, assertGame } = render();

  [0, 0, 0, 0, 0, 0].forEach(play);

  assertGame(1, false, [[1, 2, 1, 2, 1, 2], [], [], [], [], [], []]);

  play(0);
  // No change because column is full
  assertGame(1, false, [[1, 2, 1, 2, 1, 2], [], [], [], [], [], []]);
});
