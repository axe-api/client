# Axe API Client

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

### Get

```js
const response = await api.get("users/1");
```

### Query

```js
import api from "axe-api-client";

const data = await api.query("users").fetch();
```

### Fields

```js
const response = await api
  .query("users")
  .fields("name", "surname", "email")
  .fetch();
```

### Sorting

```js
const response = await api
  .query("users")
  .fields("name", "surname", "email")
  .sort("name")
  .sort("surname", "DESC")
  .sort("email", "ASC")
  .fetch();
```

### Limits

```js
const response = await api.query("users").fetch({ page: 1, perPage: 25 });
```

### First

```js
const response = await api.query("users").first();
```

### Where Conditions

```js
const response = await api.query("users").where("age", 18).fetch();
```

```js
const response = await api
  .query("users")
  .where("age", ">=", 18)
  .where("name", "Karl")
  .fetch();
```

```js
const response = await api
  .query("users")
  .where("age", ">=", 18)
  .orWhere("name", "Karl")
  .fetch();
```

```js
const response = await api
  .query("users")
  .where("age", ">=", 18)
  .andWhere("name", "Karl")
  .fetch();
```

```js
const response = await api
  .query("users")
  .where((query) => {
    query.where("name", "Karl").where("surname", "Popper");
  })
  .orWhere("age", ">=", 18)
  .fetch();
```

```js
const response = await api
  .query("users")
  .where("age", "IN", [18, 19, 20])
  .fetch();
```

> All the [operators](https://axe-api.com/basics/queries/index.html#operators) should be able to used.

### Related Data

```js
const response = await api
  .query("users")
  .with("posts{comments{id|content}}")
  .fetch();
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
