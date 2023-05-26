import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Comment, Story, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useEffect } from "react";
import client from "@libs/server/client";
import Image from "next/image";
import useUser from "@libs/client/useUser";
import DateTime from "@components/datetime";

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
interface StorySWRResponse extends Story {
  story: {
    _count: {
      likes: number;
      comments: number;
    };
    user: User;
    comments: CommentsWithUser[];
  };
  isLike: boolean;
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
  comment: Comment;
}

const CommunityDetail: NextPage<{ story: StorySSGResponse }> = ({ story }) => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<CommentForm>();

  const { data, mutate } = useSWR<StorySWRResponse>(
    router.query.id ? `/api/stories/${router.query.id}` : null
  );

  const [storyMutation, { loading: likeLoading }] = useMutation(
    `/api/stories/${router.query.id}/like`
  );

  const [comment, { data: commentData, loading: commentLoading }] =
    useMutation<CommentResponse>(`/api/stories/${router.query.id}/comment`);

  const onValid = (form: CommentForm) => {
    if (commentLoading) return;

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
          },
        }
      );
    }, false);

    reset();
    comment(form);
  };
  const onInvalid = (form: CommentFormError) => {
    if (commentLoading) return;
    console.log(form);
  };

  const onLikeClick = () => {
    if (!data || likeLoading) return;
    mutate(
      {
        ...data,
        story: {
          ...data.story,
          _count: {
            ...data.story._count,
            likes: data.isLike
              ? data.story._count.likes - 1
              : data.story._count.likes + 1,
          },
        },
        isLike: !data.isLike,
      },
      false
    );
    if (!likeLoading) {
      storyMutation({});
    }
  };

  return (
    <Layout canGoBack seoTitle={`${story?.user?.name}님의 스토리`}>
      <div className="pt-2">
        {/* 작성자 프로필 */}
        <span className="ml-4 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          후기
        </span>

        <Link href={`/users/profile/${story?.user?.id}`}>
          <div className="mt-4 mb-3 flex cursor-pointer items-center space-x-3 border-b px-4 pb-3">
            {story?.user?.avatar ? (
              <div className="relative h-14 w-14">
                <Image
                  src={`https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/${story?.user?.avatar}/avatar`}
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
                {story?.user?.name}
              </p>
              <p className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </p>
            </div>
          </div>
        </Link>

        {/* 내용 & 좋아요 & 댓글 */}
        <div>
          {/* 내용 */}
          <div className="mt-2 px-4">
            <div className="py-5">
              <span>{story?.content}</span>
            </div>
            <div className="text-xs text-gray-500 ">
              <DateTime date={story?.updatedAt} />
            </div>
          </div>

          <div className="mt-3 flex w-full justify-start space-x-5 border-t px-4 py-2.5">
            {/* 좋아요 */}
            <button
              onClick={onLikeClick}
              className={cls(
                "flex items-center space-x-2 text-sm",
                data?.isLike ? "text-green-600" : "text-black"
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
              <span>좋아요 {data?.story?._count?.likes}</span>
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
              <span>댓글 {story?._count?.comments}</span>
            </span>
          </div>
        </div>

        {/* 댓글 리스트 */}
        <div className="py-3">
          {data?.story?.comments.map((comment) => (
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
              <div className="flex space-x-5">
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    {comment?.user?.name}
                  </span>
                  <span className="block text-xs text-gray-500 ">
                    <DateTime date={story?.updatedAt} />
                  </span>
                  <p className="mt-2 text-gray-700">{comment?.comment}</p>
                </div>
                <div className="cursor-pointer text-xs">❌</div>
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
            <button className="my-7 mt-2 w-full rounded-md border border-transparent bg-blue-400 py-3 px-4 text-sm font-medium  text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {commentLoading ? "댓글 등록중..." : "댓글 달기"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const story = await client?.story.findFirst({
    where: {
      id: Number(context?.params?.id),
    },
    include: {
      user: {
        select: {
          avatar: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  return {
    props: {
      story: JSON.parse(JSON.stringify(story)),
    },
  };
};

export default CommunityDetail;
