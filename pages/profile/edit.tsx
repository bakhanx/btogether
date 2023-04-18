import { NextPage, NextPageContext } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Image from "next/image";
import { SWRConfig } from "swr";
import { User } from "@prisma/client";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import useSWR from "swr";
import { UserResponse } from "@libs/client/useUser";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  formErrors?: string;
  avatar?: string;
}
interface EditProfileResponse {
  ok: boolean;
  error?: string;
}
const EditProfile: NextPage = () => {
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<EditProfileForm>();

  const { user } = useUser();

  const { data: profileData } = useSWR<UserResponse>(`/api/users/me`);

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;

    if (email === "") {
      return setError("formErrors", {
        message: "이메일 주소를 입력하세요.",
      });
    } else if (phone === "") {
      return setError("formErrors", {
        message: "전화번호를 입력하세요.",
      });
    }

    if (avatar && avatar.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      console.log(uploadURL);

      const form = new FormData();
      form.append("file", avatar[0]);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editProfile({
        email,
        phone,
        name,
        avatarId: id,
      });
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (data?.ok) {
      alert("프로필 수정이 완료되었습니다.");
      router.push("/profile");
    }
    if (!data?.ok && data?.error) {
      return setError("formErrors", {
        message: data?.error,
      });
    }
  }, [data, setError, router]);

  // form error clear
  const onChange = (form: any) => {
    if (form.target.value.length === 1) {
      clearErrors("formErrors");
      clearErrors("formErrors");
    }
  };

  // useEffect(() => {
  //   if (user?.avatar)
  //     setAvatarPreview(
  //       `https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${user?.avatar}/avatar`
  //     );
  // }, [setValue, user]);

  const avatar = watch("avatar");

  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (avatar && avatar?.length > 0) {
      const file: any = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  const resetAvatar = (event: any) => {
    event.preventDefault();
    setAvatarPreview("");
  };

  return (
    <Layout hasTabBar canGoBack title="프로필 편집" seoTitle="내 프로필 편집">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          {/* profle.user.avatar가 있으면 profile.user.avatar. 
              없으면, 껍데기.
              이미지 변경해서 만들면 setPrivewAvatar.
              그래서, previewAvatar가 있으면 이걸로 변경.
          
          
          */}
          {!avatarPreview && profileData?.profile.avatar && (
            <Image
              src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${profileData?.profile.avatar}/avatar`}
              alt=""
              width={1366}
              height={768}
              className="h-14 w-14 rounded-full"
            />
          )}
          {avatarPreview && (
            <Image
              src={avatarPreview}
              alt=""
              width={1366}
              height={768}
              className="h-14 w-14 rounded-full"
            />
          )}
          {!avatarPreview && !profileData?.profile.avatar && (
            <div className="h-14 w-14 rounded-full bg-slate-500" />
          )}

          {/* 이미지 변경 */}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            변경하기
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>

          {/* 이미지 삭제 */}
          <label
            htmlFor=""
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-red-500 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <button onClick={resetAvatar}>삭제</button>
          </label>
        </div>
        <Input
          register={register("name", { required: false })}
          label="닉네임"
          value={profileData?.profile?.name}
          name="name"
          type="text"
          required={false}
          onChange={onChange}
        />
        {user?.email ? (
          <Input
            register={register("email", { required: false })}
            label="이메일 주소"
            value={profileData?.profile?.email || ""}
            name="email"
            type="email"
            required={false}
            onChange={onChange}
          />
        ) : (
          <Input
            register={register("phone", { required: false })}
            label="전화번호"
            value={profileData?.profile.phone || ""}
            name="phone"
            type="phone"
            required={false}
            onChange={onChange}
          />
        )}
        <div className="my-2 font-bold text-red-500">
          <span>{errors.formErrors?.message}</span>
        </div>
        <Button text={loading ? "수정중..." : "프로필 수정"} />
      </form>
    </Layout>
  );
};

const Page: NextPage<{ profile: UserResponse }> = ({ profile }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me": {
            ok: true,
            profile,
          },
        },
      }}
    >
      <EditProfile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const profile = await client?.user.findUnique({
    where: {
      id: req?.session.user?.id,
    },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
});

export default Page;
