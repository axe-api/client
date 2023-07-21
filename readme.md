# Axe API Client

## Config

```ts
import api from "axe-api-client";

api.setConfig({
  baseURL: "https://bookstore.axe-api.com/api/v1",
  headers: {},
  params: {},
});

api.interceptors.addRequest((request) => {
  return request;
});

api.interceptors.addResponse((response) => {
  return response;
});
```

## Methods

- `paginate()`
- `all()`
- `first()`
- `firstOrFail()`
- `insert()`
- `delete()`
- `forceDelete()`
- `update()`
- `patch()`

### Insert

```js
const response = await api.insert("users", {
  name: "Karl",
  surname: "Popper",
});
```

### Update

```js
const response = await api.update("users/1", {
  name: "Karl",
  surname: "Popper",
});
```

### Delete

```js
const response = await api.delete("users/1");
```

### Query

```js
import api from "axe-api-client";

const data = await api.resource("users").paginate();
```

### Fields

```js
const response = await api
  .resource("users")
  .fields("name", "surname", "email")
  .paginate();
```

### Sorting

```js
const response = await api
  .resource("users")
  .fields("name", "surname", "email")
  .sort("name")
  .sort("surname", "DESC")
  .sort("email", "ASC")
  .paginate();
```

### Limits

```js
const response = await api.resource("users").paginate({ page: 1, perPage: 25 });
```

### First

```js
const response = await api.resource("users").first();
```

### Where Conditions

```js
const response = await api.resource("users").where("age", 18).paginate();
```

```js
const response = await api
  .resource("users")
  .where("age", ">=", 18)
  .where("name", "Karl")
  .paginate();
```

```js
const response = await api
  .resource("users")
  .where("age", ">=", 18)
  .orWhere("name", "Karl")
  .paginate();
```

```js
const response = await api
  .resource("users")
  .where("age", ">=", 18)
  .andWhere("name", "Karl")
  .paginate();
```

```js
const response = await api
  .resource("users")
  .where((query) => {
    query.where("name", "Karl").where("surname", "Popper");
  })
  .orWhere("age", ">=", 18)
  .paginate();
```

```js
const response = await api
  .resource("users")
  .where("age", "IN", [18, 19, 20])
  .paginate();
```

> All the [operators](https://axe-api.com/basics/queries/index.html#operators) should be able to used.

### Related Data

```js
const response = await api
  .resource("users")
  .with("posts{comments{id|content}}")
  .paginate();
```

### Quick where functions

We can use the following query where functions:

- whereNot("id", 1)
- whereLike("name", "_john_")
- whereNotLike("name", "_john_")
- whereIn("type", [1, 2, 3])
- whereNotIn("type", [1, 2, 3])
- whereBetween("type", 1, 3)
- whereNotBetween("type", 1, 3)
- whereNull("age")
- whereNotNull("age")

> Also we can create this function with `orWhere*` pattern.
