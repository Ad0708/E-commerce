"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  UpdateProfilePayload,
} from "@/api/profile";

/**
 * Fetch profile metadata (createdAt, updatedAt).
 * Name, email and role come from useAuthStore via ["current-user"].
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

/**
 * Update logged-in user's profile.
 * Invalidates:
 * - ["current-user"] -> refreshes auth store (/auth/me)
 * - ["profile"] -> refreshes createdAt/updatedAt if needed
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: (payload: UpdateProfilePayload) =>
      updateProfile(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["current-user" , "user"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.success(
        data.message || "Profile updated successfully"
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update profile"
      );
    },
  });
};