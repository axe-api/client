import Resource from "./Resource";
import { setConfig, addRequest, addResponse } from "./Config";

export default {
  setConfig,

  interceptors: {
    addRequest,
    addResponse,
  },

  /**
   * Find the resource quickly.
   *
   * @param url string. Example: users/1
   * @returns object
   */
  find: async (url: string) => {
    const resource = new Resource(url);
    return resource.get();
  },

  /**
   * Set the base resource URL.
   *
   * @param url string. Example: posts/1/comments
   * @returns IQueryable
   */
  resource: (url: string) => new Resource(url),
};
