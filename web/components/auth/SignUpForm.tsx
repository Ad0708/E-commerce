"use client";
import { removeEmojis } from "@/lib/utils";

import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "@/hooks/auth/usesignup";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

    confirmPassword: z.string().min(1, "Please confirm your password"),

    terms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
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
      terms: undefined,
    },
  });

  const signupMutation = useSignup();
  const router = useRouter();

  const onSubmit = (data: SignupFormData) => {
    const signupData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    signupMutation.mutate(signupData, {
      onSuccess: () => {
        router.push("/home");
      },
    });
  };

  return (
    <Card variant="glass" className="w-full max-w-md p-2 h-fit">
      <CardHeader className="text-center mb-2">
        <CardTitle className="text-3xl font-extrabold font-heading">
          Create Account
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Join us and start shopping today
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
            )}
          </div>

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
                placeholder="Create password"
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                onInput={(e) => { e.currentTarget.value = removeEmojis(e.currentTarget.value); }}
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500 pr-12" : "pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-3 text-sm cursor-pointer font-medium text-secondary hover:text-foreground transition-colors select-none">
              <input type="checkbox" className="mt-1 rounded border-[var(--glass-border)] bg-background accent-[var(--accent-mid)] w-4 h-4" {...register("terms")} />
              <span className="leading-tight">I agree to the Terms and Conditions and Privacy Policy</span>
            </label>
            {errors.terms && (
              <p className="mt-2 text-xs font-medium text-red-500">{errors.terms.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-secondary font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--accent-mid)] hover:text-[var(--accent-start)] transition-colors">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
