import { api } from "../index";

const BASE_CONFIG = {
  baseURL: "https://axe-api.com/api/v1", // NOSONAR
  headers: {
    "x-api-request": 100,
  },
  params: {
    requestTime: "20231021",
  },
};

describe("Interceptors", () => {
  beforeAll(() => {
    api.setConfig(BASE_CONFIG);
  });

  test("addRequet()", async () => {
    global.fetch = (url, request) => {
      return { url, request, status: 200, data: { id: 1 } };
    };

    api.interceptors.addRequest((request) => {
      request.headers["x-my-header"] = "MyValue";
      return request;
    });

    const { request } = await api.resource("users").get();
    expect(request.headers["x-my-header"]).toBe("MyValue");
  });

  test("addResponse()", async () => {
    global.fetch = (url, request) => {
      return { url, request, status: 200, data: { id: 1 } };
    };

    api.interceptors.addResponse((response) => {
      response.status = 404;
      return response;
    });

    const { status } = await api.resource("users").get();
    expect(status).toBe(404);
  });
});
