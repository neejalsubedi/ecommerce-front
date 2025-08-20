/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import logo from "../../../../public/logo.png";
import loginbg from "../../assets/login/loginbg.png";
import loginbg2 from "../../assets/login/loginbg2.png";
import loginimg from "../../assets/login/loginimg.png";

import { toast } from "react-toastify";
import { useApiGet } from "../../../api/ApiGet";
import { useApiMutation } from "../../../api/ApiMutation";
import { Button } from "../../ui/Button";
import FormInput from "../../ui/FormInput";
export interface Role {
  key: string;
  value: string;
}

export interface RolesResponse {
  roles: Role[];
}

export interface RegisterFormValues {
  username: string;
  phone: string;
  email: string;
  password: string;
  address:string;
  role?: string;
}

const Register = () => {
  // const created_by = 5157;
  // const { setAuthenticated } = useAuth();
  // const navigate = useNavigate();
  // const apiService = useApiRequest();

  const {
    register,
    handleSubmit,
    // setValue,
    // watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const { data: roles } = useApiGet<RolesResponse>({
    endpoint: "/api/roles/role",
    queryKey: "ROLES",
  });
  // const roleOptions=roles?.roles.map((role)=>({
  //   label:role.key,
  //   value:role.value
  // }))
  console.log(roles);

  // const selectedRole = watch("role");

  const { mutate: createUser } = useApiMutation("post", "/api/auth/register");

  const onSubmit = async (data: RegisterFormValues) => {
    console.log("Form Submitted", data);
    createUser(data, {
      onSuccess: (res) => {
        toast.success(res?.data.message);
      },
      onError: (res) => {
        toast.error(res?.message);
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-indigo-100">
      {/* Background Images */}
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
      {/* Register Card */}
      <div className="relative z-10 bg-indigo-200/70 backdrop-blur-md px-6 md:px-10 py-10 md:py-12 rounded-xl shadow-lg max-w-5xl w-full mx-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Section */}
          <div className="md:w-1/2 text-center md:text-left">
            <img
              src={loginimg}
              alt="Login Illustration"
              className="mx-auto md:mx-0 mb-6 w-3/4 md:w-full hidden md:block"
            />
            <p className="text-xl md:text-2xl font-bold leading-snug text-[#003366] text-center">
              <p>Transfer Money Online</p>
              <p>Safely & Quickly</p>
            </p>
          </div>

          {/* Right Section */}
          <div className="md:w-1/2">
            <div className="flex justify-center mb-3">
              <img src={logo} alt="Logo" className="h-15 object-contain" />
            </div>
            <h2 className="text-center font-semibold text-[#006194] mb-4 text-lg">
              Register to Continue
            </h2>
            <form className="space-y-3 pr-2" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                labelText="Name"
                labelFor="username"
                id="username"
                name="username"
                type="text"
                register={register}
                error={errors.username?.message}
              />
              <FormInput
                labelText="Email"
                labelFor="email"
                id="email"
                name="email"
                type="text"
                register={register}
                error={errors.email?.message}
              />
              <FormInput
                labelText="Phone"
                labelFor="phone"
                id="phone"
                name="phone"
                type="text"
                register={register}
                error={errors.phone?.message}
              />
              <FormInput
                labelText="Address"
                labelFor="address"
                id="address"
                name="address"
                type="text"
                register={register}
                error={errors.address?.message}
              />
              <FormInput
                labelText="Password"
                labelFor="password"
                id="password"
                name="password"
                type="password"
                register={register}
                error={errors.password?.message}
              />
              {/* <FormInput
                labelText="Confirm Password"
                labelFor="confirmPassword"
                id="confirmPassword"  
                name="confirmPassword"
                type="password"
                register={register}
                error={errors.confirmPassword?.message}
              /> */}
              {/* <FormInput
                labelText="Role"
                labelFor="role"
                id="role"
                name="role"
                type="text"
                register={register}
                error={errors.role?.message}
              /> */}
              {/* <FormInput
                labelText="Role"
                labelFor="role"
                id="role"
                name="role"
                type="select"
                options={roleOptions}
                value={selectedRole}
                handleSelectChange={(value) => {
                  setValue("role", value);
                }}
                register={register}
                error={errors.role?.message}
                
              /> */}
              <Button
                type="submit"
                className="w-full justify-center text-white bg-[#1056AB] hover:bg-[#3F7ECC] cursor-pointer rounded-xl py-3 mt-2"
                children={"Register"}
              />
            </form>
            <p className="mt-4 text-center">
              Already have account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
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

export default Register;
