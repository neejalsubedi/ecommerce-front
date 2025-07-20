import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError,  } from "axios";
import { toast } from "react-toastify";
import { apiService, apiUrl } from "./api";

interface SuccessResponse {
  message: string;
}

const isFile = (value: any): boolean => {
  return value instanceof File || value instanceof Blob;
};

const convertToFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        formData.append(`${key}[${i}]`, v);
      });
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

export const useApiMutation = (
  method: "post" | "put" | "delete",
  basePath: string,
  key?: string
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [method, basePath],
    mutationFn: (data?: any) => {
      let payload = data;
      let isMultipart = false;
      let endpoint = `${apiUrl}${basePath}`;

      // Allow dynamic path extension for PUT/DELETE
      if (typeof data === "string") {
        endpoint = `${apiUrl}${basePath}${data}`;
        payload = undefined; // no body
      } else if (typeof data === "object" && typeof data.path === "string") {
        endpoint = `${apiUrl}${basePath}${data.path}`;
        payload = data.body || undefined;
      }

      if (payload && typeof payload === "object") {
        isMultipart = Object.values(payload).some(isFile);
        if (isMultipart) {
          payload = convertToFormData(payload);
        }
      }

      const config = isMultipart
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined;

      switch (method) {
        case "post":
          return apiService.post(endpoint, payload, config);
        case "put":
          return apiService.put(endpoint, payload, config);
        case "delete":
          return apiService.delete(endpoint);
        default:
          throw new Error("Unsupported method");
      }
    },
    onSuccess: (response) => {
      const successMessage = response?.data?.message;
      toast.success(successMessage || "Successful", {
        autoClose: 2000,
        position: "bottom-center",
        className: "bg-black-400",
        progressClassName: "fancy-progress-bar",
      });
      toast.clearWaitingQueue();
      if (key) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    onError: (error: AxiosError<SuccessResponse>) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage || "Something went wrong", {
        autoClose: 2000,
        position: "bottom-center",
        className: "black-background",
        progressClassName: "fancy-progress-bar",
      });
      toast.clearWaitingQueue();
    },
  });

  return mutation;
};
