import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export interface UserResponse {
  ok: boolean;
  profile: User;
}

export default function useUser(pathname?: string) {
  // const { data, error } = useSWR<UserResponse>(
  //   pathname === "/enter" ? null : "/api/users/me"
  // );
  const { data, error } = useSWR<UserResponse>("/api/users/me");
  const router = useRouter();

  useEffect(() => {
    console.log(data);
    if (data && !data?.ok && router.pathname !== "/enter") {
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
