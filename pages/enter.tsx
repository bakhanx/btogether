import Input from "@components/input";
import { cls } from "@libs/client/utils";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";

interface EnterForm {
  email?: string;
  phone?: string;
}

interface TokenForm {
  token: number;
}

interface MutationResult {
  ok: boolean;
}

const Enter: NextPage = () => {
  const [enter, { loading, data, error }] =
    useMutation<MutationResult>("/api/users/enter");
  const [confirmToken, { loading: tokenLoading, data: tokenData }] =
    useMutation<MutationResult>("/api/users/confirm");
  const { register, watch, reset, handleSubmit } = useForm<EnterForm>();
  const { register: tokenRegister, handleSubmit: tokenHandleSubmit } =
    useForm<TokenForm>();

  const [method, setMethod] = useState<"email" | "phone">("email");

  const onEmailClick = () => {
    reset();
    setMethod("email");
  };
  const onPhoneClick = () => {
    reset();
    setMethod("phone");
  };

  const onValid = (validForm: EnterForm) => {
    if (loading) return;
    enter(validForm);
  };

  const onTokenValid = (validForm: TokenForm) => {
    if (tokenLoading) return;
    confirmToken(validForm);
  };

  const router = useRouter();
  useEffect(() => {
    if (tokenData?.ok) {
      router.push("/");
    }
  }, [tokenData, router]);

  return (
    <div className="mt-16 px-4">
      <h3 className="text-center text-3xl font-bold">B - Together</h3>

      <div className="mt-12">
        {data?.ok ? (
          <>
            <form
              className="mt-8 flex flex-col space-y-4"
              onSubmit={tokenHandleSubmit(onTokenValid)}
            >
              <Input
                register={tokenRegister("token")}
                name="token"
                label="토큰"
                type="number"
                required
              />

              <Button text={tokenLoading ? "요청중..." : "토큰 인증하기"} />
            </form>
          </>
        ) : (
          <>
            {/* 로그인 타입 선택 버튼*/}
            <div className="flex flex-col items-center">
              <div className="mt-8 grid w-full grid-cols-2 border-b">
                <button
                  className={cls(
                    "border-b-2 pb-4 text-sm font-medium",
                    method === "email"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-400"
                  )}
                  onClick={onEmailClick}
                >
                  이메일 로그인
                </button>
                <button
                  className={cls(
                    "border-b-2 pb-4 text-sm font-medium",
                    method === "phone"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-400"
                  )}
                  onClick={onPhoneClick}
                >
                  번호 로그인
                </button>
              </div>
            </div>

            <form
              className="mt-8 flex flex-col space-y-4"
              onSubmit={handleSubmit(onValid)}
            >
              {method === "email" ? (
                <Input
                  register={register("email", { required: true })}
                  name="email"
                  label="이메일 주소"
                  type="email"
                  kind="text"
                  required
                />
              ) : null}
              {method === "phone" ? (
                <Input
                  register={register("phone")}
                  name="phone"
                  label="휴대전화 번호"
                  type="number"
                  kind="phone"
                  required
                />
              ) : null}
              {method === "email" ? (
                <Button text={loading ? "요청중..." : "로그인 주소 받기"} />
              ) : null}
              {method === "phone" ? (
                <Button text={loading ? "요청중..." : "일회용 비밀번호 받기"} />
              ) : null}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Enter;
