import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";
import { error } from "console";

// 판매 상품 가격 제한 1억
const MAX_PRICE = 10;

interface UploadProductForm {
  name: string;
  price: string;
  description: string;
  photo: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<UploadProductForm>({ mode: "onChange" });
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");

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
  }: UploadProductForm) => {
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
      uploadProduct({ name, price, description, photoId: id });
    } else {
      uploadProduct({ name, price, description });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Upload Product" seoTitle="상품 올리기">
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex justify-center">
          {photoPreview ? (
            <Image
              className="flex h-48 w-auto rounded-md"
              src={photoPreview}
              alt=""
              width={280}
              height={80}
            ></Image>
          ) : (
            <label className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500">
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

              <input
                {...register("photo")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
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
        {/* 가격 */}
        <Input
          register={register("price", {
            required: true,
            maxLength: {
              value: MAX_PRICE,
              message: "고가 물품은 판매할 수 없습니다.",
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

        <Button text={isLoading ? "등록중..." : "상품 등록하기"} />
      </form>
      {}
    </Layout>
  );
};

export default Upload;
