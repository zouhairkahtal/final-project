import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// API call for signup
const signUpUser = async (data: {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}) => {
const response = await axios.post("http://localhost:3000/api/auth/register", data);
  return response.data;
};

// Validation schema
const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;


export  function SingUP() {

      const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      console.log("🎉 Signup Success", data);
      navigate("/login");
    },
    onError: (error: any) => {
      console.error(
        "❌ Signup Failed",
        error.response?.data?.message || error.message
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };
                 return (
    <div className="w-full h-full bg-purple-200 flex items-center justify-center">
      <div className="w-[400px] bg-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">
          Create an account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="firstName" className="block text-sm text-gray-600 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName")}
              placeholder="John"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm text-gray-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="you@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              placeholder="••••••••"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

        {mutation.isError && (
  <p className="text-red-500 text-sm text-center">
    {mutation.error?.response?.data?.message || mutation.error?.message || "Signup failed"}
  </p>
)}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-2 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <NavLink to="/login" className="text-purple-600 font-semibold hover:underline">
            Log in
          </NavLink>
        </div>
      </div>
    </div>
  );
            }