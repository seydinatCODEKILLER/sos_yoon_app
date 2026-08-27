import { api } from "@/shared/lib/apiClient";
import type { User } from "@/types/user.types";
import type {
  ApiSuccessResponse,
  AuthResponse,
  LoginPayload,
  RefreshResponse,
  RegisterPayload,
  UpdateProfilePayload,
} from "../types/types";

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<ApiSuccessResponse<AuthResponse>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<ApiSuccessResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const { data } = await api.post<ApiSuccessResponse<RefreshResponse>>(
      "/auth/refresh",
      { refreshToken },
    );
    return data.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/auth/logout", { refreshToken });
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<ApiSuccessResponse<User>>("/auth/me");
    return data.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await api.put<ApiSuccessResponse<User>>(
      "/auth/profile",
      payload,
    );
    return data.data;
  },

  revokeAllTokens: async (): Promise<void> => {
    await api.post("/auth/revoke-all-tokens");
  },
};
