"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "@/hooks/auth/usesignup";
import { useRouter } from "next/navigation";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name cannot exceed 50 characters"),

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

    confirmPassword: z.string(),

    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const signupMutation = useSignup();

  type SignupPayload = {
    name: string;
    email: string;
    password: string;
  };

  const onSubmit = (data: SignupPayload) => {
    const payload: SignupPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    
    signupMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-2xl border border-slate-200 dark:border-slate-600">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Create Account
        </h1>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Join thousands of happy customers
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>

          <input
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className={`w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-3 outline-none transition-all
            ${
              errors.name
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 dark:border-slate-700 focus:border-blue-500"
            }`}
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

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
              placeholder="Create password"
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
              className="absolute right-4 top-1/2 -translate-y-1/2"
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

        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-950 px-4 py-3 pr-12 outline-none transition-all
              ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-blue-500"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="mt-1" {...register("terms")} />

            <span>I agree to the Terms and Conditions and Privacy Policy</span>
          </label>

          {errors.terms && (
            <p className="mt-2 text-sm text-red-500">{errors.terms.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
