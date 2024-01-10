import { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { StoryUploadForm, StoryUploadResponse } from "types/story";
import CategoryButton, { StoryCategory } from "@components/categoryButton";
import {StoryCategoryList} from '../../constants/category'

const Upload: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryUploadForm>({ mode: "onSubmit" });
  const [storyMutate, { data, loading }] =
    useMutation<StoryUploadResponse>("/api/stories");
  const [isLoading, setIsLoading] = useState(false);

  const onValid = ({ content }: StoryUploadForm) => {
    setIsLoading(true);
    if (loading) return;
    storyMutate({ content, category });
  };

  useEffect(() => {
    if (data && data.ok) {
      router.replace(`/story/${data.story.id}`, undefined, {
        unstable_skipClientCache: true,
      });
    }
  }, [router, data]);

  // 카테고리 선택
  const [category, setCategory] = useState<StoryCategory>("Daily");

  const handleCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCategory(event.currentTarget.value as StoryCategory);
  };

  return (
    <Layout
      canGoBack
      title="스토리 쓰기"
      seoTitle="스토리 쓰기"
      pathName="Story"
    >
      {/* 카테고리 */}

      <div className="p-4 gap-x-2 flex">
        {StoryCategoryList.map((ele, index) => (
          <CategoryButton
            key={index}
            text={ele.text}
            onClick={handleCategory}
            category={category as any}
            color={ele.color}
            value={ele.category as any}
          />
        ))}

        {/* <CategoryButton
          text="일상"
          onClick={handleCategory}
          value="Daily"
          category={category}
          color="violet"
        />
        <CategoryButton
         
          text="후기"
          onClick={handleCategory}
          value="Review"
          category={category}
          color={"green"}
        />
        <CategoryButton
          
          text="정보"
          onClick={handleCategory}
          value="Info"
          category={category}
          color="blue"
        />
        <CategoryButton
          
          text="질문"
          onClick={handleCategory}
          value="Ask"
          category={category}
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
          placeholder="이웃에게 내 스토리를 공유하세요!"
        />

        <span className="text-red-500">{errors.content?.message}</span>

        <Button
          text={isLoading ? "스토리 등록중..." : "스토리 공유하기"}
          color="amber"
          large
        />
      </form>
    </Layout>
  );
};

export default Upload;
