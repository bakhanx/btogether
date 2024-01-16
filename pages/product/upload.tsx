import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { ProductUploadForm, ProductUploadMutation } from "types/product";
import { PRODUCT } from "constants/product";
import CategoryButton, { ProductCategory } from "@components/categoryButton";
import { ProductCategoryList } from "constants/category";
import Loading from "@components/loading";

const Upload: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProductUploadForm>({ mode: "onChange" });
  const [uploadProduct, { loading, data }] =
    useMutation<ProductUploadMutation>("/api/products");

  const photo = watch("photo");
  const price = watch("price");

  const [parsePrice, setParsePrice] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);

  useEffect(() => {
    let value = price;
    const numValue = value?.replaceAll(",", "");
    value = numValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setParsePrice(value);
  }, [price]);

  const onValid = async ({
    photo,
    name,
    price,
    description,
  }: ProductUploadForm) => {
    setIsLoading(true);
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await (await fetch("/api/files")).json();

      const form = new FormData();
      form.append("file", photo[0], name);

      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      uploadProduct({ name, price, description, photoId: id, category });
    } else {
      uploadProduct({ name, price, description, category });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.replace(`/product/${data.product.id}`, undefined, {
        unstable_skipClientCache: true,
      });
    }
  }, [data, router]);

  // 카테고리 선택
  const [category, setCategory] = useState<ProductCategory>("Product");

  const handleCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setValue("price", "");

    setCategory(event.currentTarget.value as ProductCategory);
    if (event.currentTarget.value === "Free") {
      setValue("price", "0");
    }
  };

  return (
    <Layout
      canGoBack
      title="상품 / 나눔 / 모임 등록하기"
      seoTitle="상품/나눔/모임 등록하기"
      pathName="Product"
    >
      {/* 로딩중 */}
      {isLoading && <Loading onOverlay />}

      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center justify-center">
          <div className="absolute -z-50 h-96 aspect-video w-10/12 max-w-screen-sm">
            {photoPreview && (
              <Image
                className="flex rounded-md object-contain"
                src={photoPreview}
                alt=""
                fill
                quality={90}
              />
            )}
          </div>

          <label className="flex h-96 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500">
            {!photoPreview && (
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <input
              {...register("photo")}
              // accept="image/*"
              accept=".png, .jpeg, .jpg"
              className="hidden"
              type="file"
            />
          </label>
        </div>

        {/* 제목 */}
        <Input
          register={register("name", { required: true })}
          required
          label="제목"
          name="name"
          type="text"
          placeholder="필수 입력"
        />
        {/* 카테고리 */}

        <div className="gap-x-2 flex">
          {ProductCategoryList.map((ele, index) => (
            <CategoryButton
              key={index}
              text={ele.text}
              onClick={handleCategory}
              category={category as any}
              color={ele.color}
              value={ele.category as any}
            />
          ))}
        </div>

        {/* 가격 */}
        <Input
          register={register("price", {
            required: true,
            maxLength: {
              value: PRODUCT.MAX_PRICE_NUMBER,
              message: "금액이 일정 한도를 초과하였습니다.",
            },
            pattern: {
              value: /^[0-9,]+$/,
              message: "숫자만 입력하세요",
            },
          })}
          required
          label="가격 (선택사항)"
          placeholder="0"
          name="price"
          type="text"
          kind="price"
          value={parsePrice}
          disabled={category === "Free" ? true : false}
        />
        {/* 1억이상 입력 시 에러 */}
        <div className="text-red-500">
          {errors?.price ? errors?.price?.message : ""}
        </div>
        {/* 내용  */}
        <TextArea
          register={register("description", { required: true })}
          required
          name="description"
          label="내용"
          placeholder="공지사항 위반 내용 기입 시, 삭제 처리될 수 있습니다."
        />

        <Button
          text={isLoading ? "등록중..." : "등록하기"}
          large
          color="blue"
        />
      </form>
      {}
    </Layout>
  );
};

export default Upload;
