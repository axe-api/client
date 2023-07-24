import { getConfig } from "../src/Config";
import api from "../src/index";

const BASE_CONFIG = {
  baseURL: "https://axe-api.com/api/v1", // NOSONAR
  headers: {
    "x-api-request": 100,
  },
  params: {
    requestTime: "20231021",
  },
};

const mock = (status, data) => {
  return jest.fn(() => {
    return Promise.resolve({
      status,
      json: () => {
        return data;
      },
    });
  });
};

describe("axe-api-client", () => {
  beforeAll(() => {
    api.setConfig(BASE_CONFIG);
  });

  test("setConfig()", () => {
    const config = getConfig();
    expect(config.baseURL).toBe(BASE_CONFIG.baseURL);
    expect(config.headers["x-api-request"]).toBe(100);
    expect(config.params.requestTime).toBe("20231021");
  });

  test("resource()", () => {
    const resource = api.resource("users");
    expect(resource.metadata().url).toBe("users");
  });

  test("fields()", () => {
    const resource = api.resource("users").fields("id", "name", "surname");
    expect(resource.metadata().fieldArray.length).toBe(3);
    expect(resource.metadata().fieldArray[0]).toBe("id");
    expect(resource.metadata().fieldArray[1]).toBe("name");
    expect(resource.metadata().fieldArray[2]).toBe("surname");
  });

  test("sort()", () => {
    const resource = api
      .resource("users")
      .sort("id")
      .sort("name", "ASC")
      .sort("surname", "DESC");
    expect(resource.metadata().sortArray.length).toBe(3);
    expect(resource.metadata().sortArray[0]).toBe("id");
    expect(resource.metadata().sortArray[1]).toBe("name");
    expect(resource.metadata().sortArray[2]).toBe("-surname");
  });

  test("with()", () => {
    const resource = api
      .resource("users")
      .with("user")
      .with("post")
      .with("role{title}");
    expect(resource.metadata().withPath).toBe("user,post,role{title},");
  });

  test(`addWhere("id", 1)`, () => {
    const resource = api.resource("users").where("id", 66);
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0].id).toBe(66);
  });

  test(`addWhere("id", "<>", 1)`, () => {
    const resource = api.resource("users").where("id", "<>", 66);
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["id.$not"]).toBe(66);
  });

  test(`addWhere(query)`, () => {
    const resource = api.resource("users").where((query) => {
      return query.where("id", 66);
    });
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0].length).toBe(1);
    expect(resource.metadata().q[0][0]["$and.id"]).toBe(66);
  });

  test(`orWhere(query)`, () => {
    const resource = api.resource("users").orWhere((query) => {
      return query.where("id", 66);
    });
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0].length).toBe(1);
    expect(resource.metadata().q[0][0]["$or.id"]).toBe(66);
  });

  test(`where().orWhere()`, () => {
    const resource = api
      .resource("users")
      .where("id", 66)
      .orWhere("name", "Karl");
    expect(resource.metadata().q.length).toBe(2);
    expect(resource.metadata().q[0].id).toBe(66);
    expect(resource.metadata().q[1]["$or.name"]).toBe("Karl");
  });

  test(`whereLike()`, () => {
    const resource = api.resource("users").whereLike("name", "*john*");
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["name.$like"]).toBe("*john*");
  });

  test(`whereNotLike()`, () => {
    const resource = api.resource("users").whereNotLike("name", "*john*");
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["name.$notLike"]).toBe("*john*");
  });

  test(`whereIn()`, () => {
    const inArray = [1, 2, 3];
    const resource = api.resource("users").whereIn("name", inArray);
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["name.$in"]).toBe(inArray);
  });

  test(`whereNotIn()`, () => {
    const inArray = [1, 2, 3];
    const resource = api.resource("users").whereNotIn("name", inArray);
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["name.$notIn"]).toBe(inArray);
  });

  test(`whereBetween()`, () => {
    const resource = api.resource("users").whereBetween("id", 1, 10);
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["id.$between"]).toStrictEqual([1, 10]);
  });

  test(`whereNotBetween()`, () => {
    const resource = api.resource("users").whereNotBetween("id", 1, 10);
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["id.$notBetween"]).toStrictEqual([1, 10]);
  });

  test(`whereNot()`, () => {
    const resource = api.resource("users").whereNot("id", 10);
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["id.$not"]).toBe(10);
  });

  test(`whereNull()`, () => {
    const resource = api.resource("users").whereNull("phone");
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["phone"]).toBe(null);
  });

  test(`whereNotNull()`, () => {
    const resource = api.resource("users").whereNotNull("phone");
    expect(resource.metadata().q.length).toBe(1);
    expect(resource.metadata().q[0]["phone.$not"]).toBe(null);
  });

  test(`insert()`, async () => {
    global.fetch = mock(200, {
      id: 100,
    });

    const response = await api.resource("users").insert({
      name: "Karl",
    });
    expect(global.fetch.mock.calls.length).toBe(1);

    const request = global.fetch.mock.calls[0][1];
    expect(request.url).toBe("https://axe-api.com/api/v1/users"); // NOSONAR
    expect(request.method).toBe("POST");
    expect(request.headers["Content-Type"]).toBe("application/json");
    expect(request.body).toBe(`{"name":"Karl"}`);
    expect(response.id).toBe(100);
  });

  test(`update()`, async () => {
    global.fetch = mock(200, {
      id: 100,
    });

    const response = await api.resource("users/1").update({
      name: "Karl",
    });
    expect(global.fetch.mock.calls.length).toBe(1);

    const request = global.fetch.mock.calls[0][1];
    expect(request.url).toBe("https://axe-api.com/api/v1/users/1");
    expect(request.method).toBe("PUT");
    expect(request.body).toBe(`{"name":"Karl"}`);
    expect(response.id).toBe(100);
  });

  test(`patch()`, async () => {
    global.fetch = mock(200, {
      id: 100,
    });

    const response = await api.resource("users/1").patch({
      name: "Karl",
    });
    expect(global.fetch.mock.calls.length).toBe(1);

    const request = global.fetch.mock.calls[0][1];
    expect(request.url).toBe("https://axe-api.com/api/v1/users/1");
    expect(request.method).toBe("PATCH");
    expect(request.body).toBe(`{"name":"Karl"}`);
    expect(response.id).toBe(100);
  });

  test(`delete()`, async () => {
    global.fetch = mock(204, undefined);

    const response = await api.resource("users/1").delete();
    expect(global.fetch.mock.calls.length).toBe(1);

    const request = global.fetch.mock.calls[0][1];
    expect(request.url).toBe("https://axe-api.com/api/v1/users/1");
    expect(request.method).toBe("DELETE");
    expect(request.body).toBe(undefined);
    expect(response).toBe(undefined);
  });

  test(`paginate()`, async () => {
    const mockResponse = {};
    global.fetch = mock(204, mockResponse);

    const response = await api
      .resource("users")
      .paginate({ page: 10, perPage: 5 });
    expect(global.fetch.mock.calls.length).toBe(1);

    const request = global.fetch.mock.calls[0][1];
    expect(request.url).toBe(
      "https://axe-api.com/api/v1/users?page=10&per_page=5",
    );
    expect(request.method).toBe("GET");
    expect(response).toBe(mockResponse);
  });

  test(`URL Tests`, async () => {
    const mockResponse = {};
    global.fetch = mock(204, mockResponse);

    const response = await api
      .resource("users")
      .fields("id")
      .sort("id")
      .where("id", 1)
      .paginate();
    expect(global.fetch.mock.calls.length).toBe(1);

    const request = global.fetch.mock.calls[0][1];
    expect(request.url).toBe(
      `https://axe-api.com/api/v1/users?page=1&per_page=10&fields=id&sort=id&q=%5B%7B%22id%22%3A1%7D%5D`,
    );
    expect(request.method).toBe("GET");
    expect(response).toBe(mockResponse);
  });
});
