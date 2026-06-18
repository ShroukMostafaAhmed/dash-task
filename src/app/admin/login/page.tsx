"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";

interface LoginForm {
  username: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(data.username, data.password);
    if (ok) {
      document.cookie = "auth=true; path=/; max-age=86400";
      router.push(ROUTES.admin.dashboard);
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">DashFlow Admin Panel</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Username"
              placeholder="admin"
              autoComplete="username"
              error={errors.username?.message}
              {...register("username", { required: "Username is required" })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password", { required: "Password is required" })}
            />

            {error && (
              <p role="alert" className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
