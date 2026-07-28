"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/uselogin";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types/user";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  type LoginPayload = {
    email: string;
    password: string;
  };

  const router = useRouter();
  const loginMutation = useLogin();

  const onSubmit = (data: LoginPayload) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.user.role === "admin") {
          router.replace("/admin");
        } else {
          console.log("Login successful");
          router.replace("/home");
        }

        router.refresh();

        // Update Zustand store with user data
        const user: User = response.user as User;
        useAuthStore.getState().setUser(user as User);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl border border-slate-200 dark:border-slate-600">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Welcome Back
        </h1>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Sign in to continue shopping
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            className={`w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-3 outline-none transition-all
            ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 dark:border-slate-700 focus:border-blue-500"
            }`}
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-3 pr-12 outline-none transition-all
              ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-blue-500"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("rememberMe")} />
            Remember me
          </label>

          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl cursor-pointer bg-linear-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? "Signing In..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <Link href="/signup" className="font-semibold text-blue-600">
          Create Account
        </Link>
      </p>
    </div>
  );
}
