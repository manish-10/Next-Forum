//1. Login form for name,email,password
//2. Send POST request to /api/auth/Register
//3.If there is an error ,return error
//4. If successful, return to root
import { useAuthDispatch, useAuthState } from "../../src/context/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../../src/components/Layout";
export default function RegisterPage() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { isSubmitting, errors },
  } = useForm();
  const { register: createUser } = useAuthDispatch();
  const { isAuthenticated } = useAuthState();
  const router = useRouter();
  const emailRegexPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  const onSubmit = async ({ name, email, password }) => {
    try {
      await createUser({ name, email, password });
      router.push("/");
    } catch ({ message }) {
      setError("email", {
        type: "manual",
        message,
      });
    }
  };
  return (
    <div className="flex flex-col place-items-center h-full gap-4 ">
      <h1 className="text-3xl font-bold text-red-500">Create an account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col place-items-center h-full gap-4">
          <input
            type="text"
            id="name"
            {...register("name", { required: "Please enter your name" })}
            placeholder="Name"
            className="h-10 shadow-md  w-64 p-3 focus:outline-none bg-gray-100 rounded-md"
          />
          {errors.name && (
            <span className="text-sm font-semibold text-gray-400">
              {errors.name.message}
            </span>
          )}

          <input
            type="text"
            id="email"
            {...register("email", {
              required: "Please enter your email",
              pattern: {
                value: emailRegexPattern,
                message: "Please enter a valid email",
              },
            })}
            placeholder="Email"
            className="h-10 shadow-md  w-64 p-3 focus:outline-none bg-gray-100 rounded-md"
          />
          {errors.email && (
            <span className="text-sm font-semibold text-gray-400">
              {errors.email.message}
            </span>
          )}

          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Please enter your password",
              minLength: {
                message: "Your password must be 6 char long",
                value: 6,
              },
            })}
            placeholder="Password"
            className="h-10 shadow-md  w-64 p-3 focus:outline-none bg-gray-100 rounded-md"
          />
          {errors.password && (
            <span className="text-sm font-semibold text-gray-400">
              {errors.password.message}
            </span>
          )}

          <input
            type="submit"
            className="w-32  shadow-md p-2 bg-indigo-500 text-white rounded-md"
            disabled={isSubmitting}
            value={"Create Account"}
          />
        </div>
      </form>
    </div>
  );
}
RegisterPage.Layout = Layout;
