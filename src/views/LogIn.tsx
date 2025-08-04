import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query"; 
import axios from 'axios';

const logInUser = async (data: { email: string; password: string }) => {
  const response = await axios.post("http://localhost:3000/api/auth/login", data);
  return response.data;
} 

const schema = z.object({
  email: z.string().email("email"),
  password: z.string().min(6, "password 6"),
});

type FormData = z.infer<typeof schema>;

export function LogIn() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logInUser,
    onSuccess: (data) => {
      console.log("🎉 Login Success", data.token);
      localStorage.setItem("token", data.token);

      
      navigate("/Dashboard");
    },
    onError: (error: any) => {
      console.error("❌ Login Failed", error.response?.data?.message || error.message);
    }
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
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[400px] bg-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Welblack
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="you@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error?.response?.data?.message || "Login failed"}
            </p>
          )}

          
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md  hover:border-solid hover:border-2 hover:border-black hover:bg-white hover:text-black  transition duration-300"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-500">
          <NavLink to="/ForgotPassword" className="text-black font-semibold hover:bg-black hover:text-white">
            Forgot your password?
          </NavLink>
        </div>

        <div className="mt-2 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <NavLink to="/SingUp" className="text-black font-semibold hover:bg-black hover:text-white">
            Sign up
          </NavLink>
        </div>
      </div>
    </div>
  );
 

 
}
