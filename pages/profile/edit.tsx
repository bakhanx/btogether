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
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";
import useSWR from "swr";
import { ProfileEditForm, ProfileEditResoponse } from "types/profile";
import { UserResponse } from "types/user";
import Loading from "@components/loading";

const EditProfile: NextPage = () => {
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ProfileEditForm>();

  const { user } = useUser();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isExistAvatar, setIsExistAvatar] = useState(false);
  const [init, setInit] = useState(false);
  const { data: profileData, mutate } = useSWR<UserResponse>(`/api/users/me`);

  const [editProfile, { data, loading }] =
    useMutation<ProfileEditResoponse>(`/api/users/me`);

  const [isLoading, setIsLoading] = useState(false);
  const onValid = async ({ email, phone, name, avatar }: ProfileEditForm) => {
    setIsLoading(true);
    if (loading) return;

    if (email === "" && phone === "") {
      return setError("formErrors", {
        message: "이메일이나 주소를 입력하세요.",
      });
    }

    if (!isExistAvatar) avatar = null;
    // 기존상관없이 변경o
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
    }

    // 기존아바타o
    else if (profileData?.profile.avatar) {
      console.log("기존아바타o");
      if (!isExistAvatar) {
        console.log("변경x 삭제o");
        // 변경x 삭제 o
        editProfile({
          email,
          phone,
          name,
          avatarId: "remove",
        });
      } else if (!avatarPreview) {
        console.log("변경x 삭제x");
        // 변경x 삭제 x
        editProfile({
          email,
          phone,
          name,
        });
      }
    }

    // 기존아바타x
    else if (!profileData?.profile.avatar) {
      console.log("기존아바타x");
      if (!avatarPreview) {
        console.log("변경x 삭제x");
        // 변경x 삭제x
        editProfile({
          email,
          phone,
          name,
        });
      }
    }
  };

  const router = useRouter();

  useEffect(() => {
    setValue("name", profileData?.profile?.name || "");
    setValue("phone", profileData?.profile?.phone || "");
    setValue("email", profileData?.profile?.email || "");
  }, [setValue, profileData]);

  useEffect(() => {
    if (data?.ok) {
      alert("프로필 수정이 완료되었습니다.");
      router.push("/profile");
    }
    if (!data?.ok && data?.error) {
      setIsLoading(false);
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

  // 프로필 사진 변경하기
  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      if (value?.avatar && value?.avatar?.length > 0) {
        const file: any = value.avatar[0];
        setAvatarPreview(URL.createObjectURL(file));
        setIsExistAvatar(true);
      }
    });
    return () => unsubscribe();
  }, [watch]);

  // 프로필 사진 삭제하기
  const resetAvatar = (event: any) => {
    event.preventDefault();
    if (!isExistAvatar) return;
    console.log("프로필 사진 제거 시작");
    setIsExistAvatar(false);
    setAvatarPreview(null);
  };

  useEffect(() => {
    if (profileData?.profile.avatar && !avatarPreview && !init) {
      setIsExistAvatar(true);
      setInit(true);
    }
  }, [profileData, avatarPreview, init]);

  return (
    <Layout
      hasTabBar
      canGoBack
      title="프로필 편집"
      seoTitle="내 프로필 편집"
      pathName="Profile"
    >
      {/* 로딩중 */}
      {isLoading && <Loading onOverlay />}

      {profileData ? (
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
          <div className="flex items-center space-x-3">
            {isExistAvatar ? (
              <div className="relative h-16 w-16 ">
                <Image
                  src={
                    profileData?.profile?.avatar && !avatarPreview
                      ? `https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${profileData?.profile?.avatar}/avatar`
                      : (avatarPreview as string)
                  }
                  alt=""
                  fill
                  priority
                  sizes="1"
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-500" />
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
                accept=".png, .jpeg, .jpg"
              />
            </label>

            {/* 이미지 삭제 */}
            <label className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-red-500 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <button onClick={resetAvatar}>삭제</button>
            </label>
          </div>
          <Input
            register={register("name", { required: true })}
            label="닉네임"
            value={profileData?.profile?.name}
            name="name"
            type="text"
            required={true}
            onChange={onChange}
          />

          <Input
            register={register("email", { required: false })}
            label="이메일 주소"
            name="email"
            type="email"
            required={false}
            onChange={onChange}
          />
          <Input
            register={register("phone", { required: false })}
            label="전화번호"
            name="phone"
            type="phone"
            required={false}
            onChange={onChange}
          />

          <div className="my-2 font-bold text-red-500">
            <span>{errors?.formErrors?.message}</span>
          </div>
          <Button text={isLoading ? "수정중..." : "프로필 수정"} color="blue" />
        </form>
      ) : (
        "Loading..."
      )}
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
