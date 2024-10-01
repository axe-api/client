import { getConfig } from "./Config";
import { DEFINED_STATUS_CODES, SUFFIX_MAP } from "./Constants";
import {
  IInternalConfig,
  IPaginate,
  IPagination,
  IQueryable,
} from "./Interfaces";
import {
  ConditionTypes,
  FormBody,
  FullCoditionTypes,
  LogicType,
  MethodType,
  QueryArray,
  QueryFunctionType,
  SortType,
} from "./Types";

export class Resource implements IQueryable {
  private url: string;
  private config: IInternalConfig;
  private params: URLSearchParams;
  private fieldArray: string[];
  private sortArray: string[];
  private q: QueryArray;
  private queryPointers: QueryArray[];
  private overrideLogic: undefined | LogicType;
  private withPath: string | undefined;

  constructor(url: string) {
    this.config = getConfig();
    this.url = url;
    this.params = new URLSearchParams();
    this.fieldArray = [];
    this.sortArray = [];
    this.q = [];
    this.queryPointers = [this.q];
    this.overrideLogic = undefined;
    this.withPath = undefined;
  }

  /**
   * Select the fields that will be fetched.
   *
   * Example: fields("id", "name", "surname")
   *
   * @param names string[]
   * @returns IQueryable
   */
  fields(...names: string[]) {
    this.fieldArray = names;
    return this;
  }

  /**
   * Set the sorting option.
   *
   * Example: sort("id", "DESC")
   *
   * @param field string
   * @param type ASC | "DESC"
   * @returns IQueryable
   */
  sort(field: string, type?: SortType) {
    const expression = `${type === "DESC" ? "-" : ""}${field}`;
    this.sortArray.push(expression);
    return this;
  }

  /**
   * Add relation data query
   *
   * Example: .with("user{name,surname,role{title}}")
   *
   * @param field string
   * @returns IQueryable
   */
  with(path: string) {
    if (!this.withPath) {
      this.withPath = "";
    }
    this.withPath += `${path},`;
    return this;
  }

  /**
   * Add a where Equal condition
   *
   * Example: .where("id", 1)
   * SQL: WHERE id = 1
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  andWhere(field: string, value: any): Resource;

  /**
   * Add a custom where condition
   *
   * Example: .where("id", ">=", 1)
   * SQL: WHERE ID >= 1
   *
   * @param field string
   * @param condition ConditionTypes
   * @param value any
   * @returns IQueryable
   */
  andWhere(field: string, condition: ConditionTypes, value: any): Resource;

  /**
   * Add a child condition
   *
   * Example: .where((query: IQueryable) => query.where("id", 1))
   * SQL: WHERE (id = 1 OR age >= 20)
   *
   * @param field string
   * @param condition ConditionTypes
   * @param value any
   * @returns IQueryable
   */
  andWhere(query: QueryFunctionType): Resource;

  andWhere(param1: unknown, param2?: unknown, param3?: unknown) {
    return this.applyWhere("$and", param1, param2, param3);
  }

  /**
   * Add a where Equal condition
   *
   * Example: .where("id", 1)
   * SQL: WHERE id = 1
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  where(field: string, value: any): Resource;

  /**
   * Add a custom where condition
   *
   * Example: .where("id", ">=", 1)
   * SQL: WHERE id >= 1
   *
   * @param field string
   * @param condition ConditionTypes
   * @param value any
   * @returns IQueryable
   */
  where(field: string, condition: ConditionTypes, value: any): Resource;

  /**
   * Add a child condition
   *
   * Example: .where((query: IQueryable) => query.where("id", 1))
   * SQL: WHERE (id = 1 OR age >= 20)
   *
   * @param field string
   * @param condition ConditionTypes
   * @param value any
   * @returns IQueryable
   */
  where(query: QueryFunctionType): Resource;

  where(param1: unknown, param2?: unknown, param3?: unknown) {
    return this.applyWhere("$and", param1, param2, param3);
  }

  /**
   * Add a where Equal condition
   *
   * Example: .orWhere("id", 1)
   * SQL: OR id = 1
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  orWhere(field: string, value: any): Resource;

  /**
   * Add a custom where condition
   *
   * Example: .orWhere("id", ">=", 1)
   * SQL: OR id >= 1
   *
   * @param field string
   * @param condition ConditionTypes
   * @param value any
   * @returns IQueryable
   */
  orWhere(field: string, condition: ConditionTypes, value: any): Resource;

  /**
   * Add a child condition
   *
   * Example: .orWhere((query: IQueryable) => query.where("id", 1))
   * SQL: OR (id = 1 OR age >= 20)
   *
   * @param field string
   * @param condition ConditionTypes
   * @param value any
   * @returns IQueryable
   */
  orWhere(query: QueryFunctionType): Resource;

  orWhere(param1: unknown, param2?: unknown, param3?: unknown) {
    return this.applyWhere("$or", param1, param2, param3);
  }

  /**
   * Add a not equal query
   *
   * Example: .whereNot("id", 1)
   * SQL: WHERE id <> 1
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  whereNot(field: string, value: any) {
    return this.addWhereCondition("$and", field, "<>", value);
  }

  /**
   * Add LIKE query
   *
   * Example: .whereLike("name", "*john*")
   * SQL: WHERE name LIKE '%john%'
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  whereLike(field: string, value: any) {
    return this.addWhereCondition("$and", field, "LIKE", value);
  }

  /**
   * Add NOT LIKE query
   *
   * Example: .whereNotLike("name", "*john*")
   * SQL: WHERE name NOT LIKE '%john%'
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  whereNotLike(field: string, value: any) {
    return this.addWhereCondition("$and", field, "NOT LIKE", value);
  }

  /**
   * Add IN query
   *
   * Example: .whereIn("id", [1, 2, 3])
   * SQL: WHERE id IN [1, 2, 3]
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  whereIn(field: string, value: any[]) {
    return this.addWhereCondition("$and", field, "IN", value);
  }

  /**
   * Add NOT IN query
   *
   * Example: .whereNotIn("id", [1, 2, 3])
   * SQL: WHERE id NOT IN [1, 2, 3]
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  whereNotIn(field: string, value: any[]) {
    return this.addWhereCondition("$and", field, "NOT IN", value);
  }

  /**
   * Add BETWEEN query
   *
   * Example: .whereBetween("id", 1, 100])
   * SQL: WHERE id BETWEEN [1, 100]
   *
   * @param field string
   * @param start any
   * @param end any
   * @returns IQueryable
   */
  whereBetween(field: string, start: any, end: any) {
    return this.addWhereCondition("$and", field, "BETWEEN", [start, end]);
  }

  /**
   * Add NOT BETWEEN query
   *
   * Example: .whereNotBetween("id", 1, 100])
   * SQL: WHERE id NOT BETWEEN [1, 100]
   *
   * @param field string
   * @param start any
   * @param end any
   * @returns IQueryable
   */
  whereNotBetween(field: string, start: any, end: any) {
    return this.addWhereCondition("$and", field, "NOT BETWEEN", [start, end]);
  }

  /**
   * Add NULL query
   *
   * Example: .whereNull("phone")
   * SQL: WHERE phone IS NULL
   *
   * @param field string
   * @returns IQueryable
   */
  whereNull(field: string) {
    return this.addWhereCondition("$and", field, "NULL", null);
  }

  /**
   * Add NOT NULL query
   *
   * Example: .whereNotNull("phone")
   * SQL: WHERE phone IS NOT NULL
   *
   * @param field string
   * @returns IQueryable
   */
  whereNotNull(field: string) {
    return this.addWhereCondition("$and", field, "NOT NULL", null);
  }

  /**
   * Add a not equal query with OR prefix
   *
   * Example: .orWhereNot("id", 1)
   * SQL: OR id <> 1
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  orWhereNot(field: string, value: any) {
    return this.addWhereCondition("$or", field, "<>", value);
  }

  /**
   * Add LIKE query with OR prefix
   *
   * Example: .orWhereLike("name", "*john*")
   * SQL: OR name LIKE '%john%'
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  orWhereLike(field: string, value: any) {
    return this.addWhereCondition("$or", field, "LIKE", value);
  }

  /**
   * Add NOT LIKE query with OR prefix
   *
   * Example: .orWhereNotLike("name", "*john*")
   * SQL: OR name NOT LIKE '%john%'
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  orWhereNotLike(field: string, value: any) {
    return this.addWhereCondition("$or", field, "NOT LIKE", value);
  }

  /**
   * Add IN query with OR prefix
   *
   * Example: .orWhereIn("id", [1, 2, 3])
   * SQL: OR id IN [1, 2, 3]
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  orWhereIn(field: string, value: any[]) {
    return this.addWhereCondition("$or", field, "IN", value);
  }

  /**
   * Add NOT IN query with OR prefix
   *
   * Example: .orWhereNotIn("id", [1, 2, 3])
   * SQL: OR id NOT IN [1, 2, 3]
   *
   * @param field string
   * @param value any
   * @returns IQueryable
   */
  orWhereNotIn(field: string, value: any[]) {
    return this.addWhereCondition("$or", field, "NOT IN", value);
  }

  /**
   * Add BETWEEN query with OR prefix
   *
   * Example: .orWhereBetween("id", 1, 100])
   * SQL: OR id BETWEEN [1, 100]
   *
   * @param field string
   * @param start any
   * @param end any
   * @returns IQueryable
   */
  orWhereBetween(field: string, start: any, end: any) {
    return this.addWhereCondition("$or", field, "BETWEEN", [start, end]);
  }

  /**
   * Add NOT BETWEEN query with OR Prefix
   *
   * Example: .orWhereNotBetween("id", 1, 100])
   * SQL: OR id NOT BETWEEN [1, 100]
   *
   * @param field string
   * @param start any
   * @param end any
   * @returns IQueryable
   */
  orWhereNotBetween(field: string, start: any, end: any) {
    return this.addWhereCondition("$or", field, "NOT BETWEEN", [start, end]);
  }

  /**
   * Add NULL query with OR prefix
   *
   * Example: .orWhereNull("phone")
   * SQL: OR phone IS NULL
   *
   * @param field string
   * @returns IQueryable
   */
  orWhereNull(field: string) {
    return this.addWhereCondition("$or", field, "NULL", null);
  }

  /**
   * Add NOT NULL query with OR prefix
   *
   * Example: .orWhereNotNull("phone")
   * SQL: OR phone IS NOT NULL
   *
   * @param field string
   * @returns IQueryable
   */
  orWhereNotNull(field: string) {
    return this.addWhereCondition("$or", field, "NOT NULL", null);
  }

  /**
   * Insert a new record to the resource
   *
   * @param data object
   * @returns object
   */
  async insert(data: object) {
    return this.sendRequest("POST", data);
  }

  /**
   * Update the resource
   *
   * @param data object
   * @returns object
   */
  async update(data: object) {
    return this.sendRequest("PUT", data);
  }

  /**
   * Paginate the resource
   *
   * @param query IPaginate
   * @returns object
   */
  async paginate(query?: IPaginate): Promise<IPagination> {
    this.params.append("page", query?.page?.toString() ?? "1");
    this.params.append("per_page", query?.perPage?.toString() ?? "10");
    return this.sendRequest("GET");
  }

  /**
   * Get the resource
   *
   * @returns object
   */
  async get() {
    return this.sendRequest("GET");
  }

  /**
   * Send a POSt request
   *
   * @param data FormBody
   * @returns object
   */
  async post(data?: FormBody) {
    return this.sendRequest("POST", data);
  }

  /**
   * Send a PUT request
   *
   * @param data FormBody
   * @returns object
   */
  async put(data?: FormBody) {
    return this.sendRequest("PUT", data);
  }

  /**
   * Send a PUT request
   *
   * @param data FormBody
   * @returns object
   */
  async patch(data?: FormBody) {
    return this.sendRequest("PATCH", data);
  }

  /**
   * Send a DELETE request
   *
   * @returns null
   */
  async delete() {
    return this.sendRequest("DELETE");
  }

  private async sendRequest(method: MethodType, data?: FormBody) {
    let request: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    };

    for (const interceptor of this.config.interceptors.requests) {
      request = interceptor(request);
    }

    const response = await fetch(this.toURL(), request);

    for (const interceptor of this.config.interceptors.responses) {
      interceptor(response);
    }

    if (DEFINED_STATUS_CODES.includes(response.status)) {
      return response.json();
    }

    return response;
  }

  private toURL() {
    if (this.fieldArray.length > 0) {
      this.params.append("fields", this.fieldArray.join(","));
    }

    if (this.sortArray.length > 0) {
      this.params.append("sort", this.sortArray.join(","));
    }

    if (this.q.length > 0) {
      this.params.append("q", JSON.stringify(this.q));
    }

    if (this.withPath) {
      this.params.append("with", this.withPath);
    }

    let params = this.params.toString();
    if (params && params.length > 0) {
      params = `?${params}`;
    }

    return `${this.config.baseURL}/${this.url}${params}`;
  }

  private applyWhere(
    logic: LogicType,
    param1: unknown,
    param2?: unknown,
    param3?: unknown,
  ) {
    if (typeof param1 === "function") {
      // We should create a new subquery
      const subquery: object[] = [];

      // We should add a new pointer for the child query
      this.queryPointers.push(subquery);
      this.overrideLogic = logic;

      // Call the query function
      param1(this);

      // Getting the parent query
      const parentQuery = this.queryPointers[this.queryPointers.length - 2];

      // Adding the subquery to the parent query
      parentQuery.push(subquery);

      // Removing the query pointer
      this.queryPointers.splice(this.queryPointers.length - 1);

      return this;
    }

    if (param3 === undefined) {
      this.addWhereCondition(logic, param1 as string, "=", param2);
      return this;
    }

    return this.addWhereCondition(
      logic,
      param1 as string,
      param2 as FullCoditionTypes,
      param3,
    );
  }

  private addWhereCondition(
    logic: LogicType,
    field: string,
    condition: FullCoditionTypes,
    value: any,
  ) {
    const cursor = this.queryPointers[this.queryPointers.length - 1];
    let prefix = logic === "$or" ? "$or." : "";

    if (this.overrideLogic) {
      prefix = `${this.overrideLogic}.`;
      this.overrideLogic = undefined;
    }

    const suffix = SUFFIX_MAP[condition] ? `.${SUFFIX_MAP[condition]}` : "";
    const key = `${prefix}${field}${suffix}`;
    cursor.push({ [key]: value });
    return this;
  }

  metadata() {
    return {
      config: this.config,
      url: this.url,
      params: this.params,
      fieldArray: this.fieldArray,
      sortArray: this.sortArray,
      q: this.q,
      queryPointers: this.queryPointers,
      overrideLogic: this.overrideLogic,
      withPath: this.withPath,
    };
  }
}
