"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const AuthError = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "CredentialsSignin":
        return "Invalid email or password";
      case "EmailAndPasswordRequired":
        return "Email and password are required";
      case "InvalidPassword":
        return "The password you entered is incorrect";
      case "FailedToCreateUser":
        return "Unable to create user account, please try again";
      default:
        return errorCode ? `Authentication error: ${errorCode}` : null;
    }
  };

  if (!error) return null;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">{getErrorMessage(error)}</p>
        </div>
        <div className="text-center">
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
