import { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { StoryModifyResponse, StoryUploadForm } from "types/story";

const Modify: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryUploadForm>({ mode: "onSubmit" });
  const [storyMutate, { data, loading }] = useMutation<StoryModifyResponse>(
    `/api/stories/${router.query.id}`
  );
  const [isLoading, setIsLoading] = useState(false);
  const { data: storyData } = useSWR<StoryModifyResponse>(
    `/api/stories/${router.query.id}`
  );

  const onValid = (form: StoryUploadForm) => {
    setIsLoading(true);
    if (loading) return;
    storyMutate(form);
  };

  useEffect(() => {
    if (data?.ok && data?.updateStory) {
      router.push(`/story/${storyData?.story?.id}`);
    }
  }, [router, data, storyData]);

  return (
    <Layout
      canGoBack
      title="스토리 수정하기"
      seoTitle="스토리 수정하기"
      pathName="Story"
    >
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea
          register={register("content", {
            required: true,
            minLength: { value: 5, message: "5글자 이상 입력하시오" },
          })}
          required
          defaultValue={storyData?.story?.content}
        />

        <span className="text-red-500">{errors.content?.message}</span>

        <Button
          text={isLoading ? "스토리 수정중..." : "스토리 수정하기"}
          large
          color="amber"
        />
      </form>
    </Layout>
  );
};

export default Modify;
