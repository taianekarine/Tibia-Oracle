import { LoginForm } from "@/components/auth/login-form";
import { RegisterDialog } from "@/components/dialogs/register-dialog";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Tibia Oracle
        </h1>

        <LoginForm />

        <RegisterDialog />
      </div>
    </main>
  );
}
