export type ProfileEditForm = {
    email?: string;
    phone?: string;
    name?: string;
    formErrors?: string;
    avatar?: string | null;
    noAvatar?: string;
  }
  export type ProfileEditResoponse = {
    ok: boolean;
    error?: string;
  }