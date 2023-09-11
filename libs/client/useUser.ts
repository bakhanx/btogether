import useSWR from "swr";
import { UserResponse } from "types/user";

export default function useUser() {
  const { data, error } = useSWR<UserResponse>("/api/users/me");

  return { user: data?.profile, isLoading: !data && !error };
}
