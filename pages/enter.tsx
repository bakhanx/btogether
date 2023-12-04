import Input from "@components/input";
import { cls } from "@libs/client/utils";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Logo from "../public/images/logo/logo_01_small.png";

import Image from "next/image";
import { EnterForm, MutationResult, TokenForm } from "types/enter";

// const Alert = lazy(
//   (): any =>
//     new Promise((resolve) =>
//       setTimeout(() => resolve(import("@components/alert")), 3000)
//     )
// );

// const Alert = dynamic(
//   () : any =>
//     new Promise((resolve)  =>
//       setTimeout(() => resolve(import("@components/alert")), 3000)
//     ),
//   { ssr: false,suspense:true,  loading: () => <span>로딩중</span> }
// );

const Enter: NextPage = () => {
  const [enter, { loading, data }] =
    useMutation<MutationResult>("/api/users/enter");
  const [confirmToken, { loading: tokenLoading, data: tokenData }] =
    useMutation<MutationResult>("/api/users/confirm");
  const { register, reset, handleSubmit } = useForm<EnterForm>();
  const { register: tokenRegister, handleSubmit: tokenHandleSubmit } =
    useForm<TokenForm>();
  const [method, setMethod] = useState<"email" | "phone">("email");

  const handleEmailForm = () => {
    reset();
    setMethod("email");
  };
  const handlePhoneForm = () => {
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
    console.log(tokenData);
    console.log();
    if (tokenData?.ok) {
      router.push("/");
    }
  }, [router, tokenData]);

  return (
    <div className=" px-4 h-screen py-10">
      <title>로그인 # B-together</title>

      <div className="flex flex-col items-center justify-center h-1/3">
        <h3 className="text-3xl font-bold">B - Together</h3>
        <h1 className="p-1 text-gray-500">이웃과 함께하는 비투게더</h1>
        <div className="h-32 w-64">
          <div className="relative h-full w-full">
            <Image fill alt="" src={Logo} priority sizes="1" />
          </div>
        </div>
      </div>

      <div className="h-1/3">
        {data?.ok ? (
          <>
            <form
              className="mt-8 flex flex-col space-y-4"
              onSubmit={tokenHandleSubmit(onTokenValid)}
            >
              <p className="pt-4">
                입력하신 {method === "phone" ? "번호" : "메일"}로 인증코드가
                발송되었습니다.
              </p>

              <Input
                register={tokenRegister("token")}
                name="token"
                label="인증 코드"
                type="number"
                required
              />

              <Button
                text={tokenLoading ? "요청중..." : "인증하기"}
                large
                color="blue"
              />
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
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-500 hover:text-gray-500"
                  )}
                  onClick={handleEmailForm}
                >
                  이메일 로그인
                </button>
                <button
                  className={cls(
                    "border-b-2 pb-4 text-sm font-medium",
                    method === "phone"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-200 hover:text-gray-200"
                  )}
                  onClick={handlePhoneForm}
                  disabled
                >
                  번호 로그인 (점검중)
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
                  placeholder="btogether@gmail.com"
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
                  placeholder="01012345678"
                  required
                />
              ) : null}
              {method === "email" ? (
                <Button
                  text={loading ? "요청중..." : "인증 코드 받기"}
                  large
                  color="blue"
                />
              ) : null}
              {method === "phone" ? (
                <div>
                  <Button
                    text={loading ? "요청중..." : "인증 코드 받기"}
                    large
                    color="blue"
                  />
                </div>
              ) : null}
            </form>
          </>
        )}
      </div>

      <div className=" h-1/3 flex items-end ">
        <footer className="text-xs  text-gray-500 ">
          <div>
            <span className="font-bold">대표</span> 박한솔 |{" "}
            <span className="font-bold">사업자번호</span> 000-00-0000
          </div>
          <div>
            <span className="font-bold">직업정보제공사업 신고번호</span>
            J00000000000
          </div>
          <div>
            <span className="font-bold">주소</span> 서울특별시 OO구 OOO로 OO길
            00
          </div>
          <div>
            <span className="font-bold">고객문의</span> bkndev7@gmail.com
          </div>
          <div className="flex gap-2 pt-2">
            <div>
              <span className="font-bold">이용약관</span>
            </div>
            <div>
              <span className="font-bold">개인정보처리방침</span>
            </div>
            {/* <div>
              <span className="font-bold">위치기반서비스 이용약관</span>
            </div> */}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Enter;
