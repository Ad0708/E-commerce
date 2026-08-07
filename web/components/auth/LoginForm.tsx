"use client";
import { removeEmojis } from "@/lib/utils";

import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/uselogin";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types/user";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <Card variant="glass" className="w-full max-w-md p-2 h-fit">
      <CardHeader className="text-center mb-2">
        <CardTitle className="text-3xl font-extrabold font-heading">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Sign in to continue shopping
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="john@example.com"
              onInput={(e) => { e.currentTarget.value = removeEmojis(e.currentTarget.value); }}
              {...register("email")}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                onInput={(e) => { e.currentTarget.value = removeEmojis(e.currentTarget.value); }}
                {...register("password")}
                className={errors.password ? "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500 pr-12" : "pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-secondary hover:text-foreground transition-colors select-none">
              <input type="checkbox" className="rounded border-[var(--glass-border)] bg-background accent-[var(--accent-mid)] w-4 h-4" {...register("rememberMe")} />
              Remember me
            </label>

            <Link
              href="/forgot-password"
              className="font-medium text-[var(--accent-mid)] hover:text-[var(--accent-start)] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-secondary font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-[var(--accent-mid)] hover:text-[var(--accent-start)] transition-colors">
            Create Account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
