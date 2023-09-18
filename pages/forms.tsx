import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldErrors } from "react-hook-form/dist/types";

type LoginForm = {
  username: string;
  email: string;
  password: string;
}

export default function Forms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    resetField,
    setValue,
    setError,
  } = useForm<LoginForm>({ mode: "onBlur" });
  //   console.log(watch());

  const onValid = (data: LoginForm) => {
    console.log(data);
    watch("username");
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register("username", {
          required: true,
          minLength: {
            message: "The username should be longer than 5 chars",
            value: 5,
          },
        })}
        type="text"
        placeholder="
        Username"
      />
      <input
        {...register("email", {
          required: true,
          validate: {
            notDaum: (value) =>
              !value.includes("@daum.net") || "Daum is not allowed",
          },
        })}
        type="email"
        placeholder="
        Email"
        className={`${Boolean(errors.email) ? "border0-red-500" : ""}`}
      />
      {errors.email?.message}
      <input
        {...register("password", { required: true })}
        type="password"
        placeholder="
        Password"
      />
      <input type="submit" value="Create Account" />
    </form>
  );
}
