import { Problem } from "../types/problem";
import { jumpGame } from "./jump-game";
import { reverseLinkedList } from "./reverse-linked-list";
import { search2DMatrix } from "./search-a-2d-matrix";
import { twoSum } from "./two-sum";
import { validParentheses } from "./valid-parentheses";

interface ProblemType {
  [key: string]: Problem;
}

export const problems: ProblemType = {
  "two-sum": twoSum,
  "jump-game": jumpGame,
  "reverse-linked-list": reverseLinkedList,
  "search-a-2d-matrix": search2DMatrix,
  "valid-parentheses": validParentheses,
};
