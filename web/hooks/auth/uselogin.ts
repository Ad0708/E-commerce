// "use client";

// import { loginApi } from "@/api/auth";
// import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// type LoginResponse = {
//   success: boolean;
//   message: string;
//   token: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: "customer" | "admin";
//   };
// };

// export const useLogin = () => {
//   return useMutation<
//     LoginResponse,
//     any,
//     {
//       email: string;
//       password: string;
//     }
//   >({
//     mutationFn: loginApi,

//     onSuccess: (data) => {
//       toast.success(data.message || "Logged in successfully");
//     },

//     onError: (error) => {
//       console.log("error", error);
//       toast.error(error?.response?.data?.message || "Login failed");
//     },
//   });
// };

"use client";

import { loginApi } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "customer" | "admin";
  };
};

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    any,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: loginApi,

    onSuccess: async (data) => {
      try {
        console.log("data", data.token);
        document.cookie = `token  =${data.token}`;
        toast.success(data.message || "Logged in successfully");
      } catch (error) {
        console.error("Failed to store frontend cookie:", error);
        toast.error("Failed to store login session");
      }
    },

    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    },
  });
};
