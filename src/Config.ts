import { IConfig, IInternalConfig } from "./Interfaces";
import { RequestInterceptorType, ResponseInterceptorType } from "./Types";

const DATA: IInternalConfig = {
  baseURL: "",
  headers: {},
  params: {},
  interceptors: {
    requests: [],
    responses: [],
  },
};

export const addRequest = (callback: RequestInterceptorType) => {
  DATA.interceptors?.requests.push(callback);
};

export const addResponse = (callback: ResponseInterceptorType) => {
  DATA.interceptors?.responses.push(callback);
};

/**
 * Set the default configurations
 *
 * @param config IConfig
 * @returns undefined
 */
export const setConfig = (config: IConfig) => {
  DATA.baseURL = config?.baseURL;
  DATA.headers = {
    ...DATA.headers,
    ...(config?.headers ?? {}),
  };
  DATA.params = {
    ...DATA.params,
    ...(config?.params ?? {}),
  };
};

export const getConfig = () => {
  return {
    ...DATA,
  };
};
