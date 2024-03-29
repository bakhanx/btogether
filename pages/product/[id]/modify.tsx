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
import useSWR from "swr";
import {
  ProductResponse,
  ProductUploadForm,
  ProductUploadResponse,
} from "types/product";
import { PRODUCT } from "constants/product";
import CategoryButton, { ProductCategory } from "@components/categoryButton";
import { ProductCategoryList } from "constants/category";
import Loading from "@components/loading";

const Modify: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<ProductUploadForm>({ mode: "onBlur" });
  const [uploadProduct, { loading, data }] =
    useMutation<ProductUploadResponse>("/api/products");
  const { data: productData, isLoading: productIsLoading } =
    useSWR<ProductResponse>(
      router.query.id ? `/api/products/${router.query.id}` : ""
    );

  const photo = watch("photo");
  const price = watch("price");

  const [parsePrice, setParsePrice] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChangePhoto, setIsChangePhoto] = useState(false);

  // 카테고리 선택
  const [cate, setCate] = useState<ProductCategory>("Product");

  // ================ 사진 ========================
  useEffect(() => {
    if (productData?.product?.image && !isChangePhoto) {
      setPhotoPreview(
        `https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${productData?.product?.image}/public`
      );
    }
    if (photo && photo.length > 0) {
      setIsChangePhoto(true);
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo, productData, isChangePhoto]);

  // ====================================================

  // ================= 가격 콤마 설정 ================

  const handleParsePrice = () => {
    let value = getValues("price");
    if (value !== "0") {
      const numValue = value?.replaceAll(",", "");
      value = numValue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setParsePrice(value);
      setValue("price", value);
    }
  };

  // ==================================================

  // =================== 기존 값 입력 ==================

  useEffect(() => {
    if (productData) {
      setValue("name", productData?.product.name);
      setValue("price", String(productData?.product?.price));
      handleParsePrice();
      setValue("description", productData?.product?.description);
      setValue("category", productData?.product.category);
    }
  }, [setValue, productData]);

  // ====================================================

  const handleCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCate(event.currentTarget.value as ProductCategory);

    if (parsePrice === "") {
      setValue("price", "");
    }

    if (event.currentTarget.value === "Free") {
      setValue("price", "0");
      setParsePrice("");
    }
  };

  const onValid = async ({
    photo,
    name,
    price,
    description,
    productId,
    category,
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
      uploadProduct({
        name,
        price,
        description,
        photoId: id,
        productId: router.query.id,
        category: cate,
      });
    } else {
      uploadProduct({
        name,
        price,
        description,
        productId: router.query.id,
        category: cate,
      });
    }
  };

  useEffect(() => {
    if (data?.ok && data.updateProduct) {
      alert("수정이 완료되었습니다.");
      router.replace(`/product/${router.query.id}`, undefined, {
        unstable_skipClientCache: true,
      });
    }
  }, [data, router]);

  useEffect(() => {
    if (productData && !data?.ok) {
      setCate(productData?.product.category);
    }
  }, [setCate, productData, data]);

  return (
    <Layout
      canGoBack
      title="내 글 수정하기"
      seoTitle="내 글 수정하기"
      pathName="Product"
    >
      {isLoading && <Loading onOverlay/>}
      {!productIsLoading ? (
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
                accept=".png, .jpeg, .jpg"
                className="hidden"
                type="file"
              />
            </label>
          </div>
          {/* 제목 */}
          <Input
            register={register("name", {
              required: { value: true, message: "제목 필수입력" },
            })}
            required
            label="제목"
            name="name"
            type="text"
          />
          <span className="text-red-500">
            {errors?.name ? errors?.name?.message : ""}
          </span>

          {/* 카테고리 */}

          <div className="gap-x-2 flex">
            {ProductCategoryList.map((ele, index) => (
              <CategoryButton
                key={index}
                text={ele.text}
                onClick={handleCategory}
                category={cate as any}
                color={ele.color}
                value={ele.category as any}
              />
            ))}
          </div>

          {/* 가격 */}
          <Input
            register={register("price", {
              required: { value: true, message: "가격 필수입력" },
              maxLength: {
                value: PRODUCT.MAX_PRICE_NUMBER,
                message: "금액이 일정 한도를 초과하였습니다.",
              },
              pattern: {
                value: /^[0-9,]+$/,
                message: "숫자만 입력하세요",
              },
              onBlur() {
                handleParsePrice();
              },
            })}
            onFocus={() => {
              setValue("price", parsePrice.replaceAll(",", ""));
            }}
            required
            label="가격 (선택사항)"
            name="price"
            placeholder="0"
            type="text"
            kind="price"
            defaultValue={parsePrice}
            disabled={cate === "Free" ? true : false}
          />
          {/* 1억이상 입력 시 에러 */}
          <div className="text-red-500">
            {errors?.price ? errors?.price?.message : ""}
          </div>
          {/* 내용  */}
          <TextArea
            register={register("description", {
              required: { value: true, message: "내용 필수입력" },
            })}
            required
            name="description"
            label="내용"
          />
          <span className="text-red-500">
            {errors?.description ? errors?.description?.message : ""}
          </span>

          <Button
            text={isLoading ? "수정중..." : "수정하기"}
            large
            color="blue"
          />
        </form>
      ) : null}
    </Layout>
  );
};

export default Modify;
