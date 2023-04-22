import { IQueryable, IRequest } from "./Interfaces";

export type FormBody = object | undefined;

export type QueryArray = object[];

export type QueryFunctionType = (query: IQueryable) => IQueryable;

export type RequestInterceptorType = (request: IRequest) => IRequest;

export type ResponseInterceptorType = (response: Response) => void;

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
