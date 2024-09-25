import { Resource } from "./Resource";
import { addRequest, addResponse, setConfig, getConfig } from "./Config";

export const interceptors = {
  addRequest,
  addResponse,
};

/**
 * Find the resource quickly.
 *
 * @param url string. Example: users/1
 * @returns object
 */
export const find = async (url: string) => {
  const resource = new Resource(url);
  return resource.get();
};

/**
 * Set the base resource URL.
 *
 * @param url string. Example: posts/1/comments
 * @returns IQueryable
 */
export const resource = (url: string) => new Resource(url);

export const api = {
  find,
  resource,
  setConfig,
  getConfig,
  interceptors,
};
