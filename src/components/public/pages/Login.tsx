/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../../public/logo.png";
import { useApiMutation } from "../../../api/ApiMutation";
import loginbg from "../../assets/login/loginbg.png";
import loginbg2 from "../../assets/login/loginbg2.png";
import loginimg from "../../assets/login/loginimg.png";
import { loginValidationSchema } from "../../schema";
import { Button } from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { useAuth } from "../../../AuthContextProvider";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export interface formValues {
  email: string;
  password: string;
}

const Login = () => {

  // const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth(); // 👈 get values from context

useEffect(() => {
  if (isAuthenticated && user) {
    if (user.role === "Admin") {
      navigate("/admin"); // 👈 go to admin dashboard
    } else {
      navigate("/"); // 👈 go to normal user homepage
    }
  }
}, [isAuthenticated, user?.role, user, navigate]);

  // const apiService = useApiRequest();

  const form = useForm<formValues>({
    resolver: yupResolver(loginValidationSchema),
  });

  const { register, handleSubmit, formState, setValue } = form;

  const { errors } = formState;

  const { mutate } = useApiMutation("post", "/api/auth/login");

  // const login = async (data: formValues) => {
  //   const { email, password } = data;
  //   const response = await apiService({
  //     method: "post",
  //     path: "/api/v1/login",
  //     data: { email, password },
  //     tokenRequired: false,
  //   });
  //   if (response?.status === 200) {
  //     localStorage.setItem("token", response.data.data.token);
  //     setAuthenticated(true);
  //     navigate("/");
  //   } else if (
  //     response?.status === 400 &&
  //     response.data.message ===
  //     "Your email address is not verified yet. Please check your email or phone for the verification OTP. If you haven’t received it, request a new token to proceed."
  //   ) {
  //     localStorage.setItem("token", response.data.data.token);
  //     navigate("/verify-otp");
  //   } else {
  //     setAuthenticated(false);
  //   }
  // };

const onSubmit = (data: formValues) => {
  console.log(data)
  mutate(data, {
    onSuccess: (response) => {
      const token = response.data.token;

      // Decode the token immediately
      const decoded: any = jwtDecode(token);
      const role = decoded?.role;
      console.log(role)

      // Set login (will set context state and persist token)
      login(token);

      toast.success(response?.data.message);

      // Navigate based on role immediately
      // if (role === "Admin") {
      //   navigate("/admin");
      // } else {
      //   navigate("/");
      // }
    },
    onError: (response) => {
      toast.error(response?.message);
    },
  });
};


  const navigateToForgot = () => navigate("/forgot-password");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-indigo-100">
      <div className="absolute top-0 left-0 h-full w-1/2 hidden md:block">
        <img
          src={loginbg}
          alt="Left background"
          className="object-cover h-full w-full"
        />
      </div>
      <div className="absolute top-0 right-0 h-full hidden md:block">
        <img
          src={loginbg2}
          alt="Right background"
          className="object-cover h-full"
        />
      </div>

      <div className="relative z-10 bg-indigo-200/70 backdrop-blur-md px-6 md:px-10 py-10 md:py-12 rounded-xl shadow-lg max-w-5xl w-full mx-4">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            <img
              src={loginimg}
              alt="Login Illustration"
              className="mx-auto md:mx-0 mb-6 w-3/4 md:w-full hidden md:block"
            />
            <div className="text-xl md:text-2xl font-bold leading-snug text-[#003366] text-center">
              <p>Buy Online</p>
              <p>Safely & Quickly</p>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="flex justify-center mb-3">
              <img src={logo} alt="Logo" className="h-15 object-contain" />
            </div>

            <div className="flex justify-center">
              <h2 className="font-sans font-semibold text-[#006194] mt-2 ">
                Sign in to Continue
              </h2>
            </div>

            <form
              className="w-full mt-4 space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormInput
                labelText="Email"
                labelFor="email"
                id="email"
                name="email"
                type="text"
                register={register}
                handleChange={(e) => {
                  setValue("email", e.target.value);
                }}
                error={errors.email?.message}
                customClass="w-full border-gray-400"
              />
              <FormInput
                labelText="Password"
                labelFor="password"
                id="password"
                name="password"
                type="password"
                register={register}
                handleChange={(e) => {
                  setValue("password", e.target.value);
                }}
                error={errors.password?.message}
                customClass="w-full border-gray-400"
              />
              <div className="flex justify-end mt-1">
                <a
                  href="#"
                  onClick={navigateToForgot}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <Button
                children="Login"
                type="submit"
                className="w-full justify-center text-white bg-[#1056AB] hover:bg-[#3F7ECC] rounded-xl py-3"
              />
            </form>
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
            <p className="mt-4 text-center">
              <Link to="/" className="text-blue-600 hover:underline">
                Go To Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
