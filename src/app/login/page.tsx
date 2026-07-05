import { Suspense } from "react";
import LoginPageContent from "./LoginPageContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-navy-950 flex items-center justify-center text-slate-400 text-sm">
          Loading portal...
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
