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
import CategoryButton, { StoryCategory } from "@components/categoryButton";
import { Story } from "@prisma/client";
import { StoryCategoryList } from "constants/category";
import Loading from "@components/loading";

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
  const [cate, setCate] = useState<StoryCategory>("Ask");

  const onValid = ({ content }: StoryUploadForm) => {
    setIsLoading(true);
    if (loading) return;
    storyMutate({ content, cate });
  };

  useEffect(() => {
    if (data?.ok && data?.updateStory) {
      router.replace(`/story/${storyData?.story?.id}`, undefined, {
        unstable_skipClientCache: true,
      });
    }
  }, [router, data, storyData]);

  useEffect(() => {
    if (storyData && !data?.ok) {
      setCate(storyData?.story?.category as StoryCategory);
    }
  }, [setCate, storyData, data]);

  const handleCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCate(event.currentTarget.value as StoryCategory);
  };

  return (
    <Layout
      canGoBack
      title="스토리 수정하기"
      seoTitle="스토리 수정하기"
      pathName="Story"
    >
      {/* 로딩중 */}
      {isLoading && <Loading onOverlay />}
      
      {/* 카테고리 */}

      <div className="p-4 gap-x-2 flex">
        {StoryCategoryList.map((ele, index) => (
          <CategoryButton
            key={index}
            text={ele.text}
            onClick={handleCategory}
            category={cate}
            color={ele.color}
            value={ele.category as any}
          />
        ))}

        {/* <CategoryButton
          text="일상"
          onClick={handleCategory}
          value="Daily"
          category={cate}
          color="violet"
        />
        <CategoryButton
          text="후기"
          onClick={handleCategory}
          value="Review"
          category={cate}
          color="green"
        />
        <CategoryButton
          text="정보"
          onClick={handleCategory}
          value="Info"
          category={cate}
          color="blue"
        />
        <CategoryButton
          text="질문"
          onClick={handleCategory}
          value="Ask"
          category={cate}
          color="orange"
        /> */}
      </div>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea
          register={register("content", {
            required: true,
            minLength: { value: 5, message: "5글자 이상 입력하시오" },
          })}
          required
          defaultValue={storyData?.story?.content}
          color="amber"
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
