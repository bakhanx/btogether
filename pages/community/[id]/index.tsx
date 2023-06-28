import { GetServerSideProps, NextPage, NextPageContext } from "next";
import TextArea from "@components/textarea";
import useSWR, { KeyedMutator, SWRConfig, unstable_serialize } from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Comment, Story, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { Suspense, useEffect, useState } from "react";
import client from "@libs/server/client";
import Image from "next/image";
import useUser from "@libs/client/useUser";
import DateTime from "@components/datetime";
import Menu from "@components/menu";
import Loading from "@components/loading";
import TopNav from "@components/topNav";
import Button from "@components/button";

interface CommentsWithUser extends Comment {
  user: User;
}
interface StorySSGResponse extends Story {
  ok: boolean;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
  comments: CommentsWithUser[];
}
interface StoryResponse {
  ok: boolean;
  story: storyDetail;
  isLike: boolean;
}
interface storyDetail extends Story {
  _count: {
    likes: number;
    comments: number;
  };
  user: User;
  comments: CommentsWithUser[];
}
interface CommentForm {
  comment: string;
}
interface CommentFormError {
  comment?: {
    type?: string;
    message?: string;
  };
}
interface CommentResponse {
  ok: boolean;
  createComment?: Comment;
  deleteComment?: Comment;
}

const CommunityDetail: NextPage = () => {
  const router = useRouter();
  const { data: storyData, mutate } = useSWR<StoryResponse>(
    router.query.id ? `/api/stories/${router.query.id}` : null
  );

  const [deleteMutation, { data: deleteData, loading: deleteLoading }] =
    useMutation(`/api/stories/${router.query.id}/delete`);

  // =====================스토리 삭제 ===================
  const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!deleteLoading) {
      deleteMutation({});
    }
  };

  useEffect(() => {
    if (deleteData?.ok) {
      alert("스토리 삭제가 완료되었습니다.");
      router.push("/community");
    }
  }, [deleteData, router]);

  // ======================= 스토리 수정 ====================
  const onModify = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push(`/community/${router.query.id}/modify`);
  };

  const [storyMutation, { loading: likeLoading }] = useMutation(
    `/api/stories/${router.query.id}/like`
  );
  //  ======================== 스토리 좋아요
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
      // storyMutation({});
    }
  };

  return (
    <>
      {/* 탑 레이아웃 */}
      {storyData && (
        <>
          <TopNav
            menuProps={{
              type: "Story",
              writerId: storyData?.story?.userId,
              onDelete: onDelete,
              onModify: onModify,
            }}
          />
          <div className="pt-16">
            {/* 카테고리 */}
            <span className="ml-4 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              후기
            </span>

            {/* 작성자 프로필 */}
            <Link href={`/users/profile/${storyData?.story.user?.id}`}>
              <div className="mt-4 mb-3 flex cursor-pointer items-center space-x-3 border-b px-4 pb-3">
                {storyData?.story.user?.avatar ? (
                  <div className="relative h-14 w-14">
                    <Image
                      src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${storyData?.story.user?.avatar}/avatar`}
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
                    {storyData?.story.user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    View profile &rarr;
                  </p>
                </div>
              </div>
            </Link>

            {/* 내용 */}
            <div className="mt-2 px-4">
              <div className="py-5">
                <span>{storyData?.story?.content}</span>
              </div>
              <div className="text-xs text-gray-500 ">
                <DateTime date={storyData?.story?.updatedAt} />
              </div>
            </div>

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
                <span>좋아요 {storyData?.story?._count?.likes}</span>
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
                <span>댓글 {storyData?.story?._count?.comments}</span>
              </span>
            </div>

            <Suspense fallback={<Loading />}>
              <Comments />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
};

interface CommentsResponse {
  ok: true;
  story: {
    comments: CommentWithUser[];
  };
}
interface CommentWithUser extends Comment {
  user: User;
}

const Comments = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data: commentsData, mutate } = useSWR<CommentsResponse>(
    router.query.id ? `/api/stories/${router.query.id}/comment` : null
  );
  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(`/api/stories/${router.query.id}/comment`);

  const { register, handleSubmit, reset } = useForm<CommentForm>();
  // ==================댓글 작성======================
  const onValid = (form: CommentForm) => {
    if (commentLoading) return;
    reset();
    mutate((prev: any) => {
      return (
        prev && {
          ...prev,
          story: {
            ...prev.story,
            comments: [
              ...prev.story.comments,
              {
                id: Date.now(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
                comment: form.comment,
                user: { ...user },
              },
            ],
            _count: {
              comments: prev.story._count.comments + 1,
            },
          },
        }
      );
    }, false);

    comment(form);
  };

  const onInvalid = (form: CommentFormError) => {
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

  useEffect(() => {
    if (commentData?.ok && commentData?.deleteComment) {
      // refetch
      mutate();
    }
  }, [commentData, mutate]);

  return (
    <>
      {/* 댓글 리스트 */}
      <div className="py-3">
        {commentsData?.story?.comments.map((comment) => (
          <div
            key={comment?.id}
            className="my-3 flex space-x-3 bg-gray-50 py-3 px-3"
          >
            {comment?.user?.avatar ? (
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
            ) : (
              <div className="h-14 w-14 rounded-full  bg-slate-500" />
            )}
            <div className="flex w-full justify-between">
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  {comment?.user?.name}
                </span>
                <span className="block text-xs text-gray-500 ">
                  <DateTime date={comment?.updatedAt} />
                </span>
                <p className="mt-2 text-gray-700">{comment?.comment}</p>
              </div>

              <Menu
                writerId={comment.userId}
                onDelete={(e) => onDeleteComment(comment.id, e)}
                type="Comment"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 입력칸 */}
      <div className="px-4">
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          <TextArea
            register={register("comment", {
              required: true,
            })}
            name="comment"
            placeholder="댓글을 입력해주세요."
            required
          />
          <Button
            text={commentLoading ? "잠시만 기다려주세요..." : "댓글 달기"}
            color="orange"
            large
          />

          {/* <button
            className={cls(
              commentLoading
                ? "hover:cursor-wait"
                : "hover:cusor-pointer hover:bg-blue-500",
              "my-7 mt-2 w-full rounded-md border border-transparent bg-blue-400 py-3 px-4 text-sm font-medium  text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
          >
            {commentLoading ? "잠시만 기다려주세요..." : "댓글 달기"}
          </button> */}
        </form>
      </div>
    </>
  );
};

const Page: NextPage = () => {
  return (
    <SWRConfig
      value={{
        suspense: true,
      }}
    >
      <CommunityDetail />
    </SWRConfig>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const story = await client.story.findUnique({
//     where: {
//       id: Number(context.query.id),
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           avatar: true,
//         },
//       },

//       _count: {
//         select: {
//           likes: true,
//           comments: true,
//         },
//       },

//       comments: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               avatar: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return {
//     props: {
//       story: JSON.parse(JSON.stringify(story)),
//     },
//   };
// };

// export const getStaticPaths: GetStaticPaths = () => {
//   return {
//     paths: [],
//     fallback: true,
//   };
// };

// export const getStaticProps: GetStaticProps = async (context) => {
//   const story = await client?.story.findFirst({
//     where: {
//       id: Number(context?.params?.id),
//     },
//     include: {
//       user: {
//         select: {
//           avatar: true,
//           name: true,
//         },
//       },
//       _count: {
//         select: {
//           comments: true,
//           likes: true,
//         },
//       },
//       comments: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   });
//   return {
//     props: {
//       story: JSON.parse(JSON.stringify(story)),
//     },
//   };
// };

export default Page;
