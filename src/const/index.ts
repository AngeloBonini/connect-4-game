import { Player } from "types";

export const boardCols = 7;
export const boardRows = 6;

export const playerColor: Record<Player, string> = {
  1: "#f10000",
  2: "#ece100",
};

export const playerName: Record<Player, string> = {
  1: "Red",
  2: "Yellow",
};
