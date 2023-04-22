import { FullCoditionTypes } from "./Types";

export const SUFFIX_MAP: Record<FullCoditionTypes, string> = {
  "=": "",
  "<>": "$not",
  ">": "$gt",
  ">=": "$gte",
  "<": "$lt",
  "<=": "$lte",
  LIKE: "$like",
  "NOT LIKE": "$notLike",
  IN: "$in",
  "NOT IN": "$notIn",
  BETWEEN: "$between",
  "NOT BETWEEN": "$notBetween",
  NULL: "",
  "NOT NULL": "$not",
};

export const DEFINED_STATUS_CODES = [200, 204, 400, 404];
