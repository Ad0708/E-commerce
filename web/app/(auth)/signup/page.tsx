import AuthShowcase from "@/components/auth/AuthShowcase";
import SignupForm from "@/components/auth/SignUpForm";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      <AuthShowcase />

      <div className="relative flex items-center justify-center p-6">
        <div className="lg:hidden fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
