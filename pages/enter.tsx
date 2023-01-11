import { NextPage } from "next";
import { useState } from "react";
import Button from "../components/button";
import Input from "../components/Input";
import { cls } from "../lib/utils";

const Enter: NextPage = () => {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const onEmailClick = () => setMethod("email");
  const onPhoneClick = () => setMethod("phone");

  return (
    <div className="mt-16 px-4">
      <h3 className="text-center text-3xl font-bold">Enter to B-Together</h3>

      <div className="mt-12">
        {/* 로그인 타입 선택 버튼*/}
        <div className="flex flex-col items-center">
          <h5 className="text-sm font-medium text-gray-500">Enter using:</h5>
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
              Email
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
              Phone
            </button>
          </div>
        </div>

        <form className="flex flex-col mt-8 space-y-4">
          {method === "email" ? (
            <Input
              name="email"
              label="Email Address"
              type="email"
              kind="text"
              required
            />
          ) : null}
          {method === "phone" ? (
            <Input
              name="phone"
              label="Phone Number"
              type="number"
              kind="phone"
              required
            />
          ) : null}
          {method === "email" ? <Button text="Get Login Link" /> : null}
          {method === "phone" ? <Button text="Get one-time password" /> : null}
        </form>
      </div>
    </div>
  );
};

export default Enter;
