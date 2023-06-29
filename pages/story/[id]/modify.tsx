import { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Story } from "@prisma/client";
import useSWR, { useSWRConfig } from "swr";

interface StoryForm {
  content: string;
}

interface StoryResponse {
  ok: boolean;
  story?: Story;
  updateStory?: Story;
}

const Modify: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryForm>({ mode: "onSubmit" });
  const [storyMutate, { data, loading }] =
    useMutation<StoryResponse>(`/api/stories/${router.query.id}`);
  const [isLoading, setIsLoading] = useState(false);
  const { data: storyData, isLoading: storyIsLoading } = useSWR<StoryResponse>(
    `/api/stories/${router.query.id}`
  );
  console.log(storyData);

  const onValid = (form: StoryForm) => {
    setIsLoading(true);
    if (loading) return;
    storyMutate(form);
  };

  useEffect(() => {
    if (data?.ok && data?.updateStory) {
      router.push(`/story/${storyData?.story?.id}`);
    }
  }, [router, data,storyData]);

  return (
    <Layout canGoBack title="스토리 수정" seoTitle="스토리 수정">
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

        <Button text={isLoading ? "스토리 수정중..." : "스토리 수정하기"} />
      </form>
    </Layout>
  );
};

export default Modify;
