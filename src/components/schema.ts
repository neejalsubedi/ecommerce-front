import * as yup from "yup";
import type { RegisterFormValues } from "./public/pages/Register";;
export const loginValidationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required!"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters!"),
});

export const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
  referal: yup.string().notRequired().nullable(),
}) as yup.ObjectSchema<RegisterFormValues>;

export const emailSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});
export const otpSchema = yup.object({
  otp0: yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp1: yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp2: yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp3: yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp4: yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
});

export const passwordSchema = yup.object({
  newPassword: yup.string().min(5, "Min 5 characters").required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Required"),
});