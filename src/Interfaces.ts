import Resource from "./Resource";
import { ConditionTypes, MethodType, QueryFunctionType } from "./Types";

export interface IRequest {
  url: string;
  method: MethodType;
  headers: Record<string, any>;
  body: string | undefined;
}

export interface IConfig {
  baseURL?: string;
  headers?: Record<string, string | number>;
  params?: Record<string, string | number>;
  interceptors?: IInterceptors;
}

export interface IInternalConfig extends IConfig {
  interceptors: IInterceptors;
}

export interface IInterceptors {
  requests: any[];
  responses: any[];
}

export interface IPaginate {
  page?: number;
  perPage?: number;
}

export interface IQueryable {
  where(field: string, value: any): Resource;
  where(field: string, condition: ConditionTypes, value: any): Resource;
  where(query: QueryFunctionType): Resource;

  andWhere(field: string, value: any): Resource;
  andWhere(field: string, condition: ConditionTypes, value: any): Resource;
  andWhere(query: QueryFunctionType): Resource;

  orWhere(field: string, value: any): Resource;
  orWhere(field: string, condition: ConditionTypes, value: any): Resource;
  orWhere(query: QueryFunctionType): Resource;

  whereNot(field: string, value: any): Resource;
  whereLike(field: string, value: any): Resource;
  whereNotLike(field: string, value: any): Resource;
  whereIn(field: string, value: any[]): Resource;
  whereNotIn(field: string, value: any[]): Resource;
  whereBetween(field: string, start: any, end: any): Resource;
  whereNotBetween(field: string, start: any, end: any): Resource;
  whereNull(field: string): Resource;
  whereNotNull(field: string): Resource;

  orWhereNot(field: string, value: any): Resource;
  orWhereLike(field: string, value: any): Resource;
  orWhereNotLike(field: string, value: any): Resource;
  orWhereIn(field: string, value: any[]): Resource;
  orWhereNotIn(field: string, value: any[]): Resource;
  orWhereBetween(field: string, start: any, end: any): Resource;
  orWhereNotBetween(field: string, start: any, end: any): Resource;
  orWhereNull(field: string): Resource;
  orWhereNotNull(field: string): Resource;
}

export interface IPagination {
  data: Array<any>;
  pagination: IPaginationMetadata;
}

export interface IPaginationMetadata {
  total: number;
  lastPage: number;
  prevPage: number | null;
  nextPage: number | null;
  currentPage: number;
  from: number;
  to: number;
}
