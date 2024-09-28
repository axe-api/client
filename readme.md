<h1 align="center">
  <br>
  <a href="https://axe-api.com/">
    <img src="https://axe-api.com/axe.png" alt="Markdownify" width="200">
  </a>
  <br>
  Axe API Client
  <br>
  <a href="https://badge.fury.io/js/axe-api-client">
    <img src="https://badge.fury.io/js/axe-api-client.svg" alt="npm version" height="18">
  </a>
  <a href="https://github.com/axe-api/client/actions/workflows/npm-release-publish.yml" target="_blank">
    <img src="https://github.com/axe-api/client/actions/workflows/npm-release-publish.yml/badge.svg?branch=master">
  </a>
  <a href="https://sonarcloud.io/dashboard?id=axe-api_client" target="_blank">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=axe-api_client&metric=alert_status">
  </a>
  <a href="https://github.com/axe-api/client/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/axe-api/axe-api.svg">
  </a>
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg">
  </a>
</h1>

`axe-api-client` is a native JavaScript client for Axe API servers.

You can send insert, update, delete, and fetch data from Axe API servers without pain. `axe-api-client` has advanced query support with the active record pattern.

## Config

```ts
import { api, IRequest } from "axe-api-client";

api.setConfig({
  baseURL: "https://bookstore.axe-api.com/api/v1",
  headers: {},
  params: {},
});

api.interceptors.addRequest((request: IRequest) => {
  return request;
});

api.interceptors.addResponse((response: Response) => {
  // console.log(response);
});
```

## Insert

```js
const response = await api.resource("users").insert({
  name: "Karl",
  surname: "Popper",
});
```

## Post

```js
const response = await api.resource("users").post({
  name: "Karl",
  surname: "Popper",
});
```

## Update

```js
const response = await api.resource("users").update({
  name: "Karl",
  surname: "Popper",
});
```

## Patch

```js
const response = await api.resource("users").patch({
  name: "Karl",
  surname: "Popper",
});
```

## Put

```js
const response = await api.resource("users").put({
  name: "Karl",
  surname: "Popper",
});
```

## Delete

```js
const response = await api.resource("users").delete();
```

## Query

```js
import { api } from "axe-api-client";

const data = await api.resource("users").paginate();
```

## Fields

```js
const response = await api
  .resource("users")
  .fields("name", "surname", "email")
  .paginate();
```

## Sorting

```js
const response = await api
  .resource("users")
  .fields("name", "surname", "email")
  .sort("name")
  .sort("surname", "DESC")
  .sort("email", "ASC")
  .paginate();
```

## Limits

```js
const response = await api.resource("users").paginate({ page: 1, perPage: 25 });
```

## First

```js
const response = await api.resource("users").first();
```

## Where Conditions

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

## Related Data

```js
const response = await api
  .resource("users")
  .with("posts{comments{id|content}}")
  .paginate();
```

## Quick where functions

We can use the following query where functions:

- `whereNot("id", 1)`
- `whereLike("name", "*john*")`
- `whereNotLike("name", "*john*")`
- `whereIn("type", [1, 2, 3])`
- `whereNotIn("type", [1, 2, 3])`
- `whereBetween("type", 1, 3)`
- `whereNotBetween("type", 1, 3)`
- `whereNull("age")`
- `whereNotNull("age")`

## License

[MIT License](LICENSE)
