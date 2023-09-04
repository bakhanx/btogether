import { User } from "@prisma/client";
import useSWR from "swr";

export interface UserResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const { data, error } = useSWR<UserResponse>("/api/users/me");

  return { user: data?.profile, isLoading: !data && !error };
}
