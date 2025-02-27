import { Suspense } from "react";
import AuthError from "@/components/AuthError";

export default function ErrorPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthError />
    </Suspense>
  );
}
