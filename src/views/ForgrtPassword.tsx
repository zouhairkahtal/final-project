import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPassword() {
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post("http://localhost:3000/api/auth/forgot-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      alert("If your email is registered, you will receive a reset link.");
    },
    onError: (error: any) => {
      alert("Error: " + (error.response?.data?.message || error.message));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="  flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[400px] bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Forgot Password</h1>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            id="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white py-2 rounded-md hover:border-solid hover:border-2 hover:border-black hover:bg-white hover:text-black transition duration-300"
        >
          {mutation.isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
