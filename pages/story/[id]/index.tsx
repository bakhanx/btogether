import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import TextArea from "@components/textarea";
import useSWR, { useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import DateTime from "@components/datetime";
import Menu from "@components/menu";
import Loading from "@components/loading";
import Button from "@components/button";
import { usePagination } from "@libs/client/usePagination";
import {
  StoryCommentForm,
  StoryCommentFormError,
  StoryCommentListResponse,
  StoryCommentResponse,
  StoryResponse,
} from "types/story";
import Head from "next/head";
import client from "@libs/server/client";
import ScrollToTopButton from "@components/scrollToTopButton";
import CategoryLabel from "@components/categoryLabel";
import { StoryCategory } from "@components/categoryButton";

interface StorySSGResponse extends StoryResponse {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

// 댓글
const Comments = () => {
  const router = useRouter();
  const [pages, setPages] = useState(1);
  const getKey = (
    pageIndex: number,
    previousPageData: StoryCommentListResponse
  ) => {
    setPages(previousPageData.pages);
    if (
      previousPageData &&
      (!previousPageData.ok || pageIndex + 1 > previousPageData.pages)
    )
      return null;
    return `/api/stories/${router.query.id}/comment?page=${pageIndex + 1}`;
  };
  const { data, setSize, mutate, isLoading } =
    useSWRInfinite<StoryCommentListResponse>(getKey);
  const comments = data ? data.map((item) => item.story?.comments).flat() : [];

  const page = usePagination(pages);
  useEffect(() => {
    setSize(page);
  }, [page, setSize]);
  const { mutate: globalMutate } = useSWRConfig();
  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<StoryCommentResponse>(
      `/api/stories/${router.query.id}/comment`
    );

  console.log(commentData);
  // =======================댓글 작성 ====================
  const { register, handleSubmit, reset } = useForm<StoryCommentForm>();
  // ==================댓글 작성======================
  const onValid = (form: StoryCommentForm) => {
    if (commentLoading) return;
    reset();
    comment(form);
  };

  const onInvalid = (form: StoryCommentFormError) => {
    if (commentLoading) return;
    console.log(form);
  };
  // ===================스토리 댓글 삭제=====================

  const onDeleteComment = (
    commentId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!commentLoading) {
      comment({ commentId });
    }
  };

  // 댓글 작성 시 갱신
  useEffect(() => {
    if (commentData?.ok && commentData?.createComment) {
      mutate();
      globalMutate(`/api/stories/${router.query.id}`);
    }
  }, [commentData, mutate, globalMutate, router]);

  // 댓글 삭제 시 갱신
  useEffect(() => {
    if (commentData?.ok && commentData?.deleteComment) {
      mutate();
      globalMutate(`/api/stories/${router.query.id}`);
    }
  }, [commentData, mutate, , globalMutate, router]);

  // 댓글 정렬
  const handleLatest = () => {};
  const handleOldest = () => {};
  return (
    <>
      {/* 댓글 작성란 */}

      <div className="px-4">
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          <TextArea
            register={register("comment", {
              required: true,
            })}
            name="comment"
            placeholder="댓글을 입력해주세요."
            required
            color="amber"
          />
          <div className="py-1" />
          <Button
            text={commentLoading ? "잠시만 기다려주세요..." : "댓글 등록"}
            color="amber"
            large
          />
        </form>
      </div>
      {/* 댓글 리스트 */}
      <div className="px-2 py-3">
        {/* <div className="pl-2 text-sm">
          <button onClick={handleLatest}>최신순</button>
          <button onClick={handleOldest}>오래된순</button>
        </div> */}

        {!isLoading ? (
          comments.map((comment) => (
            <div
              key={comment?.id}
              className="flex bg-gray-50 py-3 my-3 px-3 space-x-3"
            >
              {comment?.user?.avatar ? (
                <div>
                  <div className="relative h-14 w-14">
                    <Image
                      src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${comment?.user?.avatar}/avatar`}
                      alt=""
                      fill
                      priority
                      sizes="1"
                      className="rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full  bg-slate-500" />
              )}
              <div className="flex w-full justify-between">
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    {comment?.user?.name}
                  </span>
                  <div className="flex gap-x-2 text-xs text-gray-500">
                    <DateTime date={comment?.createdAt} />
                    <span>{comment?.isModify ? "(수정됨) " : ""}</span>
                  </div>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {comment?.comment}
                  </p>
                </div>

                <Menu
                  writerId={comment?.userId}
                  onDelete={(e) => onDeleteComment(comment?.id, e)}
                  type="Comment"
                  content={comment?.comment}
                />
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
};

// 메인
const StoryDetail: NextPage<StorySSGResponse> = ({ story }) => {
  const router = useRouter();
  const onBack = () => {
    router.push("/story", undefined, { unstable_skipClientCache: true });
  };
  // =====================스토리 삭제 ===================
  const [deleteMutation, { data: deleteData, loading: deleteLoading }] =
    useMutation(`/api/stories/${router.query.id}/delete`);

  const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!deleteLoading) {
      deleteMutation({});
    }
  };

  useEffect(() => {
    if (deleteData?.ok) {
      alert("스토리 삭제가 완료되었습니다.");
      router.replace("/story", undefined, { unstable_skipClientCache: true });
    }
  }, [deleteData, router]);

  // ======================= 스토리 수정 ====================
  const onModify = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push(`/story/${router.query.id}/modify`);
  };

  const { data: storyData, mutate } = useSWR<StoryResponse>(
    router.query.id ? `/api/stories/${router.query.id}` : null
  );

  //======================Content

  //  ======================== 스토리 좋아요 ====================
  const [storyMutation, { loading: likeLoading }] = useMutation(
    `/api/stories/${router.query.id}/like`
  );

  const onLikeClick = () => {
    if (!storyData || likeLoading) return;
    mutate(
      {
        ...storyData,
        story: {
          ...storyData.story,
          _count: {
            ...storyData.story._count,
            likes: storyData.isLike
              ? storyData.story._count.likes - 1
              : storyData.story._count.likes + 1,
          },
        },
        isLike: !storyData.isLike,
      },
      false
    );
    if (!likeLoading) {
      storyMutation({});
    }
  };

  return (
    <>
      <Head>
        <title>{`${story?.user?.name}님의 스토리`}</title>
      </Head>

      {/* 로딩중 */}
      {deleteLoading && <Loading onOverlay />}

      {/* Top */}
      <div className="fixed top-0 z-10 flex h-12 w-full max-w-screen-lg items-center justify-between bg-blue-300 bg-gradient-to-r  from-pink-500 via-amber-500 to-yellow-500 px-5 text-lg font-medium text-white ">
        {/* 뒤로가기 */}

        <button onClick={onBack} className="">
          <svg
            className="h-6 w-6  "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        {/* 메뉴 */}

        <Menu
          type={"Story"}
          writerId={story?.userId || 0}
          onDelete={onDelete}
          onModify={onModify}
          content={story?.content}
        />
      </div>

      <div className="max-w-screen-md mx-auto">
        {/* 탑 레이아웃 */}
        <div className="pt-16">
          {/* 카테고리 */}
          <CategoryLabel
            category={story?.category as StoryCategory}
            routeType="Story"
          />

          {/* 작성자 프로필 */}
          <Link href={`/users/profile/${storyData?.story?.user?.id}`}>
            <div className="mt-4 mb-3 flex cursor-pointer items-center space-x-3 border-b px-4 pb-3">
              {storyData?.story?.user?.avatar ? (
                <div className="relative h-14 w-14">
                  <Image
                    src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${storyData?.story?.user?.avatar}/avatar`}
                    alt=""
                    sizes="1"
                    priority
                    fill
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full bg-slate-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {storyData?.story?.user?.name || ""}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </p>
              </div>
            </div>
          </Link>

          {/* 내용 */}
          <div className="mt-2 px-4 w-screen">
            <div className="py-5 whitespace-pre-line break-words">
              <span>{story?.content}</span>
            </div>
            <div className="text-xs text-gray-500 ">
              <DateTime date={story?.updatedAt} />
              <span className="text-gray-500">
                {story?.isModify ? " (수정됨) " : ""}
              </span>
            </div>
          </div>
        </div>
        {/*  좋아요 / 댓글*/}
        <div className="mt-3 flex w-full justify-start space-x-5 border-t px-4 py-2.5">
          {/* 좋아요 */}
          <button
            onClick={onLikeClick}
            className={cls(
              "flex items-center space-x-2 text-sm",
              storyData?.isLike ? "text-green-600" : "text-black"
            )}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>좋아요 {storyData?.story?._count?.likes || 0}</span>
          </button>

          {/* 댓글 */}
          <span className="flex items-center space-x-2 text-sm">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="orange"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>

            <span>댓글 {storyData?.story?._count?.comments || 0}</span>
          </span>
        </div>
        <Comments />
        <ScrollToTopButton hasBottomTab={false} />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const story = await client.story.findUnique({
    where: {
      id: Number(context?.params?.id),
    },
    include: {
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      // _count: {
      //   select: {
      //     comments: true,
      //     likes: true,
      //   },
      // },
      // comments: {
      //   include: {
      //     user: true,
      //   },
      // },
    },
  });

  return {
    props: {
      story: JSON.parse(JSON.stringify(story)),
    },
  };
};

export default StoryDetail;
