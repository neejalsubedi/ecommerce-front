/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { apiService } from "./api";

interface UseApiQueryProps {
  method?: "GET"; // For now we mainly support GET (mutations already use POST, PUT, DELETE separately)
  endpoint: string;
  queryParams?: Record<string, any>; // optional params
  enabled?: boolean; // control auto-fetch
  config?: AxiosRequestConfig; // axios config
  queryKey?: string | (string | Record<string, any>)[]; //this type as querry key can or may accept object querryparams as querry filter not just string
}

export interface InitApiResponse {
  data: {
    id: string;
    name: string;
    email: string;
    moduleList: any[];
  };
}

export const useApiGet = <T>({
  method = "GET",
  endpoint,
  queryParams,
  enabled,
  config,
  queryKey,
}: UseApiQueryProps) => {
  return useQuery({
    queryKey: queryKey
      ? Array.isArray(queryKey)
        ? queryKey
        : [queryKey]
      : [endpoint, queryParams ?? {}],
    queryFn: async () => {
      if (method === "GET") {
        const response = await apiService.get<T>(endpoint, {
          params: Object.keys(queryParams || {}).length ? queryParams : {},
          ...config,
        });
        return response.data;
      } else {
        throw new Error("Unsupported method in useApiQuery");
      }
    },
    enabled,
  });
};
