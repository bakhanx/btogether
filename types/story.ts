export type EditProfileForm = {
    email?: string;
    phone?: string;
    name?: string;
    formErrors?: string;
    avatar?: string | null;
    noAvatar?: string;
  }
  export type EditProfileResponse = {
    ok: boolean;
    error?: string;
  }