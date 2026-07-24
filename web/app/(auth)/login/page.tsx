import AuthShowcase from "@/components/auth/AuthShowcase";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      <AuthShowcase />

      <div className="relative flex items-center justify-center p-6">
        {/* Mobile Theme Toggle */}
        <div className="lg:hidden fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}