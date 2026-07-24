import api from "@/lib/axios/axios";

export interface ProfileDates {
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Fetch createdAt + updatedAt only.
 * /auth/me omits these fields so we call GET /profile once on page mount.
 * All other user data (name, email, role) comes from useAuthStore.
 */
export const getProfile = async (): Promise<ProfileDates> => {
  const { data } = await api.get<{ user: UpdateProfileResponse["user"] }>(
    "/profile"
  );
  return {
    createdAt: data.user.createdAt,
    updatedAt: data.user.updatedAt,
  };
};

/**
 * Update the logged-in user's name.
 */
export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  const { data } = await api.patch<UpdateProfileResponse>(
    "/profile",
    payload
  );
  return data;
};