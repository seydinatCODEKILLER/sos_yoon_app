import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  API_CONFIG,
  DEFAULT_HEADERS,
  EXPECTED_401_ENDPOINTS,
} from "@/config/api.config";
import { tokenManager } from "./tokenManager";
import { refreshAccessToken } from "./refreshToken";

// ── Types ──────────────────────────────────────────────────────

interface RequestMetadata {
  startTime: number;
}

interface ConfigWithMetadata extends InternalAxiosRequestConfig {
  metadata?: RequestMetadata;
}

interface ConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// ── Intercepteur de REQUÊTE ─────────────────────────────────────

apiClient.interceptors.request.use(
  (config: ConfigWithMetadata) => {
    const url = config.url ?? "";

    if (!tokenManager.isPublicEndpoint(url)) {
      const token = tokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.metadata = { startTime: Date.now() };

    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${url}`);
    }

    return config;
  },
  (error) => {
    console.error("❌ Erreur config requête:", error);
    return Promise.reject(error);
  },
);

// ── Intercepteur de RÉPONSE ─────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as ConfigWithMetadata;
    const meta = config.metadata;
    if (meta && import.meta.env.DEV) {
      const duration = Date.now() - meta.startTime;
      console.log(
        `📥 ${response.status} ${response.config.url} (${duration}ms)`,
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalConfig = error.config as ConfigWithRetry;
    const url = originalConfig?.url ?? "";
    const status = error.response?.status;

    if (!error.response) {
      console.error("🔌 Erreur réseau:", error.message);
      return Promise.reject(error);
    }

    const isExpected401 = EXPECTED_401_ENDPOINTS.some((ep) => url.includes(ep));
    if (status === 401 && isExpected401) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (tokenManager.isRefreshing) {
        return new Promise((resolve) => {
          tokenManager.subscribeTokenRefresh((newToken: string) => {
            originalConfig.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalConfig));
          });
        });
      }

      try {
        const newAccessToken = await refreshAccessToken();
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalConfig);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ── Helpers typés ────────────────────────────────────────────────

export const api = {
  get: <T>(url: string, config?: object) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: object, config?: object) =>
    apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: object, config?: object) =>
    apiClient.put<T>(url, data, config),
  patch: <T>(url: string, data?: object, config?: object) =>
    apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: object) => apiClient.delete<T>(url, config),
};

export default apiClient;
