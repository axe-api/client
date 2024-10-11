import { IQueryable } from "./Interfaces";

export type FormBody = object | undefined;

export type QueryArray = object[];

export type QueryFunctionType = (query: IQueryable) => IQueryable;

export type RequestInterceptorType = (request: RequestInit) => RequestInit;

export type ResponseInterceptorType = (response: Response) => Response;

export type LogicType = "$or" | "$and";

export type MethodType = "POST" | "PUT" | "PATCH" | "DELETE" | "GET";

export type SortType = "ASC" | "DESC";

export type ConditionTypes = "=" | "<>" | ">" | ">=" | "<" | "<=";

export type FullCoditionTypes =
  | "="
  | "<>"
  | ">"
  | ">="
  | "<"
  | "<="
  | "LIKE"
  | "NOT LIKE"
  | "IN"
  | "NOT IN"
  | "BETWEEN"
  | "NOT BETWEEN"
  | "NULL"
  | "NOT NULL";
