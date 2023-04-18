import { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Story } from "@prisma/client";

interface WriteForm {
  content: string;
}

interface WriteResponse {
  ok: boolean;
  story: Story;
}

const Write: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, setError } = useForm<WriteForm>();
  const [story, { loading, data }] = useMutation<WriteResponse>("/api/stories");

  const onValid = (data: WriteForm) => {
    if (loading) return;
    story(data);
  };

  useEffect(() => {
    if (data && data.ok) {
      console.log(data);
      router.push(`/community/${data.story.id}`);
    }
  }, [router, data]);

  return (
    <Layout canGoBack title="스토리 쓰기" seoTitle="스토리 쓰기">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea
          register={register("content", { required: true, minLength: {value:5, message:"5글자 이상 입력하시오"} })}
          required
          placeholder="이웃에게 내 스토리를 공유하세요!"
        />
        <Button text={loading ? "스토리 등록중..." : "스토리 공유하기"} />
      </form>
    </Layout>
  );
};

export default Write;
