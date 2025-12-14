import axios from "axios";
import { fetchFromLocalStorage } from "./localStorageService";

const DEFAULT_BASE_URL = "http://localhost:3000/api/";
const DEFAULT_TIMEOUT = 30000;

/**
 * Default axios instance
 */
let axiosService = createAxiosInstance();
export default axiosService;

/**
 * Create a customizable axios instance
 * @param {string} baseURL - Base URL for the instance
 * @param {number} timeout - Request timeout in ms
 * @param {object} headers - Additional headers
 * @returns {AxiosInstance}
 */
export function createAxiosInstance(
  baseURL = DEFAULT_BASE_URL,
  timeout = DEFAULT_TIMEOUT,
  headers = {}
) {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  instance.interceptors.request.use((config) => {
    // const token = "ok";
    const token = fetchFromLocalStorage('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

/**
 * Refresh the default axios instance
 */
export function refreshAxios() {
  axiosService = createAxiosInstance();
  return axiosService;
}

/**
 * Set a new base URL for the default instance
 * @param {string} newBaseURL
 */
export function setBaseURL(newBaseURL) {
  axiosService = createAxiosInstance(newBaseURL);
}

/**
 * Set timeout for the default instance
 * @param {number} timeout - Timeout in milliseconds
 */
export function setTimeout(timeout) {
  axiosService = createAxiosInstance(DEFAULT_BASE_URL, timeout);
}

/**
 * Reset timeout to default
 */
export function resetTimeout() {
  axiosService = createAxiosInstance(DEFAULT_BASE_URL, DEFAULT_TIMEOUT);
}

/**
 * Get data from API
 * @param {string} endPoint - API endpoint
 * @param {object} options - Request options
 * @param {number} options.successStatus - Expected success status code
 * @param {number} options.timeout - Custom timeout for this request
 * @param {AxiosInstance} options.instance - Custom axios instance
 * @returns {Promise<[boolean, any]>}
 */
export async function getFromApi(
  endPoint,
  { successStatus = 200, timeout = null, instance = axiosService } = {}
) {
  try {
    const config = timeout ? { timeout } : {};
    const result = await instance.get(endPoint, config);
    if (result.status === successStatus) {
      return [true, result.data];
    }
    return [false, result.data];
  } catch (error) {
    console.log("DEBUG - axios get error", error);
    return [false, error.response?.data || { message: "Request failed" }];
  }
}

/**
 * Post data to API
 * @param {string} endPoint - API endpoint
 * @param {object} data - Data to send
 * @param {object} options - Request options
 * @param {number} options.successStatus - Expected success status code
 * @param {number} options.timeout - Custom timeout for this request
 * @param {AxiosInstance} options.instance - Custom axios instance
 * @returns {Promise<[boolean, any]>}
 */
export async function postWithApi(
  endPoint,
  data = null,
  { successStatus = 200, timeout = null, instance = axiosService } = {}
) {
  try {
    const config = timeout ? { timeout } : {};
    const result =
      data !== null
        ? await instance.post(endPoint, data, config)
        : await instance.post(endPoint, config);

    if (result.status === successStatus) {
      return [true, result.data];
    }
    return [false, result.data];
  } catch (error) {
    console.error("POST Error:", error);
    return [false, error.response?.data || { message: "Post failed" }];
  }
}

/**
 * Update data via API
 * @param {string} endPoint - API endpoint
 * @param {object} data - Data to update
 * @param {object} options - Request options
 * @param {string} options.id - Resource ID
 * @param {boolean} options.autoJoin - Auto-join ID to endpoint
 * @param {number} options.successStatus - Expected success status code
 * @param {number} options.timeout - Custom timeout for this request
 * @param {AxiosInstance} options.instance - Custom axios instance
 * @returns {Promise<[boolean, any]>}
 */
export async function updateWithApi(
  endPoint,
  data,
  {
    id = null,
    autoJoin = true,
    successStatus = 200,
    timeout = null,
    instance = axiosService,
  } = {}
) {
  if (!data) {
    return [false, { message: "No data provided" }];
  }

  try {
    let url = endPoint;
    if (autoJoin && id) {
      url += id;
    }

    const config = timeout ? { timeout } : {};
    const result = await instance.put(url, data, config);

    if (result.status === successStatus) {
      return [true, result.data];
    }
    return [false, result.data];
  } catch (error) {
    console.error("Update Error:", error);
    return [false, error.response?.data || { message: "Update failed" }];
  }
}

/**
 * Delete resource via API
 * @param {string} endPoint - API endpoint
 * @param {object} options - Request options
 * @param {string} options.id - Resource ID
 * @param {boolean} options.autoJoin - Auto-join ID to endpoint
 * @param {number} options.successStatus - Expected success status code
 * @param {number} options.timeout - Custom timeout for this request
 * @param {AxiosInstance} options.instance - Custom axios instance
 * @returns {Promise<[boolean, any]>}
 */
export async function deleteWithApi(
  endPoint,
  {
    id = null,
    autoJoin = true,
    successStatus = 200,
    timeout = null,
    instance = axiosService,
  } = {}
) {
  try {
    let url = endPoint;
    if (autoJoin && id) {
      url += id;
    }

    const config = timeout ? { timeout } : {};
    const result = await instance.delete(url, config);
    if (result.status === successStatus) {
      return [true, result.data];
    }
    return [false, result.data];
  } catch (error) {
    console.error("Delete Error:", error);
    return [false, error.response?.data || { message: "Delete failed" }];
  }
}

/**
 * Delete all resources via API
 * @param {string} endPoint - API endpoint
 * @param {object} options - Request options
 * @param {number} options.successStatus - Expected success status code
 * @param {number} options.timeout - Custom timeout for this request
 * @param {AxiosInstance} options.instance - Custom axios instance
 * @returns {Promise<[boolean, any]>}
 */
export async function deleteAllWithApi(
  endPoint,
  { successStatus = 204, timeout = null, instance = axiosService } = {}
) {
  try {
    const config = timeout ? { timeout } : {};
    const result = await instance.delete(endPoint, config);
    if (result.status === successStatus) {
      return [true, result.data];
    }
    return [false, result.data];
  } catch (error) {
    console.error("Delete All Error:", error);
    return [false, error.response?.data || { message: "Delete all failed" }];
  }
}
