import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const schema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await axios.post("http://localhost:3000/api/auth/reset-password", {
        token: data.token,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      alert("Password reset successful! Please log in.");
      navigate("/login");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { token: tokenFromUrl },
  });

  React.useEffect(() => {
    if (tokenFromUrl) setValue("token", tokenFromUrl);
  }, [tokenFromUrl, setValue]);

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-screen h-screen bg-purple-200 flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[400px] bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">Reset Password</h1>

        <input type="hidden" {...register("token")} />

        <div>
          <label htmlFor="newPassword" className="block text-sm text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            id="newPassword"
            {...register("newPassword")}
            placeholder="••••••••"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            {...register("confirmNewPassword")}
            placeholder="••••••••"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>}
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-sm text-center">
            {mutation.error?.response?.data?.message || "Failed to reset password"}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
