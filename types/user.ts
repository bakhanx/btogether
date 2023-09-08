import { User } from "@prisma/client";

export type UserResponse = {
    ok: boolean;
    profile: User;
  }