import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const variantClasses: Record<NonNullable<AlertProps["variant"]>, string> = {
  default:
    "bg-background border-border text-foreground",
  destructive:
    "bg-destructive/10 border-destructive/40 text-destructive",
};

function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-xl border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
        "[&>svg~*]:pl-8",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
